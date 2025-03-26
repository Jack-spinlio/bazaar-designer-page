
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
      return allExhibitors.find(ex => ex.slug === slug) || null;
    } catch (error) {
      console.error('Error fetching exhibitor by slug:', error);
      return null;
    }
  }

  /**
   * Formats gallery images from an exhibitor
   */
  formatGalleryImages(exhibitor: ExhibitorData): GalleryImage[] {
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
