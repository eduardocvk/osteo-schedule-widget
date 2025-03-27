
import React, { useState, useEffect } from 'react';
import { BookingProvider, useBooking } from '../context/BookingContext';
import CalendarView from './CalendarView';
import BookingForm from './BookingForm';
import ConfirmationModal from './ConfirmationModal';
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, ArrowLeft } from 'lucide-react';

const BookingSteps: React.FC = () => {
  const { 
    bookingStep, 
    isBookingComplete, 
    resetBooking 
  } = useBooking();
  
  return (
    <div className="glass-card w-full max-w-xl mx-auto overflow-hidden">
      {!isBookingComplete ? (
        <>
          <header className="border-b border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-osteo-500" />
                Reserva tu cita
              </h2>
              
              <div className="flex items-center space-x-1.5">
                <div className={`h-2.5 w-2.5 rounded-full ${bookingStep >= 1 ? 'bg-osteo-500' : 'bg-gray-300'}`}></div>
                <div className={`h-2.5 w-2.5 rounded-full ${bookingStep >= 2 ? 'bg-osteo-500' : 'bg-gray-300'}`}></div>
              </div>
            </div>
          </header>
          
          <div className="min-h-[400px]">
            {bookingStep === 1 && <CalendarView />}
            {bookingStep === 2 && <BookingForm />}
          </div>
        </>
      ) : (
        <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="mb-6 text-green-500">
            <CheckCircle2 className="h-16 w-16" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">¡Reserva completada!</h2>
          <p className="text-gray-600 mb-6 max-w-md">
            Tu cita ha sido programada correctamente. Hemos enviado un correo de confirmación con todos los detalles.
          </p>
          <Button 
            onClick={resetBooking}
            className="bg-osteo-500 hover:bg-osteo-600 text-white flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Realizar otra reserva
          </Button>
        </div>
      )}
      
      <ConfirmationModal />
    </div>
  );
};

interface BookingWidgetProps {
  allowAdmin?: boolean;
}

const BookingWidget: React.FC<BookingWidgetProps> = ({ allowAdmin = false }) => {
  const [showAdmin, setShowAdmin] = useState(false);
  
  // Estado para controlar la animación de entrada
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Activar la animación después de montar el componente
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <BookingProvider>
      <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <BookingSteps />
        
        {allowAdmin && (
          <div className="mt-4 text-center">
            <button 
              onClick={() => setShowAdmin(!showAdmin)} 
              className="text-osteo-500 text-sm hover:text-osteo-700 transition-colors"
            >
              {showAdmin ? 'Ocultar panel de administración' : 'Mostrar panel de administración'}
            </button>
          </div>
        )}
      </div>
    </BookingProvider>
  );
};

export default BookingWidget;
