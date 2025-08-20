# TiempoJusto - Aplicación de Productividad

Una aplicación móvil de gestión de tareas y productividad inspirada en los métodos de Brian Tracy, Jordan Peterson y Carl Jung.

## 🚀 Funcionalidades Principales

### 📋 Tablero de Tareas
- **Sistema de Prioridades Traicy (A-D)**: Clasifica las tareas por importancia
  - **A**: Tareas críticas y urgentes
  - **B**: Tareas importantes pero no urgentes
  - **C**: Tareas que pueden delegarse
  - **D**: Tareas que pueden eliminarse
- **Gestión de Proyectos**: Asocia tareas a proyectos específicos
- **Ordenamiento Inteligente**: Las tareas se ordenan por completadas y prioridad
- **Fecha y Hora en Tiempo Real**: Muestra la fecha y hora actual en el header

### 📊 Panel de Analíticas
- **Estadísticas Diarias**: Recuento de tareas totales y completadas
- **Tasa de Éxito**: Porcentaje de tareas completadas del día
- **Score de Productividad**: Puntuación basada en prioridades completadas
- **Desglose por Prioridad**: Visualización de distribución A-B-C-D
- **Análisis por Proyectos**: Estadísticas de completitud por proyecto
- **Mensajes Motivacionales**: Retroalimentación personalizada según rendimiento
- **Citas Inspiradoras**: Frases de Jordan Peterson, Brian Tracy y Carl Jung

### 📈 Estadísticas Mensuales
- **Progreso a Largo Plazo**: Visualización del progreso mes a mes
- **Selectores de Fecha**: Navegación fácil entre meses y años
- **Estadísticas Principales**: Total, completadas, tasa de éxito y score
- **Progreso Diario**: Últimos 7 días con barras de progreso visuales
- **Progreso Semanal**: Desglose por semanas del mes
- **Desglose por Prioridad**: Distribución A-B-C-D del mes
- **Resumen Mensual**: Promedio diario, mejor día y nivel de productividad
- **Colores Intuitivos**: Verde (excelente), Amarillo (bueno), Naranja (aceptable), Rojo (mejorar)

### 🎯 Notificaciones Motivacionales
- **Automáticas**: Se activan en momentos específicos
  - Al completar tareas importantes (A-B)
  - Cada 30 minutos para recordar productividad
  - Cuando hay muchas tareas pendientes
- **Manuales**: Botón para solicitar motivación
- **Tipos de Notificaciones**:
  - **Productividad**: Enfoque en eficiencia y gestión del tiempo
  - **Motivación**: Inspiración para continuar
  - **Disciplina**: Recordatorios sobre hábitos y responsabilidad
  - **General**: Citas variadas de autores inspiradores

### ⏰ Pomodoro Timer
- **Configuración Personalizable**: Tiempos de enfoque y descanso
- **Integración con Tareas**: Trabaja en conjunto con el tablero

### 📁 Gestión de Proyectos
- **Organización**: Agrupa tareas relacionadas
- **Seguimiento**: Monitorea progreso por proyecto

## 🎨 Características de UX

### Diseño Moderno
- **Tema Oscuro**: Interfaz elegante y fácil para los ojos
- **Animaciones Suaves**: Transiciones fluidas entre componentes
- **Iconografía Intuitiva**: Emojis y símbolos claros

### Interactividad
- **Gestos Táctiles**: Navegación fluida entre pestañas
- **Feedback Visual**: Estados activos e inactivos claros
- **Confirmaciones**: Diálogos para acciones importantes

## 🔧 Tecnologías Utilizadas

- **React Native**: Framework principal
- **Expo**: Plataforma de desarrollo
- **AsyncStorage**: Persistencia de datos local
- **React Native Safe Area**: Manejo de áreas seguras
- **Animated API**: Animaciones nativas

## 📱 Estructura de Archivos

```
src/
├── components/
│   ├── TaskBoard.jsx          # Tablero principal de tareas
│   ├── AnalyticsBoard.jsx     # Panel de estadísticas diarias
│   ├── MonthlyStats.jsx       # Panel de estadísticas mensuales
│   ├── MotivationalNotification.jsx # Notificaciones
│   ├── DateTimeDisplay.jsx    # Reloj en tiempo real
│   ├── PomodoroTimer.jsx      # Temporizador
│   └── ProjectBoard.jsx       # Gestión de proyectos
├── hooks/
│   └── useMotivationalNotifications.jsx # Lógica de notificaciones
└── storage/
    └── index.jsx              # Persistencia de datos
```

## 🎯 Filosofía de Productividad

### Inspirado en:
- **Brian Tracy**: Método ABCDE de priorización
- **Jordan Peterson**: Responsabilidad y propósito
- **Carl Jung**: Autoconocimiento y desarrollo personal

### Principios:
1. **Priorización Inteligente**: Enfócate en lo que realmente importa
2. **Responsabilidad Personal**: Toma control de tu tiempo
3. **Desarrollo Continuo**: Cada tarea es una oportunidad de crecimiento
4. **Consciencia Temporal**: El tiempo es tu recurso más valioso

## 🚀 Instalación y Uso

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar en desarrollo**:
   ```bash
   npx expo start
   ```

3. **Construir para producción**:
   ```bash
   npx expo build:android
   ```

## 📈 Métricas de Productividad

La aplicación calcula un **Score de Productividad** basado en:
- **Tareas A completadas**: +10 puntos
- **Tareas B completadas**: +7 puntos  
- **Tareas C completadas**: +4 puntos
- **Tareas D completadas**: +1 punto

### Niveles de Rendimiento Diario:
- **80+ puntos**: ¡Excelente día!
- **60-79 puntos**: Buen trabajo
- **40-59 puntos**: Día aceptable
- **<40 puntos**: Día difícil, pero cada paso cuenta

### Niveles de Rendimiento Mensual:
- **100+ puntos**: 🏆 Excelente
- **70-99 puntos**: ⭐ Muy Bueno
- **40-69 puntos**: 👍 Bueno
- **<40 puntos**: 🌱 En Progreso

### Indicadores Visuales:
- **🟢 Verde**: Excelente rendimiento (80%+)
- **🟡 Amarillo**: Buen rendimiento (60-79%)
- **🟠 Naranja**: Rendimiento aceptable (40-59%)
- **🔴 Rojo**: Necesita mejorar (<40%)

## 🔮 Próximas Funcionalidades

- [ ] Sincronización en la nube
- [ ] Estadísticas anuales y comparativas
- [ ] Integración con calendario
- [ ] Recordatorios push
- [ ] Modo offline mejorado
- [ ] Temas personalizables
- [ ] Exportación de datos
- [ ] Gráficos interactivos
- [ ] Metas y objetivos mensuales

---

**TiempoJusto** - Transforma tu tiempo en logros significativos ⏰✨
