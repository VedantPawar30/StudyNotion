const CourseProgress = require("../models/CourseProgress");
const Subsection = require("../models/SubSection");

exports.updateCourseProgress = async (req,res) => {
    const {courseId, subSectionId} = req.body;
    const userId = req.user.id;

    try{
        const subSection = await Subsection.findById(subSectionId);
        if(!subSection){
            return res.status(404).json({success:false, message:"SubSection not found"});
        }

        let courseProgress = await CourseProgress.findOne({courseId, userId});

        if(!courseProgress){
            return res.status(404).json({success:false, message:"Course Progress not found"});
        }

        // Check if the lecture is already marked as completed
        const isAlreadyCompleted = courseProgress.completedVideos.includes(subSectionId) ? true : false;

        if(isAlreadyCompleted){
            return res.status(400).json({success:false, message:"Lecture already marked as completed"});
        }

        courseProgress.completedVideos.push(subSectionId);
        await courseProgress.save();

        return res.status(200).json({success:true, message:"Course Progress updated successfully"});
    }
    catch(error){
        console.error("Error updating course progress:", error);
        return res.status(500).json({success:false, message:"Internal server error"});
    }
}
