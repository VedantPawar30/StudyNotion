import {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import RatingStars from '../../common/RatingStars'
import GetAvgRating from '../../../utils/averageRating';
function Course_Card({course,Height}) {

    const [avgReviewCount, setAvgReviewCount] = useState(0);
    useEffect(() =>{
        const count = GetAvgRating(course?.ratingAndReviews);
        setAvgReviewCount(count);
    },[course])
  return (
    <>
        <Link to={`/courses/${course._id}`}>  
            <div className=''>
                <div className=' rounded-lg'>
                    <img className={` ${Height} w-full object-cover rounded-xl`} src={course?.thumbnail} alt="Thumbnail" />
                </div>
                <div className="flex flex-col gap-2 px-1 py-3">
                    <p className="text-xl text-richblack-5">{course?.courseName}</p>
                    <p className="text-sm text-richblack-50">{course?.instructor?.firstName} {course?.instructor?.lastName}</p>
                    <div className=' flex items-center gap-2'>
                        <span className="text-yellow-5">{avgReviewCount || 0}</span>
                        <RatingStars Review_Count={avgReviewCount}></RatingStars>
                        <span className="text-richblack-400">{course?.ratingAndReviews?.length} Ratings</span>
                    </div>
                    <p className="text-xl text-richblack-5">{course?.price}</p>
                </div>
            </div>
        </Link>
    </>
  )
}

export default Course_Card