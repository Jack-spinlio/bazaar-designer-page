
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//Shimano-Logo-1990.png'
  );
  
  // Sample company data
  const companyData = {
    name: 'Shimano Inc',
    location: 'Osaka, Japan',
    website: 'www.shimano.com',
    email: 'supplier@shimano.com',
    phone: '+81-72-223-3957',
    description: 'Shimano Inc. is a Japanese multinational manufacturer of cycling components, fishing tackle, and rowing equipment. Shimano produces components for road, mountain, and hybrid bikes, including drivetrains, brakes, wheels, pedals, and cycling shoes and clothing.'
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate save process
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Profile updated successfully');
      navigate('/supplier');
    }, 1500);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2"
          onClick={() => navigate('/supplier')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Edit Supplier Profile</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="flex flex-col items-center space-y-4">
                <div className="text-center">
                  <h3 className="font-medium mb-2">Company Logo</h3>
                  {logoPreview ? (
                    <div className="mb-4">
                      <img 
                        src={logoPreview} 
                        alt="Company Logo" 
                        className="max-w-[200px] max-h-[100px] mx-auto object-contain"
                      />
                    </div>
                  ) : (
                    <div className="mb-4">
                      <Avatar className="w-24 h-24 mx-auto">
                        <AvatarFallback>CO</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  <label className="block">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      type="button"
                      asChild
                    >
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Change Logo
                        <Input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleLogoChange}
                        />
                      </span>
                    </Button>
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Recommended: PNG, SVG or JPG (max. 1MB)
                  </p>
                </div>

                <div className="w-full mt-6">
                  <h3 className="font-medium mb-4">Contact Details</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue={companyData.phone} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue={companyData.email} />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" defaultValue={companyData.website} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-2/3">
              <h3 className="font-medium mb-4">Company Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue={companyData.name} required />
                </div>
                
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue={companyData.location} required />
                </div>

                <div>
                  <Label htmlFor="company-description">Company Description</Label>
                  <Textarea 
                    id="company-description" 
                    className="h-40" 
                    defaultValue={companyData.description} 
                    required 
                  />
                </div>

                <div>
                  <Label htmlFor="social-media">Social Media Links</Label>
                  <div className="space-y-2">
                    <Input placeholder="Facebook URL" />
                    <Input placeholder="Twitter URL" />
                    <Input placeholder="Instagram URL" />
                    <Input placeholder="LinkedIn URL" />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-4">Certifications & Credentials</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="certifications">Certifications</Label>
                    <Textarea 
                      id="certifications" 
                      placeholder="List your company certifications..." 
                      className="h-20" 
                      defaultValue="ISO 9001:2015, ISO 14001:2015, OHSAS 18001"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="mr-2"
              onClick={() => navigate('/supplier')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
