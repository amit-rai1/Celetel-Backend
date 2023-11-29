// models/admin.js

import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({

    fullName:{
        type:String,
        requires:true
    },
    
  email: {
    type: String,
    unique: true,
    required: true,
  },
  
  role: {
    type: String,
    required: true,
    enum: ['client'], // Make sure role is either 'admin' or 'user'
  },
  password:{
    type:String
  },
});

const clientModel= mongoose.model('clientModel', clientSchema);

export default clientModel;
