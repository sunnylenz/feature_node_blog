const bcrypt = require('bcryptjs');

const User = require("../models/User/User");
const generateToken = require("../utils/generateToken");
const getTokenFromHeader = require('../utils/getTokenFromHeader');
const { AppErr } = require('../utils/appErr');
const Post = require('../models/Post/Post');
const Comment = require('../models/Comment/Comment');
const Category = require('../models/Category/Category');



const userRegisterCtrl = async (req, res, next) => {
    const { firstname, lastname, email, password } = req.body
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


const userLoginCtrl = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        //check if email exists
        const userFound = await User.findOne({ email });
        if (!userFound) {
            return next(new AppErr("Invalid login credentials"));
        }
        // verify password
        const isPasswordMatched = await bcrypt.compare(password, userFound.password);
        if (!isPasswordMatched) {
            return next(new AppErr("Invalid login credentials"));
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
        next(new AppErr(error.message));
    }
}

const userProfileCtrl = async (req, res, next) => {

    const { id } = req.params;
    try {
        //get token from header
        const token = getTokenFromHeader(req);

        const user = await User.findById(id);
        res.json({
            status: 'success',
            data: user,
        })
    } catch (error) {
        next(new AppErr(error.message));
    }
}

const usersCtrl = async (req, res, next) => {
    try {
        const users = await User.find();
        res.json({
            status: 'success',
            results: users.length,
            data: users,
        })
    } catch (error) {
        next(new AppErr(error.message));
    }
}
//Admin unblocking a user
const adminUnblockCtrl = async (req, res, next) => {
    try {
        // 1. find the user to be unblocked by the admin
        const userToBeUnBlockedByAdmin = await User.findById(req.params.id);
        // 2.  check if user is found
        if (!userToBeUnBlockedByAdmin) {
            return next(new AppErr("User not found"));
        }

        if (userToBeUnBlockedByAdmin.isBlocked === false) {
            return next(new AppErr("You have not  blocked this user"));
        }
        // 3. change isBlocked user field to true
        userToBeUnBlockedByAdmin.isBlocked = false;
        //4. save the user
        await userToBeUnBlockedByAdmin.save();
        res.json({
            status: 'success',
            data: 'Admin has succefully unblocked this user'
        })
    } catch (error) {
        next(new AppErr(error.message));
    }
}

// admin block controller
const adminBlockCtrl = async (req, res, next) => {
    try {
        // 1. find the user to be blocked by the admin
        const userToBeBlockedByAdmin = await User.findById(req.params.id);
        // 2.  check if user is found
        if (!userToBeBlockedByAdmin) {
            return next(new AppErr("User not found"));
        }

        if (userToBeBlockedByAdmin.isBlocked === true) {
            return next(new AppErr("User already blocked by admin"));
        }
        // 3. change isBlocked user field to true
        userToBeBlockedByAdmin.isBlocked = true;
        //4. save the user
        await userToBeBlockedByAdmin.save();
        res.json({
            status: 'success',
            data: 'Admin has succefully blocked this user'
        })
    } catch (error) {
        next(new AppErr(error.message));
    }
}

const unblockUserCtrl = async (req, res, next) => {
    try {
        // 1. find the user to be unblocked
        const userToBeUnblocked = await User.findById(req.params.id);
        // 2. find the user who wants to unblock
        const user = await User.findById(req.userAuth);
        // 3. check if userToBeunblocked and user exists
        if (userToBeUnblocked && user) {
            // 4. check if the usertobe unblocked is in the users blocked list
            const isAlreadyBlocked = user.blocked.find(blocked => blocked.toString() === userToBeUnblocked._id.toString());
            if (!isAlreadyBlocked) {
                return next(new AppErr("You have not blocked this user"));
            }
            //5. remove the usertobeunblocked from the users block array
            user.blocked = user.blocked.filter(blocked => blocked.toString() !== userToBeUnblocked._id.toString());
            //6. save the user
            await user.save();

            res.json({
                status: 'success',
                data: 'you have successfully unblocked this user'
            });
        }

    } catch (error) {
        next(new AppErr(error.message));
    }
}
// block user
const blockUserCtrl = async (req, res, next) => {

    try {
        // 1. find te user to be blocked
        const userToBeBlocked = await User.findById(req.params.id);
        // 2. find the user who is blocking
        const userWhoBlocked = await User.findById(req.userAuth);
        // 3. check if user to be blocked and user who wants to block exists..
        if (userToBeBlocked && userToBeBlocked) {
            // 4. check if user who blocked is already in the user blocked array
            const isUserAlreadyBlocked = userWhoBlocked.blocked.find(blocked => blocked.toString() === userToBeBlocked._id.toString());
            if (isUserAlreadyBlocked) {
                return next(new AppErr("You already blocked this user"));
            }
            //. 5 push userto be blocked to the user who blocked array
            userWhoBlocked.blocked.push(userToBeBlocked._id);
            //6 . save
            await userWhoBlocked.save();
            res.json({
                status: 'success',
                data: 'you have successfully blocked this user'
            });
        }

    } catch (error) {
        next(new AppErr(error.message));
    }
}

