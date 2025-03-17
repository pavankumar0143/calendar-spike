import { create } from 'zustand';
import { User } from '@/api';

interface UserState {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
}));

interface CalendarState {
  currentDate: Date;
  view: 'week' | 'day';
  setCurrentDate: (date: Date) => void;
  setView: (view: 'week' | 'day') => void;
  nextWeek: () => void;
  prevWeek: () => void;
  goToToday: () => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  currentDate: new Date(),
  view: 'week',
  setCurrentDate: (date) => set({ currentDate: date }),
  setView: (view) => set({ view }),
  nextWeek: () => set((state) => {
    const newDate = new Date(state.currentDate);
    newDate.setDate(newDate.getDate() + 7);
    return { currentDate: newDate };
  }),
  prevWeek: () => set((state) => {
    const newDate = new Date(state.currentDate);
    newDate.setDate(newDate.getDate() - 7);
    return { currentDate: newDate };
  }),
  goToToday: () => set({ currentDate: new Date() }),
}));

interface AppointmentFormState {
  isOpen: boolean;
  appointmentId: string | null;
  defaultDate: Date | null;
  open: (date?: Date | null, appointmentId?: string | null) => void;
  close: () => void;
}

export const useAppointmentFormStore = create<AppointmentFormState>((set) => ({
  isOpen: false,
  appointmentId: null,
  defaultDate: null,
  open: (date = null, appointmentId = null) => set({ 
    isOpen: true, 
    defaultDate: date,
    appointmentId 
  }),
  close: () => set({ isOpen: false, appointmentId: null, defaultDate: null }),
})); 