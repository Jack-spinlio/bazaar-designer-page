
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Star, StarHalf, ChevronLeft, ChevronRight, ExternalLink, Info, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Exhibitor } from '@/components/exhibitors/ExhibitorCard';
import { ExhibitorScraperService } from '@/integrations/scrapers/exhibitorScraper';
import { GalleryImage } from '@/integrations/scrapers/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

const ExhibitorProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [exhibitor, setExhibitor] = useState<Exhibitor | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredImage, setFeaturedImage] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  
  const scraperService = new ExhibitorScraperService();

  useEffect(() => {
    const loadExhibitorData = async () => {
      setLoading(true);
      
      try {
        if (!slug) {
          toast.error('Missing exhibitor slug');
          navigate('/exhibitors');
          return;
        }
        
        const exhibitorData = await scraperService.fetchExhibitorBySlug(slug);
        
        if (!exhibitorData) {
          toast.error('Exhibitor not found');
          navigate('/exhibitors');
          return;
        }
        
        const formattedExhibitor: Exhibitor = {
          id: exhibitorData.id || `temp-${Math.random().toString(36).substring(2, 9)}`,
          name: exhibitorData.exhibitor_name || exhibitorData.name || 'Unknown Exhibitor',
          slug: exhibitorData.slug,
          booth_info: exhibitorData.booth_info,
          address: exhibitorData.address,
          thumbnail_url: exhibitorData.thumbnail_url,
          products: exhibitorData.products,
          description: exhibitorData.description,
          website: exhibitorData.website,
          email: exhibitorData.email,
          telephone: exhibitorData.telephone
        };
        
        setExhibitor(formattedExhibitor);
        
        const galleryImages = scraperService.formatGalleryImages(exhibitorData);
        setGallery(galleryImages);
        
        if (galleryImages.length > 0) {
          setFeaturedImage(galleryImages[0].url);
        }
      } catch (error) {
        console.error('Error loading exhibitor:', error);
        toast.error('Failed to load exhibitor information');
      } finally {
        setLoading(false);
      }
    };
    
    loadExhibitorData();
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
        <div className="flex flex-col md:flex-row gap-8 mb-8">
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
          
          <div className="w-full md:w-2/3 flex justify-center">
            <div className="flex flex-col space-y-4 max-w-[70%]">
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
              
              {gallery.length > 1 && (
                <div className="relative flex items-center">
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
        
        <div className="mt-8 text-center">
          <Button 
            variant="default" 
            onClick={() => setShowClaimDialog(true)}
            className="px-6"
          >
            Claim my Profile
          </Button>
        </div>
      </div>

      <Dialog open={showClaimDialog} onOpenChange={setShowClaimDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Activate Your Exhibitor Account</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Start managing your exhibitor profile with premium features
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <div className="mb-6">
              <h3 className="text-xl font-semibold">Exhibitor Premium Plan</h3>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-3xl font-bold">$50</span>
                <span className="text-gray-600">/month</span>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                  First month FREE
                </span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Access all premium features to showcase your products and connect with potential buyers.
              </p>

              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Full exhibitor profile customization</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Featured placement in search results</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Direct customer inquiries</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Product catalog management</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Analytics dashboard</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-md flex gap-3 mb-6">
              <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-700">
                Your subscription includes a FREE 30-day trial. You won't be charged until the trial period ends, and you can cancel at any time during this period at no cost.
              </p>
            </div>

            <div className="flex justify-between mt-8">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                onClick={() => window.open('https://buy.stripe.com/dR68wPf370vb2bu8wA', '_blank')}
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExhibitorProfile;
