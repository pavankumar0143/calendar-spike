import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { controller, httpGet, httpPost, httpPut, httpDelete } from 'inversify-express-utils';
import { AppointmentService, GoogleCalendarService } from '../services';
import { TYPES } from '../types';

@controller('/api/appointments')
export class AppointmentController {
  constructor(
    @inject(TYPES.AppointmentService) private appointmentService: AppointmentService,
    @inject(TYPES.GoogleCalendarService) private googleCalendarService: GoogleCalendarService
  ) {}

  @httpGet('/:id')
  async getAppointment(req: Request, res: Response) {
    try {
      const appointment = await this.appointmentService.findById(req.params.id);
      
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      
      return res.status(200).json(appointment);
    } catch (error) {
      console.error('Error getting appointment:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @httpGet('/user/:userId')
  async getAppointmentsByUser(req: Request, res: Response) {
    try {
      const appointments = await this.appointmentService.findByUserId(req.params.userId);
      return res.status(200).json(appointments);
    } catch (error) {
      console.error('Error getting appointments by user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @httpGet('/user/:userId/range')
  async getAppointmentsByDateRange(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Start date and end date are required' });
      }
      
      const appointments = await this.appointmentService.findByDateRange(
        req.params.userId,
        new Date(startDate as string),
        new Date(endDate as string)
      );
      
      return res.status(200).json(appointments);
    } catch (error) {
      console.error('Error getting appointments by date range:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @httpPost('/')
  async createAppointment(req: Request, res: Response) {
    try {
      const { userId, title, description, startTime, endTime, location } = req.body;
      
      if (!userId || !title || !startTime || !endTime) {
        return res.status(400).json({ message: 'User ID, title, start time, and end time are required' });
      }
      
      const appointment = await this.appointmentService.create({
        userId,
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        location
      });
      
      return res.status(201).json(appointment);
    } catch (error) {
      console.error('Error creating appointment:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @httpPut('/:id')
  async updateAppointment(req: Request, res: Response) {
    try {
      const { title, description, startTime, endTime, location, status } = req.body;
      
      const updateData: any = {};
      
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (startTime !== undefined) updateData.startTime = new Date(startTime);
      if (endTime !== undefined) updateData.endTime = new Date(endTime);
      if (location !== undefined) updateData.location = location;
      if (status !== undefined) updateData.status = status;
      
      const appointment = await this.appointmentService.update(req.params.id, updateData);
      return res.status(200).json(appointment);
    } catch (error) {
      console.error('Error updating appointment:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @httpDelete('/:id')
  async deleteAppointment(req: Request, res: Response) {
    try {
      await this.appointmentService.delete(req.params.id);
      return res.status(204).send();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @httpGet('/user/:userId/google-events')
  async getGoogleEvents(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Start date and end date are required' });
      }
      
      const user = await this.googleCalendarService.getUserWithCalendarInfo(req.params.userId);
      
      if (!user || !user.isCalendarConnected) {
        return res.status(400).json({ message: 'User has no connected Google Calendar' });
      }
      
      const events = await this.googleCalendarService.listEvents(
        user,
        new Date(startDate as string),
        new Date(endDate as string)
      );
      
      return res.status(200).json(events);
    } catch (error) {
      console.error('Error getting Google Calendar events:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @httpGet('/user/:userId/check-availability')
  async checkAvailability(req: Request, res: Response) {
    try {
      const { startTime, endTime } = req.query;
      
      if (!startTime || !endTime) {
        return res.status(400).json({ message: 'Start time and end time are required' });
      }
      
      const user = await this.googleCalendarService.getUserWithCalendarInfo(req.params.userId);
      
      if (!user || !user.isCalendarConnected) {
        return res.status(400).json({ message: 'User has no connected Google Calendar' });
      }
      
      const isAvailable = await this.googleCalendarService.checkAvailability(
        user,
        new Date(startTime as string),
        new Date(endTime as string)
      );
      
      return res.status(200).json({ isAvailable });
    } catch (error) {
      console.error('Error checking availability:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
} 