import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail, 
  CheckCircle2 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type FeedbackRequest = {
  id: number;
  booking_id: number;
  dj: {
    id: number;
    name: string;
  };
  // Backend still returns data with this structure for backwards compatibility
  bookingRequest: {
    id: number;
    date: string;
    venue_name: string;
    client_name: string;
  };
  // New relationship structure
  availability?: {
    id: number;
    date: string;
  };
  status: string;
  was_party_good: boolean | null;
  request_review: boolean | null;
  client_email: string | null;
  sent_at: string;
  responded_at: string | null;
  client_contacted_at: string | null;
  [key: string]: any; // Allow for index signature to handle either structure
};

type PaginatedData = {
  data: FeedbackRequest[];
  meta?: {
    total?: number;
    current_page?: number;
    last_page?: number;
  };
  links?: any;
};

type Props = {
  feedbackRequests: PaginatedData;
  filters: {
    status: string | null;
  };
  statuses: Record<string, string>;
};

export default function Index({ feedbackRequests, filters, statuses }: Props) {
  function handleStatusChange(value: string) {
    router.get(route("admin.dj-feedback.index"), 
      { status: value === 'all' ? '' : value }, 
      { preserveState: true }
    );
  }

  return (
    <AppLayout>
      <Head title="DJ Feedback Requests" />
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">DJ Feedback Requests</h1>
            
            <div className="w-64">
              <Select 
                value={filters.status || "all"} 
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.entries(statuses).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                Found {feedbackRequests.meta?.total || feedbackRequests.data.length} feedback requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {feedbackRequests.data.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No feedback requests found</p>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>DJ</TableHead>
                        <TableHead>Event Date</TableHead>
                        <TableHead>Venue</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Feedback</TableHead>
                        <TableHead>Client Review</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feedbackRequests.data.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>{request.dj.name}</TableCell>
                          <TableCell>{request.bookingRequest.date}</TableCell>
                          <TableCell>{request.bookingRequest.venue_name}</TableCell>
                          <TableCell>
                            {request.status === "pending" && (
                              <Badge variant="outline" className="flex gap-1 items-center">
                                <Clock className="h-3 w-3" />
                                Pending
                              </Badge>
                            )}
                            {request.status === "completed" && (
                              <Badge variant="secondary" className="flex gap-1 items-center">
                                <CheckCircle className="h-3 w-3" />
                                Completed
                              </Badge>
                            )}
                            {request.status === "client_contacted" && (
                              <Badge className="flex gap-1 items-center bg-green-600">
                                <Mail className="h-3 w-3" />
                                Client Contacted
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {request.was_party_good === null ? (
                              <span className="text-muted-foreground">Awaiting...</span>
                            ) : request.was_party_good ? (
                              <span className="text-green-600 flex items-center gap-1">
                                <CheckCircle2 className="h-4 w-4" />
                                Good
                              </span>
                            ) : (
                              <span className="text-red-600 flex items-center gap-1">
                                <XCircle className="h-4 w-4" />
                                Not good
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {request.status === "pending" ? (
                              <span className="text-muted-foreground">Awaiting...</span>
                            ) : request.request_review ? (
                              <span className="text-green-600 flex items-center gap-1">
                                <CheckCircle2 className="h-4 w-4" />
                                Recommended
                              </span>
                            ) : (
                              <span className="text-red-600 flex items-center gap-1">
                                <XCircle className="h-4 w-4" />
                                Not recommended
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Link href={route("admin.dj-feedback.show", request.id)}>
                              <Button variant="outline" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {feedbackRequests.meta && feedbackRequests.meta.last_page && feedbackRequests.meta.last_page > 1 && feedbackRequests.links && (
                    <div className="flex justify-end mt-4 gap-2">
                      {feedbackRequests.links.map((link: any, i: number) => (
                        <Link
                          key={i}
                          href={link.url ?? "#"}
                          className={`px-4 py-2 text-sm rounded-md ${
                            link.active
                              ? "bg-primary text-white"
                              : link.url
                              ? "bg-gray-100 hover:bg-gray-200"
                              : "bg-gray-50 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {link.label.replace(/&laquo;|&raquo;/g, "")}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
