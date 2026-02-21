import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form';
import ReactStars from "react-stars";
import IconBtn from '../../common/IconBtn';
import { RxCross2 } from 'react-icons/rx';
import { createRating } from '../../../services/operations/courseDetailsAPI';
function CourseReviewModal({setReviewModal}) {

  const {user} = useSelector((state) => state.profile);
  const {token} = useSelector((state) => state.auth);
  const {courseEntireData} = useSelector((state) => state.viewCourse);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  useEffect(() =>{
    setValue("courseExperience","")
    setValue("courseRating",0)
  },[])

  const ratingChanged = (newRating) =>{
    setValue("courseRating",newRating)
  }

  

  const onSubmit = async(data) => {
    await createRating({
      courseId: courseEntireData._id,
      rating: data.courseRating,
      review: data.courseExperience
    },token)

    setReviewModal(false);
  }
  return (
    <div className="fixed inset-0 z-1000 mt-0! grid h-screen w-screen place-items-center overflow-auto  bg-opacity-10 backdrop-blur-sm">
        <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
          {/* Modal header */}
            <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
                <p className="text-xl font-semibold text-richblack-5">Add Review</p>
                <button onClick={() => setReviewModal(false)}>
                  <RxCross2 className='text-2xl text-richblack-5' />
                </button>
            </div>
            {/* Modal body */}
            <div className=' p-6'>
              <div className="flex items-center justify-center gap-x-4">
                <img className=' aspect-square w-[50px] rounded-full object-cover' src={user?.image} alt="User" />
                <div>
                  <p className="font-semibold text-richblack-5">{user?.firstName} {user?.lastName}</p>
                  <p className="text-sm text-richblack-5">Posting publicly</p>
                </div>
              </div>

              <form
                className='mt-6 flex flex-col items-center'
                onSubmit={handleSubmit(onSubmit)}
              >
                <ReactStars
                  count={5}
                  size={24}
                  onChange = {ratingChanged}
                  activeColor="#ffd700"
                />
                
                <div className="flex w-11/12 flex-col space-y-2">
                  <label className="text-sm text-richblack-5" htmlFor="courseExperience">
                    Add Your Experience <sup className="text-pink-200">*</sup>
                  </label>
                  <textarea
                    id="courseExperience"
                    {...register("courseExperience", { required: true })}
                    placeholder="Share your experience with this course"
                    className='rounded-lg bg-richblack-700 p-3 text-[16px] leading-6 text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none min-h-[130px] w-full resize-x-none'
                  >

                  </textarea>
                  {errors.courseExperience && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                      Please share your experience with this course.
                    </span>
                  )}
                </div>
                  {/* Cancel and Save buttons */}
                <div className="mt-6 flex w-11/12 justify-end gap-x-2">
                  <button className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-2 px-5 font-semibold text-richblack-900`} onClick={() => setReviewModal(false)}>
                    Cancel
                  </button>

                  <IconBtn
                    text="Save"
                    type="submit"
                  />
                </div>
              </form>

            </div>
        </div>
    </div>
  )
}

export default CourseReviewModal