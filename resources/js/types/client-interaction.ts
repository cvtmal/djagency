export interface ClientInteraction {
  id: number;
  booking_request_id: number;
  interaction_method: string;
  notes: string | null;
  metadata: Record<string, any> | null;
  is_follow_up: boolean;
  is_client_response: boolean;
  created_at: string;
  updated_at: string;
}
