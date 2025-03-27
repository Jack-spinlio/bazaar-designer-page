
import { ExhibitorData, GalleryImage } from './types';

export class ExhibitorScraperService {
  /**
   * Fetches all exhibitors data from the JSON file
   */
  async fetchExhibitors(): Promise<ExhibitorData[]> {
    try {
      const response = await fetch('/all-exhibitors-alpha.json');
      
      if (!response.ok) {
        throw new Error('Failed to fetch exhibitor data');
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching exhibitor data:', error);
      return [];
    }
  }

  /**
   * Fetches a specific exhibitor by slug
   */
  async fetchExhibitorBySlug(slug: string): Promise<ExhibitorData | null> {
    try {
      const allExhibitors = await this.fetchExhibitors();
      let exhibitor = allExhibitors.find(ex => ex.slug === slug) || null;
      
      // Special case for LIANG FENG MACHINERY CO., LTD.
      if (slug === 'liang-feng-machinery-co-ltd' && exhibitor) {
        exhibitor = {
          ...exhibitor,
          description: "Since 1991 company be build until now already have more than 30 years fork produce experience. Two times expand provide complete service. In house testing laboratory to keep up with the ever-changing world.\n\n90% Ratio for self-manufactmed content control the quality and time, 5 Auto welding machine with stable production limited, from design to manufacture no gap connection, achieve the any interesitng and creative idea. The product from high quality to simple classic fork, all can provide the perfect controlbility and production processes.",
          thumbnail_url: "https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/models//Screenshot%202025-03-27%20at%2009.02.47.png",
          gallery_images: [
            "https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/models//lftesting.png",
            "https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/models//fork_1.png",
            "https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/models//Screenshot%202025-03-27%20at%2009.11.52.png",
            "https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/models//Screenshot%202025-03-27%20at%2009.08.54.png"
          ]
        };
      }
      
      return exhibitor;
    } catch (error) {
      console.error('Error fetching exhibitor by slug:', error);
      return null;
    }
  }

  /**
   * Formats gallery images from an exhibitor
   */
  formatGalleryImages(exhibitor: ExhibitorData): GalleryImage[] {
    // Special case for LIANG FENG MACHINERY CO., LTD.
    if (exhibitor.slug === 'liang-feng-machinery-co-ltd' && exhibitor.gallery_images && exhibitor.gallery_images.length > 0) {
      return exhibitor.gallery_images.map((url, index) => ({
        id: index,
        url: url,
        alt: `LIANG FENG MACHINERY fork image ${index + 1}`
      }));
    }
    
    if (!exhibitor.gallery_images || exhibitor.gallery_images.length === 0) {
      // If no gallery images but has thumbnail, use it as the first gallery image
      if (exhibitor.thumbnail_url) {
        return [{
          id: 0,
          url: exhibitor.thumbnail_url,
          alt: `${exhibitor.exhibitor_name || exhibitor.name} thumbnail`
        }];
      }
      return [];
    }

    // Create gallery images from the array of URLs
    return exhibitor.gallery_images.map((url, index) => ({
      id: index,
      url: url,
      alt: `${exhibitor.exhibitor_name || exhibitor.name} gallery image ${index + 1}`
    }));
  }
}
