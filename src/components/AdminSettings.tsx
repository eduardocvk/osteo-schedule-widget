
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Calendar, 
  Clock, 
  Mail, 
  Settings, 
  Calendar as CalendarIcon,
  CheckSquare, 
  Save,
  Loader
} from 'lucide-react';
import { toast } from 'sonner';

const AdminSettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [workingDays, setWorkingDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  });
  
  const [workingHours, setWorkingHours] = useState({
    start: '09:00',
    end: '19:00',
  });
  
  const [appointmentDuration, setAppointmentDuration] = useState(45);
  
  const [googleCalendarId, setGoogleCalendarId] = useState('');
  const [emailSettings, setEmailSettings] = useState({
    senderName: '',
    senderEmail: '',
    confirmationTemplate: '',
    reminderTemplate: '',
  });
  
  const handleWorkingDayToggle = (day: keyof typeof workingDays) => {
    setWorkingDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };
  
  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Simular guardado
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Configuración guardada correctamente');
      
      // Aquí se guardarían los ajustes en el backend
      console.log({
        workingDays,
        workingHours,
        appointmentDuration,
        googleCalendarId,
        emailSettings
      });
    }, 1500);
  };
  
  return (
    <div className="p-6 glass-card max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <Settings className="h-6 w-6 text-osteo-600" />
        Configuración del Sistema de Reservas
      </h2>
      
      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="schedule" className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>Horarios</span>
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center gap-1.5">
            <CalendarIcon className="h-4 w-4" />
            <span>Integración</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1.5">
            <Mail className="h-4 w-4" />
            <span>Notificaciones</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule" className="space-y-6">
          <section>
            <h3 className="text-lg font-medium mb-4">Días laborables</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Object.entries(workingDays).map(([day, isActive]) => (
                <div key={day} className="flex items-center space-x-2">
                  <Switch 
                    id={`day-${day}`} 
                    checked={isActive}
                    onCheckedChange={() => handleWorkingDayToggle(day as keyof typeof workingDays)}
                  />
                  <Label htmlFor={`day-${day}`} className="capitalize">
                    {day === 'monday' ? 'Lunes' : 
                     day === 'tuesday' ? 'Martes' : 
                     day === 'wednesday' ? 'Miércoles' : 
                     day === 'thursday' ? 'Jueves' : 
                     day === 'friday' ? 'Viernes' : 
                     day === 'saturday' ? 'Sábado' : 'Domingo'}
                  </Label>
                </div>
              ))}
            </div>
          </section>
          
          <section>
            <h3 className="text-lg font-medium mb-4">Horario de trabajo</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Hora de inicio</Label>
                <Input 
                  id="start-time" 
                  type="time" 
                  value={workingHours.start}
                  onChange={(e) => setWorkingHours(prev => ({ ...prev, start: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">Hora de fin</Label>
                <Input 
                  id="end-time" 
                  type="time" 
                  value={workingHours.end}
                  onChange={(e) => setWorkingHours(prev => ({ ...prev, end: e.target.value }))}
                />
              </div>
            </div>
          </section>
          
          <section>
            <h3 className="text-lg font-medium mb-4">Duración de las citas</h3>
            <div className="flex items-center gap-4">
              <Input 
                id="duration" 
                type="number" 
                min="15"
                step="15"
                value={appointmentDuration}
                onChange={(e) => setAppointmentDuration(parseInt(e.target.value))}
                className="w-24"
              />
              <Label htmlFor="duration" className="whitespace-nowrap">minutos</Label>
            </div>
          </section>
        </TabsContent>
        
        <TabsContent value="integration" className="space-y-6">
          <section>
            <h3 className="text-lg font-medium mb-4">Google Calendar</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="calendar-id">ID de Google Calendar</Label>
                <Input 
                  id="calendar-id" 
                  placeholder="example@gmail.com" 
                  value={googleCalendarId}
                  onChange={(e) => setGoogleCalendarId(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Introduce el ID de tu calendario para sincronizar las citas.
                </p>
              </div>
            </div>
          </section>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <section>
            <h3 className="text-lg font-medium mb-4">Configuración de correos</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sender-name">Nombre del remitente</Label>
                  <Input 
                    id="sender-name" 
                    placeholder="Tu Clínica de Osteopatía" 
                    value={emailSettings.senderName}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, senderName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sender-email">Email del remitente</Label>
                  <Input 
                    id="sender-email" 
                    type="email"
                    placeholder="citas@tudominio.com" 
                    value={emailSettings.senderEmail}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, senderEmail: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmation-template">Plantilla de confirmación</Label>
                <Input 
                  id="confirmation-template" 
                  placeholder="URL de la plantilla o ID" 
                  value={emailSettings.confirmationTemplate}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, confirmationTemplate: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reminder-template">Plantilla de recordatorio</Label>
                <Input 
                  id="reminder-template" 
                  placeholder="URL de la plantilla o ID" 
                  value={emailSettings.reminderTemplate}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, reminderTemplate: e.target.value }))}
                />
              </div>
            </div>
          </section>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 flex justify-end">
        <Button 
          onClick={handleSaveSettings}
          disabled={isLoading}
          className="bg-osteo-500 hover:bg-osteo-600 text-white"
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar configuración
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
