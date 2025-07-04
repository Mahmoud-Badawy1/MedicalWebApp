'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  User,
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  Video,
  MapPin,
  Phone,
  Eye,
  Edit,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ScheduleAppointment {
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

export default function AppointmentSchedulePage() {
  const { user, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
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

  // Mock schedule data
  const mockAppointments: ScheduleAppointment[] = [
    {
      id: 'apt_1',
      patientId: 'patient_1',
      patientName: 'John Doe',
      patientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      type: 'in-person',
      status: 'scheduled',
      startTime: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 9, 0),
      endTime: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 9, 30),
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
      startTime: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 10, 30),
      endTime: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 11, 15),
      duration: 45,
      reason: 'Follow-up consultation',
      isUrgent: false
    },
    {
      id: 'apt_3',
      patientId: 'patient_3',
      patientName: 'Robert Smith',
      patientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      type: 'in-person',
      status: 'in-progress',
      startTime: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 14, 0),
      endTime: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 14, 30),
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
      startTime: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 15, 30),
      endTime: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 16, 0),
      duration: 30,
      reason: 'Prescription review',
      isUrgent: false
    },
    {
      id: 'apt_5',
      patientId: 'patient_5',
      patientName: 'David Brown',
      type: 'in-person',
      status: 'completed',
      startTime: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 8, 0),
      endTime: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 8, 45),
      duration: 45,
      reason: 'Physical therapy consultation',
      roomNumber: 'Room 102',
      isUrgent: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'confirmed':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'completed':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'no-show':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
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

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    }
    setSelectedDate(newDate);
  };

  const filteredAppointments = mockAppointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || appointment.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = 8 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const getAppointmentForTimeSlot = (timeSlot: string) => {
    const [hour] = timeSlot.split(':').map(Number);
    return filteredAppointments.find(apt => {
      const aptHour = apt.startTime.getHours();
      return aptHour === hour;
    });
  };

  const AppointmentCard = ({ appointment }: { appointment: ScheduleAppointment }) => (
    <div className={`p-3 rounded-lg border-l-4 ${appointment.isUrgent ? 'border-l-red-500 bg-red-50' : 'border-l-blue-500 bg-white'} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <Avatar className="w-10 h-10">
            <AvatarImage src={appointment.patientAvatar} alt={appointment.patientName} />
            <AvatarFallback>
              {appointment.patientName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-medium text-gray-900 truncate">{appointment.patientName}</h4>
              {getTypeIcon(appointment.type)}
              <Badge className={getStatusColor(appointment.status)}>
                {appointment.status}
              </Badge>
              {appointment.isUrgent && (
                <Badge variant="destructive" className="text-xs">
                  URGENT
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-1">{appointment.reason}</p>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{appointment.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {appointment.endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              {appointment.roomNumber && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{appointment.roomNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-1 ml-2">
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const todayAppointments = filteredAppointments.filter(apt => 
    apt.startTime.toDateString() === selectedDate.toDateString()
  );

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
                Appointment Schedule
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your daily appointment schedule and patient consultations
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Calendar View
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Appointment
              </Button>
            </div>
          </div>

          {/* Date Navigation and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Date Navigation */}
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">
                      {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {todayAppointments.length} appointment{todayAppointments.length !== 1 ? 's' : ''} scheduled
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* Search and Filters */}
                <div className="flex-1 flex items-center space-x-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search patients or appointments..."
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
                      <option value="scheduled">Scheduled</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no-show">No Show</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Time Slots */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Daily Schedule</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={viewMode === 'day' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('day')}
                      >
                        Day
                      </Button>
                      <Button
                        variant={viewMode === 'week' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('week')}
                      >
                        Week
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {timeSlots.map((timeSlot) => {
                      const appointment = getAppointmentForTimeSlot(timeSlot);
                      return (
                        <div key={timeSlot} className="flex items-start space-x-4 py-2 border-b border-gray-100 last:border-b-0">
                          <div className="w-16 text-sm font-medium text-gray-500 pt-2">
                            {timeSlot}
                          </div>
                          <div className="flex-1 min-h-16">
                            {appointment ? (
                              <AppointmentCard appointment={appointment} />
                            ) : (
                              <div className="h-16 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:border-blue-300 hover:text-blue-500 cursor-pointer transition-colors">
                                <Plus className="w-4 h-4 mr-1" />
                                <span className="text-sm">Available</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Today's Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Today's Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{todayAppointments.length}</p>
                      <p className="text-xs text-gray-600">Total</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {todayAppointments.filter(a => a.status === 'completed').length}
                      </p>
                      <p className="text-xs text-gray-600">Completed</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">
                        {todayAppointments.filter(a => a.status === 'in-progress').length}
                      </p>
                      <p className="text-xs text-gray-600">In Progress</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">
                        {todayAppointments.filter(a => a.isUrgent).length}
                      </p>
                      <p className="text-xs text-gray-600">Urgent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Appointment
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Calendar
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <User className="w-4 h-4 mr-2" />
                    Patient List
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Clock className="w-4 h-4 mr-2" />
                    Time Slots
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Next Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {todayAppointments
                      .filter(apt => apt.startTime > new Date())
                      .slice(0, 3)
                      .map((appointment) => (
                        <div key={appointment.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={appointment.patientAvatar} alt={appointment.patientName} />
                            <AvatarFallback className="text-xs">
                              {appointment.patientName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {appointment.patientName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {appointment.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          {getTypeIcon(appointment.type)}
                        </div>
                      ))}
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