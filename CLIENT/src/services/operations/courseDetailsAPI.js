import {toast} from "react-hot-toast"
import {apiConnector} from "../apiConnect"
import {courseEndpoints,ratingEndpoints,categories} from "../apis"

const {
    CREATE_COURSE_API,
    GET_COURSE_DETAILS_API,
    GET_ALL_COURSES_API,
    CREATE_SECTION_API,
    UPDATE_SECTION_API,
    DELETE_SECTION_API,
    CREATE_SUBSECTION_API,
    UPDATE_SUBSECTION_API,
    DELETE_SUBSECTION_API,
    EDIT_COURSE_API,
    GET_FULL_COURSE_DETAILS_API,
    GET_INSTRUCTOR_COURSES_API,
    DELETE_COURSE_API,
    LECTURE_COMPLETION_API
} = courseEndpoints

const{
    GET_ALL_CATEGORIES
} = categories

const {
    CREATE_RATING_API,
    GET_ALL_RATINGS_API,
    GET_AVERAGE_RATING_API
} = ratingEndpoints

export const getAllCourses = async() =>{
    const toastId = toast.loading("Loading courses...")
    let result = []
    try{
        const response = await apiConnector("GET",GET_ALL_COURSES_API)
        if(!response?.data?.success){
            throw new Error("Could not fetch courses")
        }
        result = response?.data?.courses
        toast.success("Courses loaded successfully",{id:toastId})
    }
    catch(err){
        console.log("GET_ALL_COURSES_API Error.....",err)
        toast.error("Failed to load courses",{id:toastId})
    }
    toast.dismiss(toastId)
    return result
}

export const fetchCourseDetails = async(courseId) =>{
    const toastId = toast.loading("Loading course details...")
    let result = null
    try{
        const response = await apiConnector("POST",GET_COURSE_DETAILS_API,{courseId})
        console.log("COURSE_DETAILS_API Response......", response)
        if(!response?.data?.success){
            throw new Error("Could not fetch course details")
        }
        result = response.data
        toast.success("Course details loaded successfully",{id:toastId})
    }
    catch(err){
        console.log("GET_COURSE_DETAILS_API Error.....",err)
        toast.error("Failed to load course details",{id:toastId})
    }
    toast.dismiss(toastId)
    return result
}

export const fetchAllCategories = async() =>{
    let result = []
    try{
        const response = await apiConnector("GET",GET_ALL_CATEGORIES)
        console.log("GET_ALL_CATEGORIES API Response......", response)
        if(!response?.data?.success){
            throw new Error("Could not fetch categories")
        }
        result = response?.data?.data
    }
    catch(err){
        console.log("GET_ALL_CATEGORIES API Error.....",err)
    }
    return result
}

export const addCourseDetails = async(data,token) =>{
    const toastId = toast.loading("Creating course...")
    let result = null
    try{
        const response = await apiConnector("POST",CREATE_COURSE_API,data,{
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
        })
        console.log("CREATE_COURSE_API Response......", response)
        if(!response?.data?.success){
            throw new Error("Could not create course")
        }
        result = response?.data?.course
        toast.success("Course created successfully",{id:toastId})
    }
    catch(err){
        console.log("CREATE_COURSE_API Error.....",err)
        toast.error("Failed to create course",{id:toastId})
    }
    toast.dismiss(toastId)
    return result
}

export const editCourseDetails = async(data,token) =>{
    let result = null
    const toastId = toast.loading("Updating course...")
    try{
        const response = await apiConnector("PUT",EDIT_COURSE_API,data,{
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
        })
        console.log("EDIT_COURSE_API Response......", response)
        if(!response?.data?.success){
            throw new Error("Could not update course")
        }
        result = response?.data?.data
        toast.success("Course updated successfully",{id:toastId})
    }
    catch(err){
        console.log("EDIT_COURSE_API Error.....",err)
        toast.error("Failed to update course",{id:toastId})
    }
    toast.dismiss(toastId)
    return result
}

