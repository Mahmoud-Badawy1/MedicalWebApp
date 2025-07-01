'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Search, 
  Filter,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingDown,
  TrendingUp,
  Calendar,
  Pill,
  Eye,
  Edit,
  RefreshCw
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface InventoryItem {
  id: string;
  medicationId: string;
  name: string;
  genericName: string;
  strength: string;
  form: string;
  manufacturer: string;
  ndcNumber: string;
  lotNumber: string;
  quantity: number;
  unitCost: number;
  totalValue: number;
  reorderLevel: number;
  maxLevel: number;
  expirationDate: Date;
  receivedDate: Date;
  supplier: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired' | 'recalled';
  isControlledSubstance: boolean;
  scheduleClass?: string;
  location: string;
  lastUpdated: Date;
}

export default function PharmacyInventoryPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/');
      return;
    }
    if (user.role !== 'pharmacy') {
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || user.role !== 'pharmacy') {
    return null;
  }

  // Mock inventory data
  const mockInventory: InventoryItem[] = [
    {
      id: 'inv_1',
      medicationId: 'med_1',
      name: 'Amoxicillin',
      genericName: 'Amoxicillin',
      strength: '500mg',
      form: 'Capsule',
      manufacturer: 'Teva Pharmaceuticals',
      ndcNumber: '0093-4155-73',
      lotNumber: 'AMX2024001',
      quantity: 250,
      unitCost: 0.85,
      totalValue: 212.50,
      reorderLevel: 100,
      maxLevel: 500,
      expirationDate: new Date('2025-08-15'),
      receivedDate: new Date('2024-02-01'),
      supplier: 'McKesson Corporation',
      status: 'in-stock',
      isControlledSubstance: false,
      location: 'A-1-15',
      lastUpdated: new Date()
    },
    {
      id: 'inv_2',
      medicationId: 'med_2',
      name: 'Lisinopril',
      genericName: 'Lisinopril',
      strength: '10mg',
      form: 'Tablet',
      manufacturer: 'Lupin Pharmaceuticals',
      ndcNumber: '68180-0512-06',
      lotNumber: 'LIS2024002',
      quantity: 45,
      unitCost: 0.12,
      totalValue: 5.40,
      reorderLevel: 50,
      maxLevel: 300,
      expirationDate: new Date('2025-12-31'),
      receivedDate: new Date('2024-01-15'),
      supplier: 'Cardinal Health',
      status: 'low-stock',
      isControlledSubstance: false,
      location: 'B-2-08',
      lastUpdated: new Date()
    },
    {
      id: 'inv_3',
      medicationId: 'med_3',
      name: 'Oxycodone',
      genericName: 'Oxycodone HCl',
      strength: '5mg',
      form: 'Tablet',
      manufacturer: 'Mallinckrodt Pharmaceuticals',
      ndcNumber: '0406-0512-01',
      lotNumber: 'OXY2024003',
      quantity: 0,
      unitCost: 2.45,
      totalValue: 0.00,
      reorderLevel: 25,
      maxLevel: 100,
      expirationDate: new Date('2025-06-30'),
      receivedDate: new Date('2024-01-10'),
      supplier: 'AmerisourceBergen',
      status: 'out-of-stock',
      isControlledSubstance: true,
      scheduleClass: 'Schedule II',
      location: 'VAULT-A-01',
      lastUpdated: new Date()
    },
    {
      id: 'inv_4',
      medicationId: 'med_4',
      name: 'Metformin',
      genericName: 'Metformin HCl',
      strength: '500mg',
      form: 'Tablet',
      manufacturer: 'Aurobindo Pharma',
      ndcNumber: '65862-0159-90',
      lotNumber: 'MET2024004',
      quantity: 180,
      unitCost: 0.08,
      totalValue: 14.40,
      reorderLevel: 75,
      maxLevel: 400,
      expirationDate: new Date('2025-03-20'),
      receivedDate: new Date('2024-01-20'),
      supplier: 'McKesson Corporation',
      status: 'in-stock',
      isControlledSubstance: false,
      location: 'C-1-22',
      lastUpdated: new Date()
    },
    {
      id: 'inv_5',
      medicationId: 'med_5',
      name: 'Atorvastatin',
      genericName: 'Atorvastatin Calcium',
      strength: '20mg',
      form: 'Tablet',
      manufacturer: 'Ranbaxy Laboratories',
      ndcNumber: '63304-0822-30',
      lotNumber: 'ATO2023012',
      quantity: 25,
      unitCost: 0.15,
      totalValue: 3.75,
      reorderLevel: 60,
      maxLevel: 250,
      expirationDate: new Date('2024-12-15'),
      receivedDate: new Date('2023-11-01'),
      supplier: 'Cardinal Health',
      status: 'expired',
      isControlledSubstance: false,
      location: 'D-3-05',
      lastUpdated: new Date()
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'expired':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
      case 'recalled':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-stock':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'low-stock':
        return <TrendingDown className="w-4 h-4 text-yellow-600" />;
      case 'out-of-stock':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'expired':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'recalled':
        return <AlertTriangle className="w-4 h-4 text-purple-600" />;
      default:
        return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStockLevel = (item: InventoryItem) => {
    const percentage = (item.quantity / item.maxLevel) * 100;
    if (percentage <= 0) return 'empty';
    if (percentage <= 20) return 'critical';
    if (percentage <= 40) return 'low';
    if (percentage <= 70) return 'medium';
    return 'high';
  };

  const getStockLevelColor = (level: string) => {
    switch (level) {
      case 'empty':
        return 'bg-red-500';
      case 'critical':
        return 'bg-red-400';
      case 'low':
        return 'bg-yellow-400';
      case 'medium':
        return 'bg-blue-400';
      case 'high':
        return 'bg-green-400';
      default:
        return 'bg-gray-400';
    }
  };

  const isExpiringSoon = (expirationDate: Date) => {
    const today = new Date();
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(today.getMonth() + 6);
    return expirationDate <= sixMonthsFromNow;
  };

  const handleReorder = (itemId: string) => {
    console.log('Reordering item:', itemId);
    alert('Reorder request submitted successfully!');
  };

  const handleAdjustStock = (itemId: string) => {
    console.log('Adjusting stock for item:', itemId);
    alert('Stock adjustment form would open here');
  };

  const handleViewDetails = (item: InventoryItem) => {
    console.log('Viewing details for:', item.name);
    alert('Item details modal would open here');
  };

  const filteredInventory = mockInventory.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ndcNumber.includes(searchQuery) ||
      item.lotNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'controlled' && item.isControlledSubstance) ||
      (selectedCategory === 'non-controlled' && !item.isControlledSubstance) ||
      (selectedCategory === 'expiring' && isExpiringSoon(item.expirationDate));
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const inStockItems = filteredInventory.filter(item => item.status === 'in-stock');
  const lowStockItems = filteredInventory.filter(item => item.status === 'low-stock' || item.status === 'out-of-stock');
  const expiredItems = filteredInventory.filter(item => item.status === 'expired');

  const InventoryCard = ({ item }: { item: InventoryItem }) => {
    const stockLevel = getStockLevel(item);
    const stockPercentage = (item.quantity / item.maxLevel) * 100;

    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Pill className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">
                  {item.name} {item.strength}
                </h3>
                <Badge className={getStatusColor(item.status)}>
                  {getStatusIcon(item.status)}
                  <span className="ml-1">{item.status.replace('-', ' ').toUpperCase()}</span>
                </Badge>
                {item.isControlledSubstance && (
                  <Badge variant="destructive" className="text-xs">
                    {item.scheduleClass}
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                {item.genericName} • {item.form} • {item.manufacturer}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 mb-4">
                <div><strong>NDC:</strong> {item.ndcNumber}</div>
                <div><strong>Lot:</strong> {item.lotNumber}</div>
                <div><strong>Location:</strong> {item.location}</div>
                <div><strong>Supplier:</strong> {item.supplier}</div>
                <div><strong>Unit Cost:</strong> ${item.unitCost.toFixed(2)}</div>
                <div><strong>Total Value:</strong> ${item.totalValue.toFixed(2)}</div>
                <div><strong>Expires:</strong> {item.expirationDate.toLocaleDateString()}</div>
                <div><strong>Reorder Level:</strong> {item.reorderLevel}</div>
              </div>

              {/* Stock Level Indicator */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Stock Level</span>
                  <span>{item.quantity} / {item.maxLevel}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getStockLevelColor(stockLevel)}`}
                    style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Alerts */}
              {item.quantity <= item.reorderLevel && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-2">
                  <p className="text-yellow-800 text-xs">
                    <AlertTriangle className="w-3 h-3 inline mr-1" />
                    Stock below reorder level
                  </p>
                </div>
              )}
              
              {isExpiringSoon(item.expirationDate) && (
                <div className="bg-orange-50 border border-orange-200 rounded p-2 mb-2">
                  <p className="text-orange-800 text-xs">
                    <Clock className="w-3 h-3 inline mr-1" />
                    Expires within 6 months
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex flex-col space-y-2 ml-4">
              {(item.status === 'low-stock' || item.status === 'out-of-stock') && (
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleReorder(item.id)}
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Reorder
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleViewDetails(item)}
              >
                <Eye className="w-4 h-4 mr-1" />
                Details
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleAdjustStock(item.id)}
              >
                <Edit className="w-4 h-4 mr-1" />
                Adjust
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const totalValue = mockInventory.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockCount = mockInventory.filter(item => item.quantity <= item.reorderLevel).length;
  const expiredCount = mockInventory.filter(item => item.status === 'expired').length;
  const controlledCount = mockInventory.filter(item => item.isControlledSubstance).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-inter font-bold text-gray-900">
                Pharmacy Inventory
              </h1>
              <p className="text-gray-600 mt-1">
                Manage medication stock levels and inventory tracking
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Package className="w-4 h-4 mr-2" />
                Receive Shipment
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Medication
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Items</p>
                    <p className="text-2xl font-bold text-gray-900">{mockInventory.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold text-green-600">${totalValue.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Low Stock</p>
                    <p className="text-2xl font-bold text-yellow-600">{lowStockCount}</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <TrendingDown className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Controlled</p>
                    <p className="text-2xl font-bold text-red-600">{controlledCount}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by medication name, NDC, or lot number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="in-stock">In Stock</option>
                    <option value="low-stock">Low Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                    <option value="expired">Expired</option>
                    <option value="recalled">Recalled</option>
                  </select>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="controlled">Controlled Substances</option>
                    <option value="non-controlled">Non-Controlled</option>
                    <option value="expiring">Expiring Soon</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Tabs */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl">
              <TabsTrigger value="all">All Items ({filteredInventory.length})</TabsTrigger>
              <TabsTrigger value="in-stock">In Stock ({inStockItems.length})</TabsTrigger>
              <TabsTrigger value="low-stock">Low Stock ({lowStockItems.length})</TabsTrigger>
              <TabsTrigger value="expired">Expired ({expiredItems.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => (
                  <InventoryCard key={item.id} item={item} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No inventory items found
                    </h3>
                    <p className="text-gray-600">
                      No items match your current search criteria.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="in-stock" className="space-y-4">
              {inStockItems.length > 0 ? (
                inStockItems.map((item) => (
                  <InventoryCard key={item.id} item={item} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No items in stock
                    </h3>
                    <p className="text-gray-600">
                      All items are either low stock or out of stock.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="low-stock" className="space-y-4">
              {lowStockItems.length > 0 ? (
                lowStockItems.map((item) => (
                  <InventoryCard key={item.id} item={item} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No low stock items
                    </h3>
                    <p className="text-gray-600">
                      All items are adequately stocked.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="expired" className="space-y-4">
              {expiredItems.length > 0 ? (
                expiredItems.map((item) => (
                  <InventoryCard key={item.id} item={item} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No expired items
                    </h3>
                    <p className="text-gray-600">
                      All medications are within their expiration dates.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}