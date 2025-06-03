import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AvailabilityGrid } from '@/components/booking/availability-grid';
import { BookingRequests } from '@/components/booking/booking-requests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function BookingDashboard() {
  const [activeTab, setActiveTab] = useState('availability');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">DJ Booking Tool</h1>
        <p className="text-muted-foreground">
          Manage DJ availability, booking requests, and scheduling in one place.
        </p>
      </div>
      
      <Tabs defaultValue="availability" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="requests">Booking Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="availability" className="mt-6">
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
        </TabsContent>
        
        <TabsContent value="requests" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Requests</CardTitle>
              <CardDescription>
                View all incoming booking requests and their current status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookingRequests />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
