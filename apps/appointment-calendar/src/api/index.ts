import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  googleCalendarId?: string;
  isCalendarConnected: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  googleEventId?: string;
  location?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Availability {
  id: string;
  userId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GoogleEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location?: string;
}

// User API
export const userApi = {
  getById: (id: string) => apiClient.get<User>(`/users/${id}`),
  getByEmail: (email: string) => apiClient.get<User>(`/users/email/${email}`),
  create: (data: { email: string; name: string }) => apiClient.post<User>('/users', data),
  update: (id: string, data: { name: string }) => apiClient.put<User>(`/users/${id}`, data),
  delete: (id: string) => apiClient.delete(`/users/${id}`),
  getGoogleAuthUrl: () => apiClient.get<{ authUrl: string }>('/users/google/auth-url'),
  connectGoogleCalendar: (id: string, code: string) => 
    apiClient.post<User>(`/users/${id}/google/connect`, { code }),
};

// Appointment API
export const appointmentApi = {
  getById: (id: string) => apiClient.get<Appointment>(`/appointments/${id}`),
  getByUserId: (userId: string) => apiClient.get<Appointment[]>(`/appointments/user/${userId}`),
  getByDateRange: (userId: string, startDate: Date, endDate: Date) => 
    apiClient.get<Appointment[]>(`/appointments/user/${userId}/range`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    }),
  create: (data: {
    userId: string;
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    location?: string;
  }) => apiClient.post<Appointment>('/appointments', {
    ...data,
    startTime: data.startTime.toISOString(),
    endTime: data.endTime.toISOString(),
  }),
  update: (id: string, data: {
    title?: string;
    description?: string;
    startTime?: Date | string;
    endTime?: Date | string;
    location?: string;
    status?: string;
  }) => {
    const formattedData = { ...data };
    if (data.startTime) formattedData.startTime = data.startTime.toString();
    if (data.endTime) formattedData.endTime = data.endTime.toString();
    
    return apiClient.put<Appointment>(`/appointments/${id}`, formattedData);
  },
  delete: (id: string) => apiClient.delete(`/appointments/${id}`),
  getGoogleEvents: (userId: string, startDate: Date, endDate: Date) => 
    apiClient.get<GoogleEvent[]>(`/appointments/user/${userId}/google-events`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    }),
  checkAvailability: (userId: string, startTime: Date, endTime: Date) => 
    apiClient.get<{ isAvailable: boolean }>(`/appointments/user/${userId}/check-availability`, {
      params: {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      },
    }),
};

// Availability API
export const availabilityApi = {
  getById: (id: string) => apiClient.get<Availability>(`/availability/${id}`),
  getByUserId: (userId: string) => apiClient.get<Availability[]>(`/availability/user/${userId}`),
  getByDayOfWeek: (userId: string, dayOfWeek: number) => 
    apiClient.get<Availability[]>(`/availability/user/${userId}/day/${dayOfWeek}`),
  create: (data: {
    userId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable?: boolean;
  }) => apiClient.post<Availability>('/availability', data),
  bulkCreate: (items: {
    userId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable?: boolean;
  }[]) => apiClient.post<Availability[]>('/availability/bulk', { items }),
  update: (id: string, data: {
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
    isAvailable?: boolean;
  }) => apiClient.put<Availability>(`/availability/${id}`, data),
  delete: (id: string) => apiClient.delete(`/availability/${id}`),
  deleteByUserId: (userId: string) => apiClient.delete<{ count: number }>(`/availability/user/${userId}`),
}; 