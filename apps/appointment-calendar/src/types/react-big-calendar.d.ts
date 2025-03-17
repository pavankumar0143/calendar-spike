import { ComponentType } from 'react';

declare module 'react-big-calendar' {
  import { Moment } from 'moment';
  import * as React from 'react';

  export interface Event {
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    resource?: any;
  }

  export interface DateRange {
    start: Date;
    end: Date;
  }

  export type DateFormatFunction = (date: Date, culture?: string, localizer?: any) => string;
  export type DateRangeFormatFunction = (range: DateRange, culture?: string, localizer?: any) => string;

  export interface Formats {
    dateFormat?: string | DateFormatFunction;
    dayFormat?: string | DateFormatFunction;
    weekdayFormat?: string | DateFormatFunction;
    timeGutterFormat?: string | DateFormatFunction;
    monthHeaderFormat?: string | DateFormatFunction;
    dayRangeHeaderFormat?: string | DateRangeFormatFunction;
    dayHeaderFormat?: string | DateFormatFunction;
    agendaHeaderFormat?: string | DateFormatFunction;
    selectRangeFormat?: string | DateRangeFormatFunction;
    agendaDateFormat?: string | DateFormatFunction;
    agendaTimeFormat?: string | DateFormatFunction;
    agendaTimeRangeFormat?: string | DateRangeFormatFunction;
    eventTimeRangeFormat?: string | DateRangeFormatFunction;
    eventTimeRangeStartFormat?: string | DateFormatFunction;
    eventTimeRangeEndFormat?: string | DateFormatFunction;
  }

  export interface Components<TEvent extends Event = Event> {
    event?: ComponentType<any>;
    eventWrapper?: ComponentType<any>;
    dayWrapper?: ComponentType<any>;
    dateCellWrapper?: ComponentType<any>;
    toolbar?: ComponentType<any>;
    agenda?: {
      date?: ComponentType<any>;
      time?: ComponentType<any>;
      event?: ComponentType<any>;
    };
    day?: {
      header?: ComponentType<any>;
      event?: ComponentType<any>;
    };
    week?: {
      header?: ComponentType<any>;
      event?: ComponentType<any>;
    };
    month?: {
      header?: ComponentType<any>;
      dateHeader?: ComponentType<any>;
      event?: ComponentType<any>;
    };
  }

  export interface CalendarProps<TEvent extends Event = Event, TResource = any> {
    localizer: any;
    events: TEvent[];
    culture?: string;
    components?: Components<TEvent>;
    formats?: Formats;
    messages?: any;
    views?: any;
    view?: string;
    date?: Date;
    startAccessor?: string | ((event: TEvent) => Date);
    endAccessor?: string | ((event: TEvent) => Date);
    titleAccessor?: string | ((event: TEvent) => string);
    allDayAccessor?: string | ((event: TEvent) => boolean);
    tooltipAccessor?: string | ((event: TEvent) => string);
    resourceAccessor?: string | ((event: TEvent) => TResource);
    resources?: TResource[];
    resourceIdAccessor?: string | ((resource: TResource) => string | number);
    resourceTitleAccessor?: string | ((resource: TResource) => string);
    defaultView?: string;
    defaultDate?: Date;
    className?: string;
    style?: React.CSSProperties;
    eventPropGetter?: (event: TEvent, start: Date, end: Date, isSelected: boolean) => { className?: string, style?: React.CSSProperties };
    slotPropGetter?: (date: Date) => { className?: string, style?: React.CSSProperties };
    dayPropGetter?: (date: Date) => { className?: string, style?: React.CSSProperties };
    showMultiDayTimes?: boolean;
    min?: Date;
    max?: Date;
    scrollToTime?: Date;
    popup?: boolean;
    popupOffset?: number | { x: number, y: number };
    selectable?: boolean | 'ignoreEvents';
    longPressThreshold?: number;
    step?: number;
    timeslots?: number;
    rtl?: boolean;
    onNavigate?: (newDate: Date, view: string, action: 'PREV' | 'NEXT' | 'DATE') => void;
    onView?: (view: string) => void;
    onDrillDown?: (date: Date, view: string) => void;
    onSelectSlot?: (slotInfo: { start: Date, end: Date, slots: Date[], action: 'select' | 'click' | 'doubleClick' }) => void;
    onDoubleClickEvent?: (event: TEvent, e: React.SyntheticEvent) => void;
    onSelectEvent?: (event: TEvent, e: React.SyntheticEvent) => void;
    onSelecting?: (range: { start: Date, end: Date }) => boolean | undefined;
    selected?: any;
    getNow?: () => Date;
    dayLayoutAlgorithm?: 'overlap' | 'no-overlap' | ((events: TEvent[], minimumStartDifference: number) => TEvent[]);
  }

  // Explicitly define the Calendar component as a function component
  export const Calendar: React.FC<CalendarProps>;

  export function momentLocalizer(moment: any): any;
  export function dateFnsLocalizer(params: any): any;
  export function globalizeLocalizer(globalizeInstance: any): any;
} 