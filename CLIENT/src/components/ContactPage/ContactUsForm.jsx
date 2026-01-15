import {useEffect, useState} from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { apiConnector } from '../../services/apiConnect';
import { contactusEndpoint } from '../../services/apis';
import CountryCode from "../../data/countrycode.json"
function ContactUsForm() {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit,reset, formState: { errors, isSubmitSuccessful } } = useForm();

    useEffect(() =>{
        if(isSubmitSuccessful){
            reset({
                firstname: '',
                lastname: '',
                email: '',
                message: '',
                phoneNo: ''
            });
        }
    },[reset, isSubmitSuccessful]);

    const submitFunction = async (data) => {
        console.log('Logging Data', data);
        try{
            setLoading(true);
            const response = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data);

            console.log('Logging Response', response)
            if(response?.data?.success){
                toast.success("Query Submitted Successfully");
            }
            setLoading(false);
        }
        catch(error){
            console.log(error);
            toast.error("Could not submit the query. Please try again later.");
            setLoading(false);
        }
    }
    const labelStyle = "mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5";
    const inputStyle = "w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none";

  return (
    <form onSubmit={handleSubmit(submitFunction)} className='flex flex-col gap-7 w-full max-w-[600px]'>
            
            {/* First Name & Last Name Row */}
            <div className='flex flex-col gap-5 lg:flex-row'>
                <div className='flex flex-col gap-2 lg:w-[48%]'>
                    <label className={labelStyle} htmlFor='firstname'>First Name</label>
                    <input
                        type="text"
                        name='firstname'
                        id='firstname'
                        placeholder='Enter first name'
                        {...register('firstname', { required: 'First Name is required' })}
                        className={inputStyle}
                    />
                    {errors.firstname && <span className='text-[12px] text-yellow-100'>{errors.firstname.message}</span>}
                </div>
                
                <div className='flex flex-col gap-2 lg:w-[48%]'>
                    <label className={labelStyle} htmlFor='lastname'>Last Name</label>
                    <input
                        type="text"
                        name='lastname'
                        id='lastname'
                        placeholder='Enter last name'
                        {...register('lastname')}
                        className={inputStyle}
                    />
                </div>
            </div>

            {/* Email */}
            <div className='flex flex-col gap-2'>
                <label className={labelStyle} htmlFor='email'>Email Address</label>
                <input
                    type="email"
                    name='email'
                    id='email'
                    placeholder='Enter email address'
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Invalid email address'
                        }
                    })}
                    className={inputStyle}
                />
                {errors.email && <span className='text-[12px] text-yellow-100'>{errors.email.message}</span>}
            </div>

            {/* Phone Number */}
            <div className='flex flex-col gap-2'>
                <label className={labelStyle} htmlFor='phoneNo'>Phone Number</label>
                <div className='flex gap-5'>
                    {/* Country Code Dropdown */}
                    <div className='flex w-[81px] flex-col gap-2'>
                        <select
                            name='dropdown'
                            id="dropdown"
                            className={inputStyle}
                            {...register("countrycode", { required: true })}
                        >
                            {
                                CountryCode.map((element, index) => {
                                    return (
                                        <option key={index} value={element.code}>
                                            {element.code} - {element.country}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    
                    {/* Phone Number Input */}
                    <div className='flex w-[calc(100%-90px)] flex-col gap-2'>
                         <input
                            type="number"
                            name='phoneNo'
                            id='phoneNo'
                            placeholder='12345 67890'
                            className={inputStyle}
                            {...register('phoneNo', {
                                required: 'Phone Number is required',
                                pattern: {
                                    value: /^[0-9]{5,15}$/,
                                    message: 'Invalid phone number'
                                }
                            })}
                        />
                    </div>
                </div>
                {errors.phoneNo && <span className='text-[12px] text-yellow-100'>{errors.phoneNo.message}</span>}
            </div>

            {/* Message */}
            <div className='flex flex-col gap-2'>
                <label className={labelStyle} htmlFor='message'>Message</label>
                <textarea
                    name='message'
                    id='message'
                    cols={30}
                    rows={7}
                    placeholder='Enter your message here'
                    {...register('message', { required: 'Message is required' })}
                    className={inputStyle}
                />
                {errors.message && <span className='text-[12px] text-yellow-100'>{errors.message.message}</span>}
            </div>

            {/* Button */}
            <button
                type='submit'
                disabled={loading}
                className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-richblack-800 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] transition-all duration-200 hover:scale-95 disabled:bg-richblack-500 sm:text-[16px]`}
            >
                {loading ? 'Sending...' : 'Send Message'}
            </button>
        </form>
  )
}

export default ContactUsForm