import Heading from '@/components/heading';
import { DJsManagement } from '@/components/booking/djs-management';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ToastProvider } from '@/components/ui/toast';

export default function BookingDJs() {
  // Define breadcrumbs for the layout
  const breadcrumbs: BreadcrumbItem[] = [
    { href: '/dashboard', title: 'Dashboard' },
    { href: '/booking', title: 'Booking' },
    { href: '/booking/djs', title: 'DJs' }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <ToastProvider>
        <div className="flex flex-col space-y-6">
          <Heading title="DJ Management" />
          
          <Card>
            <CardHeader>
              <CardTitle>DJ Roster</CardTitle>
              <CardDescription>
                Manage your DJ roster, including contact information, genres, and availability.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DJsManagement />
            </CardContent>
          </Card>
        </div>
      </ToastProvider>
    </AppLayout>
  );
}
