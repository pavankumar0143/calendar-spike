import { PrismaClient, AppointmentCalendarAppointment } from '../generated/prisma-client';
import { injectable, inject } from 'inversify';
import { IAppointmentRepository } from '../interfaces';
import { TYPES } from '../constants';

@injectable()
export class AppointmentRepository implements IAppointmentRepository {
  constructor(
    @inject(TYPES.PrismaClient) private prisma: PrismaClient
  ) {}

  async findById(id: string): Promise<AppointmentCalendarAppointment | null> {
    return this.prisma.appointmentCalendarAppointment.findUnique({
      where: { id }
    });
  }

  async findByUserId(userId: string): Promise<AppointmentCalendarAppointment[]> {
    return this.prisma.appointmentCalendarAppointment.findMany({
      where: { userId }
    });
  }

  async findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<AppointmentCalendarAppointment[]> {
    return this.prisma.appointmentCalendarAppointment.findMany({
      where: {
        userId,
        AND: [
          { startTime: { gte: startDate } },
          { endTime: { lte: endDate } }
        ]
      }
    });
  }

  async create(data: Omit<AppointmentCalendarAppointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<AppointmentCalendarAppointment> {
    return this.prisma.appointmentCalendarAppointment.create({
      data
    });
  }

  async update(id: string, data: Partial<Omit<AppointmentCalendarAppointment, 'id' | 'createdAt' | 'updatedAt'>>): Promise<AppointmentCalendarAppointment> {
    return this.prisma.appointmentCalendarAppointment.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<AppointmentCalendarAppointment> {
    return this.prisma.appointmentCalendarAppointment.delete({
      where: { id }
    });
  }

  async updateGoogleEventId(id: string, googleEventId: string): Promise<AppointmentCalendarAppointment> {
    return this.prisma.appointmentCalendarAppointment.update({
      where: { id },
      data: { googleEventId }
    });
  }
} 