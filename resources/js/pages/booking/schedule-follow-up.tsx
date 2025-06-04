import React, { FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, ArrowLeft } from 'lucide-react';
import { BookingRequestTableItem } from '@/components/booking/types';
import { format } from 'date-fns';

interface ScheduleFollowUpProps {
  bookingRequest: BookingRequestTableItem;
}

export default function ScheduleFollowUp({ bookingRequest }: ScheduleFollowUpProps) {
  // Default to 3 days from now for the follow-up date
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 3);
  
  const { data, setData, post, processing, errors } = useForm({
    follow_up_date: format(defaultDate, 'yyyy-MM-dd'),
    notes: '',
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    post(route('booking-requests.interactions.schedule-follow-up.store', bookingRequest.id));
  }

  return (
    <MainLayout>
      <Head title={`Schedule Follow-Up - ${bookingRequest.client_name}`} />
      
      <div className="container px-4 mx-auto py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          
          <h1 className="text-3xl font-bold">Schedule Follow-Up</h1>
          <p className="text-gray-500">
            For booking request: {bookingRequest.client_name} - #{bookingRequest.request_number}
          </p>
        </div>
        
        <div className="max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Follow-Up Details</CardTitle>
              <CardDescription>
                Schedule when to follow up with the client about their booking request
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="follow_up_date">Follow-up Date</Label>
                    <p className="text-sm text-gray-500 mb-2">
                      When should we follow up with the client?
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <input
                        id="follow_up_date"
                        type="date"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={data.follow_up_date}
                        onChange={(e) => setData('follow_up_date', e.target.value)}
                        min={format(new Date(), 'yyyy-MM-dd')}
                      />
                      <CalendarIcon className="h-4 w-4 opacity-50" />
                    </div>
                    {errors.follow_up_date && (
                      <p className="text-sm font-medium text-destructive mt-1">{errors.follow_up_date}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <p className="text-sm text-gray-500">
                      Optional notes for this follow-up
                    </p>
                    <Textarea
                      id="notes"
                      placeholder="Any specific details about this follow-up..."
                      className="min-h-[100px] w-full"
                      value={data.notes}
                      onChange={(e) => setData('notes', e.target.value)}
                    />
                    {errors.notes && (
                      <p className="text-sm font-medium text-destructive">{errors.notes}</p>
                    )}
                  </div>
                </div>
                
                <Button type="submit" disabled={processing}>
                  {processing ? 'Scheduling...' : 'Schedule Follow-Up'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
