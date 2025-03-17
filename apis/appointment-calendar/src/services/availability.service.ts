import { injectable, inject } from 'inversify';
import { IAvailabilityRepository } from 'appointment-calendar-db-repositories';
import { TYPES } from '../types';
import { CreateAvailabilityDto, UpdateAvailabilityDto } from '../types';

@injectable()
export class AvailabilityService {
  constructor(
    @inject(TYPES.AvailabilityRepository) private availabilityRepository: IAvailabilityRepository
  ) {}

  async findById(id: string) {
    return this.availabilityRepository.findById(id);
  }

  async findByUserId(userId: string) {
    return this.availabilityRepository.findByUserId(userId);
  }

  async findByDayOfWeek(userId: string, dayOfWeek: number) {
    return this.availabilityRepository.findByDayOfWeek(userId, dayOfWeek);
  }

  async create(data: CreateAvailabilityDto) {
    // Convert string time to Date objects for Prisma
    const startTimeDate = new Date(`1970-01-01T${data.startTime}Z`);
    const endTimeDate = new Date(`1970-01-01T${data.endTime}Z`);
    
    return this.availabilityRepository.create({
      ...data,
      startTime: startTimeDate,
      endTime: endTimeDate
    });
  }

  async update(id: string, data: UpdateAvailabilityDto) {
    const updateData: any = { ...data };
    
    // Convert string time to Date objects for Prisma if provided
    if (data.startTime) {
      updateData.startTime = new Date(`1970-01-01T${data.startTime}Z`);
    }
    
    if (data.endTime) {
      updateData.endTime = new Date(`1970-01-01T${data.endTime}Z`);
    }
    
    return this.availabilityRepository.update(id, updateData);
  }

  async delete(id: string) {
    return this.availabilityRepository.delete(id);
  }

  async bulkCreate(data: CreateAvailabilityDto[]) {
    // Convert string time to Date objects for Prisma
    const formattedData = data.map(item => ({
      ...item,
      startTime: new Date(`1970-01-01T${item.startTime}Z`),
      endTime: new Date(`1970-01-01T${item.endTime}Z`)
    }));
    
    return this.availabilityRepository.bulkCreate(formattedData);
  }

  async deleteByUserId(userId: string) {
    return this.availabilityRepository.deleteByUserId(userId);
  }
} 