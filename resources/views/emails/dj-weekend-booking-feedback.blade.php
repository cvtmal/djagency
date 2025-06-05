<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Feedback Request for Your Weekend Booking</title>
</head>
<body>
    <h1>Feedback Request for Your Weekend Booking</h1>

    <p>Hi {{ $dj->name }},</p>

    <p>We hope your gig this past weekend went well! We'd love to get your feedback on the booking for {{ $availability->date->format('F j, Y') }}.</p>

    <p>Your feedback is valuable to help us improve our booking process and to know if we should follow up with the client for a review.</p>

    <div>
        <a href="{{ $feedbackUrl }}" style="background-color: #3490dc; color: white; padding: 8px 12px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">Provide Feedback</a>
    </div>

    <p>This will only take a minute of your time and helps us ensure we're providing the best possible service to both our DJs and clients.</p>

    <p>Thanks,<br>
    {{ config('app.name') }}</p>
</body>
</html>
