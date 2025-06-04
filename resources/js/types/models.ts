// Application model types

export interface DJ {
  id: number;
  name: string;
  unique_identifier: string;
  email: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface DjAvailability {
  id: number;
  dj_id: number;
  date: string;
  status: string;
  is_custom_date: boolean;
  note: string | null;
  created_at: string;
  updated_at: string;
}
