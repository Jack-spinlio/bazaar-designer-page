import { ExhibitorData, ScraperOptions, ScraperResult } from './types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Service for accessing exhibitor data from Supabase
 * 
 * Note: The actual scraping is done by the server-side script (npm run scrape)
 * This service only provides access to already scraped data
 */
export class ExhibitorScraperService {
  private site: string;

  constructor(site: string = 'taipeicycle') {
    this.site = site;
  }

  /**
   * Fetch all exhibitors from the database
   */
  async fetchExhibitors(): Promise<ExhibitorData[]> {
    try {
      const { data, error } = await supabase
        .from('exhibitors')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching exhibitors:', error);
        return [];
      }

      return data.map(this.mapDatabaseToExhibitor);
    } catch (error) {
      console.error('Error in fetchExhibitors:', error);
      return [];
    }
  }

  /**
   * Fetch a single exhibitor by slug
   */
  async fetchExhibitorBySlug(slug: string): Promise<ExhibitorData | null> {
    try {
      const { data, error } = await supabase
        .from('exhibitors')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching exhibitor:', error);
        return null;
      }

      return this.mapDatabaseToExhibitor(data);
    } catch (error) {
      console.error('Error in fetchExhibitorBySlug:', error);
      return null;
    }
  }

  /**
   * Search exhibitors by name
   */
  async searchExhibitors(searchTerm: string): Promise<ExhibitorData[]> {
    try {
      const { data, error } = await supabase
        .from('exhibitors')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .order('name');

      if (error) {
        console.error('Error searching exhibitors:', error);
        return [];
      }

      return data.map(this.mapDatabaseToExhibitor);
    } catch (error) {
      console.error('Error in searchExhibitors:', error);
      return [];
    }
  }

  /**
   * Fetch gallery images for an exhibitor
   */
  async fetchExhibitorGallery(exhibitorId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('exhibitor_gallery')
        .select('image_url')
        .eq('exhibitor_id', exhibitorId)
        .order('display_order');

      if (error) {
        console.error('Error fetching gallery:', error);
        return [];
      }

      return data.map(item => item.image_url);
    } catch (error) {
      console.error('Error in fetchExhibitorGallery:', error);
      return [];
    }
  }

  /**
   * Map database record to ExhibitorData structure
   */
  private mapDatabaseToExhibitor(record: any): ExhibitorData {
    return {
      exhibitor_name: record.name || '',
      booth_info: record.booth_info || '',
      address: record.address || '',
      telephone: record.telephone || '',
      fax: record.fax || '',
      website: record.website || '',
      email: record.email || '',
      products: record.products || '',
      description: record.description || '',
      thumbnail_url: record.thumbnail_url || '',
      gallery_images: [], // These will be fetched separately
      slug: record.slug || '',
      source_url: record.source_url || ''
    };
  }
} 