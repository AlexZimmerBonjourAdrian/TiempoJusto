// ============================================================================
// TIPOS DE ANALÍTICAS - TIEMPOJUSTO
// ============================================================================

import { TaskPriority, TaskStatus, ProjectStatus } from './index';

// ============================================================================
// TIPOS PRINCIPALES DE ANALÍTICAS
// ============================================================================

export interface AnalyticsData {
  date: Date;
  tasks: TaskAnalytics;
  projects: ProjectAnalytics;
  pomodoro: PomodoroAnalytics;
  productivity: ProductivityAnalytics;
}

// ============================================================================
// TIPOS DE ANALÍTICAS DE TAREAS
// ============================================================================

export interface TaskAnalytics {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  cancelled: number;
  completionRate: number;
  averageCompletionTime: number; // minutos
  priorityDistribution: Record<TaskPriority, number>;
  statusDistribution: Record<TaskStatus, number>;
  dailyCompletion: number;
  weeklyCompletion: number;
  monthlyCompletion: number;
  productivityScore: number; // 0-100
}

// ============================================================================
// TIPOS DE ANALÍTICAS DE PROYECTOS
// ============================================================================

export interface ProjectAnalytics {
  total: number;
  active: number;
  completed: number;
  paused: number;
  archived: number;
  averageProgress: number; // 0-100
  totalEstimatedHours: number;
  totalActualHours: number;
  completionRate: number;
  averageCompletionTime: number; // días
  statusDistribution: Record<ProjectStatus, number>;
  progressDistribution: {
    '0-25': number;
    '26-50': number;
    '51-75': number;
    '76-100': number;
  };
}

// ============================================================================
// TIPOS DE ANALÍTICAS DE POMODORO
// ============================================================================

export interface PomodoroAnalytics {
  totalSessions: number;
  completedSessions: number;
  totalWorkTime: number; // minutos
  totalBreakTime: number; // minutos
  averageSessionLength: number; // minutos
  longestSession: number; // minutos
  dailySessions: number;
  weeklySessions: number;
  monthlySessions: number;
  productivityScore: number; // 0-100
  consistencyScore: number; // 0-100
  focusScore: number; // 0-100
  averageCyclesPerDay: number;
  bestDay: string;
  bestWeek: string;
  bestMonth: string;
}

// ============================================================================
// TIPOS DE ANALÍTICAS DE PRODUCTIVIDAD
// ============================================================================

export interface ProductivityAnalytics {
  overallScore: number; // 0-100
  dailyScore: number; // 0-100
  weeklyScore: number; // 0-100
  monthlyScore: number; // 0-100
  trend: 'up' | 'down' | 'stable';
  improvementRate: number; // porcentaje
  consistencyScore: number; // 0-100
  efficiencyScore: number; // 0-100
  focusScore: number; // 0-100
  balanceScore: number; // 0-100
  peakHours: number[]; // horas del día (0-23)
  peakDays: number[]; // días de la semana (0-6)
  productivityPatterns: ProductivityPattern[];
}

// ============================================================================
// TIPOS DE PATRONES DE PRODUCTIVIDAD
// ============================================================================

export interface ProductivityPattern {
  type: 'daily' | 'weekly' | 'monthly' | 'seasonal';
  pattern: string;
  description: string;
  confidence: number; // 0-100
  recommendations: string[];
}

// ============================================================================
// TIPOS DE MÉTRICAS TEMPORALES
// ============================================================================

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
  metadata?: Record<string, any>;
}

export interface TimeRange {
  start: Date;
  end: Date;
  type: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

// ============================================================================
// TIPOS DE COMPARATIVAS
// ============================================================================

export interface ComparisonData {
  current: number;
  previous: number;
  change: number; // porcentaje
  trend: 'up' | 'down' | 'stable';
  significance: 'low' | 'medium' | 'high';
}

export interface PeriodComparison {
  period: string;
  current: AnalyticsData;
  previous: AnalyticsData;
  comparison: {
    tasks: ComparisonData;
    projects: ComparisonData;
    pomodoro: ComparisonData;
    productivity: ComparisonData;
  };
}

// ============================================================================
// TIPOS DE HOOKS DE ANALÍTICAS
// ============================================================================

export interface UseAnalyticsReturn {
  data: AnalyticsData;
  loading: boolean;
  error: string | null;
  getDataByDate: (date: Date) => Promise<AnalyticsData>;
  getDataByRange: (range: TimeRange) => Promise<AnalyticsData[]>;
  getComparison: (current: Date, previous: Date) => Promise<PeriodComparison>;
  getTrends: (range: TimeRange) => Promise<TimeSeriesData[]>;
  getProductivityPatterns: () => Promise<ProductivityPattern[]>;
  exportData: (range: TimeRange) => Promise<AnalyticsData[]>;
  refreshData: () => Promise<void>;
}

// ============================================================================
// TIPOS DE CONFIGURACIÓN DE ANALÍTICAS
// ============================================================================

export interface AnalyticsConfig {
  autoRefresh: boolean;
  refreshInterval: number; // minutos
  dataRetentionDays: number;
  enableTrends: boolean;
  enablePatterns: boolean;
  enableComparisons: boolean;
  exportFormat: 'json' | 'csv' | 'pdf';
}

// ============================================================================
// TIPOS DE REPORTES
// ============================================================================

export interface AnalyticsReport {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  dateRange: TimeRange;
  data: AnalyticsData;
  insights: string[];
  recommendations: string[];
  generatedAt: Date;
  version: string;
}

// ============================================================================
// TIPOS DE DASHBOARD
// ============================================================================

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'list' | 'progress';
  title: string;
  data: any;
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, any>;
}

export interface Dashboard {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  layout: 'grid' | 'list' | 'custom';
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}
