import { Button } from "@/components/ui/button"
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoginValidation } from "@/lib/validation";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Loader from "@/components/MovieDetailsPage/Loader";
import axios from "axios";

const LoginPage = () => {
  
    const [isLoading, setIsLoading] = useState(false);
    const navigate  = useNavigate();

    const form = useForm<z.infer<typeof LoginValidation>>({
        resolver: zodResolver(LoginValidation),
        defaultValues: {
          email: "",
          password: "",
        },
      });

      async function handleLogin(values: z.infer<typeof LoginValidation>) {
              setIsLoading(true);

              try {
                // Send form data to backend
                const response = await axios.post("http://localhost:8080/auth/login", values, {
                  withCredentials: true
                });
            
                if (response.status === 200) {
                  const token = response.data; // Backend directly returns JWT token
                  localStorage.setItem("token", token); // Store in localStorage
                  navigate("/",{});
                }
              } catch (error: any) {
                if (error.response) {
                  // Show error message from backend
                  alert(error.response.data.message || "Login Failed. Please try again.");
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
            <h1 className="text-[35px] text-yellow-500 font-bold">Wissen Entertainments</h1>
            <h2 className="text-[24px] font-bold leading-[140%] tracking-tighter md:text-[30px] pt-5 sm:pt-12">
              Log in to your account
            </h2>
            <p className="mt-2 text-[#7878A3] text-[14px] font-medium leading-[140%] md:text-[16px] md:font-normal">
              Welcome back! Please enter your details.
            </p>
            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className="flex flex-col gap-5 w-full mt-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Email</FormLabel>
                    <FormControl>
                      <Input type="text" className="h-12 bg-[#101012]  border-none placeholder:text-[#7878A3] focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3 !important" {...field} />
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
                    <FormLabel className="">Password</FormLabel>
                    <FormControl>
                      <Input type="password" className="h-12 bg-[#101012]  border-none placeholder:text-[#7878A3] focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3 !important" {...field} />
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
                        ) : "Login"
                        }
                        
                      </Button>
    
              <p className="text-[14px] text-[#EFEFEF] text-center mt-2">
                Don&apos;t have an account?
                <Link
                  to="/signup"
                  className="text-[#877EFF] text-[12px] font-semibold ml-1">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </Form>
    );    
}

export default LoginPage