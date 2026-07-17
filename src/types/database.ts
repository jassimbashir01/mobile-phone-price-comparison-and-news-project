export type PhoneStatus = "available" | "coming_soon" | "discontinued";
export type UserRole = "admin" | "editor";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Phone {
  id: string;
  brand_id: string;
  name: string;
  slug: string;
  status: PhoneStatus;
  price_pkr: number | null;
  is_featured: boolean;
  sort_order: number;
  seo_description: string | null;
  overview: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface PhoneSpecs {
  id: string;
  phone_id: string;
  network_type: string | null;
  os: string | null;
  ram_gb: number | null;
  storage_gb: number | null;
  display_size: number | null;
  main_camera_mp: number | null;
  battery_mah: number | null;
  processor: string | null;
  display_type: string | null;
  bluetooth: boolean;
  wifi: boolean;
  dual_sim: boolean;
  fm_radio: boolean;
  memory_card: boolean;
  mp3: boolean;
  video_recording: boolean;
  has_camera: boolean;
  build: Record<string, unknown>;
  connectivity: Record<string, unknown>;
  features: Record<string, unknown>;
}

export interface PhoneImage {
  id: string;
  phone_id: string;
  cloudinary_public_id: string;
  is_primary: boolean;
  sort_order: number;
}

export interface News {
  id: string;
  brand_id: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  cover_image_public_id: string | null;
  published_at: string | null;
  is_published: boolean;
}

export interface HomepageSection {
  id: string;
  section_key: string;
  title: string | null;
  phone_ids: string[];
  is_active: boolean;
}

export interface UserProfile {
  id: string;
  role: UserRole;
  full_name: string | null;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface PhoneWithDetails extends Phone {
  brand: Brand;
  specs: PhoneSpecs | null;
  images: PhoneImage[];
}

export interface PhoneCardData extends Phone {
  brand: Pick<Brand, "id" | "name" | "slug">;
  specs: Pick<
    PhoneSpecs,
    | "ram_gb"
    | "storage_gb"
    | "display_size"
    | "main_camera_mp"
    | "battery_mah"
    | "os"
    | "network_type"
  > | null;
  primary_image: PhoneImage | null;
}

export interface SocialLink {
  platform:
    | "facebook"
    | "instagram"
    | "twitter"
    | "youtube"
    | "tiktok"
    | "whatsapp";
  url: string;
  enabled: boolean;
}

export interface MediaKitStats {
  monthly_visitors: string;
  monthly_pageviews: string;
  avg_session_duration: string;
  top_regions: string;
  audience_description: string;
}

export interface HomepageBannerSetting {
  cloudinary_public_id: string;
  link_url: string;
  alt_text: string;
  enabled: boolean;
}

export interface SidebarBannerSetting {
  cloudinary_public_id: string;
  link_url: string;
  alt_text: string;
  enabled: boolean;
}

export interface BrandShowcaseSetting {
  brand_ids: string[];
  enabled: boolean;
}

export type OfferType = 'affiliate' | 'local_deal';

export interface Offer {
  id: string;
  offer_type: OfferType;
  title: string;
  description: string | null;
  image_public_id: string | null;
  destination_url: string;
  price_pkr: number | null;
  original_price_pkr: number | null;
  shop_name: string | null;
  shop_location: string | null;
  is_active: boolean;
  sort_order: number;
  expires_at: string | null;
  created_at: string;
}