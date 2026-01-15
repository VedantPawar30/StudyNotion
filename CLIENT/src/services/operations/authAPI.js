import {toast} from "react-hot-toast";
import { setLoading,setToken } from "../../slices/authSlice";
import { resetCart} from "../../slices/cartSlice";
import { apiConnector } from "../apiConnect";
import { setUser } from "../../slices/profileSlice";
import { endpoints } from "../apis";

const {
    LOGIN_API,
    SIGNUP_API,
    SENDOTP_API,
    RESETPASSTOKEN_API,
    RESETPASSWORD_API
} = endpoints

export function sendOtp(email,navigate){
    return async (dispatch) =>{
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST",SENDOTP_API,{email, checkUserPresent: true});
            console.log("SENTOTP API RESPONSE...", response)
            console.log(response.data.success)

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            toast.success("OTP sent to your email successfully!");
            navigate("/verify-email")
        }
        catch(error){
            console.log("SEND OTP API ERROR...", error);
            toast.error("Could not send OTP. Please try again.");
        }

        
        dispatch(setLoading(false));
        toast.dismiss(toastId);
        
    }
}

export function signup(
    accountType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
    navigate
){
    return async (dispatch) =>{
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST",SIGNUP_API,{
                accountType,
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                otp
            });
            console.log("SIGNUP API RESPONSE...", response)

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            toast.success("Account created successfully! Please login.");
            navigate("/login")
        }
        catch(error){
            console.log("SIGNUP API ERROR...", error);
            toast.error("Could not create account. Please try again.");
        }

        
        dispatch(setLoading(false));
        toast.dismiss(toastId);
        
    }
}

export function login(email,password,navigate){
    return async (dispatch) =>{
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST",LOGIN_API,{email,password});
            console.log("LOGIN API RESPONSE...", response)
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            toast.success("Logged in successfully!");
            dispatch(setToken(response.data.token));
            const userImage = response?.data?.user?.image ? response.data.user.image : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;
            dispatch(setUser({...response.data.user,image:userImage}));
            localStorage.setItem("token",JSON.stringify(response.data.token));
            localStorage.setItem("user",JSON.stringify({...response.data.user,image:userImage}));
            navigate("/dashboard/my-profile");
        }
        catch(error){
            console.log("LOGIN API ERROR...", error);
            toast.error("Could not login. Please try again.");
        }

        
        dispatch(setLoading(false));
        toast.dismiss(toastId);
        
    }
}

export function getResetPasswordToken(email,setEmailSent){
    return async (dispatch) =>{
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST",RESETPASSTOKEN_API,{email});
            console.log("RESET PASSWORD TOKEN API RESPONSE...", response)

            if(!response.data.success){
                throw new Error(response.data.message);
            }
            toast.success("Reset password email sent successfully!");
            setEmailSent(true);
        }
        catch(error){
            console.log("RESET PASSWORD TOKEN API ERROR...", error);
            toast.error("Could not send reset password email. Please try again.");
        }

        
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}

export function resetPassword(password,confirmPassword,token,navigate){
    return async (dispatch) =>{
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST",RESETPASSWORD_API,{
                password,
                confirmPassword,
                token
            });
            console.log("RESET PASSWORD API RESPONSE...", response)
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            toast.success("Password reset successfully! Please login.");
            navigate("/login");
        }
        catch(error){
            console.log("RESET PASSWORD API ERROR...", error);
            toast.error("Could not reset password. Please try again.");
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}

export function logout(navigate){
    return async (dispatch) =>{
        dispatch(setToken(null));
        dispatch(setUser(null));
        dispatch(resetCart());
        localStorage.removeItem("token");
        localStorage.removeItem("user")
        toast.success("Logged out successfully!");
        navigate("/");
    }
}