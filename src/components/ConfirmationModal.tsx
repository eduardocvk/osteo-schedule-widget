
import React from 'react';
import { useBooking } from '../context/BookingContext';
import { formatFullDateTime } from '../utils/dateUtils';
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Calendar, User, Phone, Mail, ClipboardEdit, CheckCircle, Loader } from 'lucide-react';

const ConfirmationModal: React.FC = () => {
  const {
    isConfirmationOpen,
    closeConfirmation,
    formData,
    selectedDate,
    selectedTimeSlot,
    availableDays,
    completeBooking,
    isLoading,
    isBookingComplete
  } = useBooking();
  
  const timeSlotInfo = selectedTimeSlot && selectedDate
    ? availableDays
      .find(day => day.date.toDateString() === selectedDate.toDateString())
      ?.timeSlots.find(slot => slot.id === selectedTimeSlot)
    : null;
  
  if (!selectedDate || !selectedTimeSlot || !timeSlotInfo) {
    return null;
  }
  
  return (
    <Dialog open={isConfirmationOpen} onOpenChange={closeConfirmation}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar tu cita</DialogTitle>
          <DialogDescription>
            Revisa los detalles antes de confirmar tu reserva
          </DialogDescription>
        </DialogHeader>
        
        {isBookingComplete ? (
          <div className="py-6 flex flex-col items-center text-center">
            <div className="mb-4 text-green-500">
              <CheckCircle className="h-16 w-16" />
            </div>
            <h3 className="text-xl font-semibold mb-2">¡Reserva completada!</h3>
            <p className="text-gray-600">
              Tu cita ha sido programada correctamente. Hemos enviado un correo de confirmación a {formData.email}.
            </p>
          </div>
        ) : (
          <div className="py-4">
            <div className="mb-4 p-3 bg-osteo-50 rounded-lg text-osteo-800">
              <div className="flex items-center gap-1.5 mb-1 font-medium">
                <Calendar className="h-4 w-4 text-osteo-500" />
                <h3>Fecha y hora</h3>
              </div>
              <p className="text-sm">
                {formatFullDateTime(selectedDate, timeSlotInfo.time)}
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 mt-0.5 text-osteo-500" />
                <div>
                  <h4 className="text-sm font-medium">Nombre</h4>
                  <p className="text-sm text-gray-600">{formData.name}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-osteo-500" />
                <div>
                  <h4 className="text-sm font-medium">Teléfono</h4>
                  <p className="text-sm text-gray-600">{formData.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-osteo-500" />
                <div>
                  <h4 className="text-sm font-medium">Email</h4>
                  <p className="text-sm text-gray-600">{formData.email}</p>
                </div>
              </div>
              
              {formData.notes && (
                <div className="flex items-start gap-2">
                  <ClipboardEdit className="h-4 w-4 mt-0.5 text-osteo-500" />
                  <div>
                    <h4 className="text-sm font-medium">Observaciones</h4>
                    <p className="text-sm text-gray-600">{formData.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        <DialogFooter>
          {!isBookingComplete && (
            <>
              <Button 
                type="button" 
                variant="outline" 
                onClick={closeConfirmation}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button 
                onClick={completeBooking}
                disabled={isLoading}
                className="bg-osteo-500 hover:bg-osteo-600 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  'Confirmar cita'
                )}
              </Button>
            </>
          )}
          
          {isBookingComplete && (
            <Button 
              onClick={closeConfirmation}
              className="bg-osteo-500 hover:bg-osteo-600 text-white"
            >
              Cerrar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
