
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import AuthLayout from "@/components/layouts/AuthLayout";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await signUp(email, password);
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } else {
        toast({
          title: "Welcome!",
          description: "Account created successfully. Please check your email to verify your account.",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Sign up failed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create account. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title='Create Your Account'
      subtitle='Join StayEzy and start exploring amazing destinations'>
      <form onSubmit={handleSignUp} className="flex flex-col gap-6">
        <div className='flex flex-col gap-1.5'>
          <label className='text-sm font-medium text-secondary'>Full Name</label>
          <Input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        
        <div className='flex flex-col gap-1.5'>
          <label className='text-sm font-medium text-secondary'>Email</label>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className='flex flex-col gap-1.5'>
          <label className='text-sm font-medium text-secondary'>Password</label>
          <Input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={loading} variant="accent" size="lg">
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
        
        <p className="text-center text-sm text-secondary">
          Already have an account?{' '}
          <button
            type="button"
            className="font-medium text-primary hover:text-primary/80"
            onClick={() => navigate('/auth')}
          >
            Sign In
          </button>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
