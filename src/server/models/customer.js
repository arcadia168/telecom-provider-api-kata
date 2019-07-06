// grab the mongoose module
const mongoose = require('mongoose');

// define our shopping cart item model
const CustomerSchema = new mongoose.Schema({
    id: String,
    name: String,
    phoneNumbers: [PhoneNumberSchema],
})

const PhoneNumberSchema = new mongoose.Schema({
    phoneNumber: String,
})

module.exports = mongoose.model('Customer', CustomerSchema);
