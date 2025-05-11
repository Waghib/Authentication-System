import React, {useContext} from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {

  const {backendUrl, isLoggedin, userData, getUserData} = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && inputRefs.current[index].value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
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
    // Focus the last input if we pasted a full OTP
    if (pasteArray.length >= 6 && inputRefs.current[5]) {
      inputRefs.current[5].focus();
    }
  }

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      console.log('Backend URL:', backendUrl);
      const {data} = await axios.post(backendUrl + '/api/auth/send-reset-otp', {email});

      if (data.status) {
        toast.success(data.message || 'OTP sent successfully');
        setIsEmailSent(true);
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  }

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    try {
      const otpValue = inputRefs.current.map(input => input.value).join('');
      console.log('OTP value:', otpValue);
      
      // Just validate the OTP for now, don't reset password yet
      if (otpValue.length === 6) {
        setOtp(otpValue);
        setIsOtpSubmitted(true);
      } else {
        toast.error('Please enter a valid 6-digit OTP');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const {data} = await axios.post(backendUrl + '/api/auth/reset-password', {
        email,
        otp,
        newPassword
      });

      if (data.status) {
        toast.success(data.message || 'Password reset successful');
        navigate('/login');
      } else {
        toast.error(data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      {!isEmailSent && 
        <form onSubmit={onSubmitEmail} className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-3">
            Reset Password
          </h1>
          <p className="text-center text-indigo-300 mb-6">
            Enter you registered email to reset your password
          </p>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" className="w-3 h-3" />
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent outline-none text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
            Submit
          </button>
        </form>
      }

      {!isOtpSubmitted && isEmailSent && 
        <form onSubmit={onSubmitOtp} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset Password OTP</h1>
          <p className="text-center mb-6 text-indigo-300">Enter the 6-digit code sent to your email id.</p>

          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input type="text" maxLength='1' key={index} required className="w-12 h-12 bg-[#333A5C] text-white rounded-md text-center text-xl"
              ref = {e => inputRefs.current[index] = e} 
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}/>
            ))}
          </div>
            <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">Submit</button>
        </form>
      }

      {isOtpSubmitted && isEmailSent &&
        <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-3">
            New Password
          </h1>
          <p className="text-center text-indigo-300 mb-6">
            Enter the new password
          </p>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" className="w-3 h-3" />
            <input
              type="password"
              placeholder="Enter your password"
              className="bg-transparent outline-none text-white"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
            Submit
          </button>
        </form>
      }

    </div>
  );
};

export default ResetPassword;
