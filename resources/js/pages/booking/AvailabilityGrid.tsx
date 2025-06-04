import React from 'react';
import { Head } from '@inertiajs/react';
import { BookingDate, BookingStatus, DJ } from '@/components/booking/types';
import { AvailabilityGrid as AvailabilityGridComponent } from '@/components/booking/availability-grid';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

// Define PageProps interface for this page
interface PageProps {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
}

interface AvailabilityGridProps extends PageProps {
  djs: DJ[];
  dates: BookingDate[];
  bookings: {
    id: number;
    dj_id: number;
    booking_date_id: number;
    client_name: string;
    venue: string;
    genres: string[];
    start_time: string;
    end_time: string;
    notes: string | null;
    status: string;
    request_number: string;
    dj: DJ;
    bookingDate: BookingDate;
  }[];
  djAvailabilities: {
    id: number;
    dj_id: number;
    booking_date_id: number | null;
    date: string;
    status: string;
    is_custom_date: boolean;
  }[];
}

export default function AvailabilityGrid({ djs, dates, bookings, djAvailabilities, auth }: AvailabilityGridProps) {
  // Debug the data structure
  console.log('Raw data from backend:', { djs, dates, bookings, djAvailabilities });
  
  // Transform the backend data into the format expected by the AvailabilityGridComponent
  const formattedBookings = bookings.map(booking => {
    // Get the matching DJ and date objects from our collections by ID
    const matchingDj = djs.find(dj => dj.id === booking.dj_id);
    const matchingDate = dates.find(date => date.id === booking.booking_date_id);
    
    if (!matchingDj || !matchingDate) {
      console.warn('Missing DJ or date reference for booking:', booking);
      return null;
    }
    
    return {
      dj: matchingDj,
      date: matchingDate,
      status: booking.status as BookingStatus,
      request: {
        clientName: booking.client_name,
        venue: booking.venue,
        genres: booking.genres,
        startTime: booking.start_time,
        endTime: booking.end_time,
        notes: booking.notes || ''
      }
    };
  }).filter((booking): booking is NonNullable<typeof booking> => booking !== null);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
    {
      title: 'Availability',
      href: '/booking/availability',
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="DJ Availability" />
      
      <div className="flex-1 p-4">
        <div className="bg-white overflow-hidden shadow-sm rounded-xl">
          <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">DJ Availability Grid</h1>
            
            <AvailabilityGridComponent 
              djs={djs} 
              dates={dates} 
              bookings={formattedBookings}
              djAvailabilities={djAvailabilities}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
