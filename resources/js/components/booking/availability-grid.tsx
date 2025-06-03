import { useState, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookingStatus, DJ, BookingDate } from '@/components/booking/types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, MapPin, Music } from 'lucide-react';

// Generate mock DJs data
const generateDJs = (count: number): DJ[] => {
  // Base real DJ names list
  const djNames = [
    'DJ Marc', 'DJ Damian', 'DJ Junus', 'DJ Toni', 'DJ Mike', 'DJ Sarah', 'DJ Alex', 'DJ Chris',
    'DJ Emma', 'DJ David', 'DJ Lisa', 'DJ Kevin', 'DJ Anna', 'DJ James', 'DJ Laura', 'DJ Tom',
    'DJ Nina', 'DJ Rick', 'DJ Sofia', 'DJ Jack', 'DJ Lucas', 'DJ Maya', 'DJ Oscar', 'DJ Rachel',
    'DJ Sam', 'DJ Tina', 'DJ Victor', 'DJ Wendy', 'DJ Xander', 'DJ Yara', 'DJ Zack', 'DJ Alice',
    'DJ Bob', 'DJ Chloe', 'DJ Diego', 'DJ Eva', 'DJ Frank', 'DJ Grace', 'DJ Henry', 'DJ Ivy',
    'DJ Jacob', 'DJ Kate', 'DJ Leo', 'DJ Mia', 'DJ Noah', 'DJ Olivia'
  ];

  // Generate systematic DJ names to reach 120 total
  return Array.from({ length: count }, (_, i) => {
    if (i < djNames.length) {
      return {
        id: i + 1,
        name: djNames[i]
      };
    } else {
      // For DJs beyond our real name list, generate names like DJ A1, DJ B1, DJ C1, etc.
      const letterIndex = (i - djNames.length) % 26;
      const numberIndex = Math.floor((i - djNames.length) / 26) + 1;
      return {
        id: i + 1,
        name: `DJ ${String.fromCharCode(65 + letterIndex)}${numberIndex}`
      };
    }
  });
};

// Generate all Friday and Saturday dates for 2025, plus December 31
const generateAllWeekendDatesFor2025 = (): BookingDate[] => {
  const dates: BookingDate[] = [];
  let dateId = 1;
  
  // Start from January 1, 2025
  const startDate = new Date('2025-01-01');
  // End at December 31, 2025
  const endDate = new Date('2025-12-31');
  
  // Set to the first day of the year
  let currentDate = new Date(startDate);
  
  // Loop through all days in 2025
  while (currentDate <= endDate) {
    // Check if it's Friday (5) or Saturday (6) or December 31
    const isDecember31 = currentDate.getMonth() === 11 && currentDate.getDate() === 31;
    const isWeekend = currentDate.getDay() === 5 || currentDate.getDay() === 6;
    
    if (isWeekend || isDecember31) {
      // Format date as dd.mm.yyyy
      const day = currentDate.getDate().toString().padStart(2, '0');
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const year = currentDate.getFullYear();
      const formattedDate = `${day}.${month}.${year}`;
      
      // Determine day name
      let dayName = '';
      if (isDecember31 && !isWeekend) {
        dayName = 'New Year\'s Eve';
      } else {
        dayName = currentDate.getDay() === 5 ? 'Friday' : 'Saturday';
      }
      
      dates.push({
        id: dateId++,
        date: currentDate.toISOString().split('T')[0], // Keep ISO format for internal use
        displayDate: formattedDate, // Add formatted date for display
        dayName: dayName
      });
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

// Random status generator
const getRandomStatus = (): BookingStatus => {
  const statuses: BookingStatus[] = ['free', 'quoted', 'booked', 'blocked'];
  const randomIndex = Math.floor(Math.random() * statuses.length);
  return statuses[randomIndex];
};

// Generate mock booking request
const generateMockBookingRequest = (djName: string, date: string) => {
  const venues = ['Club Elektra', 'The Basement', 'Sky Lounge', 'Ocean View', 'Downtown Beats'];
  const clients = ['John Smith', 'Emily Johnson', 'Michael Brown', 'Sophia Davis', 'Robert Wilson'];
  const genres = ['House', 'Techno', 'Hip-Hop', 'R&B', 'EDM', 'Disco', 'Funk', '80s', '90s'];

  return {
    clientName: clients[Math.floor(Math.random() * clients.length)],
    venue: venues[Math.floor(Math.random() * venues.length)],
    genres: Array.from({ length: 1 + Math.floor(Math.random() * 3) }, () =>
      genres[Math.floor(Math.random() * genres.length)]
    ),
    startTime: `${18 + Math.floor(Math.random() * 6)}:00`,
    endTime: `${22 + Math.floor(Math.random() * 4)}:00`,
    notes: `Special event request for ${djName} on ${date}`
  };
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

export function AvailabilityGrid() {
  // Generate comprehensive mock data
  const djs = generateDJs(120); // 120 total DJs
  const dates = generateAllWeekendDatesFor2025(); // All Friday/Saturday dates in 2025

  // Generate grid data
  const gridData = dates.map(date => ({
    date,
    djStatuses: djs.map(dj => ({
      dj,
      status: getRandomStatus(),
      request: generateMockBookingRequest(dj.name, date.date)
    }))
  }));

  // State for the drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    dj: { id: number; name: string };
    date: { id: number; date: string; displayDate: string; dayName: string };
    status: BookingStatus;
    request: any;
  } | null>(null);

  // Handle cell click
  const handleCellClick = useCallback((dj: { id: number; name: string }, date: { id: number; date: string; displayDate: string; dayName: string }, status: BookingStatus, request: any) => {
    setSelectedCell({ dj, date, status, request });
    setIsDrawerOpen(true);
  }, []);

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
                {djs.map((dj) => (
                  <TableHead key={dj.id} className="px-2 py-1 font-medium text-center min-w-[80px] text-xs whitespace-nowrap">
                    {dj.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {gridData.map((row) => (
                <TableRow key={row.date.id} className="hover:bg-gray-50">
                  <TableCell className="sticky left-0 z-10 bg-white border-r font-medium py-1 px-2 text-xs">
                    <span>{row.date.displayDate}</span>
                  </TableCell>

                  {row.djStatuses.map((cell) => (
                    <TableCell
                      key={`${row.date.id}-${cell.dj.id}`}
                      className={`text-center cursor-pointer py-1 px-1 text-xs ${cell.status === 'free' ? 'hover:bg-gray-200' :
                        statusColors[cell.status].split(' ')[0] + ' hover:opacity-80'
                        }`}
                       onClick={() => handleCellClick(cell.dj, row.date, cell.status, cell.request)}
                    >
                      {cell.status !== 'free' && (
                        <Badge variant="outline" className={`text-xs py-0 px-1 ${statusColors[cell.status]}`}>
                          {statusLabels[cell.status]}
                        </Badge>
                      )}
                    </TableCell>
                  ))}
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
                  {selectedCell.dj.name} on {selectedCell.date.dayName}, {selectedCell.date.displayDate}
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
                          {selectedCell.date.dayName}, {selectedCell.date.displayDate}
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
