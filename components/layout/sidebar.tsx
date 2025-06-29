'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Calendar, 
  Users, 
  FileText, 
  Pill, 
  CreditCard, 
  Settings,
  Home,
  Video,
  AlertTriangle,
  Phone,
  Activity,
  Building,
  UserCog,
  ChevronDown,
  ChevronRight,
  Stethoscope,
  Bed,
  Clipboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavItem[];
  roles: string[];
}

const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: ['patient', 'doctor', 'admin', 'pharmacy', 'accountant'],
  },
  {
    title: 'Appointments',
    href: '/appointments',
    icon: Calendar,
    roles: ['patient', 'doctor', 'admin'],
    children: [
      { title: 'My Appointments', href: '/appointments', icon: Calendar, roles: ['patient', 'doctor'] },
      { title: 'Schedule', href: '/appointments/schedule', icon: Calendar, roles: ['doctor', 'admin'] },
      { title: 'Calendar View', href: '/appointments/calendar', icon: Calendar, roles: ['doctor', 'admin'] },
    ],
  },
  {
    title: 'Patients',
    href: '/patients',
    icon: Users,
    roles: ['doctor', 'admin'],
    children: [
      { title: 'Patient List', href: '/patients', icon: Users, roles: ['doctor', 'admin'] },
      { title: 'Medical Records', href: '/patients/records', icon: FileText, roles: ['doctor', 'admin'] },
      { title: 'Patient Search', href: '/patients/search', icon: Users, roles: ['doctor', 'admin'] },
    ],
  },
  {
    title: 'Telemedicine',
    href: '/telemedicine',
    icon: Video,
    roles: ['patient', 'doctor'],
    children: [
      { title: 'Video Calls', href: '/telemedicine', icon: Video, roles: ['patient', 'doctor'] },
      { title: 'Consultations', href: '/telemedicine/consultations', icon: Stethoscope, roles: ['doctor'] },
    ],
  },
  {
    title: 'Prescriptions',
    href: '/prescriptions',
    icon: Pill,
    roles: ['patient', 'doctor', 'pharmacy'],
    children: [
      { title: 'My Prescriptions', href: '/prescriptions', icon: Pill, roles: ['patient'] },
      { title: 'E-Prescribe', href: '/prescriptions', icon: Pill, roles: ['doctor'] },
      { title: 'Pharmacy Queue', href: '/prescriptions/queue', icon: Pill, roles: ['pharmacy'] },
      { title: 'Inventory', href: '/prescriptions/inventory', icon: Pill, roles: ['pharmacy'] },
    ],
  },
  {
    title: 'Emergency',
    href: '/emergency',
    icon: AlertTriangle,
    roles: ['patient', 'doctor', 'admin'],
    badge: '!',
    children: [
      { title: 'SOS Alert', href: '/emergency', icon: Phone, roles: ['patient'] },
      { title: 'Emergency Center', href: '/emergency/center', icon: AlertTriangle, roles: ['doctor', 'admin'] },
      { title: 'Ambulance Tracking', href: '/emergency/ambulance', icon: Activity, roles: ['admin'] },
    ],
  },
  {
    title: 'Billing & Finance',
    href: '/billing',
    icon: CreditCard,
    roles: ['patient', 'accountant', 'admin'],
    children: [
      { title: 'My Bills', href: '/billing', icon: CreditCard, roles: ['patient'] },
      { title: 'Payments', href: '/billing/payments', icon: CreditCard, roles: ['patient', 'accountant'] },
      { title: 'Insurance Claims', href: '/billing/insurance', icon: FileText, roles: ['accountant', 'admin'] },
      { title: 'Financial Reports', href: '/billing/reports', icon: FileText, roles: ['accountant', 'admin'] },
    ],
  },
  {
    title: 'Hospital Management',
    href: '/hospital',
    icon: Building,
    roles: ['admin'],
    children: [
      { title: 'Departments', href: '/hospital/departments', icon: Building, roles: ['admin'] },
      { title: 'Bed Management', href: '/hospital/beds', icon: Bed, roles: ['admin'] },
      { title: 'Staff Management', href: '/hospital/staff', icon: UserCog, roles: ['admin'] },
      { title: 'Facilities', href: '/hospital/facilities', icon: Building, roles: ['admin'] },
    ],
  },
  {
    title: 'Reports & Analytics',
    href: '/reports',
    icon: Clipboard,
    roles: ['doctor', 'admin', 'accountant'],
    children: [
      { title: 'Clinical Reports', href: '/reports/clinical', icon: FileText, roles: ['doctor', 'admin'] },
      { title: 'Financial Reports', href: '/reports/financial', icon: CreditCard, roles: ['accountant', 'admin'] },
      { title: 'Operational Reports', href: '/reports/operational', icon: Activity, roles: ['admin'] },
    ],
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['patient', 'doctor', 'admin', 'pharmacy', 'accountant'],
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const userRole = user?.role || 'patient';
  const filteredNavItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isItemActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const NavItemComponent = ({ item, level = 0 }: { item: NavItem; level?: number }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.title);
    const isActive = isItemActive(item.href);
    
    // Filter children based on user role
    const filteredChildren = item.children?.filter(child => 
      child.roles.includes(userRole)
    ) || [];

    if (hasChildren && filteredChildren.length > 0) {
      return (
        <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(item.title)}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-between h-auto p-3 font-normal hover:bg-blue-50 hover:text-blue-700",
                level > 0 && "ml-4 w-auto",
                isActive && "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
              )}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.title}</span>
                {item.badge && (
                  <Badge variant="destructive" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </div>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            {filteredChildren.map((child) => (
              <NavItemComponent key={child.href} item={child} level={level + 1} />
            ))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Link href={item.href} onClick={onClose}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start h-auto p-3 font-normal hover:bg-blue-50 hover:text-blue-700",
            level > 0 && "ml-4 w-auto text-sm",
            isActive && "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
          )}
        >
          <div className="flex items-center space-x-3">
            <item.icon className="w-5 h-5" />
            <span className={cn("font-medium", level > 0 && "text-sm")}>{item.title}</span>
            {item.badge && (
              <Badge variant="destructive" className="text-xs">
                {item.badge}
              </Badge>
            )}
          </div>
        </Button>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-medical rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                  <div className="w-4 h-4 bg-primary rounded-full"></div>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-inter font-semibold text-gray-900">
                  MediCare
                </h2>
                <p className="text-xs text-gray-500">Hospital System</p>
              </div>
            </div>
          </div>

          {/* User info */}
          <div className="p-4 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.profile.firstName?.[0]}{user?.profile.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.profile.firstName} {user?.profile.lastName}
                </p>
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                  {user?.role?.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1">
            {filteredNavItems.map((item) => (
              <NavItemComponent key={item.href} item={item} />
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <p>© 2024 MediCare System</p>
              <p>Version 1.0.0</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}