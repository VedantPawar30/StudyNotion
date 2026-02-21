import {useState} from 'react'
import { Chart, registerables } from 'chart.js';
import { Pie } from 'react-chartjs-2';

Chart.register(...registerables);
function InstructorChart({courses}) {
    const [currChart,setCurrChart] = useState("students")
    // function to generate random colors for the chart
    const getRandomColors = (numColors) => {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
          const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
          colors.push(color);
        }
        return colors;
    }

    // Data for the chart displaying student info
    const studentData = {
        labels: courses.map(course => course.courseName),
        datasets: [
            {
                data: courses.map(course => course.totalStudentsEnrolled),
                backgroundColor: getRandomColors(courses.length),
            },
        ],
    };


    // Data for the chart displaying revenue info
    const revenueData = {
        labels: courses.map(course => course.courseName),
        datasets: [
            {
                data: courses.map(course => course.totalAmountGenerated),
                backgroundColor: getRandomColors(courses.length),
            },
        ],
    }

    // Options for the chart
    const options = {
        
        maintainAspectRatio: false,
        
    };


  return (
    <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
        <p className="text-lg font-bold text-richblack-5">Visualize</p>
        <div className=' flex gap-x-5'>
            <button onClick={() => setCurrChart("students")} className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "students"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}>Students Enrolled</button>
            <button className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "revenue"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`} onClick={() => setCurrChart("revenue")}>Revenue Generated</button>  
        </div>
        <div className="relative mx-auto aspect-square max-w-[400px] h-[350px]">
            <Pie data={currChart === "students" ? studentData : revenueData} options={options} />
        </div>

    </div>
  )
}

export default InstructorChart