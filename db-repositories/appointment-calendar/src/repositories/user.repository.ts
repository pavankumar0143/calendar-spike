import { PrismaClient, AppointmentCalendarUser } from '../generated/prisma-client';
import { injectable, inject } from 'inversify';
import { IUserRepository } from '../interfaces';
import { TYPES } from '../constants';

@injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @inject(TYPES.PrismaClient) private prisma: PrismaClient
  ) {}

  async findById(id: string): Promise<AppointmentCalendarUser | null> {
    return this.prisma.appointmentCalendarUser.findUnique({
      where: { id }
    });
  }

  async findByEmail(email: string): Promise<AppointmentCalendarUser | null> {
    return this.prisma.appointmentCalendarUser.findUnique({
      where: { email }
    });
  }

  async create(data: Omit<AppointmentCalendarUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<AppointmentCalendarUser> {
    return this.prisma.appointmentCalendarUser.create({
      data
    });
  }

  async update(id: string, data: Partial<Omit<AppointmentCalendarUser, 'id' | 'createdAt' | 'updatedAt'>>): Promise<AppointmentCalendarUser> {
    return this.prisma.appointmentCalendarUser.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<AppointmentCalendarUser> {
    return this.prisma.appointmentCalendarUser.delete({
      where: { id }
    });
  }

  async connectGoogleCalendar(id: string, googleData: {
    googleCalendarId: string;
    googleRefreshToken: string;
    googleAccessToken: string;
    googleTokenExpiry: Date;
  }): Promise<AppointmentCalendarUser> {
    return this.prisma.appointmentCalendarUser.update({
      where: { id },
      data: {
        ...googleData,
        isCalendarConnected: true
      }
    });
  }
} 