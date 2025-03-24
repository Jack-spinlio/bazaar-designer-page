
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, FolderOpen, Folder } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ComponentItem } from '@/components/Sidebar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

interface ComponentGroup {
  id: string;
  name: string;
}

interface ComponentCategory {
  id: string;
  name: string;
  group_id: string;
}

// Mock data for component groups and categories
const MOCK_COMPONENT_GROUPS: ComponentGroup[] = [
  { id: 'frame', name: 'Frame' },
  { id: 'drivetrain', name: 'Drivetrain' },
  { id: 'wheels', name: 'Wheels' },
  { id: 'components', name: 'Components' }
];

const MOCK_COMPONENT_CATEGORIES: ComponentCategory[] = [
  { id: 'frame-road', name: 'Road Frames', group_id: 'frame' },
  { id: 'frame-mtb', name: 'Mountain Bike Frames', group_id: 'frame' },
  { id: 'frame-gravel', name: 'Gravel Frames', group_id: 'frame' },
  { id: 'drivetrain-groupsets', name: 'Groupsets', group_id: 'drivetrain' },
  { id: 'drivetrain-chainrings', name: 'Chainrings', group_id: 'drivetrain' },
  { id: 'drivetrain-cassettes', name: 'Cassettes', group_id: 'drivetrain' },
  { id: 'wheels-road', name: 'Road Wheels', group_id: 'wheels' },
  { id: 'wheels-mtb', name: 'Mountain Bike Wheels', group_id: 'wheels' },
  { id: 'components-handlebars', name: 'Handlebars', group_id: 'components' },
  { id: 'components-stems', name: 'Stems', group_id: 'components' },
  { id: 'components-seatposts', name: 'Seatposts', group_id: 'components' }
];

export const UploadProduct: React.FC = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [componentGroups, setComponentGroups] = useState<ComponentGroup[]>(MOCK_COMPONENT_GROUPS);
  const [componentCategories, setComponentCategories] = useState<ComponentCategory[]>(MOCK_COMPONENT_CATEGORIES);
  const [filteredCategories, setFilteredCategories] = useState<ComponentCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    manufacturer: '',
    group_id: '',
    category_id: '',
    description: ''
  });
  
  // Filter categories when group changes
  useEffect(() => {
    if (productData.group_id) {
      const filtered = componentCategories.filter(
        category => category.group_id === productData.group_id
      );
      setFilteredCategories(filtered);
      
      // Reset category selection if current selection doesn't belong to the new group
      if (productData.category_id && !filtered.some(cat => cat.id === productData.category_id)) {
        setProductData(prev => ({
          ...prev,
          category_id: ''
        }));
      }
    } else {
      setFilteredCategories([]);
    }
  }, [productData.group_id, componentCategories]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleGroupChange = (value: string) => {
    setProductData(prev => ({
      ...prev,
      group_id: value,
      category_id: '' // Reset category when group changes
    }));
  };
  
  const handleCategoryChange = (value: string) => {
    setProductData(prev => ({
      ...prev,
      category_id: value
    }));
  };
  
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
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (!['stl', 'obj', 'glb', 'gltf'].includes(fileExt || '')) {
        toast.error('Unsupported file format. Please upload STL, OBJ, GLB, or GLTF files.');
        return;
      }
      
      setModelFile(file);
      toast.success(`3D model "${file.name}" selected`);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productData.name || !productData.price || !productData.group_id || !productData.category_id || !modelFile) {
      toast.error('Please fill in all required fields and upload a 3D model');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Upload model file to Supabase
      const fileExt = modelFile.name.split('.').pop();
      const filePath = `${Date.now()}_${productData.name.replace(/\s+/g, '_')}.${fileExt}`;
      
      const { data: modelData, error: modelError } = await supabase.storage
        .from('models')
        .upload(filePath, modelFile, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (modelError) {
        throw modelError;
      }
      
      // Get the public URL for the uploaded model
      const { data: modelUrlData } = supabase.storage
        .from('models')
        .getPublicUrl(filePath);
      
      // Get the selected group and category names
      const selectedGroup = componentGroups.find(group => group.id === productData.group_id);
      const selectedCategory = componentCategories.find(category => category.id === productData.category_id);
      
      // Create component object for the viewport
      const component: ComponentItem = {
        id: `product-${Date.now()}`,
        name: productData.name,
        type: fileExt?.toUpperCase() || 'STL',
        thumbnail: imagePreview || '/placeholder.svg',
        folder: selectedCategory?.name || 'Unknown',
        shape: 'box',
        modelUrl: modelUrlData.publicUrl
      };
      
      // Store component in local storage for now to pass to parameters page
      localStorage.setItem('currentUploadedProduct', JSON.stringify({
        ...component,
        price: productData.price,
        manufacturer: productData.manufacturer,
        description: productData.description,
        group_id: productData.group_id,
        category_id: productData.category_id,
        group_name: selectedGroup?.name,
        category_name: selectedCategory?.name
      }));
      
      setIsUploading(false);
      toast.success('Product uploaded, continue to add parameters');
      navigate('/supplier/parameters');
    } catch (error: any) {
      console.error('Error uploading product:', error);
      toast.error(`Upload failed: ${error.message || 'Unknown error'}`);
      setIsUploading(false);
    }
  };
  
  return <div className="text-left">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold">Upload New Product</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input 
                      id="name" 
                      placeholder="e.g., Carbon Fiber Handlebar" 
                      value={productData.name}
                      onChange={handleChange}
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
                      placeholder="e.g., 99.99" 
                      value={productData.price}
                      onChange={handleChange}
                      required 
                    />
                  </div>

                  <div>
                    <Label htmlFor="manufacturer">Manufacturer</Label>
                    <Input 
                      id="manufacturer" 
                      placeholder="e.g., Shimano" 
                      value={productData.manufacturer}
                      onChange={handleChange}
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Component Group</Label>
                    <Select 
                      value={productData.group_id} 
                      onValueChange={handleGroupChange}
                      required
                    >
                      <SelectTrigger className="text-left">
                        <SelectValue placeholder="Select a component group" />
                      </SelectTrigger>
                      <SelectContent>
                        {componentGroups.map(group => (
                          <SelectItem key={group.id} value={group.id}>
                            <div className="flex items-center">
                              <Folder className="mr-2 h-4 w-4" />
                              {group.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Component Category</Label>
                    <Select 
                      value={productData.category_id} 
                      onValueChange={handleCategoryChange}
                      disabled={!productData.group_id || filteredCategories.length === 0}
                      required
                    >
                      <SelectTrigger className="text-left">
                        <SelectValue placeholder={
                          !productData.group_id 
                            ? "Select a group first" 
                            : filteredCategories.length === 0 
                              ? "No categories found for this group" 
                              : "Select a category"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredCategories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center">
                              <FolderOpen className="mr-2 h-4 w-4" />
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="description">Product Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your product in detail..." 
                    className="h-32 text-left"
                    value={productData.description}
                    onChange={handleChange}
                    required 
                  />
                </div>

                <div>
                  <Label htmlFor="product-image">Product Image</Label>
                  <div className="mt-1 flex items-center">
                    <label className="block w-full">
                      <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="h-full object-contain" />
                        ) : (
                          <div className="space-y-1 text-center p-4">
                            <Upload className="mx-auto h-8 w-8 text-gray-400" />
                            <div className="text-sm text-gray-600">
                              <span className="text-black font-medium">Click to upload</span> or drag and drop
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
                          required 
                        />
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
        )}
      </div>
    </div>;
};
