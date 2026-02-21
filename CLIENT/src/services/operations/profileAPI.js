import { toast } from "react-hot-toast"

import { setLoading, setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnect"
import { profileEndpoints } from "../apis"
import { logout } from "./authAPI"

const { GET_USER_ENROLLED_COURSES_API ,GET_INSTRUCTOR_DATA_API} = profileEndpoints

export const getUserEnrolledCourses = async (token) => {
    
        let result =null
        
        const toastId = toast.loading("Loading Enrolled Courses...")
       
        try{
            const response = await apiConnector(
                "GET",
                GET_USER_ENROLLED_COURSES_API,
                null,
                {
                    Authorization: `Bearer ${token}`,
                }
            )
            console.log("GET_USER_ENROLLED_COURSES_API...", response)
            if(!response.data.success){
                throw new Error(response.data.message)
            }

            toast.success("Enrolled courses loaded successfully")
            result = response.data.courses  
        }
        catch(error){
            console.log("GET_USER_ENROLLED_COURSES_API error...", error)
            toast.error(error.message)
        }

        toast.dismiss(toastId)
        return result
}


export const getInstructorData = async (token) =>{
    let result = null;
    const toastId = toast.loading("Loading Instructor Data...")
    try{
        const response = await apiConnector(
            "GET",
            GET_INSTRUCTOR_DATA_API,
            null,
            {
                Authorization: `Bearer ${token}`,
            }
        )
        console.log("GET_INSTRUCTOR_DATA_API response", response)
        if(!response.data.success){
            throw new Error(response.data.message)
        }
        toast.success("Instructor data loaded successfully")
        result = response.data.courses;
    }
    catch(error){
        console.log("GET_INSTRUCTOR_DATA_API error...", error)
        toast.error(error.message)

    }
    toast.dismiss(toastId)
    return result;
}