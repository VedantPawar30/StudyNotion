const router = require('express').Router();

// Controller functions
const {capturePayment,verifySignature,sendPaymentSuccessEmail} = require("../controllers/PaymentController")

//Import Middlewares
const {authMiddleware,isStudent} = require("../middleware/auth")

router.post("/capturePayment",authMiddleware,isStudent,capturePayment);
router.post("/verifySignature",authMiddleware,isStudent,verifySignature);
router.post("/sendPaymentSuccessEmail",authMiddleware,isStudent,sendPaymentSuccessEmail);

module.exports = router;