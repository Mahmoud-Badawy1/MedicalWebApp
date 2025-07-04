'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  MapPin,
  Clock,
  User,
  Users,
  Bed,
  Activity
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DepartmentDetailClientProps {
  params: { departmentId: string };
}

interface Department {
  id: string;
  name: string;
  description: string;
  headOfDepartment: string;
  location: string;
  phone: string;
  email: string;
  operatingHours: string;
  status: 'active' | 'maintenance' | 'closed';
  totalBeds: number;
  occupiedBeds: number;
  totalStaff: number;
  activePatients: number;
}

export function DepartmentDetailClient({ params }: DepartmentDetailClientProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [department, setDepartment] = useState<Department | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/');
      return;
    }

    // Load department data
    const loadDepartment = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock department data based on departmentId
      const mockDepartment: Department = {
        id: params.departmentId,
        name: 'Emergency Department',
        description: 'Emergency medical care and trauma services providing 24/7 critical care to patients with urgent medical conditions.',
        headOfDepartment: 'Dr. Sarah Wilson',
        location: 'Ground Floor, Wing A',
        phone: '+1-555-0100',
        email: 'emergency@hospital.com',
        operatingHours: '24/7',
        status: 'active',
        totalBeds: 25,
        occupiedBeds: 18,
        totalStaff: 45,
        activePatients: 23
      };
      
      setDepartment(mockDepartment);
      setIsLoading(false);
    };

    loadDepartment();
  }, [isAuthenticated, user, router, params.departmentId]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'closed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="lg:ml-64">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          
          <main className="p-6">
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading department details...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="lg:ml-64">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          
          <main className="p-6">
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Department Not Found</h2>
                <p className="text-gray-600 mb-4">The requested department could not be found.</p>
                <Link href="/hospital/departments">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Departments
                  </Button>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/hospital/departments">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Departments
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-inter font-bold text-gray-900">
                  {department.name}
                </h1>
                <p className="text-gray-600 mt-1">
                  Department Details and Information
                </p>
              </div>
            </div>
            {user.role === 'admin' && (
              <Link href={`/hospital/departments/${department.id}/edit`}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Department
                </Button>
              </Link>
            )}
          </div>

          {/* Department Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Information */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="w-5 h-5 text-blue-600" />
                      <span>Department Information</span>
                    </CardTitle>
                    <Badge className={getStatusColor(department.status)}>
                      {department.status.charAt(0).toUpperCase() + department.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{department.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Head of Department</p>
                          <p className="font-medium text-gray-900">{department.headOfDepartment}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium text-gray-900">{department.location}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Operating Hours</p>
                          <p className="font-medium text-gray-900">{department.operatingHours}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium text-gray-900">{department.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium text-gray-900">{department.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Statistics */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Department Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bed className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Bed Occupancy</p>
                        <p className="font-semibold text-gray-900">
                          {department.occupiedBeds}/{department.totalBeds}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-600 font-medium">
                        {Math.round((department.occupiedBeds / department.totalBeds) * 100)}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Total Staff</p>
                        <p className="font-semibold text-gray-900">{department.totalStaff}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Activity className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-600">Active Patients</p>
                        <p className="font-semibold text-gray-900">{department.activePatients}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    View Staff
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Bed className="w-4 h-4 mr-2" />
                    Manage Beds
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="w-4 h-4 mr-2" />
                    View Patients
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}