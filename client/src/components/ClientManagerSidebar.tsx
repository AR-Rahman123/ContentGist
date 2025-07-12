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
    <div className="w-full">
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white border-gray-200"
        />
      </div>

      {/* All Channels Button */}
      <div className="mb-3">
        <button
          onClick={() => onClientSelect(0)}
          className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
            selectedClientId === 0 ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-100'
          }`}
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900">All Channels</div>
            <div className="text-xs text-gray-500">{filteredClients.length} clients</div>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </button>
      </div>

      {/* Client List */}
      <div className="space-y-2">
        {filteredClients.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">No clients found</p>
          </div>
        ) : (
          filteredClients.map((client) => {
            const isSelected = selectedClientId === client.id;

            return (
              <button
                key={client.id}
                onClick={() => onClientSelect(client.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-100'
                }`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-700">
                    {client.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate text-sm">{client.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    {client.socialAccounts?.slice(0, 3).map((account) => (
                      <div key={account.id} className="w-4 h-4">
                        {getPlatformIcon(account.platform)}
                      </div>
                    ))}
                    {client.socialAccounts && client.socialAccounts.length > 3 && (
                      <span className="text-xs text-gray-500">+{client.socialAccounts.length - 3}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className={`w-2 h-2 rounded-full ${
                    client.subscriptionStatus === 'active' ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-xs text-gray-500 mt-1">{client.postStats?.total || 0}</span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ClientManagerSidebar;