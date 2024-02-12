const express = require("express");
const { createPostCtrl, getPostCtrl, postsCtrl, deletePostCtrl, updatePostCtrl } = require("../../controllers/postsController");

const postRouter = express.Router();

postRouter.post('/', createPostCtrl);


//GET/api/v1/posts/:id
postRouter.get('/:id', getPostCtrl);

//GET/api/v1/posts
postRouter.get('/', postsCtrl);

//DELETE/api/v1/posts/:id
postRouter.delete('/:id', deletePostCtrl);

//PUT/api/v1/posts/:id
postRouter.put('/:id', updatePostCtrl);





module.exports = postRouter;