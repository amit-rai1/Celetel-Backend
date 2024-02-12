const hitTracker = {};

export const rateLimitMiddleware = (req, res, next) => {
  const { from } = req.body;
  const currentTime = Date.now();

  // Clear out any old records
  for (const number in hitTracker) {
    if (currentTime - hitTracker[number].time > 5 * 60 * 1000) {
      delete hitTracker[number];
    }
  }

  // Check if the number of hits from this number within the last 5 minutes exceeds the limit
  if (hitTracker[from] && hitTracker[from].hits >= 2) {
    return res.status(429).json({ success: false, message: 'limit exceeded pls test after 5 min' });
  }

  // Update hit count for this number
  hitTracker[from] = hitTracker[from] || { hits: 0 };
  hitTracker[from].hits++;
  hitTracker[from].time = currentTime;

  next();
};
