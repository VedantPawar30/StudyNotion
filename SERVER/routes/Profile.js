const router = require('express').Router();

//Import Controller
const {getAllUserDetails,getEnrolledCourses,updateDisplayPicture,updateProfile,deleteAccount} = require("../controllers/ProfileController")

//Import Middlewares
const {authMiddleware} = require("../middleware/auth")

//Routes For Profile
router.get("/getAllUserDetails",authMiddleware,getAllUserDetails);
router.get("/getEnrolledCourses",authMiddleware,getEnrolledCourses);
router.put("/updateProfile",authMiddleware,updateProfile);
router.put("/updateDisplayPicture",authMiddleware,updateDisplayPicture);
router.delete("/deleteAccount",authMiddleware,deleteAccount);

module.exports = router;