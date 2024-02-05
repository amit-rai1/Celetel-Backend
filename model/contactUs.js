const mongoose = require('mongoose');

const contactUsSchema = new mongoose.Schema({
    name: String,
    email: String,
    service: String,
    budget: String,
    message: String
}, {
    timestamps: true 
});

const contactUs = mongoose.model('ContactUs', contactUsSchema);

export default contactUs;
