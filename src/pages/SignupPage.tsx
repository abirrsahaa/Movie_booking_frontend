import { Button } from "@/components/ui/button"
import * as z from "zod";
import {Link, useNavigate} from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignupValidation } from "@/lib/validation";
import axios from "axios";
import Loader from "@/components/MovieDetailsPage/Loader";
import { useState } from "react";


const SignupPage = () => {

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof SignupValidation>>({
        resolver: zodResolver(SignupValidation),
        defaultValues: {
          name:"",
          email:"",
          password:"",
          phone:"",
          address:"",
        },
      })

    async function onSubmit(values: z.infer<typeof SignupValidation>) {
        setIsLoading(true);

        try {
          // Send form data to backend
          const response = await axios.post("http://localhost:8080/auth/signup", values, {
            withCredentials: true
          });
      
          if (response.status === 200) {
            alert("Please check your email for OTP verification.");
            navigate("/verify-otp",{});
          }
        } catch (error: any) {
          if (error.response) {
            // Show error message from backend
            alert(error.response.data.message || "Signup failed. Please try again.");
          } else {
            alert("An unexpected error occurred.");
          }
        } finally{
          setIsLoading(false);
        }

      }


  return (
    
    <Form {...form}>
      <div className="sm:w-[420px] flex justify-center items-center flex-col">
        <h1 className="text-[35px] text-yellow-500 font-bold">MovieMagic</h1>
        <h2 className="text-[24px] font-bold leading-[140%] tracking-tighter md:text-[30px] pt-5">Create a new account</h2>
        <p className="mt-2 text-[#7878A3] text-[14px] font-medium leading-[140%] md:text-[16px] md:font-normal">To use MovieMagic enter your details</p>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" className="h-12 bg-[#101012]  border-none placeholder:text-[#7878A3] focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3 !important" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" className="h-12 bg-[#101012] border-none placeholder:text-[#7878A3] focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3 !important" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" className="h-12 bg-[#101012]  border-none placeholder:text-[#7878A3] focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3 !important" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone No</FormLabel>
              <FormControl>
                <Input type="text" className="h-12 bg-[#101012]  border-none placeholder:text-[#7878A3]focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3 !important" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input type="text" className="h-12 bg-[#101012]  border-none placeholder:text-[#7878A3] focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3 !important" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-[#877EFF] hover:bg-[#877EFF] text-[#FFFFFF] flex gap-2 !important cursor-pointer">
          {isLoading ? (
            <div className="flex gap-2 items-center justify-center">
              <Loader /> Loading...
            </div>
          ) : "Sign up"
          }
          
        </Button>
        <p className="text-[14px] text-[#EFEFEF] text-center mt-2">
            Already have an account?
            <Link
              to="/login"
              className="text-[#877EFF] text-[12px] font-semibold ml-1">
              Log in
            </Link>
          </p>
      </form>
      </div>
    </Form>
    
  )
}

export default SignupPage