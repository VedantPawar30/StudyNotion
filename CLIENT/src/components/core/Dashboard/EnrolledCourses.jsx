import {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import {RotatingLines} from 'react-loader-spinner'
import ProgressBar from "@ramonak/react-progress-bar";
import { getUserEnrolledCourses } from '../../../services/operations/profileAPI'
function EnrolledCourses() {
    const [ennrolledCourses, setEnrolledCourses] = useState(null)
    const {token} = useSelector((state) => state.auth)

    const fetchEnrolledCourses = async()=>{
        try{
            const response =  await getUserEnrolledCourses(token);
            setEnrolledCourses(response)
        }
        catch(error){
            console.log("Error fetching enrolled courses:", error)
        }
    }
    useEffect(()=>{
        fetchEnrolledCourses()
    },[])

  return (
    <div className=' text-richblack-5'>
        <div>
            Enrolled Courses
        </div>
        {
            !ennrolledCourses ? (
                <div className='w-full h-[300px] flex items-center justify-center'>
                    <RotatingLines
                        strokeColor="#4fa94d"
                        strokeWidth="5"
                        animationDuration="0.75"
                        width="50"
                        visible={true}
                    />
                </div>
            ): !ennrolledCourses.length ? (<p>You have not enrolled in any courses yet.</p>) :(
                <div>
                    <div>
                        <p>Course Name</p>
                        <p>Duration</p>
                        <p>Progress</p>
                    </div>

                    {
                        ennrolledCourses.map((course,index) => (
                           <div>
                                <div>
                                    <img src={course.thumbnail} alt={course.courseName} />
                                    <div>
                                        <p>{course.courseName}</p>
                                        <p>{course.courseDescription}</p>
                                    </div>
                                </div>

                                <div>
                                    {course?.totalDuration}
                                </div>

                                <div>
                                    <p>Progress :{course?.progressPercentage || 0}%</p>
                                    <ProgressBar completed={course?.progressPercentage} height='8px' isLabelVisible={false} bgColor="#4fa94d" />
                                </div>
                           </div>
                        ))
                    }
                </div>
            )
        }

    </div>
  )
}

export default EnrolledCourses