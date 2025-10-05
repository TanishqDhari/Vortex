"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconMail, IconCheck } from "@tabler/icons-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // simulate
    setIsLoading(false);
    setIsEmailSent(true);
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
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <img
            src="/vortex_logo_purple.svg"
            alt="Vortex Logo"
            width={250}
            height={180}
          />
        </div>

        {/* Card */}
        <div className="shadow-input mx-auto w-full rounded-none p-6 md:rounded-2xl md:p-8 bg-black/80">
          <h2 className="text-xl font-bold text-neutral-200 mb-1 text-center">
            {isEmailSent ? "Check Your Email" : "Forgot Password"}
          </h2>
          <p className="text-sm text-neutral-300 mb-6 text-center">
            {isEmailSent
              ? "We've sent a password reset link to your email address."
              : "Enter your email address and we’ll send you a reset link."}
          </p>

          {!isEmailSent ? (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <LabelInputContainer>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <IconMail className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
              </LabelInputContainer>

              <Button
                type="submit"
                className="w-full bg-primary text-white"
                disabled={isLoading}
              >
                {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-5">
              <div className="flex justify-center">
                <IconCheck className="h-12 w-12 text-primary" />
              </div>
              <p className="text-neutral-300">
                A password reset link has been sent to{" "}
                <span className="font-medium text-neutral-100">{email}</span>.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEmailSent(false);
                  setEmail("");
                }}
                className="w-full"
              >
                Send Another Link
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Container for Label + Input */
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
