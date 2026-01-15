import React from 'react'
import Instructor from "../../../assets/Images/Instructor.png"
import HighlightText from './HighlightText'
import CTAButton from './Button'
import { FaArrowRight } from 'react-icons/fa'

function InstructorSection() {
  return (
    <div className='mt-20'>
      <div className='flex flex-row gap-20 justify-center items-center'>

        {/* Image Section */}
        <div className="w-[50%] flex justify-center">
            <div className="relative">

                {/* White background layer */}
                <div className="absolute -top-5 -left-5 w-full h-full bg-white "></div>

                {/* Actual image */}
                <img
                src={Instructor}
                alt="Instructor"
                className="relative z-10 "
                />

            </div>
        </div>


        {/* Text Section */}
        <div className='w-[50%] flex flex-col gap-10'>
          <div className='text-4xl font-semibold w-[50%]'>
            Become an
            <HighlightText text={" Instructor"} />
          </div>

          <p className='font-medium text-[16px] w-[70%] text-richblack-300'>
            Instructors from around the world teach millions of students on StudyNotion.
            We provide the tools and skills to teach what you love.
          </p>

          <div className='w-fit'>
            <CTAButton active={true} linkto={"/signup"}>
              <div className='flex gap-2 items-center justify-center text-[16px]'>
                <p>Start Teaching Today</p>
                <FaArrowRight />
              </div>
            </CTAButton>
          </div>
        </div>

      </div>
    </div>
  )
}

export default InstructorSection
