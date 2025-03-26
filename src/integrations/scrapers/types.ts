
export interface ExhibitorData {
  id?: string;
  exhibitor_name: string;
  name?: string;
  slug: string;
  booth_info?: string;
  address?: string;
  telephone?: string;
  fax?: string;
  website?: string;
  email?: string;
  products?: string;
  description?: string;
  thumbnail_url?: string;
  gallery_images?: string[];
  source_url?: string;
}

// Define a GalleryImage interface for consistency
export interface GalleryImage {
  id: number;
  url: string;
  alt: string;
}
