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
- **EAS Build**: Sistema de builds en la nube
- **AsyncStorage**: Persistencia de datos local
- **React Native Safe Area**: Manejo de áreas seguras
- **Animated API**: Animaciones nativas
- **Expo Dev Client**: Cliente de desarrollo para testing

## 📱 Estructura de Archivos

```
TiempoJustoMobile/
├── app.json                 # Configuración de Expo y EAS
├── eas.json                 # Configuración de builds EAS
├── package.json             # Dependencias y scripts
├── src/
│   ├── components/
│   │   ├── TaskBoard.jsx          # Tablero principal de tareas
│   │   ├── AnalyticsBoard.jsx     # Panel de estadísticas diarias
│   │   ├── MonthlyStats.jsx       # Panel de estadísticas mensuales
│   │   ├── MotivationalNotification.jsx # Notificaciones
│   │   ├── DateTimeDisplay.jsx    # Reloj en tiempo real
│   │   ├── PomodoroTimer.jsx      # Temporizador
│   │   └── ProjectBoard.jsx       # Gestión de proyectos
│   ├── hooks/
│   │   └── useMotivationalNotifications.jsx # Lógica de notificaciones
│   └── storage/
│       └── index.jsx              # Persistencia de datos
└── assets/                  # Iconos y recursos
```

## 🚀 Configuración de Builds y Despliegue

### 📦 Instalación de Herramientas de Build

```bash
# Instalar EAS CLI globalmente
npm install -g eas-cli

# Iniciar sesión en Expo
eas login

# Configurar EAS Build para el proyecto
eas build:configure
```

### 🔧 Scripts de Build Disponibles

```bash
# Desarrollo local
npm start                    # Iniciar servidor de desarrollo
npm run android             # Ejecutar en emulador/dispositivo Android

# Builds con EAS
npm run build:dev           # Build de desarrollo (con expo-dev-client)
npm run build:preview       # Build de preview (APK para testing)
npm run build:prod          # Build de producción (APK optimizado)
npm run build:all           # Build para todas las plataformas
```

### 📱 Creación de APKs

#### Build de Desarrollo
```bash
npm run build:dev
```
- **Propósito**: Testing y desarrollo
- **Características**: Incluye expo-dev-client para debugging
- **Tamaño**: ~137MB
- **Uso**: Para desarrollo y testing interno

#### Build de Producción
```bash
npm run build:prod
```
- **Propósito**: Versión final para distribución
- **Características**: Optimizado, sin herramientas de desarrollo
- **Tamaño**: ~62MB
- **Uso**: Para distribución a usuarios finales

### 📥 Descarga de APKs

Los APKs se pueden descargar desde:
- **Dashboard de Expo**: https://expo.dev/accounts/alexzimmer2/projects/tiempo-justo-mobile
- **Comando directo**: `eas build:list` para ver builds disponibles
- **Descarga automática**: Los builds se descargan automáticamente al completarse

### 🔐 Configuración de Credenciales

El proyecto está configurado con:
- **Keystore remoto**: Generado automáticamente por EAS
- **Project ID**: `8da8dceb-16a5-40da-83cb-3af3b97e0c12`
- **Package Name**: `com.tiempojusto.app`

### 📋 Archivos de Configuración

#### `eas.json`
```json
{
  "cli": {
    "version": ">= 16.17.4",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true,
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

#### `app.json`
```json
{
  "expo": {
    "name": "TiempoJusto",
    "slug": "tiempo-justo-mobile",
    "version": "0.1.0",
    "platforms": ["android"],
    "android": {
      "package": "com.tiempojusto.app",
      "versionCode": 1
    },
    "extra": {
      "eas": {
        "projectId": "8da8dceb-16a5-40da-83cb-3af3b97e0c12"
      }
    }
  }
}
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

### Requisitos Previos
- Node.js (v18 o superior)
- npm o yarn
- Cuenta de Expo (gratuita)
- EAS CLI instalado

### Pasos de Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone <repository-url>
   cd TiempoJustoMobile
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar EAS Build**:
   ```bash
   npm install -g eas-cli
   eas login
   eas build:configure
   ```

4. **Ejecutar en desarrollo**:
   ```bash
   npm start
   ```

### 🏗️ Proceso de Build Completo

1. **Desarrollo**:
   ```bash
   npm run build:dev
   ```

2. **Testing**:
   ```bash
   npm run build:preview
   ```

3. **Producción**:
   ```bash
   npm run build:prod
   ```

4. **Instalación en dispositivo**:
   - Descargar APK desde el dashboard de Expo
   - Transferir a dispositivo Android
   - Habilitar "Fuentes desconocidas" en configuración
   - Instalar APK

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
- [ ] Builds automáticos con GitHub Actions
- [ ] Distribución en Google Play Store

## 🛠️ Solución de Problemas

### Problemas Comunes de Build

1. **Error de Git**: Si no tienes Git instalado, usa:
   ```bash
   $env:EAS_NO_VCS=1; eas build:configure
   ```

2. **Error de credenciales**: Verifica tu login con:
   ```bash
   eas login
   ```

3. **Build fallido**: Revisa los logs en:
   https://expo.dev/accounts/alexzimmer2/projects/tiempo-justo-mobile

### Comandos Útiles

```bash
# Ver builds disponibles
eas build:list

# Ver logs de un build específico
eas build:view

# Limpiar cache
npm start -- --clear

# Verificar configuración
eas build:configure
```

---

**TiempoJusto** - Transforma tu tiempo en logros significativos ⏰✨

*Configurado con EAS Build para builds profesionales y distribución eficiente.*
