import { Button } from "@/components/ui/button"
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import { Form, FormControl,  FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { OtpValidation } from "@/lib/validation";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Loader from "@/components/MovieDetailsPage/Loader";

const VerifyOtp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof OtpValidation>>({
        resolver: zodResolver(OtpValidation),
        defaultValues: {
          otp: "",
        },
      });

    async function verifyOTP(values: z.infer<typeof OtpValidation>) {

        setIsLoading(true);

        try {            
                  // Send form data to backend
                  const response = await axios.post("http://localhost:8080/auth/verify-otp",  values, {
                    withCredentials: true,
                    
                  });

                  if (response.status === 200) {
                    alert("Signup successful!");
                    navigate("/login");
                  }
                } catch (error: any) {
                  if (error.response) {
                    // Show error message from backend
                    alert(error.response.data.message || "OTP Validation Failed");
                  } else {
                    alert("An unexpected error occurred.");
                  }
                } finally{
                  setIsLoading(false);
                }

      }
  


  return (
    <Form {...form}>
          <div className="sm:w-[420px] py-20 flex justify-center items-center flex-col">
          <h1 className="text-[35px] text-yellow-500 font-bold">MovieMagic</h1>
          <h2 className="text-[24px] font-bold leading-[140%] tracking-tighter md:text-[30px] pt-5">Verify Your OTP</h2>
            <form
              onSubmit={form.handleSubmit(verifyOTP)}
              className="flex flex-col gap-5 w-full mt-4">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Enter OTP</FormLabel>
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
                            <Loader/> Loading...
                          </div>
                        ) : "Verify"
                        }
                        
                </Button>
    
            </form>
          </div>
        </Form>
  )
}

export default VerifyOtp