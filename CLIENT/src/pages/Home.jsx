import React from 'react'
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import HighlightText from '../components/core/HomePage/HighlightText'

import CTAButton from "../components/core/HomePage/Button"
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from "../components/core/HomePage/CodeBlocks"
import TimelineSection from '../components/core/HomePage/TimelineSection';
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection';
import InstructorSection from '../components/core/HomePage/InstructorSection';
import Footer from '../components/common/Footer';
import ExploreMore from '../components/core/HomePage/ExploreMore';

function Home() {
  return (
    <div>
      {/*Section1  */}
      <div className='relative mx-auto flex flex-col w-11/12 max-w-[1260px] items-center 
      text-white justify-between'>

        
        <div className=' group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
        transition-all duration-200 hover:scale-95 w-fit'>
            <Link to={"/signup"}>
                <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px]
                                transition-all duration-200 group-hover:bg-richblack-900'>
                    <p>Become an Instructor</p>
                    <FaArrowRight />
                </div>
            </Link>
        </div>

        

        <div className='text-center text-4xl font-semibold mt-7'>
            Empower Your Future with
            <HighlightText text={"Coding Skills"} />
        </div>

        <div className=' mt-4 w-[90%] text-center text-lg font-bold text-richblack-300'>
            With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
        </div>

        <div className='flex flex-row gap-7 mt-8'>
            <CTAButton active={true} linkto={"/signup"}> 
                Learn More
            </CTAButton>

            <CTAButton active={false} linkto={"/login"}> 
                Book a Demo
            </CTAButton>
        </div>

        <div className='mx-3 my-12  shadow-2xl shadow-blue-200'>
            <video
            muted
            loop
            autoPlay
            >
            <source  src={Banner} type="video/mp4" />
            </video>
        </div>

        {/* Code Section 1 */}
        <div className='w-full'>
            <CodeBlocks 
                position={"lg:flex-row"}
                heading={
                    <div className='text-4xl font-semibold'>
                        Unlock Your
                        <HighlightText text={"coding potential"}/>
                        with our online courses
                    </div>
                }
                subheading = {
                    "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                }
                ctabtn1={
                    {
                        btnText: "Try it Yourself",
                        linkto: "/signup",
                        active: true,
                    }
                }
                ctabtn2={
                    {
                        btnText: "Learn More",
                        linkto: "/login",
                        active: false,
                    }
                }

                codeblock={`<<!DOCTYPE html>\n<html>\n<head>\n<title>Example</title>\n<linkrel="stylesheet"href="styles.css">\n</head>\n<body>\n<h1>Learn to Code</h1>\n<p>Start your coding journey today</p>\n</body>\n</html>`}
                codeColor={"text-yellow-25"}
                backgroudGradient="bg-gradient-to-r from-[#FFD60A] to-[#FF5722]"
                
            />
        </div>

                {/* Code Section 2 */}
        <div className=' w-full '>
            <CodeBlocks 
                position={"lg:flex-row-reverse"}
                heading={
                    <div className='text-4xl font-semibold'>
                        Start
                        <HighlightText text={"coding in"}/><br />
                        <HighlightText text={"seconds"}/>
                        
                    </div>
                }
                subheading = {
                    "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                }
                ctabtn1={
                    {
                        btnText: "Continue Lesson",
                        linkto: "/signup",
                        active: true,
                    }
                }
                ctabtn2={
                    {
                        btnText: "Learn More",
                        linkto: "/login",
                        active: false,
                    }
                }

                codeblock={`import React from "react";\nimport CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n \nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
                codeColor={"text-blue-25"}
                backgroudGradient="bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB]"
                
            />
        </div>

        <ExploreMore />

    </div>

    {/*Section 2  */}
    <div className='bg-pure-greys-5 text-richblack-700'>
            <div className='h-[310px]' style={{backgroundImage: "url('../src/assets/Images/bghome.svg')"}}>
                <div className=' w-11/12 max-w-[1260px] mx-auto flex flex-col items-center gap-5'>
                    <div className=' h-[150px]'></div>
                    <div className=' flex flex-row gap-7 text-white'>
                        <CTAButton active={true} linkto={"/signup"}> 
                            <div className=' flex items-center gap-3'>
                                Explore full Catalog
                                <FaArrowRight></FaArrowRight>
                            </div>
                        </CTAButton>
                        <CTAButton active={false} linkto={"/signup"}> 
                            <div className=' flex items-center gap-3'>
                                Learn More
                                
                            </div>
                        </CTAButton>
                    </div>
                </div>
            </div>

            <div className=' mx-auto w-11/12 max-w-[1260px] flex flex-col items-center justify-between gap-7'>
                <div className=' flex flex-row justify-center mt-[95px] mb-10 gap-5'>
                    <div className=' text-4xl font-semibold w-[45%]'>
                        Get the Skills you need for a
                        <HighlightText text={"Job that is in demand"}/>
                    </div>
                    <div className=' flex flex-col gap-10 w-[40%] items-start'>
                        <div className=' text-[16px]'>
                            The modern StudyNotion is the dictates its own terms. Today, to be a competitive 
                            specialist requires more than professional skills.
                        </div>
                        <CTAButton active={true} linkto={"/signup"}> 
                            <div>
                                Learn More
                            </div>
                        </CTAButton>
                    </div>
                </div>

                <TimelineSection />

                <LearningLanguageSection /> 
            </div>

            

    </div>

    {/*Section 3 */}
     <div className=' w-11/12 mx-auto max-w-[1260px] flex flex-col items-center justify-between gap-8 bg-richblack-900 text-white'>

           <InstructorSection  />
           <h2 className=' text-center text-4xl font-semibold mt-10 mb-10'>Reviews from other learners</h2>
            {/*Review Slider */}
     </div>

    {/*Footer */}
     <Footer></Footer>           

    </div>
  )
}

export default Home