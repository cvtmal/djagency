// Booking related types

export type BookingStatus = 'free' | 'quoted' | 'booked' | 'blocked';

export interface DJ {
  id: number;
  name: string;
}

export interface BookingDate {
  id: number;
  date: string;
  displayDate: string;
  dayName: string;
}

export interface BookingRequest {
  clientName: string;
  venue: string;
  genres: string[];
  startTime: string;
  endTime: string;
  notes: string;
}

export interface CellData {
  dj: DJ;
  date: BookingDate;
  status: BookingStatus;
  request: BookingRequest;
}

export interface BookingRequestTableItem {
  id: number;
  requestNumber: string;
  date: string;
  clientName: string;
  status: string;
  djsQuoted: string[];
  lastAction: string;
  lastActionDate: string;
}
