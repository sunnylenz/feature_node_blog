const express = require('express');
const storage = require("../../config/cloudinary");
const userRouter = express.Router();
const { userRegisterCtrl, userLoginCtrl, userProfileCtrl, usersCtrl, deleteUsersCtrl, updateUserCtrl, profilePhotoUploadCtrl } = require('../../controllers/usersController');
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
userRouter.post("/profile-photo-upload", upload.single('profile'), profilePhotoUploadCtrl);

module.exports = userRouter;
