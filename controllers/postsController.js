const Post = require("../models/Post/Post");
const User = require("../models/User/User");
const { AppErr } = require("../utils/appErr");
// creates a post
const createPostCtrl = async (req, res, next) => {
    const { title, description, category } = req.body
    try {
        //1. find the user
        const author = await User.findById(req.userAuth);
        // check if the user is blocked
        if (author.isBlocked) {
            return next(new AppErr("Access denied, account blocked", 403));
        }
        //2. create the post
        const postCreated = await Post.create({
            title,
            description,
            category,
            user: author._id,
        });
        //3. associate user to the post
        author.posts.push(postCreated);
        //4. save 
        await author.save();
        res.json({
            status: 'success',
            data: postCreated
        })
    } catch (error) {
        next(new AppErr(error.message));
    }
}

// gets a single post
const getPostCtrl = async (req, res, next) => {
    //
    try {
        // find the post
        const post = await Post.findById(req.params.id);
        // number of views
        //check if user has viewed this post
        const isViewed = post.numViews.includes(req.userAuth);
        if (isViewed) {
            res.json({
                status: 'success',
                data: post,
            });
        } else {
            // push the user into num of views
            post.numViews.push(req.userAuth);
            // save
            await post.save();
            res.json({
                status: 'success',
                data: post,
            });

        }
    } catch (error) {
        next(new AppErr(error.message));
    }
}

// toggle likes
const toggleLikesCtrl = async (req, res, next) => {
    try {
        // 1. get the post
        const post = await Post.findById(req.params.id);
        // 2. check if the user has already liked the post
        const isLiked = post.likes.includes(req.userAuth);
        // 3. if the user has already liked the pos, then unlike
        if (isLiked) {
            post.likes = post.likes.filter(like => like != req.userAuth);
            await post.save();
        } else {
            //4 if the user has not liked the post, like the post
            post.likes.push(req.userAuth);
            await post.save();
        }
        res.json({
            status: 'success',
            data: 'You have succesfully liked this post'
        })
    } catch (error) {
        next(new AppErr(error.message));
    }
}

//toggle dislike
const toggleDislikesCtrl = async (req, res, next) => {
    try {
        // 1. get the post
        const post = await Post.findById(req.params.id);
        // 2. check if the user has already liked the post
        const isUnliked = post.dislikes.includes(req.userAuth);
        // 3. if the user has already unliked the pos, then unlike
        if (isUnliked) {
            post.dislikes = post.dislikes.filter(dislike => dislike.toString() !== req.userAuth.toString());
            await post.save();
        } else {
            //4 if the user has not liked the post, like the post
            post.dislikes.push(req.userAuth);
            await post.save();
        }
        res.json({
            status: 'success',
            data: 'You have succesfully disliked this post'
        });
    } catch (error) {
        next(new AppErr(error.message));
    }
}


// returns an array of all posts
const postsCtrl = async (req, res, next) => {
    try {
        //Find all posts
        const posts = await Post.find({})
            .populate("category", "title")
            .populate("user");

        //check if the user is blocked by the post owner
        const filteredPosts = posts.filter(post => {
            // get all blocked users
            const blockedUsers = post.user.blocked;
            //console.log(blockedUsers);
            // check if the users id is the post owners blocked users array
            const isBlocked = blockedUsers.includes(req.userAuth);

            return !isBlocked;
        });


        res.json({
            status: "success",
            results: posts.length,
            data: filteredPosts,
        });
    } catch (error) {
        next(new AppErr(error.message));
    }
}


// deetes the given post
const deletePostCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'delete post route'
        });
    } catch (error) {
        res.json(error.message);
    }
}


// updates the given post
const updatePostCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'post update'
        })
    } catch (error) {
        res.json(error.message);
    }
}


module.exports = {
    createPostCtrl,
    getPostCtrl,
    postsCtrl,
    deletePostCtrl,
    updatePostCtrl,
    toggleLikesCtrl,
    toggleDislikesCtrl,
}