import { useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookingStatus, DJ, BookingDate } from '@/components/booking/types';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Type for booking cell data
interface CellData {
  dj: DJ;
  date: {
    id: number;
    date: string;
    display_date: string;
    day_name: string;
  };
  status: BookingStatus;
  availability?: {
    id: number;
    dj_id: number;
    booking_date_id: number | null;
    date: string;
    status: string;
    is_custom_date: boolean;
    note?: string;
  };
}

// Interface for component props
interface AvailabilityGridProps {
  djs: DJ[];
  dates: BookingDate[];
  bookings: any[];
  djAvailabilities?: {
    id: number;
    dj_id: number;
    booking_date_id: number | null;
    date: string;
    status: string;
    is_custom_date: boolean;
    note?: string;
  }[];
}

// Status to color mapping - using the PHP enum values directly
const statusColors: Record<BookingStatus, string> = {
  available: 'bg-white',
  blocked: 'bg-red-300',
  pending_agency_request: 'bg-green-50', // Light green
  booked_through_agency: 'bg-green-300 text-white', // Dark green
  eventually_available: 'bg-blue-50'
};

// Status to label mapping - using the PHP enum values directly
const statusLabels: Record<BookingStatus, string> = {
  available: 'Available',
  blocked: 'Blocked',
  pending_agency_request: 'Pending Agency Request',
  booked_through_agency: 'Booked Through Agency',
  eventually_available: 'Eventually Available'
};