export const createSection = async(data,token) =>{
    const toastId = toast.loading("Creating section...")
    let result = null
    try{
        const response = await apiConnector("POST",CREATE_SECTION_API,data,{
            Authorization: `Bearer ${token}`
        })
        console.log("CREATE_SECTION_API Response......", response)
        if(!response?.data?.success){
            throw new Error("Could not create section")
        }
        result = response?.data?.updatedCourseDetails
        toast.success("Section created successfully",{id:toastId})
    }
    catch(err){
        console.log("CREATE_SECTION_API Error.....",err)
        toast.error("Failed to create section",{id:toastId})
    }
    toast.dismiss(toastId)
    return result
}

export const createSubSection = async(data,token) =>{
    const toastId = toast.loading("Creating subsection...")
    let result = null
    try{
        const response = await apiConnector("POST",CREATE_SUBSECTION_API,data,{
            Authorization: `Bearer ${token}`
        })
        console.log("CREATE_SUBSECTION_API Response......", response)
        if(!response?.data?.success){
            throw new Error("Could not create subsection")
        }
        result = response?.data?.updatedSection
        toast.success("Subsection created successfully",{id:toastId})
    }
    catch(err){
        console.log("CREATE_SUBSECTION_API Error.....",err)
        toast.error("Failed to create subsection",{id:toastId})
    }
    toast.dismiss(toastId)
    return result
}

export const updateSection = async(data,token) =>{
    const toastId = toast.loading("Updating section...")
    let result = null
    try{
        const response = await apiConnector("PUT",UPDATE_SECTION_API,data,{
            Authorization: `Bearer ${token}`
        })
        console.log("UPDATE_SECTION_API Response......", response)
        if(!response?.data?.success){
            throw new Error("Could not update section")
        }
        result = response?.data?.data
        toast.success("Section updated successfully",{id:toastId})
    }
    catch(err){
        console.log("UPDATE_SECTION_API Error.....",err)
        toast.error("Failed to update section",{id:toastId})
    }
    toast.dismiss(toastId)
    return result
}

export const updateSubSection = async(data,token) =>{
    const toastId = toast.loading("Updating subsection...")
    let result = null
    try{
        const response = await apiConnector("PUT",UPDATE_SUBSECTION_API,data,{
            Authorization: `Bearer ${token}`
        })
        console.log("UPDATE_SUBSECTION_API Response......", response)
        if(!response?.data?.success){
            throw new Error("Could not update subsection")
        }
        result = response?.data?.data
        toast.success("Subsection updated successfully",{id:toastId})
    }
    catch(err){
        console.log("UPDATE_SUBSECTION_API Error.....",err)
        toast.error("Failed to update subsection",{id:toastId})
    }
    toast.dismiss(toastId)
    return result
}

export const deleteSection = async(data,token) =>{
    const toastId = toast.loading("Deleting section...")
    let result = null
    try{
        const response = await apiConnector("DELETE",DELETE_SECTION_API,data,{
            Authorization: `Bearer ${token}`
        })
        console.log("DELETE_SECTION_API Response......", response)
        if(!response?.data?.success){
            throw new Error("Could not delete section")
        }
        result = response?.data?.data
        toast.success("Section deleted successfully",{id:toastId})
    }
    catch(err){
        console.log("DELETE_SECTION_API Error.....",err)
        toast.error("Failed to delete section",{id:toastId})
    }
    toast.dismiss(toastId)
    return result
}

export const deleteSubSection = async(data,token) =>{
    const toastId = toast.loading("Deleting subsection...")
    let result = null
    try{
        const response = await apiConnector("DELETE",DELETE_SUBSECTION_API,data,{
            Authorization: `Bearer ${token}`
        })
        console.log("DELETE_SUBSECTION_API Response......", response)
        if(!response?.data?.success){
            throw new Error("Could not delete subsection")
        }
        result = response?.data?.updatedSection
        toast.success("Subsection deleted successfully",{id:toastId})
    }
    catch(err){
        console.log("DELETE_SUBSECTION_API Error.....",err)
        toast.error("Failed to delete subsection",{id:toastId})
    }
    toast.dismiss(toastId)
    return result
}

