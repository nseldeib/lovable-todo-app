
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Auth from "./pages/Auth";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import AllTasks from "./pages/AllTasks";
import ImportantTasks from "./pages/ImportantTasks";
import Today from "./pages/Today";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, loading } = useAuth();
  
  console.log("TaskFlow - User authenticated:", !!user, "Loading:", loading);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // For TaskFlow - if no user is authenticated, always show the Auth page
  if (!user) {
    console.log("TaskFlow - Showing Auth page (no user authenticated)");
    return <Auth />;
  }
  
  // User is authenticated - show the main TaskFlow app
  console.log("TaskFlow - User authenticated, showing main app");
  return (
    <Routes>
      <Route path="/*" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<AllTasks />} />
        <Route path="important" element={<ImportantTasks />} />
        <Route path="today" element={<Today />} />
        <Route path="projects" element={<Projects />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  // Force TaskFlow dark theme
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.style.backgroundColor = 'hsl(222.2 84% 4.9%)';
    document.body.style.backgroundColor = 'hsl(222.2 84% 4.9%)';
    document.body.style.color = 'hsl(210 40% 98%)';
    console.log("TaskFlow - Dark theme applied");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background text-foreground" style={{ backgroundColor: 'hsl(222.2 84% 4.9%)', color: 'hsl(210 40% 98%)' }}>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
