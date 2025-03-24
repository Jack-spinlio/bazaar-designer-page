
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload } from 'lucide-react';

export const UploadProduct: React.FC = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [modelFile, setModelFile] = useState<File | null>(null);
  const categories = [{
    id: 'drivetrain',
    name: 'Drivetrain'
  }, {
    id: 'braking',
    name: 'Braking Systems'
  }, {
    id: 'wheels',
    name: 'Wheels & Hubs'
  }, {
    id: 'pedals',
    name: 'Pedals'
  }, {
    id: 'ebike',
    name: 'eBike Components'
  }, {
    id: 'frame',
    name: 'Frames'
  }];
  
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
  
  const handleModelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setModelFile(file);
      toast.success(`3D model "${file.name}" selected`);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      toast.success('Product uploaded, continue to add parameters');
      // Navigate to parameters page instead of supplier page
      navigate('/supplier/parameters');
    }, 1500);
  };
  
  return <div className="text-left">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold">Upload New Product</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" placeholder="e.g., Carbon Fiber Handlebar" required />
                </div>
                
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" type="number" min="0.01" step="0.01" placeholder="e.g., 99.99" required />
                </div>

                {/* Swapped order: manufacturer now comes before category */}
                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input id="manufacturer" placeholder="e.g., Shimano" required />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select required>
                    <SelectTrigger className="text-left">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Product Description</Label>
                <Textarea id="description" placeholder="Describe your product in detail..." className="h-32 text-left" required />
              </div>

              <div>
                <Label htmlFor="product-image">Product Image</Label>
                <div className="mt-1 flex items-center">
                  <label className="block w-full">
                    <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                      {imagePreview ? <img src={imagePreview} alt="Preview" className="h-full object-contain" /> : <div className="space-y-1 text-center p-4">
                          <Upload className="mx-auto h-8 w-8 text-gray-400" />
                          <div className="text-sm text-gray-600">
                            <span className="text-black font-medium">Click to upload</span> or drag and drop
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, WEBP up to 10MB
                          </p>
                        </div>}
                      <Input id="product-image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} required />
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="model-file">3D Model File (required)</Label>
                <div className="mt-1">
                  <label className="block w-full">
                    <div className="flex items-center justify-center h-12 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                      <div className="space-y-1 text-center">
                        <div className="text-sm text-gray-600 flex items-center">
                          <Upload className="h-4 w-4 mr-1 text-gray-400" />
                          <span className="text-black font-medium">Upload 3D model</span>
                        </div>
                      </div>
                      <Input 
                        id="model-file" 
                        type="file" 
                        accept=".obj,.glb,.gltf,.stl" 
                        className="hidden" 
                        onChange={handleModelFileChange}
                        required
                      />
                    </div>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-left">
                  {modelFile ? `Selected: ${modelFile.name}` : 'Supported formats: OBJ, GLB, GLTF, STL'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="button" variant="outline" className="mr-2" onClick={() => navigate('/supplier')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading} className="bg-black hover:bg-black/90">
              {isUploading ? 'Uploading...' : 'Upload Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>;
};
