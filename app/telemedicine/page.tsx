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
  FileText
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TelemedicinePage() {
  const { user, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
                      <Button variant="outline" size="sm" className="w-full justify-start">
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
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Consultation
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Audio/Video Settings
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
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
        </main>
      </div>
    </div>
  );
}