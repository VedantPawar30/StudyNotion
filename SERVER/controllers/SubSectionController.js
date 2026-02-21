const SubSection = require("../models/Subsection")
const Section = require("../models/Section")
const {imageUploader} = require("../utils/imageUploader")
require("dotenv").config()

exports.createSubSection = async(req,res)=>{
    try{
        const {title, description, sectionId} = req.body;
        const video = req.files?.video;

        if(!title || !description || !sectionId || !video){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const videoUpload = await imageUploader(video, process.env.FOLDER_NAME);

        const newSubSection = await SubSection.create({
            title,
            description,
            timeDuration: `${videoUpload.duration}`,
            videoUrl: videoUpload.secure_url
        });

        const sectionDetails = await Section.findById(sectionId);
        if(!sectionDetails){
            return res.status(404).json({
                success: false,
                message: "Section not found"
            });
        }

        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            {
                $push: { subsection: newSubSection._id }
            },
            { new: true }
        ).populate("subsection").exec();

        res.status(201).json({
            success: true,
            message: "SubSection Created successfully",
            updatedSection
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Unable to create sub-section",
            error: err.message
        });
    }
}

exports.updateSubSection = async(req,res)=>{
    try{    
        
        const {subSectionId, title, description} = req.body;
        // const updatedVideo = req.files?.video;
        if(!subSectionId){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const subSectionDetails = await SubSection.findById(subSectionId);
        if(!subSectionDetails){
            return res.status(404).json({
                success:false,
                message:"Sub-section not found"
            })
        }

        if(title !== undefined){
            subSectionDetails.title = title;
        }

        if(description !== undefined){
            subSectionDetails.description = description;
        }

        if(req.files && req.files.video !== undefined){
            const video = req.files.video;
            const videoUpload = await imageUploader(video, process.env.FOLDER_NAME);
            subSectionDetails.videoUrl = videoUpload.secure_url;
            subSectionDetails.timeDuration = `${videoUpload.duration}`
        }

        //const videoUpload = await imageUploader(updatedVideo, process.env.FOLDER_NAME);
        await subSectionDetails.save();

        const updatedSection = await Section.findOne({subsection:subSectionId})
        .populate("subsection")
        .exec();

        
        res.status(200).json({
            success:true,
            message:"Sub-section updated successfully",
            data:updatedSection
        })

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message : "Unable to update sub-section",
            error: err.message
        })
    }
}

exports.deleteSubSection = async(req,res)=>{
    try{
        // const {subSectionId} = req.params;
        const {subSectionId,sectionId} = req.body;
        if(!subSectionId || !sectionId){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        const subSectionDetails = await SubSection.findById(subSectionId)
        if(!subSectionDetails){
            return res.status(404).json({
                success:false,
                message:"Sub-section not found"
            })
        }

        const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);

        const updatedSection = await Section.findByIdAndUpdate(sectionId,{
            $pull :{
                subsection:subSectionId
            }

        },{new:true}).populate("subsection").exec();

        
        res.status(200).json({
            success:true,
            message:"Sub-section deleted successfully",
            DeletedSubSection : deletedSubSection,
            updatedSection,
        })

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to delete sub-section",
            error : err.message
        })
    }
}
