import { useEffect, useState } from 'react'
import { RotatingLines } from 'react-loader-spinner'
import { useDispatch, useSelector } from 'react-redux'
import OtpInput from 'react-otp-input';
import { Link, useNavigate } from 'react-router-dom';
import { signup, sendOtp } from '../services/operations/authAPI';
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";

function VerifyEmail() {
    const { loading, signupData } = useSelector((state) => state.auth)
    const [otp, setOtp] = useState("");
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // If no signup data present redirect to signup page
    useEffect(() => {
        if (!signupData) {
            navigate("/signup")
        }
    }, [signupData, navigate])

    const handleOnSubmit = (e) => {
        e.preventDefault()
        const { firstName, lastName, email, password, confirmPassword, accountType } = signupData;
        
        // dispatch verify email action here
        dispatch(signup(
            accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            otp,
            navigate
        ))
    }

    return (
        <div className='min-h-[calc(100vh-3.5rem)] grid place-items-center bg-richblack-900 font-inter'>
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
                        <h1 className='text-richblack-5 font-semibold text-[1.875rem] leading-9.5'>
                            Verify email
                        </h1>
                        <p className='text-[1.125rem] leading-6.5 my-4 text-richblack-100'>
                            A verification code has been sent to you. Enter the code below
                        </p>
                        
                        <form onSubmit={handleOnSubmit}>
                            <OtpInput
                                value={otp}
                                onChange={setOtp}
                                numInputs={6}
                                renderInput={(props) => (
                                    <input
                                        {...props}
                                        placeholder="-"
                                        style={{
                                            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                        }}
                                        className="w-12 lg:w-[60px] border-0 bg-richblack-800 rounded-lg text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                                    />
                                )}
                                containerStyle={{
                                    justifyContent: "space-between",
                                    gap: "0 6px",
                                }}
                            />

                            <button
                                type='submit'
                                className='w-full bg-yellow-50 py-3 px-3 rounded-lg mt-6 font-medium text-richblack-900 hover:scale-95 transition-all duration-200'
                            >
                                Verify email
                            </button>
                        </form>

                        <div className='mt-6 flex items-center justify-between'>
                            <Link to="/login">
                                <p className='text-richblack-5 flex items-center gap-x-2'>
                                    <BiArrowBack /> Back to Login
                                </p>
                            </Link>
                            <button
                                className='flex items-center gap-x-2 text-blue-100'
                                onClick={() => dispatch(sendOtp(signupData.email, navigate))}
                            >
                                <RxCountdownTimer />
                                Resend it
                            </button>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default VerifyEmail