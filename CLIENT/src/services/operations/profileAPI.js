import { toast } from "react-hot-toast"

import { setLoading, setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnect"
import { profileEndpoints } from "../apis"
import { logout } from "./authAPI"

const { GET_USER_ENROLLED_COURSES_API } = profileEndpoints

export async function getUserEnrolledCourses(token) {
    
        let result =[]
        const toastId = toast.loading("Loading...")
       
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
            result = response.data.courses  
        }
        catch(error){
            console.log("GET_USER_ENROLLED_COURSES_API error...", error)
            toast.error(error.message)
        }

        toast.dismiss(toastId)
        return result
}
