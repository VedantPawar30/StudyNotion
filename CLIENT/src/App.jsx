
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import NavBar from './components/common/NavBar';
import {Toaster} from "react-hot-toast"
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OpenRoute from './components/core/Auth/OpenRoute';
import PrivateRoute from './components/core/Auth/PrivateRoute';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import VerifyEmail from './pages/VerifyEmail';
import About from './pages/About';
import Error from './pages/Error';
import Dashboard from './pages/Dashboard';
import MyProfile from './components/core/Dashboard/MyProfile';
import Settings from './components/core/Dashboard/Settings/index.jsx';
import Contact from './pages/Contact';
import EnrolledCourses from './components/core/Dashboard/EnrolledCourses';
import Cart from './components/core/Dashboard/Cart/index.jsx'
import { useSelector } from 'react-redux';
import { ACCOUNT_TYPE } from './utils/constants.js';
function App() {
  const { user } = useSelector((state) => state.profile)
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <NavBar></NavBar>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route 
          path="/login"
          element={
            <OpenRoute>
              <Login/>
            </OpenRoute>
          }
        />
        <Route path="/signup" element={
          <OpenRoute>
            <Signup/>
          </OpenRoute>
        } />

        <Route path="/forgot-password" 
              element={
                <OpenRoute>
                  <ForgotPassword/>
                </OpenRoute> 
              }
          />

          <Route
               path="/update-password/:id"
               element={
                <OpenRoute>
                  <UpdatePassword/>
                </OpenRoute>
               }
          />

          <Route
              path='/verify-email'
              element={
                <OpenRoute>
                  <VerifyEmail/>
                </OpenRoute>
              }
          >

          </Route>
          <Route path="/about" 
                  element={
                  
                    <About/>
                  
                  } 

          />

          <Route
            path="/contact"
            element={
              
                <Contact/>
            
            }
          />

          <Route 
          element={
            <PrivateRoute>
              <Dashboard/>
            </PrivateRoute>
          }
          >
            <Route path='/dashboard/my-profile'
                 element={
                    <PrivateRoute>
                      <MyProfile/>
                    </PrivateRoute>
                 }
            />
            <Route
              path='/dashboard/settings'
              element={
                <PrivateRoute>
                  <Settings/>
                </PrivateRoute>
              }
            />

            {
              user?.accountType === ACCOUNT_TYPE.STUDENT && (
                <>
                  <Route path='/dashboard/enrolled-courses'
                        element={
                          <PrivateRoute>
                      
                            <EnrolledCourses/>
                          </PrivateRoute>
                        }
                  />
                  <Route path='/dashboard/cart'
                        element={
                          <PrivateRoute>
                      
                            <Cart/>
                          </PrivateRoute>
                        }
                  />
                </>
              )
            }
          </Route>

          
                

          {/* Route to show error */}
          <Route path="*" element={<Error></Error>} />
      </Routes>

      <Toaster /> 
    </div>
  )
}

export default App
