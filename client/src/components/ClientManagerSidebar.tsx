import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube,
  Plus,
  Settings,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface Client {
  id: number;
  name: string;
  email: string;
  planId: number | null;
  subscriptionStatus: string;
  createdAt: string;
  plan?: {
    name: string;
    postsLimit: number;
  };
  socialAccounts?: SocialAccount[];
  postStats?: {
    total: number;
    scheduled: number;
    posted: number;
  };
}

interface SocialAccount {
  id: number;
  platform: string;
  accountName: string;
  isActive: boolean;
  createdAt: string;
}

interface ClientManagerSidebarProps {
  selectedClientId?: number;
  onClientSelect: (clientId: number) => void;
  onCreatePostForClient: (clientId: number) => void;
}

const ClientManagerSidebar: React.FC<ClientManagerSidebarProps> = ({
  selectedClientId,
  onClientSelect,
  onCreatePostForClient
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedClients, setExpandedClients] = useState<Set<number>>(new Set());

  const { data: clients, isLoading } = useQuery<Client[]>({
    queryKey: ['/api/admin/clients-overview'],
  });

  const filteredClients = clients?.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const toggleClientExpanded = (clientId: number) => {
    const newExpanded = new Set(expandedClients);
    if (newExpanded.has(clientId)) {
      newExpanded.delete(clientId);
    } else {
      newExpanded.add(clientId);
    }
    setExpandedClients(newExpanded);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return <Facebook className="w-4 h-4 text-blue-600" />;
      case 'instagram': return <Instagram className="w-4 h-4 text-pink-600" />;
      case 'twitter': return <Twitter className="w-4 h-4 text-blue-400" />;
      case 'linkedin': return <Linkedin className="w-4 h-4 text-blue-700" />;
      case 'youtube': return <Youtube className="w-4 h-4 text-red-600" />;
      default: return <Settings className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-300 rounded"></div>
          <div className="h-8 bg-gray-300 rounded"></div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Client Manager</h2>
            <p className="text-xs text-gray-500">{filteredClients.length} clients</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Client List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredClients.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No clients found</p>
          </div>
        ) : (
          filteredClients.map((client) => {
            const isExpanded = expandedClients.has(client.id);
            const isSelected = selectedClientId === client.id;

            return (
              <Card 
                key={client.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => onClientSelect(client.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {client.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{client.name}</h3>
                        <p className="text-xs text-gray-500 truncate">{client.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getStatusColor(client.subscriptionStatus)}`}>
                        {client.subscriptionStatus}
                      </Badge>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleClientExpanded(client.id);
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Plan and Quick Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{client.plan?.name || 'No Plan'}</span>
                    <span>{client.postStats?.total || 0} posts</span>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-0">
                    {/* Connected Channels */}
                    <div className="mb-3">
                      <h4 className="text-xs font-medium text-gray-700 mb-2">Connected Channels</h4>
                      {client.socialAccounts && client.socialAccounts.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {client.socialAccounts.map((account) => (
                            <div 
                              key={account.id} 
                              className="flex items-center gap-1 bg-gray-50 rounded-full px-2 py-1"
                            >
                              {getPlatformIcon(account.platform)}
                              <span className="text-xs text-gray-700">{account.accountName}</span>
                              {account.isActive ? (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                              ) : (
                                <XCircle className="w-3 h-3 text-red-500" />
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">No channels connected</p>
                      )}
                    </div>

                    {/* Post Stats */}
                    {client.postStats && (
                      <div className="mb-3">
                        <h4 className="text-xs font-medium text-gray-700 mb-2">Post Statistics</h4>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <div className="font-medium text-blue-700">{client.postStats.scheduled}</div>
                            <div className="text-blue-600">Scheduled</div>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded">
                            <div className="font-medium text-green-700">{client.postStats.posted}</div>
                            <div className="text-green-600">Posted</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="font-medium text-gray-700">{client.postStats.total}</div>
                            <div className="text-gray-600">Total</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCreatePostForClient(client.id);
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Create Post
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Navigate to client analytics
                        }}
                        className="px-2"
                      >
                        <BarChart3 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Managing {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

export default ClientManagerSidebar;