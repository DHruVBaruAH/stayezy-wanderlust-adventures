import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Add your sign up logic here (e.g., call Supabase or your backend)
    setTimeout(() => {
      setLoading(false);
      alert("Sign up successful! (Demo only)");
      navigate("/auth");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSignUp}
        className="bg-white p-8 rounded shadow-md w-full max-w-md flex flex-col gap-6"
      >
        <h1 className="text-2xl font-bold mb-2 text-center">Create an Account</h1>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            className="text-primary hover:underline font-medium"
            onClick={() => navigate('/auth')}
          >
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp; 