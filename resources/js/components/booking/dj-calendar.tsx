import { useState, useCallback } from 'react';
import { BookingStatus, BookingDate, BookingRequest } from '@/components/booking/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, MapPin, Music } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

// Interface for our calendar item
interface CalendarItem {
  date: BookingDate;
  status: BookingStatus;
  request?: BookingRequest;
}

// Generate the next 15 Fridays and Saturdays starting from current date
const generateUpcomingWeekendDates = (count: number = 15): BookingDate[] => {
  const dates: BookingDate[] = [];
  let dateId = 1;
  
  // Start from current date
  const today = new Date();
  const currentDate = new Date(today);
  
  // Loop until we have enough dates
  while (dates.length < count) {
    // Check if it's Friday (5) or Saturday (6)
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      // Format date for display
      const day = currentDate.getDate().toString().padStart(2, '0');
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const year = currentDate.getFullYear();
      const formattedDate = `${day}.${month}.${year}`;
      
      // Get month name for more readable format
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthName = monthNames[currentDate.getMonth()];
      
      // Day name
      const dayName = dayOfWeek === 5 ? 'Fri' : 'Sat';
      
      dates.push({
        id: dateId++,
        date: currentDate.toISOString().split('T')[0], // ISO format for internal use
        displayDate: `${dayName} ${day} ${monthName} ${year}`, // More readable format
        dayName: dayOfWeek === 5 ? 'Friday' : 'Saturday'
      });
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

// Random status generator with weighted distribution
const getRandomStatus = (): BookingStatus => {
  const random = Math.random();
  if (random < 0.4) return 'free';
  if (random < 0.6) return 'quoted';
  if (random < 0.85) return 'booked';
  return 'blocked';
};

// Generate mock booking request for "quoted" status
const generateMockBookingRequest = (): BookingRequest => {
  const venues = ['Club Elektra', 'The Basement', 'Sky Lounge', 'Harmony Hall', 'Downtown Beats'];
  const clients = ['John Smith', 'Emily Johnson', 'Michael Brown', 'Sophia Davis', 'Robert Wilson'];
  const genreSets = [
    ['House', 'Techno'],
    ['Hip-Hop', 'R&B'],
    ['EDM', 'Pop'],
    ['Disco', 'Funk'],
    ['80s', '90s', 'Retro'],
    ['Latin', 'Reggaeton'],
    ['Rock', 'Alternative']
  ];
  
  // Pick random values
  const venue = venues[Math.floor(Math.random() * venues.length)];
  const clientName = clients[Math.floor(Math.random() * clients.length)];
  const genres = genreSets[Math.floor(Math.random() * genreSets.length)];
  
  // Random start time between 6PM and 11PM
  const startHour = Math.floor(Math.random() * 6) + 18;
  const startTime = `${startHour}:00`;
  
  // Random end time 3-5 hours after start time
  const duration = Math.floor(Math.random() * 3) + 3;
  const endHour = (startHour + duration) % 24;
  const endTime = `${endHour}:00`;
  
  // Random notes
  const notesOptions = [
    'Client requested upbeat music for the first hour.',
    'Special event, please coordinate with venue staff.',
    'Birthday celebration, prepare some birthday classics.',
    'Corporate event, keep music appropriate.',
    'Wedding after-party, coordinate with wedding planner.'
  ];
  const notes = notesOptions[Math.floor(Math.random() * notesOptions.length)];
  
  return {
    clientName,
    venue,
    genres,
    startTime,
    endTime,
    notes
  };
};

// Status color mapping
const statusColors = {
  free: 'bg-gray-100 text-gray-600 border-gray-200',
  quoted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  booked: 'bg-green-100 text-green-800 border-green-200',
  blocked: 'bg-red-100 text-red-800 border-red-200'
};

// Status labels
const statusLabels = {
  free: 'Free',
  quoted: 'Quoted',
  booked: 'Booked by agency',
  blocked: 'Blocked'
};

export default function DJCalendar() {
  const { showToast } = useToast();
  
  // Generate initial calendar data
  const generateCalendarData = useCallback((): CalendarItem[] => {
    const dates = generateUpcomingWeekendDates(15);
    
    return dates.map(date => {
      const status = getRandomStatus();
      return {
        date,
        status,
        // Only generate request data for "quoted" status
        request: status === 'quoted' ? generateMockBookingRequest() : undefined
      };
    });
  }, []);
  
  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>(generateCalendarData());
  
  // Handle status update
  const updateStatus = useCallback((index: number, newStatus: BookingStatus) => {
    setCalendarItems(prevItems => {
      const newItems = [...prevItems];
      newItems[index] = {
        ...newItems[index],
        status: newStatus,
        // Clear request data if status is not "quoted"
        request: newStatus === 'quoted' ? newItems[index].request : undefined
      };
      return newItems;
    });
    
    // Show toast notification
    const message = newStatus === 'booked' 
      ? 'Date marked as Booked by agency!' 
      : 'Date marked as Available again!';
    showToast(message, 'success');
  }, [showToast]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm p-4 flex items-center">
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">My Calendar</h1>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4">
        <div className="space-y-4 mb-4">
          <h2 className="text-lg font-medium">Upcoming Dates</h2>
          <p className="text-sm text-gray-600">
            View and manage your upcoming booking requests
          </p>
        </div>
        
        {/* Calendar list */}
        <div className="space-y-4">
          {calendarItems.map((item, index) => (
            <div 
              key={item.date.id}
              className={`rounded-lg border p-4 ${statusColors[item.status]} transition-colors`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{item.date.displayDate}</h3>
                  <Badge variant="outline" className="mt-1.5">
                    {statusLabels[item.status]}
                  </Badge>
                </div>
              </div>
              
              {/* Show booking request information for quoted status */}
              {item.status === 'quoted' && item.request && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-start">
                    <div className="w-8 h-8 flex items-center justify-center mt-0.5">
                      <span className="text-gray-500">👤</span>
                    </div>
                    <div className="ml-2 flex-1">
                      <p className="text-sm font-medium">Client</p>
                      <p className="text-sm text-gray-600">{item.request.clientName}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 flex items-center justify-center mt-0.5">
                      <MapPin className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="ml-2 flex-1">
                      <p className="text-sm font-medium">Venue</p>
                      <p className="text-sm text-gray-600">{item.request.venue}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 flex items-center justify-center mt-0.5">
                      <Music className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="ml-2 flex-1">
                      <p className="text-sm font-medium">Genres</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.request.genres.map((genre, idx) => (
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
                    <div className="ml-2 flex-1">
                      <p className="text-sm font-medium">Time</p>
                      <p className="text-sm text-gray-600">
                        {item.request.startTime} - {item.request.endTime}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action buttons for quoted status */}
                  <div className="mt-4 flex gap-3">
                    <Button 
                      className="flex-1 h-12 text-base"
                      onClick={() => updateStatus(index, 'booked')}
                    >
                      Booked by agency
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 h-12 text-base"
                      onClick={() => updateStatus(index, 'free')}
                    >
                      Available again
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
