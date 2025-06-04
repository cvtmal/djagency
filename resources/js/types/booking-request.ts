export interface BookingRequest {
  id: number;
  client_name: string;
  venue: string;
  event_type: string;
  genres: string[];
  music_ratings: Record<string, number>;
  additional_music: string | null;
  time_range: string;
  guest_count: number;
  equipment: string;
  notes: string | null;
  status: string;
  request_number: string;
  dj_id: number | null;
  booking_date_id: number | null;
  date: string | null;
  contact_street: string;
  contact_city: string;
  contact_postal_code: string;
  contact_email: string;
  contact_phone: string;
  contact_option: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  
  // Follow-up fields
  has_responded: boolean;
  response_method: string | null;
  last_response_at: string | null;
  next_follow_up_at: string | null;
  follow_up_count: number;
  follow_up_history: Array<{
    date: string;
    scheduled_at: string;
  }> | null;
}
