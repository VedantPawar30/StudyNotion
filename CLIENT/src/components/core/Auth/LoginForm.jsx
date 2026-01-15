import {useState} from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from 'react-redux';
import {Link, useNavigate } from 'react-router-dom';
import {login} from '../../../services/operations/authAPI'
function LoginForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const {email, password} = formData;

    const handleOnChange = (e) =>{
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    }

    const handleOnSubmit = async (e) =>{
        e.preventDefault();
        //dispatch login action
        dispatch(login(email, password, navigate));
    }
    //For password show hide
    const [showPassword, setShowPassword] = useState(false);
  return (
    <form
        onSubmit={handleOnSubmit}
      className="mt-6 flex w-full flex-col gap-y-4">
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
        <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-5.5 text-richblack-5">
                Password <sup className="text-pink-200">*</sup>
            </p>
            <input
                required
                type ={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                name='password'
                value={password}
                onChange={handleOnChange}
                style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className="w-full rounded-lg bg-richblack-800 p-3 pr-12 text-richblack-5">
            </input>
            <span
                onClick ={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-10 cursor-pointer"
            >
                {
                    showPassword ? (
                        <AiOutlineEyeInvisible 
                            fill="#AFB2BF"
                            size={24} />

                    ) : (
                        <AiOutlineEye 
                            fill="#AFB2BF"
                            size={24} />
                    )
                }
            </span>

            <Link to="/forgot-password">
                <p className="mt-1 ml-auto max-w-max text-xs text-blue-100">
                    Forgot Password?
                </p>
            </Link>
            
        </label>

        <button
            type="submit"
            className="mt-6 rounded-lg bg-yellow-50 py-2 px-3 font-medium text-richblack-900"
        >
            Sign In
        </button>
    </form>
  )
}

export default LoginForm