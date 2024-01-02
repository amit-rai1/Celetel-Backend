import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      unique: true,
      // required: true,
    },
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

    googleId:String,
    displayName:String,
    image:String,

  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const clientModel = mongoose.model('clientModel', clientSchema);
export default clientModel;
