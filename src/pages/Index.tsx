
import React from 'react';
import BookingWidget from '@/components/BookingWidget';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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
          <div className="mt-4">
            <Button asChild variant="outline" className="gap-2">
              <Link to="/admin">
                <Settings className="h-4 w-4" />
                Administración
              </Link>
            </Button>
          </div>
        </header>
        
        <div className="w-full animate-fade-in">
          <BookingWidget allowAdmin={false} />
        </div>
        
        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>Este widget es fácilmente integrable en cualquier sitio web.</p>
          <p className="mt-1">© {new Date().getFullYear()} Servicio de Osteopatía - Todos los derechos reservados</p>
          <p className="mt-3">
            <Link to="/integration" className="text-osteo-500 hover:underline">
              Ver cómo integrar este widget en tu web
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
