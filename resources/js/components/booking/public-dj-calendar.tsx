// @ts-nocheck - Disable type checking for shadcn UI components
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useForm } from '@inertiajs/react';
import { Button } from '@/shadcn/ui/button';
import { Calendar } from '@/shadcn/ui/calendar';
import { useToast } from '@/components/ui/toast';
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import { Loader2 } from 'lucide-react';
import { type DJ } from '@/types/models';

type DateInfo = {
  id?: number;
  date: string;
  status: string;
  is_custom_date: boolean;
  note?: string | null;
  day_name: string;
};

type CalendarMonth = {
  [date: string]: DateInfo;
};

type CalendarData = {
  [monthKey: string]: CalendarMonth;
};

type StatusInfo = {
  label: string;
  color: string;
};

type PublicDjCalendarProps = {
  dj: DJ;
  calendarData: CalendarData;
  customDates: DateInfo[];
  year: number;
  availabilityStatuses: {
    [key: string]: StatusInfo;
  };
};

export default function PublicDjCalendar({ 
  dj, 
  calendarData, 
  customDates, 
  year, 
  availabilityStatuses 
}: PublicDjCalendarProps) {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isAddDateModalOpen, setIsAddDateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateInfo | null>(null);
  const { showToast } = useToast();

  // Form for updating availability status
  const { data, setData, post, processing } = useForm({
    date: '',
    status: '',
    note: '',
    is_custom_date: false,
  });

  // Form for adding a custom date
  const { 
    data: customDateData, 
    setData: setCustomDateData, 
    post: postCustomDate, 
    processing: customDateProcessing 
  } = useForm({
    date: '',
    status: 'available',
    is_custom_date: true,
    note: '',
  });

  const handleDateClick = (date: string, existingData: DateInfo | null = null) => {
    setSelectedDate(existingData ? { ...existingData } : { 
      date, 
      status: 'available', 
      is_custom_date: false,
      day_name: format(parseISO(date), 'EEEE')
    });
    
    setData({
      date: date,
      status: existingData?.status || 'available',
      note: existingData?.note || '',
      is_custom_date: existingData?.is_custom_date || false,
    });
    
    setIsStatusModalOpen(true);
  };

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedDate?.id) {
      // Update existing availability
      post(route('dj-calendar.update', { uniqueIdentifier: dj.unique_identifier, djAvailability: selectedDate.id }), {
        preserveState: false,
        onSuccess: () => {
          setIsStatusModalOpen(false);
          showToast("Availability updated successfully", "success");
        },
      });
    } else {
      // Create new availability
      post(route('dj-calendar.store', { uniqueIdentifier: dj.unique_identifier }), {
        preserveState: false,
        onSuccess: () => {
          setIsStatusModalOpen(false);
          showToast("Availability created successfully", "success");
        },
      });
    }
  };

  const handleCustomDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    postCustomDate(route('dj-calendar.store', { uniqueIdentifier: dj.unique_identifier }), {
      preserveState: false,
      onSuccess: () => {
        setIsAddDateModalOpen(false);
        setCustomDateData({
          date: '',
          status: 'available',
          is_custom_date: true,
          note: '',
        });
        showToast("Custom date added successfully", "success");
      }
    });
  };

  const handleAddDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const formattedDate = format(date, 'yyyy-MM-dd');
    setCustomDateData({
      ...customDateData,
      date: formattedDate,
    });
  };

  const getMonthName = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    return format(new Date(parseInt(year), parseInt(month) - 1, 1), 'MMMM yyyy');
  };

  return (
    <div className="py-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">{dj.name}'s Calendar</h1>
          <div className="flex gap-2">
            <Button 
              onClick={() => setIsAddDateModalOpen(true)}
              variant="outline"
            >
              Add Custom Date
            </Button>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Manage your availability for booking events throughout the year.
        </p>
      </header>
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          {Object.entries(availabilityStatuses).map(([statusKey, statusInfo]) => (
            <div key={statusKey} className="flex items-center">
              <span className={`inline-block w-4 h-4 mr-1 rounded ${statusInfo.color}`}></span>
              <span className="text-sm">{statusInfo.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-10">
        {Object.entries(calendarData).map(([monthKey, dates]) => (
          <div key={monthKey} className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">{getMonthName(monthKey)}</h3>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {Object.values(dates).map((dateInfo) => {
                  const statusInfo = availabilityStatuses[dateInfo.status];
                  return (
                    <button
                      key={dateInfo.date}
                      onClick={() => handleDateClick(dateInfo.date, dateInfo)}
                      className={`p-3 rounded-md border border-gray-200 hover:border-gray-300 transition-colors ${statusInfo.color}`}
                    >
                      <div className="text-sm font-medium">
                        {format(parseISO(dateInfo.date), 'dd.MM.yyyy')}
                      </div>
                      <div className="text-xs mt-1">
                        {dateInfo.day_name}
                      </div>
                      {dateInfo.is_custom_date && (
                        <span className="inline-block mt-1 px-1 bg-gray-100 text-gray-600 text-xs rounded">
                          Custom
                        </span>
                      )}
                      {dateInfo.note && (
                        <div className="mt-1 text-xs truncate max-w-full" title={dateInfo.note}>
                          {dateInfo.note}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Status Update Modal */}
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Availability Status</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleStatusSubmit} className="space-y-4 py-4">
            <div>
              <div className="text-sm font-medium mb-1">Date:</div>
              <div className="text-base">
                {selectedDate && format(parseISO(selectedDate.date), 'EEEE, MMMM d, yyyy')}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium mb-2">Status:</div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {Object.entries(availabilityStatuses).map(([statusValue, statusInfo]) => (
                  <div key={statusValue} className="flex items-center">
                    <input
                      type="radio"
                      id={`status-${statusValue}`}
                      name="status"
                      className="mr-2"
                      checked={data.status === statusValue}
                      onChange={() => setData({ ...data, status: statusValue })}
                    />
                    <label 
                      htmlFor={`status-${statusValue}`} 
                      className={`flex-grow px-3 py-2 rounded-md text-sm ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="note" className="block text-sm font-medium mb-1">
                Note (optional):
              </label>
              <textarea
                id="note"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows={2}
                value={data.note || ''}
                onChange={(e) => setData({ ...data, note: e.target.value })}
              ></textarea>
            </div>
            
            <DialogFooter className="mt-4 sm:justify-between flex space-x-2">
              {selectedDate && selectedDate.id && selectedDate.is_custom_date && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    if (confirm('Are you sure you want to remove this custom date?')) {
                      post(route('dj-calendar.destroy', { 
                        uniqueIdentifier: dj.unique_identifier, 
                        djAvailability: selectedDate.id 
                      }), {
                        method: 'delete',
                        preserveState: false,
                        onSuccess: () => {
                          setIsStatusModalOpen(false);
                          showToast("Custom date removed successfully", "success");
                        },
                      });
                    }
                  }}
                >
                  Remove Date
                </Button>
              )}
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsStatusModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Add Custom Date Modal */}
      <Dialog open={isAddDateModalOpen} onOpenChange={setIsAddDateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Custom Date</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleCustomDateSubmit} className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Select Date:
              </label>
              <div className="border rounded-md p-2">
                <Calendar
                  mode="single"
                  selected={customDateData.date ? parseISO(customDateData.date) : undefined}
                  onSelect={handleAddDateSelect}
                  className="mx-auto"
                  classNames={{}}
                  showOutsideDays={true}
                />
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium mb-2">Status:</div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {Object.entries(availabilityStatuses).map(([statusValue, statusInfo]) => (
                  <div key={statusValue} className="flex items-center">
                    <input
                      type="radio"
                      id={`custom-status-${statusValue}`}
                      name="custom-status"
                      className="mr-2"
                      checked={customDateData.status === statusValue}
                      onChange={() => setCustomDateData({ ...customDateData, status: statusValue })}
                    />
                    <label 
                      htmlFor={`custom-status-${statusValue}`} 
                      className={`flex-grow px-3 py-2 rounded-md text-sm ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="custom-note" className="block text-sm font-medium mb-1">
                Note (optional):
              </label>
              <textarea
                id="custom-note"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows={2}
                value={customDateData.note || ''}
                onChange={(e) => setCustomDateData({ ...customDateData, note: e.target.value })}
              ></textarea>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDateModalOpen(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={customDateProcessing || !customDateData.date}
              >
                {customDateProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Date
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
