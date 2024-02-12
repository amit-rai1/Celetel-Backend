// const hitTracker = {};

// export const rateLimitMiddleware = (req, res, next) => {
//   const { from } = req.body;
//   const currentTime = Date.now();

//   // Clear out any old records
//   for (const number in hitTracker) {
//     if (currentTime - hitTracker[number].time > 5 * 60 * 1000) {
//       delete hitTracker[number];
//     }
//   }

//   // Check if the number of hits from this number within the last 5 minutes exceeds the limit
//   if (hitTracker[from] && hitTracker[from].hits >= 2) {
//     return res.status(429).json({ success: false, message: 'limit exceeded pls test after 5 min' });
//   }

//   // Update hit count for this number
//   hitTracker[from] = hitTracker[from] || { hits: 0 };
//   hitTracker[from].hits++;
//   hitTracker[from].time = currentTime;

//   next();
// };
const otpTesting = require('../model/otpTesting');

export const rateLimitMiddleware = async (req, res, next) => {
    const { recipient } = req.body;
  
    try {
      // Use the "recipient" field as the "from" number
      const from = recipient;
  
      // Find or create the rate limit entry for this phone number
      let otpData = await otpTesting.findOne({ from });
  
      if (!otpData) {
        otpData = new otpTesting({ from, rateLimit: { hits: 0, lastHitTimestamp: Date.now() } });
      }
  
      const currentTime = Date.now();
      const fiveMinutesAgo = new Date(currentTime - 5 * 60 * 1000);
  
      // Check if the last hit was more than 5 minutes ago, if so, reset the hit count
      if (otpData.rateLimit && otpData.rateLimit.lastHitTimestamp < fiveMinutesAgo) {
        otpData.rateLimit.hits = 0;
      }
  
      // Check if the number of hits within the last 5 minutes exceeds the limit
      if (otpData.rateLimit && otpData.rateLimit.hits >= 2) {
        return res.status(429).json({ success: false, message: 'Limit exceeded. Please test again after 5 minutes' });
      }
  
      // Update hit count and timestamp
      otpData.rateLimit = otpData.rateLimit || { hits: 0, lastHitTimestamp: currentTime };
      otpData.rateLimit.hits++;
      otpData.rateLimit.lastHitTimestamp = currentTime;
  
      // Save the rate limit entry to the database
      await otpData.save();
  
      next();
    } catch (error) {
      console.error('Error checking rate limit:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };