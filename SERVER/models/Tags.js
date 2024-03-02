const mongoose = require('mongoose');

const tagsSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
    },
    description:{
        type:String,
        required: true,
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course'
    }
})

const Tag = mongoose.model('Tag', tagsSchema);
module.exports = { Tag };

// module.exports = mongoose.model('Profile',profileSchema);