var mongoose = require('mongoose');

var Schema = mongoose.Schema({
    userName: {
        required: true,
        type: String
    },
    phoneNumber: {
        required: true,
        type: String,
        // validate: {
        //     validator: function (v) {
        //         // Custom validation function to check the length
        //         return v.toString().length === 10;
        //     },
        //     message: 'Phone number should be 10 digits'
        // }
    },
    otp: {
        required: false,
        type: Number
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Add a custom validator for 'mobile' field using the 'validate' method
Schema.path('phoneNumber').validate(async function (value) {
    const mobileCount = await mongoose.models.list.countDocuments({ phoneNumber: value });
    return !mobileCount;
}, 'Phone number already exists');

var user_Signup = mongoose.model('list', Schema);

module.exports = user_Signup;
