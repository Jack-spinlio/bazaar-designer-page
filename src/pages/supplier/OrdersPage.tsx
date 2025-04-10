import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PenSquare, Plus, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Order {
  id: string;
  status: 'PO Received' | 'Inproduction' | 'Shipped' | 'Rejected' | 'Awaiting feedback' | 'Draft';
  customerName: string;
  value: number;
}

const mockOrders: Order[] = [
  { id: '59217', status: 'PO Received', customerName: 'Vanmoof', value: 39411 },
  { id: '59213', status: 'Inproduction', customerName: 'Cowboy', value: 188417 },
  { id: '59219', status: 'Shipped', customerName: 'Urban Arrow', value: 8122 },
  { id: '59220', status: 'Inproduction', customerName: 'Tern', value: 74889 },
  { id: '59223', status: 'Rejected', customerName: 'Modmo', value: 32900 },
  { id: '592182', status: 'Inproduction', customerName: 'Giant', value: 26437 },
  { id: '592183', status: 'Awaiting feedback', customerName: 'Mongoose', value: 96287 },
  { id: '592184', status: 'Inproduction', customerName: 'Nukeproof', value: 16629 },
  { id: '592185', status: 'Draft', customerName: 'Vitus', value: 190592 },
];

const statusColorMap: Record<string, string> = {
  'PO Received': 'bg-blue-100 text-blue-800',
  'Inproduction': 'bg-yellow-100 text-yellow-800',
  'Shipped': 'bg-green-100 text-green-800',
  'Rejected': 'bg-red-100 text-red-800',
  'Awaiting feedback': 'bg-gray-100 text-gray-800',
  'Draft': 'bg-gray-100 text-gray-800',
};

const OrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      !searchTerm || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <div className="flex flex-col h-full bg-white">
      <ScrollArea className="h-[calc(100vh-130px)] pr-4">
        <div className="space-y-6 pt-12 px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Order</h1>
            <Button className="bg-black hover:bg-black/90 rounded-full">
              <Plus className="mr-2 h-4 w-4" />
              Create order
            </Button>
          </div>

          <div className="border-t border-gray-200 pt-10 mt-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative w-full sm:w-auto sm:flex-1">
                <div className="flex items-center mb-3 space-x-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Search</span>
                </div>
                <Input
                  placeholder="Search by order ID or customer name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 w-full border border-gray-300 rounded-md px-3 py-2 focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="w-full sm:w-56">
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-700">Status</span>
                </div>
                <Select onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-10 border border-gray-300">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="PO Received">PO Received</SelectItem>
                    <SelectItem value="Inproduction">In Production</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Awaiting feedback">Awaiting Feedback</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-hidden border rounded-md bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[150px] uppercase text-xs font-semibold text-gray-500">Order ID</TableHead>
                    <TableHead className="uppercase text-xs font-semibold text-gray-500">Status</TableHead>
                    <TableHead className="uppercase text-xs font-semibold text-gray-500">Customer Name</TableHead>
                    <TableHead className="uppercase text-xs font-semibold text-gray-500">Value</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <Badge className={`font-normal ${statusColorMap[order.status]} border-0`}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>${order.value.toLocaleString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <PenSquare className="h-5 w-5 text-gray-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
              <p className="text-sm text-gray-500">
                Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} results
              </p>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = idx + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = idx + 1;
                      if (idx === 4) return (
                        <PaginationItem key={idx}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + idx;
                      if (idx === 0) return (
                        <PaginationItem key={idx}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    } else {
                      if (idx === 0) return (
                        <PaginationItem key={idx}>
                          <PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
                        </PaginationItem>
                      );
                      if (idx === 1) return (
                        <PaginationItem key={idx}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                      if (idx === 3) return (
                        <PaginationItem key={idx}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                      if (idx === 4) return (
                        <PaginationItem key={idx}>
                          <PaginationLink onClick={() => setCurrentPage(totalPages)}>{totalPages}</PaginationLink>
                        </PaginationItem>
                      );
                      pageNumber = currentPage + idx - 2;
                    }
                    
                    return (
                      <PaginationItem key={idx}>
                        <PaginationLink 
                          onClick={() => setCurrentPage(pageNumber)}
                          isActive={currentPage === pageNumber}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default OrdersPage;
