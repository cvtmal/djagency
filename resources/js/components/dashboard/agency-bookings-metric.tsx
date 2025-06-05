import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarCheck } from 'lucide-react';

interface AgencyBookingsMetricProps {
  count: number;
  year: number;
}

export function AgencyBookingsMetric({ count, year }: AgencyBookingsMetricProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Agency Bookings</CardTitle>
        <CalendarCheck className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-start gap-1">
          <p className="text-2xl font-bold">{count}</p>
          <p className="text-xs text-muted-foreground">
            Events booked through agency in {year}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
