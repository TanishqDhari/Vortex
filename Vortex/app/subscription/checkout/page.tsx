"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Play, CreditCard, Shield, ArrowLeft, Check, Loader2 } from "lucide-react";
import { IconAppleFilled, IconBrandGoogleFilled } from "@tabler/icons-react";

const InfoModal = ({ title, message, onClose }: { title: string; message: string; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
            <h2 className="text-xl font-bold mb-3">{title}</h2>
            <p className="text-muted-foreground mb-6">{message}</p>
            <Button onClick={onClose}>Close</Button>
        </div>
    </div>
);

export default function CheckoutPage() {
    const [checkoutData, setCheckoutData] = useState<any>(null);
    const [planDetails, setPlanDetails] = useState<any>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
    const [paymentMethod, setPaymentMethod] = useState("card");

    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvc, setCvc] = useState("");
    const [cardName, setCardName] = useState("");

    const [isProcessing, setIsProcessing] = useState(false);
    const [modalInfo, setModalInfo] = useState<{ title: string; message: string } | null>(null);

    useEffect(() => {
        const loadCheckoutInfo = async () => {
            const storedUserId = localStorage.getItem("userId");
            const storedCheckoutData = localStorage.getItem("checkoutData");

            if (!storedUserId || !storedCheckoutData) {
                window.location.href = "/subscription";
                return;
            }

            const parsedData = JSON.parse(storedCheckoutData);
            setUserId(parseInt(storedUserId, 10));
            setCheckoutData(parsedData);
            setBillingCycle(parsedData.billing_cycle || "monthly");

            try {
                const res = await fetch("/api/subscription-plan");
                if (res.ok) {
                    const plans = await res.json();
                    const currentPlan = plans.find((p: any) => p.plan_id === parsedData.plan_id);
                    if (currentPlan) setPlanDetails(currentPlan);
                    else throw new Error("Selected plan not found.");
                } else throw new Error("Failed to fetch plan details.");
            } catch (err) {
                setModalInfo({
                    title: "Error",
                    message: err instanceof Error ? err.message : "Unknown error loading plan.",
                });
            }
        };

        loadCheckoutInfo();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId || !checkoutData) {
            setModalInfo({ title: "Error", message: "Session expired. Please select a plan again." });
            return;
        }

        setIsProcessing(true);

        try {
            // Step 1: Create the payment record.
            const paymentPayload = {
                user_id: userId,
                payment_amount: checkoutData.amount,
                payment_mode: paymentMethod, // 'card', 'google_pay', or 'apple_pay'
            };

            const paymentRes = await fetch("/api/payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(paymentPayload),
            });

            if (!paymentRes.ok) {
                const errorData = await paymentRes.json();
                throw new Error(errorData.error || "Payment processing failed.");
            }

            const paymentResult = await paymentRes.json();
            const payment_id = paymentResult.payment_id;

            if (!payment_id) throw new Error("Payment ID was not returned from the server.");

            // Step 2: Create the subscription record, linking the user to the new payment.
            const startDate = new Date();
            const endDate = new Date();
            billingCycle === "monthly"
                ? endDate.setMonth(startDate.getMonth() + 1)
                : endDate.setFullYear(startDate.getFullYear() + 1);

            const formatMySqlDate = (d: Date) => d.toISOString().slice(0, 19).replace("T", " ");
            const subscriptionPayload = {
                user_id: userId,
                plan_id: checkoutData.plan_id,
                payment_id,
                start_date: formatMySqlDate(startDate),
                end_date: formatMySqlDate(endDate),
            };

            const subRes = await fetch("/api/subscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(subscriptionPayload),
            });

            if (!subRes.ok) {
                 const errorData = await subRes.json();
                throw new Error(errorData.error || "Subscription creation failed.");
            }

            localStorage.removeItem("checkoutData");
            window.location.href = "/subscription/success";
        } catch (err) {
            setModalInfo({
                title: "Checkout Failed",
                message: err instanceof Error ? err.message : "An unknown error occurred.",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    if (!checkoutData || !planDetails) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const totalPrice = checkoutData.amount;
    const planName = checkoutData.plan_name;

    return (
        <div className="min-h-screen bg-background">
            {modalInfo && <InfoModal {...modalInfo} onClose={() => setModalInfo(null)} />}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <a href="/subscription" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Plans</span>
                    </a>
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <Play className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="text-2xl font-bold text-foreground">Vortex</span>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-foreground">{planName} Plan</h3>
                                        <p className="text-sm text-muted-foreground">Billed {billingCycle}</p>
                                    </div>
                                    <Badge className="bg-primary/20 text-primary border-primary/30">Premium</Badge>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Check className="w-4 h-4 text-green-400" />
                                        <span className="text-sm text-muted-foreground">{planDetails.video_quality} quality</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Check className="w-4 h-4 text-green-400" />
                                        <span className="text-sm text-muted-foreground">Up to {planDetails.device_limit} devices</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Check className="w-4 h-4 text-green-400" />
                                        <span className="text-sm text-muted-foreground">Unlimited downloads</span>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between text-lg font-semibold">
                                    <span>Total</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <Shield className="w-5 h-5 text-green-400" />
                                    <div>
                                        <p className="font-medium text-foreground">Secure Payment</p>
                                        <p className="text-sm text-muted-foreground">Your info is encrypted and safe.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Payment Form */}
                    <div>
                        <Card>
                            <CardHeader><CardTitle>Payment Information</CardTitle></CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-3">
                                        <Label>Payment Method</Label>
                                        <RadioGroup defaultValue="card" value={paymentMethod} onValueChange={setPaymentMethod}>
                                            <div className="flex items-center space-x-2 p-3 border border-border rounded-lg has-[[data-state=checked]]:border-primary">
                                                <RadioGroupItem value="card" id="card" />
                                                <CreditCard className="w-5 h-5" />
                                                <Label htmlFor="card" className="flex-grow">Credit or Debit Card</Label>
                                            </div>
                                            <div className="flex items-center space-x-2 p-3 border border-border rounded-lg has-[[data-state=checked]]:border-primary">
                                                <RadioGroupItem value="google_pay" id="google_pay" />
                                                <IconBrandGoogleFilled className="w-5 h-5" />
                                                <Label htmlFor="google_pay" className="flex-grow">Google Pay</Label>
                                            </div>
                                            <div className="flex items-center space-x-2 p-3 border border-border rounded-lg has-[[data-state=checked]]:border-primary">
                                                <RadioGroupItem value="apple_pay" id="apple_pay" />
                                                <IconAppleFilled className="w-5 h-5" />
                                                <Label htmlFor="apple_pay" className="flex-grow">Apple Pay</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    {paymentMethod === "card" && (
                                        <div className="space-y-4 pt-4 border-t">
                                            <div className="space-y-2">
                                                <Label htmlFor="cardNumber">Card Number</Label>
                                                <Input id="cardNumber" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456" required />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="expiry">Expiry Date</Label>
                                                    <Input id="expiry" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} placeholder="MM/YY" required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="cvc">CVC</Label>
                                                    <Input id="cvc" value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="123" required />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cardName">Name on Card</Label>
                                                <Input id="cardName" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="John Doe" required />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="terms" required />
                                        <Label htmlFor="terms" className="text-sm">
                                            I agree to the <a href="/terms" className="text-primary hover:underline">Terms</a> and{" "}
                                            <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                                        </Label>
                                    </div>

                                    <Button type="submit" className="w-full" disabled={isProcessing}>
                                        {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                        {isProcessing ? "Processing..." : `Subscribe for $${totalPrice.toFixed(2)}`}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

