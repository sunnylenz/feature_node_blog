const express = require('express');
const userRouter = express.Router();
const { userRegisterCtrl, userLoginCtrl, userProfileCtrl, usersCtrl, deleteUsersCtrl, updateUserCtrl } = require('../../controllers/usersController');

userRouter.post('/register', userRegisterCtrl);

userRouter.post('/login', userLoginCtrl);

userRouter.get('/profile/:id', userProfileCtrl);

userRouter.get('/', usersCtrl);

userRouter.delete('/:id', deleteUsersCtrl);

userRouter.put('/:id', updateUserCtrl);

module.exports = userRouter;
