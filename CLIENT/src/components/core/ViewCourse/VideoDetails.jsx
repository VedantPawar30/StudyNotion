import React, { useState,useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { updateCompletedLectures } from '../../../slices/viewCourseSlice';
import ReactPlayer from "react-player";
import { AiFillPlayCircle } from "react-icons/ai";
import IconBtn from '../../common/IconBtn';
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
function VideoDetails() {

  const {courseId,sectionId,subSectionId} = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const playerRef = useRef();
  const {token} = useSelector((state) => state.auth);
  const {courseSectionData,courseEntireData,completedLectures} = useSelector((state) => state.viewCourse);
  
  const [videoData, setVideoData] = useState(null);

  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() =>{
    const setVideoSpecificDetails = async() =>{
      if(!courseSectionData.length){
        return;
      }

      if(!courseId && !sectionId && !subSectionId){
        navigate('/dashboard/enrolled-courses');
      }
      else{
        // all three fields are present
        const filteredData = courseSectionData.filter((section) => section._id === sectionId)
        const filteredVideoData = filteredData[0]?.subsection?.filter((sub) => sub._id === subSectionId);
        console.log("FilteredVideo Data ", filteredVideoData)
        setVideoData(filteredVideoData[0]);
        setVideoEnded(false);
      }
    }
    setVideoSpecificDetails();
  },[courseSectionData,courseEntireData,location.pathname])

  const isFirstVideo =() =>{
    const currentSectionIndex = courseSectionData.findIndex((section) => section._id === sectionId);
    const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subsection?.findIndex((sub) => sub._id === subSectionId);
    if(currentSectionIndex === 0 && currentSubSectionIndex === 0){
      return true;
    }
    return false;
  }

  const isLastVideo =() =>{
    const currentSectionIndex = courseSectionData.findIndex((section) => section._id === sectionId);
    const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subsection?.findIndex((sub) => sub._id === subSectionId);
    if(currentSectionIndex === courseSectionData.length - 1 && currentSubSectionIndex === courseSectionData[currentSectionIndex]?.subsection?.length - 1){
      return true;
    }
    return false;
  }


  const goToNextVideo = () =>{
    const currentSectionIndex = courseSectionData.findIndex((section) => section._id === sectionId);
    const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subsection?.findIndex((sub) => sub._id === subSectionId);
    const noOfSubSections = courseSectionData[currentSectionIndex]?.subsection?.length
    if(currentSubSectionIndex !== noOfSubSections - 1){
      // navigate to next subsection of the same section
      const nextSubSectionId = courseSectionData[currentSectionIndex]?.subsection?.[currentSubSectionIndex + 1]?._id;
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`);
    }
    else{
      // if it's the last subsection of the last section, do nothing
      if(currentSectionIndex === courseSectionData.length - 1){
        return;
      }
      // navigate to the first subsection of the next section
      const nextSectionId = courseSectionData[currentSectionIndex + 1]?._id;
      const nextSubSectionId = courseSectionData[currentSectionIndex + 1]?.subsection?.[0]?._id;
      navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`);
    }
    
  }

  const goToPreviousVideo = () =>{
    const currentSectionIndex = courseSectionData.findIndex((section) => section._id === sectionId);
    const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subsection?.findIndex((sub) => sub._id === subSectionId);
   
    if(currentSubSectionIndex > 0){
      // navigate to previous subsection of the same section
      const previousSubSectionId = courseSectionData[currentSectionIndex]?.subsection?.[currentSubSectionIndex - 1]?._id;
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${previousSubSectionId}`);
    }
    else{
      // if it's the first subsection of the first section, do nothing
      if(currentSectionIndex === 0){
        return;
      }
      // navigate to the last subsection of the previous section
      const previousSectionId = courseSectionData[currentSectionIndex - 1]?._id;
      const previousSubSectionId = courseSectionData[currentSectionIndex - 1]?.subsection?.[courseSectionData[currentSectionIndex - 1]?.subsection?.length - 1]?._id;
      navigate(`/view-course/${courseId}/section/${previousSectionId}/sub-section/${previousSubSectionId}`);
    }
  }

  const handleLectureCompletion = async () =>{
    // Dummy Code, baad me we will replace with actual call
    setLoading(true);
    const res = await markLectureAsComplete({courseId,subSectionId}, token);
    if(res){
      dispatch(updateCompletedLectures(subSectionId));
    }
    setLoading(false);
  }

  return (
  <div className="flex flex-col gap-5 text-richblack-5">
    {!videoData ? (
      <div className='text-center'>No Data Found</div>
    ) : (
      <>
        <div className="aspect-video w-full bg-black rounded-md overflow-hidden">
          <ReactPlayer
            ref={playerRef}
            url={videoData?.videoUrl}   
            controls
            width="100%"
            height="100%"
            onEnded={() => setVideoEnded(true)}
            config={{
              file: {
                forceVideo: true,
                attributes: {
                  controlsList: "nodownload",
                  
                },
              },
            }}
          />
        </div>

          {
            videoEnded && (
              <div style={{
                backgroundImage:
                  "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
              }} className="full absolute inset-0 z-100 grid h-full place-content-center font-inter">
                {
                  !completedLectures.includes(subSectionId) && (
                    <IconBtn
                      disabled={loading}
                      text={loading ? "Marking..." : "Mark as Complete"}
                      onclick={() => handleLectureCompletion()}
                      customClasses="text-xl max-w-max px-4 mx-auto"
                    />
                  )
                }

                <IconBtn
                  disabled={loading}
                  onclick={() =>{
                    if(playerRef?.current){
                      playerRef.current?.seekTo(0);
                      // auto play the video once the user clicks on rewatch
                      playerRef.current?.getInternalPlayer()?.play();
                      setVideoEnded(false);
                    }
                  }}
                  text="Rewatch"
                  customClasses="text-xl max-w-max px-4 mx-auto mt-2"
                />

                <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                  {
                    !isFirstVideo() && (
                      <button
                        disabled={loading}
                        onClick={() => goToPreviousVideo()}
                        className='cursor-pointer rounded-md bg-richblack-800 px-5 py-2 font-semibold text-richblack-5'
                      >
                        Prev
                      </button>
                    )
                  }
                  {
                    !isLastVideo() && (
                      <button
                        disabled={loading}
                        onClick={() => goToNextVideo()}
                        className='cursor-pointer rounded-md bg-richblack-800 px-5 py-2 font-semibold text-richblack-5'
                      >
                        Next
                      </button>
                    )
                  }
                </div>
              </div>
            )
          }
        
      </>
    )}
    <h1 className="mt-4 text-3xl font-semibold">
      {videoData?.title}
    </h1>
    <p className="pt-2 pb-6">
      {videoData?.description}
    </p>
  </div>
)

}

export default VideoDetails