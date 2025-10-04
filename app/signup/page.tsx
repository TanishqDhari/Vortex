"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar28 } from "@/components/date-picker";
import Link from "next/link";
import {
  IconBrandFacebook,
  IconBrandGoogle,
  IconBrandX,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";

const genres = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Documentary",
  "Animation",
  "Fantasy",
  "Crime",
  "Adventure",
];

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (field: string, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm password";
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSignup = async () => {
    if (selectedGenres.length < 3) {
      alert("Please select at least 3 genres");
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    window.location.href = "/home";
  };

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  return (
    <div className="relative min-h-screen flex justify-center">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/75"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4 py-8">
        {/* Logo at the top */}
        <div className="flex items-center justify-center mb-6">
          <img
            src="/vortex_logo_purple.svg"
            alt="Vortex Logo"
            width={250}
            height={180}
          />
        </div>

        {/* Main Card */}
        <div className="shadow-input mx-auto w-full rounded-none p-6 md:rounded-2xl md:p-8 bg-black/90">
          <h2 className="text-xl font-bold text-neutral-200 mb-1 text-center">
            {step === 1 ? "Create Account" : "Choose Your Preferences"}
          </h2>
          <p className="text-sm text-neutral-300 mb-6 text-center">
            {step === 1
              ? "Join Vortex and start your cinematic journey"
              : "Select your favorite genres for personalized recommendations"}
          </p>

          {step === 1 ? (
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {/* Name Fields */}
              <div className="flex flex-col gap-2 md:flex-row md:gap-2">
                <LabelInputContainer>
                  <Label htmlFor="firstname">First name</Label>
                  <Input
                    id="firstname"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleChange("firstName", e.target.value)
                    }
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500">{errors.firstName}</p>
                  )}
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="lastname">Last name</Label>
                  <Input
                    id="lastname"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleChange("lastName", e.target.value)
                    }
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500">{errors.lastName}</p>
                  )}
                </LabelInputContainer>
              </div>

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
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </LabelInputContainer>

              {/* Date of Birth */}
              <LabelInputContainer>
                <Label htmlFor="dob">Date of Birth</Label>
                <Calendar28
                  id="dob"
                  value={formData.dateOfBirth}
                  onChange={(date) => handleChange("dateOfBirth", date)}
                  className="bg-transparent border-none text-neutral-200"
                />
                {errors.dateOfBirth && (
                  <p className="text-xs text-red-500">{errors.dateOfBirth}</p>
                )}
              </LabelInputContainer>

              {/* Password */}
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-100"
                  >
                    {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </LabelInputContainer>

              {/* Confirm Password */}
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-100"
                  >
                    {showConfirm ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                )}
              </LabelInputContainer>

              {/* Terms */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleChange("agreeToTerms", e.target.checked)}
                  className="accent-primary"
                />
                <Label className="text-sm text-neutral-300">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-xs text-red-500">{errors.agreeToTerms}</p>
              )}

              {/* Continue Button */}
              <Button
                onClick={handleNextStep}
                className="w-full bg-primary text-white"
              >
                Continue
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-3 text-neutral-200">
                Select Your Favorite Genres
              </h3>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <Badge
                    key={genre}
                    variant={selectedGenres.includes(genre) ? "default" : "outline"}
                    className={`cursor-pointer ${
                      selectedGenres.includes(genre)
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "hover:bg-neutral-800"
                    }`}
                    onClick={() => handleGenreToggle(genre)}
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Selected: {selectedGenres.length} genre
                {selectedGenres.length !== 1 ? "s" : ""}
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSignup}
                  disabled={selectedGenres.length < 3 || isLoading}
                  className="flex-1 bg-primary text-white"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </div>
          )}

          <div className="text-center text-sm text-neutral-400 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Small Social Button */
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
    className="group relative flex h-9 w-30 items-center justify-center rounded-md bg-neutral-800 text-white shadow-sm hover:bg-neutral-700"
  >
    {icon}
  </button>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`flex w-full flex-col space-y-2 ${className || ""}`}>
    {children}
  </div>
);
