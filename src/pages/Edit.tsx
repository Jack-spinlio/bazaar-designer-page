
import React from 'react';
import { Layout } from '@/components/Layout';
import EditToolbar from '@/components/EditToolbar';
import { Viewport } from '@/components/Viewport';

const Edit = () => {
  return (
    <Layout>
      <div className="flex h-full">
        <div className="w-[360px] p-2.5">
          <EditToolbar />
        </div>
        <div className="flex-1 p-2.5">
          <Viewport />
        </div>
      </div>
    </Layout>
  );
};

export default Edit;
