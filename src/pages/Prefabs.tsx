
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Prefabs = () => {
  return (
    <Layout>
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Prefabs Library</CardTitle>
            <CardDescription>
              Browse and select pre-made bike components for your design
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Choose a prefab from the sidebar to add it to your design. These pre-made components can be customized after placement.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Prefabs;
