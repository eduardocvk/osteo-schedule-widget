
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { addDays, format, parse, startOfDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useSupabaseAppointments } from '../hooks/useSupabaseAppointments';
import { useSupabaseAvailability } from '../hooks/useSupabaseAvailability';
import { useToast } from '@/hooks/use-toast';

type TimeSlot = {
  id: string;
  time: string;
  available: boolean;
};

type DayAvailability = {
  date: Date;
  available: boolean;
  timeSlots: TimeSlot[];
};

type BookingFormData = {
  name: string;
  phone: string;
  email: string;
  notes: string;
  date: Date | null;
  timeSlot: string | null;
};

type BookingContextType = {
  availableDays: DayAvailability[];
  selectedDate: Date | null;
  selectedTimeSlot: string | null;
  formData: BookingFormData;
  bookingStep: number;
  isConfirmationOpen: boolean;
  isBookingComplete: boolean;
  isLoading: boolean;
  
  setSelectedDate: (date: Date | null) => void;
  setSelectedTimeSlot: (timeSlot: string | null) => void;
  updateFormData: (data: Partial<BookingFormData>) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  resetBooking: () => void;
  completeBooking: () => void;
  openConfirmation: () => void;
  closeConfirmation: () => void;
};

const INITIAL_FORM_DATA: BookingFormData = {
  name: '',
  phone: '',
  email: '',
  notes: '',
  date: null,
  timeSlot: null,
};

// Función para generar horarios disponibles cada 45 minutos
const generateTimeSlots = (date: Date, availableSlots: string[] = [], bookedSlots: string[] = []): TimeSlot[] => {
  // Para este ejemplo, haremos disponible de 9:00 a 19:00
  const slots: TimeSlot[] = [];
  const isWeekend = [0, 6].includes(date.getDay()); // 0 es domingo, 6 es sábado
  
  if (isWeekend) {
    return []; // No hay horarios disponibles en fin de semana por defecto
  }
  
  // Horarios de inicio y fin (24h format)
  const startHour = 9;
  const endHour = 19;
  
  // Duración de cada cita en minutos
  const appointmentDuration = 45;
  
  // Genera los horarios
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += appointmentDuration) {
      if (hour === endHour - 1 && minute > 15) {
        break; // No crear slots que vayan más allá de las 19:00
      }
      
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const slotId = `${format(date, 'yyyy-MM-dd')}-${timeString}`;
      
      // Verificar si el slot está en la lista de disponibles y no está reservado
      const isAvailable = availableSlots.length === 0 || availableSlots.includes(timeString);
      const isBooked = bookedSlots.includes(timeString);
      
      slots.push({
        id: slotId,
        time: timeString,
        available: isAvailable && !isBooked,
      });
    }
  }
  
  return slots;
};

export const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [availableDays, setAvailableDays] = useState<DayAvailability[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [formData, setFormData] = useState<BookingFormData>(INITIAL_FORM_DATA);
  const [bookingStep, setBookingStep] = useState(1);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  const { toast } = useToast();
  const { useCreateAppointmentMutation } = useSupabaseAppointments();
  const { 
    useMonthAvailabilityQuery, 
    useBookedTimeSlotsQuery 
  } = useSupabaseAvailability();
  
  const createAppointmentMutation = useCreateAppointmentMutation();
  const { data: monthAvailability, isLoading: isLoadingAvailability } = useMonthAvailabilityQuery(currentMonth);
  const { data: bookedTimeSlots, isLoading: isLoadingBookedSlots } = useBookedTimeSlotsQuery(
    selectedDate || new Date()
  );
  
  const isLoading = isLoadingAvailability || isLoadingBookedSlots || createAppointmentMutation.isPending;
  
  // Efecto para generar la disponibilidad basada en los datos de Supabase
  useEffect(() => {
    if (monthAvailability && !isLoadingAvailability) {
      const days: DayAvailability[] = [];
      const today = startOfDay(new Date());
      
      for (let i = 0; i < 30; i++) {
        const date = addDays(today, i);
        const dateStr = format(date, 'yyyy-MM-dd');
        
        // Buscar si existe configuración de disponibilidad para este día
        const dayConfig = monthAvailability.find(d => d.date === dateStr);
        
        // Si el día tiene configuración específica y no está disponible, continuar
        if (dayConfig && !dayConfig.is_available) {
          days.push({
            date,
            available: false,
            timeSlots: [],
          });
          continue;
        }
        
        // Si tiene configuración y está disponible, usar sus slots
        // Si no tiene configuración, usar el comportamiento por defecto
        const availableSlots = dayConfig?.time_slots || [];
        
        days.push({
          date,
          available: true,
          timeSlots: generateTimeSlots(date, availableSlots, []),
        });
      }
      
      setAvailableDays(days);
    }
  }, [monthAvailability, isLoadingAvailability]);
  
  // Actualizar slots reservados cuando cambia la fecha seleccionada
  useEffect(() => {
    if (selectedDate && bookedTimeSlots && !isLoadingBookedSlots) {
      setAvailableDays(prevDays => 
        prevDays.map(day => {
          if (day.date.toDateString() === selectedDate.toDateString()) {
            // Actualizar los slots de este día específico
            const updatedTimeSlots = day.timeSlots.map(slot => ({
              ...slot,
              available: slot.available && !bookedTimeSlots.includes(slot.time)
            }));
            
            return {
              ...day,
              timeSlots: updatedTimeSlots
            };
          }
          return day;
        })
      );
    }
  }, [selectedDate, bookedTimeSlots, isLoadingBookedSlots]);
  
  const updateFormData = (data: Partial<BookingFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };
  
  const goToNextStep = () => {
    if (bookingStep < 3) {
      setBookingStep((prev) => prev + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (bookingStep > 1) {
      setBookingStep((prev) => prev - 1);
    }
  };
  
  const resetBooking = () => {
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setFormData(INITIAL_FORM_DATA);
    setBookingStep(1);
    setIsBookingComplete(false);
  };
  
  const completeBooking = async () => {
    if (!selectedDate || !selectedTimeSlot || !formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Error al crear la cita",
        description: "Faltan datos obligatorios para completar la reserva",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Extraer el tiempo del ID del slot seleccionado (formato: yyyy-MM-dd-HH:mm)
      const timeSlot = selectedTimeSlot.split('-').slice(-1)[0];
      
      // Crear la cita en Supabase
      await createAppointmentMutation.mutateAsync({
        date: format(selectedDate, 'yyyy-MM-dd'),
        time_slot: timeSlot,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        notes: formData.notes || null,
        status: 'pending'
      });
      
      setIsBookingComplete(true);
      setIsConfirmationOpen(false);
      
      // Aquí se integraría con Google Calendar y el envío de correos
      console.log('Booking completed in Supabase');
    } catch (error) {
      console.error('Error completing booking:', error);
    }
  };
  
  const openConfirmation = () => {
    setIsConfirmationOpen(true);
  };
  
  const closeConfirmation = () => {
    setIsConfirmationOpen(false);
  };
  
  const value: BookingContextType = {
    availableDays,
    selectedDate,
    selectedTimeSlot,
    formData,
    bookingStep,
    isConfirmationOpen,
    isBookingComplete,
    isLoading,
    
    setSelectedDate,
    setSelectedTimeSlot,
    updateFormData,
    goToNextStep,
    goToPreviousStep,
    resetBooking,
    completeBooking,
    openConfirmation,
    closeConfirmation,
  };
  
  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
