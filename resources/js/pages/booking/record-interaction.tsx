import React, { FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { BookingRequestTableItem } from '@/components/booking/types';

interface RecordInteractionProps {
  bookingRequest: BookingRequestTableItem;
  responseMethods: Record<string, string>;
}

export default function RecordInteraction({ bookingRequest, responseMethods }: RecordInteractionProps) {
  const { data, setData, post, processing, errors } = useForm({
    interaction_method: '',
    notes: '',
    is_client_response: true,
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    post(route('booking-requests.interactions.store', bookingRequest.id));
  }

  return (
    <MainLayout>
      <Head title={`Record Client Response - ${bookingRequest.client_name}`} />
      
      <div className="container px-4 mx-auto py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          
          <h1 className="text-3xl font-bold">Record Client Response</h1>
          <p className="text-gray-500">
            For booking request: {bookingRequest.client_name} - #{bookingRequest.request_number}
          </p>
        </div>
        
        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Client Response Details</CardTitle>
              <CardDescription>Record how the client responded to the quote</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Response Method</Label>
                    <p className="text-sm text-gray-500 mb-2">
                      How did the client respond to the quote?
                    </p>
                    <div className="grid gap-2">
                      {Object.entries(responseMethods).map(([value, label]) => (
                        <div key={value} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`method-${value}`}
                            name="interaction_method"
                            className="h-4 w-4 text-primary"
                            value={value}
                            onChange={() => setData('interaction_method', value)}
                            checked={data.interaction_method === value}
                          />
                          <Label htmlFor={`method-${value}`} className="font-normal cursor-pointer">
                            {label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {errors.interaction_method && (
                      <p className="text-sm font-medium text-destructive mt-1">{errors.interaction_method}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <p className="text-sm text-gray-500">
                      Enter any details about the client response
                    </p>
                    <Textarea
                      id="notes"
                      placeholder="The client said they are comparing prices with other DJs..."
                      className="min-h-[120px] w-full"
                      value={data.notes}
                      onChange={e => setData('notes', e.target.value)}
                    />
                    {errors.notes && (
                      <p className="text-sm font-medium text-destructive">{errors.notes}</p>
                    )}
                  </div>
                </div>
                
                <Button type="submit" disabled={processing}>
                  {processing ? 'Saving...' : 'Record Response'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
