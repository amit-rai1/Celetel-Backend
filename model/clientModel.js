import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    unique: true,
    // required: true,
  },
  // isEmailVerified: {
  //   type: Boolean,
  //   default: false,
  // },
  phone: {
    type: Number,
  },
  country: {
    type: String,
  },
  role: {
    type: String,
    required: false,
    enum: ['client'],
  },
  password: {
    type: String,
  },
  otp: {
    code: {
      type: Number,
      required: false,
    },
    expiry: {
      type: Date,
      default: Date.now,
    },
    // isVerified: {
    //   type: Boolean,
    //   default: false,
    // },
  },
});

const clientModel = mongoose.model('clientModel', clientSchema);
export default clientModel;
