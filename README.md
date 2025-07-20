# 🚀 Cómete esos sapos: Productividad Inteligente

Una aplicación web moderna y eficiente para gestionar tu tiempo con propósito y claridad, enfocada en maximizar tu productividad personal y profesional.

## ✨ Características Principales

### 🎯 **Enfoque en Productividad**
- **Gestión de Tareas Inteligente**: Sistema de priorización A-B-C-D con límite de 8 tareas para mantener el foco
- **Gestión de Proyectos Ágil**: Metodología ágil con sprints, seguimiento de progreso y gestión de equipos
- **Técnica Pomodoro Integrada**: Timer de productividad con sesiones personalizables
- **Analytics Avanzados**: Seguimiento detallado de tu progreso y productividad

### 💾 **Sistema de Guardado Mejorado**
- **Guardado Automático**: Los datos se guardan automáticamente cada segundo
- **Respaldo Inteligente**: Sistema de respaldo en localStorage si fallan las cookies
- **Sincronización entre Pestañas**: Cambios sincronizados automáticamente
- **Indicadores de Estado**: Sabrás siempre cuándo se están guardando tus datos
- **Reintentos Automáticos**: Sistema robusto con reintentos en caso de errores

### 🧠 **Modos de Productividad**
- **Modo ADHD**: Interfaz simplificada con gamificación y recordatorios
- **Modo Focus**: Enfoque en tareas prioritarias con distracciones minimizadas
- **Modo Minimal**: Interfaz limpia para máxima concentración
- **Modo Default**: Experiencia completa con todas las herramientas

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18
- **UI Components**: PrimeReact
- **Estilos**: CSS Modules, CSS-in-JS
- **Almacenamiento**: Cookies + localStorage (respaldo)
- **Notificaciones**: Web Notifications API
- **Despliegue**: Netlify

## 🚀 Instalación y Uso

### Requisitos Previos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/tiempo-justo.git
cd tiempo-justo

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

### Variables de Entorno
```env
# Opcional: Configurar para notificaciones push
NEXT_PUBLIC_VAPID_PUBLIC_KEY=tu_vapid_public_key
```

## 📱 Características por Sección

### 🏠 **Inicio**
- Dashboard personalizado con resumen de productividad
- Acceso rápido a herramientas principales
- Motivación diaria y citas inspiradoras

### 📋 **Tareas**
- Sistema de priorización A-B-C-D
- Límite de 8 tareas para mantener el foco
- Vista Kanban y lista
- Cierre diario automático a medianoche
- Gamificación con puntos (modo ADHD)

### 📁 **Proyectos**
- Gestión ágil con sprints
- Seguimiento de progreso y velocidad
- Gestión de equipos y presupuestos
- Vista Kanban, lista y timeline
- Métricas de proyecto en tiempo real

### ⏰ **Pomodoro**
- Timer personalizable (25/5, 50/10, etc.)
- Sesiones largas y cortas
- Estadísticas de sesiones
- Integración con tareas

### 📊 **Analytics**
- Progreso diario, semanal y mensual
- Gráficos de productividad
- Análisis de tendencias
- Citas motivacionales personalizadas

### 💾 **Gestión de Datos**
- Exportación/importación de datos
- Respaldo automático
- Validación de datos
- Estadísticas de almacenamiento

## 🎨 Personalización

### Modos de Productividad
```javascript
// Configurar modo ADHD
Cookies.set('hasADHD', true, { expires: 365 });

// Configurar modo de productividad
Cookies.set('productivityMode', 'focus', { expires: 365 });
```

### Configuración de Guardado
```javascript
// El sistema de guardado automático se configura automáticamente
// pero puedes personalizar el comportamiento:

const { saveData, loadData } = useAutoSave('miClave', misDatos, {
  delay: 1000, // Delay en ms
  maxRetries: 3, // Reintentos máximos
  onSaveSuccess: () => console.log('Guardado exitoso'),
  onSaveError: (error) => console.error('Error al guardar:', error)
});
```

## 🔧 Desarrollo

### Estructura del Proyecto
```
src/
├── app/                 # Páginas de Next.js
├── components/          # Componentes React
│   ├── features/       # Características principales
│   ├── layout/         # Componentes de layout
│   └── ui/            # Componentes de UI
├── hooks/              # Hooks personalizados
├── utils/              # Utilidades
├── constants/          # Constantes
└── styles/            # Estilos globales
```

### Hooks Personalizados
- `useAutoSave`: Guardado automático con respaldo
- `useDataSync`: Sincronización entre pestañas
- `useProductivityMode`: Gestión de modos de productividad

### Sistema de Guardado
El sistema utiliza un enfoque híbrido:
1. **Cookies primarias**: Almacenamiento principal
2. **localStorage de respaldo**: Si fallan las cookies
3. **Sincronización automática**: Entre pestañas del navegador
4. **Reintentos inteligentes**: En caso de errores de red

## 🚀 Despliegue

### Netlify
```bash
# El proyecto está configurado para Netlify
# Solo necesitas conectar tu repositorio
```

### Variables de Entorno en Producción
```env
NEXT_PUBLIC_APP_URL=https://tu-app.netlify.app
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **Brian Tracy**: Por la filosofía "Cómete esa rana"
- **Jordan Peterson**: Por las citas motivacionales
- **Comunidad de desarrolladores**: Por las herramientas y librerías utilizadas

---

**¡Construye tu productividad, un día a la vez! 🚀**
