const Section = require("../models/Section");
const Course = require("../models/Course"); 
const SubSection = require("../models/Subsection");

exports.createSection = async (req,res)=>{
    try{
        const {courseId,sectionName} = req.body;
        if(!courseId || !sectionName){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        //Check if course exists
        const courseDetails = await Course.findById(courseId);
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"Course not found"
            })
        }

        //Create Section
        const newSection = await Section.create({
            sectionName,
        });

        //Update course content
        //Two ways to do this
        //1) courseDetails.courseContent.push(newSection._id);
        //   await courseDetails.save();
        //2) Using findByIdAndUpdate
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            { $push: { courseContent: newSection._id } },
            { new: true }
        )
        .populate({
            path: "courseContent",
            populate: {
            path: "subsection"
            }
        }).exec();

        

        res.status(201).json({
            success:true,
            message:"Section created successfully",
            data:newSection,
            updatedCourseDetails
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message : "Unable to create section",
            error: err.message
        })
    }
}

exports.updateSection = async (req,res)=>{
    try{
        const {newSectionName,sectionId,courseId} = req.body;
        if(!newSectionName || !sectionId || !courseId){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        //Check if section exists
        const sectionDetails = await Section.findById(sectionId);
        if(!sectionDetails){
            return res.status(404).json({
                success:false,
                message:"Section not found"
            })
        }
        sectionDetails.sectionName = newSectionName;
        await sectionDetails.save();

        const courseDetails = await Course.findById(courseId)
        .populate({
            path: "courseContent",
            populate: {
                path: "subsection"
            }
        }).exec();

        res.status(200).json({
            success:true,
            message:"Section updated successfully",
            data:courseDetails,
        })
        
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to update section",
            error : err.message
        })
    }
}


exports.deleteSection = async (req,res)=>{
    try{
        // const {sectionId} = req.params;
        const {sectionId,courseId} = req.body;
        if(!sectionId || !courseId){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }

        // Check if section exists
        const sectionDetails = await Section.findById(sectionId);
        if(!sectionDetails){
            return res.status(404).json({
                success:false,
                message:"Section not found"
            });
        }

        //Delete all subsections associated with the section
        const subsectionIds = sectionDetails.subsection;
        for(const subsectionId of subsectionIds){
            await SubSection.findByIdAndDelete(subsectionId);
        }
        await Section.findByIdAndUpdate(
            sectionId,
            { $set: { subsection: [] } },
            { new: true }
        );

        // Remove section reference from courseContent array
        await Course.findByIdAndUpdate(
            courseId,
            { $pull: { courseContent: sectionId } },
            { new: true }
        );

        // Delete the section
        const deletedSection = await Section.findByIdAndDelete(sectionId);
        const courseDetails = await Course.findById(courseId)
        .populate({
            path: "courseContent",
            populate: {
                path: "subsection"
            }
        }).exec();

        res.status(200).json({
            success:true,
            message:"Section deleted successfully",
            data:courseDetails
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to delete section",
            error : err.message
        });
    }
}