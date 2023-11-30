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
        default: Date.now, // Set default to current timestamp
        index: { expires: '5m' } // Set the expiration time (5 minutes in this case)
    }
}
});

const clientModel= mongoose.model('clientModel', clientSchema);

export default clientModel;
