import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  otp: {
    code: {
      type: Number,
      required: false,
    },
    expiry: {
      type: Date,
      default: Date.now,
    //   default: () => new Date(Date.now() + 5 * 60 * 1000),

    },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

const OTPVerification = mongoose.model('OTPVerification', otpSchema);
export default OTPVerification;
