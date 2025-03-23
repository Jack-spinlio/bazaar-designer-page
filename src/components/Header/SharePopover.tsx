
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Share, 
  SmilePlus, 
  User, 
  Link, 
  Download, 
  Smartphone, 
  MoreHorizontal,
  ChevronDown 
} from 'lucide-react';

export const SharePopover: React.FC = () => {
  const [linkAccess, setLinkAccess] = useState("Anyone with the link");
  const [viewPermission, setViewPermission] = useState("Can view");

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://bazaar.app/designs/current-design`);
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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="px-6 flex items-center gap-2 rounded-full bg-black text-white hover:bg-gray-800">
          <Share size={16} className="mr-1" />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[300px] p-4" side="bottom" sideOffset={5}>
        <div className="flex flex-col space-y-4">
          <h2 className="text-xl font-bold">Share this design</h2>
          
          <Button onClick={handlePublishToCommunity} className="w-full bg-black text-white rounded-full py-2 h-auto flex items-center justify-center gap-2">
            <SmilePlus size={18} />
            <span className="text-sm">Publish to Community</span>
          </Button>
          
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Create a link</h3>
            
            <div className="flex gap-2 mb-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1 justify-between py-1 h-9 rounded-full text-xs">
                    <span className="truncate">{linkAccess}</span>
                    <ChevronDown size={14} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[180px]" align="start">
                  <div className="space-y-1">
                    <Button variant="ghost" size="sm" className="w-full justify-start text-xs" onClick={() => setLinkAccess("Anyone with the link")}>
                      Anyone with the link
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-xs" onClick={() => setLinkAccess("Specific people")}>
                      Specific people
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1 justify-between py-1 h-9 rounded-full text-xs">
                    <span className="truncate">{viewPermission}</span>
                    <ChevronDown size={14} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[150px]" align="start" side="bottom">
                  <div className="space-y-1">
                    <Button variant="ghost" size="sm" className="w-full justify-start text-xs" onClick={() => setViewPermission("Can view")}>
                      Can view
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-xs" onClick={() => setViewPermission("Can edit")}>
                      Can edit
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <Button variant="outline" className="w-full flex items-center justify-center gap-2 py-1 h-9 rounded-full text-sm" onClick={handleCopyLink}>
              <Link size={16} />
              <span>Copy Link</span>
            </Button>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Ready for a sample?</h3>
            
            <Button variant="outline" className="w-full flex items-center justify-center gap-2 py-1 h-9 rounded-full text-sm" onClick={handleShareWithProducer}>
              <User size={16} />
              <span>Share with producer</span>
            </Button>
          </div>
          
          <div className="flex justify-between gap-2">
            <Button variant="outline" className="flex-1 flex flex-col items-center justify-center gap-1 py-2 h-auto rounded-xl" onClick={handleDownload}>
              <div className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-200">
                <Download size={14} />
              </div>
              <span className="text-xs">Download</span>
            </Button>
            
            <Button variant="outline" className="flex-1 flex flex-col items-center justify-center gap-1 py-2 h-auto rounded-xl" onClick={handleARView}>
              <div className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-200">
                <Smartphone size={14} />
              </div>
              <span className="text-xs">AR</span>
            </Button>
            
            <Button variant="outline" className="flex-1 flex flex-col items-center justify-center gap-1 py-2 h-auto rounded-xl" onClick={handleSeeAll}>
              <div className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-200">
                <MoreHorizontal size={14} />
              </div>
              <span className="text-xs">See all</span>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
