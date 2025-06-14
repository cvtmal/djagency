import Heading from '@/components/heading';
import { AvailabilityGrid } from '@/components/booking/availability-grid';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ToastProvider } from '@/components/ui/toast';

export default function BookingAvailability() {
  // Define breadcrumbs for the layout
  const breadcrumbs: BreadcrumbItem[] = [
    { href: '/dashboard', title: 'Dashboard' },
    { href: '/booking', title: 'Booking' },
    { href: '/booking/availability', title: 'Availability' }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <ToastProvider>
        <div className="flex flex-col space-y-6">
        <Heading title="DJ Availability" />
        
        <Card>
          <CardHeader>
            <CardTitle>DJ Availability Grid</CardTitle>
            <CardDescription>
              View and manage DJ availability for upcoming dates. Click on a cell to see booking details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AvailabilityGrid />
          </CardContent>
        </Card>
      </div>
      </ToastProvider>
    </AppLayout>
  );
}
