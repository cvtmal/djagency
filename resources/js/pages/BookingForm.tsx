import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { DjBookingForm } from '../components/DjBookingForm';
import { ToastProvider } from '../components/ui/toast';

export default function BookingForm() {
  return (
    <>
      <Head title="DJ Booking | Kontaktformular" />
      <ToastProvider>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">DJ Booking Anfrage</h1>
              <p className="text-lg text-gray-600">
                Füllen Sie das Formular aus und wir melden uns umgehend bei Ihnen
              </p>
            </div>
            
            <DjBookingForm />
          </div>
        </div>
      </ToastProvider>
    </>
  );
}
