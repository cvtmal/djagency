import Heading from '@/components/heading';
import { BookingRequests } from '@/components/booking/booking-requests';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function BookingRequestsPage() {
  // Define breadcrumbs for the layout
  const breadcrumbs: BreadcrumbItem[] = [
    { href: '/dashboard', title: 'Dashboard' },
    { href: '/booking', title: 'Booking' },
    { href: '/booking/requests', title: 'Booking Requests' }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
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
            <BookingRequests />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
