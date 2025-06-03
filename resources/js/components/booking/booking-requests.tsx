import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BookingRequestTableItem } from '@/components/booking/types';

// Generate mock requests data
const generateMockRequests = (count: number): BookingRequestTableItem[] => {
  const statuses = ['New', 'Quoted', 'Confirmed', 'Cancelled'];
  const clientNames = ['John Smith', 'Emily Johnson', 'Michael Brown', 'Sophia Davis', 'Robert Wilson', 
                      'Emma Taylor', 'James Anderson', 'Olivia White', 'William Lee', 'Ava Martinez'];
  // Real DJ names
  const djNames = ['DJ Marc', 'DJ Damian', 'DJ Junus', 'DJ Toni', 'DJ Mike', 'DJ Sarah', 'DJ Alex', 'DJ Chris',
                  'DJ Emma', 'DJ David', 'DJ Lisa', 'DJ Kevin', 'DJ Anna', 'DJ James', 'DJ Laura', 'DJ Tom'];
  const actions = ['Quote Sent', 'Client Response', 'Follow-up Email', 'Contract Signed', 'Deposit Paid'];
  
  return Array.from({ length: count }, (_, i) => {
    // Generate a date between now and 6 months in the future
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 180));
    
    // Format date as dd.mm.yyyy
    const day = futureDate.getDate().toString().padStart(2, '0');
    const month = (futureDate.getMonth() + 1).toString().padStart(2, '0');
    const year = futureDate.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;
    
    // Generate random status
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Generate random number of DJs quoted (1-3)
    const numDjsQuoted = 1 + Math.floor(Math.random() * 3);
    const djsQuoted = Array.from({ length: numDjsQuoted }, () => 
      djNames[Math.floor(Math.random() * djNames.length)]
    );
    
    // Generate last action date (within last 7 days)
    const lastActionDate = new Date();
    lastActionDate.setDate(lastActionDate.getDate() - Math.floor(Math.random() * 7));
    const formattedLastActionDate = lastActionDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return {
      id: i + 1,
      requestNumber: `REQ-${2025}-${1000 + i}`,
      date: formattedDate,
      clientName: clientNames[Math.floor(Math.random() * clientNames.length)],
      status,
      djsQuoted,
      lastAction: actions[Math.floor(Math.random() * actions.length)],
      lastActionDate: formattedLastActionDate
    };
  });
};

// Status colors for the badges
const statusColors: Record<string, string> = {
  'New': 'bg-blue-100 text-blue-800',
  'Quoted': 'bg-yellow-100 text-yellow-800',
  'Confirmed': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800'
};

export function BookingRequests() {
  const [requests] = useState<BookingRequestTableItem[]>(generateMockRequests(10));
  
  return (
    <div className="w-full">
      <div className="bg-white border rounded-lg shadow">
        <Table className="text-xs">{/* Make all table content smaller */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] py-2">Request #</TableHead>
              <TableHead className="w-[90px] py-2">Date</TableHead>
              <TableHead className="w-[140px] py-2">Client Name</TableHead>
              <TableHead className="w-[80px] py-2">Status</TableHead>
              <TableHead className="w-[160px] py-2">DJs Quoted</TableHead>
              <TableHead className="w-[160px] py-2">Last Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id} className="hover:bg-gray-50 h-8">{/* Reduced row height */}
                <TableCell className="font-medium py-1">{request.requestNumber}</TableCell>
                <TableCell className="py-1">{request.date}</TableCell>
                <TableCell className="py-1">{request.clientName}</TableCell>
                <TableCell className="py-1">
                  <Badge className={`${statusColors[request.status]} text-xs px-1 py-0`}>
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-1">
                  <div className="flex flex-wrap gap-1">
                    {request.djsQuoted.map((dj, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs px-1 py-0">
                        {dj}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="py-1">
                  <div className="flex flex-col">
                    <span className="text-xs">{request.lastAction}</span>
                    <span className="text-[10px] text-gray-500">{request.lastActionDate}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
