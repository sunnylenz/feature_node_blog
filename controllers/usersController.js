const bcrypt = require('bcryptjs');

const User = require("../models/User/User");
const generateToken = require("../utils/generateToken");
const getTokenFromHeader = require('../utils/getTokenFromHeader');




const userRegisterCtrl = async (req, res, next) => {
    const { firstname, lastname, profilePhoto, email, password } = req.body
    try {
        //check if email exist
        const userFound = await User.findOne({ email });
        if (userFound) {
            return next(new Error("User Already Exists"));
        }

        // hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create the user
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword
        });
        res.json({
            status: "success",
            data: user,
        });
    } catch (error) {
        next(new Error(error.message));
    }                         
}


const userLoginCtrl = async (req, res) => {
    const { email, password } = req.body;
    try {
        //check if email exists
        const userFound = await User.findOne({ email });
        // verify password
        const isPasswordMatched = await bcrypt.compare(password, userFound.password);
        if (!userFound || !isPasswordMatched) {
            return res.json({
                msg: "Invalid login credentials"
            });
        }
        res.json({
            status: 'success',
            data: {
                firstname: userFound.firstname,
                lastname: userFound.lastname,
                email: userFound.email,
                isAdmin: userFound.isAdmin,
                token: generateToken(userFound._id),
            },
        });
    } catch (error) {
        res.json(error.message);
    }
}

const userProfileCtrl = async (req, res) => {
    console.log(req.userAuth);
    const { id } = req.params;
    try {
        // get token from header
        const token = getTokenFromHeader(req);

        const user = await User.findById(id);
        res.json({
            status: 'success',
            data: user,
        })
    } catch (error) {
        res.json(error.message);
    }
}

const usersCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'users route'
        })
    } catch (error) {
        res.json(error.message);
    }
}

const deleteUsersCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'delete user route'
        })
    } catch (error) {
        res.json(error.message);
    }
}

const updateUserCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'user update'
        })
    } catch (error) {
        res.json(error.message);
    }
}

module.exports = {
    userRegisterCtrl,
    userLoginCtrl,
    userProfileCtrl,
    usersCtrl,
    deleteUsersCtrl,
    updateUserCtrl
}