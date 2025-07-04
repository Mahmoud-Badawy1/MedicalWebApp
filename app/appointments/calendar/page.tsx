'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  User,
  Plus,
  ChevronLeft,
  ChevronRight,
  Video,
  MapPin,
  Phone,
  Eye,
  Edit,
  ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CalendarAppointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  type: 'in-person' | 'video' | 'phone';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  startTime: Date;
  endTime: Date;
  duration: number;
  reason: string;
  notes?: string;
  roomNumber?: string;
  isUrgent: boolean;
}

export default function AppointmentCalendarPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const router = useRouter();

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

  // Mock appointments data
  const mockAppointments: CalendarAppointment[] = [
    {
      id: 'apt_1',
      patientId: 'patient_1',
      patientName: 'John Doe',
      patientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      type: 'in-person',
      status: 'scheduled',
      startTime: new Date(2024, 11, 15, 9, 0),
      endTime: new Date(2024, 11, 15, 9, 30),
      duration: 30,
      reason: 'Annual checkup',
      roomNumber: 'Room 205',
      isUrgent: false
    },
    {
      id: 'apt_2',
      patientId: 'patient_2',
      patientName: 'Emily Johnson',
      patientAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      type: 'video',
      status: 'confirmed',
      startTime: new Date(2024, 11, 16, 10, 30),
      endTime: new Date(2024, 11, 16, 11, 15),
      duration: 45,
      reason: 'Follow-up consultation',
      isUrgent: false
    },
    {
      id: 'apt_3',
      patientId: 'patient_3',
      patientName: 'Robert Smith',
      type: 'in-person',
      status: 'in-progress',
      startTime: new Date(2024, 11, 17, 14, 0),
      endTime: new Date(2024, 11, 17, 14, 30),
      duration: 30,
      reason: 'Urgent consultation',
      roomNumber: 'Room 301',
      isUrgent: true
    },
    {
      id: 'apt_4',
      patientId: 'patient_4',
      patientName: 'Maria Garcia',
      type: 'phone',
      status: 'scheduled',
      startTime: new Date(2024, 11, 18, 15, 30),
      endTime: new Date(2024, 11, 18, 16, 0),
      duration: 30,
      reason: 'Prescription review',
      isUrgent: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-3 h-3 text-green-600" />;
      case 'phone':
        return <Phone className="w-3 h-3 text-blue-600" />;
      default:
        return <MapPin className="w-3 h-3 text-purple-600" />;
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getAppointmentsForDate = (date: Date | null) => {
    if (!date) return [];
    return mockAppointments.filter(apt => 
      apt.startTime.toDateString() === date.toDateString()
    );
  };

  const handleViewAppointment = (appointmentId: string) => {
    console.log('Viewing appointment:', appointmentId);
    router.push(`/appointments/${appointmentId}`);
  };

  const handleEditAppointment = (appointmentId: string) => {
    console.log('Editing appointment:', appointmentId);
    router.push(`/appointments/${appointmentId}/edit`);
  };

  const handleNewAppointment = () => {
    router.push('/appointments/new');
  };

  const days = getDaysInMonth();
  const selectedDateAppointments = getAppointmentsForDate(selectedDate);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/appointments/schedule">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Schedule
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-inter font-bold text-gray-900">
                  Calendar View
                </h1>
                <p className="text-gray-600 mt-1">
                  Monthly overview of appointments and availability
                </p>
              </div>
            </div>
            <Button onClick={handleNewAppointment}>
              <Plus className="w-4 h-4 mr-2" />
              New Appointment
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">
                      {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                        Today
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day, index) => {
                      const dayAppointments = day ? getAppointmentsForDate(day) : [];
                      const isToday = day && day.toDateString() === new Date().toDateString();
                      const isSelected = day && selectedDate && day.toDateString() === selectedDate.toDateString();
                      
                      return (
                        <div
                          key={index}
                          className={`min-h-24 p-1 border border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors ${
                            isToday ? 'bg-blue-100 border-blue-300' : ''
                          } ${isSelected ? 'bg-blue-200 border-blue-400' : ''}`}
                          onClick={() => day && setSelectedDate(day)}
                        >
                          {day && (
                            <>
                              <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-700' : 'text-gray-900'}`}>
                                {day.getDate()}
                              </div>
                              <div className="space-y-1">
                                {dayAppointments.slice(0, 2).map(apt => (
                                  <div
                                    key={apt.id}
                                    className={`text-xs p-1 rounded truncate ${getStatusColor(apt.status)}`}
                                    title={`${apt.patientName} - ${apt.reason}`}
                                  >
                                    {apt.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} {apt.patientName}
                                  </div>
                                ))}
                                {dayAppointments.length > 2 && (
                                  <div className="text-xs text-gray-500 text-center">
                                    +{dayAppointments.length - 2} more
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Selected Date Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {selectedDate ? selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'Select a Date'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDate ? (
                    <div className="space-y-3">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{selectedDateAppointments.length}</p>
                        <p className="text-sm text-gray-600">Appointments</p>
                      </div>
                      
                      {selectedDateAppointments.length > 0 ? (
                        <div className="space-y-2">
                          {selectedDateAppointments.map(apt => (
                            <div key={apt.id} className="p-3 border rounded-lg hover:bg-gray-50">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={apt.patientAvatar} alt={apt.patientName} />
                                    <AvatarFallback className="text-xs">
                                      {apt.patientName.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium text-sm">{apt.patientName}</span>
                                </div>
                                {getTypeIcon(apt.type)}
                              </div>
                              
                              <p className="text-xs text-gray-600 mb-1">{apt.reason}</p>
                              <p className="text-xs text-gray-500">
                                {apt.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - 
                                {apt.endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              
                              <div className="flex space-x-1 mt-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 px-2"
                                  onClick={() => handleViewAppointment(apt.id)}
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 px-2"
                                  onClick={() => handleEditAppointment(apt.id)}
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">No appointments scheduled</p>
                          <Button size="sm" className="mt-2" onClick={handleNewAppointment}>
                            <Plus className="w-3 h-3 mr-1" />
                            Add Appointment
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">Click on a date to view appointments</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Appointments</span>
                      <span className="font-medium">{mockAppointments.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Completed</span>
                      <span className="font-medium text-green-600">
                        {mockAppointments.filter(a => a.status === 'completed').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Scheduled</span>
                      <span className="font-medium text-blue-600">
                        {mockAppointments.filter(a => a.status === 'scheduled').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Urgent</span>
                      <span className="font-medium text-red-600">
                        {mockAppointments.filter(a => a.isUrgent).length}
                      </span>
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