import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';
import { BookingRequestTableItem } from '@/components/booking/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, MessageSquare, MailIcon, PhoneIcon, UserIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Define ClientInteraction interface inline to avoid import dependency
interface ClientInteraction {
  id: number;
  booking_request_id: number;
  interaction_method: string;
  notes: string | null;
  metadata: Record<string, any> | null;
  is_follow_up: boolean;
  is_client_response: boolean;
  created_at: string;
  updated_at: string;
}

interface InteractionsProps {
  bookingRequest: BookingRequestTableItem;
  interactions: ClientInteraction[];
  responseMethods: Record<string, string>;
}

export default function Interactions({ bookingRequest, interactions, responseMethods }: InteractionsProps) {
  
  const getInteractionIcon = (method: string) => {
    switch (method) {
      case 'email':
        return <MailIcon className="h-4 w-4" />;
      case 'phone':
        return <PhoneIcon className="h-4 w-4" />;
      case 'in_person':
        return <UserIcon className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };
  
  const pendingFollowUp = bookingRequest.next_follow_up_at 
    ? new Date(bookingRequest.next_follow_up_at) > new Date() 
    : false;
  
  return (
    <MainLayout>
      <Head title={`Interactions - ${bookingRequest.client_name}`} />
      
      <div className="container px-4 mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{bookingRequest.client_name}</h1>
            <p className="text-gray-500">
              Request #{bookingRequest.request_number} - {bookingRequest.venue}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Link href={route('booking-requests.index')}>
              <Button variant="outline">Back to Requests</Button>
            </Link>
            
            <Link href={route('booking-requests.interactions.create', bookingRequest.id)}>
              <Button>Record Client Response</Button>
            </Link>
            
            <Link href={route('booking-requests.interactions.schedule-follow-up', bookingRequest.id)}>
              <Button variant="secondary">Schedule Follow-up</Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
                <CardDescription>Contact details and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Email:</p>
                  <p>{bookingRequest.contact_email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Phone:</p>
                  <p>{bookingRequest.contact_phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status:</p>
                  <Badge variant="secondary" className="mt-1">
                    {bookingRequest.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Has Responded:</p>
                  <Badge variant={bookingRequest.has_responded ? "secondary" : "destructive"} className="mt-1">
                    {bookingRequest.has_responded ? 'Yes' : 'No'}
                  </Badge>
                </div>
                {bookingRequest.last_response_at && (
                  <div>
                    <p className="text-sm font-medium">Last Response:</p>
                    <p className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      {formatDistanceToNow(new Date(bookingRequest.last_response_at), { addSuffix: true })}
                    </p>
                  </div>
                )}
                {bookingRequest.next_follow_up_at && (
                  <div>
                    <p className="text-sm font-medium">Next Follow-up:</p>
                    <p className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      {new Date(bookingRequest.next_follow_up_at).toLocaleDateString()}
                      {pendingFollowUp && (
                        <Badge className="ml-2">Pending</Badge>
                      )}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Interaction History</CardTitle>
                <CardDescription>Timeline of all client communications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {interactions.length > 0 ? (
                    interactions.map((interaction) => (
                      <div key={interaction.id} className="flex items-start gap-4 pb-4 border-b border-gray-100">
                        <div className="bg-gray-100 p-2 rounded-full">
                          {getInteractionIcon(interaction.interaction_method)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium">
                              {interaction.is_follow_up ? 'Follow-up Sent' : 'Client Interaction'}
                              <Badge variant={interaction.is_client_response ? "secondary" : "outline"} className="ml-2">
                                {interaction.is_client_response ? 'Response' : 'Outreach'}
                              </Badge>
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDistanceToNow(new Date(interaction.created_at), { addSuffix: true })}
                            </p>
                          </div>
                          <p className="text-sm font-medium mt-1">
                            Method: {responseMethods[interaction.interaction_method] || interaction.interaction_method}
                          </p>
                          <p className="mt-1 text-gray-600">{interaction.notes}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-6 text-gray-500">
                      <p>No interaction history found for this booking request.</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-gray-500">
                  Total Interactions: {interactions.length} | Follow-up Count: {bookingRequest.follow_up_count}
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
