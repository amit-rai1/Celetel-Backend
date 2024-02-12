const mongoose = require('mongoose');

const shortMessageSchema = new mongoose.Schema({
  message: {
    type: String,
    // required: true,
  },
  corelationId: {
    type: String,
    // required: true,
  },
  dltContentId: {
    type: String,
    // required: true,
  },
  recipient: {
    type: String,
    // required: true,
  },
});

const otpTestingSchema = new mongoose.Schema(
  {
    credentials: {
      password: {
        type: String,
        // required: true,
      },
      user: {
        type: String,
        // required: true,
      },
    },
    options: {
      dltPrincipalEntityId: {
        type: String,
        // required: true,
      },
    },
    from: {
      type: String,
      // required: true,
    },
    recipient: {
      type: String,
    //   required: true,
    },
    shortMessages: {
      type: [shortMessageSchema],
    },
    rateLimit: {
      hits: { type: Number, default: 0 },
      lastHitTimestamp: { type: Date, default: Date.now() }
    }
  },
  {
    timestamps: true,
  }
);

const otpTesting = mongoose.model('otpTesting', otpTestingSchema);

module.exports = otpTesting;
