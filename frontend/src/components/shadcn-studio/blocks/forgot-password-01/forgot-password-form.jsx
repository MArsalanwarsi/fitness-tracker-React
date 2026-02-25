'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { forgotPass } from '../../../../redux/slice/forgotSlice'

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setEmail(e.target.value)
  }

  const checkEmail = async (e) => {
    e.preventDefault();
    if (!email.toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )) {
      toast.warn("Please enter a valid Email");
      return;
    }
    try {
      const resultAction = await dispatch(forgotPass(email));

      if (forgotPass.fulfilled.match(resultAction)) {
        toast.success("Code Sent to Your Email Successfully!");
        navigate("/otpVerify");
      } else {
        const message = resultAction.payload?.error || "Failed to send reset code";
        toast.error(message);
      }
    } catch (err) {
      toast.error(`Something went wrong with the request: ${err} `);
    }
  }
  return (
    <form className='space-y-4' onSubmit={checkEmail}>
      {/* Email */}
      <div className='space-y-1'>
        <Label className='leading-5' htmlFor='userEmail'>
          Email address*
        </Label>
        <Input type='email' name="email" id='userEmail' placeholder='Enter your email address' value={email} onChange={handleChange} />
      </div>
      <Button className='w-full' type='submit'>
        Send Reset Code
      </Button>
    </form>
  );
}

export default ForgotPasswordForm
