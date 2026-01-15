import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { BiArrowBack } from "react-icons/bi"
import { RotatingLines } from 'react-loader-spinner'
import { resetPassword } from '../services/operations/authAPI';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function UpdatePassword() {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    })
    const { password, confirmPassword } = formData
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { loading } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    // Token extract from URL
    const location = useLocation()
    // Navigate
    const navigate = useNavigate()
    const token = location.pathname.split("/").at(-1)

    const handleOnChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()
        dispatch(resetPassword(password, confirmPassword, token, navigate))
    }

    return (
        <div className='grid min-h-[calc(100vh-3.5rem)] place-items-center bg-richblack-900 font-inter'>
            {
                loading ? (
                    <div className="spinner">
                        <RotatingLines
                            strokeColor="#FFD60A"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="50"
                            visible={true}
                        />
                    </div>
                ) : (
                    <div className='max-w-[500px] p-4 lg:p-8'>
                        <h1 className='text-[1.875rem] font-semibold leading-9.5 text-richblack-5'>
                            Choose new password
                        </h1>
                        <p className='my-4 text-[1.125rem] leading-6.5 text-richblack-100'>
                            Almost done. Enter your new password and youre all set.
                        </p>
                        
                        <form onSubmit={handleOnSubmit}>
                            <label className='relative'>
                                <p className='mb-1 text-[0.875rem] leading-5.5 text-richblack-5'>
                                    New Password <sup className='text-pink-200'>*</sup>
                                </p>
                                <input
                                    required
                                    name='password'
                                    type={showPassword ? "text" : "password"}
                                    placeholder='Enter New Password'
                                    value={password}
                                    onChange={handleOnChange}
                                    className='w-full rounded-lg bg-richblack-800 p-3 pr-10 text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none'
                                />
                                <span 
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className='absolute right-3 top-[38px] z-10 cursor-pointer'
                                >
                                    {
                                        showPassword 
                                        ? <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" /> 
                                        : <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                                    }
                                </span>
                            </label>

                            <label className='relative mt-3 block'>
                                <p className='mb-1 text-[0.875rem] leading-5.5 text-richblack-5'>
                                    Confirm New Password <sup className='text-pink-200'>*</sup>
                                </p>
                                <input
                                    required
                                    name='confirmPassword'
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder='Confirm New Password'
                                    value={confirmPassword}
                                    onChange={handleOnChange}
                                    className='w-full rounded-lg bg-richblack-800 p-3 pr-10 text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none'
                                />
                                <span 
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className='absolute right-3 top-[38px] z-10 cursor-pointer'
                                >
                                    {
                                        showConfirmPassword 
                                        ? <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" /> 
                                        : <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                                    }
                                </span>
                            </label>

                            <button
                                type='submit'
                                className='mt-6 w-full rounded-lg bg-yellow-50 py-3 px-3 font-medium text-richblack-900 transition-all duration-200 hover:scale-95'
                            >
                                Reset Password
                            </button>
                        </form>

                        <div className='mt-6 flex items-center justify-between'>
                            <Link to="/login">
                                <p className='flex items-center gap-x-2 text-richblack-5'>
                                    <BiArrowBack /> Back to Login
                                </p>
                            </Link>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default UpdatePassword