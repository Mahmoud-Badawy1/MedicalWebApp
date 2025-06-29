'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Download,
  Filter,
  Activity,
  Clock,
  Bed,
  Building,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OperationalReportsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 2592000000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0]
  });
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/');
      return;
    }
    if (user.role !== 'admin' && user.role !== 'doctor') {
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || (user.role !== 'admin' && user.role !== 'doctor')) {
    return null;
  }

  // Mock operational data
  const operationalMetrics = {
    totalPatients: 1429,
    totalAppointments: 247,
    bedOccupancyRate: 78.5,
    averageWaitTime: 12,
    staffUtilization: 85.2,
    emergencyResponseTime: 6.2,
    patientSatisfaction: 94.2,
    systemUptime: 99.8
  };

  const departmentMetrics = [
    { name: 'Emergency', patients: 156, utilization: 92, satisfaction: 89 },
    { name: 'Cardiology', patients: 89, utilization: 78, satisfaction: 96 },
    { name: 'Surgery', patients: 67, utilization: 85, satisfaction: 98 },
    { name: 'Radiology', patients: 134, utilization: 71, satisfaction: 91 },
    { name: 'Pediatrics', patients: 78, utilization: 68, satisfaction: 97 }
  ];

  const handleExportReport = (reportType: string) => {
    console.log(`Exporting ${reportType} report...`);
    alert(`${reportType} report export would be implemented here`);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

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
                Operational Reports & Analytics
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor hospital operations and performance metrics
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export All Reports
              </Button>
              <Button>
                <BarChart3 className="w-4 h-4 mr-2" />
                Generate Custom Report
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-end">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>
                <Button>
                  <Filter className="w-4 h-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Patients</p>
                    <p className="text-2xl font-bold text-blue-600">{operationalMetrics.totalPatients}</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">+8.2%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Bed Occupancy</p>
                    <p className="text-2xl font-bold text-green-600">{formatPercentage(operationalMetrics.bedOccupancyRate)}</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">+3.1%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Bed className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Wait Time</p>
                    <p className="text-2xl font-bold text-orange-600">{operationalMetrics.averageWaitTime} min</p>
                    <div className="flex items-center mt-1">
                      <TrendingDown className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">-8.5%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">System Uptime</p>
                    <p className="text-2xl font-bold text-purple-600">{formatPercentage(operationalMetrics.systemUptime)}</p>
                    <div className="flex items-center mt-1">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">Excellent</span>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Activity className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reports Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="departments">Departments</TabsTrigger>
              <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
              <TabsTrigger value="quality">Quality</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Patient Flow Overview</span>
                      <Button variant="outline" size="sm" onClick={() => handleExportReport('Patient Flow')}>
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Admissions</span>
                        <span className="font-semibold">156</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Discharges</span>
                        <span className="font-semibold">142</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Emergency Visits</span>
                        <span className="font-semibold">89</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Outpatient Visits</span>
                        <span className="font-semibold">234</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Resource Utilization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Staff Utilization</span>
                          <span>{formatPercentage(operationalMetrics.staffUtilization)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${operationalMetrics.staffUtilization}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Bed Occupancy</span>
                          <span>{formatPercentage(operationalMetrics.bedOccupancyRate)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${operationalMetrics.bedOccupancyRate}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Equipment Usage</span>
                          <span>72.3%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: '72.3%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="departments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Department Performance</span>
                    <Button variant="outline" size="sm" onClick={() => handleExportReport('Department Performance')}>
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departmentMetrics.map((dept) => (
                      <div key={dept.name} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium">{dept.name}</h3>
                          <Badge variant="outline">{dept.patients} patients</Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-600">Utilization</span>
                              <span>{formatPercentage(dept.utilization)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-blue-600 h-1.5 rounded-full" 
                                style={{ width: `${dept.utilization}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-600">Satisfaction</span>
                              <span>{formatPercentage(dept.satisfaction)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-green-600 h-1.5 rounded-full" 
                                style={{ width: `${dept.satisfaction}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="efficiency" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Operational Efficiency Metrics</span>
                    <Button variant="outline" size="sm" onClick={() => handleExportReport('Efficiency Metrics')}>
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Response Times</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Emergency Response</span>
                          <span className="font-semibold">{operationalMetrics.emergencyResponseTime} min</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Average Wait Time</span>
                          <span className="font-semibold">{operationalMetrics.averageWaitTime} min</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Lab Results</span>
                          <span className="font-semibold">45 min</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Discharge Processing</span>
                          <span className="font-semibold">2.3 hours</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Productivity Metrics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Patients per Hour</span>
                          <span className="font-semibold">4.2</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Bed Turnover Rate</span>
                          <span className="font-semibold">1.8 days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Staff Productivity</span>
                          <span className="font-semibold">{formatPercentage(operationalMetrics.staffUtilization)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Equipment Uptime</span>
                          <span className="font-semibold">98.7%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quality" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Quality & Safety Metrics</span>
                    <Button variant="outline" size="sm" onClick={() => handleExportReport('Quality Metrics')}>
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Patient Safety</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Medication Errors</span>
                          <span className="font-semibold text-green-600">0.02%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Hospital Infections</span>
                          <span className="font-semibold text-green-600">0.8%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Patient Falls</span>
                          <span className="font-semibold text-green-600">0.1%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Readmission Rate</span>
                          <span className="font-semibold text-yellow-600">8.5%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Patient Experience</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Overall Satisfaction</span>
                          <span className="font-semibold text-green-600">{formatPercentage(operationalMetrics.patientSatisfaction)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Communication Rating</span>
                          <span className="font-semibold text-green-600">4.6/5</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Cleanliness Rating</span>
                          <span className="font-semibold text-green-600">4.8/5</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Would Recommend</span>
                          <span className="font-semibold text-green-600">91%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}