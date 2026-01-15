import {useState} from 'react'
import HomePageExplore from '../../../data/homepage-explore'
import HighlightText from './HighlightText';
import CourseCard from './CourseCard';
const tabNames = [
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths"
];
function ExploreMore() {
    const [currentTab, setCurrentTab] = useState(tabNames[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMyCards = (value) =>{
        setCurrentTab(value);
        const filteredCourses = HomePageExplore.filter((ele) => ele.tag === value);
        setCourses(filteredCourses[0].courses);
        setCurrentCard(filteredCourses[0].courses[0].heading);
    }
  return (
    <div className=' relative w-full flex flex-col gap-2 items-center justify-center my-20'>
        <div className=' text-4xl font-semibold text-center'>
            Unlock the
            <HighlightText text={"Power of Code"} />
        </div>

        <p className=' text-[16px] font-medium text-richblack-300 font-inter  text-center'>Learn to Build Anything You Can Imagine</p>
        {/* Tabs */}
        <div className=' flex mt-3 rounded-full bg-richblack-800 px-2 py-1 gap-10 border-b-richblack-500 border-b'>
            {
                tabNames.map((ele, index) => {
                    return (
                        <div
                            key={index}
                            onClick={() => setMyCards(ele)}
                            className={`text-[16px] flex flex-row items-center gap-2
                            ${currentTab===ele ? "text-richblack-5 bg-richblack-900 font-medium" : "text-richblack-300"} rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 px-5 py-2`}
                        >
                            {ele}
                        </div>
                    )
                }
                )

            }
        </div>

        <div className=' lg:h-[150px]'></div>

        {/* Cards */}
        <div className='absolute flex justify-center w-full gap-10 top-[200px]'>
            {
                courses.map((ele, index) => {
                    return (
                        <CourseCard 
                            key={index}
                            cardData={ele}
                            currentCard={currentCard}
                            setCurrentCard={setCurrentCard}
                        />
                    )
                }
                )
            }
        </div>
    </div>

  )
}

export default ExploreMore