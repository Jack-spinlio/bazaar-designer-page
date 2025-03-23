
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
  );
};
