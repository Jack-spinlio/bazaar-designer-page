/**
 * Types for the exhibitor data scraped from external sources
 */

export interface ExhibitorData {
  exhibitor_name: string;
  booth_info: string;
  address: string;
  telephone: string;
  fax: string;
  website: string;
  email: string;
  products: string;
  description: string;
  thumbnail_url: string;
  gallery_images: string[];
  slug: string;
  source_url: string;
}

export interface ScraperOptions {
  startPage?: number;
  endPage?: number;
  sleepTime?: number;
  outputFile?: string;
  format?: 'json' | 'csv' | 'both';
  singleUrl?: string;
}

export interface ScraperResult {
  exhibitors: ExhibitorData[];
  outputPath?: string;
  error?: string;
} 