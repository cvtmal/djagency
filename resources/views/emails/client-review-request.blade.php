<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
        }
        .header {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            background-color: #3b82f6;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }
        .message {
            background-color: #f3f4f6;
            padding: 15px;
            border-left: 4px solid #3b82f6;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">We'd Love Your Feedback!</div>
    
    <p>Dear Client,</p>
    
    <p>Thank you for choosing our DJ services for your event on {{ $feedbackRequest->availability->date->format('F j, Y') }}.</p>
    
    <p>We hope you had a great experience with DJ {{ $feedbackRequest->dj->name }}. Your feedback is incredibly valuable to us, and we would greatly appreciate if you could take a moment to leave us a Google review.</p>
    
    @if($customMessage)
    <div class="message">
        <strong>Message from our team:</strong><br>
        {{ $customMessage }}
    </div>
    @endif
    
    <a href="{{ config('app.google_review_url') }}" class="button">Leave a Google Review</a>
    
    <p>Your review helps other clients find quality DJ services and enables us to continually improve our offerings.</p>
    
    <p>Thank you for your time!</p>
    
    <p>Best regards,<br>
    {{ config('app.name') }}</p>
</body>
</html>
