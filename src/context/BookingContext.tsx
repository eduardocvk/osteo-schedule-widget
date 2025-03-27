
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { addDays, format, parse, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

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
const generateTimeSlots = (date: Date): TimeSlot[] => {
  // Para este ejemplo, haremos disponible de 9:00 a 19:00
  const slots: TimeSlot[] = [];
  const isWeekend = [0, 6].includes(date.getDay()); // 0 es domingo, 6 es sábado
  
  if (isWeekend) {
    return []; // No hay horarios disponibles en fin de semana
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
      
      // Crear disponibilidad aleatoria para demo
      const randomAvailability = Math.random() > 0.3; // 70% de probabilidad de estar disponible
      
      slots.push({
        id: `${format(date, 'yyyy-MM-dd')}-${timeString}`,
        time: timeString,
        available: randomAvailability,
      });
    }
  }
  
  return slots;
};

// Función para generar disponibilidad para los próximos 30 días
const generateAvailability = (): DayAvailability[] => {
  const days: DayAvailability[] = [];
  const today = startOfDay(new Date());
  
  for (let i = 0; i < 30; i++) {
    const date = addDays(today, i);
    const isWeekend = [0, 6].includes(date.getDay());
    
    days.push({
      date,
      available: !isWeekend,
      timeSlots: generateTimeSlots(date),
    });
  }
  
  return days;
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
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Inicializar la disponibilidad
    setAvailableDays(generateAvailability());
  }, []);
  
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
  
  const completeBooking = () => {
    setIsLoading(true);
    
    // Simulación de envío a servidor
    setTimeout(() => {
      console.log('Booking completed:', {
        ...formData,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
      });
      
      setIsBookingComplete(true);
      setIsConfirmationOpen(false);
      setIsLoading(false);
      
      // Aquí se integraría con Google Calendar y el envío de correos
    }, 2000);
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
