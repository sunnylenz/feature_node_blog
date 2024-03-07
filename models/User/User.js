const mongoose = require("mongoose");
const Post = require("../Post/Post");

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
userSchema.pre("findOne", async function (next) {

    // get the id of the user
    const userId = this._conditions._id;
    // find the post created by the user
    const posts = await Post.find({ user: userId });
    // get last post from the user
    const lastPost = posts[posts.length - 1];
    // get the last post date
    const lastPostDate = new Date(lastPost.createdAt);
    //get last post date in string format
    const lastPostDateStr = lastPostDate.toDateString();
    // add virtual property to the user
    userSchema.virtual("lastPostDate").get(function () {
        return lastPostDateStr;
    });

    // ...........................Check if a user is inactive for 30 days....................................
    // get current date
    const currentDate = new Date();
    // get the difference between the last post date and current date
    const diff = currentDate - lastPostDate;
    // get the difference in days
    const diffInDays = diff / (1000 * 3600 * 24);
    if (diffInDays > 30) {
        // add virtuals isInactive to the schema to check if a user is inactive for 30 days
        userSchema.virtual('isInActive').get(function () {
            return true;
        });

        // find the user by ID and update
        await User.findByIdAndUpdate(userId, {
            isBlocked: true,
        }, {
            new: true
        });
    } else {
        userSchema.virtual('isInactive').get(function () {
            return false;
        });

        // find the user by ID and update
        await User.findByIdAndUpdate(userId, {
            isBlocked: false,
        }, {
            new: true
        });
    }

    //.....................Last active date ................///
    const daysAgo = Math.floor(diffInDays);
    // add virtuals lastActive in days to the schema
    userSchema.virtual('lastActive').get(function () {
        // check if daysAgo is less than 0
        if (daysAgo <= 0) {
            return "Today";
        }
        // check if daysAgo is eaqual to 1
        if (daysAgo === 1) {
            return "Yesterday";
        }

        // check if daysAgo is more than 1
        if (daysAgo > 1) {
            return `${daysAgo} days ago`
        }
    });

    //.............................................
    //Update user award based on the number of post
    //.............................................
    //get the number of posts
    const numberOfPost = posts.length;
    // check if number of post is less than 10
    if (numberOfPost < 10) {
        await User.findByIdAndUpdate(userId, {
            userAward: "Bronze",
        }, {
            new: true,
        });
    }
    // check if the number of post is greater than 10
    if (numberOfPost > 10) {
        await User.findByIdAndUpdate(userId, {
            userAward: "Silver",
        }, {
            new: true,
        });
    }

    // check if the number of post is more than 20
    if (numberOfPost > 20) {
        await User.findByIdAndUpdate(userId, {
            userAward: "Gold",
        }, {
            new: true,
        });
    }


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