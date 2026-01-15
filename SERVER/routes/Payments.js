const router = require('express').Router();

// Controller functions
const {capturePayment,verifySignature} = require("../controllers/PaymentController")

//Import Middlewares
const {authMiddleware,isStudent} = require("../middleware/auth")

router.post("/capturePayment",authMiddleware,isStudent,capturePayment);
router.post("/verifySignature",verifySignature);

module.exports = router;