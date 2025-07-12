import cron from 'node-cron';
import { storage } from './storage';
import { log } from './vite';

// Check for scheduled posts every minute
export const startScheduler = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const scheduledPosts = await storage.getScheduledPosts();
      
      for (const post of scheduledPosts) {
        // Update post status to "posted"
        await storage.updatePost(post.id, { status: 'posted' });
        log(`Post "${post.title}" has been posted for user ${post.userId}`, 'scheduler');
        
        // Here you would integrate with social media APIs
        // For now, we're just marking as posted
      }
    } catch (error) {
      log(`Scheduler error: ${error}`, 'scheduler');
    }
  });
  
  log('Post scheduler started', 'scheduler');
};