
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { useBooking } from '../context/BookingContext';
import { capitalizeFirstLetter, formatShortDate, formatTime } from '../utils/dateUtils';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

const CalendarView: React.FC = () => {
  const {
    availableDays,
    selectedDate,
    selectedTimeSlot,
    setSelectedDate,
    setSelectedTimeSlot,
    goToNextStep
  } = useBooking();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [visibleTimeSlots, setVisibleTimeSlots] = useState<{
    morning: { id: string; time: string; available: boolean }[];
    afternoon: { id: string; time: string; available: boolean }[];
  }>({
    morning: [],
    afternoon: []
  });

  useEffect(() => {
    if (selectedDate) {
      // Buscar los horarios disponibles para la fecha seleccionada
      const dayData = availableDays.find(day => 
        isSameDay(day.date, selectedDate)
      );
      
      if (dayData) {
        const morning = dayData.timeSlots.filter(slot => {
          const hour = parseInt(slot.time.split(':')[0]);
          return hour < 13;
        });
        
        const afternoon = dayData.timeSlots.filter(slot => {
          const hour = parseInt(slot.time.split(':')[0]);
          return hour >= 13;
        });
        
        setVisibleTimeSlots({ morning, afternoon });
      }
    }
  }, [selectedDate, availableDays]);
  
  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const handleDateClick = (day: Date) => {
    const dayData = availableDays.find(d => isSameDay(d.date, day));
    
    if (dayData && dayData.available) {
      setSelectedDate(day);
      setSelectedTimeSlot(null); // Resetear el horario seleccionado
    }
  };
  
  const handleTimeClick = (slotId: string) => {
    setSelectedTimeSlot(slotId);
  };
  
  const isDateAvailable = (day: Date) => {
    const dayData = availableDays.find(d => isSameDay(d.date, day));
    return dayData?.available || false;
  };
  
  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";
    
    return (
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-500" />
        </button>
        <h2 className="text-lg font-medium text-gray-900">
          {capitalizeFirstLetter(format(currentMonth, dateFormat, { locale: es }))}
        </h2>
        <button
          type="button"
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-gray-500" />
        </button>
      </div>
    );
  };
  
  const renderDays = () => {
    const dateFormat = 'EEEEEE';
    const days = [];
    const startDate = startOfWeek(currentMonth, { locale: es });
    
    for (let i = 0; i < 7; i++) {
      const day = addDays(startDate, i);
      days.push(
        <div className="text-center text-sm text-gray-500" key={i}>
          {capitalizeFirstLetter(format(day, dateFormat, { locale: es }))}
        </div>
      );
    }
    
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };
  
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale: es });
    const endDate = endOfWeek(monthEnd, { locale: es });
    
    const rows = [];
    let days = [];
    let day = startDate;
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isAvailable = isDateAvailable(cloneDay);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        
        days.push(
          <div
            className={cn(
              "relative h-12 border-t border-gray-100 p-1 transition-colors",
              !isCurrentMonth && "text-gray-300 cursor-default",
              isCurrentMonth && "hover:bg-gray-50"
            )}
            key={day.toString()}
          >
            <button
              type="button"
              onClick={() => isCurrentMonth && handleDateClick(cloneDay)}
              className={cn(
                "calendar-day",
                isAvailable && isCurrentMonth && "available",
                !isAvailable && "unavailable",
                isSelected && "selected"
              )}
            >
              {format(day, "d")}
            </button>
          </div>
        );
        
        day = addDays(day, 1);
      }
      
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      
      days = [];
    }
    
    return <div className="bg-white rounded-lg overflow-hidden shadow-sm">{rows}</div>;
  };
  
  const renderTimeSlots = () => {
    if (!selectedDate) return null;
    
    return (
      <div className="mt-6 animate-fade-in">
        <div className="text-md font-medium mb-4 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-osteo-500" />
          <span>Selecciona un horario disponible para el {formatShortDate(selectedDate)}</span>
        </div>
        
        {visibleTimeSlots.morning.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Mañana</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {visibleTimeSlots.morning.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => slot.available && handleTimeClick(slot.id)}
                  className={cn(
                    "time-slot",
                    slot.available ? "available" : "unavailable",
                    selectedTimeSlot === slot.id && "selected"
                  )}
                >
                  {formatTime(slot.time)}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {visibleTimeSlots.afternoon.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Tarde</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {visibleTimeSlots.afternoon.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => slot.available && handleTimeClick(slot.id)}
                  className={cn(
                    "time-slot",
                    slot.available ? "available" : "unavailable",
                    selectedTimeSlot === slot.id && "selected"
                  )}
                >
                  {formatTime(slot.time)}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <Button
            className="bg-osteo-500 hover:bg-osteo-600 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            disabled={!selectedTimeSlot}
            onClick={goToNextStep}
          >
            Continuar
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-4 pb-6">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      {renderTimeSlots()}
    </div>
  );
};

export default CalendarView;
