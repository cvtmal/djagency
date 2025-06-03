import { useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function Booking() {
  useEffect(() => {
    // Redirect to the availability page
    router.visit('/booking/availability');
  }, []);

  // This page will not be visible as it redirects immediately
  return null;
}
