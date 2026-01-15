const Category = require("../models/Category")
const Course = require("../models/Course")

exports.createCategory = async (req,res) => {
    try{
        const {name,description} = req.body
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        const category = await Category.create({
            name,
            description,
            courses:[]
        })

        res.status(201).json({
            success:true,
            message:"Category created Successfully",
            category
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message :"Unable to create category",
            error: err.message
        })
    }
}


exports.getAllCategories = async(req,res) =>{
    try{
        const categories = await Category.find({}, {name:true, description:true})
        if(categories.length ==0){
            return res.status(404).json({
                success:false,
                message:"Categories not Found or there are no categories"
            })
        }

        res.status(200).json({
            success:true,
            message:"All categories fetched successfully",
            data :categories
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message : "Unable to fetch categories",
            error: err.message
        })
    }
}

exports.getCategoryPageDetails = async(req,res) =>{
    try{
        const {categoryId} = req.body
        if(!categoryId){
            return res.status(400).json({
                success:false,
                message:"CategoryId is required"
            })
        }

        const selectedCategoryDetails = await Category.findById(categoryId).populate("courses").exec();
        if(!selectedCategoryDetails){
            return res.status(404).json({
                success:false,
                message:"Category not found"
            })
        }

        const differentCategories = await Category.find({_id :{ $ne : categoryId}}).populate("courses").exec();

        //Get top selling courses for the selected category -HW
        const topSellingCourses = await Course.aggregate([
            {
                $match : {
                    category : selectedCategoryDetails._id
                }
            },
            {
                $addFields : {
                    studentsCount : { $size : "$studentsEnrolled"}
                }
            },
            {
                $sort : { studentsCount : -1}
            },
            {
                $limit : 10
            }

        ])

        res.status(200).json({
            success:true,
            message:"Category page details fetched successfully",
            selectedCategoryDetails,
            differentCategories,
            topSellingCourses
        })
        
        
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message : "Unable to fetch category page details",
            error: err.message
        })
    }
}