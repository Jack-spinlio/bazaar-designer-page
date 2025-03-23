import React from 'react';
import { Sidebar, ComponentItem } from './Sidebar';
import { PrefabSidebar, PrefabItem } from './PrefabSidebar';
import { SavedSidebar, SavedDesign } from './SavedSidebar';
import { Viewport } from './Viewport';
import { StatusBar } from './StatusBar';
import { Button } from '@/components/ui/button';
import { IconSidebar } from './IconSidebar';
import { Input } from '@/components/ui/input';
import { Edit, Share, Bell, Check, X, ChevronDown, Smartphone, Link, Download, ScanLine, SmilePlus, User, Eye, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  children
}) => {
  const [selectedComponent, setSelectedComponent] = React.useState<ComponentItem | null>(null);
  const [selectedPrefab, setSelectedPrefab] = React.useState<PrefabItem | null>(null);
  const [selectedDesign, setSelectedDesign] = React.useState<SavedDesign | null>(null);
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [designTitle, setDesignTitle] = React.useState("Bazaar Road bike");
  const [tempTitle, setTempTitle] = React.useState(designTitle);
  const [linkAccess, setLinkAccess] = React.useState("Anyone with the link");
  const [viewPermission, setViewPermission] = React.useState("Can view");

  const location = useLocation();
  const showComponentSidebar = location.pathname === '/components';
  const showPrefabSidebar = location.pathname === '/prefabs';
  const showSavedSidebar = location.pathname === '/saved';

  const handleComponentSelected = (component: ComponentItem) => {
    setSelectedComponent(component);
    console.log('Component selected in Layout:', component.name);
  };

  const handlePrefabSelected = (prefab: PrefabItem) => {
    setSelectedPrefab(prefab);
    console.log('Prefab selected in Layout:', prefab.name);
  };

  const handleDesignSelected = (design: SavedDesign) => {
    setSelectedDesign(design);
    console.log('Design selected in Layout:', design.name);
  };

  const handleComponentPlaced = () => {
    console.log('Component placed in scene');
    setSelectedComponent(null);
    setSelectedPrefab(null);
  };

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://bazaar.app/designs/${designTitle.toLowerCase().replace(/\s+/g, '-')}`);
    toast.success("Link copied to clipboard");
  };

  const handlePublishToCommunity = () => {
    toast.success("Design published to community");
  };

  const handleShareWithProducer = () => {
    toast.success("Design shared with producer");
  };

  const handleDownload = () => {
    toast.success("Preparing download...");
  };

  const handleARView = () => {
    toast.success("Opening AR view...");
  };

  const handleSeeAll = () => {
    toast.success("Showing all sharing options");
  };

  return <div className="flex flex-col h-screen p-2.5 overflow-hidden bg-[#F5F5F5]">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 z-10 bg-white rounded-2xl shadow-sm" style={{
      margin: '10px'
    }}>
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Bazaar</h1>
        </div>
        <div className="flex items-center">
          <div className="flex items-center text-gray-600 mr-4">
            <span>My Design /</span>
            {isEditingTitle ? <div className="flex items-center ml-1">
                <Input value={tempTitle} onChange={e => setTempTitle(e.target.value)} className="h-8 mr-1 w-40" autoFocus />
                <Button variant="ghost" size="icon" onClick={handleSaveTitle} className="h-8 w-8">
                  <Check size={16} className="text-green-500" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleCancelEdit} className="h-8 w-8">
                  <X size={16} className="text-red-500" />
                </Button>
              </div> : <>
                <span className="font-semibold ml-1">{designTitle}</span>
                <Button variant="ghost" size="icon" className="ml-1" onClick={handleEditTitle}>
                  <Edit size={16} />
                </Button>
              </>}
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell size={20} />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button className="px-6 flex items-center gap-2 rounded-full bg-black text-white hover:bg-gray-800">
                  <Share size={16} className="mr-1" />
                  Share
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[320px] p-5">
                <div className="flex flex-col space-y-5">
                  <h2 className="text-2xl font-bold">Share this design</h2>
                  
                  <Button onClick={handlePublishToCommunity} className="w-full bg-black text-white rounded-full py-5 h-auto flex items-center justify-center gap-2">
                    <SmilePlus size={20} />
                    <span className="text-base">Publish to Community</span>
                  </Button>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Create a link</h3>
                    
                    <div className="flex gap-3 mb-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="flex-1 justify-between py-5 h-auto rounded-full">
                            <span className="text-sm">{linkAccess}</span>
                            <ChevronDown size={16} />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px]">
                          <div className="space-y-2">
                            <Button variant="ghost" className="w-full justify-start" onClick={() => setLinkAccess("Anyone with the link")}>
                              Anyone with the link
                            </Button>
                            <Button variant="ghost" className="w-full justify-start" onClick={() => setLinkAccess("Specific people")}>
                              Specific people
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="flex-1 justify-between py-5 h-auto rounded-full">
                            <span className="text-sm">{viewPermission}</span>
                            <ChevronDown size={16} />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px]">
                          <div className="space-y-2">
                            <Button variant="ghost" className="w-full justify-start" onClick={() => setViewPermission("Can view")}>
                              Can view
                            </Button>
                            <Button variant="ghost" className="w-full justify-start" onClick={() => setViewPermission("Can edit")}>
                              Can edit
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2 py-5 h-auto rounded-full" onClick={handleCopyLink}>
                      <Link size={18} />
                      <span className="text-base">Copy Link</span>
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Ready for a sample?</h3>
                    
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2 py-5 h-auto rounded-full" onClick={handleShareWithProducer}>
                      <User size={18} />
                      <span className="text-base">Share with producer</span>
                    </Button>
                  </div>
                  
                  <div className="flex justify-between gap-3">
                    <Button variant="outline" className="flex-1 flex flex-col items-center justify-center gap-2 py-3 h-auto rounded-xl" onClick={handleDownload}>
                      <div className="h-14 w-14 flex items-center justify-center rounded-full border border-gray-200">
                        <Download size={20} />
                      </div>
                      <span className="text-sm">Download</span>
                    </Button>
                    
                    <Button variant="outline" className="flex-1 flex flex-col items-center justify-center gap-2 py-3 h-auto rounded-xl" onClick={handleARView}>
                      <div className="h-14 w-14 flex items-center justify-center rounded-full border border-gray-200">
                        <Smartphone size={20} />
                      </div>
                      <span className="text-sm">AR</span>
                    </Button>
                    
                    <Button variant="outline" className="flex-1 flex flex-col items-center justify-center gap-2 py-3 h-auto rounded-xl" onClick={handleSeeAll}>
                      <div className="h-14 w-14 flex items-center justify-center rounded-full border border-gray-200">
                        <MoreHorizontal size={20} />
                      </div>
                      <span className="text-sm">See all</span>
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden mt-2.5">
        <div className="flex h-full" style={{ marginLeft: '10px' }}>
          <IconSidebar />
        </div>
        
        {showComponentSidebar && <div className="w-80 transition-all duration-300 ease-in-out ml-2.5">
            <Sidebar onSelectComponent={handleComponentSelected} />
          </div>}

        {showPrefabSidebar && <div className="w-80 transition-all duration-300 ease-in-out ml-2.5">
            <PrefabSidebar onSelectPrefab={handlePrefabSelected} />
          </div>}

        {showSavedSidebar && <div className="w-80 transition-all duration-300 ease-in-out ml-2.5">
            <SavedSidebar onSelectDesign={handleDesignSelected} />
          </div>}

        <main className={`flex-1 flex flex-col relative rounded-2xl overflow-hidden ml-2.5 ${!showComponentSidebar && !showPrefabSidebar && !showSavedSidebar ? 'w-full' : ''}`}>
          <Viewport selectedComponent={selectedComponent} onComponentPlaced={handleComponentPlaced} />
          {children}
        </main>
      </div>
    </div>;
};
