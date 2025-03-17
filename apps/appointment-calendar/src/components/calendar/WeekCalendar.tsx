import { useEffect, useState } from 'react';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import { appointmentApi, Appointment, GoogleEvent } from '@/api';
import { useUserStore, useCalendarStore, useAppointmentFormStore } from '@/store';
import { Button } from '@/components/ui/button';
import { formatDateFull } from '@/lib/utils';
import { CalendarWrapper, CalendarEvent } from './CalendarWrapper';

export function WeekCalendar() {
  const { currentUser } = useUserStore();
  const { currentDate, nextWeek, prevWeek, goToToday } = useCalendarStore();
  const { open } = useAppointmentFormStore();
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Calculate start and end of the week
  const startOfWeek = moment(currentDate).startOf('week').toDate();
  const endOfWeek = moment(currentDate).endOf('week').toDate();

  // Fetch appointments
  const { data: appointments } = useQuery({
    queryKey: ['appointments', currentUser?.id, startOfWeek, endOfWeek],
    queryFn: () => 
      currentUser 
        ? appointmentApi.getByDateRange(currentUser.id, startOfWeek, endOfWeek).then(res => res.data)
        : Promise.resolve([]),
    enabled: !!currentUser,
  });

  // Fetch Google Calendar events if user has connected their calendar
  const { data: googleEvents } = useQuery({
    queryKey: ['googleEvents', currentUser?.id, startOfWeek, endOfWeek],
    queryFn: () => 
      currentUser && currentUser.isCalendarConnected
        ? appointmentApi.getGoogleEvents(currentUser.id, startOfWeek, endOfWeek).then(res => res.data)
        : Promise.resolve([]),
    enabled: !!currentUser && currentUser.isCalendarConnected,
  });

  // Combine appointments and Google events
  useEffect(() => {
    const calendarEvents: CalendarEvent[] = [];
    
    // Add appointments
    if (appointments) {
      appointments.forEach(appointment => {
        calendarEvents.push({
          id: appointment.id,
          title: appointment.title,
          start: new Date(appointment.startTime),
          end: new Date(appointment.endTime),
          resource: appointment,
          isGoogleEvent: false,
        });
      });
    }
    
    // Add Google events
    if (googleEvents) {
      googleEvents.forEach(event => {
        // Only add if it has start and end times (all-day events don't)
        if (event.start?.dateTime && event.end?.dateTime) {
          calendarEvents.push({
            id: event.id,
            title: event.summary,
            start: new Date(event.start.dateTime),
            end: new Date(event.end.dateTime),
            resource: event,
            isGoogleEvent: true,
          });
        }
      });
    }
    
    setEvents(calendarEvents);
  }, [appointments, googleEvents]);

  const handleSelectSlot = ({ start }: { start: Date }) => {
    open(start);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    if (!event.isGoogleEvent) {
      open(event.start, event.id);
    }
  };

  const eventPropGetter = (event: CalendarEvent) => {
    const backgroundColor = event.isGoogleEvent ? '#4285F4' : '#10b981';
    return { style: { backgroundColor } };
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Button onClick={prevWeek} variant="outline" size="sm">Previous</Button>
          <Button onClick={goToToday} variant="outline" size="sm">Today</Button>
          <Button onClick={nextWeek} variant="outline" size="sm">Next</Button>
        </div>
        <h2 className="text-xl font-semibold">
          {formatDateFull(startOfWeek)} - {formatDateFull(endOfWeek)}
        </h2>
        <Button onClick={() => open(new Date())}>New Appointment</Button>
      </div>
      
      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
        <CalendarWrapper
          events={events}
          date={currentDate}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventPropGetter}
          tooltipAccessor={(event) => event.title}
          style={{ height: '100%' }}
        />
      </div>
    </div>
  );
} 