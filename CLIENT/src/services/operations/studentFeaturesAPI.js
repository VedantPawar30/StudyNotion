import toast from "react-hot-toast";
import { paymentEndpoints } from "../apis"
import { apiConnector } from "../apiConnect";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";


const {
    CAPTURE_PAYMENT_API,
    VERIFY_SIGNATURE_API,
    SEND_PAYMENT_SUCCESS_EMAIL_API
} = paymentEndpoints


function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        }
        document.body.appendChild(script);
    });
}

export async function buyCourse(courses,token,userDetails,navigate,dispatch) {
    const toastId = toast.loading("Loading...");
    try{
        // load the razorpay script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if(!res){
            toast.error("Failed to load Razorpay SDK. Are you online?");
            return;
        }
        // call the backend to create a order
        const orderResponse = await apiConnector("POST", CAPTURE_PAYMENT_API,{courses},{
            Authorization: `Bearer ${token}`
        })
        if(!orderResponse?.data?.success){
            throw new Error(orderResponse?.data?.message || "Something went wrong while creating order");
        }
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: orderResponse.data.data.amount,
            currency: orderResponse.data.data.currency,
            name: "StudyNotion",
            description: "Thank you for purchasing the course",
            order_id: orderResponse.data.data.id,
            prefill:{
                name:`${userDetails?.firstName} ${userDetails?.lastName}`,
                email: userDetails?.email
            },
            handler: function (response) {
                //Send successfull mail
                sendPaymentSuccessEmail(response, orderResponse.data.data.amount, token);
                // verify signature
                verifyPayment({...response, courses}, token,navigate,dispatch)
            },
            
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function (response) {
            toast.error("Payment failed. Please try again.");
        });

        
    }
        
    catch(err){
        console.log("PAYMENT API ERROR...", err);
        toast.error("Could not initiate payment");

    }
    toast.dismiss(toastId);
}

async function sendPaymentSuccessEmail(response, amount, token) {
    try{
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API,{
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount: amount
        }, {
            Authorization: `Bearer ${token}`
        })

    }
    catch(err){
        console.log("Error sending payment success email", err);
    }
}

async function verifyPayment(paymentData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying payment...");
    dispatch(setPaymentLoading(true));
    try{
        const response = await apiConnector("POST", VERIFY_SIGNATURE_API, paymentData, {
            Authorization: `Bearer ${token}`
        })
        if(!response?.data?.success){
            throw new Error(response?.data?.message || "Payment verification failed");
        }
        toast.success("Payment successful! You are now enrolled in the course.");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart())
    }
    catch(err){
        console.log("Error verifying payment", err);
        toast.error("Payment verification failed");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}