import Heading from '@/components/heading';
import { BookingRequests } from '@/components/booking/booking-requests';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ToastProvider } from '@/components/ui/toast';
import { usePage } from '@inertiajs/react';
import { BookingRequestTableItem } from '@/components/booking/types';

interface PageProps {
  bookingRequests: BookingRequestTableItem[];
  djs: Array<{
    id: number;
    name: string;
    genres: string[];
    status: string;
  }>;
  [key: string]: any;
}

export default function BookingRequestsPage() {
  // Define breadcrumbs for the layout
  const breadcrumbs: BreadcrumbItem[] = [
    { href: '/dashboard', title: 'Dashboard' },
    { href: '/booking', title: 'Booking' },
    { href: '/booking/requests', title: 'Booking Requests' }
  ];
  
  // Get the booking requests and DJs from props with proper typing
  const { bookingRequests = [], djs = [] } = usePage<{props: PageProps}>().props;
  const typedBookingRequests = bookingRequests as BookingRequestTableItem[];
  const typedDjs = djs as PageProps['djs'];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <ToastProvider>
        <div className="flex flex-col space-y-6">
        <Heading title="Booking Requests" />
        
        <Card>
          <CardHeader>
            <CardTitle>Booking Requests</CardTitle>
            <CardDescription>
              View all incoming booking requests and their current status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookingRequests bookingRequests={typedBookingRequests} djs={typedDjs} />
          </CardContent>
        </Card>
      </div>
      </ToastProvider>
    </AppLayout>
  );
}
