export interface Address {
  line1?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  country?: string | null;
}

export interface Person {
  id: string;
  full_name?: string | null;
  phone_number: string;
  alternate_phone?: string | null;
  email?: string | null;
  gender?: string | null;
  date_of_birth?: string | null;
  address?: Address | null;
  preferred_language?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PersonCreatePayload {
  full_name?: string;
  phone_number: string;
  alternate_phone?: string;
  email?: string;
  notes?: string;
}
