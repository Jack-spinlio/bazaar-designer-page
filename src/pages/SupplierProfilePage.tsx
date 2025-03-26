
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SupplierProfile, SupplierData } from '@/components/supplier/SupplierProfile';
import { getSupplierData } from '@/utils/supplierData';
import { toast } from 'sonner';

const SupplierProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Get supplier data based on the ID from the URL
  const supplierData = id ? getSupplierData(id) : undefined;
  
  useEffect(() => {
    if (!id) {
      toast.error("Missing supplier ID");
      navigate('/marketplace');
      return;
    }
    
    if (!supplierData) {
      toast.error(`Supplier with ID "${id}" not found`);
      console.error(`Supplier not found for ID: ${id}`);
    }
  }, [id, navigate, supplierData]);
  
  if (!supplierData) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Supplier Not Found</h1>
          <p className="text-gray-600">The supplier you are looking for does not exist.</p>
          <button 
            className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            onClick={() => navigate('/marketplace')}
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }
  
  return <SupplierProfile supplierData={supplierData} />;
};

export default SupplierProfilePage;
