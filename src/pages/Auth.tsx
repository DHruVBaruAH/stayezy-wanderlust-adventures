import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Eye from "@/components/icons/Eye";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useAuth } from "@/hooks/useAuth";

interface SignInForm {
  email: string;
  password: string;
}

export default function Auth() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>();

  const onSubmit = async (data: SignInForm) => {
    setIsLoading(true);
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "Successfully signed in to your account.",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Sign in failed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign in. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title='Welcome Back'
      subtitle='Sign in to continue exploring amazing destinations'>
      <form
        className='flex flex-col gap-6'
        onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-1.5'>
          <label className='text-sm font-medium text-secondary'>Email</label>
          <Input
            type='email'
            placeholder='Enter your email'
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <span className='text-sm text-destructive'>
              {errors.email.message}
            </span>
          )}
        </div>

        <div className='flex flex-col gap-1.5'>
          <label className='text-sm font-medium text-secondary'>Password</label>
          <div className='relative'>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder='Enter your password'
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <button
              type='button'
              className='absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary'
              onClick={() => setShowPassword(!showPassword)}>
              <Eye
                isOpen={showPassword}
                className='h-5 w-5'
              />
            </button>
          </div>
          {errors.password && (
            <span className='text-sm text-destructive'>
              {errors.password.message}
            </span>
          )}
          <div className='flex justify-end'>
            <button
              type='button'
              onClick={() => navigate("/auth/reset-password")}
              className='text-sm text-primary hover:text-primary/80'>
              Forgot password?
            </button>
          </div>
        </div>

        <Button
          type='submit'
          className='w-full'
          disabled={isLoading}
          variant='accent'
          size='lg'>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>

        <p className='text-center text-sm text-secondary'>
          Don't have an account?{" "}
          <button
            type='button'
            onClick={() => navigate("/auth/signup")}
            className='font-medium text-primary hover:text-primary/80'>
            Create new account
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}
