const router = require('express').Router();

//Import Controllers
const {createCourse,getAllCourses,getCourseDetails,editCourse,getFullCourseDetails,getInstructorCourses,deleteCourse} = require("../controllers/CourseController")
const {createCategory,getAllCategories,getCategoryPageDetails} = require('../controllers/CategoryController')
const {createRatingAndReview,getAllRating,getAverageRating} = require("../controllers/RatingAndReviewController")
const {createSection,deleteSection,updateSection} = require("../controllers/SectionController")
const {createSubSection,deleteSubSection,updateSubSection} = require("../controllers/SubSectionController")
const {updateCourseProgress} = require("../controllers/CourseProgressController")

//Import Middlewares
const {authMiddleware,isAdmin,isInstructor,isStudent} = require("../middleware/auth")


//Routes For Course
router.post("/createCourse",authMiddleware,isInstructor,createCourse);
router.get("/getAllCourses",getAllCourses);
router.post("/getCourseDetails",getCourseDetails);
router.post("/getFullCourseDetails",authMiddleware,getFullCourseDetails);
router.get("/getInstructorCourses",authMiddleware,isInstructor,getInstructorCourses);
router.put("/editCourse",authMiddleware,isInstructor,editCourse);
router.delete("/deleteCourse",authMiddleware,isInstructor,deleteCourse);
router.post("/updateCourseProgress",authMiddleware,isStudent,updateCourseProgress);
//Routes For Category
router.post("/createCategory",authMiddleware,isAdmin,createCategory);
router.get("/getAllCategories",getAllCategories);
router.post("/getCategoryPageDetails",getCategoryPageDetails);

//Routes For Rating and Review
router.post("/createRating",authMiddleware,isStudent,createRatingAndReview)
router.get("/getAllRating",getAllRating)
router.get("/getAverageRating",getAverageRating)

//Routes For Section and SubSection
router.post("/createSection",authMiddleware,isInstructor,createSection)
router.delete("/deleteSection",authMiddleware,isInstructor,deleteSection)
router.put("/updateSection",authMiddleware,isInstructor,updateSection)
router.post("/createSubSection",authMiddleware,isInstructor,createSubSection)
router.delete("/deleteSubSection",authMiddleware,isInstructor,deleteSubSection)
router.put("/updateSubSection",authMiddleware,isInstructor,updateSubSection)


module.exports = router;