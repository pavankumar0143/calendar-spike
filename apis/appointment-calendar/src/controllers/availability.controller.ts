import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { controller, httpGet, httpPost, httpPut, httpDelete } from 'inversify-express-utils';
import { AvailabilityService } from '../services';
import { TYPES } from '../types';

@controller('/api/availability')
export class AvailabilityController {
  constructor(
    @inject(TYPES.AvailabilityService) private availabilityService: AvailabilityService
  ) {}

  @httpGet('/:id')
  async getAvailability(req: Request, res: Response) {
    try {
      const availability = await this.availabilityService.findById(req.params.id);
      
      if (!availability) {
        return res.status(404).json({ message: 'Availability not found' });
      }
      
      return res.status(200).json(availability);
    } catch (error) {
      console.error('Error getting availability:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @httpGet('/user/:userId')
  async getAvailabilityByUser(req: Request, res: Response) {
    try {
      const availability = await this.availabilityService.findByUserId(req.params.userId);
      return res.status(200).json(availability);
    } catch (error) {
      console.error('Error getting availability by user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @httpGet('/user/:userId/day/:dayOfWeek')
  async getAvailabilityByDay(req: Request, res: Response) {
    try {
      const dayOfWeek = parseInt(req.params.dayOfWeek, 10);
      
      if (isNaN(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
        return res.status(400).json({ message: 'Day of week must be a number between 0 and 6' });
      }
      
      const availability = await this.availabilityService.findByDayOfWeek(req.params.userId, dayOfWeek);
      return res.status(200).json(availability);
    } catch (error) {
      console.error('Error getting availability by day:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @httpPost('/')
  async createAvailability(req: Request, res: Response) {
    try {
      const { userId, dayOfWeek, startTime, endTime, isAvailable } = req.body;
      
      if (userId === undefined || dayOfWeek === undefined || !startTime || !endTime) {
        return res.status(400).json({ message: 'User ID, day of week, start time, and end time are required' });
      }
      
      if (isNaN(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
        return res.status(400).json({ message: 'Day of week must be a number between 0 and 6' });
      }
      
      const availability = await this.availabilityService.create({
        userId,
        dayOfWeek,
        startTime,
        endTime,
        isAvailable: isAvailable !== undefined ? isAvailable : true
      });
      
      return res.status(201).json(availability);
    } catch (error) {
      console.error('Error creating availability:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @httpPost('/bulk')
  async bulkCreateAvailability(req: Request, res: Response) {
    try {
      const { items } = req.body;
      
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Items array is required' });
      }
      
      // Validate each item
      for (const item of items) {
        const { userId, dayOfWeek, startTime, endTime } = item;
        
        if (userId === undefined || dayOfWeek === undefined || !startTime || !endTime) {
          return res.status(400).json({ message: 'Each item must have user ID, day of week, start time, and end time' });
        }
        
        if (isNaN(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
          return res.status(400).json({ message: 'Day of week must be a number between 0 and 6' });
        }
      }
      
      const availability = await this.availabilityService.bulkCreate(items);
      return res.status(201).json(availability);
    } catch (error) {
      console.error('Error bulk creating availability:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @httpPut('/:id')
  async updateAvailability(req: Request, res: Response) {
    try {
      const { dayOfWeek, startTime, endTime, isAvailable } = req.body;
      
      const updateData: any = {};
      
      if (dayOfWeek !== undefined) {
        if (isNaN(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
          return res.status(400).json({ message: 'Day of week must be a number between 0 and 6' });
        }
        updateData.dayOfWeek = dayOfWeek;
      }
      
      if (startTime !== undefined) updateData.startTime = startTime;
      if (endTime !== undefined) updateData.endTime = endTime;
      if (isAvailable !== undefined) updateData.isAvailable = isAvailable;
      
      const availability = await this.availabilityService.update(req.params.id, updateData);
      return res.status(200).json(availability);
    } catch (error) {
      console.error('Error updating availability:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @httpDelete('/:id')
  async deleteAvailability(req: Request, res: Response) {
    try {
      await this.availabilityService.delete(req.params.id);
      return res.status(204).send();
    } catch (error) {
      console.error('Error deleting availability:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @httpDelete('/user/:userId')
  async deleteAvailabilityByUser(req: Request, res: Response) {
    try {
      const count = await this.availabilityService.deleteByUserId(req.params.userId);
      return res.status(200).json({ count });
    } catch (error) {
      console.error('Error deleting availability by user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
} 