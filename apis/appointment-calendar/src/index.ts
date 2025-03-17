import 'reflect-metadata';
import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import { container as dbContainer } from 'appointment-calendar-db-repositories';
import { TYPES } from './types';
import { 
  UserService, 
  AppointmentService, 
  AvailabilityService, 
  GoogleCalendarService 
} from './services';

// Import controllers (required for inversify-express-utils to work)
import './controllers';

// Load environment variables
dotenv.config();

// Create container
const container = new Container();

// Bind services
container.bind(TYPES.UserService).to(UserService);
container.bind(TYPES.AppointmentService).to(AppointmentService);
container.bind(TYPES.AvailabilityService).to(AvailabilityService);
container.bind(TYPES.GoogleCalendarService).to(GoogleCalendarService);

// Bind repositories from db-repositories container
container.bind(TYPES.UserRepository).toConstantValue(dbContainer.get(TYPES.UserRepository));
container.bind(TYPES.AppointmentRepository).toConstantValue(dbContainer.get(TYPES.AppointmentRepository));
container.bind(TYPES.AvailabilityRepository).toConstantValue(dbContainer.get(TYPES.AvailabilityRepository));

// Create server
const server = new InversifyExpressServer(container);

server.setConfig((app) => {
  // Middleware
  app.use(cors());
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(express.json());
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });
});

// Build express app
const app = server.build();
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 