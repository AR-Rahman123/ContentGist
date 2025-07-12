import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Clock, CheckCircle, Plus, BarChart3, Settings, Users, Link as LinkIcon, ThumbsUp, ThumbsDown, MessageSquare, Edit } from 'lucide-react';
import { useLocation } from 'wouter';
import PostScheduler from '@/components/PostScheduler';
import SocialMediaConnect from '@/components/SocialMediaConnect';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { apiRequest, queryClient } from '@/lib/queryClient';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [showPostScheduler, setShowPostScheduler] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['/api/posts'],
  });

  const approvePostMutation = useMutation({
    mutationFn: async ({ postId, status, rejectionReason }: { postId: number, status: string, rejectionReason?: string }) => {
      return await apiRequest(`/api/posts/${postId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, rejectionReason }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-emerald-100 text-emerald-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'posted': return <CheckCircle className="h-4 w-4" />;
      case 'scheduled': return <Clock className="h-4 w-4" />;
      case 'approved': return <ThumbsUp className="h-4 w-4" />;
      case 'pending_approval': return <MessageSquare className="h-4 w-4" />;
      case 'rejected': return <ThumbsDown className="h-4 w-4" />;
      case 'draft': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleApprovePost = (postId: number) => {
    approvePostMutation.mutate({ postId, status: 'approved' });
  };

  const handleRejectPost = (postId: number, rejectionReason: string) => {
    approvePostMutation.mutate({ postId, status: 'rejected', rejectionReason });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'social', label: 'Social Accounts', icon: LinkIcon },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (showPostScheduler) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowPostScheduler(false)}
              className="mb-4"
            >
              ← Back to Dashboard
            </Button>
          </div>
          <PostScheduler onClose={() => setShowPostScheduler(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">ContentGist Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome back, {user?.name}</span>
              <Button variant="outline" size="sm" onClick={() => setLocation('/')}>
                <Users className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to create amazing content?</h2>
                <p className="text-gray-600">Schedule your next post or manage your content calendar</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowPostScheduler(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
                <Button variant="outline" onClick={() => setLocation('/pricing')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Total Posts</CardTitle>
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{statsLoading ? '...' : stats?.totalPosts || 0}</div>
              <p className="text-xs text-blue-600 mt-1">All time</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">Scheduled</CardTitle>
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">{statsLoading ? '...' : stats?.scheduledPosts || 0}</div>
              <p className="text-xs text-orange-600 mt-1">Upcoming</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Posted</CardTitle>
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{statsLoading ? '...' : stats?.postedPosts || 0}</div>
              <p className="text-xs text-green-600 mt-1">This month</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Posts Remaining</CardTitle>
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">{statsLoading ? '...' : stats?.postsRemaining || 0}</div>
              {stats?.plan && (
                <p className="text-xs text-purple-600 mt-1">
                  {stats.plan.name} Plan
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Subscription Status */}
                  {!stats?.plan && (
                    <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
                      <CardHeader>
                        <CardTitle className="text-orange-800 flex items-center gap-2">
                          <Settings className="w-5 h-5" />
                          No Active Subscription
                        </CardTitle>
                        <CardDescription className="text-orange-700">
                          You need an active subscription to receive scheduled posts.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button onClick={() => setLocation('/pricing')} className="bg-orange-600 hover:bg-orange-700">
                          Choose a Plan
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="text-center">
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-blue-600">{stats?.totalPosts || 0}</div>
                        <div className="text-sm text-gray-600">Total Posts</div>
                      </CardContent>
                    </Card>
                    <Card className="text-center">
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-green-600">{stats?.scheduledPosts || 0}</div>
                        <div className="text-sm text-gray-600">Scheduled</div>
                      </CardContent>
                    </Card>
                    <Card className="text-center">
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-purple-600">{stats?.postedPosts || 0}</div>
                        <div className="text-sm text-gray-600">Posted</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'posts' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Your Posts</h3>
                    <p className="text-sm text-gray-600">Posts scheduled for your account by the ContentGist team</p>
                  </div>
                  
                  {postsLoading ? (
                    <div className="text-center py-8">Loading posts...</div>
                  ) : posts?.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No posts yet. Your scheduled posts will appear here.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {posts?.map((post: any) => (
                        <Card key={post.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">{post.title}</h3>
                                <p className="text-gray-600 mt-1">{post.content}</p>
                                {post.scheduledAt && (
                                  <p className="text-sm text-gray-500 mt-2">
                                    Scheduled for: {formatDate(post.scheduledAt)}
                                  </p>
                                )}
                                {post.platforms && (
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {post.platforms.map((platform: string) => (
                                      <Badge key={platform} variant="secondary" className="text-xs">
                                        {platform}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="ml-4 flex flex-col items-end space-y-2">
                                <Badge className={getStatusColor(post.status)}>
                                  <div className="flex items-center space-x-1">
                                    {getStatusIcon(post.status)}
                                    <span className="capitalize">{post.status.replace('_', ' ')}</span>
                                  </div>
                                </Badge>
                                
                                {post.status === 'pending_approval' && (
                                  <div className="flex gap-2">
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleApprovePost(post.id)}
                                      disabled={approvePostMutation.isPending}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <ThumbsUp className="h-3 w-3 mr-1" />
                                      Approve
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleRejectPost(post.id, 'Client rejected')}
                                      disabled={approvePostMutation.isPending}
                                      className="border-red-200 text-red-600 hover:bg-red-50"
                                    >
                                      <ThumbsDown className="h-3 w-3 mr-1" />
                                      Reject
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'social' && (
                <div>
                  <SocialMediaConnect />
                </div>
              )}

              {activeTab === 'analytics' && (
                <div>
                  <AnalyticsDashboard />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}