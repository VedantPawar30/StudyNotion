import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import RenderSteps from "../AddCourse/RenderSteps";
import { useEffect } from "react";
import { getFullCourseDetails } from "../../../../services/operations/courseDetailsAPI";
import { setCourse, setEditCourse } from "../../../../slices/courseSlice";
import { RotatingLines } from "react-loader-spinner";
export default function EditCourse() {

    const dispatch = useDispatch();
    const {courseId} = useParams();
    
    const {course} = useSelector((state) => state.course);
    const [loading, setLoading] = useState(false);
    const {token} = useSelector((state) => state.auth);

    useEffect(() => {
        const populateCourseDetails = async () => {
            setLoading(true);
            const result = await getFullCourseDetails(courseId, token);
            if(result){
                dispatch(setEditCourse(true));
                dispatch(setCourse(result.courseDetails));
            }
            setLoading(false);
        }
        populateCourseDetails();
    }, [])
    if(loading){
        return(
            <div className="grid flex-1 place-items-center">
                <RotatingLines width="50" visible={true} strokeColor="#4fa94d" strokeWidth="4" />
            </div>
        )
    }
  return (
    <div>
        <h1 className="mb-14 text-3xl font-medium text-richblack-5">Edit Course</h1>

        <div className="mx-auto max-w-[600px]">
            {
                course ? (<RenderSteps />) : (<p>Course Not Found</p>)
            }
        </div>
    </div>
  )
}