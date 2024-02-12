const express = require('express');
const userRouter = express.Router();
const { userRegisterCtrl, userLoginCtrl, userProfileCtrl, usersCtrl, deleteUsersCtrl, updateUserCtrl } = require('../../controllers/usersController');
const isLoggedIn = require('../../middlewares/isLoggedIn');

userRouter.post('/register', userRegisterCtrl);

userRouter.post('/login', userLoginCtrl);

userRouter.get('/profile/:id', isLoggedIn, userProfileCtrl);

userRouter.get('/', usersCtrl);

userRouter.delete('/:id', deleteUsersCtrl);

userRouter.put('/:id', updateUserCtrl);

module.exports = userRouter;
