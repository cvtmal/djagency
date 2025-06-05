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
  djs: any[];
  dates: any[];
  bookings: any[];
  djAvailabilities: {
    id: number;
    dj_id: number;
    booking_date_id: number | null;
    date: string; // Format: DD.MM.YYYY (Swiss format from PHP)
    status: string;
    is_custom_date: boolean;
    day_of_week: number; // 5 = Friday, 6 = Saturday
    note?: string;
  }[];
}

// Status to color mapping - using the PHP enum values directly
const statusColors: Record<string, string> = {
  'available': 'bg-white',
  'blocked': 'bg-red-300',
  'pending_agency_request': 'bg-green-50', // Light green
  'booked_through_agency': 'bg-green-300 text-white', // Dark green
  'eventually_available': 'bg-blue-50'
};

// Status to label mapping - using the PHP enum values directly
const statusLabels: Record<string, string> = {
  'available': 'Available',
  'blocked': 'Blocked',
  'pending_agency_request': 'Pending Agency Request',
  'booked_through_agency': 'Booked Through Agency',
  'eventually_available': 'Eventually Available'
};

// Helper to normalize status values for consistent lookup
const normalizeStatus = (status: string | null | undefined): BookingStatus => {
  if (!status) return 'available';
  
  // Convert to lowercase for case-insensitive comparison
  const normalizedStatus = status.toLowerCase();
  
  // Check if it's a valid status or return default
  return [
    'available',
    'blocked',
    'pending_agency_request',
    'booked_through_agency',
    'eventually_available'
  ].includes(normalizedStatus) ? normalizedStatus as BookingStatus : 'available';
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
  // Extract unique Friday and Saturday dates from DJ availabilities
  const uniqueAvailabilityDates = useMemo(() => {
    console.log('Processing DJ availabilities for dates (total):', djAvailabilities.length);
    
    // Filter to only include standard weekend dates (is_custom_date = false)
    const standardAvailabilities = djAvailabilities.filter(a => a.is_custom_date === false);
    console.log(`Found ${standardAvailabilities.length} standard weekend availabilities`);
    
    // Create a set of unique date strings (DD.MM.YYYY from the PHP backend)
    const uniqueDateStrings = new Set<string>();
    standardAvailabilities.forEach(a => uniqueDateStrings.add(a.date));
    console.log(`Found ${uniqueDateStrings.size} unique date strings`);
    
    // Convert to our date objects
    const weekendDates: Array<{
      id: number;
      date: string;           // ISO format (YYYY-MM-DD) for lookups
      display_date: string;   // Swiss format (DD.MM.YYYY) for display
      day_name: string;       // "Friday" or "Saturday"
    }> = [];
    
    // Create day name mapping
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Build date objects with both formats
    Array.from(uniqueDateStrings).forEach((dateStr, index) => {
      try {
        // Parse DD.MM.YYYY to get components
        const [day, month, year] = dateStr.split('.');
        if (!day || !month || !year) {
          console.error(`Invalid date format: ${dateStr}`);
          return;
        }
        
        // Create ISO date for lookups (YYYY-MM-DD)
        const isoDate = `${year}-${month}-${day}`;
        
        // Find a sample availability for this date to get day of week
        const sampleAvailability = standardAvailabilities.find(a => a.date === dateStr);
        if (!sampleAvailability) {
          console.error(`Cannot find sample availability for date: ${dateStr}`);
          return;
        }
        
        // Get day name based on day_of_week field
        const dayName = sampleAvailability.day_of_week >= 0 && sampleAvailability.day_of_week < 7 
          ? dayNames[sampleAvailability.day_of_week]
          : 'Unknown';
        
        weekendDates.push({
          id: index + 1,
          date: isoDate,            // YYYY-MM-DD
          display_date: dateStr,    // DD.MM.YYYY
          day_name: dayName         // "Friday" or "Saturday" 
        });
      } catch (error) {
        console.error(`Error processing date ${dateStr}:`, error);
      }
    });
    
    // Sort chronologically by ISO date format
    weekendDates.sort((a, b) => a.date.localeCompare(b.date));
    
    console.log(`Processed ${weekendDates.length} unique weekend dates:`);
    weekendDates.slice(0, 5).forEach(d => {
      console.log(`- ${d.display_date} (${d.day_name})`);
    });
    
    return weekendDates;
  }, [djAvailabilities]);


  // Process the server data to create a lookup for fast access
  const cellData = useMemo(() => {
    console.log('Processing data for grid:', { 
      'DJs': djs.length,
      'Weekend dates': uniqueAvailabilityDates.length,
      'DJ Availabilities': djAvailabilities.length
    });
    
    // Step 1: Create a lookup map of all DJ weekend availabilities by DJ-date key
    const availabilityLookup = new Map<string, any>();
    
    // Process only standard weekend availabilities (is_custom_date = false)
    const standardAvailabilities = djAvailabilities.filter(a => a.is_custom_date === false);
    
    // Add each availability to the lookup map
    standardAvailabilities.forEach(availability => {
      // Get date components from DD.MM.YYYY format
      const [day, month, year] = availability.date.split('.');
      if (!day || !month || !year) {
        console.warn('Invalid date format:', availability.date);
        return;
      }
      
      // Convert to ISO format for lookups
      const isoDate = `${year}-${month}-${day}`;
      const djId = Number(availability.dj_id);
      
      // Create a consistent key format
      const key = `${djId}-${isoDate}`;
      
      // Store with normalized status
      availabilityLookup.set(key, {
        ...availability,
        isoDate,
        status: normalizeStatus(availability.status)
      });
      
      // Log found availabilities with non-default statuses
      if (availability.status !== 'available') {
        console.log(`Found status for DJ #${djId} on ${availability.date}: ${availability.status}`);
      }
    });
    
    console.log(`Created availability lookup with ${availabilityLookup.size} entries`);
    
    // Step 2: Create cell data for all DJ-date combinations
    const cellMap: Record<string, CellData> = {};
    
    // For each DJ...
    djs.forEach(dj => {
      const djId = Number(dj.id);
      
      // For each weekend date...
      uniqueAvailabilityDates.forEach(date => {
        // Create the lookup key using the same format
        const key = `${djId}-${date.date}`; // date.date is the ISO format YYYY-MM-DD
        
        // Find the DJ's availability for this date
        const availability = availabilityLookup.get(key);
        
        // Define the cell's status (default to available if no entry found)
        const status = availability ? availability.status : 'available';
        
        // Store in our cell data map for quick lookup during rendering
        cellMap[key] = {
          dj,
          date,
          status,
          availability
        };
        
        // Log any non-available statuses for verification
        if (status !== 'available') {
          console.log(`Cell [${dj.name} on ${date.display_date}]: Status = ${status}`);
        }
      });
    });
    
    // Log summary
    console.log(`Created ${Object.keys(cellMap).length} total grid cells`);
    
    // Log sample of non-available cells
    const nonDefaultCells = Object.values(cellMap).filter(cell => cell.status !== 'available');
    console.log(`Found ${nonDefaultCells.length} cells with non-default status`);

    return cellMap;
  }, [djs, uniqueAvailabilityDates, djAvailabilities]);

  // Memoize the visible dates to be displayed - ensure we only show Fridays and Saturdays
  const visibleDates = useMemo(() => {
    console.log('Preparing visible dates:', uniqueAvailabilityDates);
    return uniqueAvailabilityDates;
  }, [uniqueAvailabilityDates]);

  // Debug info
  console.log('Rendering grid with:', {
    djs: djs.length,
    visibleDates: visibleDates.length,
    cellData: Object.keys(cellData).length
  });
  
  // Explicitly log some sample status values for debugging
  if (djs.length > 0 && uniqueAvailabilityDates.length > 0) {
    const sampleKey = `${djs[0].id}-${uniqueAvailabilityDates[0].date}`;
    const sampleCell = cellData[sampleKey];
    console.log('Sample cell data:', {
      key: sampleKey,
      status: sampleCell?.status,
      date: uniqueAvailabilityDates[0].date,
      displayDate: uniqueAvailabilityDates[0].display_date
    });
  }

  // Handle cell click to open drawer
  const handleCellClick = (cell: CellData) => {
    // Ensure we have an availability object
    const availability = cell.availability || {
      id: 0,
      dj_id: cell.dj.id,
      booking_date_id: cell.date.id,
      date: cell.date.date,
      status: cell.status,
      is_custom_date: false
    };
    
    setSelectedAvailability({
      availability,
      dj: cell.dj,
      date: cell.date
    });
    setIsDrawerOpen(true);
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
                      <div className="text-xs text-gray-500">{date.day_name}</div>
                    </div>
                  </TableCell>

                  {djs.map((dj) => {
                    // Ensure DJ ID is numeric for consistent lookup
                    const djId = Number(dj.id);
                    // Key format must match exactly what we used in cellData
                    const key = `${djId}-${date.date}`;
                    
                    // Get cell data for this DJ and date
                    const cell = cellData[key];
                    
                    if (!cell) {
                      console.error(`Cell data not found for key: ${key}`);
                      return <TableCell key={key} className="text-center py-1 px-1 text-gray-100">Error</TableCell>;
                    }
                    
                    // Get the status with fallback
                    const status = cell.status || 'available';
                    
                    // Log non-available statuses for debugging
                    if (status && status !== 'available') {
                      console.log(`RENDERING: DJ ${dj.name} on ${date.display_date} with status: ${status}`);
                    }
                    
                    return (
                      <TableCell
                        key={key}
                        className={`text-center py-1 px-1 text-xs ${statusColors[status] || 'bg-white'} cursor-pointer hover:opacity-80 transition-opacity`}
                        onClick={() => handleCellClick(cell)}
                      >
                        {status !== 'available' && (
                          <Badge variant="outline" className={`text-xs py-0 px-1 ${statusColors[status] || ''}`}>
                            {statusLabels[status] || status}
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
