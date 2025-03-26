import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Star, StarHalf, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Exhibitor } from '@/components/exhibitors/ExhibitorCard';

interface GalleryImage {
  id: number;
  url: string;
  alt: string;
}

// Define the JSON data sources
const JSON_SOURCES = [
  '/all-exhibitors-alpha.json',

];

const ExhibitorProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [exhibitor, setExhibitor] = useState<Exhibitor | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredImage, setFeaturedImage] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadExhibitorFromDB = async () => {
      setLoading(true);
      
      try {
        // First try to fetch from Supabase
        const { data: exhibitorData, error: exhibitorError } = await supabase
          .from('exhibitors')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (exhibitorError) {
          console.error('Error fetching exhibitor from DB:', exhibitorError);
          
          // If no DB data found, try to load from JSON files
          await loadExhibitorFromJSON();
          return;
        }
        
        if (exhibitorData) {
          setExhibitor(exhibitorData);
          
          // Get gallery images if any
          const { data: galleryData, error: galleryError } = await supabase
            .from('exhibitor_gallery')
            .select('*')
            .eq('exhibitor_id', exhibitorData.id)
            .order('display_order', { ascending: true });
          
          if (!galleryError && galleryData) {
            const formattedGallery = galleryData.map((img, index) => ({
              id: index,
              url: img.image_url,
              alt: `${exhibitorData.name} gallery image ${index + 1}`
            }));
            
            setGallery(formattedGallery);
            
            // Set featured image to first gallery image if available
            if (formattedGallery.length > 0) {
              setFeaturedImage(formattedGallery[0].url);
            } else if (exhibitorData.thumbnail_url) {
              // If no gallery images, use the thumbnail as the featured image
              setFeaturedImage(exhibitorData.thumbnail_url);
              
              // Add thumbnail to gallery as well
              setGallery([{
                id: 0,
                url: exhibitorData.thumbnail_url,
                alt: `${exhibitorData.name} thumbnail`
              }]);
            }
          }
        }
      } catch (error) {
        console.error('Error loading exhibitor:', error);
        toast.error('Failed to load exhibitor information');
        
        // Try loading from JSON as fallback
        await loadExhibitorFromJSON();
      } finally {
        setLoading(false);
      }
    };
    
    const loadExhibitorFromJSON = async () => {
      let foundExhibitor = null;
      
      // Try each JSON source in sequence until we find the exhibitor
      for (const source of JSON_SOURCES) {
        try {
          console.log(`Trying to load exhibitor from ${source}`);
          
          const response = await fetch(source);
          if (!response.ok) {
            console.error(`Failed to load data from ${source}`);
            continue;
          }
          
          const jsonData = await response.json();
          const matchingExhibitor = jsonData.find((item: any) => item.slug === slug);
          
          if (matchingExhibitor) {
            console.log(`Found exhibitor in ${source}`);
            foundExhibitor = matchingExhibitor;
            break;
          }
        } catch (error) {
          console.error(`Error loading exhibitor from ${source}:`, error);
        }
      }
      
      if (foundExhibitor) {
        const exhibitorData = {
          id: foundExhibitor.id || `temp-${Math.random().toString(36).substring(2, 9)}`,
          name: foundExhibitor.exhibitor_name || foundExhibitor.name,
          slug: foundExhibitor.slug,
          booth_info: foundExhibitor.booth_info,
          address: foundExhibitor.address,
          thumbnail_url: foundExhibitor.thumbnail_url,
          products: foundExhibitor.products,
          description: foundExhibitor.description,
          website: foundExhibitor.website,
          email: foundExhibitor.email,
          telephone: foundExhibitor.telephone
        };
        
        setExhibitor(exhibitorData);
        
        // Create gallery from gallery_images if available
        if (foundExhibitor.gallery_images && foundExhibitor.gallery_images.length > 0) {
          const galleryImages = foundExhibitor.gallery_images.map((url: string, index: number) => ({
            id: index,
            url: url,
            alt: `${exhibitorData.name} gallery image ${index + 1}`
          }));
          
          setGallery(galleryImages);
          
          // Set featured image to first gallery image
          if (galleryImages.length > 0) {
            setFeaturedImage(galleryImages[0].url);
          }
        } else if (exhibitorData.thumbnail_url) {
          // If no gallery images, use thumbnail as featured image
          setFeaturedImage(exhibitorData.thumbnail_url);
          
          // Add thumbnail to gallery as well
          setGallery([{
            id: 0,
            url: exhibitorData.thumbnail_url,
            alt: `${exhibitorData.name} thumbnail`
          }]);
        }
      } else {
        toast.error('Exhibitor not found in any data source');
        navigate('/exhibitors');
      }
    };
    
    if (slug) {
      loadExhibitorFromDB();
    }
  }, [slug, navigate]);

  const handlePrevImage = () => {
    if (!gallery || gallery.length <= 1) return;
    
    const newIndex = currentImageIndex === 0 ? gallery.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
    setFeaturedImage(gallery[newIndex].url);
  };

  const handleNextImage = () => {
    if (!gallery || gallery.length <= 1) return;
    
    const newIndex = currentImageIndex === gallery.length - 1 ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
    setFeaturedImage(gallery[newIndex].url);
  };

  // Extract product categories for display
  const productCategories = exhibitor?.products
    ? exhibitor.products
        .split(/[,;]/)
        .map(cat => cat.trim())
        .filter(cat => cat.length > 0)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!exhibitor) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto py-16 px-4 text-center">
          <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Exhibitor Not Found</h1>
          <p className="text-gray-600 mb-6">The exhibitor you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/exhibitors')}>Browse All Exhibitors</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-y-auto">
      <Header />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 pb-20">
        {/* Top Section: Exhibitor Info */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Left side - Company info */}
          <div className="w-full md:w-1/3">
            <div className="w-48 h-48 bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img 
                src={exhibitor.thumbnail_url || ''} 
                alt={`${exhibitor.name} Logo`} 
                className="w-full h-full object-contain p-2" 
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/600x400?text=No+Logo+Available";
                }}
              />
            </div>
            <p className="text-lg text-gray-600 mb-2 text-left">
              {exhibitor.booth_info && `Booth: ${exhibitor.booth_info}`}
            </p>
            <h1 className="text-4xl font-bold mb-3 text-left">{exhibitor.name}</h1>
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <StarHalf className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              </div>
              <span className="ml-2 text-gray-600">Exhibitor Rating</span>
            </div>
          </div>
          
          {/* Right side - Featured image with thumbnails */}
          <div className="w-full md:w-2/3 flex justify-center">
            {/* Gallery container with max width */}
            <div className="flex flex-col space-y-4 max-w-[70%]">
              {/* Main image */}
              <div className="rounded-lg overflow-hidden h-72 w-full">
                {featuredImage ? (
                  <img 
                    src={featuredImage} 
                    alt="Featured" 
                    className="w-full h-full object-contain bg-gray-100 p-2" 
                    onError={(e) => {
                      console.error("Failed to load image:", featuredImage);
                      e.currentTarget.src = "https://placehold.co/600x400?text=Image+Not+Available";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <p className="text-gray-500">No image available</p>
                  </div>
                )}
              </div>
              
              {/* Only show thumbnails if we have more than one image */}
              {gallery.length > 1 && (
                <div className="relative flex items-center">
                  {/* Navigation buttons */}
                  <button 
                    onClick={handlePrevImage}
                    className="absolute -left-4 z-10 bg-white/80 rounded-full p-1 shadow-md hover:bg-gray-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  
                  <div className="w-full grid grid-cols-3 gap-4">
                    {gallery.slice(0, 3).map((image, index) => (
                      <div 
                        key={image.id} 
                        className={`rounded-lg overflow-hidden cursor-pointer h-24 transition-all ${currentImageIndex === index ? 'ring-2 ring-black' : ''}`}
                        onClick={() => {
                          setFeaturedImage(image.url);
                          setCurrentImageIndex(index);
                        }}
                      >
                        <img 
                          src={image.url} 
                          alt={image.alt} 
                          className="w-full h-full object-contain bg-gray-50 p-1" 
                          onError={(e) => {
                            e.currentTarget.src = "https://placehold.co/600x400?text=Thumbnail+Not+Available";
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={handleNextImage}
                    className="absolute -right-4 z-10 bg-white/80 rounded-full p-1 shadow-md hover:bg-gray-100"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Tab Navigation Section */}
        <div className="mb-8">
          <Tabs defaultValue="information">
            <TabsList className="flex mb-6 p-1 bg-gray-100 rounded-lg">
              <TabsTrigger 
                value="information" 
                className="px-8 py-3 rounded-md data-[state=active]:bg-black data-[state=active]:text-white transition-colors"
              >
                Information
              </TabsTrigger>
              <TabsTrigger 
                value="products" 
                className="px-8 py-3 rounded-md data-[state=active]:bg-black data-[state=active]:text-white transition-colors"
              >
                Products
              </TabsTrigger>
              <TabsTrigger 
                value="contact" 
                className="px-8 py-3 rounded-md data-[state=active]:bg-black data-[state=active]:text-white transition-colors"
              >
                Contact
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="information" className="p-4 bg-white rounded-xl shadow-sm text-left">
              <h3 className="text-lg font-semibold mb-3">About {exhibitor.name}</h3>
              {exhibitor.description ? (
                <p className="text-gray-700 whitespace-pre-line">{exhibitor.description}</p>
              ) : (
                <p className="text-gray-500 italic">No description available for this exhibitor.</p>
              )}
            </TabsContent>
            
            <TabsContent value="products" className="p-4 bg-white rounded-xl shadow-sm text-left">
              <h3 className="text-lg font-semibold mb-3">Products</h3>
              {productCategories.length > 0 ? (
                <div>
                  <p className="text-gray-700 mb-4">
                    {exhibitor.name} specializes in the following products:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {productCategories.map((category, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">No product information available.</p>
              )}
            </TabsContent>
            
            <TabsContent value="contact" className="p-4 bg-white rounded-xl shadow-sm text-left">
              <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
              <div className="text-gray-700 space-y-2">
                {exhibitor.address && (
                  <p className="flex items-start">
                    <span className="font-medium w-24">Address:</span> 
                    <span>{exhibitor.address}</span>
                  </p>
                )}
                
                {exhibitor.telephone && (
                  <p className="flex items-start">
                    <span className="font-medium w-24">Phone:</span> 
                    <span>{exhibitor.telephone}</span>
                  </p>
                )}
                
                {exhibitor.email && (
                  <p className="flex items-start">
                    <span className="font-medium w-24">Email:</span> 
                    <a href={`mailto:${exhibitor.email}`} className="text-blue-600 hover:underline">
                      {exhibitor.email}
                    </a>
                  </p>
                )}
                
                {exhibitor.website && (
                  <p className="flex items-start">
                    <span className="font-medium w-24">Website:</span> 
                    <a href={exhibitor.website.startsWith('http') ? exhibitor.website : `https://${exhibitor.website}`} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-blue-600 hover:underline flex items-center"
                    >
                      {exhibitor.website}
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  </p>
                )}
                
                {!exhibitor.address && !exhibitor.telephone && !exhibitor.email && !exhibitor.website && (
                  <p className="text-gray-500 italic">No contact information available.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Edit Button */}
        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            onClick={() => toast.info("Edit functionality coming soon!")}
            className="px-6"
          >
            Edit Exhibitor
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExhibitorProfile; 