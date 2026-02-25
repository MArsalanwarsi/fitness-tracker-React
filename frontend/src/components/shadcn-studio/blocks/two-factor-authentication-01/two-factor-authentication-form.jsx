import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import {useSelector, useDispatch } from 'react-redux'
import { verifyOTP } from '../../../../redux/slice/forgotSlice'
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const TwoFactorAuthenticationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = useSelector((state) => state.forgot.email);
  const [otp, setOtp] = useState();
  const handleChange=(value) => {
    setOtp(value);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
          const resultAction = await dispatch(verifyOTP({ email: email, otp: otp }));
    
      if (verifyOTP.fulfilled.match(resultAction)) {
            toast.success("Code Verified Successfully!");
            navigate("/resetPassword");
          } else {
            const message = resultAction.payload?.error || "Failed to verify OTP";
            toast.error(message);
          }
        } catch (err) {
          toast.error(`Something went wrong with the request: ${err} `);
        }
  }
  
  return (
    <form className='space-y-4' onSubmit={handleSubmit}>
      <div className='flex items-center justify-between gap-1'>
        <Label htmlFor='recoveryCode' className='text-base'>
          Code*
        </Label>
        <span className='text-base font-medium'>Use a recovery code</span>
      </div>
      <InputOTP id='recoveryCode' maxLength={6} value={otp} onChange={handleChange}>
        <InputOTPGroup
          className='w-full justify-center gap-4 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border'>
          <InputOTPSlot index={0}  />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <Button className='w-full' type='submit'>
        Verify Code
      </Button>
    </form>
  );
}

export default TwoFactorAuthenticationForm
