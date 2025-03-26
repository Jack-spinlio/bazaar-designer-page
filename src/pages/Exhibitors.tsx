
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';
import { ExhibitorScraperService } from '@/integrations/scrapers/exhibitorScraper';
import { ExhibitorData } from '@/integrations/scrapers/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Exhibitors = () => {
  const [exhibitors, setExhibitors] = useState<ExhibitorData[]>([]);
  const [filteredExhibitors, setFilteredExhibitors] = useState<ExhibitorData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);

  useEffect(() => {
    fetchExhibitors();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = exhibitors.filter(exhibitor => 
        exhibitor.exhibitor_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredExhibitors(filtered);
    } else {
      setFilteredExhibitors(exhibitors);
    }
  }, [searchTerm, exhibitors]);

  const fetchExhibitors = async () => {
    setLoading(true);
    try {
      const service = new ExhibitorScraperService();
      const data = await service.fetchExhibitors();
      setExhibitors(data);
      setFilteredExhibitors(data);
    } catch (error) {
      console.error('Error fetching exhibitors:', error);
      toast.error('Failed to load exhibitors');
    } finally {
      setLoading(false);
    }
  };

  const handleStartScraping = async () => {
    setScraping(true);
    toast.info("Starting to scrape exhibitor data...");
    
    try {
      // Call the server endpoint that triggers the scraping process
      const response = await fetch('http://localhost:3001/api/scrape-exhibitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ site: 'taipeicycle' }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to start scraping process');
      }
      
      const result = await response.json();
      
      if (result.success) {
        toast.success(`Scraping completed! Found ${result.count} exhibitors.`);
        // Refresh exhibitors list after scraping
        fetchExhibitors();
      } else {
        toast.error(result.message || 'Scraping failed');
      }
    } catch (error) {
      console.error('Error during scraping:', error);
      toast.error('Failed to scrape exhibitor data');
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className="min-h-screen">
      <MarketplaceHeader />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold mb-2">Exhibitors</h1>
          <p className="text-gray-600 mb-6">Browse and discover component manufacturers</p>
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex w-full max-w-md gap-4">
              <Input
                type="text"
                placeholder="Search exhibitors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
              <Button variant="outline">Filters</Button>
            </div>
            
            <Button 
              onClick={handleStartScraping}
              disabled={scraping}
              className="ml-4"
            >
              {scraping ? 'Scraping...' : 'Scrape Exhibitors Data'}
            </Button>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              Showing {filteredExhibitors.length} of {exhibitors.length} exhibitors
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredExhibitors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExhibitors.map((exhibitor, index) => (
                <Link to={`/exhibitor/${exhibitor.slug}`} key={index}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="h-40 bg-gray-100 flex items-center justify-center">
                      {exhibitor.thumbnail_url ? (
                        <img 
                          src={exhibitor.thumbnail_url} 
                          alt={exhibitor.exhibitor_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400">No image</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">{exhibitor.exhibitor_name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{exhibitor.booth_info}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {exhibitor.products || 'No product information available'}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">No exhibitors found</h2>
              <p className="text-gray-600 mb-4">We couldn't find any exhibitors matching your search criteria.</p>
              {searchTerm && (
                <Button onClick={() => setSearchTerm('')}>Clear Filters</Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exhibitors; 
