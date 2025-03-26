import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { Exhibitor } from '@/components/exhibitors/ExhibitorCard';

// Default thumbnail to deprioritize
const DEFAULT_THUMBNAIL = "https://storage.googleapis.com/www.taiwantradeshow.com.tw/ttsShowYear/202406/T-68557044.jpg";

// The single source of truth
const JSON_SOURCE = '/all-exhibitors-alpha.json';

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
      console.log(`Trying to load data from ${JSON_SOURCE}`);
      const response = await fetch(JSON_SOURCE);
      
      if (!response.ok) {
        throw new Error(`Failed to load data from ${JSON_SOURCE}: ${response.statusText}`);
      }
      
      const jsonData = await response.json();
      
      if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
        throw new Error(`No valid data found in ${JSON_SOURCE}`);
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
        description: item.description,
        telephone: item.telephone,
        email: item.email,
        website: item.website,
        fax: item.fax
      }));
      
      // Sort exhibitors - those with default thumbnail last
      const sortedData = sortExhibitors(transformedData);
      setExhibitors(sortedData);
      console.log(`Successfully loaded ${sortedData.length} exhibitors from ${JSON_SOURCE}`);
    } catch (error) {
      console.error(`Error loading data:`, error);
      toast.error('Failed to load exhibitor data');
    } finally {
      setLoading(false);
    }
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
