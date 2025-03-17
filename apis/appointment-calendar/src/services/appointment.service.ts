import { injectable, inject } from 'inversify';
import { IAppointmentRepository } from 'appointment-calendar-db-repositories';
import { TYPES } from '../types';
import { CreateAppointmentDto, UpdateAppointmentDto } from '../types';
import { GoogleCalendarService } from './google-calendar.service';

@injectable()
export class AppointmentService {
  constructor(
    @inject(TYPES.AppointmentRepository) private appointmentRepository: IAppointmentRepository,
    @inject(TYPES.GoogleCalendarService) private googleCalendarService: GoogleCalendarService
  ) {}

  async findById(id: string) {
    return this.appointmentRepository.findById(id);
  }

  async findByUserId(userId: string) {
    return this.appointmentRepository.findByUserId(userId);
  }

  async findByDateRange(userId: string, startDate: Date, endDate: Date) {
    return this.appointmentRepository.findByDateRange(userId, startDate, endDate);
  }

  async create(data: CreateAppointmentDto) {
    const appointment = await this.appointmentRepository.create({
      ...data,
      description: data.description ?? null,
      location: data.location ?? null,
      googleEventId: data.googleEventId ?? null,
      status: data.status || 'pending'
    });
    
    // Try to sync with Google Calendar if possible
    try {
      const user = await this.googleCalendarService.getUserWithCalendarInfo(appointment.userId);
      
      if (user && user.isCalendarConnected) {
        const googleEventId = await this.googleCalendarService.createEvent(
          user,
          appointment.title,
          appointment.description || '',
          appointment.startTime,
          appointment.endTime,
          appointment.location ?? undefined
        );
        
        if (googleEventId) {
          await this.appointmentRepository.updateGoogleEventId(appointment.id, googleEventId);
          // Refresh the appointment data
          return this.appointmentRepository.findById(appointment.id);
        }
      }
    } catch (error) {
      console.error('Failed to sync appointment with Google Calendar:', error);
      // Continue without Google Calendar sync
    }
    
    return appointment;
  }

  async update(id: string, data: UpdateAppointmentDto) {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    
    const updatedAppointment = await this.appointmentRepository.update(id, {
      ...data,
      description: data.description ?? null,
      location: data.location ?? null,
      status: data.status || 'pending'
    });
    
    // Try to sync with Google Calendar if possible
    try {
      if (appointment.googleEventId) {
        const user = await this.googleCalendarService.getUserWithCalendarInfo(appointment.userId);
        
        if (user && user.isCalendarConnected) {
          await this.googleCalendarService.updateEvent(
            user,
            appointment.googleEventId,
            updatedAppointment.title,
            updatedAppointment.description || '',
            updatedAppointment.startTime,
            updatedAppointment.endTime,
            updatedAppointment.location ?? undefined
          );
        }
      }
    } catch (error) {
      console.error('Failed to update appointment in Google Calendar:', error);
      // Continue without Google Calendar sync
    }
    
    return updatedAppointment;
  }

  async delete(id: string) {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    
    // Try to delete from Google Calendar if possible
    try {
      if (appointment.googleEventId) {
        const user = await this.googleCalendarService.getUserWithCalendarInfo(appointment.userId);
        
        if (user && user.isCalendarConnected) {
          await this.googleCalendarService.deleteEvent(user, appointment.googleEventId);
        }
      }
    } catch (error) {
      console.error('Failed to delete appointment from Google Calendar:', error);
      // Continue with deletion anyway
    }
    
    return this.appointmentRepository.delete(id);
  }
} 