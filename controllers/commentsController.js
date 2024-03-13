const Comment = require("../models/Comment/Comment");
const Post = require("../models/Post/Post");
const User = require("../models/User/User");
const { AppErr } = require("../utils/appErr");

// create comment
const createCommentCtrl = async (req, res, next) => {
    const { description } = req.body;
    try {
        // find the post
        const post = await Post.findById(req.params.id);
        // find the user
        const user = await User.findById(req.userAuth);
        // create comment
        const comment = await Comment.create({
            post: post._id,
            description,
            user: req.userAuth,
        });
        // push the comment to post
        post.comments.push(comment._id);
        // push to the user
        user.comments.push(comment._id);
        // disable validation
        // save
        await post.save({ validateBeforeSave: false });
        await user.save({ validateBeforeSave: false });
        res.json({
            status: 'success',
            data: comment,
        })
    } catch (error) {
        next(new AppErr(error.message));
    }
}

const commentCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'comment route'
        })
    } catch (error) {
        res.json(error.message);
    }
}
const deleteCommentCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'delete comment route'
        });
    } catch (error) {
        res.json(error.message);
    }
}

const updateCommentCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'comment update'
        });
    } catch (error) {
        res.json(error.message);
    }
}

module.exports = {
    createCommentCtrl,
    commentCtrl,
    deleteCommentCtrl,
    updateCommentCtrl
}