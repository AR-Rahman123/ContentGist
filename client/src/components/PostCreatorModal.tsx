import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Image, 
  X, 
  Calendar, 
  Clock, 
  Hash, 
  Users,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube
} from 'lucide-react';

interface PostCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClientId?: number;
  initialDate?: string;
}

interface PostFormData {
  title: string;
  content: string;
  scheduledAt: string;
  platforms: string[];
  userId: number;
  mediaUrls: string[];
  hashtags: string[];
}

const platformIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
};

const platformColors = {
  facebook: 'bg-blue-600 text-white',
  instagram: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
  twitter: 'bg-blue-400 text-white',
  linkedin: 'bg-blue-700 text-white',
  youtube: 'bg-red-600 text-white',
};

export default function PostCreatorModal({ 
  isOpen, 
  onClose, 
  selectedClientId,
  initialDate 
}: PostCreatorModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    scheduledAt: initialDate || new Date().toISOString().slice(0, 16),
    platforms: [],
    userId: selectedClientId || 0,
    mediaUrls: [],
    hashtags: []
  });
  const [hashtag, setHashtag] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Get users (clients) for selection
  const { data: users = [] } = useQuery({
    queryKey: ['/api/admin/users'],
    enabled: isOpen
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: PostFormData) => {
      const response = await apiRequest('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Post scheduled successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/calendar/posts'] });
      handleClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    }
  });

  const handleClose = () => {
    setFormData({
      title: '',
      content: '',
      scheduledAt: new Date().toISOString().slice(0, 16),
      platforms: [],
      userId: selectedClientId || 0,
      mediaUrls: [],
      hashtags: []
    });
    setHashtag('');
    setImageUrl('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.userId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.platforms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one platform",
        variant: "destructive",
      });
      return;
    }

    createPostMutation.mutate(formData);
  };

  const togglePlatform = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const addHashtag = () => {
    if (hashtag.trim() && !formData.hashtags.includes(hashtag.trim())) {
      setFormData(prev => ({
        ...prev,
        hashtags: [...prev.hashtags, hashtag.trim()]
      }));
      setHashtag('');
    }
  };

  const removeHashtag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addImage = () => {
    if (imageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        mediaUrls: [...prev.mediaUrls, imageUrl.trim()]
      }));
      setImageUrl('');
    }
  };

  const removeImage = (urlToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      mediaUrls: prev.mediaUrls.filter(url => url !== urlToRemove)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            Create New Post
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Selection */}
          <div className="space-y-2">
            <Label htmlFor="client">Client *</Label>
            <Select 
              value={formData.userId.toString()} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, userId: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user: any) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      {user.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Post Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Post Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter post title..."
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="What's on your mind?"
              rows={4}
              className="resize-none"
              required
            />
            <div className="text-right text-xs text-gray-500">
              {formData.content.length} characters
            </div>
          </div>

          {/* Platform Selection */}
          <div className="space-y-3">
            <Label>Platforms *</Label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(platformIcons).map(([platform, Icon]) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => togglePlatform(platform)}
                  className={`p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                    formData.platforms.includes(platform)
                      ? `${platformColors[platform as keyof typeof platformColors]} border-transparent`
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium capitalize">{platform}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Time */}
          <div className="space-y-2">
            <Label htmlFor="scheduledAt">Schedule Time *</Label>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                className="flex-1"
                required
              />
            </div>
          </div>

          {/* Media URLs */}
          <div className="space-y-3">
            <Label>Media (Images/Videos)</Label>
            <div className="flex gap-2">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL..."
                className="flex-1"
              />
              <Button type="button" onClick={addImage} variant="outline" size="sm">
                <Image className="w-4 h-4" />
              </Button>
            </div>
            {formData.mediaUrls.length > 0 && (
              <div className="space-y-2">
                {formData.mediaUrls.map((url, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Image className="w-4 h-4 text-gray-500" />
                    <span className="flex-1 text-sm truncate">{url}</span>
                    <Button
                      type="button"
                      onClick={() => removeImage(url)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hashtags */}
          <div className="space-y-3">
            <Label>Hashtags</Label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  value={hashtag}
                  onChange={(e) => setHashtag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHashtag())}
                  placeholder="Enter hashtag..."
                  className="pl-9"
                />
              </div>
              <Button type="button" onClick={addHashtag} variant="outline" size="sm">
                Add
              </Button>
            </div>
            {formData.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.hashtags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    #{tag}
                    <Button
                      type="button"
                      onClick={() => removeHashtag(tag)}
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-gray-500 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Preview */}
          {formData.content && (
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Preview</Label>
                <div className="space-y-2">
                  <p className="text-sm whitespace-pre-wrap">{formData.content}</p>
                  {formData.hashtags.length > 0 && (
                    <p className="text-sm text-blue-600">
                      {formData.hashtags.map(tag => `#${tag}`).join(' ')}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createPostMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {createPostMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                  Scheduling...
                </div>
              ) : (
                'Schedule Post'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}