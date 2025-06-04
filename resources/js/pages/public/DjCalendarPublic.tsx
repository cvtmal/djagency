// @ts-nocheck - Disable type checking for shadcn UI components
import React from 'react';
import { Head } from '@inertiajs/react';
import PublicDjCalendar from '@/components/booking/public-dj-calendar';
import { ToastProvider } from '@/components/ui/toast';
import { type DJ } from '@/types/models';

type DateInfo = {
  id?: number;
  date: string;
  status: string;
  is_custom_date: boolean;
  note?: string | null;
  day_name: string;
};

type CalendarMonth = {
  [date: string]: DateInfo;
};

type CalendarData = {
  [monthKey: string]: CalendarMonth;
};

type StatusInfo = {
  label: string;
  color: string;
};

type DjCalendarPublicPageProps = {
  dj: DJ;
  calendarData: CalendarData;
  customDates: DateInfo[];
  year: number;
  availabilityStatuses: {
    [key: string]: StatusInfo;
  };
};

export default function DjCalendarPublicPage({ 
  dj, 
  calendarData, 
  customDates, 
  year, 
  availabilityStatuses 
}: DjCalendarPublicPageProps) {
  return (
    <>
      <Head title={`${dj.name}'s Calendar`} />
      <ToastProvider>
        <PublicDjCalendar 
          dj={dj} 
          calendarData={calendarData} 
          customDates={customDates}
          year={year}
          availabilityStatuses={availabilityStatuses}
        />
      </ToastProvider>
    </>
  );
}
