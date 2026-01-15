import React from "react";
import Logo1 from "../../../assets/TimeLineLogo/logo1.svg";
import Logo2 from "../../../assets/TimeLineLogo/logo2.svg";
import Logo3 from "../../../assets/TimeLineLogo/logo3.svg";
import Logo4 from "../../../assets/TimeLineLogo/logo4.svg";
import timelineImage from "../../../assets/Images/TimelineImage.png";

function TimelineSection() {
  const timeline = [
    {
      logo: Logo1,
      heading: "Leadership",
      description: "Fully committed to the success company",
    },
    {
      logo: Logo2,
      heading: "Responsibility",
      description: "Students will always be our top priority",
    },
    {
      logo: Logo3,
      heading: "Flexibility",
      description: "The ability to switch is an important skill",
    },
    {
      logo: Logo4,
      heading: "Solve the problem",
      description: "Code your way to a solution",
    },
  ];

  return (
    <div>
        <div className=" flex flex-row gap-15  items-center">
            <div className="w-[45%] flex flex-col">
            {timeline.map((element, index) => (
                <div key={index} className="flex gap-6">

                {/* ICON + DOTTED LINE */}
                <div className="flex flex-col items-center">
                    {/* Circle */}
                    <div className="w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center shadow-md">
                    <img src={element.logo} alt="" className="w-6 h-6" />
                    </div>

                    {/* Dotted Line (except last item) */}
                    {index !== timeline.length - 1 && (
                    <div className="h-10 my-4 w-px border-l-2 border-dotted border-richblack-300"></div>
                    )}
                </div>

                {/* TEXT */}
                <div className="pb-8">
                    <h2 className="font-semibold text-[18px] text-richblack-900">
                    {element.heading}
                    </h2>
                    <p className="text-base text-richblack-600 max-w-[300px]">
                    {element.description}
                    </p>
                </div>

                </div>
            ))}
            </div>


            <div className="relative z-0">
                <div className="absolute -inset-4  bg-blue-300/30 blur-lg rounded-md -z-20"></div>
                <div className="absolute w-full h-full top-5 left-5 bg-white -z-10"></div>
               <img src={timelineImage} alt="Timeline Image" className="  z-10  object-cover h-fit" />
                
               <div className=" absolute  bg-caribbeangreen-700 flex flex-row text-white uppercase py-7 left-[50%] translate-x-[-50%] translate-y-[-50%]">
                   <div className=" flex flex-row gap-5 items-center border-r border-caribbeangreen-300 px-7" >
                        <p className=" font-bold text-3xl">10</p>
                        <p className=" text-caribbeangreen-300 text-sm">Years of Experience</p>
                   </div>

                   <div className=" gap-5 flex items-center px-7">
                        <p className=" font-bold text-3xl">250</p>
                        <p className=" text-caribbeangreen-300 text-sm">Type of courses</p>
                   </div>
               </div>
            </div>

        </div>
    </div>
  );
}

export default TimelineSection;
