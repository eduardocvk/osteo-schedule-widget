
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Code, Copy, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const Integration = () => {
  const [isCopied, setIsCopied] = useState(false);
  
  // Obtenemos la URL base actual para usarla en los ejemplos
  const baseUrl = window.location.origin;
  
  const integrationCode = `<div id="osteo-widget"></div>
<script src="${baseUrl}/widget.js"></script>
<script>
  OsteoWidget.init({
    container: 'osteo-widget',
    theme: 'light', // or 'dark'
    lang: 'es',
    apiKey: 'TU_API_KEY'
  });
</script>`;

  const reactCode = `import { useEffect } from 'react';

function OsteoWidget() {
  useEffect(() => {
    // Cargar script
    const script = document.createElement('script');
    script.src = '${baseUrl}/widget.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      window.OsteoWidget.init({
        container: 'osteo-widget',
        theme: 'light', // o 'dark'
        lang: 'es',
        apiKey: 'TU_API_KEY'
      });
    };
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  return <div id="osteo-widget"></div>;
}

export default OsteoWidget;`;

  const iframeCode = `<iframe 
  src="${baseUrl}/widget" 
  width="100%" 
  height="600" 
  frameborder="0"
  title="Reserva tu cita de osteopatía"
></iframe>`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success("Código copiado al portapapeles");
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Code className="h-6 w-6 text-osteo-500" />
              Integración del Widget
            </h1>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Integra fácilmente nuestro widget de reservas de osteopatía en tu sitio web. Las siguientes instrucciones asumen
            que ya has publicado esta aplicación en un dominio accesible.
          </p>
        </header>
        
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Opciones de integración</h2>
          
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <h3 className="font-medium text-amber-800 mb-2">Nota importante</h3>
            <p className="text-sm text-amber-700">
              Para que la integración funcione correctamente, esta aplicación debe estar publicada en un servicio de hosting.
              El archivo <code>widget.js</code> ya está disponible en la carpeta <code>public/</code> de esta aplicación.
            </p>
          </div>
          
          <Tabs defaultValue="script">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="script">Script</TabsTrigger>
              <TabsTrigger value="react">React</TabsTrigger>
              <TabsTrigger value="iframe">iFrame</TabsTrigger>
            </TabsList>
            
            <TabsContent value="script" className="space-y-4">
              <p>
                Añade el siguiente código HTML y JavaScript en la página donde quieras mostrar el widget:
              </p>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 rounded-md p-4 overflow-x-auto text-sm">
                  <code>{integrationCode}</code>
                </pre>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 h-8 w-8 bg-gray-800 hover:bg-gray-700"
                  onClick={() => copyToClipboard(integrationCode)}
                >
                  <Copy className="h-4 w-4 text-gray-200" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="react" className="space-y-4">
              <p>
                Si estás usando React, puedes integrar el widget con este componente:
              </p>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 rounded-md p-4 overflow-x-auto text-sm">
                  <code>{reactCode}</code>
                </pre>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 h-8 w-8 bg-gray-800 hover:bg-gray-700"
                  onClick={() => copyToClipboard(reactCode)}
                >
                  <Copy className="h-4 w-4 text-gray-200" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="iframe" className="space-y-4">
              <p>
                Para una integración simple, puedes usar un iframe:
              </p>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 rounded-md p-4 overflow-x-auto text-sm">
                  <code>{iframeCode}</code>
                </pre>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 h-8 w-8 bg-gray-800 hover:bg-gray-700"
                  onClick={() => copyToClipboard(iframeCode)}
                >
                  <Copy className="h-4 w-4 text-gray-200" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">El archivo widget.js</h2>
          <p className="mb-4">
            Para integrar el widget en tu sitio web, necesitas acceder al archivo <code>widget.js</code> que ya se encuentra disponible en esta aplicación.
          </p>
          
          <div className="p-4 bg-gray-50 rounded-md mb-4">
            <h3 className="font-medium mb-2">¿Cómo usar widget.js?</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>La URL del widget será <code>{baseUrl}/widget.js</code></li>
              <li>Puedes acceder directamente a este archivo desde tu sitio web</li>
              <li>El widget se comunicará automáticamente con esta aplicación para realizar las reservas</li>
            </ol>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-md mb-4">
            <h3 className="font-medium mb-2">Ejemplo de implementación</h3>
            <pre className="bg-gray-800 text-gray-200 p-3 rounded text-sm">
{`// En tu sitio web
<div id="osteo-widget"></div>
<script src="${baseUrl}/widget.js"></script>
<script>
  OsteoWidget.init({
    container: 'osteo-widget',
    theme: 'light',
    lang: 'es'
  });
</script>`}
            </pre>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md mt-6">
            <h3 className="font-medium text-blue-800 mb-2">Parámetros de configuración</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
              <li><strong>container</strong>: ID del elemento donde se mostrará el widget (obligatorio)</li>
              <li><strong>theme</strong>: 'light' o 'dark' (opcional, por defecto 'light')</li>
              <li><strong>lang</strong>: idioma del widget, 'es' o 'en' (opcional, por defecto 'es')</li>
              <li><strong>apiKey</strong>: Tu clave API si utilizas la autenticación (opcional)</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Button asChild className="bg-osteo-500 hover:bg-osteo-600">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a la página principal
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Integration;
