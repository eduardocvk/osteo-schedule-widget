
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

type Appointment = Database['public']['Tables']['appointments']['Row'];
type AppointmentInsert = Database['public']['Tables']['appointments']['Insert'];

export function useSupabaseAppointments() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  
  // Obtener todas las citas
  const getAppointments = async (): Promise<Appointment[]> => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true });
      
    if (error) {
      console.error('Error fetching appointments:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  };
  
  // Obtener una cita por ID
  const getAppointmentById = async (id: string): Promise<Appointment | null> => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching appointment:', error);
      throw new Error(error.message);
    }
    
    return data;
  };
  
  // Crear una nueva cita
  const createAppointment = async (appointment: AppointmentInsert): Promise<Appointment> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointment)
        .select()
        .single();
        
      if (error) {
        console.error('Error creating appointment:', error);
        toast({
          title: "Error al crear la cita",
          description: error.message,
          variant: "destructive",
        });
        throw new Error(error.message);
      }
      
      toast({
        title: "Cita creada correctamente",
        description: "Te hemos enviado un correo de confirmación",
      });
      
      return data;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Actualizar una cita existente
  const updateAppointment = async (id: string, updates: Partial<Appointment>): Promise<Appointment> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating appointment:', error);
        toast({
          title: "Error al actualizar la cita",
          description: error.message,
          variant: "destructive",
        });
        throw new Error(error.message);
      }
      
      toast({
        title: "Cita actualizada correctamente",
      });
      
      return data;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Eliminar una cita
  const deleteAppointment = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Error deleting appointment:', error);
        toast({
          title: "Error al eliminar la cita",
          description: error.message,
          variant: "destructive",
        });
        throw new Error(error.message);
      }
      
      toast({
        title: "Cita eliminada correctamente",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // React Query hooks
  const useAppointmentsQuery = () => {
    return useQuery({
      queryKey: ['appointments'],
      queryFn: getAppointments,
    });
  };
  
  const useAppointmentQuery = (id: string) => {
    return useQuery({
      queryKey: ['appointments', id],
      queryFn: () => getAppointmentById(id),
      enabled: !!id,
    });
  };
  
  const useCreateAppointmentMutation = () => {
    return useMutation({
      mutationFn: createAppointment,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['appointments'] });
        queryClient.invalidateQueries({ queryKey: ['availability'] });
      },
    });
  };
  
  const useUpdateAppointmentMutation = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<Appointment> }) => 
        updateAppointment(id, data),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['appointments'] });
        queryClient.invalidateQueries({ queryKey: ['appointments', variables.id] });
        queryClient.invalidateQueries({ queryKey: ['availability'] });
      },
    });
  };
  
  const useDeleteAppointmentMutation = () => {
    return useMutation({
      mutationFn: deleteAppointment,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['appointments'] });
        queryClient.invalidateQueries({ queryKey: ['availability'] });
      },
    });
  };
  
  return {
    isLoading,
    useAppointmentsQuery,
    useAppointmentQuery,
    useCreateAppointmentMutation,
    useUpdateAppointmentMutation,
    useDeleteAppointmentMutation,
  };
}
