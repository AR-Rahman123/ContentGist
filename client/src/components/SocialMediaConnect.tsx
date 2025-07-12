import React, { useState } from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Plus, Check, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface SocialAccount {
  id: number;
  platform: string;
  accountName: string;
  isActive: boolean;
  createdAt: string;
}

const SocialMediaConnect: React.FC = () => {
  const [connecting, setConnecting] = useState<string | null>(null);

  const { data: socialAccounts, isLoading } = useQuery<SocialAccount[]>({
    queryKey: ['/api/social-accounts'],
  });

  const connectMutation = useMutation({
    mutationFn: async (platform: string) => {
      // This will redirect to OAuth URL
      window.location.href = `/api/auth/connect/${platform}`;
    },
    onMutate: (platform) => {
      setConnecting(platform);
    },
    onError: () => {
      setConnecting(null);
    }
  });

  const disconnectMutation = useMutation({
    mutationFn: async (accountId: number) => {
      return await apiRequest(`/api/social-accounts/${accountId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/social-accounts'] });
    }
  });

  const platforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600',
      description: 'Connect your Facebook Page'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-pink-600',
      description: 'Connect your Instagram Business account'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-blue-400',
      description: 'Connect your Twitter account'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700',
      description: 'Connect your LinkedIn profile'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      color: 'bg-red-600',
      description: 'Connect your YouTube channel'
    }
  ];

  const getConnectedAccount = (platform: string) => {
    return socialAccounts?.find(account => account.platform === platform && account.isActive);
  };

  const handleConnect = (platform: string) => {
    // For demo purposes, we'll create a mock connection
    setConnecting(platform);
    
    // Simulate OAuth flow with a delay
    setTimeout(async () => {
      try {
        await apiRequest('/api/auth/callback/demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            platform: platform,
            accountName: `Demo ${platform.charAt(0).toUpperCase() + platform.slice(1)} Account`,
            success: true
          })
        });
        queryClient.invalidateQueries({ queryKey: ['/api/social-accounts'] });
        setConnecting(null);
      } catch (error) {
        console.error('Demo connection error:', error);
        setConnecting(null);
      }
    }, 2000);
  };

  const handleDisconnect = (accountId: number) => {
    disconnectMutation.mutate(accountId);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
                <div className="h-5 bg-gray-300 rounded w-20"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-8 bg-gray-300 rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Social Media Accounts</h2>
        <p className="text-gray-600">
          Connect your accounts so we can post content directly to your social media platforms
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((platform) => {
          const connectedAccount = getConnectedAccount(platform.id);
          const Icon = platform.icon;
          const isConnected = !!connectedAccount;
          const isConnecting = connecting === platform.id;

          return (
            <Card key={platform.id} className={`transition-all duration-300 hover:shadow-lg ${
              isConnected ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${platform.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-semibold">{platform.name}</span>
                  {isConnected && (
                    <Badge className="ml-auto bg-green-100 text-green-800 border-green-200">
                      <Check className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  {platform.description}
                </p>
                
                {isConnected ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <Check className="w-4 h-4" />
                      <span>Connected as {connectedAccount.accountName}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleDisconnect(connectedAccount.id)}
                      disabled={disconnectMutation.isPending}
                    >
                      {disconnectMutation.isPending ? 'Disconnecting...' : 'Disconnect'}
                    </Button>
                  </div>
                ) : (
                  <Button 
                    className={`w-full ${platform.color} hover:opacity-90`}
                    onClick={() => handleConnect(platform.id)}
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Connect {platform.name}
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {socialAccounts && socialAccounts.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900">Connected Successfully!</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Your social media accounts are now connected. Our team can now create and schedule posts 
                  directly to your platforms. You'll receive notifications when posts are scheduled for your approval.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2">What happens next?</h4>
            <div className="space-y-2 text-sm text-green-700">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>We can now post content automatically to your connected accounts</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Our scheduler will check for connected accounts before posting</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Posts will show "Posted" status when published successfully</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>Posts will require manual posting if accounts aren't connected</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-900">Demo Mode Active</h4>
                <p className="text-sm text-amber-700 mt-1">
                  These are demo connections for testing. To enable real social media posting, 
                  you'll need to configure OAuth apps with each platform and provide API credentials.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaConnect;