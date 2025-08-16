import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from './ui/dropdown-menu';
import { 
  Home, 
  Sun, 
  Droplets, 
  Car, 
  Zap, 
  History, 
  Leaf, 
  IndianRupee,
  LogOut,
  User,
  Building,
  BookOpen,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../App';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('individual'); // 'individual' or 'organization'

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  // Mock organization data - in real app, this would come from API
  const userOrgs = [
    { id: 'org1', name: 'Green Tech Solutions', role: 'admin' },
    { id: 'org2', name: 'EcoWarriors Community', role: 'member' }
  ];

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/solar', label: 'Solar', icon: Sun },
    { path: '/water', label: 'Water', icon: Droplets },
    { path: '/transport', label: 'Transport', icon: Car },
    { path: '/electricity', label: 'Electricity', icon: Zap },
    { path: '/education', label: 'Education', icon: BookOpen },
    { path: '/history', label: 'History', icon: History },
  ];

  const orgNavItems = [
    { path: '/organization', label: 'Org Dashboard', icon: Building },
    { path: '/organization/members', label: 'Members', icon: User },
    { path: '/organization/challenges', label: 'Challenges', icon: Home },
    { path: '/education', label: 'Education', icon: BookOpen },
  ];

  const currentNavItems = currentView === 'organization' ? orgNavItems : navItems;

  const handleViewChange = (value) => {
    setCurrentView(value);
    if (value === 'organization') {
      navigate('/organization');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-green-600 rounded-full">
                <div className="relative">
                  <IndianRupee className="h-5 w-5 text-white" />
                  <Leaf className="h-3 w-3 text-green-200 absolute -top-1 -right-1" />
                </div>
              </div>
              <span className="text-xl font-bold text-green-800">GreenWallet</span>
            </Link>

            {/* View Switcher - Only show if user has orgs or is org admin */}
            {(user?.user_type === 'org_admin' || user?.user_type === 'both' || user?.organizations?.length > 0) && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">View:</span>
                <Select value={currentView} onValueChange={handleViewChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue>
                      <div className="flex items-center space-x-2">
                        {currentView === 'organization' ? (
                          <><Building className="h-4 w-4" /><span>Organization</span></>
                        ) : (
                          <><User className="h-4 w-4" /><span>Individual</span></>
                        )}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Individual</span>
                      </div>
                    </SelectItem>
                    {userOrgs.length > 0 && userOrgs.map(org => (
                      <SelectItem key={org.id} value="organization">
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4" />
                          <span>{org.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex space-x-1">
              {currentNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={isActive ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-green-100 text-green-700">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuItem>
                
                {user?.user_type && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-xs text-gray-500">
                      Account Type: {user.user_type.replace('_', ' ').toUpperCase()}
                    </DropdownMenuItem>
                  </>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex space-x-1 overflow-x-auto py-2">
              {currentNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={`flex-shrink-0 ${isActive ? "bg-green-600 hover:bg-green-700" : ""}`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;