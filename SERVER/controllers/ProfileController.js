const Profile = require("../models/Profile")
const User = require("../models/User")
const Course = require("../models/Course")
const CourseProgress = require("../models/CourseProgress")
const {imageUploader} = require("../utils/imageUploader")
const { convertSecondsToDuration } = require("../utils/secToDuration")
require("dotenv").config()
exports.updateProfile = async (req,res) =>{
    try{
        const {
            gender,
            dateOfBirth = null,
            about = "",
            contactNumber
        } = req.body
        const userId = req.user.id

        if(!contactNumber || !gender || !userId){
            return res.status(400).json({
                success:false,
                message :"All fields are required"
            })
        }

        //Find user details
        const userDetails = await User.findById(userId)
        const profileId = userDetails.additionalDetails

        //Find profile details
        const profileDetails = await Profile.findById(profileId)
        if(!profileDetails){
            return res.status(404).json({
                success:false,
                message :"Profile not found"
            })
        }
        //Update profile details
        profileDetails.gender = gender
        profileDetails.dateOfBirth = dateOfBirth
        profileDetails.about = about
        profileDetails.contactNumber = contactNumber
        await profileDetails.save()

        const user = await User.findById(userId).populate("additionalDetails").exec()

    
        res.status(200).json({
            success:true,
            message : "Profile updated successfully",
            user : user,
        })


    }
    catch(err){
        return res.status(500).json({
            success:false,
            message : "Unable to update profile",
            
            error:err.message
        })
    }
}

exports.deleteAccount = async (req,res) =>{
    try{
        const userId = req.user.id

        if(!userId){
            return res.status(400).json({
                success:false,
                message :"User ID is required"
            })
        }

        //Find user details
        const userDetails = await User.findById(userId)
        const profileId = userDetails.additionalDetails
        //Delete profile details
        await Profile.findByIdAndDelete(profileId)
        
        // //We have to delete all the courses created by the user if the user is an instructor
        // if(userDetails.accountType === "Instructor"){
        //     const courses = await Course.find({instructor : userId})
        //     for(let i=0; i<courses.length; i++){
        //         await Course.findByIdAndDelete(courses[i]._id)
        //     }
        // }

        //We have to subtract the user from all the courses in which the user is enrolled
        const enrolledCourses = await Course.find({studentsEnrolled : userId})
        for(let i=0; i<enrolledCourses.length; i++){
            const course = enrolledCourses[i]
            course.studentsEnrolled.pull(userId)
            await course.save()
        }
        //Delete user details
        await User.findByIdAndDelete(userId)

        res.status(200).json({
            success:true,
            message : "Profile deleted successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message : "Unable to delete profile",
            error:err.message
        })
    }
}


exports.getAllUserDetails = async (req,res) =>{
    try{
        const userId = req.user.id
        if(!userId){
            return res.status(400).json({
                success:false,
                message :"User ID is required"
            })
        }
        //Find user details
        const userDetails = await User.findById(userId).populate("additionalDetails").exec()

        res.status(200).json({
            success:true,
            message : "Profile fetched successfully",
            userDetails
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message : "Unable to fetch profile",
            error:err.message
        })
    }
}

exports.updateDisplayPicture = async (req,res) =>{
    try{
        const userId = req.user.id
        const displayPicture = req.files.displayPicture
        const image = await imageUploader(displayPicture,process.env.FOLDER_NAME,1000,1000)
        console.log(image)
        //Find user details
        const userDetails = await User.findById(userId)
        userDetails.image = image.secure_url
        await userDetails.save()

        res.status(200).json({
            success:true,
            message : "Display picture updated successfully",
            data : userDetails
        })
    }   
    catch(err){
        return res.status(500).json({
            success:false,
            message : "Unable to update display picture",
            error:err.message
        })
    }
}

exports.getEnrolledCourses = async (req,res) =>{
    try{
        const userId = req.user.id
        if(!userId){
            return res.status(400).json({
                success:false,
                message :"User ID is required"
            })
        }
        //Find all the courses in which the user is enrolled
        const userDetails = await User.findById(userId).populate({
            path:"courses",
                populate :{
                    path : "courseContent",
                    populate : {
                        path : "subsection"
                    }
                }
            }
        ).exec()
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message :"User not found"
            })
        }

        const courses = userDetails.courses;
        const fullCourseData = [];
        for(let i=0; i<courses.length; i++){
            const course = courses[i]._doc;
            const courseProgress = await CourseProgress.findOne({courseId : course._id, userId : req.user.id})
            let progress = 0
            if(courseProgress){
                const completedVideos = courseProgress.completedVideos.length
                const totalVideos = course.courseContent.reduce((acc, section) => acc + section.subsection.length, 0)
                progress = totalVideos === 0 ? 0 : (completedVideos / totalVideos) * 100
                
            }
            else{
                progress = 0
            }

            // Calculate total duration of the course
            let totalDurationInSeconds = 0;
            
            course.courseContent.forEach(section => {
                section.subsection.forEach(sub => {
                    const timeDurationInSeconds = parseInt(sub.timeDuration)
                    totalDurationInSeconds += timeDurationInSeconds
                })
            })

            const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

            fullCourseData.push({...course, totalDuration, progress})

            
        }

        res.status(200).json({
            success:true,
            message : "Enrolled courses fetched successfully",
            courses : fullCourseData,
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message : "Unable to fetch enrolled courses",
            error:err.message
        })
    }
}


exports.instructorDashboard = async (req,res) =>{
    try{
        const userId = req.user.id

        const courseDetails = await Course.find({instructor : userId})
        const courseData = courseDetails.map((course) =>{
            const totalStudentsEnrolled = course.studentsEnrolled.length
            const totalAmountGenerated = totalStudentsEnrolled * course.price

            // Create an object with the required details
            const courseDataWithStats = {
                _id : course._id,
                courseName : course.courseName,
                courseDescription : course.courseDescription,
                thumbnail : course.thumbnail,
                price : course.price,
                status : course.status,
                createdAt : course.createdAt,
                totalStudentsEnrolled,
                totalAmountGenerated
            }
            return courseDataWithStats
        })
        
        return res.status(200).json({
            success:true,
            message : "Instructor dashboard fetched successfully",
            courses : courseData
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message : "Unable to fetch instructor dashboard",
            error:err.message
        })
    }
}