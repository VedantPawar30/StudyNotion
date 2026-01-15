import {useState} from 'react'
import { useSelector ,useDispatch} from 'react-redux'
import { getResetPasswordToken} from '../services/operations/authAPI'
import { Link } from 'react-router-dom'
import {RotatingLines} from 'react-loader-spinner'
import { BiArrowBack } from "react-icons/bi"
function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [emailSent, setEmailSent] = useState(false)
    const {loading} = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const handleOnSubmit = (e) => {
        e.preventDefault()
        dispatch(getResetPasswordToken(email,setEmailSent))

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
                            {
                                !emailSent ? "Reset your password" : "Check email"
                            }
                        </h1>
                        
                        <p className='my-4 text-[1.125rem] leading-6.5 text-richblack-100'>
                            {
                                !emailSent 
                                ? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery."
                                : `We have sent the reset email to ${email}`
                            }
                        </p>

                        <form onSubmit={handleOnSubmit}>
                            {
                                !emailSent && (
                                    <label className='w-full'>
                                        <p className='mb-1 text-[0.875rem] leading-5.5 text-richblack-5'>
                                            Email Address <sup className='text-pink-200'>*</sup>
                                        </p>
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={email}
                                            placeholder='Enter your email address'
                                            onChange={(e) => setEmail(e.target.value)}
                                            className='w-full rounded-lg bg-richblack-800 p-3 text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none'
                                        />
                                    </label>
                                )
                            }
                            
                            <button
                                type='submit'
                                className='mt-6 w-full rounded-lg bg-yellow-50 py-3 px-3 font-medium text-richblack-900 transition-all duration-200 hover:scale-95'
                            >
                                {
                                    !emailSent ? "Reset Password" : "Resend Email"
                                }
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

export default ForgotPassword