
import { ExhibitorData } from './types';

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
}
