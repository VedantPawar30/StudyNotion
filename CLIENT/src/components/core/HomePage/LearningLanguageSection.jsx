import React from 'react'
import HighlightText from '../HomePage/HighlightText'
import know_rour_progress from '../../../assets/Images/Know_your_progress.png'
import compare_with_others from '../../../assets/Images/Compare_with_others.png'
import plan_your_lesson from '../../../assets/Images/Plan_your_lessons.png'
import CTAButton from '../HomePage/Button'
function LearningLanguageSection() {
  return (
    <div  className=' mt-[130px] mb-20'>
      <div className=' flex flex-col gap-1 items-center justify-center'>
        <div className=' text-4xl font-semibold text-center'>
          Your swiss knife for
          <HighlightText text={"learning any language"}/>
        </div>
        <div className=' text-center text-richblack-600 mx-auto text-base  font-medium w-[70%]'>
          Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
        </div>

        <div className=' flex flex-row items-center justify-center'>
          <img src={know_rour_progress} 
               alt="know your progress" 
               className=' object-contain -mr-32'/>
          <img 
               src={compare_with_others}
               alt="compare with others"
               className=' object-contain'/>
          <img
               src={plan_your_lesson}
               alt="plan your lesson"
               className=' object-contain -ml-36'/>
        </div>
        <div className='w-fit'>
          <CTAButton active={true} linkto={"/signup"}> 
            <div className='text-[16px]'>
              Learn More
            </div>
          </CTAButton>
        </div>
      </div> 
    </div>
  )
}

export default LearningLanguageSection