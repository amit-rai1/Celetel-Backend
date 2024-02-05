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
  },
  {
    timestamps: true,
  }
);

const otpTesting = mongoose.model('otpTesting', otpTestingSchema);

module.exports = otpTesting;
