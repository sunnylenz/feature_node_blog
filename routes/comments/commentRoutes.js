const express = require('express');
const commentRouter = express.Router();
const { deleteCommentCtrl, updateCommentCtrl, createCommentCtrl } = require('../../controllers/commentsController');
const isLoggedIn = require("../../middlewares/isLoggedIn");

//POST/api/v1/comments
commentRouter.post('/:id', isLoggedIn, createCommentCtrl);

//DELETE/api/v1/comments/:id
commentRouter.delete('/:id', isLoggedIn, deleteCommentCtrl);

//PUT/api/v1/comments/:id
commentRouter.put('/:id', isLoggedIn, updateCommentCtrl);

module.exports = commentRouter;