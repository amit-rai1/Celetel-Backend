const mongoose = require('mongoose');



const otpLogs = new mongoose.Schema(
  {
   
    recipient: {
      type: String,
    },
    isDeleted:{
        default:false
    }
    
  },
  {
    timestamps: true,
  }
);

const otpTestingLogs = mongoose.model('otpTestingLogs', otpLogs);

module.exports = otpTestingLogs;
