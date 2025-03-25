
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeft, Upload, AlertCircle, Plus } from 'lucide-react';
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

// Default component groups to use if none are found in database
const DEFAULT_COMPONENT_GROUPS: ComponentGroup[] = [
  { id: 1, name: 'Frame', description: 'Bike frames and related components' },
  { id: 2, name: 'Drivetrain', description: 'Components related to power transfer' },
  { id: 3, name: 'Wheels', description: 'Wheels, hubs, and related components' },
  { id: 4, name: 'Controls', description: 'Handlebars, shifters, and control components' },
  { id: 5, name: 'Brakes', description: 'Brake systems and components' },
  { id: 6, name: 'Suspension', description: 'Suspension related components' },
  { id: 7, name: 'eBike', description: 'Electric bike specific components' }
];

// Default component categories to use if none are found in database
const DEFAULT_COMPONENT_CATEGORIES: ComponentCategory[] = [
  { id: 1, component_group: 1, name: 'Complete Frame', description: 'Full bike frames' },
  { id: 2, component_group: 1, name: 'Frame Parts', description: 'Individual frame components' },
  { id: 3, component_group: 2, name: 'Derailleurs', description: 'Gear changing mechanisms' },
  { id: 4, component_group: 2, name: 'Cassettes', description: 'Rear gear clusters' },
  { id: 5, component_group: 2, name: 'Chains', description: 'Drive chains' },
  { id: 6, component_group: 3, name: 'Complete Wheels', description: 'Full wheel assemblies' },
  { id: 7, component_group: 3, name: 'Rims', description: 'Wheel rims' },
  { id: 8, component_group: 3, name: 'Hubs', description: 'Wheel hubs' },
  { id: 9, component_group: 4, name: 'Handlebars', description: 'Steering components' },
  { id: 10, component_group: 4, name: 'Shifters', description: 'Gear shifters' },
  { id: 11, component_group: 5, name: 'Brake Calipers', description: 'Brake mechanisms' },
  { id: 12, component_group: 5, name: 'Brake Levers', description: 'Brake control levers' },
  { id: 13, component_group: 6, name: 'Forks', description: 'Front suspension' },
  { id: 14, component_group: 6, name: 'Rear Shocks', description: 'Rear suspension components' },
  { id: 15, component_group: 7, name: 'Motors', description: 'Electric drive motors' },
  { id: 16, component_group: 7, name: 'Batteries', description: 'Power storage' },
  { id: 17, component_group: 7, name: 'Controllers', description: 'Electronic control units' }
];

