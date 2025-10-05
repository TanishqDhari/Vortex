"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  IconBrandFacebook,
  IconBrandGoogle,
  IconBrandX,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import { Calendar28 } from "@/components/date-picker";
import Link from "next/link";

export function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none p-6 md:rounded-2xl md:p-8 bg-black/90">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Create Account
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Join Vortex and start your cinematic journey
      </p>

      <form className="my-8 space-y-4" onSubmit={handleSubmit}>
        {/* Name Fields */}
        <div className="flex flex-col gap-2 md:flex-row md:gap-2">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input
              id="firstname"
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input
              id="lastname"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
          </LabelInputContainer>
        </div>

        {/* Email */}
        <LabelInputContainer>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </LabelInputContainer>

        {/* Date Picker */}
        <LabelInputContainer>
          <Label htmlFor="dob">Date of Birth</Label>
          <Calendar28
              id="dob"
              value={formData.dateOfBirth}
              onChange={(date) => handleChange("dateOfBirth", date)}
              className="bg-transparent text-neutral-800 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          />
        </LabelInputContainer>


        {/* Password with Toggle */}
        <LabelInputContainer>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </button>
          </div>
        </LabelInputContainer>

        {/* Confirm Password with Toggle */}
        <LabelInputContainer>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleChange("confirmPassword", e.target.value)
              }
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              {showConfirm ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </button>
          </div>
        </LabelInputContainer>

        {/* Submit Button */}
        <button
          className="group/btn relative block h-10 w-full rounded-md bg-primary font-medium text-white transition duration-300 hover:opacity-90"
          type="submit"
        >
          Continue
          <BottomGradient />
        </button>

        {/* Divider */}
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 text-muted-foreground">Or continue with</span>
        </div>

        {/* Social Buttons (Icons only) */}
        <div className="flex justify-center gap-4">
          <SocialIconButton icon={<IconBrandGoogle />} label="Google" />
          <SocialIconButton icon={<IconBrandFacebook />} label="Facebook" />
          <SocialIconButton icon={<IconBrandX />} label="Twitter" />
        </div>
      </form>
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
        Sign in
        </Link>
      </div>
    </div>
  );
}

/* — Small Icon Button — */
const SocialIconButton = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <button
    type="button"
    aria-label={label}
    className="group relative flex h-9 w-30 items-center justify-center rounded-md bg-gray-50 text-black shadow-sm transition hover:bg-gray-100 dark:bg-zinc-900 dark:text-neutral-300 dark:hover:bg-zinc-800"
  >
    {icon}
    <BottomGradient />
  </button>
);

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover:opacity-100" />
  </>
);

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);
