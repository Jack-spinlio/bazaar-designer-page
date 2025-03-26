
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Exhibitor } from '@/components/exhibitors/ExhibitorCard';

// Default thumbnail to deprioritize
const DEFAULT_THUMBNAIL = "https://storage.googleapis.com/www.taiwantradeshow.com.tw/ttsShowYear/202406/T-68557044.jpg";

// JSON data sources
const JSON_SOURCES = [
  '/all-exhibitors-alpha.json',
];

interface ExhibitorContextType {
  exhibitors: Exhibitor[];
  filteredExhibitors: Exhibitor[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  clearFilters: () => void;
  defaultThumbnailCount: number;
  page: number; 
  setPage: (page: number) => void;
  pageSize: number;
  totalPages: number;
  currentExhibitors: Exhibitor[];
}

const ExhibitorContext = createContext<ExhibitorContextType | undefined>(undefined);

export const useExhibitors = () => {
  const context = useContext(ExhibitorContext);
  if (!context) {
    throw new Error('useExhibitors must be used within an ExhibitorProvider');
  }
  return context;
};

interface ExhibitorProviderProps {
  children: ReactNode;
}

export const ExhibitorProvider: React.FC<ExhibitorProviderProps> = ({ children }) => {
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 30;

  // Load data on context initialization
  useEffect(() => {
    loadExhibitorData();
  }, []);

  // Filter exhibitors based on search/category
  const filterExhibitors = (data: Exhibitor[]) => {
    let filtered = data;
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(ex => 
        (ex.name?.toLowerCase() || '').includes(search) ||
        (ex.description?.toLowerCase() || '').includes(search) ||
        (ex.products?.toLowerCase() || '').includes(search)
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(ex => 
        (ex.products?.toLowerCase() || '').includes(selectedCategory.toLowerCase())
      );
    }
    
    return filtered;
  };

  // Sort exhibitors to put those with default thumbnail last
  const sortExhibitors = (data: Exhibitor[]): Exhibitor[] => {
    return [...data].sort((a, b) => {
      // If a has default thumbnail and b doesn't, a comes after b
      if (a.thumbnail_url === DEFAULT_THUMBNAIL && b.thumbnail_url !== DEFAULT_THUMBNAIL) {
        return 1;
      }
      // If b has default thumbnail and a doesn't, b comes after a 
      if (b.thumbnail_url === DEFAULT_THUMBNAIL && a.thumbnail_url !== DEFAULT_THUMBNAIL) {
        return -1;
      }
      // Otherwise sort by name
      return (a.name || '').localeCompare(b.name || '');
    });
  };

  const loadExhibitorData = async () => {
    setLoading(true);
    
    try {
      // First try Supabase
      let supbaseError = false;
      try {
        const { data, error } = await supabase
          .from('exhibitors')
          .select('*');
        
        if (error) {
          console.error('Error loading from Supabase:', error);
          supbaseError = true;
        } else if (data && data.length > 0) {
          // Sort exhibitors - those with default thumbnail last
          const sortedData = sortExhibitors(data as Exhibitor[]);
          setExhibitors(sortedData);
          setLoading(false);
          console.log(`Successfully loaded ${sortedData.length} exhibitors from Supabase`);
          return;
        } else {
          console.log('No exhibitors found in Supabase, falling back to JSON');
          supbaseError = true;
        }
      } catch (e) {
        console.error('Exception when loading from Supabase:', e);
        supbaseError = true;
      }
      
      // If database fails or is empty, try loading from JSON
      if (supbaseError) {
        await loadFromJson();
      }
    } catch (error) {
      console.error('Error in loadExhibitorData:', error);
      await loadFromJson();
    }
  };

  const loadFromJson = async () => {
    for (const source of JSON_SOURCES) {
      try {
        console.log(`Trying to load data from ${source}`);
        const response = await fetch(source);
        
        if (!response.ok) {
          console.error(`Failed to load data from ${source}`);
          continue; // Try next source if this one fails
        }
        
        const jsonData = await response.json();
        
        if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
          console.error(`No valid data found in ${source}`);
          continue;
        }
        
        // Transform the data to match our Exhibitor interface
        const transformedData = jsonData.map((item: any) => ({
          id: item.id || `temp-${Math.random().toString(36).substring(2, 9)}`,
          name: item.exhibitor_name || item.name,
          slug: item.slug,
          booth_info: item.booth_info,
          address: item.address,
          thumbnail_url: item.thumbnail_url,
          products: item.products,
          description: item.description
        }));
        
        // Sort exhibitors - those with default thumbnail last
        const sortedData = sortExhibitors(transformedData);
        setExhibitors(sortedData);
        setLoading(false);
        console.log(`Successfully loaded ${sortedData.length} exhibitors from ${source}`);
        return; // Exit once we've successfully loaded data
      } catch (error) {
        console.error(`Error loading JSON from ${source}:`, error);
      }
    }
    
    // If we get here, all sources failed
    toast.error('Failed to load exhibitor data from any source');
    setLoading(false);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setPage(1);
  };

  // Calculate derived state
  const filteredExhibitors = filterExhibitors(exhibitors);
  const totalPages = Math.ceil(filteredExhibitors.length / pageSize);
  const currentExhibitors = filteredExhibitors.slice((page - 1) * pageSize, page * pageSize);
  const defaultThumbnailCount = exhibitors.filter(e => e.thumbnail_url === DEFAULT_THUMBNAIL).length;

  const value = {
    exhibitors,
    filteredExhibitors,
    loading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    clearFilters,
    defaultThumbnailCount,
    page,
    setPage,
    pageSize,
    totalPages,
    currentExhibitors
  };

  return (
    <ExhibitorContext.Provider value={value}>
      {children}
    </ExhibitorContext.Provider>
  );
};
