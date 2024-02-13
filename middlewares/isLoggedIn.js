const { AppErr } = require("../utils/appErr");
const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");

const isLoggedIn = (req, res, next) => {
    // get token from header
    const token = getTokenFromHeader(req);
    //verify the token
    const decodedUser = verifyToken(token);
    //save the user into the req object
    req.userAuth = decodedUser.id;
    if (!decodedUser) {
        return next(new AppErr("Invalid/Expired token, Please login again", 500));
    } else {
        next()
    }

}

module.exports = isLoggedIn;