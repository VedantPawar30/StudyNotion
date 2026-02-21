import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import { Pagination, Autoplay } from "swiper/modules";
import ReactStars from "react-stars";
import { ratingEndpoints } from "../../services/apis";
import { apiConnector } from "../../services/apiConnect";

function ReviewSlider() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const allReviews = async () => {
      try {
        const response = await apiConnector(
          "GET",
          ratingEndpoints.GET_ALL_RATINGS_API
        );

        if (!response?.data?.success) {
          console.log("Error fetching reviews");
          return;
        }

        setReviews(response.data.data || []);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    allReviews();
  }, []);

  return (
    <div className=" w-full">
      <div className="w-full max-w-[1260px] mx-auto pb-20">
        {reviews.length > 0 && (
          <Swiper
            spaceBetween={24}
            loop={reviews.length > 3}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            modules={[Pagination, Autoplay]}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: {
                slidesPerView: Math.min(4, reviews.length),
              },
            }}
            className="w-full max-h-120"
          >
            {reviews.map((review, index) => (
              <SwiperSlide key={index}>
                <div className="bg-richblack-800 p-5 rounded-xl shadow-md h-full flex flex-col gap-y-2 min-h-[200px]">
                  
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        review?.user?.image
                          ? review.user.image
                          : `https://api.dicebar.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                      }
                      alt="User"
                      className="w-10 h-10 object-cover rounded-full"
                    />

                    <div>
                      <p className="font-semibold text-md">
                        {review?.user?.firstName} {review?.user?.lastName}
                      </p>
                      <p className="text-sm text-richblack-300">
                        {review?.course?.courseName}
                      </p>
                    </div>
                  </div>

                  <p className="text-md text-richblack-50 mt-4 line-clamp-3">
                    {review?.review}
                  </p>

                  <div className=" flex gap-2 items-center mt-4">
                    <p className="text-md text-yellow-50">
                      {review?.rating}
                    </p>
                    <ReactStars
                      count={5}
                      size={20}
                      value={review?.rating}
                      edit={false}
                      activeColor="#ffd700"
                      emptyIcon={<i className="far fa-star"></i>}
                      fullIcon={<i className="fa fa-star"></i>}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}

export default ReviewSlider;