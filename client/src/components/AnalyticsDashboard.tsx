import React from 'react';
import { BarChart3, TrendingUp, Users, Eye, Heart, MessageSquare, Share2, MousePointer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';

interface Analytics {
  id: number;
  platform: string;
  followers: number;
  engagement: number;
  reach: number;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  date: string;
}

const AnalyticsDashboard: React.FC = () => {
  const { data: analytics, isLoading } = useQuery<Analytics[]>({
    queryKey: ['/api/analytics'],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-48 mx-auto animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-300 rounded w-20"></div>
                  <div className="w-6 h-6 bg-gray-300 rounded"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-300 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics || analytics.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analytics Data Yet</h3>
        <p className="text-gray-600 mb-6">
          Connect your social media accounts to start tracking your performance analytics.
        </p>
        <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
          <TrendingUp className="w-4 h-4 mr-2" />
          Analytics will appear here once you connect your accounts
        </div>
      </div>
    );
  }

  // Group analytics by platform and get the latest data
  const platformAnalytics = analytics.reduce((acc, item) => {
    if (!acc[item.platform] || new Date(item.date) > new Date(acc[item.platform].date)) {
      acc[item.platform] = item;
    }
    return acc;
  }, {} as Record<string, Analytics>);

  const platforms = Object.values(platformAnalytics);

  // Calculate totals
  const totals = platforms.reduce((acc, platform) => ({
    followers: acc.followers + platform.followers,
    engagement: acc.engagement + platform.engagement,
    reach: acc.reach + platform.reach,
    impressions: acc.impressions + platform.impressions,
    likes: acc.likes + platform.likes,
    comments: acc.comments + platform.comments,
    shares: acc.shares + platform.shares,
    clicks: acc.clicks + platform.clicks,
  }), {
    followers: 0,
    engagement: 0,
    reach: 0,
    impressions: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    clicks: 0,
  });

  const avgEngagement = platforms.length > 0 ? totals.engagement / platforms.length : 0;

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return 'bg-blue-500';
      case 'instagram': return 'bg-pink-500';
      case 'twitter': return 'bg-sky-500';
      case 'linkedin': return 'bg-blue-600';
      case 'youtube': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return '📘';
      case 'instagram': return '📸';
      case 'twitter': return '🐦';
      case 'linkedin': return '💼';
      case 'youtube': return '📺';
      default: return '📱';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600">Track your social media performance across all platforms</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-blue-800">
              <span className="text-sm font-medium">Total Followers</span>
              <Users className="w-5 h-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{totals.followers.toLocaleString()}</div>
            <p className="text-xs text-blue-600 mt-1">Across all platforms</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-green-800">
              <span className="text-sm font-medium">Avg Engagement</span>
              <Heart className="w-5 h-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{avgEngagement.toFixed(1)}%</div>
            <p className="text-xs text-green-600 mt-1">Engagement rate</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-purple-800">
              <span className="text-sm font-medium">Total Reach</span>
              <Eye className="w-5 h-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{totals.reach.toLocaleString()}</div>
            <p className="text-xs text-purple-600 mt-1">People reached</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-orange-800">
              <span className="text-sm font-medium">Total Impressions</span>
              <BarChart3 className="w-5 h-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{totals.impressions.toLocaleString()}</div>
            <p className="text-xs text-orange-600 mt-1">Total views</p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Platform Performance</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {platforms.map((platform) => (
            <Card key={platform.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getPlatformColor(platform.platform)}`}>
                      <span className="text-white text-sm">{getPlatformIcon(platform.platform)}</span>
                    </div>
                    <span className="text-lg font-semibold capitalize">{platform.platform}</span>
                  </div>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    {platform.engagement.toFixed(1)}% engagement
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>Followers</span>
                    </div>
                    <div className="font-semibold text-lg">{platform.followers.toLocaleString()}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Eye className="w-4 h-4" />
                      <span>Reach</span>
                    </div>
                    <div className="font-semibold text-lg">{platform.reach.toLocaleString()}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Heart className="w-4 h-4" />
                      <span>Likes</span>
                    </div>
                    <div className="font-semibold text-lg">{platform.likes.toLocaleString()}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MessageSquare className="w-4 h-4" />
                      <span>Comments</span>
                    </div>
                    <div className="font-semibold text-lg">{platform.comments.toLocaleString()}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Share2 className="w-4 h-4" />
                      <span>Shares</span>
                    </div>
                    <div className="font-semibold text-lg">{platform.shares.toLocaleString()}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MousePointer className="w-4 h-4" />
                      <span>Clicks</span>
                    </div>
                    <div className="font-semibold text-lg">{platform.clicks.toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Last updated: {new Date(platform.date).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;