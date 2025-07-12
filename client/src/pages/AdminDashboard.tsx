import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, FileText, Clock, CheckCircle, Plus, BarChart3, Settings } from 'lucide-react';
import ClientManagerSidebar from '@/components/ClientManagerSidebar';
import PostScheduler from '@/components/PostScheduler';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedClientId, setSelectedClientId] = useState<number | undefined>(undefined);
  const [showPostScheduler, setShowPostScheduler] = useState(false);
  const [postForClientId, setPostForClientId] = useState<number | undefined>(undefined);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  
  const handleClientSelect = (clientId: number) => {
    setSelectedClientId(clientId);
  };

  const handleCreatePostForClient = (clientId: number) => {
    setPostForClientId(clientId);
    setShowPostScheduler(true);
  };
  const [selectedUserId, setSelectedUserId] = useState('');
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    scheduledAt: ''
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/admin/dashboard-stats'],
  });

  const { data: users } = useQuery({
    queryKey: ['/api/admin/users'],
  });

  const { data: posts } = useQuery({
    queryKey: ['/api/posts'],
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/posts', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard-stats'] });
      setIsCreatePostOpen(false);
      setPostData({ title: '', content: '', scheduledAt: '' });
      setSelectedUserId('');
    },
  });

  const handleCreatePost = () => {
    if (!selectedUserId || !postData.title || !postData.content) return;

    const submitData = {
      userId: parseInt(selectedUserId),
      title: postData.title,
      content: postData.content,
      scheduledAt: postData.scheduledAt ? new Date(postData.scheduledAt) : null,
    };

    createPostMutation.mutate(submitData);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showPostScheduler) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowPostScheduler(false);
                setPostForClientId(undefined);
              }}
              className="mb-4"
            >
              ← Back to Admin Dashboard
            </Button>
          </div>
          <PostScheduler 
            onClose={() => {
              setShowPostScheduler(false);
              setPostForClientId(undefined);
            }}
            clientId={postForClientId}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Client Manager Sidebar */}
      <ClientManagerSidebar
        selectedClientId={selectedClientId}
        onClientSelect={handleClientSelect}
        onCreatePostForClient={handleCreatePostForClient}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                {selectedClientId && (
                  <Badge variant="secondary" className="ml-2">
                    Client #{selectedClientId} Selected
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Welcome, {user?.name}</span>
                <Button variant="outline" size="sm" onClick={() => setLocation('/dashboard')}>
                  Dashboard
                </Button>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalPosts || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.scheduledPosts || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Posted</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.postedPosts || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeSubscriptions || 0}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage your users and their subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users?.map((user: any) => (
                  <div key={user.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400">
                          Joined: {formatDate(user.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge variant={user.subscriptionStatus === 'active' ? 'default' : 'secondary'}>
                          {user.subscriptionStatus}
                        </Badge>
                        {user.planId && (
                          <span className="text-xs text-gray-500">Plan ID: {user.planId}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Posts Management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Posts</CardTitle>
                <CardDescription>Create and manage posts for users</CardDescription>
              </div>
              <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Post</DialogTitle>
                    <DialogDescription>
                      Create a new post and assign it to a user
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="user">Assign to User</Label>
                      <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                        <SelectContent>
                          {users?.map((user: any) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              {user.name} ({user.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="title">Post Title</Label>
                      <Input
                        id="title"
                        value={postData.title}
                        onChange={(e) => setPostData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter post title"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={postData.content}
                        onChange={(e) => setPostData(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Enter post content"
                        rows={4}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="scheduledAt">Schedule Date (Optional)</Label>
                      <Input
                        id="scheduledAt"
                        type="datetime-local"
                        value={postData.scheduledAt}
                        onChange={(e) => setPostData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                      />
                    </div>
                    
                    <Button 
                      onClick={handleCreatePost} 
                      className="w-full"
                      disabled={createPostMutation.isPending || !selectedUserId || !postData.title || !postData.content}
                    >
                      {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {posts?.map((post: any) => (
                  <div key={post.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{post.title}</h4>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{post.content}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          User ID: {post.userId}
                        </p>
                        {post.scheduledAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            Scheduled: {formatDate(post.scheduledAt)}
                          </p>
                        )}
                      </div>
                      <Badge className={`${getStatusColor(post.status)} text-xs`}>
                        {post.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </div>
  );
}