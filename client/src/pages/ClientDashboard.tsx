import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  User, 
  Settings, 
  Crown, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube,
  Plus,
  Check,
  Shield,
  Play,
  AlertCircle,
  BarChart3,
  Calendar,
  FileText,
  Zap,
  CreditCard
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import SocialMediaConnect from '@/components/SocialMediaConnect';
import OAuthTutorial from '@/components/OAuthTutorial';

interface UserPlan {
  id: number;
  name: string;
  postsLimit: number;
  accountsLimit: number;
  features: string[];
}

interface SocialAccount {
  id: number;
  platform: string;
  accountName: string;
  isActive: boolean;
  createdAt: string;
}

interface DashboardStats {
  totalPosts: number;
  scheduledPosts: number;
  connectedAccounts: number;
  thisMonthPosts: number;
}

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [showTutorial, setShowTutorial] = useState(false);

  const { data: userPlan, isLoading: planLoading } = useQuery<UserPlan>({
    queryKey: ['/api/user/plan'],
    queryFn: async () => {
      const response = await apiRequest('/api/user/plan');
      return response.json();
    }
  });

  // Check if user needs to select a plan
  useEffect(() => {
    if (!planLoading && user && (!userPlan || !user.planId)) {
      // User doesn't have a plan selected, redirect to pricing
      setTimeout(() => {
        setLocation('/pricing');
      }, 2000);
    }
  }, [userPlan, user, planLoading, setLocation]);

  // Check for payment success
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      // Payment was successful, show success message
      alert('Payment successful! Welcome to your new plan.');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const { data: socialAccounts = [] } = useQuery<SocialAccount[]>({
    queryKey: ['/api/social-accounts'],
    queryFn: async () => {
      const response = await apiRequest('/api/social-accounts');
      return response.json();
    }
  });

  const { data: dashboardStats } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
    queryFn: async () => {
      const response = await apiRequest('/api/dashboard/stats');
      return response.json();
    }
  });

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-600' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-blue-400' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'bg-red-600' }
  ];

  const getConnectedPlatforms = () => {
    return socialAccounts.filter(account => account.isActive);
  };

  const getAccountUsage = () => {
    const connected = getConnectedPlatforms().length;
    const limit = userPlan?.accountsLimit || 1;
    return { connected, limit, percentage: (connected / limit) * 100 };
  };

  const canConnectMore = () => {
    const usage = getAccountUsage();
    return usage.connected < usage.limit;
  };

  // Show plan selection prompt if no plan
  if (!planLoading && (!userPlan || !user?.planId)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <CardTitle>Select Your Plan</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Welcome! To get started with your social media management, please select a subscription plan.
            </p>
            <Button 
              onClick={() => setLocation('/pricing')}
              className="w-full"
            >
              View Pricing Plans
            </Button>
            <p className="text-sm text-gray-500">
              Redirecting to pricing page...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">My Channel</h1>
                <p className="text-sm text-gray-500">Manage your social media presence</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {userPlan && (
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  <Crown className="w-3 h-3 mr-1" />
                  {userPlan.name} Plan
                </Badge>
              )}
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="accounts">My Accounts</TabsTrigger>
            <TabsTrigger value="posts">Content</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Plan Status */}
            {userPlan && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-blue-600" />
                    Your Plan: {userPlan.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{getAccountUsage().connected}</div>
                      <div className="text-sm text-gray-600">Connected Accounts</div>
                      <div className="text-xs text-gray-500">of {getAccountUsage().limit} allowed</div>
                      <Progress value={getAccountUsage().percentage} className="mt-2" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{dashboardStats?.thisMonthPosts || 0}</div>
                      <div className="text-sm text-gray-600">Posts This Month</div>
                      <div className="text-xs text-gray-500">of {userPlan.postsLimit} allowed</div>
                      <Progress value={((dashboardStats?.thisMonthPosts || 0) / userPlan.postsLimit) * 100} className="mt-2" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{dashboardStats?.scheduledPosts || 0}</div>
                      <div className="text-sm text-gray-600">Scheduled Posts</div>
                      <div className="text-xs text-gray-500">ready to publish</div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Plan Features</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {userPlan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-blue-800">
                          <Check className="w-4 h-4" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{dashboardStats?.totalPosts || 0}</div>
                      <div className="text-sm text-gray-600">Total Posts</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{dashboardStats?.scheduledPosts || 0}</div>
                      <div className="text-sm text-gray-600">Scheduled</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{getConnectedPlatforms().length}</div>
                      <div className="text-sm text-gray-600">Connected</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{dashboardStats?.thisMonthPosts || 0}</div>
                      <div className="text-sm text-gray-600">This Month</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Connected Accounts Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Connected Accounts</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowTutorial(true)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Learn How
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getConnectedPlatforms().length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {getConnectedPlatforms().map((account) => {
                      const platform = platforms.find(p => p.id === account.platform);
                      if (!platform) return null;
                      const Icon = platform.icon;
                      
                      return (
                        <div key={account.id} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${platform.color}`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{platform.name}</div>
                            <div className="text-sm text-gray-600">{account.accountName}</div>
                          </div>
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Accounts Connected</h3>
                    <p className="text-gray-600 mb-4">Connect your social media accounts to start posting content</p>
                    <Button onClick={() => document.querySelector('[data-tabs-trigger="accounts"]')?.click()}>
                      Connect Accounts
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accounts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Social Media Accounts</span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => setShowTutorial(true)}
                      className="flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Security Guide
                    </Button>
                  </div>
                </CardTitle>
                <div className="text-sm text-gray-600">
                  Connect up to {userPlan?.accountsLimit || 1} social media accounts with your {userPlan?.name || 'current'} plan
                </div>
              </CardHeader>
              <CardContent>
                {!canConnectMore() && (
                  <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-amber-900">Account Limit Reached</h4>
                        <p className="text-sm text-amber-800 mt-1">
                          You've connected {getAccountUsage().connected} of {getAccountUsage().limit} allowed accounts. 
                          Upgrade your plan to connect more platforms.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <SocialMediaConnect 
                  maxAccounts={userPlan?.accountsLimit}
                  showTutorialButton={true}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts" className="space-y-6">
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Management</h3>
                <p className="text-gray-600 mb-4">
                  Your content will be managed by our team. Connected accounts allow us to post directly to your platforms.
                </p>
                <p className="text-sm text-gray-500">
                  You'll receive notifications when posts are scheduled for your approval.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardContent className="p-8 text-center">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Coming Soon</h3>
                <p className="text-gray-600">
                  Track your social media performance, engagement rates, and audience growth.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Tutorial Modal */}
      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>OAuth Connection Tutorial</DialogTitle>
          </DialogHeader>
          <OAuthTutorial />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientDashboard;