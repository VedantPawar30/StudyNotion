import {useState} from 'react'
import Tab from "../../common/Tab"
import {useNavigate} from "react-router-dom"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import {sendOtp} from "../../../services/operations/authAPI"
import {toast} from "react-hot-toast"
import { setSignupData } from '../../../slices/authSlice'
import {useDispatch} from "react-redux"
import {ACCOUNT_TYPE} from "../../../utils/constants"
function SignupForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);

    const {firstName, lastName, email, password, confirmPassword} = formData;
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleOnChange = (e) =>{
        setFormData((prevData) =>({
            ...prevData,
            [e.target.name] : e.target.value,
        }))
    }

    const handleOnSubmit = (e) =>{
        e.preventDefault();
        if(password !== confirmPassword){
            toast.error("Password and Confirm Password do not match");
            return;
        }
        const signupData = {
            ...formData,
            accountType,
        }
        dispatch(setSignupData(signupData));
        dispatch(sendOtp(email,navigate));

        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        });

        setAccountType(ACCOUNT_TYPE.STUDENT);
    }

    const tabData = [
        {
            id: 1,
            tabName: "Student",
            type: ACCOUNT_TYPE.STUDENT,
        },
        {
            id: 2,
            tabName: "Instructor",
            type: ACCOUNT_TYPE.INSTRUCTOR,
        },
    ];
  return (
    <div>
        <Tab tabData={tabData} field={accountType} setField={setAccountType}></Tab>

        <form onSubmit={handleOnSubmit}
            className="flex w-full flex-col gap-y-4">
            {/* First Name and Last Name */}
            <div className="flex gap-x-4">
                <label>
                    <p className="mb-1 text-[0.875rem] leading-5.5 text-richblack-5">
                        First Name <sup className="text-pink-200">*</sup>
                    </p>
                    <input
                        required
                        type="text"
                        placeholder="Enter your first name"
                        name='firstName'
                        value={firstName}
                        onChange={handleOnChange}
                        style={{
                            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        }}
                        className="w-full rounded-lg bg-richblack-800 p-3 text-richblack-5">
                    </input>
                </label>
                <label>
                    <p className="mb-1 text-[0.875rem] leading-5.5 text-richblack-5">
                        Last Name <sup className="text-pink-200">*</sup>
                    </p>
                    <input
                        required
                        type="text"
                        placeholder="Enter your last name"
                        name='lastName'
                        value={lastName}
                        onChange={handleOnChange}
                        style={{
                            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        }}
                        className="w-full rounded-lg bg-richblack-800 p-3 text-richblack-5">
                    </input>
                </label>
            </div>
            {/* Email Address */}
            <label className="w-full">
                <p className="mb-1 text-[0.875rem] leading-5.5 text-richblack-5">
                    Email Address <sup className="text-pink-200">*</sup>
                </p>
                <input
                    required
                    type="email"
                    placeholder="Enter your email address"
                    name='email'
                    value={email}
                    onChange={handleOnChange}
                    style={{
                        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                    }}
                    className="w-full rounded-lg bg-richblack-800 p-3 text-richblack-5">
                </input>
            </label>
            {/* Password and Confirm Password */}
            <div className="flex gap-x-4">
                <label className=' relative'>
                    <p className="mb-1 text-[0.875rem] leading-5.5 text-richblack-5">
                        Create Password <sup className="text-pink-200">*</sup>
                    </p>
                    <input
                        required
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        name='password'
                        value={password}
                        onChange={handleOnChange}
                        style={{
                            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        }}
                        className="w-full rounded-lg bg-richblack-800 p-3 pr-10 text-richblack-5">

                    </input>
                    <span
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-[38px] cursor-pointer z-10">
                        {
                            showPassword ? <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/> : <AiOutlineEye fontSize={24} fill="#AFB2BF"/>
                        }
                    </span>
                </label>
                <label className=' relative'>
                    <p className="mb-1 text-[0.875rem] leading-5.5 text-richblack-5">
                        Confirm Password <sup className="text-pink-200">*</sup>
                    </p>
                    <input
                        required
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        name='confirmPassword'
                        value={confirmPassword}
                        onChange={handleOnChange}
                        style={{
                            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        }}
                        className="w-full rounded-lg bg-richblack-800 p-3 pr-10 text-richblack-5">
                    </input>
                    <span
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-[38px] cursor-pointer z-10">
                        {
                            showConfirmPassword ? <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/> : <AiOutlineEye fontSize={24} fill="#AFB2BF"/>
                        }

                    </span>
                </label>
            </div>
            <button
                type='submit'
                className="mt-6 rounded-lg bg-yellow-50 py-2 px-3 font-medium text-richblack-900">
                Create Account
            </button>
        </form>
    </div>
  )
}

export default SignupForm