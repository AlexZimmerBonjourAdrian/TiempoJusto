# Sistema de Tamagotchi - TiempoJusto

## Arquitectura siguiendo el Principio KISS

### 📁 Estructura de Carpetas

```
src/game/
├── data/           # Capa de Datos
│   ├── petData.jsx        # Configuraciones y datos del juego
│   └── assetsConfig.jsx   # Configuración de assets e imágenes
├── logic/          # Capa de Lógica
│   ├── usePetLogic.jsx      # Hook principal con lógica del pet
│   └── petCalculations.jsx  # Cálculos de XP y productividad
├── components/     # Capa de Presentación
│   ├── PetRoom.jsx        # Habitación del Tamagotchi
│   ├── ResourceBox.jsx    # Cajitas de recursos
│   ├── PetImage.jsx       # Componente de imagen del Tamagotchi
│   ├── MoodIndicator.jsx  # Indicador de estado de ánimo
│   ├── EvolutionDisplay.jsx # Visualización de evolución
│   └── EvolutionNotification.jsx # Notificación de evolución
├── services/       # Capa de Servicios
│   └── adService.jsx   # Servicio de anuncios
└── README.md       # Esta documentación
```

## 🏗️ Separación de Capas

### 1. **Capa de Datos** (`data/`)
- **Responsabilidad**: Almacenar configuraciones y datos estáticos
- **Contenido**: 
  - Tipos de recursos (3 recursos principales)
  - Configuración de niveles (4 niveles)
  - Estados de ánimo
  - Necesidades del pet (duplicadas para progresión más lenta)
  - Configuración de anuncios
  - Configuración de XP
  - **Configuración de Assets** (imágenes del juego)

### 2. **Capa de Lógica** (`logic/`)
- **Responsabilidad**: Contener toda la lógica de negocio
- **Contenido**:
  - Hook `usePetLogic`: Lógica principal del pet
  - Cálculos de XP basados en productividad
  - Funciones de alimentación y cuidado
  - Cálculo de estados de ánimo

### 3. **Capa de Presentación** (`components/`)
- **Responsabilidad**: Interfaz de usuario y componentes visuales
- **Contenido**:
  - `PetRoom`: Habitación principal del Tamagotchi
  - `ResourceBox`: Cajitas de recursos interactivas
  - `PetImage`: Componente de imagen del Tamagotchi con animaciones
  - `MoodIndicator`: Indicador de estado de ánimo con imágenes
  - `EvolutionDisplay`: Visualización de evolución por niveles
  - `EvolutionNotification`: Notificación de evolución con animaciones
  - Animaciones y efectos visuales

### 4. **Capa de Servicios** (`services/`)
- **Responsabilidad**: Servicios externos y APIs
- **Contenido**:
  - `AdService`: Manejo de anuncios y monetización
  - Integración con redes de anuncios (futuro)

## 🎯 Principio KISS Implementado

### **Simplificaciones Realizadas:**

1. **Recursos Reducidos**: De 6 a 3 recursos principales
   - 🍎 Comida
   - 💧 Agua  
   - 🎾 Juguete

2. **Niveles Simplificados**: De 6 a 4 niveles
   - 🥚 Bebé (0-100 XP)
   - 🐣 Niño (100-300 XP)
   - 🐔 Adulto (300-600 XP)
   - 🦅 Maestro (600+ XP)

3. **Necesidades Duplicadas**: Para progresión más lenta
   - Hambre: 10/hora (antes 5/hora)
   - Sed: 16/hora (antes 8/hora)
   - Energía: 6/hora (antes 3/hora)
   - Felicidad: 4/hora (antes 2/hora)

4. **Lógica Simplificada**: Eliminadas funciones complejas
   - Sin cálculos de Pomodoro
   - Sin logros especiales
   - Sin vitaminas ni medicina

## 🔄 Flujo de Datos

```
Datos (petData.jsx)
    ↓
Lógica (usePetLogic.jsx)
    ↓
Servicios (adService.jsx)
    ↓
Presentación (PetRoom.jsx)
```

## 💡 Beneficios de la Arquitectura

