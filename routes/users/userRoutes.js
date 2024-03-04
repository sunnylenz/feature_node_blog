const express = require('express');
const storage = require("../../config/cloudinary");
const userRouter = express.Router();
const { userRegisterCtrl, userLoginCtrl, userProfileCtrl, usersCtrl, deleteUsersCtrl, updateUserCtrl, profilePhotoUploadCtrl, whoViewedMyProfile, whoViewedMyProfileCtrl, followingCtrl, unfollowCtrl } = require('../../controllers/usersController');
const multer = require("multer");
const isLoggedIn = require('../../middlewares/isLoggedIn');

//instance of multer
const upload = multer({ storage });

userRouter.post('/register', userRegisterCtrl);

userRouter.post('/login', userLoginCtrl);

userRouter.get('/profile/:id', isLoggedIn, userProfileCtrl);

userRouter.get('/', usersCtrl);

userRouter.delete('/:id', deleteUsersCtrl);

userRouter.put('/:id', updateUserCtrl);

userRouter.get('/profile-viewers/:id', isLoggedIn, whoViewedMyProfileCtrl);

userRouter.get('/following/:id', isLoggedIn, followingCtrl);

userRouter.get('/unfollowing/:id', isLoggedIn, unfollowCtrl);

userRouter.post("/profile-photo-upload", isLoggedIn, upload.single('profile'), profilePhotoUploadCtrl);

module.exports = userRouter;
