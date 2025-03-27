
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { endOfMonth, format, parseISO, startOfMonth } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

type Availability = Database['public']['Tables']['availability']['Row'];
type AvailabilityInsert = Database['public']['Tables']['availability']['Insert'];

export function useSupabaseAvailability() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  
  // Obtener disponibilidad para un mes
  const getMonthAvailability = async (date: Date): Promise<Availability[]> => {
    const start = format(startOfMonth(date), 'yyyy-MM-dd');
    const end = format(endOfMonth(date), 'yyyy-MM-dd');
    
    const { data, error } = await supabase
      .from('availability')
      .select('*')
      .gte('date', start)
      .lte('date', end);
      
    if (error) {
      console.error('Error fetching availability:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  };
  
  // Obtener disponibilidad para una fecha específica
  const getDayAvailability = async (date: Date): Promise<Availability | null> => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const { data, error } = await supabase
      .from('availability')
      .select('*')
      .eq('date', dateStr)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 es "no se encontró ningún registro"
      console.error('Error fetching day availability:', error);
      throw new Error(error.message);
    }
    
    return data || null;
  };
  
  // Actualizar o crear disponibilidad para una fecha
  const setDayAvailability = async (availability: AvailabilityInsert): Promise<Availability> => {
    setIsLoading(true);
    try {
      // Primero intentamos actualizar si ya existe
      const { data: existingData } = await supabase
        .from('availability')
        .select('id')
        .eq('date', availability.date)
        .single();
        
      if (existingData) {
        // Actualizar
        const { data, error } = await supabase
          .from('availability')
          .update({
            time_slots: availability.time_slots,
            is_available: availability.is_available
          })
          .eq('id', existingData.id)
          .select()
          .single();
          
        if (error) {
          console.error('Error updating availability:', error);
          toast({
            title: "Error al actualizar disponibilidad",
            description: error.message,
            variant: "destructive",
          });
          throw new Error(error.message);
        }
        
        return data;
      } else {
        // Crear nueva
        const { data, error } = await supabase
          .from('availability')
          .insert(availability)
          .select()
          .single();
          
        if (error) {
          console.error('Error creating availability:', error);
          toast({
            title: "Error al crear disponibilidad",
            description: error.message,
            variant: "destructive",
          });
          throw new Error(error.message);
        }
        
        return data;
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Eliminar disponibilidad para una fecha
  const deleteDayAvailability = async (date: Date): Promise<void> => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('availability')
        .delete()
        .eq('date', dateStr);
        
      if (error) {
        console.error('Error deleting availability:', error);
        toast({
          title: "Error al eliminar disponibilidad",
          description: error.message,
          variant: "destructive",
        });
        throw new Error(error.message);
      }
      
      toast({
        title: "Disponibilidad eliminada correctamente",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Obtener horarios ocupados para una fecha
  const getBookedTimeSlots = async (date: Date): Promise<string[]> => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const { data, error } = await supabase
      .from('appointments')
      .select('time_slot')
      .eq('date', dateStr)
      .in('status', ['pending', 'confirmed']);
      
    if (error) {
      console.error('Error fetching booked time slots:', error);
      throw new Error(error.message);
    }
    
    return data?.map(item => item.time_slot) || [];
  };
  
  // React Query hooks
  const useMonthAvailabilityQuery = (date: Date) => {
    return useQuery({
      queryKey: ['availability', 'month', format(date, 'yyyy-MM')],
      queryFn: () => getMonthAvailability(date),
    });
  };
  
  const useDayAvailabilityQuery = (date: Date) => {
    return useQuery({
      queryKey: ['availability', 'day', format(date, 'yyyy-MM-dd')],
      queryFn: () => getDayAvailability(date),
      enabled: !!date,
    });
  };
  
  const useBookedTimeSlotsQuery = (date: Date) => {
    return useQuery({
      queryKey: ['bookedTimeSlots', format(date, 'yyyy-MM-dd')],
      queryFn: () => getBookedTimeSlots(date),
      enabled: !!date,
    });
  };
  
  const useSetDayAvailabilityMutation = () => {
    return useMutation({
      mutationFn: setDayAvailability,
      onSuccess: (data) => {
        const date = parseISO(data.date);
        queryClient.invalidateQueries({ 
          queryKey: ['availability', 'day', format(date, 'yyyy-MM-dd')] 
        });
        queryClient.invalidateQueries({ 
          queryKey: ['availability', 'month', format(date, 'yyyy-MM')] 
        });
      },
    });
  };
  
  const useDeleteDayAvailabilityMutation = () => {
    return useMutation({
      mutationFn: deleteDayAvailability,
      onSuccess: (_, date) => {
        queryClient.invalidateQueries({ 
          queryKey: ['availability', 'day', format(date, 'yyyy-MM-dd')] 
        });
        queryClient.invalidateQueries({ 
          queryKey: ['availability', 'month', format(date, 'yyyy-MM')] 
        });
      },
    });
  };
  
  return {
    isLoading,
    useMonthAvailabilityQuery,
    useDayAvailabilityQuery,
    useBookedTimeSlotsQuery,
    useSetDayAvailabilityMutation,
    useDeleteDayAvailabilityMutation,
  };
}
