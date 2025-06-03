import Heading from '@/components/heading';
import { SettingsScreen } from '@/components/booking/settings-screen';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { ToastProvider } from '@/components/ui/toast';

export default function BookingSettings() {
  // Define breadcrumbs for the layout
  const breadcrumbs: BreadcrumbItem[] = [
    { href: '/dashboard', title: 'Dashboard' },
    { href: '/booking', title: 'Booking' },
    { href: '/booking/settings', title: 'Settings' }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <ToastProvider>
        <div className="flex flex-col space-y-6">
          <Heading title="Booking Settings" />
          <SettingsScreen />
        </div>
      </ToastProvider>
    </AppLayout>
  );
}
