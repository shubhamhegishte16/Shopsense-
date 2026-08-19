const cron = require('node-cron');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const User = require('../models/User');

// ponytail: Laziest recall simulator. Real API would go here later.
const MOCK_RECALL_DATA = [
  { product: 'contaminated lettuce', reason: 'E. coli risk', severity: 'High' }
];

const startRecallCron = () => {
  // Run daily at midnight: '0 0 * * *'
  // For demo/testing: run every 10 minutes '*/10 * * * *'
  cron.schedule('*/10 * * * *', async () => {
    try {
      console.log('🛡️  Running Automated Food Recall Check...');
      
      for (const item of MOCK_RECALL_DATA) {
        const normalized = item.product.toLowerCase().trim();
        
        // Find products matching the recalled item
        const products = await Product.find({ 
          normalizedName: { $regex: normalized, $options: 'i' },
          recallStatus: { $ne: 'Recalled' } 
        });

        if (products.length > 0) {
          console.log(`⚠️  Found ${products.length} new recalled products matching: ${item.product}`);
          
          for (const p of products) {
            p.recallStatus = 'Recalled';
            await p.save();

            // Find users who bought this
            const users = await User.find({ accountStatus: 'active' });
            
            const notifications = users.map(u => ({
              userId: u._id,
              type: 'recall',
              title: `Product Recall: ${p.name}`,
              message: `A product you may have purchased has been recalled: ${item.reason}. Severity: ${item.severity}.`,
            }));

            if (notifications.length > 0) {
               await Notification.insertMany(notifications);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in recall cron job:', error);
    }
  });
};

module.exports = startRecallCron;