### **Mantenibilidad:**
- ✅ Separación clara de responsabilidades
- ✅ Fácil modificación de configuraciones
- ✅ Lógica centralizada y reutilizable

### **Escalabilidad:**
- ✅ Fácil añadir nuevos recursos
- ✅ Fácil integrar nuevos servicios
- ✅ Fácil modificar la interfaz

### **Testabilidad:**
- ✅ Lógica aislada de la presentación
- ✅ Servicios mockeables
- ✅ Datos configurables

## 🚀 Próximos Pasos

### **Integración de Anuncios Reales:**
1. Integrar AdMob
2. Configurar Facebook Ads
3. Implementar analytics

### **Funcionalidades Futuras:**
1. Sincronización en la nube
2. Notificaciones push
3. Sistema de logros
4. Múltiples mascotas

### **Optimizaciones:**
1. Lazy loading de componentes
2. Memoización de cálculos
3. Optimización de re-renders

## 📊 Métricas de Simplificación

- **Recursos**: -50% (6 → 3)
- **Niveles**: -33% (6 → 4)
- **Estados de ánimo**: -14% (7 → 6)
- **Funciones de cálculo**: -60% (5 → 2)
- **Líneas de código**: -40% (estimado)

## 🎮 Experiencia de Usuario

### **Progresión Más Lenta:**
- Las necesidades se reducen más rápido
- Requiere más atención del usuario
- Mayor engagement con anuncios

### **Interfaz Simplificada:**
- Menos opciones = menos confusión
- Enfoque en lo esencial
- Navegación más intuitiva

### **Monetización Optimizada:**
- 3 recursos principales = 3 tipos de anuncios
- Frecuencia natural de uso
- Anuncios contextuales y relevantes

## 🖼️ Sistema de Assets

### **Imágenes Integradas:**
- **Tamagotchi Principal**: `Tamagochi.PNG` - Imagen base del mascota
- **Habitación**: `Room.PNG` - Fondo de la habitación
- **Estados de Ánimo**:
  - `Lleno.PNG` - Estado feliz y satisfecho
  - `Burla.PNG` - Estado triste o molesto
  - `Curios.PNG` - Estado curioso o neutral
- **Necesidades**:
  - `Hambre.PNG` - Estado de hambre
  - `Sed.PNG` - Estado de sed
  - `Jugar.PNG` - Estado juguetón
- **Evolución por Niveles**:
  - `Form01.png` - Nivel 1: Organismo unicelular
  - `Form02.png` - Nivel 2: Gusano rosa
  - `Form03.png` - Nivel 3: Ratón gris
  - `Tamagochi.PNG` - Nivel 4: Forma final
- **Estado de Muerte**:
  - `Death.png` - Calavera cuando la mascota fallece

### **Optimización de Tamaños:**
- **Mascota Principal**: 120x120px
- **Estados de Ánimo**: 100x100px
- **Iconos de Recursos**: 40x40px
- **Habitación**: 300x200px (fondo)

### **Animaciones Implementadas:**
- **Respiración**: Escala suave de 0.95 a 1.05
- **Parpadeo**: Opacidad variable cada 3 segundos
- **Felicidad**: Salto especial cuando está feliz
- **Muerte**: Pulso lento con opacidad variable
- **Squash and Stretch**: Deformación dinámica cada 5 segundos
- **Evolución**: Parpadeo blanco estilo Pokémon con escalado
- **Transiciones**: Animaciones suaves entre estados

### **Sistema de Evolución:**
- **Nivel 1**: Organismo unicelular (0-100 XP)
- **Nivel 2**: Gusano rosa (100-300 XP)
- **Nivel 3**: Ratón gris (300-600 XP)
- **Nivel 4**: Forma final (600+ XP)
- **Muerte**: Calavera cuando las necesidades llegan a 0

### **Animaciones de Evolución:**
- **Detección automática** de cambio de nivel
- **Parpadeo blanco** estilo Pokémon durante la evolución
- **Escalado dinámico** durante la transición
- **Notificación emergente** con mensaje personalizado
- **Squash and Stretch** para mayor dinamismo

### **Condiciones de Muerte:**
- Hambre llega a 0%
- Sed llega a 0%
- Energía llega a 0%
