import {useState} from 'react'
import { useForm } from 'react-hook-form'
import IconBtn from '../../../../common/IconBtn';
import { MdAddCircleOutline, MdNavigateNext } from 'react-icons/md';
import { useSelector,useDispatch } from 'react-redux';
import { setCourse, setEditCourse, setStep } from '../../../../../slices/courseSlice';
import toast from 'react-hot-toast';
import NestedView from './NestedView';
import { createSection, updateSection } from '../../../../../services/operations/courseDetailsAPI';
function CourseBuilderForm() {
    const { register, handleSubmit,setValue, formState: { errors } } = useForm();
    const [editSectionName, setEditSectionName] = useState(null);
    const {course} = useSelector((state) => state.course);
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const cancelEdit = () => {
        setEditSectionName(null);
        setValue('sectionName', '');
    }

    const goBack = () => {
        dispatch(setStep(1));
        dispatch(setEditCourse(true));
    }

    const goToNext = () => {
        if(course.courseContent.length === 0){
            toast.error("Please add at least one section to proceed");
            return;
        }
        if(course.courseContent.some((section) => section.subsection.length === 0)){
            toast.error("Please add at least one lecture to each section to proceed");
            return;
        }
        dispatch(setStep(3));
    }

    const handleChangeEditSectionName = (sectionId, sectionName) => {
        if(editSectionName === sectionId){
            //If user clicks on the same section again, we cancel the edit
            cancelEdit();
            return;
        }
        setEditSectionName(sectionId);
        setValue('sectionName', sectionName);
    }

    const onSubmit = async (data) => {
        setLoading(true);
        let result;
        if(editSectionName){
            //We are editing existing section name
            result = await updateSection({
                newSectionName: data.sectionName,
                sectionId: editSectionName,
                courseId: course._id
            },token
            );
        }
        else{
            //We are creating new section
            result = await createSection({
                sectionName: data.sectionName,
                courseId: course._id
            },token
            );
        }

        //update values
        if(result){
            //GadBad Line
            dispatch(setCourse(result))
            setValue('sectionName', '');
            setEditSectionName(null);
        }
        setLoading(false);
    }
  return (
    <div className="space-y-8 rounded-md border border-richblack-700 bg-richblack-800 p-6"> 
        <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="sectionName">Section Name <sup className="text-pink-200">*</sup></label>
                <input
                    id='sectionName'
                    placeholder='Add Section Name'
                    {...register('sectionName', { required: true })}
                    className="rounded-lg bg-richblack-700 p-3 text-[16px] leading-6 text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none w-full"
                />
                {errors.sectionName && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">Section Name is required</span>
                )}
            </div>
            <div className='flex w-full gap-x-10 mt-10'>
                <IconBtn
                    type="submit"
                    text={editSectionName ? "Edit Section Name":"Create Section"}
                    outline={true}
                >
                    <MdAddCircleOutline className=' text-yellow-50' size={20}></MdAddCircleOutline>
                </IconBtn>
                {editSectionName && (
                    <button
                        type="button"
                        onClick={cancelEdit}
                        className=' text-sm text-richblack-300 underline'
                    >
                        Cancel Edit
                    </button>
                )}
            </div>
        </form>

        {course.courseContent && (
            <NestedView handleChangeEditSectionName={handleChangeEditSectionName}/>
        )}

        <div className=' flex justify-end gap-x-3'>
            <button
                onClick={goBack}
                className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-2 px-5 font-semibold text-richblack-900`}
            >
                Back
            </button>
            <IconBtn
                disabled={loading}
                onclick={goToNext}
                text="Next"
            >
                <MdNavigateNext size={20}></MdNavigateNext>
            </IconBtn>
        </div>
        

    </div>
  )
}

export default CourseBuilderForm
