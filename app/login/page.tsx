"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconBrandFacebook, IconBrandGoogle, IconBrandX, IconEye, IconEyeOff } from "@tabler/icons-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (field: string, value: string | boolean) => setFormData((prev) => ({ ...prev, [field]: value }));

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;

  //   setIsLoading(true);
  //   try {
  //     const res = await fetch("/api/user/check-email", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email: formData.email }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok || !data.exists) {
  //       alert("Email not found. Please sign up first.");
  //       return;
  //     }

  //     // Email exists, proceed
  //     window.location.href = "/home";
  //   } catch (err) {
  //     console.error(err);
  //     alert(err instanceof Error ? err.message : String(err));
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsLoading(true);
  try {
    // Check if user exists
    const checkRes = await fetch("/api/user/check-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email }),
    });

    const checkData = await checkRes.json();

    if (!checkRes.ok || !checkData.exists) {
      alert("Email not found. Please sign up first.");
      return;
    }

    localStorage.setItem("userId", checkData.userId);
    localStorage.setItem("isLoggedIn", "true");

    // Redirect to home or profile
    window.location.href = "/home";
  } catch (err) {
    console.error(err);
    alert(err instanceof Error ? err.message : String(err));
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="relative min-h-screen flex justify-center">
      {/* Background */}
      <div className="fixed inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('/bg.jpg')" }}>
        <div className="absolute inset-0 bg-black/75"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4 py-8">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <img src="/vortex_logo_purple.svg" alt="Vortex Logo" width={250} height={180} />
        </div>

        {/* Card */}
        <div className="shadow-input mx-auto w-full rounded-none p-6 md:rounded-2xl md:p-8 bg-black/90">
          <h2 className="text-xl font-bold text-neutral-200 mb-1 text-center">Welcome Back</h2>
          <p className="text-sm text-neutral-300 mb-6 text-center">Sign in to continue your cinematic journey</p>

          <form className="space-y-4" onSubmit={handleLogin}>
            {/* Email */}
            <LabelInputContainer>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </LabelInputContainer>

            {/* Password */}
            <LabelInputContainer>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-100">
                  {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </LabelInputContainer>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.remember}
                  onChange={(e) => handleChange("remember", e.target.checked)}
                  className="accent-primary"
                />
                <Label className="text-neutral-300">Remember me</Label>
              </div>
              <Link href="/forgot-password" className="text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <Button type="submit" className="w-full bg-primary text-white" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* OR Divider */}
          <div className="flex items-center my-5">
            <div className="flex-1 h-px bg-neutral-700" />
            <span className="px-3 text-neutral-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-neutral-700" />
          </div>

          {/* Social Buttons */}
          <div className="flex justify-center gap-3">
            <SocialIconButton icon={<IconBrandGoogle size={18} />} label="Google" />
            <SocialIconButton icon={<IconBrandFacebook size={18} />} label="Facebook" />
            <SocialIconButton icon={<IconBrandX size={18} />} label="X" />
          </div>

          {/* Sign up link */}
          <div className="text-center text-sm text-neutral-400 mt-4">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Small Social Button */
const SocialIconButton = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button
    type="button"
    aria-label={label}
    className="group relative flex h-9 w-30 items-center justify-center rounded-md bg-neutral-800 text-white shadow-sm hover:bg-neutral-700">
    {icon}
  </button>
);

/* Container for Label + Input */
const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex w-full flex-col space-y-2 ${className || ""}`}>{children}</div>
);
