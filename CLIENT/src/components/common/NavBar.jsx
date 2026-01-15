import {useEffect, useState} from 'react'
import { useSelector} from 'react-redux'
import { Link, NavLink, useLocation } from 'react-router-dom'
import NavbarLinks from '../../data/navbar-links'
import LogoImage from "../../assets/Logo/Logo-Full-Light.png"
import ProfileDropdown from '../core/Auth/ProfileDropdown'
import { IoChevronDownSharp } from "react-icons/io5";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { apiConnector } from '../../services/apiConnect'
import { categories } from '../../services/apis'

function NavBar() {
    const location = useLocation()
    const matchRoute = (route) => {
        return location.pathname === route;
    }

    //Fetch user from redux store to check if logged in or not
    const {token} = useSelector((state) => state.auth);
    const {user} = useSelector((state) => state.profile);
    const {totalItems} = useSelector((state) => state.cart);


    const [subLinks, setSubLinks] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchSubLinks = async() => {
        setLoading(true);
        try {
            const result = await apiConnector("GET", categories.GET_ALL_CATEGORIES);
            console.log("Printing Categories Result :", result.data.data);
            setSubLinks(result.data.data);
        } catch(err) {
            console.log("Error fetching Categories for Catalog", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSubLinks();
    }, []);

   

    
  return (
    <div className=' flex h-14 items-center justify-center border-b border-richblack-700'>
        <div className=' flex w-11/12 max-w-[1260px] items-center justify-between'>
            <Link to="/">
              <img width={160} height={42}  src={LogoImage} alt="Logo" />
            </Link>
            
            <nav>
                <ul className=' flex gap-x-6 text-richblue-25'>
                    {
                        NavbarLinks.map((link, index) => (
                           <li key={index}>
                                {
                                    link.title === "Catalog" ? (
                                        <div>
                                            <div className='relative flex items-center cursor-pointer gap-2 group'>
                                                {link.title} 
                                                <IoChevronDownSharp />
                                                <div  className=' invisible opacity-0 transition-all duration-200 absolute top-8 left-0    bg-richblack-5 p-4 rounded-md  group-hover:visible group-hover:opacity-100 z-10 lg:w-56 '>
                                                    <div className=' absolute rotate-45 rounded bg-richblack-5 -top-1 -z-1 h-6 w-6 left-15 '></div>
                                                    {loading ? (
                                                        <div className=' text-richblack-200'>Loading...</div>
                                                    ) : (
                                                        subLinks.map((sublink, subIndex) => (
                                                            <Link 
                                                                to={`/catalog/${sublink.name}`} 
                                                                key={subIndex}
                                                                className=' block px-4 py-2 text-richblack-900 hover:bg-richblack-50 rounded-md'
                                                            >
                                                            {sublink.name}
                                                            </Link>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                            
                                        </div>
                                        

                                    ) : (
                                        <NavLink 
                                            to={link?.path} 
                                            key={index}
                                            
                                            className={` text-md font-medium  cursor-pointer ${matchRoute(link.path) ? "text-yellow-50" : "text-richblack-25 " }`}
                                        >
                                            {link.title}
                                        </NavLink>
                                    )
                                }
                            </li>
                        ))
                    }
                </ul>
            </nav>

            <div className=' flex gap-x-4 items-center'>
                {
                    user && user?.accountType !== "Instructor" && (
                        <Link to='/dashboard/cart' className=' relative'>
                            <AiOutlineShoppingCart className=' text-2xl text-richblack-25'/>
                            {
                                totalItems > 0 && (
                                    <span className=' absolute -top-2 -right-2 bg-yellow-50 text-richblack-900 font-medium text-xs w-5 h-5 rounded-full flex items-center justify-center'>
                                        {totalItems}
                                    </span>
                                )
                            }
                        </Link>
                    )
                }
                {
                    token === null && (
                        <Link to="/login"  >
                            <button className=' border border-richblack-700 bg-richblack-800 px-3 py-2 text-richblack-100 rounded-md'>
                                Log In
                            </button>
                        </Link>

                    )
                }
                {
                    token === null && (
                        <Link to="/signup" >
                            <button className=' border border-richblack-700 bg-richblack-800 px-3 py-2 text-richblack-100 rounded-md'>
                                Sign Up
                            </button>
                        </Link>
                    ) 
                }
                {
                    token !== null && <ProfileDropdown />
                }
            </div>
        </div>
    </div>
  )
}

export default NavBar