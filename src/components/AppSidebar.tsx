
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  CheckSquare, 
  Star, 
  FolderOpen, 
  Plus,
  Home,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "All Tasks", url: "/tasks", icon: CheckSquare },
  { title: "Important", url: "/important", icon: Star },
  { title: "Today", url: "/today", icon: Calendar },
];

const projectNavItems = [
  { title: "All Projects", url: "/projects", icon: FolderOpen },
];

export function AppSidebar() {
  const { user } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <div className="text-2xl">📝</div>
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">Task Flow</h1>
            <p className="text-sm text-sidebar-foreground/70">
              {user?.email?.split('@')[0]}
            </p>
          </div>
        </div>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projectNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) => 
                        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <div className="mt-2 px-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                asChild
              >
                <NavLink to="/projects/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </NavLink>
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button variant="ghost" size="sm" className="justify-start" asChild>
          <NavLink to="/settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </NavLink>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
