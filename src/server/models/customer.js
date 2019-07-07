const mongoose = require('mongoose');

const PhoneNumberSchema = new mongoose.Schema({
    id: String,
    phoneNumber: String,
    activated: Boolean,
}, { _id: false });

const CustomerSchema = new mongoose.Schema({
    id: String,
    name: String,
    phoneNumbers: [PhoneNumberSchema],
});

module.exports = mongoose.model('Customer', CustomerSchema);
