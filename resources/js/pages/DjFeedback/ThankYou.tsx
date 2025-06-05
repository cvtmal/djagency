import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Head } from "@inertiajs/react";

type ThankYouProps = {
  feedbackRequest: {
    id: number;
    token: string;
    bookingRequest: {
      id: number;
      date: string;
      venue_name: string;
    };
    dj: {
      name: string;
    };
  };
};

export default function ThankYou({ feedbackRequest }: ThankYouProps) {
  return (
    <>
      <Head title="Feedback Submitted - Thank You" />
      <div className="container py-10">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Thank You for Your Feedback!</CardTitle>
            <CardDescription>
              We appreciate you taking the time to provide feedback on your booking.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Your feedback for the event on {feedbackRequest.bookingRequest.date} has been recorded.
            </p>
            <p>
              This information helps us improve our booking process and ensures we provide the best possible experience
              for both our DJs and clients.
            </p>
            <p className="font-medium">
              We look forward to working with you on future bookings, {feedbackRequest.dj.name}!
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
