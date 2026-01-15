const router = require('express').Router();

//Import Controllers
const {createCourse,getAllCourses,getCourseDetails} = require("../controllers/CourseController")
const {createCategory,getAllCategories,getCategoryPageDetails} = require('../controllers/CategoryController')
const {createRatingAndReview,getAllRating,getAverageRating} = require("../controllers/RatingAndReviewController")
const {createSection,deleteSection,updateSection} = require("../controllers/SectionController")
const {createSubSection,deleteSubSection,updateSubSection} = require("../controllers/SubSectionController")

//Import Middlewares
const {authMiddleware,isAdmin,isInstructor,isStudent} = require("../middleware/auth")


//Routes For Course
router.post("/createCourse",authMiddleware,isInstructor,createCourse);
router.get("/getAllCourses",getAllCourses);
router.get("/getCourseDetails",getCourseDetails);

//Routes For Category
router.post("/createCategory",authMiddleware,isAdmin,createCategory);
router.get("/getAllCategories",getAllCategories);
router.get("/getCategoryPageDetails",getCategoryPageDetails);

//Routes For Rating and Review
router.post("/createRating",authMiddleware,isStudent,createRatingAndReview)
router.get("/getAllRating",getAllRating)
router.get("/getAverageRating",getAverageRating)

//Routes For Section and SubSection
router.post("/createSection",authMiddleware,isInstructor,createSection)
router.delete("/deleteSection/:sectionId",authMiddleware,isInstructor,deleteSection)
router.put("/updateSection",authMiddleware,isInstructor,updateSection)
router.post("/createSubSection",authMiddleware,isInstructor,createSubSection)
router.delete("/deleteSubSection/:subSectionId",authMiddleware,isInstructor,deleteSubSection)
router.put("/updateSubSection",authMiddleware,isInstructor,updateSubSection)


module.exports = router;