// Default component subcategories
const DEFAULT_COMPONENT_SUBCATEGORIES: ComponentSubcategory[] = [
  { id: 1, component_category: 1, name: 'Road Frame', description: 'Road bike frames' },
  { id: 2, component_category: 1, name: 'Mountain Frame', description: 'Mountain bike frames' },
  { id: 3, component_category: 1, name: 'Gravel Frame', description: 'Gravel bike frames' },
  { id: 4, component_category: 3, name: 'Front Derailleur', description: 'Front gear changer' },
  { id: 5, component_category: 3, name: 'Rear Derailleur', description: 'Rear gear changer' },
  { id: 6, component_category: 15, name: 'Hub Motor', description: 'Wheel hub motors' },
  { id: 7, component_category: 15, name: 'Mid-drive Motor', description: 'Bottom bracket motors' },
  { id: 8, component_category: 16, name: 'Integrated Battery', description: 'Frame-integrated batteries' },
  { id: 9, component_category: 16, name: 'External Battery', description: 'External mounted batteries' }
];

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
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [componentCategories, setComponentCategories] = useState<ComponentCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [filteredCategories, setFilteredCategories] = useState<ComponentCategory[]>([]);
  const [componentSubcategories, setComponentSubcategories] = useState<ComponentSubcategory[]>([]);
  const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(true);
  const [filteredSubcategories, setFilteredSubcategories] = useState<ComponentSubcategory[]>([]);
  
  // New state for dialogs
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false);
  const [showNewSubcategoryDialog, setShowNewSubcategoryDialog] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  
  // State for variants
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [availableVariants, setAvailableVariants] = useState<string[]>([]);
  
  // Autosuggest product names
  const [productNameSuggestions, setProductNameSuggestions] = useState<string[]>([]);
  const [manufacturerSuggestions, setManufacturerSuggestions] = useState<string[]>([]);

  // Fetch component groups from the database
  useEffect(() => {
    const fetchComponentGroups = async () => {
      setIsLoadingGroups(true);
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
        
        if (data && data.length > 0) {
          console.log('Component groups data:', data);
          setComponentGroups(data);
          
          // Extract unique product names and manufacturers for autosuggest
          const productNames = data.map(group => group.name).filter(Boolean);
          setProductNameSuggestions(prev => [...new Set([...prev, ...productNames])]);
        } else {
          console.log('No component groups found in database, using default groups');
          
          // Use default groups AND try to insert them into the database
          setComponentGroups(DEFAULT_COMPONENT_GROUPS);
          
          // Insert default groups into database
          try {
            for (const group of DEFAULT_COMPONENT_GROUPS) {
              await supabase
                .from('Component_groups')
                .insert({
                  id: group.id,
                  name: group.name,
                  description: group.description
                })
                .select()
                .single();
            }
            console.log('Default component groups inserted into database');
          } catch (insertError) {
            console.error('Error inserting default component groups:', insertError);
          }
        }
      } catch (error) {
        console.error('Error fetching component groups:', error);
        toast.error('Failed to load component groups');
        
        // Use default groups if fetch fails
        setComponentGroups(DEFAULT_COMPONENT_GROUPS);
      } finally {
        setIsLoadingGroups(false);
      }
    };
    
    fetchComponentGroups();
  }, []);

  // Fetch all component categories from the database
  useEffect(() => {
    const fetchComponentCategories = async () => {
      setIsLoadingCategories(true);
      try {
        console.log('Fetching component categories...');
        const { data, error } = await supabase
          .from('Component Categories')
          .select('*')
          .order('name');
        
        if (error) {
          console.error('Error fetching component categories:', error);
          throw error;
        }
        
        if (data && data.length > 0) {
          console.log('Component categories data:', data);
          setComponentCategories(data);
        } else {
          console.log('No component categories found in database, using default categories');
          
          // Use default categories AND try to insert them into the database
          setComponentCategories(DEFAULT_COMPONENT_CATEGORIES);
          
          // Insert default categories into database
          try {
            for (const category of DEFAULT_COMPONENT_CATEGORIES) {
              await supabase
                .from('Component Categories')
                .insert({
                  id: category.id,
                  component_group: category.component_group,
                  name: category.name,
                  description: category.description
                })
                .select()
                .single();
            }
            console.log('Default component categories inserted into database');
          } catch (insertError) {
            console.error('Error inserting default component categories:', insertError);
          }
        }
      } catch (error) {
        console.error('Error fetching component categories:', error);
        toast.error('Failed to load component categories');
        
        // Use default categories if fetch fails
        setComponentCategories(DEFAULT_COMPONENT_CATEGORIES);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    
    fetchComponentCategories();
  }, []);

  // Fetch all component subcategories from the database
  useEffect(() => {
    const fetchComponentSubcategories = async () => {
      setIsLoadingSubcategories(true);
      try {
        console.log('Fetching component subcategories...');
        const { data, error } = await supabase
          .from('Component subcategories')
          .select('*')
          .order('name');
        
        if (error) {
          console.error('Error fetching component subcategories:', error);
          throw error;
        }
        
        if (data && data.length > 0) {
          console.log('Component subcategories data:', data);
          setComponentSubcategories(data);
        } else {
          console.log('No component subcategories found in database, using default subcategories');
          
          // Use default subcategories AND try to insert them into the database
          setComponentSubcategories(DEFAULT_COMPONENT_SUBCATEGORIES);
          
          // Insert default subcategories into database
          try {
            for (const subcategory of DEFAULT_COMPONENT_SUBCATEGORIES) {
              await supabase
                .from('Component subcategories')
                .insert({
                  id: subcategory.id,
                  component_category: subcategory.component_category,
                  name: subcategory.name,
                  description: subcategory.description
                })
                .select()
                .single();
            }
            console.log('Default component subcategories inserted into database');
          } catch (insertError) {
            console.error('Error inserting default component subcategories:', insertError);
          }
        }
      } catch (error) {
        console.error('Error fetching component subcategories:', error);
        toast.error('Failed to load component subcategories');
        
        // Use default subcategories if fetch fails
        setComponentSubcategories(DEFAULT_COMPONENT_SUBCATEGORIES);
      } finally {
        setIsLoadingSubcategories(false);
      }
    };
    
    fetchComponentSubcategories();
  }, []);

  // Fetch unique product names and manufacturers for autosuggest
  useEffect(() => {
    const fetchProductSuggestions = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('name, manufacturer')
          .limit(100);
        
        if (error) {
          console.error('Error fetching product suggestions:', error);
          return;
        }
        
        if (data && data.length > 0) {
          const names = data.map(p => p.name).filter(Boolean);
          const manufacturers = data.map(p => p.manufacturer).filter(Boolean);
          
          setProductNameSuggestions(prev => [...new Set([...prev, ...names])]);
          setManufacturerSuggestions([...new Set(manufacturers)]);
        }
      } catch (error) {
        console.error('Error fetching product suggestions:', error);
      }
    };
    
    fetchProductSuggestions();
  }, []);

  // Filter categories based on selected component group
  useEffect(() => {
    if (productData.componentGroup) {
      const groupId = parseInt(productData.componentGroup);
      console.log('Filtering categories for group ID:', groupId);
      const filtered = componentCategories.filter(
        category => category.component_group === groupId
      );
      console.log('Filtered categories:', filtered);
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
      console.log('Filtering subcategories for category ID:', categoryId);
      const filtered = componentSubcategories.filter(
        subcategory => subcategory.component_category === categoryId
      );
      console.log('Filtered subcategories:', filtered);
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
    if (value === 'new') {
      setShowNewGroupDialog(true);
      return;
    }
    
    console.log("Selected component group:", value);
    setProductData(prev => ({
      ...prev,
      componentGroup: value
    }));
  };
  
  const handleComponentCategoryChange = (value: string) => {
    if (value === 'new') {
      setShowNewCategoryDialog(true);
      return;
    }
    
    console.log("Selected component category:", value);
    setProductData(prev => ({
      ...prev,
      componentCategory: value
    }));
  };
  
  const handleComponentSubcategoryChange = (value: string) => {
    if (value === 'new') {
      setShowNewSubcategoryDialog(true);
      return;
    }
    
    console.log("Selected component subcategory:", value);
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
  
  const addNewGroup = async () => {
    if (!newItemName) {
      toast.error('Please enter a name for the new group');
      return;
    }
    
    try {
      // Find the highest ID to generate a new one
      const maxId = Math.max(...componentGroups.map(g => g.id), 0);
      const newId = maxId + 1;
      
      const newGroup = {
        id: newId,
        name: newItemName,
        description: newItemDescription || null
      };
      
      const { data, error } = await supabase
        .from('Component_groups')
        .insert(newGroup)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Update state
      setComponentGroups(prev => [...prev, data]);
      toast.success(`Added new component group: ${newItemName}`);
      
      // Select the new group
      setProductData(prev => ({
        ...prev,
        componentGroup: newId.toString()
      }));
      
      // Reset form
      setNewItemName('');
      setNewItemDescription('');
      setShowNewGroupDialog(false);
    } catch (error) {
      console.error('Error adding new group:', error);
      toast.error('Failed to add new component group');
    }
  };
  
  const addNewCategory = async () => {
    if (!newItemName || !productData.componentGroup) {
      toast.error('Please enter a name for the new category and select a component group');
      return;
    }
    
    try {
      // Find the highest ID to generate a new one
      const maxId = Math.max(...componentCategories.map(c => c.id), 0);
      const newId = maxId + 1;
      
      const newCategory = {
        id: newId,
        component_group: parseInt(productData.componentGroup),
        name: newItemName,
        description: newItemDescription || null
      };
      
      const { data, error } = await supabase
        .from('Component Categories')
        .insert(newCategory)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Update state
      setComponentCategories(prev => [...prev, data]);
      setFilteredCategories(prev => [...prev, data]);
      toast.success(`Added new component category: ${newItemName}`);
      
      // Select the new category
      setProductData(prev => ({
        ...prev,
        componentCategory: newId.toString()
      }));
      
      // Reset form
      setNewItemName('');
      setNewItemDescription('');
      setShowNewCategoryDialog(false);
    } catch (error) {
      console.error('Error adding new category:', error);
      toast.error('Failed to add new component category');
    }
  };
  
  const addNewSubcategory = async () => {
    if (!newItemName || !productData.componentCategory) {
      toast.error('Please enter a name for the new subcategory and select a component category');
      return;
    }
    
    try {
      // Find the highest ID to generate a new one
      const maxId = Math.max(...componentSubcategories.map(s => s.id), 0);
      const newId = maxId + 1;
      
      const newSubcategory = {
        id: newId,
        component_category: parseInt(productData.componentCategory),
        name: newItemName,
        description: newItemDescription || null
      };
      
      const { data, error } = await supabase
        .from('Component subcategories')
        .insert(newSubcategory)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Update state
      setComponentSubcategories(prev => [...prev, data]);
      setFilteredSubcategories(prev => [...prev, data]);
      toast.success(`Added new component subcategory: ${newItemName}`);
      
      // Select the new subcategory
      setProductData(prev => ({
        ...prev,
        componentSubcategory: newId.toString()
      }));
      
      // Reset form
      setNewItemName('');
      setNewItemDescription('');
      setShowNewSubcategoryDialog(false);
    } catch (error) {
      console.error('Error adding new subcategory:', error);
      toast.error('Failed to add new component subcategory');
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
                    suggestions={productNameSuggestions}
                    onSelectSuggestion={(suggestion) => {
                      setProductData(prev => ({
                        ...prev,
                        name: suggestion
                      }));
                    }}
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
                    suggestions={manufacturerSuggestions}
                    onSelectSuggestion={(suggestion) => {
                      setProductData(prev => ({
                        ...prev,
                        manufacturer: suggestion
                      }));
                    }}
                    required 
                  />
                </div>

                <div>
                  <Label htmlFor="componentGroup">Component Group</Label>
                  {isLoadingGroups ? (
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <div className="animate-spin mr-2">
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                      Loading component groups...
                    </div>
                  ) : (
                    <Select 
                      value={productData.componentGroup} 
                      onValueChange={handleComponentGroupChange}
                    >
                      <SelectTrigger className="text-left bg-white">
                        <SelectValue placeholder="Select a component group" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {componentGroups.length > 0 ? (
                          <>
                            {componentGroups.map(group => (
                              <SelectItem key={group.id} value={group.id.toString()}>
                                {group.name || `Group ${group.id}`}
                              </SelectItem>
                            ))}
                            <SelectItem key="new-group" value="new" isNewItem>
                              Add new component group
                            </SelectItem>
                          </>
                        ) : (
                          <div className="p-2 text-center text-sm text-red-500 flex items-center justify-center">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            No component groups available
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                
                {productData.componentGroup && (
                  <div>
                    <Label htmlFor="componentCategory">Component Category</Label>
                    {isLoadingCategories ? (
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <div className="animate-spin mr-2">
                          <svg className="h-4 w-4" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </div>
                        Loading component categories...
                      </div>
                    ) : (
                      <Select 
                        value={productData.componentCategory} 
                        onValueChange={handleComponentCategoryChange}
                      >
                        <SelectTrigger className="text-left bg-white">
                          <SelectValue placeholder="Select a component category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {filteredCategories.length > 0 ? (
                            <>
                              {filteredCategories.map(category => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                  {category.name || `Category ${category.id}`}
                                </SelectItem>
                              ))}
                              <SelectItem key="new-category" value="new" isNewItem>
                                Add new category
                              </SelectItem>
                            </>
                          ) : (
                            <div className="p-2 text-center text-sm text-gray-500 flex items-center justify-center">
                              <AlertCircle className="h-4 w-4 mr-2" />
                              No categories available for this group
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                )}
                
                {productData.componentCategory && filteredSubcategories.length > 0 && (
                  <div>
                    <Label htmlFor="componentSubcategory">Component Subcategory</Label>
                    {isLoadingSubcategories ? (
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <div className="animate-spin mr-2">
                          <svg className="h-4 w-4" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </div>
                        Loading component subcategories...
                      </div>
                    ) : (
                      <Select 
                        value={productData.componentSubcategory} 
                        onValueChange={handleComponentSubcategoryChange}
                      >
                        <SelectTrigger className="text-left bg-white">
                          <SelectValue placeholder="Select a component subcategory" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {filteredSubcategories.map(subcategory => (
                            <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                              {subcategory.name || `Subcategory ${subcategory.id}`}
                            </SelectItem>
                          ))}
                          <SelectItem key="new-subcategory" value="new" isNewItem>
                            Add new subcategory
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
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
      
      {/* Dialog for adding new component group */}
      <Dialog open={showNewGroupDialog} onOpenChange={setShowNewGroupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Component Group</DialogTitle>
            <DialogDescription>
              Create a new component group for your products.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-group-name">Group Name</Label>
              <Input
                id="new-group-name"
                placeholder="e.g., Suspension"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-group-desc">Description (optional)</Label>
              <Textarea
                id="new-group-desc"
                placeholder="Description of the component group"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              setNewItemName('');
              setNewItemDescription('');
              setShowNewGroupDialog(false);
            }}>
              Cancel
            </Button>
            <Button type="button" onClick={addNewGroup}>
              Add Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for adding new component category */}
      <Dialog open={showNewCategoryDialog} onOpenChange={setShowNewCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category for the selected component group.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-category-name">Category Name</Label>
              <Input
                id="new-category-name"
                placeholder="e.g., Brakes"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-category-desc">Description (optional)</Label>
              <Textarea
                id="new-category-desc"
                placeholder="Description of the category"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              setNewItemName('');
              setNewItemDescription('');
              setShowNewCategoryDialog(false);
            }}>
              Cancel
            </Button>
            <Button type="button" onClick={addNewCategory}>
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for adding new component subcategory */}
      <Dialog open={showNewSubcategoryDialog} onOpenChange={setShowNewSubcategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Subcategory</DialogTitle>
            <DialogDescription>
              Create a new subcategory for the selected category.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-subcategory-name">Subcategory Name</Label>
              <Input
                id="new-subcategory-name"
                placeholder="e.g., Disc Brakes"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-subcategory-desc">Description (optional)</Label>
              <Textarea
                id="new-subcategory-desc"
                placeholder="Description of the subcategory"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              setNewItemName('');
              setNewItemDescription('');
              setShowNewSubcategoryDialog(false);
            }}>
              Cancel
            </Button>
            <Button type="button" onClick={addNewSubcategory}>
              Add Subcategory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
};
