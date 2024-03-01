const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    sectionName:{
        type: String,
    },
    subSection:[
        {
            type:mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'SubSection'
        }
    ]
})

const Section = mongoose.model('Section',sectionSchema);
module.exports = {Section};

// module.exports = mongoose.model('Profile',profileSchema);