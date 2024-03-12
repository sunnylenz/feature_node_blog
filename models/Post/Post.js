const mongoose = require("mongoose");

// create schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "A post must have a title"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Post description is required"],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Post category is required"]
    },
    numViews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Author is required"]
    },
    photo: {
        type: String,
        // required: [true, "Post image is required"],
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

//hook
postSchema.pre(/^find/, function (next) {
    // add views count
    postSchema.virtual('viewsCount').get(function () {
        return this.numViews.length;
    });

    // add likes count
    postSchema.virtual('likesCount').get(function () {
        return this.likes.length;
    });

    // add dislikes count
    postSchema.virtual('dislikeCount').get(function () {
        return this.dislikes.length;
    });

    // check most liked post in percentage
    postSchema.virtual('likesPercentage').get(function () {
        const post = this;
        const total = +post.likes.length + +post.dislikes.length;
        const percentage = (post.likes.length / total) * 100;
        return `${percentage} %`
    });

    // check most disliked post in percentage
    postSchema.virtual('dislikesPercentage').get(function () {
        const post = this;
        const total = +post.likes.length + +post.dislikes.length;
        const percentage = (post.dislikes.length / total) * 100;
        return `${percentage} %`
    });
    // if days is less tahn zero, we return today, if 1, weturn yesterday, else return daysago
    postSchema.virtual('daysAgo').get(function () {
        const post = this;
        const date = new Date(post.createdAt);
        const daysAgo = Math.floor((Date.now() - date) / 86400000);
        return daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`;
    })
    next()
});
// compile the Post model
const Post = mongoose.model('Post', postSchema);
module.exports = Post;