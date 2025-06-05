import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ExternalLink, PlusCircle, Mail, MessageSquare, Calendar } from 'lucide-react';
import { BookingRequestTableItem, BookingStatus } from '@/components/booking/types';
import { ModalForm, FormField } from '@/components/ui/modal-form';
import { useToast } from '@/components/ui/toast';
import { router, useForm, usePage } from '@inertiajs/react';

const statusColors: Record<string, string> = {
  'new': 'bg-gray-100 text-gray-600',
  'quoted': 'bg-yellow-100 text-yellow-800',
  'booked': 'bg-green-100 text-green-800',
  'cancelled': 'bg-red-100 text-red-800'
};

const followUpColors: Record<string, string> = {
  'pending': 'bg-blue-100 text-blue-800',
  'responded': 'bg-green-100 text-green-800',
  'overdue': 'bg-red-100 text-red-800'
};

const formatDate = (dateString: string | undefined, dateOnly: boolean = false): string => {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return 'Invalid Date';

    // Format date components
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    if (dateOnly) {
      // Format: DD.MM.YYYY
      return `${day}.${month}.${year}`;
    } else {
      // Format: DD.MM.YYYY HH:MM:SS
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
    }
  } catch (e) {
    return 'Invalid Date';
  }
};

interface BookingRequestsProps {
  bookingRequests: BookingRequestTableItem[];
}