export const fetchInstructorCourses = async(token) =>{
    let result = []
    const toastId = toast.loading("Loading your courses...")
    try{
        const response = await apiConnector("GET",GET_INSTRUCTOR_COURSES_API,null,{
            Authorization: `Bearer ${token}`
        })
        console.log("GET_INSTRUCTOR_COURSES_API Response......", response)
        if(!response?.data?.success){
            throw new Error("Could not fetch your courses")
        }
        result = response?.data?.data
        toast.success("Courses loaded successfully",{id:toastId})
    }
    catch(err){
        console.log("GET_INSTRUCTOR_COURSES_API Error.....",err)
        toast.error("Failed to load your courses",{id:toastId})
    }
    toast.dismiss(toastId)
    return result
}

export const deleteCourse = async(courseId,token) =>{
    const toastId = toast.loading("Deleting course...")
    try{
        const response = await apiConnector("DELETE",DELETE_COURSE_API,{courseId},{
            Authorization: `Bearer ${token}`
        })
        console.log("DELETE_COURSE_API Response......", response)
        if(!response?.data?.success){
            throw new Error("Could not delete course")
        }
        toast.success("Course deleted successfully",{id:toastId})
    }
    catch(err){
        console.log("DELETE_COURSE_API Error.....",err)
        toast.error("Failed to delete course",{id:toastId})
    }
    toast.dismiss(toastId)
}

export const getFullCourseDetails = async(courseId,token) =>{
    const toastId = toast.loading("Loading course details...")
    let result = null
    try{
        const response = await apiConnector("POST",GET_FULL_COURSE_DETAILS_API,{courseId},{
            Authorization: `Bearer ${token}`
        })
        console.log("GET_FULL_COURSE_DETAILS_API Response......", response)
        if(!response?.data?.success){
            throw new Error("Could not fetch course details")
        }
        result = response?.data?.data
        toast.success("Course details loaded successfully",{id:toastId})
    }
    catch(err){
        console.log("GET_FULL_COURSE_DETAILS_API Error.....", err)
        toast.error("Failed to load course details",{id:toastId})
    }
    toast.dismiss(toastId)
    return result
}

export const createRating = async(data,token) =>{
    const toastId = toast.loading("Submitting rating...")
    let success = false
    try{
        const response = await apiConnector("POST",CREATE_RATING_API,data,{
            Authorization: `Bearer ${token}`
        })
        console.log("CREATE_RATING_API Response......", response)
        if(!response?.data?.success){
            throw new Error("Could not submit rating")
        }
        
        toast.success("Rating submitted successfully")
        success = true
    }
    catch(err){
        success = false
        console.log("CREATE_RATING_API Error.....",err)
        toast.error("Failed to submit rating",{id:toastId})
    }
    toast.dismiss(toastId)
    return success
}

export const markLectureAsComplete = async(data,token) => {
    const toastId = toast.loading("Marking lecture as complete...")
    let result = null;
    try{
        const response = await apiConnector("POST",LECTURE_COMPLETION_API,data,{
            Authorization: `Bearer ${token}`
        })
        console.log("LECTURE_COMPLETION_API Response......", response)
        if(!response?.data?.success){
            throw new Error("Could not mark lecture as complete")
        }
        toast.success("Lecture marked as complete successfully",{id:toastId})
        result = true;
    }
    catch(err){
        console.log("LECTURE_COMPLETION_API Error.....",err)
        toast.error("Failed to mark lecture as complete",{id:toastId})
    }
    toast.dismiss(toastId)
    return result
}