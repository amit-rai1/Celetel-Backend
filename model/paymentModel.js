import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      merchentUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClientModel',
        required: true,
      },
      merchantTransactionId: {
        type: String,
       
        },
      }
  
);

const paymentModel = mongoose.model('paymentModel', paymentSchema);
export default paymentModel;
