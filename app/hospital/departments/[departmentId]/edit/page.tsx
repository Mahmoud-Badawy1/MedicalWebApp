'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Building, 
  ArrowLeft,
  Save,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DepartmentEditPageProps {
  params: { departmentId: string };
}

interface DepartmentForm {
  name: string;
  description: string;
  headOfDepartment: string;
  location: string;
  phone: string;
  email: string;
  operatingHours: string;
  status: 'active' | 'maintenance' | 'closed';
}

export async function generateStaticParams() {
  // Return the department IDs that should be pre-rendered
  return [
    { departmentId: 'dept_1' },
    { departmentId: 'dept_2' },
    { departmentId: 'dept_3' },
    { departmentId: 'dept_4' },
    { departmentId: 'dept_5' },
    { departmentId: 'dept_6' }
  ];
}

export default function DepartmentEditPage({ params }: DepartmentEditPageProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState<DepartmentForm>({
    name: '',
    description: '',
    headOfDepartment: '',
    location: '',
    phone: '',
    email: '',
    operatingHours: '',
    status: 'active'
  });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/');
      return;
    }
    if (user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    // Load department data
    const loadDepartment = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock department data based on departmentId
      const mockDepartment = {
        name: 'Emergency Department',
        description: 'Emergency medical care and trauma services',
        headOfDepartment: 'Dr. Sarah Wilson',
        location: 'Ground Floor, Wing A',
        phone: '+1-555-0100',
        email: 'emergency@hospital.com',
        operatingHours: '24/7',
        status: 'active' as const
      };
      
      setFormData(mockDepartment);
      setIsLoading(false);
    };

    loadDepartment();
  }, [isAuthenticated, user, router, params.departmentId]);

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return null;
  }

  const handleInputChange = (field: keyof DepartmentForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving department:', formData);
      alert('Department updated successfully!');
      router.push('/hospital/departments');
    } catch (error) {
      console.error('Error saving department:', error);
      alert('Error saving department. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/hospital/departments');
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
                  Edit Department
                </h1>
                <p className="text-gray-600 mt-1">
                  Update department information and settings
                </p>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <Card className="max-w-4xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-blue-600" />
                <span>Department Information</span>
              </CardTitle>
              <CardDescription>
                Update the department details below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Department Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Emergency Department"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="headOfDepartment">Head of Department *</Label>
                    <Input
                      id="headOfDepartment"
                      value={formData.headOfDepartment}
                      onChange={(e) => handleInputChange('headOfDepartment', e.target.value)}
                      placeholder="e.g., Dr. Sarah Wilson"
                      required
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Brief description of the department's services"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g., Ground Floor, Wing A"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="operatingHours">Operating Hours *</Label>
                    <Input
                      id="operatingHours"
                      value={formData.operatingHours}
                      onChange={(e) => handleInputChange('operatingHours', e.target.value)}
                      placeholder="e.g., 24/7 or 8:00 AM - 6:00 PM"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="e.g., +1-555-0100"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="e.g., emergency@hospital.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="active">Active</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}