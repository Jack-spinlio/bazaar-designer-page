import React, { useState, useEffect, useRef } from 'react';
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
import { Upload, AlertCircle, Plus, Search, Bold, Italic, Underline, ListOrdered, List } from 'lucide-react';
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
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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
  
  // Text formatting state for description
  const [descriptionFormat, setDescriptionFormat] = useState({
    bold: false,
    italic: false,
    underline: false,
  });
  
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  
  const [componentGroups, setComponentGroups] = useState<ComponentGroup[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [componentCategories, setComponentCategories] = useState<ComponentCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [componentSubcategories, setComponentSubcategories] = useState<ComponentSubcategory[]>([]);
  const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(true);
  
  const [componentSearchItems, setComponentSearchItems] = useState<ComponentSearchItem[]>([]);
  const [componentSearchTerm, setComponentSearchTerm] = useState('');
  const [selectedComponent, setSelectedComponent] = useState<ComponentSearchItem | null>(null);
  
  const [showNewGroupDialog, setShowNewCategoryDialog] = useState(false);
  const [showNewSubcategoryDialog, setShowNewSubcategoryDialog] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [availableVariants, setAvailableVariants] = useState<string[]>([]);
  
  const [productNameSuggestions, setProductNameSuggestions] = useState<string[]>([]);
  const [manufacturerSuggestions, setManufacturerSuggestions] = useState<string[]>([]);

  const productImageInputRef = useRef<HTMLInputElement>(null);
  const modelFileInputRef = useRef<HTMLInputElement>(null);

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
    
    // Update product data based on selected component
    if (component.type === 'group') {
      setProductData(prev => ({
        ...prev,
        componentGroup: component.originalId.toString(),
        componentCategory: '',
        componentSubcategory: ''
      }));
    } else if (component.type === 'category') {
      const parentGroup = componentCategories.find(cat => cat.id === component.originalId)?.component_group;
      
      setProductData(prev => ({
        ...prev,
        componentGroup: parentGroup ? parentGroup.toString() : prev.componentGroup,
        componentCategory: component.originalId.toString(),
        componentSubcategory: ''
      }));
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

  const handleFormatText = (format: 'bold' | 'italic' | 'underline' | 'list' | 'ordered-list') => {
    if (!descriptionRef.current) return;
    
    const textarea = descriptionRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = productData.description.substring(start, end);
    const beforeText = productData.description.substring(0, start);
    const afterText = productData.description.substring(end);
    
    let newText = '';
    let newCursorPos = 0;
    
    switch (format) {
      case 'bold':
        newText = `${beforeText}**${selectedText}**${afterText}`;
        newCursorPos = end + 4;
        setDescriptionFormat(prev => ({ ...prev, bold: !prev.bold }));
        break;
      case 'italic':
        newText = `${beforeText}_${selectedText}_${afterText}`;
        newCursorPos = end + 2;
        setDescriptionFormat(prev => ({ ...prev, italic: !prev.italic }));
        break;
      case 'underline':
        newText = `${beforeText}<u>${selectedText}</u>${afterText}`;
        newCursorPos = end + 7;
        setDescriptionFormat(prev => ({ ...prev, underline: !prev.underline }));
        break;
      case 'list':
        // Add bullet points to each line
        const bulletLines = selectedText.split('\n').map(line => `• ${line}`).join('\n');
        newText = `${beforeText}${bulletLines}${afterText}`;
        newCursorPos = start + bulletLines.length;
        break;
      case 'ordered-list':
        // Add numbers to each line
        const numberedLines = selectedText.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n');
        newText = `${beforeText}${numberedLines}${afterText}`;
        newCursorPos = start + numberedLines.length;
        break;
    }
    
    setProductData(prev => ({ ...prev, description: newText }));
    
    // After state update, reset cursor position
    setTimeout(() => {
      if (descriptionRef.current) {
        descriptionRef.current.focus();
        descriptionRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 10);
  };

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
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImagePreviews: string[] = [];
      
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            newImagePreviews.push(reader.result as string);
            setImagePreviews([...imagePreviews, ...newImagePreviews]);
          };
          reader.readAsDataURL(file);
        } else {
          toast.error(`File ${file.name} is not an image`);
        }
      });
    }
  };
  
  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  const triggerImageFileSelect = () => {
    if (productImageInputRef.current) {
      productImageInputRef.current.click();
    }
  };
  
  const triggerModelFileSelect = () => {
    if (modelFileInputRef.current) {
      modelFileInputRef.current.click();
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
  
  // Update handleSubmit to handle multiple images
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
      let thumbnailUrls: string[] = [];
      
      // Upload multiple images
      if (imagePreviews.length > 0) {
        for (let i = 0; i < imagePreviews.length; i++) {
          const imagePreview = imagePreviews[i];
          const imageBlob = await fetch(imagePreview).then(r => r.blob());
          const imageFile = new File([imageBlob], `product_${Date.now()}_${i}.jpg`, { type: 'image/jpeg' });
          
          const { data: imageData, error: imageError } = await supabase.storage
            .from('product-images')
            .upload(`${user.id}/${Date.now()}_${i}_${productData.name.replace(/\s+/g, '_')}.jpg`, imageFile, {
              cacheControl: '3600',
              upsert: true
            });
          
          if (imageError) {
            console.error('Error uploading image:', imageError);
            continue;
          }
          
          const { data: imageUrlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(imageData?.path || '');
          
          thumbnailUrls.push(imageUrlData.publicUrl);
        }
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
      
      // Update product insert to use first image as thumbnail
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
          thumbnail_url: thumbnailUrls.length > 0 ? thumbnailUrls[0] : null,
          user_id: user.id
        }])
        .select('id, name, price, manufacturer, description')
        .single();
      
      if (productError) {
        throw productError;
      }
      
      toast.success(`Product "${insertedProduct.name}" uploaded successfully!`);
      
      // If we have additional images, store references in the database
      if (thumbnailUrls.length > 1) {
        // Use the existing tables for storing additional product images
        for (const imageUrl of thumbnailUrls.slice(1)) {
          await supabase
            .from('products')
            .update({
              // Just add a reference to the image URL
              // Note: This is a temporary solution since there's no proper product_images table
              // In a real app, you'd have a separate table for product images
              description: productData.description + `\n\n[Additional Image](${imageUrl})`
            })
            .eq('id', insertedProduct.id);
        }
      }
      
      // Reset form
      setProductData({
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
      setImagePreviews([]);