// unfollowing a user
const unfollowCtrl = async (req, res, next) => {
    try {
        // 1. find the user to be unfollowed
        const userToBeUnfollowed = await User.findById(req.params.id);
        // 2. find the user who is unfollowing
        const userWhoUnfollowed = await User.findById(req.userAuth);
        // 3. Check if user and user who unfollowed are found
        if (userToBeUnfollowed && userWhoUnfollowed) {
            // 4. check if userwhounfollowed is already in the users followers array
            const isUserAlreadyFollowed = userToBeUnfollowed.followers.find(follower => follower.toString() === userWhoUnfollowed._id.toString());
            if (!isUserAlreadyFollowed) {
                return next(new AppErr("You have not followed this user"));
            } else {
                // 5. remove userwhounfollowed from the users followers array
                userToBeUnfollowed.followers = userToBeUnfollowed.followers.filter(follower => follower.toString() !== userWhoUnfollowed._id.toString());
                //6. save the user
                await userToBeUnfollowed.save();
                // 7. remove usertobeunfollowed from the userwhounfollowed  folowing
                userWhoUnfollowed.following = userWhoUnfollowed.following.filter(following => following.toString() !== userToBeUnfollowed._id.toString());
                // 8. save the user
                await userWhoUnfollowed.save();
                res.json({
                    status: 'success',
                    data: 'you have successfully unfollowed this person'
                });
            }
        }

    } catch (error) {
        next(new AppErr(error.message));
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
        next(new AppErr(error.message));
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
                });
            }
        }
    } catch (error) {
        next(new AppErr(error.message));
    }
}

const deleteUserAccountCtrl = async (req, res, next) => {
    try {
        // find the user to be deleted
        const userToDelete = await User.findById(req.userAuth);
        if (!userToDelete) {
            return next(new AppErr("user can't be found", 400));
        }
        // find all post to be deleted 
        await Post.deleteMany({ user: req.userAuth });
        // delete all comments of the user
        await Comment.deleteMany({ user: req.userAuth });
        // delete all categories by the user
        await Category.deleteMany({ user: req.userAuth });

        // delete the user
        await userToDelete.deleteOne();
        // send response
        return res.json({
            status: 'success',
            data: 'Your account has been successfully deleted',
        });
    } catch (error) {
        next(new AppErr(error.message));
    }
}
//update user
const updateUserCtrl = async (req, res, next) => {
    const { email, lastname, firstname } = req.body;
    try {
        // check if email is not taken
        if (email) {
            const emailTaken = await User.findOne({ email });
            if (emailTaken) {
                return next(new AppErr("Email is taken", 400));
            }
        }
        //update the user
        const user = await User.findByIdAndUpdate(req.userAuth, {
            lastname,
            firstname,
            email,
        }, {
            new: true,
            runValidators: true,
        });
        // send response

        res.json({
            status: 'success',
            data: user,
        });
    } catch (error) {
        next(new AppErr(error.message));
    }
}
// update user password
const updatePasswordCtrl = async (req, res, next) => {
    const { password } = req.body
    try {
        //check if the user is updating password
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            //update user
            await User.findByIdAndUpdate(
                req.userAuth,
                { password: hashedPassword },
                {
                    new: true,
                    runValidators: true,
                }
            );
            res.json({
                status: 'success',
                data: 'Password has been changed succcefully',
            });
        } else {
            return next(new AppErr("please provide password field"));
        }

    } catch (error) {
        next(new AppErr(error.message));
    }
}
const profilePhotoUploadCtrl = async (req, res) => {
    //console.log(req.file);
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
        next(new AppErr(error.message, 500));
    }
}

module.exports = {
    userRegisterCtrl,
    userLoginCtrl,
    userProfileCtrl,
    usersCtrl,
    updateUserCtrl,
    whoViewedMyProfileCtrl,
    profilePhotoUploadCtrl,
    followingCtrl,
    unfollowCtrl,
    blockUserCtrl,
    unblockUserCtrl,
    adminBlockCtrl,
    adminUnblockCtrl,
    updatePasswordCtrl,
    deleteUserAccountCtrl
}