const User = require("../models/User");
const jwt = require("jsonwebtoken")
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");

// checks if user is authenticated or not

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    // console.log("isuthen")
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler('Login first to access this resource', 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // console.log(decoded)
    req.user = await User.findById(decoded.id)
    // console.log(req.user)

    next()
})

//handling users roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resourse`, 403)
            )
        }
        next()
    }
}