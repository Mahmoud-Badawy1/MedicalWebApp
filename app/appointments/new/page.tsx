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
  Calendar, 
  Clock, 
  User,
  ArrowLeft,
  Save,
  X,
  Search,
  Video,
  Phone,
  MapPin
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AppointmentForm {
  patientId: string;
  patientName: string;
  type: 'in-person' | 'video' | 'phone';
  date: string;
  time: string;
  duration: number;
  reason: string;
  notes: string;
  roomNumber: string;
  isUrgent: boolean;
}

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export default function NewAppointmentPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState<AppointmentForm>({
    patientId: '',
    patientName: '',
    type: 'in-person',
    date: '',
    time: '',
    duration: 30,
    reason: '',
    notes: '',
    roomNumber: '',
    isUrgent: false
  });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/');
      return;
    }
    if (user.role !== 'doctor' && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || (user.role !== 'doctor' && user.role !== 'admin')) {
    return null;
  }

  // Mock patients data
  const mockPatients: Patient[] = [
    {
      id: 'patient_1',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1-555-0123',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 'patient_2',
      name: 'Emily Johnson',
      email: 'emily.johnson@email.com',
      phone: '+1-555-0124',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 'patient_3',
      name: 'Robert Smith',
      email: 'robert.smith@email.com',
      phone: '+1-555-0125',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 'patient_4',
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      phone: '+1-555-0126',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ];

  const handlePatientSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const results = mockPatients.filter(patient =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSelectPatient = (patient: Patient) => {
    setFormData(prev => ({
      ...prev,
      patientId: patient.id,
      patientName: patient.name
    }));
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleInputChange = (field: keyof AppointmentForm, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientId) {
      alert('Please select a patient');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Creating appointment:', formData);
      alert('Appointment scheduled successfully!');
      router.push('/appointments/schedule');
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Error scheduling appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-green-600" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-blue-600" />;
      default:
        return <MapPin className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-inter font-bold text-gray-900">
                  Schedule New Appointment
                </h1>
                <p className="text-gray-600 mt-1">
                  Create a new appointment for a patient
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Patient Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-blue-600" />
                      <span>Patient Selection</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!formData.patientId ? (
                      <div className="space-y-4">
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Search patient by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handlePatientSearch()}
                          />
                          <Button type="button" onClick={handlePatientSearch} disabled={isSearching}>
                            <Search className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {searchResults.length > 0 && (
                          <div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
                            {searchResults.map((patient) => (
                              <div
                                key={patient.id}
                                className="p-3 hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleSelectPatient(patient)}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">{patient.name}</p>
                                    <p className="text-sm text-gray-600">{patient.email}</p>
                                    <p className="text-sm text-gray-600">{patient.phone}</p>
                                  </div>
                                  <Button size="sm" variant="outline">
                                    Select
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium text-blue-900">{formData.patientName}</p>
                          <p className="text-sm text-blue-700">Selected Patient</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, patientId: '', patientName: '' }));
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Appointment Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <span>Appointment Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Appointment Type *</Label>
                        <select
                          id="type"
                          value={formData.type}
                          onChange={(e) => handleInputChange('type', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="in-person">In-Person</option>
                          <option value="video">Video Call</option>
                          <option value="phone">Phone Call</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration (minutes) *</Label>
                        <select
                          id="duration"
                          value={formData.duration}
                          onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value={15}>15 minutes</option>
                          <option value={30}>30 minutes</option>
                          <option value={45}>45 minutes</option>
                          <option value={60}>1 hour</option>
                          <option value={90}>1.5 hours</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="date">Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => handleInputChange('date', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="time">Time *</Label>
                        <Input
                          id="time"
                          type="time"
                          value={formData.time}
                          onChange={(e) => handleInputChange('time', e.target.value)}
                          required
                        />
                      </div>

                      {formData.type === 'in-person' && (
                        <div className="space-y-2">
                          <Label htmlFor="roomNumber">Room Number</Label>
                          <Input
                            id="roomNumber"
                            value={formData.roomNumber}
                            onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                            placeholder="e.g., Room 205"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.isUrgent}
                            onChange={(e) => handleInputChange('isUrgent', e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <span>Mark as Urgent</span>
                        </Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason for Visit *</Label>
                      <Input
                        id="reason"
                        value={formData.reason}
                        onChange={(e) => handleInputChange('reason', e.target.value)}
                        placeholder="e.g., Annual checkup, Follow-up consultation"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="Any additional information or special requirements..."
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.patientId}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Scheduling...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Schedule Appointment
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Appointment Type Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Appointment Types</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium">In-Person</p>
                      <p className="text-sm text-gray-600">Face-to-face consultation at the clinic</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Video className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Video Call</p>
                      <p className="text-sm text-gray-600">Remote consultation via video</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Phone Call</p>
                      <p className="text-sm text-gray-600">Voice-only consultation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Scheduling Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
                      <p>Allow buffer time between appointments for preparation</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <User className="w-4 h-4 text-green-600 mt-0.5" />
                      <p>Verify patient contact information before scheduling</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Calendar className="w-4 h-4 text-purple-600 mt-0.5" />
                      <p>Consider patient's preferred appointment times</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}