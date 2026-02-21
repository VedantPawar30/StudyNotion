const Category = require("../models/Category")
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }
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
    try {
      const { categoryId } = req.body
      // Get courses for the specified category
      const selectedCategory = await Category.findById(categoryId)
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: {path: "instructor"},
          populate: {path : "ratingAndReviews"},
        })
        .exec()
  
      //console.log("SELECTED COURSE", selectedCategory)
      // Handle the case when the category is not found
      if (!selectedCategory) {
        console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }
      // Handle the case when there are no courses
      if (selectedCategory.courses.length === 0) {
        console.log("No courses found for the selected category.")
        return res.status(404).json({
          success: false,
          message: "No courses found for the selected category.",
        })
      }
  
      // Get courses for other categories
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })
      let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
          ._id
      )
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: {path: "instructor"},
          populate: {path : "ratingAndReviews"},
        })
        .exec()
        //console.log("Different COURSE", differentCategory)
      // Get top-selling courses across all categories
      const allCategories = await Category.find()
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: {
            path: "instructor",
        },
          populate: {path : "ratingAndReviews"},
        })
        .exec()
      const allCourses = allCategories.flatMap((category) => category.courses)
      const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)
       // console.log("mostSellingCourses COURSE", mostSellingCourses)
      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingCourses,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Could not fetch category details",
        error: error.message,
      })
    }
}