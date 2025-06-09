
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/tasks':
        return 'All Tasks';
      case '/important':
        return 'Important Tasks';
      case '/today':
        return 'Today';
      case '/projects':
        return 'All Projects';
      default:
        if (location.pathname.startsWith('/projects/')) {
          return 'Project';
        }
        return 'Task Flow';
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold text-foreground">{getPageTitle()}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
