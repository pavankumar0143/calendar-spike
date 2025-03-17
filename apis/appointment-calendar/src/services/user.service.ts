import { injectable, inject } from 'inversify';
import { IUserRepository } from 'appointment-calendar-db-repositories';
import { TYPES } from '../types';
import { CreateUserDto, UpdateUserDto, GoogleCalendarCredentials } from '../types';

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async findById(id: string) {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async create(data: CreateUserDto) {
    return this.userRepository.create({
      ...data,
      googleCalendarId: data.googleCalendarId ?? null,
      googleRefreshToken: data.googleRefreshToken ?? null,
      googleAccessToken: data.googleAccessToken ?? null,
      googleTokenExpiry: data.googleTokenExpiry ?? null,
      isCalendarConnected: data.isCalendarConnected ?? false
    });
  }

  async update(id: string, data: UpdateUserDto) {
    return this.userRepository.update(id, data);
  }

  async delete(id: string) {
    return this.userRepository.delete(id);
  }

  async connectGoogleCalendar(id: string, googleData: GoogleCalendarCredentials) {
    return this.userRepository.connectGoogleCalendar(id, googleData);
  }
} 