import axios from 'axios';
import { storage } from './storage';
import type { SocialAccount, Post } from '@shared/schema';

export interface SocialMediaPost {
  content: string;
  mediaUrls?: string[];
  hashtags?: string[];
  scheduledAt?: Date;
}

export interface PublishResult {
  platform: string;
  success: boolean;
  postId?: string;
  error?: string;
}

export class SocialMediaService {
  
  // Facebook/Instagram posting
  async postToFacebook(account: SocialAccount, post: SocialMediaPost): Promise<PublishResult> {
    try {
      const pageId = account.accountId;
      const accessToken = account.accessToken;
      
      // Create the post content
      let message = post.content;
      if (post.hashtags && post.hashtags.length > 0) {
        message += '\n\n' + post.hashtags.join(' ');
      }
      
      const postData: any = {
        message,
        access_token: accessToken
      };
      
      // Add media if present
      if (post.mediaUrls && post.mediaUrls.length > 0) {
        // For single image/video
        if (post.mediaUrls.length === 1) {
          postData.link = post.mediaUrls[0];
        } else {
          // For multiple images, we'd need to use the batch API
          // This is a simplified version
          postData.link = post.mediaUrls[0];
        }
      }
      
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${pageId}/feed`,
        postData
      );
      
      return {
        platform: 'facebook',
        success: true,
        postId: response.data.id
      };
      
    } catch (error: any) {
      return {
        platform: 'facebook',
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }
  
  // Instagram posting (Business accounts)
  async postToInstagram(account: SocialAccount, post: SocialMediaPost): Promise<PublishResult> {
    try {
      const instagramAccountId = account.accountId;
      const accessToken = account.accessToken;
      
      if (!post.mediaUrls || post.mediaUrls.length === 0) {
        throw new Error('Instagram posts require at least one image or video');
      }
      
      // Create caption
      let caption = post.content;
      if (post.hashtags && post.hashtags.length > 0) {
        caption += '\n\n' + post.hashtags.join(' ');
      }
      
      // Step 1: Create media container
      const mediaType = post.mediaUrls[0].includes('.mp4') ? 'VIDEO' : 'IMAGE';
      const containerResponse = await axios.post(
        `https://graph.facebook.com/v18.0/${instagramAccountId}/media`,
        {
          image_url: mediaType === 'IMAGE' ? post.mediaUrls[0] : undefined,
          video_url: mediaType === 'VIDEO' ? post.mediaUrls[0] : undefined,
          caption,
          access_token: accessToken
        }
      );
      
      const containerId = containerResponse.data.id;
      
      // Step 2: Publish the container
      const publishResponse = await axios.post(
        `https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish`,
        {
          creation_id: containerId,
          access_token: accessToken
        }
      );
      
      return {
        platform: 'instagram',
        success: true,
        postId: publishResponse.data.id
      };
      
    } catch (error: any) {
      return {
        platform: 'instagram',
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }
  
  // Twitter posting
  async postToTwitter(account: SocialAccount, post: SocialMediaPost): Promise<PublishResult> {
    try {
      const accessToken = account.accessToken;
      
      // Create tweet content
      let text = post.content;
      if (post.hashtags && post.hashtags.length > 0) {
        text += ' ' + post.hashtags.join(' ');
      }
      
      const tweetData: any = {
        text: text.substring(0, 280) // Twitter character limit
      };
      
      // Add media if present
      if (post.mediaUrls && post.mediaUrls.length > 0) {
        // For Twitter, you need to upload media first and get media_ids
        // This is a simplified version
        tweetData.media = {
          media_ids: [] // Would need to upload media first
        };
      }
      
      const response = await axios.post(
        'https://api.twitter.com/2/tweets',
        tweetData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return {
        platform: 'twitter',
        success: true,
        postId: response.data.data.id
      };
      
    } catch (error: any) {
      return {
        platform: 'twitter',
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }
  
  // LinkedIn posting
  async postToLinkedIn(account: SocialAccount, post: SocialMediaPost): Promise<PublishResult> {
    try {
      const personId = account.accountId;
      const accessToken = account.accessToken;
      
      // Create post content
      let text = post.content;
      if (post.hashtags && post.hashtags.length > 0) {
        text += '\n\n' + post.hashtags.join(' ');
      }
      
      const postData = {
        author: `urn:li:person:${personId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text
            },
            shareMediaCategory: post.mediaUrls && post.mediaUrls.length > 0 ? 'IMAGE' : 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      };
      
      const response = await axios.post(
        'https://api.linkedin.com/v2/ugcPosts',
        postData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return {
        platform: 'linkedin',
        success: true,
        postId: response.data.id
      };
      
    } catch (error: any) {
      return {
        platform: 'linkedin',
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }
  
  // YouTube posting (for community posts)
  async postToYouTube(account: SocialAccount, post: SocialMediaPost): Promise<PublishResult> {
    try {
      const accessToken = account.accessToken;
      
      // YouTube community posts are more complex and require different setup
      // This is a placeholder implementation
      
      return {
        platform: 'youtube',
        success: false,
        error: 'YouTube posting not yet implemented'
      };
      
    } catch (error: any) {
      return {
        platform: 'youtube',
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }
  
  // Main method to publish to all platforms
  async publishPost(userId: number, post: SocialMediaPost, platforms: string[]): Promise<PublishResult[]> {
    const socialAccounts = await storage.getSocialAccountsByUser(userId);
    const results: PublishResult[] = [];
    
    for (const platform of platforms) {
      const account = socialAccounts.find(acc => acc.platform === platform && acc.isActive);
      
      if (!account) {
        results.push({
          platform,
          success: false,
          error: `No active ${platform} account found`
        });
        continue;
      }
      
      let result: PublishResult;
      
      switch (platform) {
        case 'facebook':
          result = await this.postToFacebook(account, post);
          break;
        case 'instagram':
          result = await this.postToInstagram(account, post);
          break;
        case 'twitter':
          result = await this.postToTwitter(account, post);
          break;
        case 'linkedin':
          result = await this.postToLinkedIn(account, post);
          break;
        case 'youtube':
          result = await this.postToYouTube(account, post);
          break;
        default:
          result = {
            platform,
            success: false,
            error: `Unsupported platform: ${platform}`
          };
      }
      
      results.push(result);
    }
    
    return results;
  }
  
  // Fetch analytics from social media platforms
  async fetchAnalytics(userId: number): Promise<void> {
    const socialAccounts = await storage.getSocialAccountsByUser(userId);
    
    for (const account of socialAccounts) {
      try {
        let analyticsData: any = {};
        
        switch (account.platform) {
          case 'facebook':
            analyticsData = await this.fetchFacebookAnalytics(account);
            break;
          case 'instagram':
            analyticsData = await this.fetchInstagramAnalytics(account);
            break;
          case 'twitter':
            analyticsData = await this.fetchTwitterAnalytics(account);
            break;
          case 'linkedin':
            analyticsData = await this.fetchLinkedInAnalytics(account);
            break;
        }
        
        // Store analytics in database
        await storage.createAnalytics({
          userId,
          platform: account.platform,
          ...analyticsData
        });
        
      } catch (error) {
        console.error(`Failed to fetch analytics for ${account.platform}:`, error);
      }
    }
  }
  
  private async fetchFacebookAnalytics(account: SocialAccount): Promise<any> {
    // Placeholder for Facebook analytics fetching
    return {
      followers: 0,
      engagement: 0,
      reach: 0,
      impressions: 0,
      likes: 0,
      comments: 0,
      shares: 0
    };
  }
  
  private async fetchInstagramAnalytics(account: SocialAccount): Promise<any> {
    // Placeholder for Instagram analytics fetching
    return {
      followers: 0,
      engagement: 0,
      reach: 0,
      impressions: 0,
      likes: 0,
      comments: 0,
      shares: 0
    };
  }
  
  private async fetchTwitterAnalytics(account: SocialAccount): Promise<any> {
    // Placeholder for Twitter analytics fetching
    return {
      followers: 0,
      engagement: 0,
      reach: 0,
      impressions: 0,
      likes: 0,
      comments: 0,
      shares: 0
    };
  }
  
  private async fetchLinkedInAnalytics(account: SocialAccount): Promise<any> {
    // Placeholder for LinkedIn analytics fetching
    return {
      followers: 0,
      engagement: 0,
      reach: 0,
      impressions: 0,
      likes: 0,
      comments: 0,
      shares: 0
    };
  }
}

export const socialMediaService = new SocialMediaService();