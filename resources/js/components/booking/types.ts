// Booking related types

// Values from DjAvailabilityStatusEnum in the backend
export type BookingStatus = 
  | 'available' 
  | 'blocked' 
  | 'pending_agency_request' 
  | 'booked_through_agency' 
  | 'eventually_available';

export interface DJ {
  id: number;
  name: string;
}

export interface BookingDate {
  id: number;
  date: string;
  display_date: string;
  day_name: string;
  // Keep the camelCase versions for compatibility with existing code
  displayDate?: string;
  dayName?: string;
}

export interface BookingRequest {
  id: number;
  dj_id: number | null;
  booking_date_id: number | null;
  client_name: string;
  contact_street: string;
  contact_city: string;
  contact_postal_code: string;
  contact_email: string;
  contact_phone: string;
  contact_option: string;
  venue: string;
  event_type: string;
  genres: string[];
  /** @deprecated Use date field instead */
  start_time?: string;
  /** @deprecated Use date field instead */
  end_time?: string;
  /** The new date field that replaces start_time and end_time */
  date: string;
  time_range: string;
  guest_count: number;
  equipment: string;
  music_ratings: Record<string, number>;
  additional_music: string | null;
  notes: string | null;
  status: BookingStatus;
  request_number: string;
}

export interface CellData {
  dj: DJ;
  date: BookingDate;
  status: BookingStatus;
  request: BookingRequest;
}

export interface BookingRequestTableItem {
  id: number;
  request_number: string;
  client_name: string;
  venue: string;
  event_type: string;
  /** @deprecated Use date field instead */
  start_time?: string;
  /** @deprecated Use date field instead */
  end_time?: string;
  /** The new date field that replaces start_time and end_time */
  date: string;
  time_range: string;
  guest_count: number;
  status: string;
  dj_name?: string;
  // Contact information
  contact_street: string;
  contact_city: string;
  contact_postal_code: string;
  contact_email: string;
  contact_phone: string;
  contact_option: string;
  // Event details
  equipment: string;
  genres?: string[];
  music_ratings?: Record<string, number>;
  additional_music?: string | null;
  notes?: string | null;
  // Relations
  dj_id?: number | null;
  booking_date_id?: number | null;
  // Timestamps
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}
