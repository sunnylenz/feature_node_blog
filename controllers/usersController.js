const bcrypt = require('bcryptjs');

const User = require("../models/User/User");
const generateToken = require("../utils/generateToken");
const getTokenFromHeader = require('../utils/getTokenFromHeader');
const { AppErr } = require('../utils/appErr');



const userRegisterCtrl = async (req, res, next) => {
    const { firstname, lastname, profilePhoto, email, password } = req.body
    try {
        //check if email exist
        const userFound = await User.findOne({ email });
        if (userFound) {
            return next(new AppErr("User Already Exists", 500));
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
        next(new AppErr(error.message));
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
// following
const followingCtrl = async (req, res, next) => {
    try {
        // 1. find the user to follow
        const userToFollow = await User.findById(req.params.id);
        // 2. find the user who is following
        const userWhoFollowed = await User.findById(req.userAuth);
        // 3. check if user and user  who followed are found
        if (userToFollow && userWhoFollowed) {
            // 4. check if user who followed is already on the users followers array
            const isAlreadyFollowed = userToFollow.followers.find(follower => follower.toString() === userWhoFollowed._id.toString())
            if (isAlreadyFollowed) {
                return next(new AppErr("You already followed this user"));
            } else {
                // 5. push user who followed to  the users followers array
                userToFollow.followers.push(userWhoFollowed._id);
                // 6. push usertofollow to the userwhofollowed following array
                userWhoFollowed.following.push(userToFollow._id);
                // 7. save the users
                await userWhoFollowed.save();
                await userToFollow.save();
                res.json({
                    status: 'success',
                    data: 'you have successfully followed this user'
                })

            }
        }

    } catch (error) {
        res.json(error.message);
    }
}

// who viewd my profile
const whoViewedMyProfileCtrl = async (req, res, next) => {
    try {
        //1. find the original user
        const user = await User.findById(req.params.id);
        //2. find the user who viewd the original user profile
        const userWhoViewed = await User.findById(req.userAuth);
        // check if the original user and who viewed profile are found
        if (user && userWhoViewed) {
            //4. check if the user who viewd is already in the users viewers array
            const isUserAlreadyViewed = user.viewers.find(viewer => viewer.toString() === userWhoViewed._id.toJSON());
            if (isUserAlreadyViewed) {
                return next(new AppErr("You already viewed this profile"));
            } else {
                //5. Push the userwhovied to the users viewers array
                user.viewers.push(userWhoViewed._id);
                //6. save the user
                await user.save();

                res.json({
                    status: 'success',
                    data: 'you have successfully viewed this profile'
                })
            }
        }
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
const profilePhotoUploadCtrl = async (req, res) => {
    console.log(req.file);
    try {
        //1. Find the user to be updated
        const userToUpdate = await User.findById(req.userAuth);
        //2. check if the user is found
        if (!userToUpdate) {
            return next(new AppErr("User not found", 403));
        }
        //3. check if the user is blocked
        if (userToUpdate.isBlocked) {
            return next(new AppErr("Action not allowed", 403));
        }
        //4. Check if a user is updating their photo
        if (req) {
            //5. update profile
            await User.findByIdAndUpdate(
                req.userAuth,
                {
                    $set: {
                        profilePhoto: req.file.path,
                    },
                },
                {
                    new: true,
                }
            );
            res.json({
                status: 'success',
                data: 'you have succesfully updated your profile photo'
            });

        }

    } catch (error) {
        res.json(new AppErr(error.message, 500));
    }
}

module.exports = {
    userRegisterCtrl,
    userLoginCtrl,
    userProfileCtrl,
    usersCtrl,
    deleteUsersCtrl,
    updateUserCtrl,
    whoViewedMyProfileCtrl,
    profilePhotoUploadCtrl,
    followingCtrl,
}