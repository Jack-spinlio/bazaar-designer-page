
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface DesignTitleProps {
  initialTitle: string;
}

export const DesignTitle: React.FC<DesignTitleProps> = ({ initialTitle }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [designTitle, setDesignTitle] = useState(initialTitle);
  const [tempTitle, setTempTitle] = useState(designTitle);
  
  const handleEditTitle = () => {
    setTempTitle(designTitle);
    setIsEditingTitle(true);
  };

  const handleSaveTitle = async () => {
    if (tempTitle.trim() === '') {
      toast.error("Design name cannot be empty");
      return;
    }
    setDesignTitle(tempTitle);
    setIsEditingTitle(false);
    try {
      const {
        error
      } = await supabase.from('designs').upsert({
        id: 'current-design',
        name: tempTitle
      });
      if (error) throw error;
      toast.success("Design name saved");
    } catch (error) {
      console.error("Error saving design name:", error);
      toast.error("Failed to save design name");
    }
  };

  const handleCancelEdit = () => {
    setIsEditingTitle(false);
  };

  return (
    <div className="flex items-center text-gray-600">
      <span>My Design /</span>
      {isEditingTitle ? (
        <div className="flex items-center ml-1">
          <Input 
            value={tempTitle} 
            onChange={e => setTempTitle(e.target.value)} 
            className="h-8 mr-1 w-40" 
            autoFocus 
          />
          <Button variant="ghost" size="icon" onClick={handleSaveTitle} className="h-8 w-8">
            <Check size={16} className="text-green-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleCancelEdit} className="h-8 w-8">
            <X size={16} className="text-red-500" />
          </Button>
        </div>
      ) : (
        <>
          <span className="font-semibold ml-1">{designTitle}</span>
          <Button variant="ghost" size="icon" className="ml-1" onClick={handleEditTitle}>
            <Edit size={16} />
          </Button>
        </>
      )}
    </div>
  );
};
