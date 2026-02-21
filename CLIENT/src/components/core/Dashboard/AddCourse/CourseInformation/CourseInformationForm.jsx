import {useEffect, useState} from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { addCourseDetails, editCourseDetails, fetchAllCategories } from '../../../../../services/operations/courseDetailsAPI';
import { HiOutlineCurrencyRupee } from 'react-icons/hi';
import RequirementField from './RequirementField';
import { setCourse, setStep } from '../../../../../slices/courseSlice';
import IconBtn from '../../../../common/IconBtn';
import toast from 'react-hot-toast';
import { MdNavigateNext } from 'react-icons/md';
import ChipInput from './ChipInput';
import Upload from '../Upload';
import { COURSE_STATUS } from '../../../../../utils/constants';
function CourseInformationForm(){
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
      } = useForm();

    const dispatch = useDispatch()
    const {token} = useSelector((state) => state.auth)
    const {course,editCourse} = useSelector((state) => state.course)
    const [loading,setLoading] = useState(false)
    const [courseCategories,setCourseCategories] = useState([])


    useEffect(() => {
        const getCategories = async() => {
            setLoading(true)
            const categories = await fetchAllCategories();
            if(categories.length > 0){
                setCourseCategories(categories)
            }
            setLoading(false)
        }
        if(editCourse){
            setValue("courseTitle",course.courseName);
            setValue("courseDescription",course.courseDescription);
            setValue("coursePrice",course.price);
            setValue("courseCategory",course.category);
            setValue("courseThumbnail",course.thumbnail);
            setValue("courseTags",course.tag);
            setValue("courseBenefits",course.whatYouWillLearn);
            setValue("courseRequirements",course.instructions);
        }
        getCategories();
    },[])

    const isFormUpdated = () =>{
        const currentValues = getValues();
        if (
        currentValues.courseTitle !== course.courseName ||
        currentValues.courseDescription !== course.courseDescription ||
        currentValues.coursePrice !== course.price ||
        currentValues.courseTags.toString() !== course.tag.toString() ||
        currentValues.courseBenefits !== course.whatYouWillLearn ||
        currentValues.courseCategory._id !== course.category._id ||
        currentValues.courseRequirements.toString() !==
            course.instructions.toString() ||
        currentValues.courseImage !== course.thumbnail
        ) {
        return true
        }
        return false
    }
    const onSubmit = async(data) => {
        if(editCourse){
            if(isFormUpdated()){
                const currentValues = getValues();
                const formData = new FormData();

                formData.append("courseId",course._id);
                if(currentValues.courseTitle !== course.courseName){
                    formData.append("courseName",data.courseTitle);
                }
                if(currentValues.courseDescription !== course.courseDescription){
                    formData.append("courseDescription",data.courseDescription);
                }
                if(currentValues.coursePrice !== course.price){
                    formData.append("price",data.coursePrice);
                }
                if(currentValues.courseTags.toString() !== course.tag.toString()){
                    formData.append("tag",JSON.stringify(data.courseTags));
                }
                if(currentValues.courseCategory._id !== course.category._id){
                    formData.append("category",data.courseCategory);
                }
                if(currentValues.courseBenefits !== course.whatYouWillLearn){
                    formData.append("whatYouWillLearn",data.courseBenefits);
                }
                if(currentValues.courseRequirements.toString() !== course.instructions.toString()){
                    formData.append("instructions",JSON.stringify(data.courseRequirements));
                }
                if(currentValues.courseImage !== course.thumbnail){
                    formData.append("courseThumbnail",data.courseImage);
                }
                

                setLoading(true)
                const result =  await editCourseDetails(formData,token);
                setLoading(false)
                if(result){
                    dispatch(setStep(2));
                    dispatch(setCourse(result))
                }
            }
            else{
                toast.error("No changes made to the form")
            }
            return;   
        }

        // Create a new Course
        const formData = new FormData();
        formData.append("courseName",data.courseTitle);
        formData.append("courseDescription",data.courseDescription);
        formData.append("price",data.coursePrice);
        formData.append("tag",JSON.stringify(data.courseTags));
        formData.append("category",data.courseCategory);
        formData.append("whatYouWillLearn",data.courseBenefits);
        formData.append("instructions",JSON.stringify(data.courseRequirements));
        formData.append("courseThumbnail",data.courseImage);
        formData.append("status", COURSE_STATUS.DRAFT)
        setLoading(true)
        const result = await addCourseDetails(formData,token);
        if(result){
            dispatch(setStep(2));
            dispatch(setCourse(result))
            
        }
        setLoading(false)
        console.log("Printing Form Data", formData)
        console.log("Printing result",result)
        
        
    }

  return (
    <form onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 rounded-md border border-richblack-700 bg-richblack-800 p-6">
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor='courseTitle'>Course Title<sup className=' text-pink-200'>*</sup></label>
            <input
                id='courseTitle'
                placeholder='Enter Course Title'
                {...register("courseTitle",{required:true})}
                className="rounded-lg bg-richblack-700 p-3 text-[16px] leading-6 text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none w-full"
            />
            {
                errors.courseTitle && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">Course Title is required*</span>
                )
            }


        </div>
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor='courseDescription'>Course Description<sup className=' text-pink-200'>*</sup></label>
            <textarea
                id='courseDescription'
                placeholder='Enter Course Description'
                {...register("courseDescription",{required:true})}
                className="rounded-lg bg-richblack-700 p-3 text-[16px] leading-6 text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none resize-x-none min-h-[130px] w-full"
            />
            {
                errors.courseDescription && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">Course Description is required*</span>
                )
            }
        </div>
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="coursePrice">
            Course Price <sup className="text-pink-200">*</sup>
            </label>
            <div className="relative">
            <input
                id="coursePrice"
                placeholder="Enter Course Price"
                {...register("coursePrice", {
                required: true,
                valueAsNumber: true,
                pattern: {
                    value: /^(0|[1-9]\d*)(\.\d+)?$/,
                },
                })}
                className="rounded-lg bg-richblack-700 p-3 text-[16px] leading-6 text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none w-full pl-12"
            />
            <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
            </div>
            {errors.coursePrice && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
                Course Price is required
            </span>
            )}
        </div>
        <div className="flex flex-col space-y-2">
            <label className=' text-sm text-richblack-5' htmlFor='courseCategory'>Course Category<sup className=' text-pink-200'>*</sup></label>
            <select
                id='courseCategory'
                {...register("courseCategory",{required:true})}
                defaultValue=""
                className="rounded-lg bg-richblack-700 p-3 text-[16px] leading-6 text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none w-full"
            >
                <option value="" disabled>Select a category</option>
                {
                    !loading && courseCategories.map((category) => (
                        <option  key={category._id} value={category._id}>{category.name}</option>
                    ))
                }
            </select>
            {
                errors.courseCategory && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">Course Category is required*</span>
                )
            }
        </div>

        {/* Create a custome components for handling tags input */}
        <ChipInput
            label="Tags"
            name="courseTags"
            register={register}
            setValue={setValue}
            getValues={getValues}
            placeholder="Enter Tags and press enter"
            errors={errors}
        />

        {/* Create a component for uploading and showing preview of media */}
        <Upload
            label="Course Thumbnail"
            name="courseImage"
            register={register}
            setValue={setValue}
            getValues={getValues}
            errors={errors}
            editData = {editCourse ? course?.thumbnail : null}
        />

        <div className="flex flex-col space-y-2">
            <label className=' text-sm text-richblack-5' htmlFor='courseBenefits'>Benefits of the course<sup className=' text-pink-200'>*</sup></label>
            <textarea
                id='courseBenefits'
                placeholder='Enter Benefits of the course'
                {...register("courseBenefits",{required:true})}
                className="rounded-lg bg-richblack-700 p-3 text-[16px] leading-6 text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none resize-x-none min-h-[130px] w-full"
            />
            {
                errors.courseBenefits && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">Benefits of the course are required*</span>
                )
            }
        </div>

        <RequirementField
            name="courseRequirements"
            label="Course Requirements"
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
        />

        <div className="flex justify-end gap-x-2">
            {
                editCourse && (
                    <button
                        type='button'
                        onClick={()=>dispatch(setStep(2))}
                        className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-2 px-5 font-semibold text-richblack-900`}>
                        Continue without saving
                    </button>
                )
            }

            <IconBtn
                type="submit"
                disabled={loading}
                text={!editCourse ? "Next" : "Save Changes"}    
            >
                <MdNavigateNext/>
            </IconBtn>
        </div>
    </form>
  )
}

export default CourseInformationForm