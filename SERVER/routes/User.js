const router = require('express').Router();

//Import Controllers
const {generateOtp,signUp,login,changePassword} = require("../controllers/Auth")
const {resetPassword,resetPasswordToken} = require("../controllers/ResetPassword")

//Import Middlewares
const {authMiddleware} = require("../middleware/auth")

//Routes
router.post("/sendotp", generateOtp)
router.post("/signup", signUp)
router.post("/login", login)
router.post("/changepassword",authMiddleware, changePassword)
router.post("/reset-password-token", resetPasswordToken)
router.post("/reset-password", resetPassword)

module.exports = router;