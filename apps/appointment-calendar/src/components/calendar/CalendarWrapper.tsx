import React from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup the localizer
const localizer = momentLocalizer(moment);

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: any;
  isGoogleEvent?: boolean;
}

interface CalendarWrapperProps {
  events: CalendarEvent[];
  date: Date;
  onSelectSlot: (slotInfo: { start: Date; end: Date; slots: Date[]; action: string }) => void;
  onSelectEvent: (event: CalendarEvent) => void;
  eventPropGetter: (event: CalendarEvent) => { style?: React.CSSProperties };
  tooltipAccessor: (event: CalendarEvent) => string;
  style?: React.CSSProperties;
}

export const CalendarWrapper: React.FC<CalendarWrapperProps> = ({
  events,
  date,
  onSelectSlot,
  onSelectEvent,
  eventPropGetter,
  tooltipAccessor,
  style
}) => {
  return (
    <div style={style}>
      {/* @ts-ignore - Ignoring type issues with react-big-calendar */}
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        views={['week']}
        date={date}
        onNavigate={() => {}} // We handle navigation with our own buttons
        selectable
        onSelectSlot={onSelectSlot}
        onSelectEvent={onSelectEvent}
        eventPropGetter={eventPropGetter}
        tooltipAccessor={tooltipAccessor}
        dayLayoutAlgorithm="no-overlap"
      />
    </div>
  );
}; 