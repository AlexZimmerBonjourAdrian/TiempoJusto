# Configuración del Icono de TiempoJusto

## Descripción
Este documento describe cómo se configuró el icono de la aplicación TiempoJusto para Android.

## Archivos de Icono

### Icono Original
- **Ubicación**: `assets/Icon/Icon.svg`
- **Descripción**: Icono SVG original con un diseño de reloj/tiempo en color verde (#7ED321)

### Iconos Generados
Los iconos PNG se generaron en diferentes tamaños para Android:

- `assets/icons/icon-48.png` (48x48 px)
- `assets/icons/icon-72.png` (72x72 px)
- `assets/icons/icon-96.png` (96x96 px)
- `assets/icons/icon-144.png` (144x144 px)
- `assets/icons/icon-192.png` (192x192 px)
- `assets/icons/icon-512.png` (512x512 px)
- `assets/icons/icon-1024.png` (1024x1024 px)

## Configuración

### app.config.js
La aplicación está configurada para usar el icono principal de 1024x1024 píxeles:

```javascript
{
  expo: {
    icon: "./assets/icons/icon-1024.png",
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icons/icon-1024.png",
        backgroundColor: "#FFFFFF"
      }
    }
  }
}
```

## Generación de Iconos

### Herramientas Utilizadas
- **svgexport**: Para convertir SVG a PNG
- **Expo CLI**: Para generar los iconos nativos de Android

### Comandos Utilizados
```bash
# Instalar svgexport
npm install -g svgexport

# Convertir SVG a diferentes tamaños
svgexport assets/Icon/Icon.svg assets/icons/icon-1024.png 1024:1024
svgexport assets/Icon/Icon.svg assets/icons/icon-512.png 512:512
# ... (y así para todos los tamaños)

# Generar proyecto Android con iconos
npx expo prebuild --platform android --clean
```

## Estructura de Carpetas Android
Los iconos se generan automáticamente en:
- `android/app/src/main/res/mipmap-*/` - Iconos principales
- `android/app/src/main/res/drawable-*/` - Iconos adaptativos

## Notas Importantes
1. El icono original es un SVG que representa un reloj/tiempo
2. Se usa un fondo blanco (#FFFFFF) para el icono adaptativo de Android
3. Los iconos se generan automáticamente en formato WebP para optimizar el tamaño
4. El proceso de prebuild de Expo maneja automáticamente la generación de todos los tamaños necesarios

## Actualización del Icono
Para actualizar el icono:
1. Reemplazar `assets/Icon/Icon.svg` con el nuevo diseño
2. Regenerar los iconos PNG usando svgexport
3. Ejecutar `npx expo prebuild --platform android --clean`
4. Reconstruir la aplicación
