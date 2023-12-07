// models/admin.js

import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({

    fullName:{
        type:String,
        requires:false
    },
    
  email: {
    type: String,
    unique: true,
    required: true,
  },
  
  country:{
    type:String
  },

  role: {
    type: String,
    required: false,
    enum: ['client'], // Make sure role is either 'admin' or 'user'
  },
  password:{
    type:String
  },
  otp: {
    code: {
        type: Number,
        required: false
    },
    expiry: {
      type: Date,
      default: Date.now,
    },

    isVerified: {
      type: Boolean,
      default: false, // Set default value to false
    },
}
});

const clientModel= mongoose.model('clientModel', clientSchema);

export default clientModel;
