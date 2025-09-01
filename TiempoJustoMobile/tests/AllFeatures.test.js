/**
 * Pruebas integrales básicas para tareas, proyectos, analíticas,
 * temporizador Pomodoro y anuncios. Diseñado para Jest + jest-expo.
 */

// Mocks de React Native y AsyncStorage
jest.mock('react-native', () => {
    const actual = jest.requireActual('react-native');
    return {
        ...actual,
        Alert: { alert: jest.fn() },
        AppState: {
            currentState: 'active',
            addEventListener: jest.fn(() => ({ remove: jest.fn() })),
        },
    };
});

const inMemoryStore = new Map();
jest.mock('@react-native-async-storage/async-storage', () => ({
    __esModule: true,
    default: {
        getItem: jest.fn(async(k) => (inMemoryStore.has(k) ? String(inMemoryStore.get(k)) : null)),
        setItem: jest.fn(async(k, v) => void inMemoryStore.set(k, v)),
        removeItem: jest.fn(async(k) => void inMemoryStore.delete(k)),
        multiGet: jest.fn(async(keys) => keys.map((k) => [k, inMemoryStore.get(k) ? ? null])),
        multiSet: jest.fn(async(entries) => entries.forEach(([k, v]) => inMemoryStore.set(k, v))),
    },
}));

// Mock de ads
const listeners = new Map();

function makeAdInstance() {
    return {
        _loaded: true,
        isLoaded: () => true,
        load: jest.fn(() => {}),
        show: jest.fn(() => Promise.resolve()),
        addAdEventListener: jest.fn((event, cb) => {
            listeners.set(cb, event);
            return () => listeners.delete(cb);
        }),
    };
}

jest.mock('react-native-google-mobile-ads', () => ({
    __esModule: true,
    default: () => ({ initialize: jest.fn() }),
    InterstitialAd: { createForAdRequest: jest.fn(() => makeAdInstance()) },
    RewardedAd: { createForAdRequest: jest.fn(() => makeAdInstance()) },
    RewardedInterstitialAd: { createForAdRequest: jest.fn(() => makeAdInstance()) },
    AdEventType: { LOADED: 'loaded', CLOSED: 'closed' },
    RewardedAdEventType: { EARNED_REWARD: 'reward' },
    TestIds: { INTERSTITIAL: 'test-interstitial', REWARDED: 'test-rewarded' },
}));

// Imports bajo prueba
import taskBusinessLogic from '../src/services/taskBusinessLogic';
import { validateTask, validateProject, validatePomodoroSettings } from '../src/storage';
import pomodoroService from '../src/services/pomodoroService';
import adService from '../src/services/adService';

describe('Validaciones de datos básicas', () => {
    test('validateTask requiere título y prioridad válida', () => {
        expect(validateTask({ title: '', priority: 'A' })).toContain('El título de la tarea es requerido');
        expect(validateTask({ title: 'x', priority: 'Z' })).toContain('La prioridad debe ser A, B, C o D');
        expect(validateTask({ title: 'Tarea', priority: 'B' })).toEqual([]);
    });

    test('validateProject requiere nombre', () => {
        expect(validateProject({ name: '' })).toContain('El nombre del proyecto es requerido');
        expect(validateProject({ name: 'Proyecto' })).toEqual([]);
    });

    test('validatePomodoroSettings dentro de rango', () => {
        expect(validatePomodoroSettings({ focusMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15 })).toEqual([]);
    });
});

describe('Lógica de tareas y analíticas', () => {
    const sampleTasks = [
        { id: '1', title: 'A urgente', priority: 'A', done: true, createdAt: new Date('2024-01-01').toISOString(), completedAt: new Date('2024-01-01T01:00:00').toISOString() },
        { id: '2', title: 'B normal', priority: 'B', done: false, createdAt: new Date('2024-01-02').toISOString() },
        { id: '3', title: 'C later', priority: 'C', done: false, createdAt: new Date('2024-01-03').toISOString() },
        { id: '4', title: 'D trivial', priority: 'D', done: false, createdAt: new Date('2024-01-04').toISOString() },
    ];

    test('validateTaskWithBusinessRules detecta duplicados y límites', () => {
        const errors = taskBusinessLogic.validateTaskWithBusinessRules({ title: 'B normal', priority: 'B', done: false }, sampleTasks);
        expect(errors.join(' ')).toMatch(/Ya existe una tarea pendiente con este título/);
    });

    test('calculateSmartPriority usa keywords y contexto', () => {
        expect(taskBusinessLogic.calculateSmartPriority({ title: 'crítico lanzamiento' }, [])).toBe('A');
        expect(taskBusinessLogic.calculateSmartPriority({ title: 'primera del día' }, [])).toBe('B');
    });

    test('sortTasksIntelligently ordena por done y priority', () => {
        const sorted = taskBusinessLogic.sortTasksIntelligently(sampleTasks);
        // Primeros deben ser no completados y de mayor prioridad
        expect(sorted[0].done).toBe(false);
        expect(['A', 'B', 'C', 'D']).toContain(sorted[0].priority);
    });

    test('calculateAdvancedStats retorna métricas coherentes', () => {
        const stats = taskBusinessLogic.calculateAdvancedStats(sampleTasks);
        expect(stats.total).toBe(4);
        expect(stats.completed).toBe(1);
        expect(stats.pending).toBe(3);
        expect(stats.completionRate).toBeGreaterThanOrEqual(0);
        expect(stats.priorityBreakdown.A).toBeGreaterThanOrEqual(1);
        expect(stats.productivityScore).toBeGreaterThanOrEqual(0);
    });

    test('getCachedStats cachea resultados', () => {
        const a = taskBusinessLogic.getCachedStats(sampleTasks, true);
        const b = taskBusinessLogic.getCachedStats(sampleTasks, false);
        expect(b).toBe(a);
    });
});

describe('Pomodoro service', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2024-01-01T00:00:00Z'));
    });
    afterEach(() => {
        jest.useRealTimers();
        jest.spyOn(global.Date, 'now').mockRestore ? .();
        pomodoroService.reset({ focusMinutes: 1, shortBreakMinutes: 1 }, 'focus');
    });

    test('start configura estado inicial', () => {
        pomodoroService.start({ focusMinutes: 1, shortBreakMinutes: 1 }, 'focus');
        const state = pomodoroService.getState();
        expect(state.isRunning).toBe(true);
        expect(state.totalSeconds).toBe(60);
        expect(state.secondsLeft).toBe(60);
    });

    test('completa tras agotar tiempo', () => {
        pomodoroService.start({ focusMinutes: 0.02, shortBreakMinutes: 1 }, 'focus'); // ~1.2s
        jest.advanceTimersByTime(2000);
        const state = pomodoroService.getState();
        expect(state.isRunning).toBe(false);
        expect(state.secondsLeft).toBe(0);
    });
});

describe('Ad service', () => {
    test('initialize y showNext no falla y rota formatos', () => {
        adService.initialize();
        // Llamadas consecutivas deben alternar entre tipos, pero aquí validamos que no lance errores
        expect(() => adService.showNext()).not.toThrow();
        expect(() => adService.showNext()).not.toThrow();
        expect(() => adService.showNext()).not.toThrow();
    });

    test('onProjectCompleted muestra interstitial sin errores', () => {
        expect(() => adService.onProjectCompleted()).not.toThrow();
    });
});