import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Head } from "@inertiajs/react";

type FeedbackRequestProps = {
  feedbackRequest: {
    id: number;
    token: string;
    status: string;
    bookingRequest: {
      id: number;
      date: string;
      venue_name: string;
      client_name: string;
    };
    dj: {
      id: number;
      name: string;
    };
  };
};

interface FeedbackFormData {
  was_party_good: boolean;
  request_review: boolean;
  client_email: string;
  additional_comments: string;
  [key: string]: any; // Add index signature for Inertia FormDataType constraint
}

export default function Show({ feedbackRequest }: FeedbackRequestProps) {
  const { data, setData, post, processing, errors } = useForm<FeedbackFormData>({
    was_party_good: false,
    request_review: false,
    client_email: "",
    additional_comments: "",
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    post(route("dj-feedback.update", feedbackRequest.token));
  }

  // If feedback has already been submitted, show a message
  if (feedbackRequest.status !== "pending") {
    return (
      <>
        <Head title="Feedback Already Submitted" />
        <div className="container py-10">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Thank You!</CardTitle>
              <CardDescription>
                You have already submitted feedback for this booking.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Your feedback for the booking on {feedbackRequest.bookingRequest.date} at{" "}
                {feedbackRequest.bookingRequest.venue_name} has been recorded.
              </p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Head title="DJ Booking Feedback" />
      <div className="container py-10">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Booking Feedback</CardTitle>
            <CardDescription>
              Please provide feedback for your booking on {feedbackRequest.bookingRequest.date} at {feedbackRequest.bookingRequest.venue_name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <Checkbox
                  id="was_party_good"
                  checked={data.was_party_good}
                  onCheckedChange={(checked) => setData('was_party_good', checked === true)}
                />
                <div className="space-y-1 leading-none">
                  <label htmlFor="was_party_good" className="text-sm font-medium">Was the party good?</label>
                  <p className="text-sm text-gray-500">
                    Let us know if the event went well
                  </p>
                </div>
              </div>

              <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <Checkbox
                  id="request_review"
                  checked={data.request_review}
                  onCheckedChange={(checked) => setData('request_review', checked === true)}
                />
                <div className="space-y-1 leading-none">
                  <label htmlFor="request_review" className="text-sm font-medium">Should we ask for a Google review?</label>
                  <p className="text-sm text-gray-500">
                    Would you recommend asking this client for a review?
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="client_email" className="text-sm font-medium">Client Email (optional)</label>
                <Input 
                  id="client_email"
                  type="email" 
                  placeholder="client@example.com" 
                  value={data.client_email} 
                  onChange={e => setData('client_email', e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Provide the client's email if you have it
                </p>
                {errors.client_email && <p className="text-sm text-red-500">{errors.client_email}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="additional_comments" className="text-sm font-medium">Additional Comments (optional)</label>
                <Textarea 
                  id="additional_comments"
                  placeholder="Any other comments about this booking..." 
                  value={data.additional_comments} 
                  onChange={e => setData('additional_comments', e.target.value)}
                />
                {errors.additional_comments && <p className="text-sm text-red-500">{errors.additional_comments}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={processing}>Submit Feedback</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
