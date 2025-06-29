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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Monitor,
  MessageSquare,
  Settings,
  Users,
  Calendar,
  Clock,
  Camera,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Share,
  FileText,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CallHistoryItem {
  id: string;
  participantName: string;
  date: Date;
  duration: number;
  type: 'video' | 'audio';
  status: 'completed' | 'missed' | 'cancelled';
}

export default function TelemedicinePage() {
  const { user, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  
  // Dialog states
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  
  // Form states
  const [scheduleForm, setScheduleForm] = useState({
    patientName: '',
    consultationType: 'video' as 'video' | 'audio',
    date: '',
    time: '',
    duration: '30',
    notes: ''
  });
  
  const [audioSettings, setAudioSettings] = useState({
    microphone: 'default',
    speakers: 'default',
    micVolume: 80,
    speakerVolume: 80,
    noiseCancellation: true,
    echoCancellation: true
  });
  
  const [videoSettings, setVideoSettings] = useState({
    camera: 'default',
    resolution: '720p',
    frameRate: '30fps',
    brightness: 50,
    contrast: 50
  });
  
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInCall) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInCall]);

  if (!isAuthenticated || !user) {
    return null;
  }

  // Mock call history data
  const callHistory: CallHistoryItem[] = [
    {
      id: '1',
      participantName: user.role === 'patient' ? 'Dr. Sarah Wilson' : 'John Doe',
      date: new Date(Date.now() - 86400000), // Yesterday
      duration: 1800, // 30 minutes
      type: 'video',
      status: 'completed'
    },
    {
      id: '2',
      participantName: user.role === 'patient' ? 'Dr. Michael Chen' : 'Emily Johnson',
      date: new Date(Date.now() - 259200000), // 3 days ago
      duration: 900, // 15 minutes
      type: 'video',
      status: 'completed'
    },
    {
      id: '3',
      participantName: user.role === 'patient' ? 'Dr. Lisa Brown' : 'Robert Smith',
      date: new Date(Date.now() - 432000000), // 5 days ago
      duration: 0,
      type: 'video',
      status: 'missed'
    }
  ];

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCallDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const handleStartCall = () => {
    setIsInCall(true);
    setCallDuration(0);
  };

  const handleEndCall = () => {
    setIsInCall(false);
    setCallDuration(0);
    setIsScreenSharing(false);
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  const handleScheduleConsultation = () => {
    setIsScheduleDialogOpen(true);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Scheduling consultation:', scheduleForm);
    alert('Consultation scheduled successfully! You will receive a confirmation email.');
    
    // Reset form and close dialog
    setScheduleForm({
      patientName: '',
      consultationType: 'video',
      date: '',
      time: '',
      duration: '30',
      notes: ''
    });
    setIsScheduleDialogOpen(false);
  };

  const handleAudioVideoSettings = () => {
    setIsSettingsDialogOpen(true);
  };

  const handleSettingsSave = () => {
    console.log('Saving audio settings:', audioSettings);
    console.log('Saving video settings:', videoSettings);
    alert('Settings saved successfully!');
    setIsSettingsDialogOpen(false);
  };

  const handleViewCallHistory = () => {
    setIsHistoryDialogOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'missed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'cancelled':
        return <X className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'missed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Mock upcoming consultations
  const upcomingConsultations = [
    {
      id: '1',
      patientName: 'John Doe',
      time: '2:00 PM',
      type: 'Follow-up',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '2',
      patientName: 'Emily Johnson',
      time: '3:30 PM',
      type: 'Consultation',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    }
  ];

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
                Telemedicine
              </h1>
              <p className="text-gray-600 mt-1">
                {user.role === 'patient' 
                  ? 'Connect with your healthcare providers remotely'
                  : 'Conduct virtual consultations with patients'
                }
              </p>
            </div>
            {!isInCall && (
              <Button onClick={handleStartCall} className="bg-green-600 hover:bg-green-700">
                <Video className="w-4 h-4 mr-2" />
                Start Video Call
              </Button>
            )}
          </div>

          {isInCall ? (
            /* Video Call Interface */
            <div className="space-y-6">
              {/* Call Status */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Badge className="bg-green-100 text-green-800">
                        <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></div>
                        Live Call
                      </Badge>
                      <span className="text-sm text-gray-600">
                        Duration: {formatDuration(callDuration)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">2 participants</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Video Interface */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Video Area */}
                <div className="lg:col-span-3">
                  <Card className="overflow-hidden">
                    <div className="relative bg-gray-900 aspect-video">
                      {/* Remote Video */}
                      <div className="w-full h-full flex items-center justify-center">
                        {isVideoEnabled ? (
                          <div className="text-center text-white">
                            <Avatar className="w-24 h-24 mx-auto mb-4">
                              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" />
                              <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <p className="text-lg font-medium">
                              {user.role === 'patient' ? 'Dr. Sarah Wilson' : 'John Doe'}
                            </p>
                            <p className="text-sm text-gray-300">
                              {user.role === 'patient' ? 'Cardiologist' : 'Patient'}
                            </p>
                          </div>
                        ) : (
                          <div className="text-center text-white">
                            <VideoOff className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <p className="text-lg">Video is disabled</p>
                          </div>
                        )}
                      </div>

                      {/* Local Video (Picture-in-Picture) */}
                      <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
                        <div className="w-full h-full flex items-center justify-center">
                          {isVideoEnabled ? (
                            <div className="text-center text-white">
                              <Avatar className="w-12 h-12 mx-auto mb-2">
                                <AvatarImage src={user.profile.avatar} />
                                <AvatarFallback>
                                  {user.profile.firstName[0]}{user.profile.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <p className="text-xs">You</p>
                            </div>
                          ) : (
                            <VideoOff className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Screen Share Indicator */}
                      {isScreenSharing && (
                        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                          <Monitor className="w-4 h-4 inline mr-1" />
                          Screen Sharing
                        </div>
                      )}

                      {/* Call Controls */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <div className="flex items-center space-x-4 bg-black bg-opacity-50 rounded-full px-6 py-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleAudio}
                            className={`rounded-full w-12 h-12 p-0 ${
                              isAudioEnabled 
                                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                                : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                          >
                            {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleVideo}
                            className={`rounded-full w-12 h-12 p-0 ${
                              isVideoEnabled 
                                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                                : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                          >
                            {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleScreenShare}
                            className={`rounded-full w-12 h-12 p-0 ${
                              isScreenSharing 
                                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                : 'bg-gray-700 hover:bg-gray-600 text-white'
                            }`}
                          >
                            <Monitor className="w-5 h-5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleEndCall}
                            className="rounded-full w-12 h-12 p-0 bg-red-600 hover:bg-red-700 text-white"
                          >
                            <PhoneOff className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Chat and Controls Sidebar */}
                <div className="space-y-6">
                  {/* Chat */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Chat
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3 h-64 overflow-y-auto">
                        <div className="text-xs text-gray-500 text-center">
                          Call started at {new Date().toLocaleTimeString()}
                        </div>
                        <div className="bg-blue-50 rounded-lg p-2">
                          <p className="text-sm">
                            <strong>Dr. Wilson:</strong> Hello! How are you feeling today?
                          </p>
                          <span className="text-xs text-gray-500">2 min ago</span>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2 ml-4">
                          <p className="text-sm">
                            <strong>You:</strong> Much better, thank you!
                          </p>
                          <span className="text-xs text-gray-500">1 min ago</span>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <input
                          type="text"
                          placeholder="Type a message..."
                          className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Button size="sm">Send</Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Share Document
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Follow-up
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleAudioVideoSettings}>
                        <Settings className="w-4 h-4 mr-2" />
                        Call Settings
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            /* Pre-call Interface */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Start */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Video className="w-5 h-5 text-blue-600" />
                      <span>Video Consultation</span>
                    </CardTitle>
                    <CardDescription>
                      Start a secure video call with your {user.role === 'patient' ? 'healthcare provider' : 'patient'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Camera Preview */}
                    <div className="relative bg-gray-900 rounded-lg aspect-video overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center text-white">
                          <Avatar className="w-24 h-24 mx-auto mb-4">
                            <AvatarImage src={user.profile.avatar} />
                            <AvatarFallback className="text-2xl">
                              {user.profile.firstName[0]}{user.profile.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-lg font-medium">
                            {user.profile.firstName} {user.profile.lastName}
                          </p>
                          <p className="text-sm text-gray-300">Camera Preview</p>
                        </div>
                      </div>
                      
                      {/* Preview Controls */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleAudio}
                            className={`rounded-full w-10 h-10 p-0 ${
                              isAudioEnabled 
                                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                                : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                          >
                            {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleVideo}
                            className={`rounded-full w-10 h-10 p-0 ${
                              isVideoEnabled 
                                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                                : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                          >
                            {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Start Call Button */}
                    <div className="text-center">
                      <Button onClick={handleStartCall} size="lg" className="bg-green-600 hover:bg-green-700">
                        <Video className="w-5 h-5 mr-2" />
                        Start Video Consultation
                      </Button>
                      <p className="text-sm text-gray-500 mt-2">
                        Make sure your camera and microphone are working properly
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Features */}
                <Card>
                  <CardHeader>
                    <CardTitle>Telemedicine Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Video className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">HD Video Calls</h4>
                          <p className="text-sm text-gray-600">Crystal clear video quality</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <MessageSquare className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Secure Chat</h4>
                          <p className="text-sm text-gray-600">HIPAA-compliant messaging</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Share className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Screen Sharing</h4>
                          <p className="text-sm text-gray-600">Share documents and images</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <FileText className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">File Sharing</h4>
                          <p className="text-sm text-gray-600">Exchange medical documents</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Upcoming Consultations */}
                {user.role === 'doctor' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Upcoming Consultations</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {upcomingConsultations.map((consultation) => (
                          <div key={consultation.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={consultation.avatar} />
                              <AvatarFallback>
                                {consultation.patientName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{consultation.patientName}</p>
                              <p className="text-xs text-gray-500">{consultation.time} • {consultation.type}</p>
                            </div>
                            <Button size="sm" variant="outline">
                              <Video className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={handleScheduleConsultation}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Consultation
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={handleAudioVideoSettings}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Audio/Video Settings
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={handleViewCallHistory}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Call History
                    </Button>
                  </CardContent>
                </Card>

                {/* System Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">System Status</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Camera className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Camera</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Ready</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Mic className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Microphone</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Ready</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Volume2 className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Speakers</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Ready</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Schedule Consultation Dialog */}
          <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Schedule Consultation</DialogTitle>
                <DialogDescription>
                  Schedule a new telemedicine consultation
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                {user.role === 'doctor' && (
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name</Label>
                    <Input
                      id="patientName"
                      value={scheduleForm.patientName}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, patientName: e.target.value }))}
                      placeholder="Enter patient name"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="consultationType">Consultation Type</Label>
                  <select
                    id="consultationType"
                    value={scheduleForm.consultationType}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, consultationType: e.target.value as any }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="video">Video Consultation</option>
                    <option value="audio">Audio Only</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={scheduleForm.date}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, date: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={scheduleForm.time}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, time: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <select
                    id="duration"
                    value={scheduleForm.duration}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <textarea
                    id="notes"
                    value={scheduleForm.notes}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes or special instructions..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button type="submit" className="flex-1">
                    Schedule Consultation
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsScheduleDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Audio/Video Settings Dialog */}
          <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Audio & Video Settings</DialogTitle>
                <DialogDescription>
                  Configure your audio and video preferences for telemedicine calls
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="audio" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="audio">Audio Settings</TabsTrigger>
                  <TabsTrigger value="video">Video Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="audio" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="microphone">Microphone</Label>
                      <select
                        id="microphone"
                        value={audioSettings.microphone}
                        onChange={(e) => setAudioSettings(prev => ({ ...prev, microphone: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="default">Default Microphone</option>
                        <option value="built-in">Built-in Microphone</option>
                        <option value="external">External Microphone</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="speakers">Speakers</Label>
                      <select
                        id="speakers"
                        value={audioSettings.speakers}
                        onChange={(e) => setAudioSettings(prev => ({ ...prev, speakers: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="default">Default Speakers</option>
                        <option value="built-in">Built-in Speakers</option>
                        <option value="headphones">Headphones</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="micVolume">Microphone Volume: {audioSettings.micVolume}%</Label>
                      <input
                        id="micVolume"
                        type="range"
                        min="0"
                        max="100"
                        value={audioSettings.micVolume}
                        onChange={(e) => setAudioSettings(prev => ({ ...prev, micVolume: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="speakerVolume">Speaker Volume: {audioSettings.speakerVolume}%</Label>
                      <input
                        id="speakerVolume"
                        type="range"
                        min="0"
                        max="100"
                        value={audioSettings.speakerVolume}
                        onChange={(e) => setAudioSettings(prev => ({ ...prev, speakerVolume: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="noiseCancellation">Noise Cancellation</Label>
                        <input
                          id="noiseCancellation"
                          type="checkbox"
                          checked={audioSettings.noiseCancellation}
                          onChange={(e) => setAudioSettings(prev => ({ ...prev, noiseCancellation: e.target.checked }))}
                          className="rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="echoCancellation">Echo Cancellation</Label>
                        <input
                          id="echoCancellation"
                          type="checkbox"
                          checked={audioSettings.echoCancellation}
                          onChange={(e) => setAudioSettings(prev => ({ ...prev, echoCancellation: e.target.checked }))}
                          className="rounded"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="video" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="camera">Camera</Label>
                      <select
                        id="camera"
                        value={videoSettings.camera}
                        onChange={(e) => setVideoSettings(prev => ({ ...prev, camera: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="default">Default Camera</option>
                        <option value="built-in">Built-in Camera</option>
                        <option value="external">External Camera</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resolution">Resolution</Label>
                      <select
                        id="resolution"
                        value={videoSettings.resolution}
                        onChange={(e) => setVideoSettings(prev => ({ ...prev, resolution: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="480p">480p</option>
                        <option value="720p">720p (HD)</option>
                        <option value="1080p">1080p (Full HD)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="frameRate">Frame Rate</Label>
                      <select
                        id="frameRate"
                        value={videoSettings.frameRate}
                        onChange={(e) => setVideoSettings(prev => ({ ...prev, frameRate: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="15fps">15 FPS</option>
                        <option value="30fps">30 FPS</option>
                        <option value="60fps">60 FPS</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="brightness">Brightness: {videoSettings.brightness}%</Label>
                      <input
                        id="brightness"
                        type="range"
                        min="0"
                        max="100"
                        value={videoSettings.brightness}
                        onChange={(e) => setVideoSettings(prev => ({ ...prev, brightness: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contrast">Contrast: {videoSettings.contrast}%</Label>
                      <input
                        id="contrast"
                        type="range"
                        min="0"
                        max="100"
                        value={videoSettings.contrast}
                        onChange={(e) => setVideoSettings(prev => ({ ...prev, contrast: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex space-x-3 pt-4 border-t">
                <Button onClick={handleSettingsSave} className="flex-1">
                  Save Settings
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsSettingsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Call History Dialog */}
          <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Call History</DialogTitle>
                <DialogDescription>
                  View your recent telemedicine consultation history
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {callHistory.map((call) => (
                  <div key={call.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {call.type === 'video' ? (
                          <Video className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Phone className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{call.participantName}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{call.date.toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{call.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {call.duration > 0 && (
                            <>
                              <span>•</span>
                              <span>{formatCallDuration(call.duration)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(call.status)}>
                        {getStatusIcon(call.status)}
                        <span className="ml-1">{call.status}</span>
                      </Badge>
                      {call.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          <FileText className="w-3 h-3 mr-1" />
                          Notes
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setIsHistoryDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}