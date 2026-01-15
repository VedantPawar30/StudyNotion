import React from 'react'
import { useSelector } from 'react-redux'
function RenderTotalAmount() {
  const {total,cart} = useSelector((state) => state.cart)
  const handleBuyNow = () => {
    const courses = cart.map((course) => course._id);
    console.log("Courses to buy:", courses);
    //TODO : Integrate payment gateway here
  }
  return (
    <div>
      <p>Total :</p>
      <p>Rs {total}</p>

      <IconBtn
        text="Buy Now"
        onClick={handleBuyNow}
        customClasses="w-full justify-center"
      />

    </div>
  )
}

export default RenderTotalAmount