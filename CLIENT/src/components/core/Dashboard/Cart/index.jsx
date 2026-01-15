import { useSelector } from "react-redux"

export default function Cart() {
    const {total,totalItems} =  useSelector((state) => state.cart)
    return (
    <div className="text-richblack-5">
        <h1>Your Cart</h1>
        <p>{totalItems} Courses in Cart</p>
        {
            total>0 ? (

                <div>
                    <RenderCartCourses />
                    <RenderTotalAmount/>
                </div>
                
            ):(
                <p>Your cart is empty</p>
            )
        }
    </div>
    )
}