const express = require("express");
const storage = require("../../config/cloudinary");
const multer = require("multer")
const { createPostCtrl, getPostCtrl, postsCtrl, deletePostCtrl, updatePostCtrl, toggleLikesCtrl, toggleDislikesCtrl } = require("../../controllers/postsController");
const isLoggedIn = require("../../middlewares/isLoggedIn");

const postRouter = express.Router();

//file upload middleware
const upload = multer({ storage })

postRouter.post('/', isLoggedIn, upload.single("image"), createPostCtrl);


//GET/api/v1/posts/:id
postRouter.get('/:id', isLoggedIn, getPostCtrl);

postRouter.get('/likes/:id', isLoggedIn, toggleLikesCtrl);
postRouter.get('/dislikes/:id', isLoggedIn, toggleDislikesCtrl);

//GET/api/v1/posts
postRouter.get('/', isLoggedIn, postsCtrl);

//DELETE/api/v1/posts/:id
postRouter.delete('/:id', isLoggedIn, deletePostCtrl);

//PUT/api/v1/posts/:id
postRouter.put('/:id', updatePostCtrl);





module.exports = postRouter;