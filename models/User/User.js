const mongoose = require("mongoose");

//create schema
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "First Name is required"],
    },
    lastname: {
        type: String,
        required: [true, "Last name is required"]
    },
    profilePhoto: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "Password is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },

    isBlocked: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['Admin', 'Guest', 'Editor'],
    },
    viewers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    }],
    blocked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    // plan: {
    //     type: String,
    //     enum: ['Free', 'Premium', 'Pro'],
    //     default: 'Free'
    // },
    userAward: {
        type: String,
        enum: ['Bronze', 'Silver', 'Gold'],
        default: 'Bronze'
    },
}, { timestamps: true, toJSON: { virtuals: true } });

//hooks
//pre - before record is saved /find/findOne
userSchema.pre(/^find/, function (next) {
    console.log('pre hook called');
    next();
})
//post - after saving
userSchema.post('save', function (next) {
    console.log('Post hook called');
    next()
});

// get fullname
userSchema.virtual("fullname").get(function () {
    return `${this.firstname} ${this.lastname}`
});

// get initials
userSchema.virtual('initials').get(function () {
    return `${this.firstname[0]}${this.lastname[0]}`
});

//get post count
userSchema.virtual('postCounts').get(function () {
    return this.posts.length;
});

//get followers count
userSchema.virtual('followersCount').get(function () {
    return this.followers.length;
});

//get followings count
userSchema.virtual("followingsCount").get(function () {
    return this.following.length;
});
// get viewers count
userSchema.virtual('viewersCount').get(function () {
    return this.viewers.length;
});
// get blocked count
userSchema.virtual('blockedCount').get(function () {
    return this.blocked.length;
});
// Compile the user model
const User = mongoose.model('User', userSchema);
module.exports = User;