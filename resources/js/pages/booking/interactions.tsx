import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';
import { BookingRequestTableItem } from '@/components/booking/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { CalendarIcon, MessageSquare, MailIcon, PhoneIcon, UserIcon, PencilIcon } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

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
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  
  const { data, setData, post, processing, errors, reset } = useForm<{
    follow_up_date: string;
    notes: string;
    automated_follow_up: boolean;
  }>({
    follow_up_date: bookingRequest.next_follow_up_at 
      ? format(new Date(bookingRequest.next_follow_up_at), 'yyyy-MM-dd')
      : format(new Date(new Date().setDate(new Date().getDate() + 3)), 'yyyy-MM-dd'),
    notes: '',
    automated_follow_up: bookingRequest.automated_follow_up || false,
  });
  
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
    
  const handleFollowUpSubmit = () => {
    post(route('booking-requests.interactions.update-follow-up', bookingRequest.id), {
      preserveScroll: true,
      onSuccess: () => {
        setIsFollowUpModalOpen(false);
        reset();
      }
    });
  };
  
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
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Next Follow-up:</p>
                      <button
                        onClick={() => setIsFollowUpModalOpen(true)}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                        title="Edit follow-up details"
                      >
                        <PencilIcon className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      {new Date(bookingRequest.next_follow_up_at).toLocaleDateString()}
                      {pendingFollowUp && (
                        <Badge className="ml-2">Pending</Badge>
                      )}
                    </p>
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Automated Follow-ups:</p>
                    {!bookingRequest.next_follow_up_at && (
                      <button
                        onClick={() => setIsFollowUpModalOpen(true)}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                        title="Set up follow-up"
                      >
                        <PencilIcon className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={bookingRequest.automated_follow_up ? 'secondary' : 'outline'}>
                      {bookingRequest.automated_follow_up ? 'Enabled' : 'Disabled'}
                    </Badge>
                    <p className="text-xs text-gray-500">
                      {bookingRequest.automated_follow_up 
                        ? 'Emails will be sent automatically' 
                        : 'Manual follow-up required'}
                    </p>
                  </div>
                </div>
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
      {/* Follow-up Edit Modal */}
      <Dialog open={isFollowUpModalOpen} onOpenChange={setIsFollowUpModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{bookingRequest.next_follow_up_at ? 'Update Follow-up' : 'Schedule Follow-up'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="follow_up_date">Follow-up Date</Label>
              <div className="flex items-center space-x-2">
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
                <p className="text-sm font-medium text-destructive">{errors.follow_up_date}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any specific details about this follow-up..."
                value={data.notes}
                onChange={(e) => setData('notes', e.target.value)}
                className="min-h-[80px]"
              />
              {errors.notes && (
                <p className="text-sm font-medium text-destructive">{errors.notes}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="automated_follow_up"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={Boolean(data.automated_follow_up)}
                onChange={(e) => setData('automated_follow_up', e.target.checked)}
              />
              <Label htmlFor="automated_follow_up" className="font-normal cursor-pointer">
                Send follow-up email automatically
              </Label>
            </div>
            <p className="text-xs text-gray-500">
              {data.automated_follow_up
                ? "An email will be automatically sent on the scheduled date"
                : "You'll receive a reminder to manually follow up on this date"}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFollowUpModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleFollowUpSubmit} disabled={processing}>
              {processing ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
