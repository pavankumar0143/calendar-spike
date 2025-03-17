import { AppointmentCalendarUser, AppointmentCalendarAppointment, AppointmentCalendarAvailability } from '../generated/prisma-client';

export interface IUserRepository {
  findById(id: string): Promise<AppointmentCalendarUser | null>;
  findByEmail(email: string): Promise<AppointmentCalendarUser | null>;
  create(data: Omit<AppointmentCalendarUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<AppointmentCalendarUser>;
  update(id: string, data: Partial<Omit<AppointmentCalendarUser, 'id' | 'createdAt' | 'updatedAt'>>): Promise<AppointmentCalendarUser>;
  delete(id: string): Promise<AppointmentCalendarUser>;
  connectGoogleCalendar(id: string, googleData: {
    googleCalendarId: string;
    googleRefreshToken: string;
    googleAccessToken: string;
    googleTokenExpiry: Date;
  }): Promise<AppointmentCalendarUser>;
}

export interface IAppointmentRepository {
  findById(id: string): Promise<AppointmentCalendarAppointment | null>;
  findByUserId(userId: string): Promise<AppointmentCalendarAppointment[]>;
  findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<AppointmentCalendarAppointment[]>;
  create(data: Omit<AppointmentCalendarAppointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<AppointmentCalendarAppointment>;
  update(id: string, data: Partial<Omit<AppointmentCalendarAppointment, 'id' | 'createdAt' | 'updatedAt'>>): Promise<AppointmentCalendarAppointment>;
  delete(id: string): Promise<AppointmentCalendarAppointment>;
  updateGoogleEventId(id: string, googleEventId: string): Promise<AppointmentCalendarAppointment>;
}

export interface IAvailabilityRepository {
  findById(id: string): Promise<AppointmentCalendarAvailability | null>;
  findByUserId(userId: string): Promise<AppointmentCalendarAvailability[]>;
  findByDayOfWeek(userId: string, dayOfWeek: number): Promise<AppointmentCalendarAvailability[]>;
  create(data: Omit<AppointmentCalendarAvailability, 'id' | 'createdAt' | 'updatedAt'>): Promise<AppointmentCalendarAvailability>;
  update(id: string, data: Partial<Omit<AppointmentCalendarAvailability, 'id' | 'createdAt' | 'updatedAt'>>): Promise<AppointmentCalendarAvailability>;
  delete(id: string): Promise<AppointmentCalendarAvailability>;
  bulkCreate(data: Omit<AppointmentCalendarAvailability, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<AppointmentCalendarAvailability[]>;
  deleteByUserId(userId: string): Promise<number>;
} 