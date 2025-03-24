
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload } from 'lucide-react';

// Sample products data - would typically come from an API/database
const products = [{
  id: 'dt-1',
  name: 'Shimano 105 Front Calliper',
  image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//105%20front%20calliper.jpeg',
  price: 55,
  manufacturer: 'Shimano',
  category: 'drivetrain',
  description: 'High-quality front calliper from Shimano 105 series, designed for road bikes with superior braking performance.'
}, {
  id: 'dt-2',
  name: 'Shimano 105 Rear Hub',
  image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//105%20hub.jpeg',
  price: 89,
  manufacturer: 'Shimano',
  category: 'wheels',
  description: 'Reliable rear hub from Shimano 105 series with smooth rotation and durability for long rides.'
}, {
  id: 'dt-3',
  name: 'Shimano XTR Cassette',
  image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//cassette.jpeg',
  price: 112,
  manufacturer: 'Shimano',
  category: 'drivetrain',
  description: 'Premium XTR cassette offering precise gear shifting and lightweight design for competitive cycling.'
}, {
  id: 'dt-4',
  name: 'Shimano CUES Road Bike Lever',
  image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//CUES%20lever.jpeg',
  price: 78,
  manufacturer: 'Shimano',
  category: 'braking',
  description: 'Ergonomic brake lever from Shimano CUES series, providing comfortable grip and responsive braking.'
}];

export const EditProduct: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [product, setProduct] = useState<any>(null);
  
  const categories = [
    { id: 'drivetrain', name: 'Drivetrain' },
    { id: 'braking', name: 'Braking Systems' },
    { id: 'wheels', name: 'Wheels & Hubs' },
    { id: 'pedals', name: 'Pedals' },
    { id: 'ebike', name: 'eBike Components' },
    { id: 'frame', name: 'Frames' }
  ];

  useEffect(() => {
    // Find the product by ID - in a real app, this would be an API call
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setImagePreview(foundProduct.image);
    } else {
      toast.error('Product not found');
      navigate('/supplier');
    }
  }, [id, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
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
      toast.success('Product updated successfully');
      navigate('/supplier');
    }, 1500);
  };

  if (!product) {
    return <div className="p-6">Loading...</div>;
  }

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
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input 
                    id="name" 
                    defaultValue={product.name} 
                    required 
                  />
                </div>
                
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    min="0.01" 
                    step="0.01" 
                    defaultValue={product.price} 
                    required 
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select defaultValue={product.category} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input 
                    id="manufacturer" 
                    defaultValue={product.manufacturer} 
                    required 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Product Description</Label>
                <Textarea 
                  id="description" 
                  className="h-32" 
                  defaultValue={product.description || ''} 
                  required 
                />
              </div>

              <div>
                <Label htmlFor="product-image">Product Image</Label>
                <div className="mt-1 flex items-center">
                  <label className="block w-full">
                    <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="h-full object-contain"
                        />
                      ) : (
                        <div className="space-y-1 text-center p-4">
                          <Upload className="mx-auto h-8 w-8 text-gray-400" />
                          <div className="text-sm text-gray-600">
                            <span className="text-purple-600 font-medium">Click to upload</span> or drag and drop
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, WEBP up to 10MB
                          </p>
                        </div>
                      )}
                      <Input 
                        id="product-image" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageChange}
                      />
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="model-file">Replace 3D Model File (optional)</Label>
                <div className="mt-1">
                  <label className="block w-full">
                    <div className="flex items-center justify-center h-12 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                      <div className="space-y-1 text-center">
                        <div className="text-sm text-gray-600 flex items-center">
                          <Upload className="h-4 w-4 mr-1 text-gray-400" />
                          <span className="text-purple-600 font-medium">Upload new 3D model</span>
                        </div>
                      </div>
                      <Input 
                        id="model-file" 
                        type="file" 
                        accept=".obj,.glb,.gltf" 
                        className="hidden" 
                      />
                    </div>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: OBJ, GLB, GLTF
                </p>
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
