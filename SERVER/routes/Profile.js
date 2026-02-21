const router = require('express').Router();

//Import Controller
const {getAllUserDetails,getEnrolledCourses,updateDisplayPicture,updateProfile,deleteAccount, instructorDashboard} = require("../controllers/ProfileController")

//Import Middlewares
const {authMiddleware,isInstructor} = require("../middleware/auth")

//Routes For Profile
router.get("/getAllUserDetails",authMiddleware,getAllUserDetails);
router.get("/getEnrolledCourses",authMiddleware,getEnrolledCourses);
router.put("/updateProfile",authMiddleware,updateProfile);
router.put("/updateDisplayPicture",authMiddleware,updateDisplayPicture);
router.delete("/deleteAccount",authMiddleware,deleteAccount);
router.get("/instructorDashboard",authMiddleware,isInstructor,instructorDashboard);
module.exports = router;