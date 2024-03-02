const mongoose = require('mongoose');

const ratingAndReviewsSchema = new mongoose.Schema({
    user: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:'User'
        }
    ],
    rating:{
        type:String,
        required: true,
    },
    review:{
        type:String,
        required: true,
    }
})

const RatingAndReviews = mongoose.model('RatingAndReviews', ratingAndReviewsSchema);
module.exports = { RatingAndReviews };

// module.exports = mongoose.model('Profile',profileSchema);