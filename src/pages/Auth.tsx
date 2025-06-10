
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate('/');
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signUp(email, password);
    
    if (error) {
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Check your email!",
        description: "We sent you a confirmation link.",
      });
    }
    
    setLoading(false);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ 
        backgroundColor: 'hsl(222.2 84% 4.9%)',
        color: 'hsl(210 40% 98%)'
      }}
    >
      <Card 
        className="w-full max-w-md border-border"
        style={{ 
          backgroundColor: 'hsl(222.2 84% 4.9%)',
          borderColor: 'hsl(215 27.9% 16.9%)'
        }}
      >
        <CardHeader className="text-center">
          <CardTitle 
            className="text-2xl font-bold"
            style={{ color: 'hsl(210 40% 98%)' }}
          >
            📝 Task Flow
          </CardTitle>
          <CardDescription style={{ color: 'hsl(217.9 10.6% 64.9%)' }}>
            Organize your projects and tasks with emoji-powered productivity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList 
              className="grid w-full grid-cols-2"
              style={{ 
                backgroundColor: 'hsl(215 27.9% 16.9%)',
                color: 'hsl(217.9 10.6% 64.9%)'
              }}
            >
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" style={{ color: 'hsl(210 40% 98%)' }}>
                    Email
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ 
                      backgroundColor: 'hsl(215 27.9% 16.9%)',
                      borderColor: 'hsl(215 27.9% 16.9%)',
                      color: 'hsl(210 40% 98%)'
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" style={{ color: 'hsl(210 40% 98%)' }}>
                    Password
                  </Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ 
                      backgroundColor: 'hsl(215 27.9% 16.9%)',
                      borderColor: 'hsl(215 27.9% 16.9%)',
                      color: 'hsl(210 40% 98%)'
                    }}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" style={{ color: 'hsl(210 40% 98%)' }}>
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ 
                      backgroundColor: 'hsl(215 27.9% 16.9%)',
                      borderColor: 'hsl(215 27.9% 16.9%)',
                      color: 'hsl(210 40% 98%)'
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" style={{ color: 'hsl(210 40% 98%)' }}>
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ 
                      backgroundColor: 'hsl(215 27.9% 16.9%)',
                      borderColor: 'hsl(215 27.9% 16.9%)',
                      color: 'hsl(210 40% 98%)'
                    }}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing up...' : 'Sign Up'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
