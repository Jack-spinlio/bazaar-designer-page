
import React from 'react';
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Stat card data
const statCards = [
  { 
    title: 'Revenue', 
    value: '$150,000', 
    change: 14.8, 
    trend: 'up', 
    period: 'from last month',
    sparkline: [
      { value: 11 },
      { value: 13 },
      { value: 9 },
      { value: 10 },
      { value: 8 },
      { value: 11 },
      { value: 14 },
    ]
  },
  { 
    title: 'Orders', 
    value: '75', 
    change: 2.5, 
    trend: 'down', 
    period: 'from last month',
    sparkline: [
      { value: 11 },
      { value: 13 },
      { value: 15 },
      { value: 14 },
      { value: 12 },
      { value: 11 },
      { value: 10 },
    ]
  },
  { 
    title: 'Draft Designs', 
    value: '17,058', 
    change: 93.3, 
    trend: 'up', 
    period: 'from last month',
    sparkline: [
      { value: 8 },
      { value: 10 },
      { value: 12 },
      { value: 10 },
      { value: 11 },
      { value: 12 },
      { value: 14 },
    ]
  }
];

// Top products data
const topProducts = [
  { id: '01', name: 'eGravel Bike', popularity: 92, sales: 48 },
  { id: '02', name: 'Electric Step-Thru', popularity: 87, sales: 17 },
  { id: '03', name: 'Urban eBike', popularity: 79, sales: 15 },
  { id: '04', name: 'Electric Road Bike', popularity: 75, sales: 12 },
  { id: '05', name: 'Step-Thru Frame', popularity: 68, sales: 8 },
];

// Design insights data
const designInsightsData = [
  { month: 'Jan', loyal: 300, new: 200, unique: 250 },
  { month: 'Feb', loyal: 280, new: 150, unique: 300 },
  { month: 'Mar', loyal: 250, new: 120, unique: 320 },
  { month: 'Apr', loyal: 220, new: 100, unique: 280 },
  { month: 'May', loyal: 200, new: 150, unique: 220 },
  { month: 'Jun', loyal: 230, new: 220, unique: 250 },
  { month: 'Jul', loyal: 250, new: 300, unique: 280 },
  { month: 'Aug', loyal: 220, new: 250, unique: 300 },
  { month: 'Sep', loyal: 190, new: 220, unique: 290 },
  { month: 'Oct', loyal: 170, new: 180, unique: 250 },
  { month: 'Nov', loyal: 150, new: 120, unique: 220 },
  { month: 'Dec', loyal: 120, new: 100, unique: 200 },
];

// Mini sparkline chart component
const SparklineChart = ({ data }: { data: { value: number }[] }) => {
  return (
    <ResponsiveContainer width="100%" height={50}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={data[data.length - 1].value > data[0].value ? "#4ade80" : "#ef4444"}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const SupplierHome = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col">
                <span className="text-lg font-medium text-gray-600">{stat.title}</span>
                <span className="text-4xl font-bold mt-2">{stat.value}</span>
                <div className="flex items-center mt-2">
                  <Badge 
                    variant={stat.trend === 'up' ? 'default' : 'destructive'} 
                    className={`rounded-full px-2 py-1 text-xs ${
                      stat.trend === 'up' ? 'bg-black' : 'bg-red-500'
                    }`}
                  >
                    {stat.trend === 'up' ? '↑' : '↓'} {stat.change}%
                  </Badge>
                  <span className="text-gray-500 text-sm ml-2">{stat.period}</span>
                </div>
              </div>
              <div className="mt-4 h-12">
                <SparklineChart data={stat.sparkline} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Products Table */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Top Products</h2>
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left font-medium text-gray-500 py-3 w-16">#</th>
                    <th className="text-left font-medium text-gray-500 py-3">Name</th>
                    <th className="text-left font-medium text-gray-500 py-3">Popularity</th>
                    <th className="text-right font-medium text-gray-500 py-3">Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100">
                      <td className="py-3 text-gray-500">{product.id}</td>
                      <td className="py-3 font-medium">{product.name}</td>
                      <td className="py-3">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="h-2.5 rounded-full"
                              style={{
                                width: `${product.popularity}%`,
                                background: `linear-gradient(to right, #60a5fa ${product.popularity - 20}%, #1e40af)`
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100">
                          {product.sales}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Sales by Country Map */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Sales by Country</h2>
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
              <img 
                src="/lovable-uploads/880fe1f2-8621-4b03-bde6-a3477e6570b5.png" 
                alt="Sales by Country"
                className="w-full h-full object-contain opacity-40"
              />
              {/* This is a placeholder. In a real implementation, you would use a proper map component */}
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500">World map showing sales distribution</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Design Insights Chart */}
      <Card className="bg-white shadow-sm mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Design Insights</h2>
          <div className="h-80">
            <ChartContainer
              config={{
                loyal: { label: "Loyal Customers", theme: { light: "#9333ea", dark: "#9333ea" } },
                new: { label: "New Customers", theme: { light: "#ef4444", dark: "#ef4444" } },
                unique: { label: "Unique Customers", theme: { light: "#4ade80", dark: "#4ade80" } },
              }}
              className="h-full"
            >
              <LineChart data={designInsightsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  domain={[0, 400]} 
                  ticks={[0, 100, 200, 300, 400]} 
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="loyal" 
                  stroke="#9333ea" 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 6, fill: "#9333ea" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="new" 
                  stroke="#ef4444" 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 6, fill: "#ef4444" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="unique" 
                  stroke="#4ade80" 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 6, fill: "#4ade80" }}
                />
              </LineChart>
            </ChartContainer>
          </div>
          <div className="flex justify-center mt-4 gap-8">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#9333ea] mr-2"></div>
              <span>Loyal Customers</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#ef4444] mr-2"></div>
              <span>New Customers</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#4ade80] mr-2"></div>
              <span>Unique Customers</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierHome;
