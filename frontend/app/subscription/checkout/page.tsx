"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Play, CreditCard, Smartphone, Shield, ArrowLeft, Check } from "lucide-react"
import Link from "next/link"

const selectedPlan = {
  name: "Premium",
  price: { monthly: 16.99, yearly: 169.99 },
  features: ["4K Ultra HD", "4 devices", "Unlimited downloads", "Premium support"],
}

export default function CheckoutPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    // Redirect to success page
    window.location.href = "/subscription/success"
  }

  const totalPrice = selectedPlan.price[billingCycle]
  const savings = billingCycle === "yearly" ? selectedPlan.price.monthly * 12 - selectedPlan.price.yearly : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/subscription"
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Plans</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Play className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">Vortex</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Subscription</h1>
            <p className="text-muted-foreground">Join millions of viewers enjoying premium content</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{selectedPlan.name} Plan</h3>
                      <p className="text-sm text-muted-foreground">
                        Billed {billingCycle === "monthly" ? "monthly" : "annually"}
                      </p>
                    </div>
                    <Badge className="bg-primary/20 text-primary border-primary/30">Premium</Badge>
                  </div>

                  <div className="space-y-2">
                    {selectedPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    {savings > 0 && (
                      <div className="flex items-center justify-between text-green-400">
                        <span>Annual savings</span>
                        <span>-${savings.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span>Tax</span>
                      <span>$0.00</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Billing Cycle Toggle */}
                  <div className="p-4 bg-card/50 rounded-lg">
                    <RadioGroup value={billingCycle} onValueChange={(value) => setBillingCycle(value as any)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly">Monthly - ${selectedPlan.price.monthly}/month</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yearly" id="yearly" />
                        <Label htmlFor="yearly" className="flex items-center">
                          Yearly - ${selectedPlan.price.yearly}/year
                          <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30">Save 20%</Badge>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              {/* Security Features */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="font-medium text-foreground">Secure Payment</p>
                      <p className="text-sm text-muted-foreground">Your payment information is encrypted and secure</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Payment Method Selection */}
                    <div className="space-y-3">
                      <Label>Payment Method</Label>
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                        <div className="flex items-center space-x-2 p-3 border border-border rounded-lg">
                          <RadioGroupItem value="card" id="card" />
                          <CreditCard className="w-4 h-4" />
                          <Label htmlFor="card">Credit or Debit Card</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border border-border rounded-lg">
                          <RadioGroupItem value="paypal" id="paypal" />
                          <div className="w-4 h-4 bg-blue-500 rounded" />
                          <Label htmlFor="paypal">PayPal</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border border-border rounded-lg">
                          <RadioGroupItem value="apple" id="apple" />
                          <Smartphone className="w-4 h-4" />
                          <Label htmlFor="apple">Apple Pay</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {paymentMethod === "card" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input id="expiry" placeholder="MM/YY" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvc">CVC</Label>
                            <Input id="cvc" placeholder="123" required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardName">Name on Card</Label>
                          <Input id="cardName" placeholder="John Doe" required />
                        </div>
                      </div>
                    )}

                    {/* Billing Address */}
                    <div className="space-y-4">
                      <Label>Billing Address</Label>
                      <div className="space-y-3">
                        <Input placeholder="Street Address" required />
                        <div className="grid grid-cols-2 gap-3">
                          <Input placeholder="City" required />
                          <Input placeholder="State" required />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Input placeholder="ZIP Code" required />
                          <Input placeholder="Country" required />
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" required />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the{" "}
                        <Link href="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>

                    <Button type="submit" className="w-full" disabled={isProcessing}>
                      {isProcessing ? "Processing..." : `Subscribe for $${totalPrice.toFixed(2)}`}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      You can cancel your subscription at any time. No commitments, no cancellation fees.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
