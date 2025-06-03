import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2, ExternalLink } from 'lucide-react';
import { ModalForm, FormField } from '@/components/ui/modal-form';
import { useToast } from '@/components/ui/toast';

interface BookingRequest {
  id: number;
  requestNumber: string;
  date: string;
  clientName: string;
  status: 'pending' | 'quoted' | 'confirmed' | 'declined';
  djsQuoted: string[];
  lastAction: string;
  lastActionDate: string;
  venue: string;
  notes: string;
  startTime: string;
  endTime: string;
}

// Generate mock booking requests
const generateMockRequests = (): BookingRequest[] => {
  const statuses: BookingRequest['status'][] = ['pending', 'quoted', 'confirmed', 'declined'];
  const clients = ['John Smith', 'Emily Johnson', 'Michael Brown', 'Sophia Davis', 'Robert Wilson', 
                  'Emma Thompson', 'Daniel Martinez', 'Olivia Anderson', 'James Taylor', 'Ava Garcia'];
  const venues = ['Club Elektra', 'The Basement', 'Sky Lounge', 'Ocean View', 'Downtown Beats', 
                 'Velvet Room', 'The Loft', 'Harmony Hall', 'The Grand', 'Sunset Terrace'];
  const djNames = [
    'DJ Marc', 'DJ Damian', 'DJ Junus', 'DJ Toni', 'DJ Mike', 'DJ Sarah', 'DJ Alex', 'DJ Chris',
    'DJ Emma', 'DJ David', 'DJ Lisa', 'DJ Kevin', 'DJ Anna', 'DJ James', 'DJ Laura'
  ];
  
  const actions = ['Created', 'Updated', 'Quote sent', 'Client replied', 'Booking confirmed', 'Payment received'];
  
  // Generate 15 booking requests
  return Array.from({ length: 15 }, (_, i) => {
    const id = i + 1;
    const requestNumber = `REQ-${String(2025).slice(-2)}${String(id).padStart(4, '0')}`;
    
    // Generate a random date in 2025
    const month = 1 + Math.floor(Math.random() * 12);
    const day = 1 + Math.floor(Math.random() * 28);
    const date = `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.2025`;
    
    // Generate random status and action date
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const actionMonth = 1 + Math.floor(Math.random() * 12);
    const actionDay = 1 + Math.floor(Math.random() * 28);
    const actionDate = `${String(actionDay).padStart(2, '0')}.${String(actionMonth).padStart(2, '0')}.2025`;
    
    // Generate random DJs quoted (1-3)
    const numDjsQuoted = 1 + Math.floor(Math.random() * 3);
    const djsQuoted = Array.from(
      { length: numDjsQuoted },
      () => djNames[Math.floor(Math.random() * djNames.length)]
    ).filter((dj, idx, arr) => arr.indexOf(dj) === idx); // Remove duplicates
    
    return {
      id,
      requestNumber,
      date,
      clientName: clients[Math.floor(Math.random() * clients.length)],
      status,
      djsQuoted,
      lastAction: actions[Math.floor(Math.random() * actions.length)],
      lastActionDate: actionDate,
      venue: venues[Math.floor(Math.random() * venues.length)],
      notes: `Request for ${date} event at ${venues[Math.floor(Math.random() * venues.length)]}`,
      startTime: `${18 + Math.floor(Math.random() * 3)}:00`,
      endTime: `${22 + Math.floor(Math.random() * 3)}:00`
    };
  });
};

export function RequestsManagement() {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<BookingRequest[]>(generateMockRequests());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);

  // Form fields for editing a request
  const getRequestFormFields = (request?: BookingRequest): FormField[] => [
    {
      id: 'clientName',
      label: 'Client Name',
      type: 'text',
      value: request?.clientName || '',
      placeholder: 'Client Name'
    },
    {
      id: 'date',
      label: 'Event Date',
      type: 'text',
      value: request?.date || '',
      placeholder: 'DD.MM.YYYY'
    },
    {
      id: 'venue',
      label: 'Venue',
      type: 'text',
      value: request?.venue || '',
      placeholder: 'Venue Name'
    },
    {
      id: 'startTime',
      label: 'Start Time',
      type: 'text',
      value: request?.startTime || '',
      placeholder: '18:00'
    },
    {
      id: 'endTime',
      label: 'End Time',
      type: 'text',
      value: request?.endTime || '',
      placeholder: '22:00'
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      value: request?.status || 'pending',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'quoted', label: 'Quoted' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'declined', label: 'Declined' }
      ]
    },
    {
      id: 'notes',
      label: 'Notes',
      type: 'textarea',
      value: request?.notes || '',
      placeholder: 'Additional notes about this booking request'
    }
  ];

  const handleEditRequest = (formData: Record<string, any>) => {
    if (!selectedRequest) return;

    const updatedRequests = requests.map(request => {
      if (request.id === selectedRequest.id) {
        return {
          ...request,
          clientName: formData.clientName as string,
          date: formData.date as string,
          venue: formData.venue as string,
          startTime: formData.startTime as string,
          endTime: formData.endTime as string,
          status: formData.status as BookingRequest['status'],
          notes: formData.notes as string,
          lastAction: 'Updated',
          lastActionDate: new Date().toLocaleDateString('de-DE')
        };
      }
      return request;
    });

    setRequests(updatedRequests);
    setIsEditModalOpen(false);
    setSelectedRequest(null);
    showToast('Booking request updated successfully');
  };

  const handleDeleteRequest = (id: number) => {
    setRequests(requests.filter(request => request.id !== id));
    showToast('Booking request deleted', 'info');
  };

  const handleEditClick = (request: BookingRequest) => {
    setSelectedRequest(request);
    setIsEditModalOpen(true);
  };

  const getStatusBadgeStyles = (status: BookingRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'quoted':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Booking Requests</h1>
        <Button onClick={() => showToast('New requests can be created from client-facing form', 'info')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>DJs Quoted</TableHead>
              <TableHead>Last Action</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.requestNumber}</TableCell>
                <TableCell>{request.date}</TableCell>
                <TableCell>{request.clientName}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStatusBadgeStyles(request.status)}
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {request.djsQuoted.map((dj, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {dj}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{request.lastAction}</div>
                    <div className="text-gray-500 text-xs">{request.lastActionDate}</div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(request)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => showToast('Viewing request details', 'info')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      onClick={() => handleDeleteRequest(request.id)}
                    >
                      <Trash2 className="h-4 w-4" />
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
          title={`Edit Request: ${selectedRequest.requestNumber}`}
          fields={getRequestFormFields(selectedRequest)}
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSubmit={handleEditRequest}
        />
      )}
    </div>
  );
}
