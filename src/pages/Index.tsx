
import React from 'react';
import BookingWidget from '@/components/BookingWidget';
import AdminSettings from '@/components/AdminSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Settings } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Sistema de Reservas para Osteopatía
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Reserva tu cita de manera rápida y sencilla. Selecciona fecha, hora y completa tus datos.
          </p>
        </header>
        
        <Tabs defaultValue="booking" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-10">
            <TabsTrigger value="booking" className="text-base flex items-center justify-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>Reservar Cita</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="text-base flex items-center justify-center gap-2">
              <Settings className="h-5 w-5" />
              <span>Administración</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="booking" className="mt-0 animate-fade-in">
            <BookingWidget allowAdmin={false} />
          </TabsContent>
          
          <TabsContent value="admin" className="mt-0 animate-fade-in">
            <AdminSettings />
          </TabsContent>
        </Tabs>
        
        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>Este widget es fácilmente integrable en cualquier sitio web.</p>
          <p className="mt-1">© {new Date().getFullYear()} Servicio de Osteopatía - Todos los derechos reservados</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
