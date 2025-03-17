export const TYPES = {
  // Services
  UserService: Symbol.for('UserService'),
  AppointmentService: Symbol.for('AppointmentService'),
  AvailabilityService: Symbol.for('AvailabilityService'),
  GoogleCalendarService: Symbol.for('GoogleCalendarService'),
  
  // Repositories (from db-repositories)
  UserRepository: Symbol.for('UserRepository'),
  AppointmentRepository: Symbol.for('AppointmentRepository'),
  AvailabilityRepository: Symbol.for('AvailabilityRepository')
};

export interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  scope: string;
  token_type: string;
  expiry_date: number;
}

export interface CreateAppointmentDto {
  userId: string;
  title: string;
  description?: string | null;
  startTime: Date;
  endTime: Date;
  location?: string | null;
  googleEventId?: string | null;
  status?: string;
}

export interface UpdateAppointmentDto {
  title?: string;
  description?: string | null;
  startTime?: Date;
  endTime?: Date;
  location?: string | null;
  status?: string;
}

export interface CreateAvailabilityDto {
  userId: string;
  dayOfWeek: number;
  startTime: string; // Format: "HH:MM:SS"
  endTime: string; // Format: "HH:MM:SS"
  isAvailable: boolean;
}

export interface UpdateAvailabilityDto {
  dayOfWeek?: number;
  startTime?: string; // Format: "HH:MM:SS"
  endTime?: string; // Format: "HH:MM:SS"
  isAvailable?: boolean;
}

export interface CreateUserDto {
  email: string;
  name: string;
  googleCalendarId?: string | null;
  googleRefreshToken?: string | null;
  googleAccessToken?: string | null;
  googleTokenExpiry?: Date | null;
  isCalendarConnected?: boolean;
}

export interface UpdateUserDto {
  name?: string;
}

export interface GoogleCalendarCredentials {
  googleCalendarId: string;
  googleRefreshToken: string;
  googleAccessToken: string;
  googleTokenExpiry: Date;
} 