const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");

exports.createRatingAndReview = async (req, res) => {
    try{
        const { rating, review, courseId } = req.body;
        const userId = req.user.id;
        // check if course exists
        const courseDetails = await Course.findById(courseId);
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"Course not found"
            })
        }
        // check if user is enrolled in the course
        const isUserEnrolled = courseDetails.studentsEnrolled.includes(userId);
        if(!isUserEnrolled){
            return res.status(403).json({
                success:false,
                message:"User not enrolled in the course"
            })
        }

        //check if the user has already given a review for the course
        const existingReview = await RatingAndReview.findOne({
            user: userId,
            course: courseId
        });
        if(existingReview){
            return res.status(400).json({
                success:false,
                message:"User has already given a review for this course"
            });
        }

        // create rating and review
        const newRatingAndReview = await RatingAndReview.create({
            user: userId,
            rating,
            review,
            course: courseId
        });

        // push rating and review in course schema
        courseDetails.ratingAndReviews.push(newRatingAndReview._id);
        await courseDetails.save();

        return res.status(201).json({
            success:true,
            message:"Rating and Review added successfully",
            data: newRatingAndReview
        });
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}


exports.getAverageRating = async (req, res) => {
    try{
        const { courseId } = req.body;
        // check if course exists
        const courseDetails = await Course.findById(courseId).populate("ratingAndReviews");
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"Course not found"
        })
        }

        //Using aggregate function to calculate average rating
        const result = await RatingAndReview.aggregate([
            {
                $match :{
                    course:courseDetails._id
                }
            },
            {
                $group :{
                    _id:null,
                    averageRating : {$avg : "$rating"}

                }
            },
            {
                $project : {
                    _id:0,
                    averageRating:1
                }
            }
        ])

        if(result.length === 0){
            return res.status(200).json({
                success:true,
                message:"Average rating fetched successfully",
                averageRating: 0
            });
        }
        const averageRating = result[0].averageRating;

        return res.status(200).json({
            success:true,
            message:"Average rating fetched successfully",
            averageRating: averageRating
        });
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}


exports.getAllRating = async (req, res) => {
    try{
        const allRatings = await RatingAndReview.find()
                                .populate({
                                    path:"user",
                                    select:"firstName lastName email image"
                                })
                                .populate({
                                    path:"course",
                                    select:"courseName"
                                })
                                .exec();
        return res.status(200).json({
            success:true,
            message:"All ratings fetched successfully",
            data: allRatings
        });
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}