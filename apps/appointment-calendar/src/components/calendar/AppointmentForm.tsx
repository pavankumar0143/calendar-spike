import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appointmentApi } from '@/api';
import { useUserStore, useAppointmentFormStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FormValues {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: string;
}

export function AppointmentForm() {
  const { currentUser } = useUserStore();
  const { isOpen, appointmentId, defaultDate, close } = useAppointmentFormStore();
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();
  
  // Fetch appointment data if editing
  const { data: appointment } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: () => appointmentId ? appointmentApi.getById(appointmentId).then(res => res.data) : null,
    enabled: !!appointmentId,
  });
  
  // Create appointment mutation
  const createMutation = useMutation({
    mutationFn: (data: {
      userId: string;
      title: string;
      description?: string;
      startTime: Date;
      endTime: Date;
      location?: string;
    }) => appointmentApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      close();
    },
  });
  
  // Update appointment mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: {
      id: string;
      data: {
        title?: string;
        description?: string;
        startTime?: Date;
        endTime?: Date;
        location?: string;
      };
    }) => appointmentApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', appointmentId] });
      close();
    },
  });
  
  // Delete appointment mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => appointmentApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      close();
    },
  });
  
  // Set default values when form opens or appointment data is loaded
  useEffect(() => {
    if (isOpen) {
      if (appointment) {
        // Editing existing appointment
        const startDate = new Date(appointment.startTime);
        const endDate = new Date(appointment.endTime);
        
        reset({
          title: appointment.title,
          description: appointment.description || '',
          startDate: startDate.toISOString().split('T')[0],
          startTime: startDate.toTimeString().split(' ')[0].substring(0, 5),
          endDate: endDate.toISOString().split('T')[0],
          endTime: endDate.toTimeString().split(' ')[0].substring(0, 5),
          location: appointment.location || '',
        });
      } else if (defaultDate) {
        // Creating new appointment with default date
        const startDate = new Date(defaultDate);
        const endDate = new Date(defaultDate);
        endDate.setHours(endDate.getHours() + 1);
        
        reset({
          title: '',
          description: '',
          startDate: startDate.toISOString().split('T')[0],
          startTime: startDate.toTimeString().split(' ')[0].substring(0, 5),
          endDate: endDate.toISOString().split('T')[0],
          endTime: endDate.toTimeString().split(' ')[0].substring(0, 5),
          location: '',
        });
      } else {
        // Creating new appointment without default date
        const now = new Date();
        const later = new Date();
        later.setHours(later.getHours() + 1);
        
        reset({
          title: '',
          description: '',
          startDate: now.toISOString().split('T')[0],
          startTime: now.toTimeString().split(' ')[0].substring(0, 5),
          endDate: later.toISOString().split('T')[0],
          endTime: later.toTimeString().split(' ')[0].substring(0, 5),
          location: '',
        });
      }
    }
  }, [isOpen, appointment, defaultDate, reset]);
  
  const onSubmit = (data: FormValues) => {
    if (!currentUser) return;
    
    const startTime = new Date(`${data.startDate}T${data.startTime}`);
    const endTime = new Date(`${data.endDate}T${data.endTime}`);
    
    if (appointmentId) {
      // Update existing appointment
      updateMutation.mutate({
        id: appointmentId,
        data: {
          title: data.title,
          description: data.description,
          startTime,
          endTime,
          location: data.location,
        },
      });
    } else {
      // Create new appointment
      createMutation.mutate({
        userId: currentUser.id,
        title: data.title,
        description: data.description,
        startTime,
        endTime,
        location: data.location,
      });
    }
  };
  
  const handleDelete = () => {
    if (appointmentId) {
      deleteMutation.mutate(appointmentId);
    }
  };
  
  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => !open && close()}
    >
      <DialogContent 
        className="sm:max-w-[425px]"
        onClose={close}
      >
        <DialogHeader>
          <DialogTitle>{appointmentId ? 'Edit Appointment' : 'Create Appointment'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register('title', { required: 'Title is required' })}
              placeholder="Appointment title"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Appointment description"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate', { required: 'Start date is required' })}
              />
              {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                {...register('startTime', { required: 'Start time is required' })}
              />
              {errors.startTime && <p className="text-red-500 text-sm">{errors.startTime.message}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate', { required: 'End date is required' })}
              />
              {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                {...register('endTime', { required: 'End time is required' })}
              />
              {errors.endTime && <p className="text-red-500 text-sm">{errors.endTime.message}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register('location')}
              placeholder="Appointment location"
            />
          </div>
          
          <DialogFooter className="flex justify-between">
            {appointmentId && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={close}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? 'Saving...'
                  : appointmentId ? 'Update' : 'Create'
                }
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 