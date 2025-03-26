export interface Profile {
  id: string;
  name: string;
  email: string;
  user_type: string;
  is_public: boolean;
  created_at: string;
  website?: string;
}

export interface BusinessProfile {
  id: string;
  company_name: string;
  business_type: string;
  address: string;
  country: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  tax_id?: string;
  website?: string;
  email: string;
  is_verified: boolean;
  created_at: string;
} 