export function BookingRequests({ bookingRequests = [] }: BookingRequestsProps) {
  const { showToast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BookingRequestTableItem | null>(null);


  // Use the booking requests passed as props
  const requests: BookingRequestTableItem[] = Array.isArray(bookingRequests) ? bookingRequests : [];



  // Form fields for editing a request
  const getRequestFormFields = (request?: BookingRequestTableItem): FormField[] => [
    // Basic Information
    {
      id: 'client_name',
      label: 'Client Name',
      type: 'text',
      value: request?.client_name || '',
      placeholder: 'Client Name'
    },
    {
      id: 'date',
      label: 'Date',
      type: 'text',
      value: request?.date || '',
      placeholder: 'YYYY-MM-DD'
    },
    {
      id: 'time_range',
      label: 'Time Range',
      type: 'text',
      value: request?.time_range || '',
      placeholder: 'e.g., 18:00 - 00:00'
    },
    {
      id: 'venue',
      label: 'Venue',
      type: 'text',
      value: request?.venue || '',
      placeholder: 'Venue Name'
    },
    {
      id: 'event_type',
      label: 'Event Type',
      type: 'text',
      value: request?.event_type || '',
      placeholder: 'Wedding, Birthday, etc.'
    },
    {
      id: 'guest_count',
      label: 'Guest Count',
      type: 'number',
      value: request?.guest_count?.toString() || '',
      placeholder: '100'
    },
    // Contact Information
    {
      id: 'contact_email',
      label: 'Contact Email',
      type: 'text',
      value: request?.contact_email || '',
      placeholder: 'client@example.com'
    },
    {
      id: 'contact_phone',
      label: 'Contact Phone',
      type: 'text',
      value: request?.contact_phone || '',
      placeholder: '+49 123 456789'
    },
    {
      id: 'contact_street',
      label: 'Street',
      type: 'text',
      value: request?.contact_street || '',
      placeholder: 'Street Address'
    },
    {
      id: 'contact_city',
      label: 'City',
      type: 'text',
      value: request?.contact_city || '',
      placeholder: 'City'
    },
    {
      id: 'contact_postal_code',
      label: 'Postal Code',
      type: 'text',
      value: request?.contact_postal_code || '',
      placeholder: 'Postal Code'
    },
    {
      id: 'contact_option',
      label: 'Preferred Contact Method',
      type: 'select',
      value: request?.contact_option || 'email',
      options: [
        { value: 'email', label: 'Email' },
        { value: 'phone', label: 'Phone' },
        { value: 'whatsapp', label: 'WhatsApp' }
      ]
    },
    // Event Details
    {
      id: 'equipment',
      label: 'Equipment',
      type: 'text',
      value: request?.equipment || '',
      placeholder: 'Required equipment'
    },
    {
      id: 'notes',
      label: 'Notes',
      type: 'textarea',
      value: request?.notes || '',
      placeholder: 'Additional notes or requests'
    },
    {
      id: 'additional_music',
      label: 'Additional Music Requests',
      type: 'textarea',
      value: request?.additional_music || '',
      placeholder: 'Special songs or music requests'
    },
    // Status
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      value: request?.status || 'new',
      options: [
        { value: 'new', label: 'New' },
        { value: 'quoted', label: 'Quoted' },
        { value: 'booked', label: 'Booked' },
        { value: 'cancelled', label: 'Cancelled' }
      ]
    },
    {
      id: 'request_number',
      label: 'Request Number',
      type: 'text',
      value: request?.request_number || '',
      placeholder: 'Auto-generated',
      disabled: true
    }
  ];

  // Define the form with proper typing - including all fields
  const form = useForm<{
    // Basic information
    client_name: string;
    venue: string;
    event_type: string;
    date: string;
    time_range: string;
    guest_count: number;

    // Contact information
    contact_email: string;
    contact_phone: string;
    contact_street: string;
    contact_city: string;
    contact_postal_code: string;
    contact_option: string;

    // Event details
    equipment: string;
    notes: string;
    additional_music: string;

    // Status
    status: string;
    request_number: string;
  }>({
    // Basic information
    client_name: '',
    venue: '',
    event_type: '',
    date: '',
    time_range: '',
    guest_count: 0,

    // Contact information
    contact_email: '',
    contact_phone: '',
    contact_street: '',
    contact_city: '',
    contact_postal_code: '',
    contact_option: 'email',

    // Event details
    equipment: '',
    notes: '',
    additional_music: '',

    // Status
    status: 'new',
    request_number: ''
  });

  const handleEditRequest = (formData: Record<string, any>) => {
    if (!selectedRequest) return;

    // Set form data in a type-safe way
    form.clearErrors();
    form.reset();

    // Basic information fields
    if (formData.client_name) form.data.client_name = formData.client_name as string;
    if (formData.venue) form.data.venue = formData.venue as string;
    if (formData.event_type) form.data.event_type = formData.event_type as string;
    if (formData.date) form.data.date = formData.date as string;
    if (formData.time_range) form.data.time_range = formData.time_range as string;
    if (formData.guest_count) form.data.guest_count = Number(formData.guest_count);

    // Contact information fields
    if (formData.contact_email) form.data.contact_email = formData.contact_email as string;
    if (formData.contact_phone) form.data.contact_phone = formData.contact_phone as string;
    if (formData.contact_street) form.data.contact_street = formData.contact_street as string;
    if (formData.contact_city) form.data.contact_city = formData.contact_city as string;
    if (formData.contact_postal_code) form.data.contact_postal_code = formData.contact_postal_code as string;
    if (formData.contact_option) form.data.contact_option = formData.contact_option as string;

    // Event detail fields
    if (formData.equipment) form.data.equipment = formData.equipment as string;
    if (formData.notes) form.data.notes = formData.notes as string;
    if (formData.additional_music) form.data.additional_music = formData.additional_music as string;

    // Status fields
    if (formData.status) form.data.status = formData.status as string;
    if (formData.request_number) form.data.request_number = formData.request_number as string;

    // Submit using Inertia router
    form.put(route('booking-requests.update', selectedRequest.id), {
      preserveScroll: true,
      onSuccess: () => {
        setIsEditModalOpen(false);
        setSelectedRequest(null);
        showToast('Request updated successfully', 'success');
      },
      onError: () => {
        showToast('Failed to update request', 'error');
      }
    });
  };

  const handleDeleteRequest = (id: number) => {
    if (confirm('Are you sure you want to delete this request?')) {
      router.delete(route('booking-requests.destroy', id), {
        preserveScroll: true,
        onSuccess: () => {
          showToast('Request deleted successfully', 'success');
        },
        onError: () => {
          showToast('Failed to delete request', 'error');
        }
      });
    }
  };

  const handleEditClick = (request: BookingRequestTableItem) => {
    setSelectedRequest(request);
    setIsEditModalOpen(true);
  };

  const handleNewRequest = () => {
    // Redirect to the booking form page using Inertia
    router.visit(route('booking.form'));
  };

  const handleEmailQuote = (request: BookingRequestTableItem) => {
    router.visit(route('booking-requests.email-quote', { bookingRequest: request.id }));
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <Button onClick={handleNewRequest} size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>
      <div className="bg-white border rounded-lg shadow">
        <Table className="text-xs">{/* Make all table content smaller */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px] py-2">ID</TableHead>
              <TableHead className="w-[90px] py-2">Date</TableHead>
              <TableHead className="w-[130px] py-2">Client Name</TableHead>
              <TableHead className="w-[130px] py-2">Venue</TableHead>
              <TableHead className="w-[100px] py-2">Event Type</TableHead>
              <TableHead className="w-[80px] py-2">Status</TableHead>
              <TableHead className="w-[100px] py-2">Follow-up</TableHead>
              <TableHead className="w-[110px] py-2">Created At</TableHead>
              <TableHead className="w-[120px] py-2 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request: BookingRequestTableItem) => (
              <TableRow key={request.id} className="hover:bg-gray-50 h-8">{/* Reduced row height */}
                <TableCell className="font-medium py-1">{request.id}</TableCell>
                <TableCell className="py-1">{formatDate(request.date)}</TableCell>
                <TableCell className="py-1">{request.client_name}</TableCell>
                <TableCell className="py-1">{request.venue}</TableCell>
                <TableCell className="py-1">{request.event_type}</TableCell>
                <TableCell className="py-1">
                  <Badge className={`${statusColors[request.status]} text-xs px-1 py-0`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="py-1">
                  {request.status === 'quoted' && (
                    <div>
                      {request.has_responded ? (
                        <Badge className="bg-green-100 text-green-800 text-xs px-1 py-0">
                          Responded
                        </Badge>
                      ) : request.next_follow_up_at ? (
                        <div className="flex items-center space-x-1">
                          <Badge className="bg-blue-100 text-blue-800 text-xs px-1 py-0">
                            {new Date(request.next_follow_up_at) > new Date() ? 'Pending' : 'Overdue'}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatDate(request.next_follow_up_at, true)}
                          </span>
                        </div>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-600 text-xs px-1 py-0">
                          Not Scheduled
                        </Badge>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell className="py-1">{formatDate(request.created_at)}</TableCell>
                <TableCell className="py-1 text-right">
                  <div className="flex justify-end space-x-1">
                    {/* Show Email Quote button only for new requests */}
                    {request.status === 'new' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleEmailQuote(request)}
                      >
                        <Mail className="h-3 w-3" />
                      </Button>
                    )}

                    {/* Show Interactions button for quoted requests */}
                    {request.status === 'quoted' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => router.visit(route('booking-requests.interactions.index', request.id))}
                      >
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleEditClick(request)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => showToast('Viewing request details', 'info')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                      onClick={() => handleDeleteRequest(request.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Request Modal */}
      {selectedRequest && (
        <ModalForm
          title={`Edit Request: ${selectedRequest.request_number}`}
          fields={getRequestFormFields(selectedRequest)}
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSubmit={handleEditRequest}
        />
      )}
    </div>
  );
}
