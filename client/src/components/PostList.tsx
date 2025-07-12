import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Calendar,
  User,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Hash,
  Image
} from 'lucide-react';
import moment from 'moment';

interface Post {
  id: number;
  title: string;
  content: string;
  status: string;
  scheduledAt: string | null;
  publishedAt: string | null;
  userId: number;
  platforms: string[];
  mediaUrls: string[];
  hashtags: string[];
  publishResults?: string;
  user?: {
    name: string;
    email: string;
  };
}

interface PostListProps {
  selectedClientId?: number;
}

export default function PostList({ selectedClientId }: PostListProps) {
  const { toast } = useToast();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'posted' | 'pending' | 'failed'>('all');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['/api/posts'],
    queryFn: () => apiRequest('/api/posts').then(res => res.json()),
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await apiRequest(`/api/posts/${postId}`, {
        method: 'DELETE'
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete post",
        variant: "destructive",
      });
    }
  });

  const publishPostMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await apiRequest(`/api/posts/${postId}/publish`, {
        method: 'POST'
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Post published successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to publish post",
        variant: "destructive",
      });
    }
  });

  // Filter posts based on selected client and status filter
  const filteredPosts = posts
    .filter((post: Post) => {
      if (selectedClientId && selectedClientId !== 0) {
        return post.userId === selectedClientId;
      }
      return true;
    })
    .filter((post: Post) => {
      switch (filter) {
        case 'scheduled':
          return post.status === 'scheduled';
        case 'posted':
          return post.status === 'posted';
        case 'pending':
          return post.status === 'pending_approval' || post.status === 'pending_manual_posting';
        case 'failed':
          return post.status === 'failed';
        default:
          return true;
      }
    })
    .sort((a: Post, b: Post) => {
      // Sort by scheduled time, then by creation time
      if (a.scheduledAt && b.scheduledAt) {
        return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
      }
      return b.id - a.id;
    });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'scheduled':
        return { 
          icon: <Clock className="w-4 h-4" />, 
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          label: 'Scheduled'
        };
      case 'posted':
        return { 
          icon: <CheckCircle className="w-4 h-4" />, 
          color: 'bg-green-100 text-green-800 border-green-200',
          label: 'Posted'
        };
      case 'pending_approval':
        return { 
          icon: <AlertCircle className="w-4 h-4" />, 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          label: 'Pending Approval'
        };
      case 'pending_manual_posting':
        return { 
          icon: <AlertCircle className="w-4 h-4" />, 
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          label: 'Manual Posting Required'
        };
      case 'failed':
        return { 
          icon: <XCircle className="w-4 h-4" />, 
          color: 'bg-red-100 text-red-800 border-red-200',
          label: 'Failed'
        };
      case 'partially_posted':
        return { 
          icon: <AlertCircle className="w-4 h-4" />, 
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          label: 'Partially Posted'
        };
      default:
        return { 
          icon: <Clock className="w-4 h-4" />, 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          label: 'Draft'
        };
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not scheduled';
    return moment(dateString).format('MMM D, YYYY [at] h:mm A');
  };

  const getRelativeTime = (dateString: string | null) => {
    if (!dateString) return '';
    return moment(dateString).fromNow();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-2 pb-4 border-b">
        <span className="text-sm font-medium text-gray-700">Filter:</span>
        {[
          { key: 'all', label: 'All Posts' },
          { key: 'scheduled', label: 'Scheduled' },
          { key: 'posted', label: 'Posted' },
          { key: 'pending', label: 'Pending' },
          { key: 'failed', label: 'Failed' }
        ].map(({ key, label }) => (
          <Button
            key={key}
            variant={filter === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(key as typeof filter)}
            className={filter === key ? 'bg-blue-600 text-white' : ''}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Create your first post to get started'
                : `No ${filter} posts found`
              }
            </p>
          </div>
        ) : (
          filteredPosts.map((post: Post) => {
            const statusConfig = getStatusConfig(post.status);
            
            return (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    {/* Post Content */}
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">
                          {post.title}
                        </h3>
                        <Badge className={`${statusConfig.color} flex items-center gap-1`}>
                          {statusConfig.icon}
                          {statusConfig.label}
                        </Badge>
                      </div>

                      {/* Content Preview */}
                      <p className="text-gray-700 text-sm line-clamp-2">
                        {post.content}
                      </p>

                      {/* Meta Information */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {/* Client */}
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{post.user?.name || `User ${post.userId}`}</span>
                        </div>

                        {/* Schedule Time */}
                        {post.scheduledAt && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{getRelativeTime(post.scheduledAt)}</span>
                          </div>
                        )}

                        {/* Media Count */}
                        {post.mediaUrls && post.mediaUrls.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Image className="w-3 h-3" />
                            <span>{post.mediaUrls.length} media</span>
                          </div>
                        )}

                        {/* Hashtags Count */}
                        {post.hashtags && post.hashtags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            <span>{post.hashtags.length} tags</span>
                          </div>
                        )}
                      </div>

                      {/* Platforms */}
                      {post.platforms && post.platforms.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Platforms:</span>
                          <div className="flex gap-1">
                            {post.platforms.map((platform, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPost(post)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {(post.status === 'pending_manual_posting' || post.status === 'failed') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => publishPostMutation.mutate(post.id)}
                          disabled={publishPostMutation.isPending}
                        >
                          Retry
                        </Button>
                      )}
                      
                      {post.status !== 'posted' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deletePostMutation.mutate(post.id)}
                          disabled={deletePostMutation.isPending}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Post Details Modal */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedPost?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedPost && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getStatusConfig(selectedPost.status).color}>
                  {getStatusConfig(selectedPost.status).icon}
                  {getStatusConfig(selectedPost.status).label}
                </Badge>
                <span className="text-sm text-gray-500">
                  {selectedPost.scheduledAt && `Scheduled for ${formatDate(selectedPost.scheduledAt)}`}
                </span>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Content</h4>
                <p className="text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                  {selectedPost.content}
                </p>
              </div>

              {selectedPost.hashtags && selectedPost.hashtags.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Hashtags</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedPost.hashtags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedPost.mediaUrls && selectedPost.mediaUrls.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Media</h4>
                  <div className="space-y-2">
                    {selectedPost.mediaUrls.map((url, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <Image className="w-4 h-4 text-gray-500" />
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline truncate"
                        >
                          {url}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedPost.platforms && selectedPost.platforms.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Platforms</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPost.platforms.map((platform, index) => (
                      <Badge key={index} variant="outline">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedPost.publishResults && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Publish Results</h4>
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">
                    {JSON.stringify(JSON.parse(selectedPost.publishResults), null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}