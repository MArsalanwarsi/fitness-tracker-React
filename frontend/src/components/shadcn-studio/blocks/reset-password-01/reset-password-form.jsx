'use client'

import { useState } from 'react'

import { EyeIcon, EyeOffIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from '../../../../redux/slice/forgotSlice';
import { useNavigate } from 'react-router-dom';

const ResetPasswordForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = useSelector((state) => state.forgot.email);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password === "" || formData.confirmPassword === "") {
      toast.error("Passwords Can't be Empty");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords Don't Match");
      return;
    }
    if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(formData.password)) {
      toast.error("Password must be 8+ characters with at least one uppercase letter, one number, and one special character");
      return;
    }
    if (formData.password.length < 8) {
      toast.warn("Password must be at least 8 characters long");
      return;
    }
    try {
      const resultAction = await dispatch(resetPassword({ email: email, newPassword: formData.password }));
      if (resetPassword.fulfilled.match(resultAction)) {
        toast.success("Password Reset Successfully!");
        navigate("/login");
      } else {
        const message = resultAction.payload?.error || "Failed to reset password1";
        toast.error(message);
      }
    } catch (e) {
      toast.error(e.message || "Failed to reset password");
    }



  }


  return (
    <form className='space-y-4' onSubmit={handleSubmit}>
      {/* Password */}
      <div className='w-full space-y-1'>
        <Label className='leading-5' htmlFor='password'>
          New Password*
        </Label>
        <div className='relative'>
          <Input
            id='password'
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder='••••••••••••••••'
            className='pr-9' name="password"
            value={formData.password} onChange={handleChange} />
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setIsPasswordVisible(prevState => !prevState)}
            className='text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent'>
            {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
            <span className='sr-only'>{isPasswordVisible ? 'Hide password' : 'Show password'}</span>
          </Button>
        </div>
      </div>
      {/* Confirm Password */}
      <div className='w-full space-y-1'>
        <Label className='leading-5' htmlFor='confirmPassword'>
          Confirm Password*
        </Label>
        <div className='relative'>
          <Input
            id='confirmPassword'
            type={isConfirmPasswordVisible ? 'text' : 'password'}
            placeholder='••••••••••••••••' name="confirmPassword"
            className='pr-9' value={formData.confirmPassword} onChange={handleChange} />
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setIsConfirmPasswordVisible(prevState => !prevState)}
            className='text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent'>
            {isConfirmPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
            <span className='sr-only'>{isConfirmPasswordVisible ? 'Hide password' : 'Show password'}</span>
          </Button>
        </div>
      </div>
      <Button className='w-full' type='submit'>
        Set New Password
      </Button>
    </form>
  );
}

export default ResetPasswordForm
