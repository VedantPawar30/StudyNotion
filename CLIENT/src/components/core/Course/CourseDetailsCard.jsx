import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import copy from 'copy-to-clipboard';
import toast from 'react-hot-toast';
import { ACCOUNT_TYPE } from '../../../utils/constants';
import { addToCart } from '../../../slices/cartSlice';
import { FaShareSquare } from 'react-icons/fa';
import { BsFillCaretRightFill } from 'react-icons/bs';
function CourseDetailsCard({course,setConfirmationModal,handleBuyCourse}) {
    const {
        thumbnail,
        price
    } = course;

    const {user} =useSelector((state) => state.profile);
    const {token} = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        if(user && user.accountType === ACCOUNT_TYPE.INSTRUCTOR){
            toast.error("Instructors cannot add courses to cart");
            return;
        }
        if(token){
            dispatch(addToCart(course));
            return;
        }
        setConfirmationModal({
            text1: "You need to be logged in to add course to cart",
            text2: "Do you want to login?",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: () => navigate("/login"),
            btn2Handler: () => setConfirmationModal(null),
        })
    }

        
    
    
    const handleShare = () => {
        copy(window.location.href);
        toast.success("Link copied to clipboard");
    }
  return (
    <>
    <div className={`flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5`}>
        <img className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full" src={thumbnail} alt="Course thumbnail" />
        <div className=' px-4'>
            <div className="space-x-3 pb-4 text-3xl font-semibold">
                Rs .{price}
            </div>
            <div className="flex flex-col gap-4">
                <button
                    className='cursor-pointer rounded-md bg-yellow-50 px-5 py-2 font-semibold text-richblack-900'
                    onClick={
                        user && course?.studentsEnrolled.includes(user?._id)
                        ?
                        () => navigate('/dashboard/enrolled-courses')
                        :
                        () => {
                            handleBuyCourse();
                        }
                    }
                >
                    {
                        user && course?.studentsEnrolled.includes(user._id) ? "Go to course" : "Buy Now"
                    }
                </button>
                {
                    !course?.studentsEnrolled.includes(user?._id) &&  (
                        <button className="cursor-pointer rounded-md bg-richblack-800 px-5 py-2 font-semibold text-richblack-5" onClick={handleAddToCart}>
                            Add to Cart
                        </button>
                    )
                }
            </div>
            <div>
                <p className="pb-3 pt-6 text-center text-sm text-richblack-25">30-Day Money-Back Guarantee</p>
            </div>
            <div>
                <p className={`my-2 text-xl font-semibold `}>This Course includes</p>
                <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
                    {
                        course?.instructions.map((item, index) =>(
                            <p key={index} className=' flex gap-2'>
                                <BsFillCaretRightFill/>
                                <span>{item}</span>
                            </p>
                        ))
                    }
                </div>
            </div>
            <div className=' text-center'>
                <button
                    className=' mx-auto flex items-center gap-2 p-6 text-yellow-100'
                    onClick={handleShare}>
                    <FaShareSquare size={15}/> Share
                </button>
            </div>
        </div>
    </div>
    </>
  )
}

export default CourseDetailsCard