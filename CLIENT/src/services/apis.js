const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const endpoints = {
    SENDOTP_API: BASE_URL + "/auth/sendotp",
    SIGNUP_API: BASE_URL + "/auth/signup",
    LOGIN_API: BASE_URL + "/auth/login",
    RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
    RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
    CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
}


export const categories = {
    GET_ALL_CATEGORIES : BASE_URL + "/course/getAllCategories",
    CREATE_CATEGORY_API: BASE_URL + "/course/createCategory",
    GET_CATEGORY_PAGE_DETAILS_API: BASE_URL + "/course/getCategoryPageDetails",
}

export const contactusEndpoint = {
    CONTACT_US_API : BASE_URL + "/contactus/submitQuery",
}

export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteAccount",
}

export const profileEndpoints = {
    GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
    GET_USER_DETAILS_API: BASE_URL + "/profile/getAllUserDetails",
    GET_INSTRUCTOR_DATA_API : BASE_URL + "/profile/instructorDashboard",
}

export const courseEndpoints = {
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  GET_ALL_COURSES_API: BASE_URL + "/course/getAllCourses",
  GET_COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  GET_FULL_COURSE_DETAILS_API: BASE_URL + "/course/getFullCourseDetails",
  GET_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
  LECTURE_COMPLETION_API: BASE_URL + "/course/updateCourseProgress",
  DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",


  CREATE_SECTION_API: BASE_URL + "/course/createSection",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection",

  CREATE_SUBSECTION_API: BASE_URL + "/course/createSubSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
  DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection",
};

export const ratingEndpoints = {
  CREATE_RATING_API: BASE_URL + "/course/createRating",
  GET_ALL_RATINGS_API: BASE_URL + "/course/getAllRating",
  GET_AVERAGE_RATING_API: BASE_URL + "/course/getAverageRating",
};

export const paymentEndpoints = {
  CAPTURE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  VERIFY_SIGNATURE_API: BASE_URL + "/payment/verifySignature",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
};

