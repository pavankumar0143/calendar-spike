import { PrismaClient, AppointmentCalendarAvailability } from '../generated/prisma-client';
import { injectable, inject } from 'inversify';
import { IAvailabilityRepository } from '../interfaces';
import { TYPES } from '../constants';

@injectable()
export class AvailabilityRepository implements IAvailabilityRepository {
  constructor(
    @inject(TYPES.PrismaClient) private prisma: PrismaClient
  ) {}

  async findById(id: string): Promise<AppointmentCalendarAvailability | null> {
    return this.prisma.appointmentCalendarAvailability.findUnique({
      where: { id }
    });
  }

  async findByUserId(userId: string): Promise<AppointmentCalendarAvailability[]> {
    return this.prisma.appointmentCalendarAvailability.findMany({
      where: { userId }
    });
  }

  async findByDayOfWeek(userId: string, dayOfWeek: number): Promise<AppointmentCalendarAvailability[]> {
    return this.prisma.appointmentCalendarAvailability.findMany({
      where: {
        userId,
        dayOfWeek
      }
    });
  }

  async create(data: Omit<AppointmentCalendarAvailability, 'id' | 'createdAt' | 'updatedAt'>): Promise<AppointmentCalendarAvailability> {
    return this.prisma.appointmentCalendarAvailability.create({
      data
    });
  }

  async update(id: string, data: Partial<Omit<AppointmentCalendarAvailability, 'id' | 'createdAt' | 'updatedAt'>>): Promise<AppointmentCalendarAvailability> {
    return this.prisma.appointmentCalendarAvailability.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<AppointmentCalendarAvailability> {
    return this.prisma.appointmentCalendarAvailability.delete({
      where: { id }
    });
  }

  async bulkCreate(data: Omit<AppointmentCalendarAvailability, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<AppointmentCalendarAvailability[]> {
    const createdItems: AppointmentCalendarAvailability[] = [];
    
    // Using transaction to ensure all items are created or none
    await this.prisma.$transaction(async (tx) => {
      for (const item of data) {
        const created = await tx.appointmentCalendarAvailability.create({
          data: item
        });
        createdItems.push(created);
      }
    });
    
    return createdItems;
  }

  async deleteByUserId(userId: string): Promise<number> {
    const result = await this.prisma.appointmentCalendarAvailability.deleteMany({
      where: { userId }
    });
    
    return result.count;
  }
} 