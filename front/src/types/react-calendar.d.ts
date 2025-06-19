declare module 'react-calendar' {
  import React from 'react';

  export interface CalendarProps {
    onChange?: (value: Date | Date[]) => void;
    value?: Date | Date[];
    minDate?: Date;
    maxDate?: Date;
    minDetail?: 'month' | 'year' | 'decade' | 'century';
    maxDetail?: 'month' | 'year' | 'decade' | 'century';
    defaultView?: 'month' | 'year' | 'decade' | 'century';
    navigationLabel?: ({ date, view, label }: { date: Date; view: string; label: string }) => string;
    tileClassName?: (
      { date, view }: { date: Date; view: string }
    ) => string | string[] | null;
    tileContent?: (
      { date, view }: { date: Date; view: string }
    ) => React.ReactNode;
    tileDisabled?: ({ date, view }: { date: Date; view: string }) => boolean;
    showNeighboringMonth?: boolean;
    showNavigation?: boolean;
    showFixedNumberOfWeeks?: boolean;
    locale?: string;
    formatShortWeekday?: (locale: string, date: Date) => string;
    formatMonth?: (locale: string, date: Date) => string;
    onClickDay?: (value: Date) => void;
    onClickMonth?: (value: Date) => void;
    onClickYear?: (value: Date) => void;
    onClickDecade?: (value: Date) => void;
    onDrillDown?: ({ activeStartDate, view }: { activeStartDate: Date; view: string }) => void;
    onDrillUp?: ({ activeStartDate, view }: { activeStartDate: Date; view: string }) => void;
    onActiveStartDateChange?: (
      { activeStartDate, view }: { activeStartDate: Date; view: string }
    ) => void;
    onViewChange?: ({ activeStartDate, view }: { activeStartDate: Date; view: string }) => void;
    prevLabel?: React.ReactNode;
    prev2Label?: React.ReactNode;
    nextLabel?: React.ReactNode;
    next2Label?: React.ReactNode;
    className?: string;
    calendarType?: 'ISO 8601' | 'US' | 'Arabic' | 'Hebrew';
    selectRange?: boolean;
    allowPartialRange?: boolean;
    activeStartDate?: Date;
    returnValue?: 'start' | 'end' | 'range';
  }

  export default class Calendar extends React.Component<CalendarProps> {}
}