
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
      
      // If we have additional images, store them as product images
      if (thumbnailUrls.length > 1) {
        // First image is already used as the thumbnail
        const additionalImages = thumbnailUrls.slice(1);
        
        for (const imageUrl of additionalImages) {
          await supabase
            .from('product_images')
            .insert({
              product_id: insertedProduct.id,
              image_url: imageUrl,
              user_id: user.id
            });
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
      setModelFile(null);
      setSelectedVariants([]);
      
      // Navigate to products list
      navigate('/supplier/products');
      
    } catch (error) {
      console.error('Error uploading product:', error);
      toast.error('Failed to upload product');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="container max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Upload New Product</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-semibold border-b pb-3">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input 
                id="name" 
                value={productData.name} 
                onChange={handleChange} 
                placeholder="Enter product name"
                suggestions={productNameSuggestions}
                onSelectSuggestion={(suggestion) => setProductData(prev => ({ ...prev, name: suggestion }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer *</Label>
              <Input 
                id="manufacturer" 
                value={productData.manufacturer} 
                onChange={handleChange} 
                placeholder="Enter manufacturer name"
                suggestions={manufacturerSuggestions}
                onSelectSuggestion={(suggestion) => setProductData(prev => ({ ...prev, manufacturer: suggestion }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <div className="relative">
                <Input 
                  id="price" 
                  value={productData.price} 
                  onChange={handleChange} 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <select 
                id="currency" 
                value={productData.currency} 
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CAD">CAD (C$)</option>
                <option value="AUD">AUD (A$)</option>
                <option value="CNY">CNY (¥)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input 
                id="brand" 
                value={productData.brand} 
                onChange={handleChange} 
                placeholder="Enter brand name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input 
                id="sku" 
                value={productData.sku} 
                onChange={handleChange} 
                placeholder="Enter SKU"
              />
            </div>
          </div>
        </div>
        
        {/* Product Classification */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-semibold border-b pb-3">Product Classification</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="componentSearchTerm">Search Component Type</Label>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Can't find what you need?</span>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowNewGroupDialog(true)}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add New
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="componentSearchTerm"
                    placeholder="Search for component type..."
                    value={componentSearchTerm}
                    onChange={(e) => setComponentSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                {componentSearchTerm && filteredComponentItems.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredComponentItems.map((item) => (
                      <div
                        key={item.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => handleComponentSelection(item)}
                      >
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          item.type === 'group' ? 'bg-blue-500' : 
                          item.type === 'category' ? 'bg-green-500' : 'bg-purple-500'
                        }`} />
                        <div>
                          <div className="font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-xs text-gray-500">{item.description}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="componentGroup">Component Group *</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowNewGroupDialog(true)}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add
                  </Button>
                </div>
                <select 
                  id="componentGroup" 
                  value={productData.componentGroup} 
                  onChange={(e) => {
                    const groupId = e.target.value;
                    setProductData(prev => ({
                      ...prev,
                      componentGroup: groupId,
                      componentCategory: '',
                      componentSubcategory: ''
                    }));
                    
                    if (groupId) {
                      const filtered = componentCategories.filter(
                        category => category.component_group === parseInt(groupId)
                      );
                      setFilteredCategories(filtered);
                      setFilteredSubcategories([]);
                    } else {
                      setFilteredCategories([]);
                      setFilteredSubcategories([]);
                    }
                  }}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                >
                  <option value="">Select Component Group</option>
                  {componentGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="componentCategory">Component Category</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"

                    disabled={!productData.componentGroup}
                    onClick={() => setShowNewCategoryDialog(true)}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add
                  </Button>
                </div>
                <select 
                  id="componentCategory" 
                  value={productData.componentCategory} 
                  onChange={(e) => {
                    const categoryId = e.target.value;
                    setProductData(prev => ({
                      ...prev,
                      componentCategory: categoryId,
                      componentSubcategory: ''
                    }));
                    
                    if (categoryId) {
                      const filtered = componentSubcategories.filter(
                        subcategory => subcategory.component_category === parseInt(categoryId)
                      );
                      setFilteredSubcategories(filtered);
                    } else {
                      setFilteredSubcategories([]);
                    }
                  }}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  disabled={!productData.componentGroup || filteredCategories.length === 0}
                >
                  <option value="">Select Category</option>
                  {filteredCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="componentSubcategory">Component Subcategory</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    disabled={!productData.componentCategory}
                    onClick={() => setShowNewSubcategoryDialog(true)}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add
                  </Button>
                </div>
                <select 
                  id="componentSubcategory" 
                  value={productData.componentSubcategory} 
                  onChange={(e) => {
                    setProductData(prev => ({
                      ...prev,
                      componentSubcategory: e.target.value
                    }));
                  }}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  disabled={!productData.componentCategory || filteredSubcategories.length === 0}
                >
                  <option value="">Select Subcategory</option>
                  {filteredSubcategories.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {availableVariants.length > 0 && (
              <div className="space-y-2">
                <Label>Variants</Label>
                <div className="flex flex-wrap gap-2">
                  {availableVariants.map((variant) => (
                    <button
                      key={variant}
                      type="button"
                      onClick={() => handleVariantToggle(variant)}
                      className={`px-3 py-1.5 rounded-full text-sm ${
                        selectedVariants.includes(variant)
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Technical Specifications */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-semibold border-b pb-3">Technical Specifications</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input 
                id="color" 
                value={productData.color} 
                onChange={handleChange} 
                placeholder="e.g., Black, Red, Blue"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="material">Material</Label>
              <Input 
                id="material" 
                value={productData.material} 
                onChange={handleChange} 
                placeholder="e.g., Aluminum, Carbon Fiber, Steel"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="surfaceFinish">Surface Finish</Label>
              <Input 
                id="surfaceFinish" 
                value={productData.surfaceFinish} 
                onChange={handleChange} 
                placeholder="e.g., Matte, Glossy, Anodized"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <Input 
                id="weight" 
                value={productData.weight} 
                onChange={handleChange} 
                placeholder="e.g., 250g, 1.2kg"
              />
            </div>
          </div>
        </div>
        
        {/* Business Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-semibold border-b pb-3">Business Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="countryOfOrigin">Country of Origin</Label>
              <Input 
                id="countryOfOrigin" 
                value={productData.countryOfOrigin} 
                onChange={handleChange} 
                placeholder="e.g., USA, China, Germany"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="warrantyPeriod">Warranty Period</Label>
              <Input 
                id="warrantyPeriod" 
                value={productData.warrantyPeriod} 
                onChange={handleChange} 
                placeholder="e.g., 1 year, 24 months"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="leadTime">Lead Time</Label>
              <Input 
                id="leadTime" 
                value={productData.leadTime} 
                onChange={handleChange} 
                placeholder="e.g., 2-3 weeks, 30 days"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="minOrderQuantity">Minimum Order Quantity</Label>
              <Input 
                id="minOrderQuantity" 
                value={productData.minOrderQuantity} 
                onChange={handleChange} 
                placeholder="e.g., 10, 100, 1000"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="application">Application</Label>
              <Input 
                id="application" 
                value={productData.application} 
                onChange={handleChange} 
                placeholder="e.g., Road Bikes, Mountain Bikes, E-Bikes"
              />
            </div>
          </div>
        </div>
        
        {/* Description */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-semibold border-b pb-3">Description</h2>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2 border-b pb-2">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => handleFormatText('bold')}
                className={`p-1 ${descriptionFormat.bold ? 'bg-gray-200' : ''}`}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => handleFormatText('italic')}
                className={`p-1 ${descriptionFormat.italic ? 'bg-gray-200' : ''}`}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => handleFormatText('underline')}
                className={`p-1 ${descriptionFormat.underline ? 'bg-gray-200' : ''}`}
              >
                <Underline className="h-4 w-4" />
              </Button>
              <span className="border-l h-5 mx-2"></span>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => handleFormatText('list')}
                className="p-1"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => handleFormatText('ordered-list')}
                className="p-1"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </div>
            
            <Textarea 
              id="description" 
              value={productData.description} 
              onChange={handleChange} 
              placeholder="Enter detailed product description..."
              className="min-h-[200px]"
              ref={descriptionRef}
            />
            <p className="text-xs text-gray-500 mt-1">
              Markdown formatting is supported. Use ** for bold, _ for italic, and &lt;u&gt; for underlined text.
            </p>
          </div>
        </div>
        
        {/* Media Upload */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-semibold border-b pb-3">Media</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Product Images</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                {imagePreviews.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group aspect-square">
                        <img 
                          src={preview} 
                          alt={`Product preview ${index + 1}`} 
                          className="w-full h-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <div 
                      className="border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50 aspect-square"
                      onClick={triggerImageFileSelect}
                    >
                      <Plus className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                ) : (
                  <div 
                    className="flex flex-col items-center justify-center py-4 cursor-pointer"
                    onClick={triggerImageFileSelect}
                  >
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm">Click to upload product images</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  multiple
                  className="hidden"
                  ref={productImageInputRef}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>3D Model (Optional)</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                {modelFile ? (
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-md mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">{modelFile.name}</p>
                        <p className="text-xs text-gray-500">{(modelFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setModelFile(null)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div 
                    className="flex flex-col items-center justify-center py-4 cursor-pointer"
                    onClick={triggerModelFileSelect}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    <p className="text-sm">Click to upload 3D model</p>
                    <p className="text-xs text-gray-500 mt-1">STL, OBJ, GLB or GLTF up to 50MB</p>
                  </div>
                )}
                <input
                  type="file"
                  accept=".stl,.obj,.glb,.gltf"
                  onChange={handleModelFileChange}
                  className="hidden"
                  ref={modelFileInputRef}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/supplier/products')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-black hover:bg-black/90"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : 'Upload Product'}
          </Button>
        </div>
      </form>
      
      {/* New Group Dialog */}
      <Dialog open={showNewGroupDialog} onOpenChange={setShowNewGroupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Component Group</DialogTitle>
            <DialogDescription>
              Create a new component group category.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newGroupName">Group Name</Label>
              <Input
                id="newGroupName"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Enter group name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newGroupDescription">Description (Optional)</Label>
              <Textarea
                id="newGroupDescription"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                placeholder="Enter description"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewGroupDialog(false)}>
              Cancel
            </Button>
            <Button onClick={addNewGroup}>
              Add Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* New Category Dialog */}
      <Dialog open={showNewCategoryDialog} onOpenChange={setShowNewCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Component Category</DialogTitle>
            <DialogDescription>
              Create a new category under the selected component group.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Parent Group</Label>
              <div className="bg-gray-100 px-3 py-2 rounded-md text-sm">
                {componentGroups.find(g => g.id.toString() === productData.componentGroup)?.name || 'No group selected'}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newCategoryName">Category Name</Label>
              <Input
                id="newCategoryName"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newCategoryDescription">Description (Optional)</Label>
              <Textarea
                id="newCategoryDescription"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                placeholder="Enter description"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewCategoryDialog(false)}>
              Cancel
            </Button>
            <Button onClick={addNewCategory}>
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* New Subcategory Dialog */}
      <Dialog open={showNewSubcategoryDialog} onOpenChange={setShowNewSubcategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Component Subcategory</DialogTitle>
            <DialogDescription>
              Create a new subcategory under the selected category.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Parent Category</Label>
              <div className="bg-gray-100 px-3 py-2 rounded-md text-sm">
                {componentCategories.find(c => c.id.toString() === productData.componentCategory)?.name || 'No category selected'}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newSubcategoryName">Subcategory Name</Label>
              <Input
                id="newSubcategoryName"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Enter subcategory name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newSubcategoryDescription">Description (Optional)</Label>
              <Textarea
                id="newSubcategoryDescription"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                placeholder="Enter description"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewSubcategoryDialog(false)}>
              Cancel
            </Button>
            <Button onClick={addNewSubcategory}>
              Add Subcategory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
