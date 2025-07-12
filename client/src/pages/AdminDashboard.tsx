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
import { Users, FileText, Clock, CheckCircle, Plus, BarChart3, Settings, Calendar, CreditCard, Shield } from 'lucide-react';
import ClientManagerSidebar from '@/components/ClientManagerSidebar';
import PostScheduler from '@/components/PostScheduler';
import CalendarView from '@/components/CalendarView';
import PricingPlans from '@/components/PricingPlans';
import PostCreatorModal from '@/components/PostCreatorModal';
import PostList from '@/components/PostList';
import SocialMediaConnect from '@/components/SocialMediaConnect';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedClientId, setSelectedClientId] = useState<number | undefined>(undefined);
  const [showPostScheduler, setShowPostScheduler] = useState(false);
  const [postForClientId, setPostForClientId] = useState<number | undefined>(undefined);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [showPostCreator, setShowPostCreator] = useState(false);
  const [initialScheduleDate, setInitialScheduleDate] = useState<string>('');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'publish' | 'analyze' | 'engage' | 'calendar' | 'billing'>('publish');
  
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
    <div className="min-h-screen bg-white flex">
      {/* Buffer-style Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">ContentGist</span>
            </div>
            
            <nav className="flex items-center gap-6">
              <button 
                onClick={() => setActiveTab('publish')}
                className={`pb-4 px-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'publish' 
                    ? 'text-blue-600 border-blue-600' 
                    : 'text-gray-600 hover:text-gray-900 border-transparent'
                }`}
              >
                Publish
              </button>
              <button 
                onClick={() => setActiveTab('calendar')}
                className={`pb-4 px-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'calendar' 
                    ? 'text-blue-600 border-blue-600' 
                    : 'text-gray-600 hover:text-gray-900 border-transparent'
                }`}
              >
                Calendar
              </button>
              <button 
                onClick={() => setActiveTab('analyze')}
                className={`pb-4 px-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'analyze' 
                    ? 'text-blue-600 border-blue-600' 
                    : 'text-gray-600 hover:text-gray-900 border-transparent'
                }`}
              >
                Analyze
              </button>
              <button 
                onClick={() => setActiveTab('engage')}
                className={`pb-4 px-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'engage' 
                    ? 'text-blue-600 border-blue-600' 
                    : 'text-gray-600 hover:text-gray-900 border-transparent'
                }`}
              >
                Engage
              </button>
              <button 
                onClick={() => setActiveTab('billing')}
                className={`pb-4 px-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'billing' 
                    ? 'text-blue-600 border-blue-600' 
                    : 'text-gray-600 hover:text-gray-900 border-transparent'
                }`}
              >
                Billing
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setShowPostScheduler(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Welcome, {user?.name}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Buffer-style Layout */}
      <div className="flex w-full pt-16">
        {/* Collapsible Left Sidebar - Channels */}
        <div 
          className={`${
            sidebarExpanded ? 'w-64' : 'w-16'
          } bg-gray-50 border-r border-gray-200 h-screen overflow-hidden transition-all duration-300 ease-in-out relative`}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              {sidebarExpanded ? (
                <>
                  <h2 className="font-semibold text-gray-900">Channels</h2>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </>
              ) : (
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
                  <Users className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            
            {sidebarExpanded && (
              <div className="animate-in fade-in duration-200">
                <ClientManagerSidebar
                  selectedClientId={selectedClientId}
                  onClientSelect={handleClientSelect}
                  onCreatePostForClient={handleCreatePostForClient}
                />
              </div>
            )}
            
            {!sidebarExpanded && (
              <div className="space-y-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-xs font-bold text-blue-600">AC</span>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-xs font-bold text-green-600">TI</span>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-xs font-bold text-purple-600">MP</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeTab === 'publish' && 'All Channels'}
                  {activeTab === 'calendar' && 'Content Calendar'}
                  {activeTab === 'analyze' && 'Analytics'}
                  {activeTab === 'engage' && 'Engagement'}
                  {activeTab === 'billing' && 'Billing & Plans'}
                </h1>
                {selectedClientId && (
                  <Badge variant="secondary">
                    Client #{selectedClientId} Selected
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Share Feedback
                </Button>
                <Button variant="outline" size="sm">
                  List
                </Button>
                <Button variant="outline" size="sm">
                  Calendar
                </Button>
                <Button 
                  onClick={() => {
                    setInitialScheduleDate('');
                    setShowPostCreator(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'publish' && (
              <>
                {/* Buffer-style Tabs */}
                <div className="border-b border-gray-200 mb-6">
                  <nav className="flex gap-8">
                    <button className="pb-3 px-1 border-b-2 border-blue-600 text-blue-600 font-medium">
                      Queue <span className="ml-1 text-sm text-gray-500">1</span>
                    </button>
                    <button className="pb-3 px-1 text-gray-600 hover:text-gray-900">
                      Drafts <span className="ml-1 text-sm text-gray-500">0</span>
                    </button>
                    <button className="pb-3 px-1 text-gray-600 hover:text-gray-900">
                      Approvals <span className="ml-1 text-sm text-gray-500">4</span>
                    </button>
                    <button className="pb-3 px-1 text-gray-600 hover:text-gray-900">
                      Sent <span className="ml-1 text-sm text-gray-500">99</span>
                    </button>
                  </nav>
                </div>

                {/* Posts Content Area */}
                <PostList selectedClientId={selectedClientId} />
              </>
            )}

            {activeTab === 'calendar' && (
              <CalendarView
                onCreatePost={(date) => {
                  if (date) {
                    // Set the scheduled date when creating from calendar
                    const isoDate = date.toISOString().slice(0, 16);
                    setInitialScheduleDate(isoDate);
                  }
                  setShowPostCreator(true);
                }}
                selectedClientId={selectedClientId}
              />
            )}

            {activeTab === 'analyze' && (
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
                <p className="text-gray-600">View detailed analytics for all your client accounts</p>
              </div>
            )}

            {activeTab === 'engage' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Social Media Connections</h2>
                    <p className="text-sm text-gray-600">Manage client social media account connections for automated posting</p>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => window.open('/oauth-demo', '_blank')}
                    className="flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    How OAuth Works
                  </Button>
                </div>
                <SocialMediaConnect showTutorialButton={false} />
              </div>
            )}

            {activeTab === 'billing' && (
              <PricingPlans showCurrentPlan={true} />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPostCreator && (
        <PostCreatorModal
          isOpen={showPostCreator}
          onClose={() => {
            setShowPostCreator(false);
            setInitialScheduleDate('');
          }}
          selectedClientId={selectedClientId}
          initialDate={initialScheduleDate}
        />
      )}
    </div>
  );
}