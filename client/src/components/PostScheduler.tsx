import React, { useState } from 'react';
import { Calendar, Clock, Image, Video, Hash, AtSign, Globe, Instagram, Twitter, Facebook, Smile, BarChart3, Send, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface PostSchedulerProps {
  onClose?: () => void;
}

const PostScheduler = ({ onClose }: PostSchedulerProps) => {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [selectedTimeOption, setSelectedTimeOption] = useState<'now' | 'optimal' | 'custom'>('optimal');
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [newHashtag, setNewHashtag] = useState('');

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-blue-500' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { id: 'linkedin', name: 'LinkedIn', icon: Globe, color: 'bg-blue-700' }
  ];

  const timeOptions = [
    { 
      id: 'now', 
      label: 'Post Now', 
      description: 'Publish immediately',
      icon: Send,
      color: 'bg-green-500'
    },
    { 
      id: 'optimal', 
      label: 'Optimal Time', 
      description: 'Best engagement window: 2:30 PM EST',
      icon: BarChart3,
      color: 'bg-blue-500'
    },
    { 
      id: 'custom', 
      label: 'Custom Schedule', 
      description: 'Choose your own date and time',
      icon: Calendar,
      color: 'bg-purple-500'
    }
  ];

  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      return apiRequest('/api/posts', {
        method: 'POST',
        body: JSON.stringify(postData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      if (onClose) onClose();
      // Reset form
      setContent('');
      setSelectedPlatforms(['instagram']);
      setScheduledDate('');
      setScheduledTime('');
      setSelectedTimeOption('optimal');
      setMediaFiles([]);
      setHashtags([]);
    },
  });

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const addHashtag = () => {
    if (newHashtag && !hashtags.includes(newHashtag)) {
      setHashtags([...hashtags, newHashtag]);
      setNewHashtag('');
    }
  };

  const removeHashtag = (tagToRemove: string) => {
    setHashtags(hashtags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    let scheduledAt = null;
    
    if (selectedTimeOption === 'optimal') {
      // Set optimal time (2:30 PM today)
      const today = new Date();
      today.setHours(14, 30, 0, 0);
      if (today < new Date()) {
        today.setDate(today.getDate() + 1); // Next day if time has passed
      }
      scheduledAt = today;
    } else if (selectedTimeOption === 'custom' && scheduledDate && scheduledTime) {
      scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`);
    }

    const finalContent = content + (hashtags.length > 0 ? '\n\n' + hashtags.map(tag => `#${tag}`).join(' ') : '');

    createPostMutation.mutate({
      content: finalContent,
      platforms: selectedPlatforms,
      scheduledAt,
      status: selectedTimeOption === 'now' ? 'published' : 'scheduled'
    });
  };

  const characterCount = content.length;
  const maxCharacters = 280; // Twitter limit for compatibility

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              Create New Post
            </CardTitle>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Platforms
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {platforms.map(platform => (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedPlatforms.includes(platform.id)
                      ? 'border-blue-500 bg-blue-50 scale-105'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 ${platform.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    <platform.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm font-medium text-gray-700">{platform.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Creation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What's on your mind?
            </label>
            <div className="relative">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts, updates, or engage with your audience..."
                className="min-h-[120px] text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl resize-none"
                maxLength={maxCharacters}
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <span className={`text-sm ${characterCount > maxCharacters * 0.9 ? 'text-red-500' : 'text-gray-400'}`}>
                  {characterCount}/{maxCharacters}
                </span>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                  <Smile className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Add Media
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
              <div className="flex justify-center gap-4 mb-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Photos
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Videos
                </Button>
              </div>
              <p className="text-gray-500 text-sm">
                Drag and drop your media here, or click to browse
              </p>
            </div>
          </div>

          {/* Hashtags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Hashtags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {hashtags.map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  #{tag}
                  <button onClick={() => removeHashtag(tag)} className="ml-1 hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={newHashtag}
                  onChange={(e) => setNewHashtag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addHashtag()}
                  placeholder="Add hashtag"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <Button onClick={addHashtag} variant="outline">
                Add
              </Button>
            </div>
          </div>

          {/* Scheduling Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              When to Post
            </label>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              {timeOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => setSelectedTimeOption(option.id as any)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    selectedTimeOption === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 ${option.color} rounded-lg flex items-center justify-center`}>
                      <option.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">{option.label}</span>
                  </div>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </button>
              ))}
            </div>

            {selectedTimeOption === 'custom' && (
              <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Posting to {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Save Draft
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!content.trim() || selectedPlatforms.length === 0 || createPostMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {createPostMutation.isPending ? 'Creating...' : (
                  selectedTimeOption === 'now' ? 'Post Now' : 'Schedule Post'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostScheduler;