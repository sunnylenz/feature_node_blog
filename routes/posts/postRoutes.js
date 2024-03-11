const express = require("express");
const { createPostCtrl, getPostCtrl, postsCtrl, deletePostCtrl, updatePostCtrl } = require("../../controllers/postsController");
const isLoggedIn = require("../../middlewares/isLoggedIn");

const postRouter = express.Router();

postRouter.post('/', isLoggedIn, createPostCtrl);


//GET/api/v1/posts/:id
postRouter.get('/:id', getPostCtrl);

//GET/api/v1/posts
postRouter.get('/', isLoggedIn, postsCtrl);

//DELETE/api/v1/posts/:id
postRouter.delete('/:id', deletePostCtrl);

//PUT/api/v1/posts/:id
postRouter.put('/:id', updatePostCtrl);





module.exports = postRouter;