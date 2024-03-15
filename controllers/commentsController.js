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

const deleteCommentCtrl = async (req, res, next) => {
    try {

        //find the comment
        const comment = await Comment.findById(req.params.id);
        if (comment.user.toString() !== req.userAuth.toString()) {
            return next(new AppErr("You are not allowed to delete  this comment", 403));
        }

        await Comment.findByIdAndDelete(req.params.id);
        res.json({
            status: 'success',
            data: 'comment successfully deleted'
        });
    } catch (error) {
        next(new AppErr(error.message));
    }
}

const updateCommentCtrl = async (req, res, next) => {
    const { description } = req.body;
    try {
        //find the comment
        const comment = await Comment.findById(req.params.id);
        if (comment.user.toString() !== req.userAuth.toString()) {
            return next(new AppErr("You are not allowed to update this comment", 403));
        }
        const updatedComment = await Comment.findByIdAndUpdate(req.params.id, {
            description
        }, {
            new: true, runValidators: true
        })
        res.json({
            status: 'success',
            data: updatedComment,
        });
    } catch (error) {
        next(new AppErr(error.message));
    }
}

module.exports = {
    createCommentCtrl,
    deleteCommentCtrl,
    updateCommentCtrl,
}