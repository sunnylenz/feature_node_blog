const Post = require("../models/Post/Post");
const User = require("../models/User/User");
// creates a post
const createPostCtrl = async (req, res) => {
    const { title, description } = req.body
    try {
        //1. find the user
        const author = await User.findById(req.userAuth);
        //2. create the post
        const postCreated = await Post.create({
            title,
            description,
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
        res.json(error.message);
    }
}

// gets a single post
const getPostCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'post route'
        })
    } catch (error) {
        res.json(error.message);
    }
}

// returns an array of all posts
const postsCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'posts route'
        })
    } catch (error) {
        res.json(error.message);
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
}