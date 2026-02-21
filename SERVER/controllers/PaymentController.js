const {razorpayInstance} = require('../config/razorpay');
const Course = require('../models/Course');
const User = require('../models/User');
const crypto = require('crypto');
const {mailSender} = require('../utils/mailSender');
const {paymentSuccessEmail} = require("../mail/template/paymentSuccessEmail")
const {courseEnrollmentEmail} = require('../mail/template/courseEnrollmentEmail');
const { default: mongoose } = require("mongoose");
const CourseProgress = require('../models/CourseProgress');
require('dotenv').config();

// Initiate the payment and create an order
exports.capturePayment = async (req,res)=>{
    try{
        const {courses} = req.body;
        const userId = req.user.id;
        if(!courses || courses.length === 0){
            return res.status(400).json({
                success: false,
                message: "Please provide courseIds"
            });
        }

        let totalAmount = 0;
        for(let courseId of courses){
            const course = await Course.findById(courseId);
            if(!course){
                return res.status(404).json({
                    success: false,
                    message: `Course with id ${courseId} not found`
                });
            }
            const uid = new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uid)){
                return res.status(409).json({
                    success: false,
                    message: `User is already enrolled in the course with id ${courseId}`
                });
            }
            totalAmount += course.price;
        }

        const options = {
            amount: totalAmount * 100, //Amount in paise
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`,
            notes : {
                courseIds: courses.join(','),
                userId: userId
            }
        };


        
        const paymentResponse = await razorpayInstance.orders.create(options);
        return res.status(200).json({
            success: true,
            message: "Order created successfully",
            data : paymentResponse
        });
        
    }
    catch(err){
        console.error("Error in capturing payment: ", err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

// Verify the payment and enroll the user in the courses
exports.verifySignature = async (req,res)=>{
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;
    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId){
        return res.status(400).json({
            success: false,
            message: "Please provide all the required fields"
        });
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                                    .update(body.toString())
                                    .digest('hex');
    if(expectedSignature === razorpay_signature){
        // Enroll the user in the courses
        try{
            for(let courseId of courses){
                const course = await Course.findById(courseId);
                const user = await User.findById(userId);
                if(!course || !user){
                    return res.status(404).json({
                        success: false,
                        message: `Course or User not found for courseId ${courseId}`
                    });
                }
                const courseProgress = await CourseProgress.create({
                    courseId: courseId,
                    userId: userId,
                    completedVideos: []
                })
                user.courses.push(courseId);
                user.courseProgress.push(courseProgress._id);
                await user.save();
                course.studentsEnrolled.push(userId);
                await course.save();

                
                // Send course enrollment email to the user
                const emailResponse =await mailSender(
                    user.email,
                    "Congratulations! Enrolled Successfully",
                    courseEnrollmentEmail(course.courseName,user.firstName+" "+user.lastName)
                );
                console.log("Email Sent Successfully :",emailResponse)
            }
            return res.status(200).json({
                success: true,
                message: "User enrolled successfully in the courses",
            });
        }
        catch(err){
            console.error("Error in enrolling the user: ", err);
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }
    else{
        return res.status(400).json({
            success: false,
            message: "Invalid signature"
        });
    }
}
exports.sendPaymentSuccessEmail = async(req, res) => {
    const {orderId, paymentId, amount} = req.body;

    const userId = req.user.id;

    if(!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({success:false, message:"Please provide all the fields"});
    }

    try{
        //student ko dhundo
        const enrolledStudent = await User.findById(userId);
        const mailRes = await mailSender(
            enrolledStudent.email,
            `Payment Recieved`,
             paymentSuccessEmail(`${enrolledStudent.firstName}`,
             amount/100,orderId, paymentId)
        )
    }
    catch(error) {
        console.log("error in sending mail", error)
        return res.status(500).json({success:false, message:"Could not send email"})
    }
}

//Capture the payment and initiate the order
// exports.capturePayment = async (req, res) => {
//     try{
//         const {courseId} = req.body;

//         const userId = req.user.id;

//         //Validate courseId
//         if(!courseId){
//             return res.status(400).json({
//                 success: false,
//                 message: "Please provide valid courseId"
//             });
//         }


//         //Fetch the course and user details
//         const course = await Course.findById(courseId);
//         const user = await User.findById(userId);

//         if(!course || !user){
//             return res.status(404).json({
//                 success: false,
//                 message: "Course or User not found"
//             });
//         }

//         //Check if the user is already enrolled
//         const alreadyEnrolled = course.studentsEnrolled.some(
//             id => id.equals(userId)
//         );

//         if (alreadyEnrolled) {
//             return res.status(409).json({
//                 success: false,
//                 message: "User is already enrolled in this course"
//             });
//         }

//         //BABBAR WAY
//         // const uid=  mongoose.Types.ObjectId(userId);
//         // if(course.studentsEnrolled.includes(uid)){
//         //     return res.status(409).json({
//         //         success: false,
//         //         message: "User is already enrolled in this course"
//         //     });
//         // }

//         //Create an order in Razorpay
//         const options = {
//             amount: course.price * 100, //Amount in paise
//             currency: "INR",
//             receipt: `receipt_order_${Date.now()}`,
//             notes : {
//                 courseId: courseId,
//                 userId: userId
//             }
//         };
//         const order = await razorpayInstance.orders.create(options);
//         console.log(order)
//         return res.status(200).json({
//             success: true,
//             message: "Order created successfully",
//             orderId: order.id,
//             amount: order.amount,
//             currency: order.currency,
//             courseName: course.name,
//             courseDescription: course.courseDescription,
//             thumbnail: course.thumbnail,
//         });
//     }
//     catch(err){
//         console.error("Error in capturing payment: ", err);
//         return res.status(500).json({
//             success: false,
//             message: err.message,
//         });
//     }
// }

// // Verify the payment and enroll the user in the course
// exports.verifySignature = async (req, res) => {
//     const webHookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
//     const signature = req.headers['x-razorpay-signature'];

//     const shasum = crypto.createHmac('sha256', webHookSecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest('hex');

//     if (signature === digest) {
//         console.log("Payment Authorized")  
        
//         //Enroll the user in the course
//         const {courseId, userId} = req.body.payload.payment.entity.notes;

//         try{
//             const course = await Course.findById(courseId);
//             const user = await User.findById(userId)
//             if(!course || !user){
//                 return res.status(404).json({
//                     success: false,
//                     message: "Course or User not found"
//                 });
//             }

//             user.courses.push(courseId);
//             await user.save();

//             console.log(user);

//             course.studentsEnrolled.push(userId);
//             await course.save();

//             console.log(course);

//             //Send course enrollment email to the user
//             const emailResponse = await mailSender(
//                 user.email,
//                 "Congratulations! Enrolled Successfully",
//                 courseEnrollmentEmail(course.courseName,user.firstName+" "+user.lastName)
//             );

//             return res.status(200).json({
//                 success: true,
//                 message: "User enrolled successfully in the course",
//             });


//         }
//         catch(err){
//             console.error("Error in enrolling the user: ", err);
//             return res.status(500).json({
//                 success: false,
//                 message: err.message,
//             });
//         }
//     }
//     else{
//         return res.status(400).json({
//             success: false,
//             message: "Invalid signature"
//         });
//     }
// }