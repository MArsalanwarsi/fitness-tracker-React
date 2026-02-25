import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from 'react-redux';
import { registerUser } from "../redux/slice/authSlice";

export function SignupForm({ className, ...props }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);
  const reduxerror = useSelector((state) => state.auth.error);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.email.toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )){
      toast.warn("Please enter a valid Email");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.warn("Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      toast.warn("Password must be at least 8 characters long");
      return;
    }
    if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(formData.password)) {
    toast.error("Password must be 8+ characters with at least one uppercase letter, one number, and one special character");
    return;
  }

    try {
      const resultAction = await dispatch(registerUser(formData));

      if (registerUser.fulfilled.match(resultAction)) {
        toast.success("Account created successfully!");
        navigate("/login"); 
      } else {
        const message = resultAction.payload?.error || "Registration failed";
        toast.error(message);
      }
    } catch (err) {
      toast.error(`Something went wrong with the request: ${err} || ${reduxerror}`);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
              </div>

              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter Your Full Name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
                <FieldDescription>
                  We'll use this to contact you.
                </FieldDescription>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirmPassword">Confirm</FieldLabel>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </Field>
              </div>

              <FieldDescription>
                8+ chars, uppercase, lowercase, number, and special char.
              </FieldDescription>

              <Field>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" type="button">Apple</Button>
                <Button variant="outline" type="button">Google</Button>
                <Button variant="outline" type="button">Meta</Button>
              </div>

              <FieldDescription className="text-center">
                Already have an account? <Link to="/login" className="underline">Sign in</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}