
import React from 'react';
import { Layout } from '@/components/Layout';
import { Sidebar } from '@/components/Sidebar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Components = () => {
  return (
    <Layout>
      <div className="flex-1 p-6">
        <Sidebar>
          <div className="mb-4">
            <Tabs defaultValue="marketplace" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                <TabsTrigger value="uploads">My Uploads</TabsTrigger>
              </TabsList>
              <TabsContent value="marketplace" className="mt-4">
                {/* Marketplace content */}
              </TabsContent>
              <TabsContent value="uploads" className="mt-4">
                {/* My Uploads content */}
              </TabsContent>
            </Tabs>
          </div>
        </Sidebar>
      </div>
    </Layout>
  );
};

export default Components;
