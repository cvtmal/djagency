# Follow-up Mechanism in the Project

Based on the code I've examined, the project implements a comprehensive follow-up system for managing booking requests. Here's how the follow-up mechanism works:

## Database Structure

The `booking_requests` table has several follow-up related fields:

- `next_follow_up_at`: Timestamp for when the next follow-up is scheduled
- `follow_up_count`: Integer tracking how many follow-ups have been sent
- `follow_up_history`: JSON field storing the history of follow-ups
- `automated_follow_up`: Boolean flag indicating if follow-ups should be automated

## Follow-up States

The system tracks different follow-up states displayed in the UI:

- **Pending**: The follow-up is scheduled but not yet due
- **Overdue**: The follow-up date has passed
- **Responded**: The client has responded to a quote
- **Not Scheduled**: No follow-up has been scheduled yet

## Components & Logic

### BookingRequests Component

- Displays follow-up status with color-coded badges
- Shows the scheduled follow-up date
- Handles visual representation of follow-up states

### Interactions Page

- Displays full interaction history including follow-ups
- Shows total follow-up count
- Differentiates between client interactions and follow-ups

### ScheduleFollowUp Page

- Allows manual scheduling of follow-ups
- Provides toggle for enabling/disabling automated follow-ups
- Sets follow-up dates

### ProcessPendingFollowUps Job

A background job that:

- Finds booking requests requiring follow-up
- Handles automated follow-up sending
- Creates a client interaction record with `is_follow_up = true`
- Updates booking request follow-up counts and history

### ScheduleFollowUpAction

Handles the business logic for scheduling follow-ups:

- Updates the follow-up count
- Maintains follow-up history
- Sets the next follow-up date

## Flow

1. When a booking request status becomes **"quoted"**, it enters the follow-up system.
2. A follow-up can be scheduled manually or automatically based on predefined intervals.
3. The `ProcessPendingFollowUps` job runs periodically to check for pending follow-ups.
4. When a follow-up is due, if `automated_follow_up` is `true`, the system sends a follow-up message.
5. Each follow-up is recorded as a client interaction with `is_follow_up = true`.
6. The system tracks whether clients have responded and updates statuses accordingly.
7. The UI shows different badges for different follow-up states (pending, overdue, etc.).

---

This mechanism helps track client engagement, ensures timely follow-ups, and provides visibility into the follow-up process for booking requests.
