# 📚 StudyNotion – An EdTech Platform

StudyNotion is a fully functional **Ed-Tech platform** built using the **MERN Stack** that enables users to create, consume, and rate educational content.

The platform provides:
- A seamless and interactive learning experience for students.
- A platform for instructors to showcase their expertise globally.

---

# 🏗️ System Architecture

StudyNotion follows a **Client-Server Architecture** consisting of:

Frontend (ReactJS)  
⬇ REST API  
Backend (NodeJS + ExpressJS)  
⬇  
Database (MongoDB)

---

# 🚀 Tech Stack

## 💻 Frontend
- ReactJS
- Redux (State Management)
- Tailwind CSS
- CSS
- Figma (UI Design)
- VS Code

## ⚙️ Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (Authentication)
- Bcrypt (Password Hashing)
- Cloudinary (Media Storage)
- Razorpay (Payment Integration)

## ☁️ Deployment
- Frontend → Vercel
- Backend → Render / Railway
- Database → MongoDB Atlas
- Media → Cloudinary

---

# 👨‍🎓 Features

## 👩‍🎓 For Students
- Signup/Login with JWT Authentication
- OTP Verification
- Browse Courses
- View Course Details
- Add to Wishlist
- Add to Cart & Checkout
- Razorpay Payment Integration
- Enroll in Courses
- Rate Courses
- View & Edit Profile
- Track Course Content (Videos, Documents)

## 👨‍🏫 For Instructors
- Instructor Dashboard
- Create / Update / Delete Courses
- Upload Course Content
- Manage Pricing
- View Ratings & Feedback
- Insights & Analytics

## 👨‍💼 Admin (Future Scope)
- Platform Dashboard
- Manage Instructors
- Manage Users
- View Revenue Insights
- Course Monitoring

---

# 🗂️ Frontend Pages

### Students
- Homepage
- Course List
- Wishlist
- Cart Checkout
- Course Content Page
- User Profile Page
- Edit Profile Page

### Instructors
- Dashboard
- Insights Page
- Course Management Pages
- Edit Profile Page

---

# 🛠️ Backend Features

- Monolithic Architecture
- RESTful API Design
- Authentication & Authorization
- Course CRUD Operations
- Rating System
- Secure Password Hashing
- Cloud-Based Media Management
- Markdown-Based Course Content

---

# 🗄️ Database Schemas

## 👤 User Schema
- firstName (String, required)
- lastName (String, required)
- email (String, required)
- contact (Number)
- password (String, required)
- accountType (Admin | Student | Instructor)
- active (Boolean)
- approved (Boolean)
- additionalDetails (Reference → Profile)
- courses (Array → Course)
- image (String, required)
- resetPasswordToken (String)
- resetPasswordExpires (Date)
- courseProgress (Array → CourseProgress)
- timestamps enabled

---

## 📝 Profile Schema
- gender (String)
- dateOfBirth (Date)
- about (String)
- contactNumber (Number)

---

## 📚 Course Schema
- courseName (String, required)
- courseDescription (String)
- instructor (Reference → User, required)
- whatYouWillLearn (String)
- courseContent (Array → Section)
- ratingAndReviews (Array → RatingAndReview)
- price (Number, required)
- thumbnail (String, required)
- category (Reference → Category)
- tag (Array of Strings)
- studentsEnrolled (Array → User)
- instructions (Array of Strings)
- status (Draft | Published)
- createdAt (Date)

---

## 🏷️ Category Schema
- name (String, required)
- description (String)
- courses (Array → Course)

---

## 📂 Section Schema
- sectionName (String)
- subsection (Array → SubSection)

---

## 🎥 SubSection Schema
- title (String)
- timeDuration (String)
- description (String)
- videoUrl (String)

---

## ⭐ RatingAndReview Schema
- user (Reference → User, required)
- rating (Number, required)
- review (String, required)
- course (Reference → Course, required)

---

## 📈 CourseProgress Schema
- courseId (Reference → Course)
- userId (Reference → User)
- completedVideos (Array → SubSection)

---

## 🔐 OTP Schema
- email (String, required)
- otp (String, required)
- createdAt (Date, expires in 5 minutes)
- Pre-save hook sends OTP email

---

# 📡 API Routes

## 🔐 Authentication Routes
| Method | Endpoint |
|--------|----------|
| POST | /sendotp |
| POST | /signup |
| POST | /login |
| POST | /changepassword |
| POST | /reset-password-token |
| POST | /reset-password |

---

## 📚 Course Routes
| Method | Endpoint |
|--------|----------|
| POST | /createCourse |
| GET | /getAllCourses |
| POST | /getCourseDetails |
| POST | /getFullCourseDetails |
| GET | /getInstructorCourses |
| PUT | /editCourse |
| DELETE | /deleteCourse |
| POST | /updateCourseProgress |

---

## 🏷️ Category Routes
| Method | Endpoint |
|--------|----------|
| POST | /createCategory |
| GET | /getAllCategories |
| POST | /getCategoryPageDetails |

---

## ⭐ Rating Routes
| Method | Endpoint |
|--------|----------|
| POST | /createRating |
| GET | /getAllRating |
| GET | /getAverageRating |

---

## 📂 Section Routes
| Method | Endpoint |
|--------|----------|
| POST | /createSection |
| DELETE | /deleteSection |
| PUT | /updateSection |

---

## 🎥 SubSection Routes
| Method | Endpoint |
|--------|----------|
| POST | /createSubSection |
| DELETE | /deleteSubSection |
| PUT | /updateSubSection |

---

## 💳 Payment Routes
| Method | Endpoint |
|--------|----------|
| POST | /capturePayment |
| POST | /verifySignature |
| POST | /sendPaymentSuccessEmail |

---

## 👤 Profile Routes
| Method | Endpoint |
|--------|----------|
| GET | /getAllUserDetails |
| GET | /getEnrolledCourses |
| PUT | /updateProfile |
| PUT | /updateDisplayPicture |
| DELETE | /deleteAccount |
| GET | /instructorDashboard |

---

## 📩 Contact Route
| Method | Endpoint |
|--------|----------|
| POST | /submitQuery |

# 🔒 Security Features

- JWT-based Authentication
- Bcrypt Password Hashing
- OTP Verification
- Secure Payment Gateway (Razorpay)
- Cloud-based Secure Media Storage

---

# 🧪 Testing

- API Testing
- Authentication Testing
- Payment Flow Testing
- CRUD Operations Testing
- UI Testing

---

# 🔮 Future Enhancements

- 🏆 Gamification (Badges, Points, Leaderboards)
- 🎯 Personalized Learning Paths
- 🤝 Social Learning Features
- 📱 Mobile Application
- 🤖 ML-based Course Recommendations
- 🥽 VR / AR Integration

---

# 📌 Conclusion

StudyNotion is a scalable, secure, and modern EdTech platform built using the MERN stack.

It integrates authentication, payments, media management, and course management into one seamless ecosystem.

---
