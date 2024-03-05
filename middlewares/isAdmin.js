const User = require("../models/User/User");
const { AppErr } = require("../utils/appErr");
const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");

const isAdmin = async (req, res, next) => {
    // get token from header
    const token = getTokenFromHeader(req);
    //verify the token
    const decodedUser = verifyToken(token);
    //save the user into the req object
    req.userAuth = decodedUser.id;
    //  find the user in db
    const user = await User.findById(decodedUser.id);
    // check if admin
    if (user.isAdmin) {
        return next()
    } else {
        return next(new AppErr("Access denied, Admin only", 403))
    }


}

module.exports = isAdmin;