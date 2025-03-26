
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SupplierProfile, SupplierData } from '@/components/supplier/SupplierProfile';
import { getSupplierData } from '@/utils/supplierData';
import { toast } from 'sonner';

const SupplierProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Get supplier data based on the ID from the URL
  const supplierData = getSupplierData(id || '');
  
  useEffect(() => {
    if (!id) {
      toast.error("Missing supplier ID");
      navigate('/');
    }
  }, [id, navigate]);
  
  if (!supplierData) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Supplier Not Found</h1>
          <p className="text-gray-600">The supplier you are looking for does not exist.</p>
        </div>
      </div>
    );
  }
  
  return <SupplierProfile supplierData={supplierData} />;
};

export default SupplierProfilePage;
