import { injectable, inject } from 'inversify';
import { google, calendar_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { IUserRepository } from 'appointment-calendar-db-repositories';
import { TYPES } from '../types';
import { GoogleTokens } from '../types';

@injectable()
export class GoogleCalendarService {
  private readonly oauth2Client: OAuth2Client;
  
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {
    // Initialize OAuth2 client
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  // Get the Google OAuth URL for authorization
  getAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent' // Force to get refresh token
    });
  }

  // Exchange authorization code for tokens
  async getTokensFromCode(code: string): Promise<GoogleTokens> {
    const { tokens } = await this.oauth2Client.getToken(code);
    return tokens as GoogleTokens;
  }

  // Get user with calendar info
  async getUserWithCalendarInfo(userId: string) {
    return this.userRepository.findById(userId);
  }

  // Set up OAuth client with user's tokens
  private setupOAuth2Client(user: any) {
    if (!user.googleAccessToken || !user.googleRefreshToken) {
      throw new Error('User has no Google Calendar credentials');
    }

    this.oauth2Client.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken,
      expiry_date: user.googleTokenExpiry?.getTime() || 0
    });

    // Set up token refresh callback
    this.oauth2Client.on('tokens', async (tokens) => {
      if (tokens.access_token) {
        await this.userRepository.update(user.id, {
          googleAccessToken: tokens.access_token
        });
      }
      
      if (tokens.refresh_token) {
        await this.userRepository.update(user.id, {
          googleRefreshToken: tokens.refresh_token
        });
      }
      
      if (tokens.expiry_date) {
        await this.userRepository.update(user.id, {
          googleTokenExpiry: new Date(tokens.expiry_date)
        });
      }
    });

    return this.oauth2Client;
  }

  // Create a calendar event
  async createEvent(
    user: any,
    title: string,
    description: string,
    startTime: Date,
    endTime: Date,
    location?: string
  ): Promise<string | null> {
    try {
      const auth = this.setupOAuth2Client(user);
      const calendar = google.calendar({ version: 'v3', auth });

      const event: calendar_v3.Schema$Event = {
        summary: title,
        description,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: 'UTC'
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: 'UTC'
        }
      };

      if (location) {
        event.location = location;
      }

      const response = await calendar.events.insert({
        calendarId: user.googleCalendarId || 'primary',
        requestBody: event
      });

      return response.data.id || null;
    } catch (error) {
      console.error('Error creating Google Calendar event:', error);
      throw error;
    }
  }

  // Update a calendar event
  async updateEvent(
    user: any,
    eventId: string,
    title: string,
    description: string,
    startTime: Date,
    endTime: Date,
    location?: string
  ): Promise<void> {
    try {
      const auth = this.setupOAuth2Client(user);
      const calendar = google.calendar({ version: 'v3', auth });

      const event: calendar_v3.Schema$Event = {
        summary: title,
        description,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: 'UTC'
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: 'UTC'
        }
      };

      if (location) {
        event.location = location;
      }

      await calendar.events.update({
        calendarId: user.googleCalendarId || 'primary',
        eventId,
        requestBody: event
      });
    } catch (error) {
      console.error('Error updating Google Calendar event:', error);
      throw error;
    }
  }

  // Delete a calendar event
  async deleteEvent(user: any, eventId: string): Promise<void> {
    try {
      const auth = this.setupOAuth2Client(user);
      const calendar = google.calendar({ version: 'v3', auth });

      await calendar.events.delete({
        calendarId: user.googleCalendarId || 'primary',
        eventId
      });
    } catch (error) {
      console.error('Error deleting Google Calendar event:', error);
      throw error;
    }
  }

  // List events from a user's calendar
  async listEvents(
    user: any,
    startTime: Date,
    endTime: Date
  ): Promise<calendar_v3.Schema$Event[]> {
    try {
      const auth = this.setupOAuth2Client(user);
      const calendar = google.calendar({ version: 'v3', auth });

      const response = await calendar.events.list({
        calendarId: user.googleCalendarId || 'primary',
        timeMin: startTime.toISOString(),
        timeMax: endTime.toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      });

      return response.data.items || [];
    } catch (error) {
      console.error('Error listing Google Calendar events:', error);
      throw error;
    }
  }

  // Check availability in a user's calendar
  async checkAvailability(
    user: any,
    startTime: Date,
    endTime: Date
  ): Promise<boolean> {
    try {
      const events = await this.listEvents(user, startTime, endTime);
      
      // If there are no events, the time slot is available
      if (events.length === 0) {
        return true;
      }
      
      // Check if any event overlaps with the requested time slot
      for (const event of events) {
        if (event.start?.dateTime && event.end?.dateTime) {
          const eventStart = new Date(event.start.dateTime);
          const eventEnd = new Date(event.end.dateTime);
          
          // Check for overlap
          if (
            (startTime >= eventStart && startTime < eventEnd) ||
            (endTime > eventStart && endTime <= eventEnd) ||
            (startTime <= eventStart && endTime >= eventEnd)
          ) {
            return false;
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error checking availability in Google Calendar:', error);
      throw error;
    }
  }
} 