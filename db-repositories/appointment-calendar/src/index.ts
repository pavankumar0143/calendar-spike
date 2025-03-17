import 'reflect-metadata';
import { Container } from 'inversify';
import { PrismaClient } from './generated/prisma-client';
import { TYPES } from './constants';
import { 
  UserRepository, 
  AppointmentRepository, 
  AvailabilityRepository 
} from './repositories';
import { 
  IUserRepository, 
  IAppointmentRepository, 
  IAvailabilityRepository 
} from './interfaces';

// Create and configure container
const container = new Container();

// Register Prisma client
container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(new PrismaClient());

// Register repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IAppointmentRepository>(TYPES.AppointmentRepository).to(AppointmentRepository);
container.bind<IAvailabilityRepository>(TYPES.AvailabilityRepository).to(AvailabilityRepository);

export { container };
export * from './interfaces';
export * from './constants';
export * from './repositories'; 