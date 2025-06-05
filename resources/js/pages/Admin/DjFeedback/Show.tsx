import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FeedbackRequestProps = {
  feedbackRequest: {
    id: number;
    dj: {
      id: number;
      name: string;
      email: string;
    };
    // Backend still returns data with this structure for backwards compatibility
    bookingRequest: {
      id: number;
      date: string;
      venue_name: string;
      client_name: string;
    };
    // New relationship structure (optional since we're still using bookingRequest in the UI)
    availability?: {
      id: number;
      date: string;
    };
    status: string;
    was_party_good: boolean | null;
    request_review: boolean | null;
    client_email: string | null;
    additional_comments: string | null;
    sent_at: string;
    responded_at: string | null;
    client_contacted_at: string | null;
    [key: string]: any; // Allow for index signature to handle either structure
  };
};

export default function Show({ feedbackRequest }: FeedbackRequestProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data, setData, post, processing, errors } = useForm({
    client_email: feedbackRequest.client_email || '',
    message: '',
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("admin.dj-feedback.contact-client", feedbackRequest.id), {
      onSuccess: () => setIsDialogOpen(false),
    });
  };

  const canContactClient = 
    feedbackRequest.status === "completed" && 
    feedbackRequest.request_review === true;

  return (
    <AppLayout>
      <Head title={`Feedback from ${feedbackRequest.dj.name}`} />
      
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link 
              href={route("admin.dj-feedback.index")}
              className="flex items-center text-sm text-primary hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to all feedback requests
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-semibold">
              Feedback from {feedbackRequest.dj.name}
            </h1>
            <p className="text-muted-foreground">
              For booking on {feedbackRequest.bookingRequest.date}
            </p>
          </div>

          <div className="space-y-6">
            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Event Date</p>
                    <p>{feedbackRequest.bookingRequest.date}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Venue</p>
                    <p>{feedbackRequest.bookingRequest.venue_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Client</p>
                    <p>{feedbackRequest.bookingRequest.client_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">DJ</p>
                    <p>{feedbackRequest.dj.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feedback Status */}
            <Card>
              <CardHeader>
                <CardTitle>Feedback Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    {feedbackRequest.status === "pending" && (
                      <Badge variant="outline">Pending</Badge>
                    )}
                    {feedbackRequest.status === "completed" && (
                      <Badge variant="secondary">Completed</Badge>
                    )}
                    {feedbackRequest.status === "client_contacted" && (
                      <Badge className="bg-green-600">Client Contacted</Badge>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Sent On</p>
                    <p>{feedbackRequest.sent_at}</p>
                  </div>
                  {feedbackRequest.responded_at && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Responded On</p>
                      <p>{feedbackRequest.responded_at}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Feedback Responses */}
            {feedbackRequest.status !== "pending" && (
              <Card>
                <CardHeader>
                  <CardTitle>DJ's Feedback</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Was the party good?</p>
                    {feedbackRequest.was_party_good ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        <span>Yes, the party was good</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <XCircle className="h-5 w-5 mr-2" />
                        <span>No, the party wasn't good</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Should we ask for a Google review?
                    </p>
                    {feedbackRequest.request_review ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        <span>Yes, ask for a review</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <XCircle className="h-5 w-5 mr-2" />
                        <span>No, don't ask for a review</span>
                      </div>
                    )}
                  </div>

                  {feedbackRequest.client_email && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Client Email</p>
                      <p>{feedbackRequest.client_email}</p>
                    </div>
                  )}

                  {feedbackRequest.additional_comments && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Additional Comments</p>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="whitespace-pre-wrap">{feedbackRequest.additional_comments}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {canContactClient && feedbackRequest.status !== "client_contacted" && (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>Contact Client for Review</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={onSubmit}>
                          <DialogHeader>
                            <DialogTitle>Contact Client for Review</DialogTitle>
                            <DialogDescription>
                              Send an email to the client asking for a Google review.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="client_email">Client Email</Label>
                              <Input
                                id="client_email"
                                value={data.client_email}
                                onChange={(e) => setData('client_email', e.target.value)}
                                required
                                type="email"
                              />
                              {errors.client_email && (
                                <p className="text-sm text-red-600">{errors.client_email}</p>
                              )}
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="message">
                                Custom Message (Optional)
                              </Label>
                              <Textarea
                                id="message"
                                placeholder="Add a personalized note to the client..."
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>Send Email</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}

                  {feedbackRequest.status === "client_contacted" && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      <span>Client contacted on {feedbackRequest.client_contacted_at}</span>
                    </div>
                  )}
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
