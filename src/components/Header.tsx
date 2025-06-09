
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  onCreateTask?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCreateTask }) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">📝 Task Flow</h1>
            <span className="text-sm text-gray-500">
              Welcome, {user?.email}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {onCreateTask && (
              <Button onClick={onCreateTask} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
