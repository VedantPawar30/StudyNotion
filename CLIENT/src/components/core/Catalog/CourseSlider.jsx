import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "swiper/css/navigation";

import { Pagination, FreeMode,Navigation ,Autoplay} from "swiper/modules";

import Course_Card from './Course_Card';
function CourseSlider({Courses}) {
  return (
    <>
        {
            Courses?.length ? (
                <Swiper
                    slidesPerView={1}
                    loop={true}
                    spaceBetween={25}
                    pagination={{clickable: true,dynamicBullets: true}}
                    modules={[Pagination,FreeMode]}
                    breakpoints={{
                        1024:{slidesPerView:3}
                    }}
                    className=' max-h-120'
                >
                    {Courses.map((course) => (
                        <SwiperSlide key={course._id}>
                            <Course_Card course={course} Height={"h-[250px]"} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            ):(
                <p className="text-xl text-richblack-5">No courses available </p>
            )
        }
    </>
  )
}

export default CourseSlider