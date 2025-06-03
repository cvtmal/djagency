import { useState, useCallback, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookingStatus, DJ, BookingDate } from '@/components/booking/types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, MapPin, Music } from 'lucide-react';

// Type for booking cell data
interface CellData {
  dj: DJ;
  date: BookingDate;
  status: BookingStatus;
  request: {
    clientName: string;
    venue: string;
    genres: string[];
    startTime: string;
    endTime: string;
    notes: string;
  };
}

// Interface for component props
interface AvailabilityGridProps {
  serverDjs: DJ[];
  serverDates: BookingDate[];
  serverBookings: CellData[];
};

// Status to color mapping
const statusColors = {
  free: 'bg-gray-100 text-gray-600',
  quoted: 'bg-yellow-100 text-yellow-800',
  booked: 'bg-green-100 text-green-800',
  blocked: 'bg-red-100 text-red-800'
};

const statusLabels = {
  free: 'Free',
  quoted: 'Quoted',
  booked: 'Booked',
  blocked: 'Blocked'
};

export function AvailabilityGrid({ serverDjs, serverDates, serverBookings }: AvailabilityGridProps) {

  // State for the drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<CellData | null>(null);

  // Process the server data to create a lookup for fast access
  const cellData = useMemo(() => {
    const cellMap: { [key: string]: CellData } = {};

    // Create empty cells for all combinations
    serverDjs.forEach(dj => {
      serverDates.forEach(date => {
        const key = `${dj.id}-${date.id}`;
        cellMap[key] = {
          dj,
          date,
          status: 'free',
          request: {
            clientName: '',
            venue: '',
            genres: [],
            startTime: '',
            endTime: '',
            notes: '',
          },
        };
      });
    });

    // Add the booking data where it exists
    serverBookings.forEach(booking => {
      if (!booking.dj || !booking.date) {
        return; // Skip invalid bookings
      }
      
      const key = `${booking.dj.id}-${booking.date.id}`;
      cellMap[key] = booking;
    });

    return cellMap;
  }, [serverDjs, serverDates, serverBookings]);

  // Handle cell click to open drawer
  const handleCellClick = (dj: DJ, date: BookingDate, status: BookingStatus, request: any) => {
    setSelectedCell({ dj, date, status, request });
    setIsDrawerOpen(true);
  };

  // Filter visible DJs based on search
  const filteredDJs = serverDjs.filter(dj => 
    '' === '' || dj.name.toLowerCase().includes(''.toLowerCase())
  );

  // Get visible dates (limited to 7 for now)
  const visibleDates = serverDates.slice(0, 7);

  return (
    <div className="w-full overflow-auto">
      <div className="bg-white border rounded-lg shadow">
        <div className="relative">
          <Table className="border-collapse">
            {/* Table Header */}
            <TableHeader className="sticky top-0 z-10 bg-white">
              <TableRow>
                <TableHead className="sticky left-0 z-20 bg-white border-r min-w-[100px]">
                </TableHead>
                {filteredDJs.map((dj) => (
                  <TableHead key={dj.id} className="px-2 py-1 font-medium text-center min-w-[80px] text-xs whitespace-nowrap">
                    {dj.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {visibleDates.map((date) => (
                <TableRow key={date.id} className="hover:bg-gray-50">
                  <TableCell className="sticky left-0 z-10 bg-white border-r font-medium py-1 px-2 text-xs">
                    <span>{date.display_date || date.displayDate}</span>
                    <div className="text-[10px] text-gray-500">{date.day_name || date.dayName}</div>
                  </TableCell>

                  {filteredDJs.map((dj) => {
                    const key = `${dj.id}-${date.id}`;
                    const cell = cellData[key];
                    return (
                      <TableCell
                        key={key}
                        className={`text-center cursor-pointer py-1 px-1 text-xs ${statusColors[cell.status]}`}
                        onClick={() => handleCellClick(dj, date, cell.status, cell.request)}
                      >
                        {cell.status !== 'free' && (
                          <Badge variant="outline" className={`text-xs py-0 px-1 ${statusColors[cell.status]}`}>
                            {statusLabels[cell.status]}
                          </Badge>
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

      {/* Side Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          {selectedCell && (
            <>
              <SheetHeader>
                <SheetTitle>Booking Details</SheetTitle>
                <SheetDescription>
                  {selectedCell.dj.name} on {selectedCell.date.day_name || selectedCell.date.dayName}, {selectedCell.date.display_date || selectedCell.date.displayDate}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Status</h3>
                  <Badge className={statusColors[selectedCell.status]}>
                    {statusLabels[selectedCell.status]}
                  </Badge>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Booking Request</h3>

                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-8 h-8 flex items-center justify-center mt-0.5">
                        <span className="text-gray-500">👤</span>
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium">Client</p>
                        <p className="text-sm text-gray-600">{selectedCell.request.clientName}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-8 h-8 flex items-center justify-center mt-0.5">
                        <MapPin className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium">Venue</p>
                        <p className="text-sm text-gray-600">{selectedCell.request.venue}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-8 h-8 flex items-center justify-center mt-0.5">
                        <Music className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium">Requested Genres</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedCell.request.genres.map((genre: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-8 h-8 flex items-center justify-center mt-0.5">
                        <Clock className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium">Time</p>
                        <p className="text-sm text-gray-600">
                          {selectedCell.request.startTime} - {selectedCell.request.endTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-8 h-8 flex items-center justify-center mt-0.5">
                        <Calendar className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium">Date</p>
                        <p className="text-sm text-gray-600">
                          {selectedCell.date.day_name || selectedCell.date.dayName}, {selectedCell.date.display_date || selectedCell.date.displayDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-8 h-8 flex items-center justify-center mt-0.5">
                        <span className="text-gray-500">📝</span>
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium">Notes</p>
                        <p className="text-sm text-gray-600">{selectedCell.request.notes}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button variant="default">Send Quote</Button>
                  <Button variant="outline">Block Date</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
