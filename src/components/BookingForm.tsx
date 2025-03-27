
import React from 'react';
import { useBooking } from '../context/BookingContext';
import { formatFullDateTime } from '../utils/dateUtils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, User, Phone, Mail, ClipboardEdit } from 'lucide-react';

const BookingForm: React.FC = () => {
  const {
    formData,
    updateFormData,
    selectedDate,
    selectedTimeSlot,
    availableDays,
    goToPreviousStep,
    openConfirmation
  } = useBooking();
  
  const timeSlotInfo = selectedTimeSlot && selectedDate
    ? availableDays
      .find(day => day.date.toDateString() === selectedDate.toDateString())
      ?.timeSlots.find(slot => slot.id === selectedTimeSlot)
    : null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openConfirmation();
  };
  
  const validateForm = () => {
    return formData.name.trim() !== '' && 
           formData.phone.trim() !== '' && 
           formData.email.trim() !== '' &&
           validateEmail(formData.email);
  };
  
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  if (!selectedDate || !selectedTimeSlot || !timeSlotInfo) {
    return null;
  }
  
  return (
    <div className="p-4 pb-6 animate-fade-in">
      <div className="mb-6 p-4 bg-osteo-50 rounded-lg text-osteo-800">
        <div className="flex items-center gap-2 mb-1 font-medium">
          <Calendar className="h-5 w-5 text-osteo-500" />
          <h3>Detalles de tu cita</h3>
        </div>
        <p>
          {formatFullDateTime(selectedDate, timeSlotInfo.time)}
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="flex items-center gap-1 mb-1.5">
              <User className="h-4 w-4" />
              <span>Nombre completo *</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Introduce tu nombre completo"
              required
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="phone" className="flex items-center gap-1 mb-1.5">
              <Phone className="h-4 w-4" />
              <span>Teléfono *</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Introduce tu número de teléfono"
              required
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="email" className="flex items-center gap-1 mb-1.5">
              <Mail className="h-4 w-4" />
              <span>Correo electrónico *</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Introduce tu correo electrónico"
              required
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="notes" className="flex items-center gap-1 mb-1.5">
              <ClipboardEdit className="h-4 w-4" />
              <span>Observaciones (opcional)</span>
            </Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Incluye cualquier información adicional que consideres relevante"
              className="w-full min-h-[80px]"
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-between">
          <Button 
            type="button"
            variant="outline"
            onClick={goToPreviousStep}
            className="px-4 py-2"
          >
            Volver
          </Button>
          
          <Button
            type="submit"
            disabled={!validateForm()}
            className="bg-osteo-500 hover:bg-osteo-600 text-white font-medium px-6 py-2 rounded-lg transition-colors"
          >
            Confirmar cita
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
