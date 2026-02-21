import {useEffect, useState} from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiConnect';
import { categories } from '../services/apis';
import { getCatalogPageData } from '../services/operations/pageAndComponentData';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import Course_Card from '../components/core/Catalog/Course_Card';
import { useSelector } from 'react-redux';
import { RotatingLines } from 'react-loader-spinner';
import Error from "./Error"
function Catalog() {
  const {loading} = useSelector((state) => state.profile);
  const [active, setActive] = useState(1);
  const {catalogName} = useParams();
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");

  //Fetch all categories
  useEffect(()=>{
    const getCategories = async() => {
      const response = await apiConnector("GET", categories.GET_ALL_CATEGORIES)
      const categoryId = response.data.data.find((category) => category.name.split(" ").join("-").toLowerCase() === catalogName)?._id;
      setCategoryId(categoryId);
    }
    getCategories();
  }, [catalogName])

  useEffect(() => {
    
    const getCategoryDetails = async() => {
      try{
        const res = await getCatalogPageData(categoryId);
        console.log("Printing res...", res);
        setCatalogPageData(res);
      }
      catch(err) {
        console.log("Error fetching Catalog Page Data", err);
      }
    }
    if(categoryId) {
      getCategoryDetails();
    }
  }, [categoryId])

  if(loading || !catalogPageData){
    return (
      <div className='h-[80vh] flex justify-center items-center'>
        <RotatingLines
          strokeColor="#FFE83D"
          strokeWidth="5"
          animationDuration="0.75"
          width="96"
          visible={true}
        />
      </div>
    )
  }

  if(!loading && !catalogPageData.success){
    return <Error></Error>
  }

  return (
    <>
      <div className=" box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-[650px] flex-col justify-center gap-4 lg:max-w-[1260px] ">
          <p className="text-sm text-richblack-300">
            {`Home / Catalog / `}
            <span className="text-yellow-25">
              {catalogPageData?.data?.selectedCategory?.name}
            </span>
          </p>
          <p className="text-3xl text-richblack-5">
            {catalogPageData?.data?.selectedCategory?.name}
          </p>
          <p className="max-w-[870px] text-richblack-200">
            {catalogPageData?.data?.selectedCategory?.description}
          </p>
        </div>
      </div>
      
        {/* section1 */}
      <div className=" mx-auto box-content w-full max-w-[650px] px-4 py-12 lg:max-w-[1260px]">
          <div className='text-richblack-25 text-3xl'>Courses to get you started</div>
          <div className="my-4 flex border-b border-b-richblack-600 text-sm">
            <p className={`px-4 py-2 ${
                  active === 1
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(1)}>
                Most Popular
            </p>
            <p className={`px-4 py-2 ${
                  active === 2
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(2)}>
                New
            </p>
          </div>
          <div>
            <CourseSlider Courses={catalogPageData?.data?.selectedCategory?.courses}></CourseSlider>
          </div>
      </div>

        {/* section2 */}
      <div className=" mx-auto box-content w-full max-w-[650px] px-4 py-12 lg:max-w-[1260px]">
          <div className="text-richblack-25 text-3xl"> Top Courses in {catalogPageData?.data?.differentCategory?.name}</div>
          <div className='py-8'>
            <CourseSlider Courses={catalogPageData?.data?.differentCategory?.courses}></CourseSlider>
          </div>
      </div>

        {/* section3 */}
      <div className=" mx-auto box-content w-full max-w-[650px] px-4 py-12 lg:max-w-[1260px]">
            <div className="text-richblack-25 text-3xl">Frequently Bought</div>
            <div className=' py-8'>
              <div className=' grid grid-cols-1 gap-6 lg:grid-cols-2'>
                {
                  catalogPageData?.data?.mostSellingCourses?.slice(0,4).map((course,index)=>(
                    <Course_Card key={index} course={course} Height={"h-[400px]"}></Course_Card>
                  ))
                }
              </div>
            </div>
      </div>
      <Footer></Footer>
    </>
  )
}

export default Catalog