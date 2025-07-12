import cron from 'node-cron';
import { storage } from './storage';
import { socialMediaService } from './socialMediaService';

export const startScheduler = () => {
  console.log('[scheduler] Post scheduler started');
  
  // Check for scheduled posts every minute
  cron.schedule('* * * * *', async () => {
    try {
      const scheduledPosts = await storage.getScheduledPosts();
      const now = new Date();
      
      for (const post of scheduledPosts) {
        if (post.scheduledAt && new Date(post.scheduledAt) <= now) {
          console.log(`[scheduler] Processing post ${post.id}: ${post.title}`);
          
          // Check if user has connected social accounts for the selected platforms
          const socialAccounts = await storage.getSocialAccountsByUser(post.userId);
          const connectedPlatforms = socialAccounts
            .filter(account => account.isActive)
            .map(account => account.platform.toLowerCase());
          
          const requestedPlatforms = (post.platforms || []).map(p => p.toLowerCase());
          const availablePlatforms = requestedPlatforms.filter(platform => 
            connectedPlatforms.includes(platform)
          );
          
          if (availablePlatforms.length === 0) {
            // No connected platforms - mark as pending manual posting
            await storage.updatePost(post.id, {
              status: 'pending_manual_posting'
            });
            console.log(`[scheduler] Post ${post.id} set to pending manual posting - no connected accounts`);
          } else if (availablePlatforms.length < requestedPlatforms.length) {
            // Some platforms connected - publish to available ones, mark as partial
            const publishResults = await socialMediaService.publishPost(
              post.userId,
              {
                content: post.content,
                mediaUrls: post.mediaUrls || [],
                hashtags: post.hashtags || [],
                scheduledAt: post.scheduledAt
              },
              availablePlatforms
            );
            
            await storage.updatePost(post.id, {
              status: 'partially_posted',
              publishedAt: new Date(),
              publishResults: JSON.stringify(publishResults)
            });
            console.log(`[scheduler] Post ${post.id} partially published to ${availablePlatforms.length}/${requestedPlatforms.length} platforms`);
          } else {
            // All platforms connected - publish normally
            const publishResults = await socialMediaService.publishPost(
              post.userId,
              {
                content: post.content,
                mediaUrls: post.mediaUrls || [],
                hashtags: post.hashtags || [],
                scheduledAt: post.scheduledAt
              },
              availablePlatforms
            );
            
            const allSuccessful = publishResults.every(result => result.success);
            await storage.updatePost(post.id, {
              status: allSuccessful ? 'posted' : 'failed',
              publishedAt: new Date(),
              publishResults: JSON.stringify(publishResults)
            });
            
            console.log(`[scheduler] Post ${post.id} published with status: ${allSuccessful ? 'posted' : 'failed'}`);
          }
        }
      }
    } catch (error) {
      console.error('[scheduler] Error processing scheduled posts:', error);
    }
  });
};