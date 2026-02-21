const Course = require("../models/Course")
const Category = require("../models/Category")
const User = require("../models/User")
const Section = require("../models/Section")
const SubSection = require("../models/Subsection")
const {imageUploader} = require("../utils/imageUploader")
const CourseProgress = require("../models/CourseProgress")
const {convertSecondsToDuration} = require("../utils/secToDuration")
require("dotenv").config()

exports.createCourse = async (req,res) =>{
    try{
        let {courseName, courseDescription,whatYouWillLearn, price,tag, status,instructions, category} = req.body
        const thumbnail = req.files?.courseThumbnail
        tag = JSON.parse(tag)
        instructions = JSON.parse(instructions)
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail || !tag.length || !instructions.length){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        if(!status || status === undefined){
            status = "Draft"
        }

        //Get instructor id from req.user
        const instructorId = req.user.id
        const instructorDetails = await User.findById(instructorId)
        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"Instructor not found"
            })
        }

        //Check if category is valid
        const categoryDetails = await Category.findById(category)
        if(!categoryDetails){
            return res.status(404).json({
                success:false,
                message:"Category not found"
            })
        }
        //Upload thumbnail to cloudinary
        const thumbnailImage = await imageUploader(thumbnail, process.env.FOLDER_NAME)


        //Create Course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn : whatYouWillLearn,
            price,
            tag,
            thumbnail: thumbnailImage.secure_url,
            category: categoryDetails._id,
            status : status,
            instructions : instructions
        })

        //User course list update
        instructorDetails.courses.push(newCourse._id)
        await instructorDetails.save()

        //Update tag course list
        categoryDetails.courses.push(newCourse._id)
        await categoryDetails.save()

        res.status(201).json({
            success:true,
            message:"Course created successfully",
            course:newCourse
        })
   
        
    }
    catch(err){
        console.error(err)
        return res.status(500).json({
            success:false,
            message : "Unable to create course",
            error: err.message
        })
    }
}

exports.editCourse = async (req,res) =>{
    try{
        const {courseId} = req.body
        const updates = req.body
        const courseDetails = await Course.findById(courseId)
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"Course not found"
            })
        }
        if(req.files){
            const thumbnail = req.files.courseThumbnail
            const thumbnailImage = await imageUploader(thumbnail, process.env.FOLDER_NAME)

            courseDetails.thumbnail = thumbnailImage.secure_url
        }

        for(const key in updates){
            if(Object.hasOwn(updates,key)){
                if(key==="tag" || key==="instructions"){
                    courseDetails[key] = JSON.parse(updates[key])
                }
                else{
                    courseDetails[key] = updates[key]
                }
            }
        }
        await courseDetails.save()

        const updatedCourse = await Course.findById(courseId)
        .populate({
            path:"instructor",
            populate:{
                path:"additionalDetails"
            }
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
            path: 'courseContent',
            populate: {
                path: 'subsection'
            }
        })
        .exec()
        res.status(200).json({
            success:true,
            message:"Course updated successfully",
            data: updatedCourse
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message : "Unable to update course",
            error: err.message
        })
    }
}


exports.getAllCourses = async (req,res) =>{
    try{
        const courses = await Course.find({status: "Published"}, {courseName:true, thumbnail:true, price:true, instructor:true, ratingAndReviews:true, studentsEnrolled:true}).populate("instructor").exec()
        if(courses.length === 0){
            return res.status(404).json({
                success:false,
                message:"No courses found"
            })
        }
        res.status(200).json({
            success:true,
            message:"Courses fetched successfully",
            courses
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message : "Unable to fetch courses",
            error: err.message
        })
    }
}

exports.getCourseDetails = async (req,res) =>{
    try{
        const {courseId} = req.body
        const courseDetails = await Course.findById(courseId)
                                        .populate({
                                            path:"instructor",
                                            populate:{
                                                path:"additionalDetails"
                                            }
                                        })
                                        .populate("category")
                                        .populate({ 
                                            path: 'courseContent', 
                                            populate: { 
                                                path: 'subsection',
                                            } })
                                        .populate("ratingAndReviews")
                                        .exec()
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"Course not found"
            })
        }

        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach(section => {
            section.subsection.forEach(sub => {
                const timeDurationInSeconds = parseInt(sub.timeDuration)
                totalDurationInSeconds += timeDurationInSeconds
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
        res.status(200).json({
            success:true,
            message:"Course details fetched successfully",
            data:{
                courseDetails,
                totalDuration
            }
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message : "Unable to fetch course details",
            error: err.message
        })
    }
}

exports.getFullCourseDetails = async (req,res) =>{
    try{
        const {courseId} = req.body
        const userId = req.user.id
        const courseDetails = await Course.findById(courseId)
                                        .populate({
                                            path:"instructor",
                                            populate:{
                                                path:"additionalDetails"
                                            }
                                        })
                                        .populate("category")
                                        .populate({ 
                                            path: 'courseContent', 
                                            populate: { 
                                                path: 'subsection',
                                            } })
                                        .populate("ratingAndReviews")
                                        .exec()
        
        let courseProgress = await CourseProgress.findOne({courseId: courseId, userId: userId})                                

        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"Course not found"
            })
        }

        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach(section => {
            section.subsection.forEach(sub => {
                const timeDurationInSeconds = parseInt(sub.timeDuration)
                totalDurationInSeconds += timeDurationInSeconds
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
        res.status(200).json({
            success:true,
            message:"Course details fetched successfully",
            data :{
                courseDetails,
                totalDuration,
                completedVideos : courseProgress?.completedVideos ? courseProgress.completedVideos : []
            }
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message : "Unable to fetch course details",
            error: err.message
        })
    }
}

exports.getInstructorCourses = async (req,res) =>{
    try{
        const instructorId = req.user.id
        const instructorCourses = await Course.find({
            instructor: instructorId,
        }).sort({createdAt: -1})
        .populate({
            path:"courseContent",
            populate:{
                path:"subsection"
            }
        })

        let totalDurationInSeconds = 0
        const fullData = []
        instructorCourses.forEach(course => {
            course.courseContent.forEach(section => {
                section.subsection.forEach(sub => {
                    const timeDurationInSeconds = parseInt(sub.timeDuration)
                    totalDurationInSeconds += timeDurationInSeconds
                }
                )
            })
            const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
            fullData.push({
                ...course.toObject(),
                totalDuration
            })
        })
        
        
        res.status(200).json({
            success:true,
            message:"Instructor courses fetched successfully",
            data : {
                instructorCourses : fullData,
            }
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message : "Unable to fetch instructor courses",
            error: err.message
        })
    }
}


exports.deleteCourse = async (req,res) =>{
    try{
        const {courseId} = req.body
        const courseDetails = await Course.findById(courseId)
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                 message:"Course not found"
            })
        }
        
        const studentsEnrolled = courseDetails.studentsEnrolled
        for(const studentId of studentsEnrolled){
            await User.findByIdAndUpdate(studentId, {
                $pull : {
                    courses : courseId
                }
            })
        }

        const courseSections = courseDetails.courseContent
        for(const sectionId of courseSections){
            const section = await Section.findById(sectionId)
            if(section){
                const subsections = section.subsection
                for(const subId of subsections){
                    await SubSection.findByIdAndDelete(subId)
                }
            }
            await Section.findByIdAndDelete(sectionId)
        }

        await Course.findByIdAndDelete(courseId)

        res.status(200).json({
            success:true,
            message:"Course deleted successfully",
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message : "Unable to delete course",
            error: err.message
        })
    }
}