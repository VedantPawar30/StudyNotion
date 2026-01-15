const Course = require("../models/Course")
const Category = require("../models/Category")
const User = require("../models/User")
const {imageUploader} = require("../utils/imageUploader")
require("dotenv").config()

exports.createCourse = async (req,res) =>{
    try{
        const {courseName, courseDescription,whatYouWillLearn, coursePrice, category} = req.body
        const thumbnail = req.files.thumbnailImage
        if(!courseName || !courseDescription || !whatYouWillLearn || !coursePrice || !category || !thumbnail){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
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
            whatYouWillLearn,
            price: coursePrice,
            thumbnail: thumbnailImage.secure_url,
            category: categoryDetails._id,
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
        return res.status(500).json({
            success:false,
            message : "Unable to create course",
            error: err.message
        })
    }
}


exports.getAllCourses = async (req,res) =>{
    try{
        const courses = await Course.find({}, {courseName:true, thumbnail:true, price:true, instructor:true, ratingAndReviews:true, studentsEnrolled:true}).populate("instructor").exec()
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
                                            populate: { path: 'subsection' } })
                                        .populate("ratingAndReviews")
                                        .exec()
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"Course not found"
            })
        }
        res.status(200).json({
            success:true,
            message:"Course details fetched successfully",
            courseDetails
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