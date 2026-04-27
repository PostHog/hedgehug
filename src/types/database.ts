export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
}

export interface Hedgehog {
  id: string
  name: string
  breed: string
  description: string
  bio: string | null
  adoption_fee: number
  age_months: number
  temperament: "Calm" | "Friendly" | "Playful" | "Adventurous" | "Shy"
  health_notes: string | null
  category_id: string | null
  image_url: string | null
  is_featured: boolean
  is_adopted: boolean
  sex: "M" | "F"
  weight_grams: number | null
  color: string | null
  created_at: string
  // joined
  categories?: Category
}

export interface ChatSession {
  id: string
  status: "active" | "closed"
  customer_name: string | null
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  session_id: string
  role: "user" | "assistant" | "system"
  content: string
  created_at: string
}

export interface CenterInfo {
  id: string
  name: string
  tagline: string | null
  description: string | null
  adoption_policy: string | null
  care_info: string | null
  contact_email: string | null
  contact_phone: string | null
  address: string | null
  business_hours: string | null
  updated_at: string
}
