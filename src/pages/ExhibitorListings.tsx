import React, { useEffect } from 'react';
import { Header } from '@/components/Header/Header';
import ExhibitorCard from '@/components/exhibitors/ExhibitorCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { useExhibitors } from '@/contexts/ExhibitorContext';

export default function ExhibitorListings() {
  const {
    loading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    clearFilters,
    defaultThumbnailCount,
    page,
    setPage,
    pageSize,
    totalPages,
    currentExhibitors
  } = useExhibitors();

  // Categories for filtering
  const categories = [
    { id: 'electric', label: 'Electric' },
    { id: 'e-bike', label: 'E-Bike' },
    { id: 'components', label: 'Components' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'frames', label: 'Frames' },
    { id: 'bicycle', label: 'Bicycle' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto py-8 px-4 md:px-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Exhibitors</h1>
          <p className="text-gray-600">Browse and discover component manufacturers</p>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search exhibitors..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              >
                {category.label}
              </Button>
            ))}
            
            {(selectedCategory || searchTerm) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Status message */}
        {!loading && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <p className="text-green-800">
              Exhibitor Data Loaded
            </p>
            <p className="text-green-700 text-sm">
              Displaying {currentExhibitors.length} exhibitors. Note: {defaultThumbnailCount} exhibitors have the default thumbnail and are shown last.
            </p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* Exhibitor count */}
        {!loading && (
          <p className="text-gray-600 mb-4">
            Showing {currentExhibitors.length} of {totalPages * pageSize > 0 ? Math.min(totalPages * pageSize, currentExhibitors.length + ((page - 1) * pageSize)) : 0} exhibitors
            {selectedCategory ? ` in category "${selectedCategory}"` : ""}
          </p>
        )}

        {/* Exhibitor grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentExhibitors.map((exhibitor) => (
            <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show 5 page buttons centered around current page
              let pageNum = page;
              if (page < 3) {
                pageNum = i + 1;
              } else if (page > totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              if (pageNum > 0 && pageNum <= totalPages) {
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              }
              return null;
            })}
            
            <Button
              variant="outline"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 