import React, { useContext, useEffect } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext.jsx"; 
import { toast } from "react-toastify";

const EmailVerify = () => {
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const {backendUrl, isLoggedin, userData, getUserData} = useContext(AppContext);

  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value.length === 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((value, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = value;
      }
    });
    if (pasteArray.length > 0 && inputRefs.current[pasteArray.length - 1]) {
      inputRefs.current[pasteArray.length - 1].focus();
    }
  }

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otp = inputRefs.current.map(input => input.value).join('');
      console.log(otp);

      const { data } = await axios.post(backendUrl + '/api/auth/verify-account', {
        otp
      });

      if (data.status) {
        toast.success('Email verified successfully');
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message || 'Invalid OTP');
      }
      
    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  }
  
  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate('/');
  }, [isLoggedin, userData, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      
      <form onSubmit={onSubmitHandler} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">Email Verify OTP</h1>
        <p className="text-center mb-6 text-indigo-300">Enter the 6-digit code sent to your email id.</p>

        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index) => (
            <input type="text" maxLength='1' key={index}  required className="w-12 h-12 bg-[#333A5C] text-white rounded-md text-center text-xl"
            ref = {e => inputRefs.current[index] = e} 
            onInput={(e) => handleInput(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}/>
          ))}

        </div>
          <button  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">Verify email</button>
      </form>
    </div>
  );
};

export default EmailVerify;
