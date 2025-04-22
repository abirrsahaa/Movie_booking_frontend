import { Button } from "@/components/ui/button"
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoginValidation } from "@/lib/validation";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "@/components/MovieDetailsPage/Loader";
import axios from "axios";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check for existing token on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // If token exists, redirect to main page
      navigate('/main');
    }
  }, [navigate]);

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
      const response = await axios.post("http://localhost:9090/auth/login", values, {
        withCredentials: true
      });
      if (response.status === 200) {
        const token = response.data; // Backend directly returns JWT token
        localStorage.setItem("token", token); // Store in localStorage
        toast.success("Logged in successfully !", {
          duration: 5000,
          icon: <Sparkles className="h-5 w-5 text-amber-400" />
        });
        navigate("/main"); // Redirect to main page after successful login
      }
    } catch (error: any) {
      if (error.response) {
        // error.response.data.message || "Login Failed. Please try again."
        // Show error message from backend
        toast.error(error.response.data.message || "Login Failed. Please try again.", {
          duration: 5000,
          icon: <Sparkles className="h-5 w-5 text-amber-400" />
        });
        navigate("/");
      } else {
        toast.error("An unexpected error occurred.", {
          duration: 5000,
          position: "top-center",
          style: {
            background: "#ffeded",
            color: "#d8000c",
            border: "1px solid #d8000c",
            fontSize: "1rem",
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <Form {...form}>
      <div className="sm:w-[420px] flex justify-center items-center flex-col">
        <h1 className="text-[35px] text-blue-800 font-bold">Wissen Entertainments</h1>
        <h2 className="text-[24px] font-bold leading-[140%] tracking-tighter md:text-[30px] pt-5 sm:pt-12">
          Log in to your account
        </h2>
        <p className="mt-2 text-[24px] font-medium leading-[140%] md:text-[16px] md:font-normal">
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
                  <Input
                    type="text"
                    className="h-12 bg-[#101012] border-none placeholder:text-[#7878A3] focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3 !important"
                    {...field}
                  />
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
                  <Input
                    type="password"
                    className="h-12 bg-[#101012] border-none placeholder:text-[#7878A3] focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3 !important"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-blue-800 hover:bg-[#877EFF] text-[#FFFFFF] flex gap-2 !important cursor-pointer"
          >
            {isLoading ? (
              <div className="flex gap-2  items-center justify-center">
                <Loader /> Loading...
              </div>
            ) : "Login"}
          </Button>

          <p className="text-[14px] text-[#EFEFEF] text-center mt-2">
            Don&apos;t have an account?
            <Link
              to="/"
              className="text-[#877EFF] text-[12px] font-semibold ml-1">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
}

export default LoginPage;