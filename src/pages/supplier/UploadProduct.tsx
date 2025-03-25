
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ComponentItem } from '@/components/Sidebar';

interface ComponentGroup {
  id: number;
  name: string;
  description: string | null;
}

interface ComponentCategory {
  id: number;
  component_group: number;
  name: string;
  description: string | null;
}

interface ComponentSubcategory {
  id: number;
  component_category: number;
  name: string;
  description: string | null;
}

export const UploadProduct: React.FC = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    manufacturer: '',
    componentGroup: '',
    componentCategory: '',
    componentSubcategory: '',
    description: ''
  });
  
  // States for the hierarchical data
  const [componentGroups, setComponentGroups] = useState<ComponentGroup[]>([]);
  const [componentCategories, setComponentCategories] = useState<ComponentCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ComponentCategory[]>([]);
  const [componentSubcategories, setComponentSubcategories] = useState<ComponentSubcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<ComponentSubcategory[]>([]);
  
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [availableVariants, setAvailableVariants] = useState<string[]>([]);
  
  // Fetch component groups from the database
  useEffect(() => {
    const fetchComponentGroups = async () => {
      try {
        console.log('Fetching component groups...');
        const { data, error } = await supabase
          .from('Component_groups')
          .select('*')
          .order('name');
        
        if (error) {
          console.error('Error fetching component groups:', error);
          throw error;
        }
        
        if (data) {
          console.log('Component groups data:', data);
          setComponentGroups(data);
        }
      } catch (error) {
        console.error('Error fetching component groups:', error);
        toast.error('Failed to load component groups');
      }
    };
    
    fetchComponentGroups();
  }, []);

  // Fetch all component categories from the database
  useEffect(() => {
    const fetchComponentCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('Component Categories')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        if (data) {
          setComponentCategories(data);
        }
      } catch (error) {
        console.error('Error fetching component categories:', error);
        toast.error('Failed to load component categories');
      }
    };
    
    fetchComponentCategories();
  }, []);

  // Fetch all component subcategories from the database
  useEffect(() => {
    const fetchComponentSubcategories = async () => {
      try {
        const { data, error } = await supabase
          .from('Component subcategories')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        if (data) {
          setComponentSubcategories(data);
        }
      } catch (error) {
        console.error('Error fetching component subcategories:', error);
        toast.error('Failed to load component subcategories');
      }
    };
    
    fetchComponentSubcategories();
  }, []);

  // Filter categories based on selected component group
  useEffect(() => {
    if (productData.componentGroup) {
      const groupId = parseInt(productData.componentGroup);
      const filtered = componentCategories.filter(
        category => category.component_group === groupId
      );
      setFilteredCategories(filtered);
      
      // Reset the component category and subcategory when group changes
      setProductData(prev => ({
        ...prev,
        componentCategory: '',
        componentSubcategory: ''
      }));
      
      setFilteredSubcategories([]);
    } else {
      setFilteredCategories([]);
    }
  }, [productData.componentGroup, componentCategories]);

  // Filter subcategories based on selected component category
  useEffect(() => {
    if (productData.componentCategory) {
      const categoryId = parseInt(productData.componentCategory);
      const filtered = componentSubcategories.filter(
        subcategory => subcategory.component_category === categoryId
      );
      setFilteredSubcategories(filtered);
      
      // Reset the component subcategory when category changes
      setProductData(prev => ({
        ...prev,
        componentSubcategory: ''
      }));
    } else {
      setFilteredSubcategories([]);
    }
  }, [productData.componentCategory, componentSubcategories]);
  
  // This is a simplified mapping for demo purposes based on the list provided
  useEffect(() => {
    // Sample variant data based on the list provided
    const variantMapping: Record<string, string[]> = {
      'Frame': ['Step Thru', 'Gravel', 'Road', 'Mountain', 'Enduro', 'Cross Country', 'Hybrid'],
      'Fork': ['Rigid', 'Suspension'],
      'Battery': ['Internal', 'External'],
      'Motor': ['Front Hub Motor', 'Rear Hub Motor', 'Mid-Motor'],
      'Display': ['External', 'Top Tube Integrated', 'Handlebar Integrated'],
      'Drivetrain': ['Chain', 'Belt Drive', 'Single Speed', 'Multi-Speed'],
      'Brakes': ['Disc Brake', 'V-Brake', 'Hydraulic', 'Mechanical'],
      'Wheels': ['Aluminum', 'Carbon', 'Steel', 'Tubeless Ready'],
      'Pedals': ['Platform', 'SPD', 'Toe Clip'],
      'Handlebar': ['Riser Handlebars', 'Dropdown Bars', 'Bullhorn Bars'],
      'Seat Post': ['Standard', 'Layback', 'Integrated Light', 'Dropper', 'Suspension']
    };
    
    // Find the variant options based on selected category
    if (productData.componentCategory) {
      const categoryId = parseInt(productData.componentCategory);
      const selectedCategory = componentCategories.find(cat => cat.id === categoryId);
      
      if (selectedCategory && selectedCategory.name && variantMapping[selectedCategory.name]) {
        setAvailableVariants(variantMapping[selectedCategory.name]);
      } else {
        setAvailableVariants([]);
      }
      
      setSelectedVariants([]);
    }
  }, [productData.componentCategory, componentCategories]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleComponentGroupChange = (value: string) => {
    console.log("Selected component group:", value);
    setProductData(prev => ({
      ...prev,
      componentGroup: value
    }));
  };
  
  const handleComponentCategoryChange = (value: string) => {
    setProductData(prev => ({
      ...prev,
      componentCategory: value
    }));
  };
  
  const handleComponentSubcategoryChange = (value: string) => {
    setProductData(prev => ({
      ...prev,
      componentSubcategory: value
    }));
  };
  
  const handleVariantToggle = (variant: string) => {
    setSelectedVariants(prev => 
      prev.includes(variant) 
        ? prev.filter(v => v !== variant) 
        : [...prev, variant]
    );
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
    
    if (!productData.name || !productData.price || !productData.componentGroup) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to upload products');
        setIsUploading(false);
        return;
      }
      
      let modelUrl = '';
      let thumbnailUrl = '';
      
      // Upload the image if provided
      if (imagePreview) {
        // Convert data URL to blob
        const imageBlob = await fetch(imagePreview).then(r => r.blob());
        const imageFile = new File([imageBlob], `product_${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        const { data: imageData, error: imageError } = await supabase.storage
          .from('product-images')
          .upload(`${user.id}/${Date.now()}_${productData.name.replace(/\s+/g, '_')}.jpg`, imageFile, {
            cacheControl: '3600',
            upsert: true
          });
        
        if (imageError) {
          throw imageError;
        }
        
        // Get the public URL for the uploaded image
        const { data: imageUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(imageData?.path || '');
        
        thumbnailUrl = imageUrlData.publicUrl;
      }
      
      // Upload model file if provided
      if (modelFile) {
        const fileExt = modelFile.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}_${productData.name.replace(/\s+/g, '_')}.${fileExt}`;
        
        const { data: modelData, error: modelError } = await supabase.storage
          .from('product-models')
          .upload(filePath, modelFile, {
            cacheControl: '3600',
            upsert: true
          });
        
        if (modelError) {
          throw modelError;
        }
        
        // Get the public URL for the uploaded model
        const { data: modelUrlData } = supabase.storage
          .from('product-models')
          .getPublicUrl(filePath);
        
        modelUrl = modelUrlData.publicUrl;
      }
      
      // Find the selected component group and category for reference
      const selectedGroup = componentGroups.find(group => group.id.toString() === productData.componentGroup);
      const selectedCategory = componentCategories.find(category => category.id.toString() === productData.componentCategory);
      
      // Insert product into database
      const { data: insertedProduct, error: productError } = await supabase
        .from('products')
        .insert([{
          name: productData.name,
          price: parseFloat(productData.price),
          manufacturer: productData.manufacturer,
          description: productData.description,
          category_id: null, // We'll store detailed category info in parameters
          model_url: modelUrl || null,
          thumbnail_url: thumbnailUrl || null,
          user_id: user.id
        }])
        .select('id, name, price, manufacturer, description')
        .single();
      
      if (productError) {
        throw productError;
      }
      
      // Store parameters (component group, category, subcategory)
      if (insertedProduct) {
        // Store component group
        if (selectedGroup) {
          await supabase
            .from('product_parameters')
            .insert({
              product_id: insertedProduct.id,
              name: 'component_group',
              value: selectedGroup.name
            });
        }
        
        // Store component category
        if (selectedCategory) {
          await supabase
            .from('product_parameters')
            .insert({
              product_id: insertedProduct.id,
              name: 'component_category',
              value: selectedCategory.name
            });
        }
        
        // Store component subcategory
        if (productData.componentSubcategory) {
          const subcategoryId = parseInt(productData.componentSubcategory);
          const selectedSubcategory = componentSubcategories.find(subcat => subcat.id === subcategoryId);
          
          if (selectedSubcategory) {
            await supabase
              .from('product_parameters')
              .insert({
                product_id: insertedProduct.id,
                name: 'component_subcategory',
                value: selectedSubcategory.name
              });
          }
        }
        
        // Store selected variants as parameters
        for (const variant of selectedVariants) {
          await supabase
            .from('product_parameters')
            .insert({
              product_id: insertedProduct.id,
              name: 'variant',
              value: variant
            });
        }
      }
      
      setIsUploading(false);
      toast.success('Product uploaded successfully');
      
      // If model file exists, go to parameters page, otherwise go back to products list
      if (modelFile && insertedProduct) {
        // Create component object for the viewport
        const component: ComponentItem = {
          id: `product-${Date.now()}`,
          name: insertedProduct.name,
          type: modelFile.name.split('.').pop()?.toUpperCase() || 'STL',
          thumbnail: thumbnailUrl || '/placeholder.svg',
          folder: selectedCategory?.name || 'Other',
          shape: 'box',
          modelUrl: modelUrl
        };
        
        // Store component in local storage for parameters page
        localStorage.setItem('currentUploadedProduct', JSON.stringify({
          ...component,
          price: insertedProduct.price,
          manufacturer: insertedProduct.manufacturer,
          description: insertedProduct.description
        }));
        
        navigate('/supplier/parameters');
      } else {
        navigate('/supplier/products');
      }
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

                <div>
                  <Label htmlFor="componentGroup">Component Group</Label>
                  <Select 
                    value={productData.componentGroup} 
                    onValueChange={handleComponentGroupChange}
                  >
                    <SelectTrigger className="text-left">
                      <SelectValue placeholder="Select a component group" />
                    </SelectTrigger>
                    <SelectContent>
                      {componentGroups.length > 0 ? (
                        componentGroups.map(group => (
                          <SelectItem key={group.id} value={group.id.toString()}>
                            {group.name || `Group ${group.id}`}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="loading" disabled>Loading component groups...</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                {filteredCategories.length > 0 && (
                  <div>
                    <Label htmlFor="componentCategory">Component Category</Label>
                    <Select 
                      value={productData.componentCategory} 
                      onValueChange={handleComponentCategoryChange}
                    >
                      <SelectTrigger className="text-left">
                        <SelectValue placeholder="Select a component category" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredCategories.map(category => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name || `Category ${category.id}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {filteredSubcategories.length > 0 && (
                  <div>
                    <Label htmlFor="componentSubcategory">Component Subcategory</Label>
                    <Select 
                      value={productData.componentSubcategory} 
                      onValueChange={handleComponentSubcategoryChange}
                    >
                      <SelectTrigger className="text-left">
                        <SelectValue placeholder="Select a component subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredSubcategories.map(subcategory => (
                          <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                            {subcategory.name || `Subcategory ${subcategory.id}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {availableVariants.length > 0 && (
                  <div>
                    <Label>Variants</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {availableVariants.map(variant => (
                        <div 
                          key={variant}
                          className={`border rounded-md p-2 cursor-pointer text-sm ${
                            selectedVariants.includes(variant) 
                              ? 'bg-black text-white' 
                              : 'bg-white'
                          }`}
                          onClick={() => handleVariantToggle(variant)}
                        >
                          {variant}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                      />
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="model-file">3D Model File (optional)</Label>
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
            <Button type="button" variant="outline" className="mr-2" onClick={() => navigate('/supplier/products')}>
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
