const { Signup,Login,Logout,ForgetPassword,resendVerification,ResetPassword,verifyEmail} = require('../Controllers/AuthController');
const router = require('express').Router();
const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/logout", authMiddleware, Logout);
router.get('/verify-email/:token', verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forget-password", ForgetPassword);
router.post("/reset-password/:token", ResetPassword);

module.exports = router;