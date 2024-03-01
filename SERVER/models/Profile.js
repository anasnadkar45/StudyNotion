const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    firstgenderName:{
        type: String,
    },
    dateOfBirth:{
        type: String,
    },
    contactNumber:{
        type: Number,
        trim : true,
    },
    about:{
        type: String,
        trim: true,
    },
})

const Profile = mongoose.model('Profile',profileSchema);
module.exports = {Profile};

// module.exports = mongoose.model('Profile',profileSchema);