export function AvailabilityGrid({
  djs = [],
  dates = [],
  bookings = [],
  djAvailabilities = []
}: AvailabilityGridProps) {
  // State for tracking which availability cell is selected and if drawer is open
  const [selectedAvailability, setSelectedAvailability] = useState<{
    availability: any;
    dj: DJ;
    date: any;
  } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // Extract unique dates from DJ availabilities
  const uniqueAvailabilityDates = useMemo(() => {
    // Get unique dates from availabilities
    const uniqueDates = new Map<string, {
      id: number;
      date: string;
      display_date: string;
      day_name: string;
    }>();

    // Collect unique dates from djAvailabilities
    djAvailabilities.forEach(availability => {
      if (!uniqueDates.has(availability.date)) {
        const dateObj = new Date(availability.date);
        // Create a BookingDate-like structure from the availability date
        uniqueDates.set(availability.date, {
          date: availability.date,
          id: availability.booking_date_id || uniqueDates.size + 1,
          display_date: dateObj.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
          day_name: ''
        });
      }
    });

    // If no availabilities, use dates from props
    if (uniqueDates.size === 0 && dates.length > 0) {
      dates.forEach(date => {
        let dateStr = '';
        if (typeof date.date === 'string') {
          dateStr = date.date;
        } else if (date.date && typeof date.date === 'object') {
          try {
            // @ts-ignore - TypeScript doesn't know about the format method
            dateStr = date.date.format('YYYY-MM-DD');
          } catch (e) {
            dateStr = new Date(date.date as any).toISOString().split('T')[0];
          }
        }

        uniqueDates.set(dateStr, {
          id: date.id,
          date: dateStr,
          display_date: date.display_date || dateStr,
          day_name: date.day_name || ''
        });
      });
    }

    // Convert map to array sorted by date
    return Array.from(uniqueDates.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [djAvailabilities, dates]);

  // Process the server data to create a lookup for fast access
  const cellData = useMemo(() => {
    const cellMap: Record<string, CellData> = {};

    // Initialize grid cells using the extracted dates
    djs.forEach(dj => {
      uniqueAvailabilityDates.forEach(date => {
        const key = `${dj.id}-${date.id}`;
        cellMap[key] = {
          dj,
          date,
          status: 'available'
        };
      });
    });

    // Process DJ availabilities to update cell status
    djAvailabilities.forEach(availability => {
      // Find the matching date object
      const matchingDate = uniqueAvailabilityDates.find(
        date => date.date === availability.date
      );

      if (matchingDate) {
        const key = `${availability.dj_id}-${matchingDate.id}`;
        if (cellMap[key]) {
          // Use the DjAvailability status directly without mapping
          const status = availability.status as BookingStatus;
          cellMap[key].status = status;
          // Store reference to the original availability data
          cellMap[key].availability = availability;
        }
      }
    });

    return cellMap;
  }, [djs, uniqueAvailabilityDates, djAvailabilities]);

  // Use all available dates
  const visibleDates = uniqueAvailabilityDates;

  // Debug info
  console.log('Rendering grid with:', {
    djs,
    availabilityDates: uniqueAvailabilityDates,
    djAvailabilities
  });

  // Handle cell click to open drawer
  const handleCellClick = (cell: CellData) => {
    // Find the DJ
    const dj = djs.find(d => d.id === cell.dj.id);

    if (dj && cell.availability) {
      setSelectedAvailability({
        availability: cell.availability,
        dj,
        date: cell.date
      });
      setIsDrawerOpen(true);
    }
  };

  return (
    <div className="w-full overflow-auto">
      <div className="bg-white border rounded-lg shadow">
        <div className="relative">
          <Table className="border-collapse">
            {/* Table Header */}
            <TableHeader className="sticky top-0 z-10 bg-white">
              <TableRow>
                <TableHead className="sticky left-0 z-20 bg-white border-r w-min">

                </TableHead>
                {djs.map((dj) => (
                  <TableHead key={dj.id} className="px-2 py-1 font-medium text-center min-w-[80px] text-xs whitespace-nowrap">
                    {dj.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {visibleDates.map((date) => (
                <TableRow key={date.id}>
                  <TableCell className="sticky left-0 z-10 bg-white border-r font-medium w-min px-2">
                    <div className="text-xs whitespace-nowrap">
                      <div>{date.display_date}</div>
                    </div>
                  </TableCell>

                  {djs.map((dj) => {
                    const key = `${dj.id}-${date.id}`;
                    const cell = cellData[key];
                    const status = cell?.status || 'available';

                    return (
                      <TableCell
                        key={key}
                        className={`text-center py-1 px-1 text-xs ${statusColors[status]} cursor-pointer hover:opacity-80 transition-opacity`}
                        onClick={() => handleCellClick(cell)}
                      >
                        {status !== 'available' && (
                          <Badge variant="outline" className={`text-xs py-0 px-1 ${statusColors[status]}`}>
                            {statusLabels[status]}
                          </Badge>
                        )}
                        {status === 'available' && (
                          <span className="text-xs text-gray-400">Available</span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {/* Side drawer for availability details */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent>
          {selectedAvailability && (
            <div className="space-y-6">
              <SheetHeader>
                <SheetTitle>DJ Availability Details</SheetTitle>
                <SheetDescription>
                  Details for {selectedAvailability.dj.name} on {selectedAvailability.date.display_date}
                </SheetDescription>
              </SheetHeader>

              <Card>
                <CardHeader>
                  <CardTitle>DJ Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2">
                      <span className="font-medium">Name:</span>
                      <span>{selectedAvailability.dj.name}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-medium">ID:</span>
                      <span>{selectedAvailability.dj.id}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-medium">Genres:</span>
                      <span>{selectedAvailability.dj.genres.join(', ')}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-medium">Status:</span>
                      <span>{selectedAvailability.dj.status}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Availability Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2">
                      <span className="font-medium">ID:</span>
                      <span>{selectedAvailability.availability.id}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-medium">Status:</span>
                      <span>
                        <Badge className={`${statusColors[selectedAvailability.availability.status as BookingStatus]}`}>
                          {statusLabels[selectedAvailability.availability.status as BookingStatus]}
                        </Badge>
                      </span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-medium">DJ ID:</span>
                      <span>{selectedAvailability.availability.dj_id}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-medium">Booking Date ID:</span>
                      <span>{selectedAvailability.availability.booking_date_id ?? 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-medium">Custom Date:</span>
                      <span>{selectedAvailability.availability.is_custom_date ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-medium">Date:</span>
                      <span>{selectedAvailability.availability.date}</span>
                    </div>
                    {selectedAvailability.availability.note && (
                      <div className="grid grid-cols-2">
                        <span className="font-medium">Note:</span>
                        <span>{selectedAvailability.availability.note}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
