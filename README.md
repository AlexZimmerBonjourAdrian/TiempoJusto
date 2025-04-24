# Tiempo Justo

Tiempo Justo es una aplicación web diseñada para calcular de manera sencilla las fechas y horas restantes para un evento o tarea específica. Este proyecto es un MVP (Producto Mínimo Viable) que se enfoca en ofrecer una interfaz intuitiva y funcional para gestionar el tiempo de manera eficiente.

## Características principales

- **Cálculo de tiempo restante:** Ingresa una fecha y hora objetivo, y la aplicación calculará cuántas horas y minutos faltan.
- **Descuento de horas:** Permite restar horas específicas para ajustar el tiempo restante.
- **Interfaz amigable:** Diseño simple y fácil de usar, ideal para usuarios que buscan una solución rápida.

## Tecnologías utilizadas

- **React:** Biblioteca de JavaScript para construir la interfaz de usuario.
- **CSS:** Para estilizar la aplicación y mejorar la experiencia del usuario.

## Cómo empezar

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/tiempo-justo.git
   ```
2. Navega al directorio del proyecto:
   ```bash
   cd tiempo-justo
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm start
   ```

## Próximos pasos

- Agregar soporte para múltiples zonas horarias.
- Implementar notificaciones para eventos próximos.
- Mejorar el diseño visual con componentes adicionales.

## Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas o mejoras, no dudes en abrir un issue o enviar un pull request.

## Google Calendar Integration Setup

To enable Google Calendar integration, you need to set the following environment variables:

-   `REACT_APP_GOOGLE_CLIENT_ID`: Your Google Client ID.
-   `REACT_APP_GOOGLE_API_KEY`: Your Google API Key.

You can set these environment variables in your `.env` file or directly in your terminal. For example:

```bash
REACT_APP_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
REACT_APP_GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
```

Remember to replace `YOUR_GOOGLE_CLIENT_ID` and `YOUR_GOOGLE_API_KEY` with your actual credentials.

## Plan para Ampliación de Funcionalidades

### 1. Notificaciones Locales
**Objetivo:** Implementar recordatorios para eventos próximos.

#### Pasos:
1. **Investigar APIs de notificaciones:**
   - Utilizar la API de Notificaciones del navegador para enviar recordatorios locales.
   - Asegurarse de que los permisos de notificación sean solicitados al usuario.

2. **Implementar lógica de notificaciones:**
   - Crear un componente o función que calcule el tiempo restante para un evento.
   - Configurar un temporizador (`setTimeout`) para enviar la notificación cuando el evento esté próximo.

3. **Pruebas:**
   - Verificar que las notificaciones funcionen en diferentes navegadores.
   - Asegurarse de que las notificaciones sean claras y útiles.

4. **Documentación:**
   - Actualizar el README con instrucciones sobre cómo habilitar las notificaciones.

### 2. Personalización Temporal
**Objetivo:** Permitir configuraciones que se mantengan solo durante la sesión del usuario.

#### Pasos:
1. **Definir configuraciones personalizables:**
   - Por ejemplo, colores de fondo, formato de hora (12h/24h), etc.

2. **Implementar almacenamiento en memoria:**
   - Utilizar el estado de React o `sessionStorage` para guardar las configuraciones temporalmente.

3. **Crear una interfaz de configuración:**
   - Agregar un modal o sección en la aplicación donde los usuarios puedan ajustar sus preferencias.

4. **Pruebas:**
   - Verificar que las configuraciones se apliquen correctamente durante la sesión.
   - Asegurarse de que las configuraciones se restablezcan al cerrar la aplicación.

5. **Documentación:**
   - Actualizar el README con detalles sobre las opciones de personalización.

### 3. Cronograma
- **Semana 1:** Investigación y diseño de las funcionalidades.
- **Semana 2:** Implementación de notificaciones locales.
- **Semana 3:** Implementación de personalización temporal.
- **Semana 4:** Pruebas y documentación.

### 4. Recursos Necesarios
- Acceso a documentación de la API de Notificaciones.
- Herramientas de prueba en diferentes navegadores.

### 5. Resultados Esperados
- Los usuarios recibirán recordatorios oportunos para sus eventos.
- Los usuarios podrán personalizar su experiencia durante cada sesión.
```
