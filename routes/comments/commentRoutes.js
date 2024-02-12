const express = require('express');
const commentRouter = express.Router();
const { commentCtrl, deleteCommentCtrl, updateCommentCtrl, createCommentCtrl } = require('../../controllers/commentsController');


//POST/api/v1/comments
commentRouter.post('/', createCommentCtrl);


//GET/api/v1/posts/:id
commentRouter.get('/:id', commentCtrl);


//DELETE/api/v1/comments/:id
commentRouter.delete('/:id', deleteCommentCtrl);

//PUT/api/v1/comments/:id
commentRouter.put('/:id', updateCommentCtrl);

module.exports = commentRouter;