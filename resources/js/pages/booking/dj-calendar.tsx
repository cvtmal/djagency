import DJCalendar from '@/components/booking/dj-calendar';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { ToastProvider } from '@/components/ui/toast';

export default function DjCalendarPage() {
  // Define breadcrumbs for the layout
  const breadcrumbs: BreadcrumbItem[] = [
    { href: '/dashboard', title: 'Dashboard' },
    { href: '/booking', title: 'Booking' },
    { href: '/booking/dj-calendar', title: 'My Calendar' }
  ];

  return (
    <ToastProvider>
      {/* We render DJCalendar directly without AppLayout to make it fully mobile-first */}
      <DJCalendar />
    </ToastProvider>
  );
}
