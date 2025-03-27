
/**
 * OsteoWidget - Widget de reservas para Osteopatía
 * Este script permite integrar fácilmente el widget de reservas en cualquier sitio web.
 */
(function() {
  // Namespace principal
  window.OsteoWidget = window.OsteoWidget || {};
  
  // Almacena la configuración
  let config = {
    container: 'osteo-widget',
    theme: 'light',
    lang: 'es',
    apiKey: null,
    serverUrl: window.location.origin, // Por defecto, usa la URL actual
  };
  
  // Estilos básicos para el widget
  const styles = `
    .osteo-widget-container {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      background: white;
      max-width: 100%;
      height: 600px;
      border: 1px solid #e5e7eb;
    }
    
    .osteo-widget-container iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
    
    .osteo-widget-container.dark {
      background: #1f2937;
      border-color: #374151;
    }
    
    .osteo-widget-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #4b5563;
    }
    
    .osteo-widget-loading-spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-left-color: #10b981;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: osteo-spin 1s linear infinite;
    }
    
    @keyframes osteo-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  
  // Inyecta los estilos en la página
  function injectStyles() {
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
  }
  
  // Crea el componente widget
  function createWidget() {
    // Obtener el elemento contenedor
    const container = document.getElementById(config.container);
    if (!container) {
      console.error(`OsteoWidget: No se encontró el contenedor con ID "${config.container}"`);
      return;
    }
    
    // Crear el contenedor del widget
    const widgetContainer = document.createElement('div');
    widgetContainer.className = `osteo-widget-container ${config.theme}`;
    
    // Añadir loader mientras se carga
    const loading = document.createElement('div');
    loading.className = 'osteo-widget-loading';
    loading.innerHTML = '<div class="osteo-widget-loading-spinner"></div>';
    widgetContainer.appendChild(loading);
    
    // Crear y configurar el iframe
    const iframe = document.createElement('iframe');
    
    // Construir la URL con los parámetros de configuración
    let widgetUrl = `${config.serverUrl}/widget?theme=${config.theme}&lang=${config.lang}`;
    
    if (config.apiKey) {
      widgetUrl += `&apiKey=${encodeURIComponent(config.apiKey)}`;
    }
    
    iframe.src = widgetUrl;
    iframe.title = 'Reserva tu cita de osteopatía';
    iframe.style.display = 'none'; // Oculto inicialmente hasta que cargue
    
    // Evento cuando el iframe termina de cargar
    iframe.onload = function() {
      // Ocultar el loader y mostrar el iframe
      loading.style.display = 'none';
      iframe.style.display = 'block';
    };
    
    widgetContainer.appendChild(iframe);
    container.appendChild(widgetContainer);
  }
  
  // Función de inicialización pública
  OsteoWidget.init = function(userConfig) {
    // Mezclar la configuración del usuario con la predeterminada
    config = {...config, ...userConfig};
    
    // Validar configuración
    if (!config.container) {
      console.error('OsteoWidget: Se requiere un ID de contenedor');
      return;
    }
    
    // Inicializar el widget
    injectStyles();
    createWidget();
    
    // Devolver API pública
    return {
      config: {...config}, // Copia de solo lectura
      refresh: createWidget, // Método para actualizar el widget
    };
  };
})();
