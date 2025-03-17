import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { controller, httpGet, httpPost, httpPut, httpDelete } from 'inversify-express-utils';
import { UserService, GoogleCalendarService } from '../services';
import { TYPES } from '../types';

@controller('/api/users')
export class UserController {
  constructor(
    @inject(TYPES.UserService) private userService: UserService,
    @inject(TYPES.GoogleCalendarService) private googleCalendarService: GoogleCalendarService
  ) {}

  @httpGet('/:id')
  async getUser(req: Request, res: Response) {
    try {
      const user = await this.userService.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json(user);
    } catch (error) {
      console.error('Error getting user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @httpGet('/email/:email')
  async getUserByEmail(req: Request, res: Response) {
    try {
      const user = await this.userService.findByEmail(req.params.email);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json(user);
    } catch (error) {
      console.error('Error getting user by email:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @httpPost('/')
  async createUser(req: Request, res: Response) {
    try {
      const { email, name } = req.body;
      
      if (!email || !name) {
        return res.status(400).json({ message: 'Email and name are required' });
      }
      
      // Check if user already exists
      const existingUser = await this.userService.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'User with this email already exists' });
      }
      
      const user = await this.userService.create({ email, name });
      return res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @httpPut('/:id')
  async updateUser(req: Request, res: Response) {
    try {
      const { name } = req.body;
      
      const user = await this.userService.update(req.params.id, { name });
      return res.status(200).json(user);
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @httpDelete('/:id')
  async deleteUser(req: Request, res: Response) {
    try {
      await this.userService.delete(req.params.id);
      return res.status(204).send();
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @httpGet('/google/auth-url')
  getGoogleAuthUrl(req: Request, res: Response) {
    try {
      const authUrl = this.googleCalendarService.getAuthUrl();
      return res.status(200).json({ authUrl });
    } catch (error) {
      console.error('Error generating Google auth URL:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @httpPost('/:id/google/connect')
  async connectGoogleCalendar(req: Request, res: Response) {
    try {
      const { code } = req.body;
      
      if (!code) {
        return res.status(400).json({ message: 'Authorization code is required' });
      }
      
      // Get tokens from code
      const tokens = await this.googleCalendarService.getTokensFromCode(code);
      
      if (!tokens.access_token || !tokens.refresh_token) {
        return res.status(400).json({ message: 'Invalid authorization code' });
      }
      
      // Connect Google Calendar to user
      const user = await this.userService.connectGoogleCalendar(req.params.id, {
        googleCalendarId: 'primary', // Default to primary calendar
        googleRefreshToken: tokens.refresh_token,
        googleAccessToken: tokens.access_token,
        googleTokenExpiry: new Date(tokens.expiry_date)
      });
      
      return res.status(200).json(user);
    } catch (error) {
      console.error('Error connecting Google Calendar:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
} 