import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeft, Upload, AlertCircle, Plus, Search } from 'lucide-react';
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

const DEFAULT_COMPONENT_GROUPS: ComponentGroup[] = [
  { id: 1, name: 'Frame', description: 'Bike frames and related components' },
  { id: 2, name: 'Drivetrain', description: 'Components related to power transfer' },
  { id: 3, name: 'Wheels', description: 'Wheels, hubs, and related components' },
  { id: 4, name: 'Controls', description: 'Handlebars, shifters, and control components' },
  { id: 5, name: 'Brakes', description: 'Brake systems and components' },
  { id: 6, name: 'Suspension', description: 'Suspension related components' },
  { id: 7, name: 'eBike', description: 'Electric bike specific components' }
];

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

interface ComponentSearchItem {
  id: string;
  name: string;
  type: 'group' | 'category' | 'subcategory';
  parentId?: number;
  originalId: number;
  description?: string | null;
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
    brand: '',
    sku: '',
    currency: 'USD',
    color: '',
    material: '',
    surfaceFinish: '',
    weight: '',
    countryOfOrigin: '',
    warrantyPeriod: '',
    leadTime: '',
    minOrderQuantity: '',
    application: '',
    componentGroup: '',
    componentCategory: '',
    componentSubcategory: '',
    description: ''
  });
  
  const [componentGroups, setComponentGroups] = useState<ComponentGroup[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [componentCategories, setComponentCategories] = useState<ComponentCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [filteredCategories, setFilteredCategories] = useState<ComponentCategory[]>([]);
  const [componentSubcategories, setComponentSubcategories] = useState<ComponentSubcategory[]>([]);
  const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(true);
  const [filteredSubcategories, setFilteredSubcategories] = useState<ComponentSubcategory[]>([]);
  
  const [componentSearchItems, setComponentSearchItems] = useState<ComponentSearchItem[]>([]);
  const [componentSearchTerm, setComponentSearchTerm] = useState('');
  const [selectedComponent, setSelectedComponent] = useState<ComponentSearchItem | null>(null);
  
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false);
  const [showNewSubcategoryDialog, setShowNewSubcategoryDialog] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [availableVariants, setAvailableVariants] = useState<string[]>([]);
  
  const [productNameSuggestions, setProductNameSuggestions] = useState<string[]>([]);
  const [manufacturerSuggestions, setManufacturerSuggestions] = useState<string[]>([]);

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
          
          const productNames = data.map(group => group.name).filter(Boolean);
          setProductNameSuggestions(prev => [...new Set([...prev, ...productNames])]);
        } else {
          console.log('No component groups found in database, using default groups');
          
          setComponentGroups(DEFAULT_COMPONENT_GROUPS);
          
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
        
        setComponentGroups(DEFAULT_COMPONENT_GROUPS);
      } finally {
        setIsLoadingGroups(false);
      }
    };
    
    fetchComponentGroups();
  }, []);

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
          
          setComponentCategories(DEFAULT_COMPONENT_CATEGORIES);
          
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
        
        setComponentCategories(DEFAULT_COMPONENT_CATEGORIES);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    
    fetchComponentCategories();
  }, []);

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
          
          setComponentSubcategories(DEFAULT_COMPONENT_SUBCATEGORIES);
          
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
        
        setComponentSubcategories(DEFAULT_COMPONENT_SUBCATEGORIES);
      } finally {
        setIsLoadingSubcategories(false);
      }
    };
    
    fetchComponentSubcategories();
  }, []);

  useEffect(() => {
    if (!isLoadingGroups && !isLoadingCategories && !isLoadingSubcategories) {
      const searchItems: ComponentSearchItem[] = [];
      
      componentGroups.forEach(group => {
        searchItems.push({
          id: `group-${group.id}`,
          name: group.name || `Group ${group.id}`,
          type: 'group',
          originalId: group.id,
          description: group.description
        });
      });
      
      componentCategories.forEach(category => {
        searchItems.push({
          id: `category-${category.id}`,
          name: category.name || `Category ${category.id}`,
          type: 'category',
          parentId: category.component_group,
          originalId: category.id,
          description: category.description
        });
      });
      
      componentSubcategories.forEach(subcategory => {
        searchItems.push({
          id: `subcategory-${subcategory.id}`,
          name: subcategory.name || `Subcategory ${subcategory.id}`,
          type: 'subcategory',
          parentId: subcategory.component_category,
          originalId: subcategory.id,
          description: subcategory.description
        });
      });
      
      setComponentSearchItems(searchItems);
    }
  }, [componentGroups, componentCategories, componentSubcategories, isLoadingGroups, isLoadingCategories, isLoadingSubcategories]);

  const filteredComponentItems = componentSearchTerm.trim() === '' 
    ? componentSearchItems 
    : componentSearchItems.filter(item => 
        item.name.toLowerCase().includes(componentSearchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(componentSearchTerm.toLowerCase())
      );

  const handleComponentSelection = (component: ComponentSearchItem) => {
    setSelectedComponent(component);
    
    if (component.type === 'group') {
      setProductData(prev => ({
        ...prev,
        componentGroup: component.originalId.toString(),
        componentCategory: '',
        componentSubcategory: ''
      }));
      
      const filtered = componentCategories.filter(
        category => category.component_group === component.originalId
      );
      setFilteredCategories(filtered);
      setFilteredSubcategories([]);
      
    } else if (component.type === 'category') {
      const parentGroup = componentCategories.find(cat => cat.id === component.originalId)?.component_group;
      
      setProductData(prev => ({
        ...prev,
        componentGroup: parentGroup ? parentGroup.toString() : prev.componentGroup,
        componentCategory: component.originalId.toString(),
        componentSubcategory: ''
      }));
      
      if (parentGroup) {
        const filteredCats = componentCategories.filter(
          category => category.component_group === parentGroup
        );
        setFilteredCategories(filteredCats);
      }
      
      const filteredSubs = componentSubcategories.filter(
        subcategory => subcategory.component_category === component.originalId
      );
      setFilteredSubcategories(filteredSubs);
      
    } else if (component.type === 'subcategory') {
      const parentCategory = componentSubcategories.find(sub => sub.id === component.originalId)?.component_category;
      
      let parentGroup = undefined;
      if (parentCategory) {
        parentGroup = componentCategories.find(cat => cat.id === parentCategory)?.component_group;
      }
      
      setProductData(prev => ({
        ...prev,
        componentGroup: parentGroup ? parentGroup.toString() : prev.componentGroup,
        componentCategory: parentCategory ? parentCategory.toString() : prev.componentCategory,
        componentSubcategory: component.originalId.toString()
      }));
      
      if (parentGroup) {
        const filteredCats = componentCategories.filter(
          category => category.component_group === parentGroup
        );
        setFilteredCategories(filteredCats);
      }
      
      if (parentCategory) {
        const filteredSubs = componentSubcategories.filter(
          subcategory => subcategory.component_category === parentCategory
        );
        setFilteredSubcategories(filteredSubs);
      }
    }
    
    setComponentSearchTerm('');
  };

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

  useEffect(() => {
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
    
    let variantKey = '';
    
    if (selectedComponent) {
      variantKey = selectedComponent.name;
    } else if (productData.componentSubcategory) {
      const subcategoryId = parseInt(productData.componentSubcategory);
      const selectedSubcategory = componentSubcategories.find(sub => sub.id === subcategoryId);
      if (selectedSubcategory?.name) {
        variantKey = selectedSubcategory.name;
      }
    } else if (productData.componentCategory) {
      const categoryId = parseInt(productData.componentCategory);
      const selectedCategory = componentCategories.find(cat => cat.id === categoryId);
      if (selectedCategory?.name) {
        variantKey = selectedCategory.name;
      }
    } else if (productData.componentGroup) {
      const groupId = parseInt(productData.componentGroup);
      const selectedGroup = componentGroups.find(group => group.id === groupId);
      if (selectedGroup?.name) {
        variantKey = selectedGroup.name;
      }
    }
    
    if (variantKey && variantMapping[variantKey]) {
      setAvailableVariants(variantMapping[variantKey]);
    } else {
      const matchingKeys = Object.keys(variantMapping).filter(key => 
        variantKey.includes(key) || key.includes(variantKey)
      );
      
      if (matchingKeys.length > 0) {
        const combinedVariants = matchingKeys.flatMap(key => variantMapping[key]);
        setAvailableVariants([...new Set(combinedVariants)]);
      } else {
        setAvailableVariants([]);
      }
    }
  }, [selectedComponent, productData.componentGroup, productData.componentCategory, productData.componentSubcategory, componentGroups, componentCategories, componentSubcategories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [id]: value
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
      
      setComponentGroups(prev => [...prev, data]);
      toast.success(`Added new component group: ${newItemName}`);
      
      setProductData(prev => ({
        ...prev,
        componentGroup: newId.toString()
      }));
      
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
      
      setComponentCategories(prev => [...prev, data]);
      setFilteredCategories(prev => [...prev, data]);
      toast.success(`Added new component category: ${newItemName}`);
      
      setProductData(prev => ({
        ...prev,
        componentCategory: newId.toString()
      }));
      
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
      
      setComponentSubcategories(prev => [...prev, data]);
      setFilteredSubcategories(prev => [...prev, data]);
      toast.success(`Added new component subcategory: ${newItemName}`);
      
      setProductData(prev => ({
        ...prev,
        componentSubcategory: newId.toString()
      }));
      
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to upload products');
        setIsUploading(false);
        return;
      }
      
      let modelUrl = '';
      let thumbnailUrl = '';
      
      if (imagePreview) {
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
        
        const { data: imageUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(imageData?.path || '');
        
        thumbnailUrl = imageUrlData.publicUrl;
      }
      
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
        
        const { data: modelUrlData } = supabase.storage
          .from('product-models')
          .getPublicUrl(filePath);
        
        modelUrl = modelUrlData.publicUrl;
      }
      
      const selectedGroup = componentGroups.find(group => group.id.toString() === productData.componentGroup);
      const selectedCategory = componentCategories.find(category => category.id.toString() === productData.componentCategory);
      
      const { data: insertedProduct, error: productError } = await supabase
        .from('products')
        .insert([{
          name: productData.name,
          price: parseFloat(productData.price),
          manufacturer: productData.manufacturer,
          brand: productData.brand,
          sku: productData.sku,
          currency: productData.currency,
          color: productData.color,
          material: productData.material,
          surface_finish: productData.surfaceFinish,
          weight: productData.weight,
          country_of_origin: productData.countryOfOrigin,
          warranty_period: productData.warrantyPeriod,
          lead_time: productData.leadTime,
          min_order_quantity: productData.minOrderQuantity,
          application: productData.application,
          description: productData.description,
          category_id: null,
          model_url: modelUrl || null,
          thumbnail_url: thumbnailUrl || null,
          user_id: user.id
        }])
        .select('id, name, price, manufacturer, description')
        .single();
      
      if (productError) {
        throw productError;
      }
      
      if (insertedProduct) {
        if (selectedGroup) {
          await supabase
            .from('product_parameters')
            .insert({
              product_id: insertedProduct.id,
              name: 'component_group',
              value: selectedGroup.name
            });
        }
        
        if (selectedCategory) {
          await supabase
            .from('product_parameters')
            .insert({
              product_id: insertedProduct.id,
              name: 'component_category',
              value: selectedCategory.name
            });
        }
        
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
      
      if (modelFile && insertedProduct) {
        const component: ComponentItem = {
          id: `product-${Date.now()}`,
          name: insertedProduct.name,
          type: modelFile.name.split('.').pop()?.toUpperCase() || 'STL',
          thumbnail: thumbnailUrl || '/placeholder.svg',
          folder: selectedCategory?.name || 'Other',
          shape: 'box',
          modelUrl: modelUrl
        };
        
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
    } catch (error) {
      console.error('Error uploading product:', error);
      setIsUploading(false);
      toast.error('Failed to upload product');
    }
  };

  return (
    <div className="container mx-auto py-8">
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
        <h1 className="text-2xl font-bold">Upload New Product</h1>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="block text-gray-700 mb-1">Product Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              value={productData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
              suggestions={productNameSuggestions}
              onSelectSuggestion={(suggestion) => setProductData(prev => ({ ...prev, name: suggestion }))}
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="block text-gray-700 mb-1">Product Description</Label>
            <Textarea
              id="description"
              value={productData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="manufacturer" className="block text-gray-700 mb-1">Manufacturer</Label>
              <Input
                id="manufacturer"
                value={productData.manufacturer}
                onChange={handleChange}
                placeholder="Enter manufacturer name"
                suggestions={manufacturerSuggestions}
                onSelectSuggestion={(suggestion) => setProductData(prev => ({ ...prev, manufacturer: suggestion }))}
              />
            </div>
            
            <div>
              <Label htmlFor="brand" className="block text-gray-700 mb-1">Brand</Label>
              <Input
                id="brand"
                value={productData.brand}
                onChange={handleChange}
                placeholder="Enter brand name"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="sku" className="block text-gray-700 mb-1">SKU</Label>
              <Input
                id="sku"
                value={productData.sku}
                onChange={handleChange}
                placeholder="Enter product SKU"
              />
            </div>
            
            <div>
              <Label htmlFor="price" className="block text-gray-700 mb-1">Price <span className="text-red-500">*</span></Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={productData.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="currency" className="block text-gray-700 mb-1">Currency</Label>
              <select
                id="currency"
                value={productData.currency}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
                <option value="CNY">CNY</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="color" className="block text-gray-700 mb-1">Color</Label>
              <Input
                id="color"
                value={productData.color}
                onChange={handleChange}
                placeholder="Enter product color"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="material" className="block text-gray-700 mb-1">Material</Label>
              <Input
                id="material"
                value={productData.material}
                onChange={handleChange}
                placeholder="Enter product material"
              />
            </div>
            
            <div>
              <Label htmlFor="surfaceFinish" className="block text-gray-700 mb-1">Surface Finish</Label>
              <Input
                id="surfaceFinish"
                value={productData.surfaceFinish}
                onChange={handleChange}
                placeholder="Enter surface finish"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="weight" className="block text-gray-700 mb-1">Weight</Label>
              <Input
                id="weight"
                value={productData.weight}
                onChange={handleChange}
                placeholder="Enter product weight"
              />
            </div>
            
            <div>
              <Label htmlFor="countryOfOrigin" className="block text-gray-700 mb-1">Country of Origin</Label>
              <Input
                id="countryOfOrigin"
                value={productData.countryOfOrigin}
                onChange={handleChange}
                placeholder="Enter country of origin"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="warrantyPeriod" className="block text-gray-700 mb-1">Warranty Period</Label>
              <Input
                id="warrantyPeriod"
                value={productData.warrantyPeriod}
                onChange={handleChange}
                placeholder="Enter warranty period (e.g., 12 months)"
              />
            </div>
            
            <div>
              <Label htmlFor="leadTime" className="block text-gray-700 mb-1">Lead Time</Label>
              <Input
                id="leadTime"
                value={productData.leadTime}
                onChange={handleChange}
                placeholder="Enter lead time (e.g., 2-3 weeks)"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="minOrderQuantity" className="block text-gray-700 mb-1">Minimum Order Quantity</Label>
              <Input
                id="minOrderQuantity"
                value={productData.minOrderQuantity}
                onChange={handleChange}
                placeholder="Enter minimum order quantity"
              />
            </div>
            
            <div>
              <Label htmlFor="application" className="block text-gray-700 mb-1">Application</Label>
              <Input
                id="application"
                value={productData.application}
                onChange={handleChange}
                placeholder="Enter product application"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="block text-gray-700 mb-1">
              Component Type <span className="text-red-500">*</span>
            </Label>
            
            <div className="relative">
              <div className="flex items-center border rounded-md px-3 py-2 bg-background">
                <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                <input
                  type="text"
                  className="flex-1 outline-none bg-transparent"
                  placeholder="Search for component type..."
                  value={componentSearchTerm}
                  onChange={(e) => setComponentSearchTerm(e.target.value)}
                />
              </div>
              
              {componentSearchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredComponentItems.length > 0 ? (
                    filteredComponentItems.map((item) => (
                      <div
                        key={item.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleComponentSelection(item)}
                      >
                        <div className="font-medium">{item.name}</div>
                        {item.description && (
                          <div className="text-sm text-gray-500">{item.description}</div>
                        )}
                        <div className="text-xs text-gray-400 capitalize">
                          {item.type}
                          {item.type === 'category' && ' • ' + (
                            componentGroups.find(g => g.id === item.parentId)?.name || 'Unknown Group'
                          )}
                          {item.type === 'subcategory' && ' • ' + (
                            componentCategories.find(c => c.id === item.parentId)?.name || 'Unknown Category'
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        No components found
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => setShowNewGroupDialog(true)}
                          className="text-xs h-7"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Group
                        </Button>
                        {productData.componentGroup && (
                          <Button 
                            size="sm" 
                            onClick={() => setShowNewCategoryDialog(true)}
                            className="text-xs h-7"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Category
                          </Button>
                        )}
                        {productData.componentCategory && (
                          <Button 
                            size="sm" 
                            onClick={() => setShowNewSubcategoryDialog(true)}
                            className="text-xs h-7"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Subcategory
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {selectedComponent && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
                <div className="font-medium text-blue-700">Selected: {selectedComponent.name}</div>
                <div className="text-sm text-blue-600 capitalize">
                  {selectedComponent.type}
                  {selectedComponent.type === 'category' && ' from ' + (
                    componentGroups.find(g => g.id === selectedComponent.parentId)?.name || 'Unknown Group'
                  )}
                  {selectedComponent.type === 'subcategory' && ' from ' + (
                    componentCategories.find(c => c.id === selectedComponent.parentId)?.name || 'Unknown Category'
                  )}
                </div>
              </div>
            )}
            
            {(productData.componentGroup || selectedComponent) && availableVariants.length > 0 && (
              <div className="mt-4">
                <Label className="block text-gray-700 mb-2">Variants</Label>
                <div className="flex flex-wrap gap-2">
                  {availableVariants.map((variant) => (
                    <Button
                      key={variant}
                      type="button"
                      variant={selectedVariants.includes(variant) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleVariantToggle(variant)}
                      className="text-xs h-7"
                    >
                      {variant}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="productImage" className="block text-gray-700 mb-1">Product Image</Label>
              <div className="border-2 border-dashed rounded-md p-4 text-center">
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Product preview" className="max-h-40 mx-auto" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-0 right-0 mt-2 mr-2"
                      onClick={() => setImagePreview(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <Upload className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="text-sm text-gray-500">
                      Drag and drop or click to upload
                    </div>
                    <label className="inline-block">
                      <Button type="button" variant="outline" size="sm">
                        Browse Files
                      </Button>
                      <input
                        type="file"
                        id="productImage"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="modelFile" className="block text-gray-700 mb-1">3D Model File</Label>
              <div className="border-2 border-dashed rounded-md p-4 text-center">
                {modelFile ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center">
                      <div className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm">
                        {modelFile.name}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setModelFile(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <Upload className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="text-sm text-gray-500">
                      Upload STL, OBJ, GLB, or GLTF files
                    </div>
                    <label className="inline-block">
                      <Button type="button" variant="outline" size="sm">
                        Browse Files
                      </Button>
                      <input
                        type="file"
                        id="modelFile"
                        accept=".stl,.obj,.glb,.gltf"
                        className="hidden"
                        onChange={handleModelFileChange}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isUploading}
            >
              {isUploading ? (
                <>Uploading...</>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Product
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
      
      <Dialog open={showNewGroupDialog} onOpenChange={setShowNewGroupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Component Group</DialogTitle>
            <DialogDescription>
              Create a new component group for your products
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="newGroupName" className="block text-gray-700 mb-1">Name <span className="text-red-500">*</span></Label>
              <Input
                id="newGroupName"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Enter group name"
                required
              />
            </div>
            <div>
              <Label htmlFor="newGroupDescription" className="block text-gray-700 mb-1">Description</Label>
              <Textarea
                id="newGroupDescription"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                placeholder="Enter group description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowNewGroupDialog(false)}>Cancel</Button>
            <Button type="button" onClick={addNewGroup}>Add Group</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showNewCategoryDialog} onOpenChange={setShowNewCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Component Category</DialogTitle>
            <DialogDescription>
              Create a new category for the selected component group
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="newCategoryName" className="block text-gray-700 mb-1">Name <span className="text-red-500">*</span></Label>
              <Input
                id="newCategoryName"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Enter category name"
                required
              />
            </div>
            <div>
              <Label htmlFor="newCategoryDescription" className="block text-gray-700 mb-1">Description</Label>
              <Textarea
                id="newCategoryDescription"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                placeholder="Enter category description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowNewCategoryDialog(false)}>Cancel</Button>
            <Button type="button" onClick={addNewCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showNewSubcategoryDialog} onOpenChange={setShowNewSubcategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Component Subcategory</DialogTitle>
            <DialogDescription>
              Create a new subcategory for the selected component category
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="newSubcategoryName" className="block text-gray-700 mb-1">Name <span className="text-red-500">*</span></Label>
              <Input
                id="newSubcategoryName"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Enter subcategory name"
                required
              />
            </div>
            <div>
              <Label htmlFor="newSubcategoryDescription" className="block text-gray-700 mb-1">Description</Label>
              <Textarea
                id="newSubcategoryDescription"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                placeholder="Enter subcategory description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowNewSubcategoryDialog(false)}>Cancel</Button>
            <Button type="button" onClick={addNewSubcategory}>Add Subcategory</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
