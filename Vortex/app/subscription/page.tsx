"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Crown, CreditCard, Star, X } from "lucide-react";

// A simple modal component to replace alert() and confirm()
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }: { isOpen: boolean, title: string, message: string, onConfirm: (() => void) | null, onCancel: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button onClick={onCancel} className="absolute top-2 right-2 text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-muted-foreground mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          {onConfirm && <Button variant={title.includes("Cancel") ? "destructive" : "default"} onClick={onConfirm}>Confirm</Button>}
        </div>
      </div>
    </div>
  );
};


export default function SubscriptionPage() {
  const router = useRouter();

  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [billingHistory, setBillingHistory] = useState<any[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null as (() => void) | null });

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      router.push("/login");
      return;
    }
    const id = parseInt(storedUserId, 10);
    if (isNaN(id) || id <= 0) {
      router.push("/login");
      return;
    }
    setUserId(id);

    async function fetchData(userId: number) {
      setIsLoading(true);
      try {
        const [plansRes, subscriptionRes, paymentRes] = await Promise.all([
          fetch("/api/subscription-plan"),
          fetch(`/api/subscription?user_id=${userId}`),
          fetch(`/api/payment?user_id=${userId}`),
        ]);

        if (plansRes.ok) {
            const plans = await plansRes.json();
            setSubscriptionPlans(plans);
        } else {
            console.error("Failed to fetch subscription plans");
        }

        if (subscriptionRes.ok) {
          const subscription = await subscriptionRes.json();
          if (subscription) {
            setCurrentSubscription(subscription);
            setSelectedPlan(subscription.plan_id);
          }
        } else {
             if(subscriptionRes.status !== 404) console.error("Failed to fetch current subscription");
        }

        if (paymentRes.ok) {
            const payments = await paymentRes.json();
            setPaymentMethods(payments);
        } else {
            console.error("Failed to fetch payment methods");
        }
      //   if (billingRes.ok) {
      //   const subscriptions = await billingRes.json();
      //   const now = new Date();

      //   const activeSub = subscriptions.find((s: any) => new Date(s.end_date) > now);
      //   setCurrentSubscription(activeSub || null);
      //   setSelectedPlan(activeSub?.plan_id || null);

      //   const expiredSubs = subscriptions
      //     .filter((s: any) => new Date(s.end_date) <= now)
      //     .sort((a: any, b: any) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime());

      //   setBillingHistory(expiredSubs);
      // } else {
      //   console.error("Failed to fetch subscriptions for billing history");
      // }
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
        setModal({ isOpen: true, title: "Error", message: "Could not load your subscription data. Please try again later.", onConfirm: null });
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
        fetchData(id);
    }
  }, [router]);

  const handlePlanChange = (plan: any) => {
    if (!userId) return;
    if (currentSubscription?.plan_id === plan.plan_id) return;

    // This is a simplified checkout flow. In a real app, you'd integrate a payment provider.
    const checkoutData = {
      user_id: userId,
      plan_id: plan.plan_id,
      plan_name: plan.plan_name,
      billing_cycle: billingCycle,
      amount: billingCycle === 'yearly' ? plan.price * 12 * 0.8 : plan.price, // Example discount
    };
    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    router.push("/subscription/checkout");
  };

  const handleCancelSubscription = async () => {
    if (!userId) return;
    
    const confirmCancellation = async () => {
        try {
          const res = await fetch("/api/subscription", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Failed to cancel subscription");
          }

          setCurrentSubscription(null);
          setSelectedPlan(null);
          setModal({ isOpen: true, title: "Success", message: "Your subscription has been cancelled.", onConfirm: null });
        } catch (error) {
          console.error(error);
          const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
          setModal({ isOpen: true, title: "Error", message: `Could not cancel subscription. ${errorMessage}`, onConfirm: null });
        } finally {
            closeModal();
        }
    };

    setModal({
        isOpen: true,
        title: "Cancel Subscription",
        message: "Are you sure you want to cancel? This action cannot be undone.",
        onConfirm: confirmCancellation,
    });
  };
  
  const closeModal = () => setModal({ isOpen: false, title: '', message: '', onConfirm: null });

  if (isLoading) return <div className="p-6 text-center">Loading your subscription details...</div>;

  return (
    <>
      <ConfirmationModal {...modal} onCancel={closeModal} />
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <div className="flex-1 ml-16 p-6">
          <h1 className="text-3xl font-bold flex items-center mb-1">
            <Crown className="w-8 h-8 mr-3 text-primary" />
            Subscription
          </h1>
          <p className="text-muted-foreground mb-6">Manage your subscription and billing</p>

          <Tabs defaultValue="plans" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="plans">Plans & Pricing</TabsTrigger>
              <TabsTrigger value="current">Current Plan</TabsTrigger>
              <TabsTrigger value="billing">Billing & Payment</TabsTrigger>
            </TabsList>

            <TabsContent value="plans" className="mt-6 space-y-6">
              <Card>
                <CardContent className="flex justify-center p-4">
                  <div className="flex rounded-full bg-muted p-1">
                    <button
                      className={`px-4 py-1 rounded-full font-semibold transition-colors ${billingCycle === "monthly" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted-foreground/10"}`}
                      onClick={() => setBillingCycle("monthly")}
                    >
                      Monthly
                    </button>
                    <button
                      className={`px-4 py-1 rounded-full font-semibold flex items-center transition-colors ${billingCycle === "yearly" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted-foreground/10"}`}
                      onClick={() => setBillingCycle("yearly")}
                    >
                      Yearly
                      <Badge variant="secondary" className="ml-2 bg-green-500/20 text-green-400 border-none">Save 20%</Badge>
                    </button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan) => {
                  const price = billingCycle === "yearly" ? (plan.price * 12 * 0.8 / 12).toFixed(2) : plan.price;
                  const suffix = billingCycle === "monthly" ? "mo" : "yr";
                  const displayPrice = billingCycle === "yearly" ? (parseFloat(price) * 12).toFixed(2) : price;

                  return (
                    <Card
                      key={plan.plan_id}
                      className={`relative border-2 ${selectedPlan === plan.plan_id ? "border-primary" : "border-border"} hover:shadow-lg transition-all flex flex-col`}
                    >
                      {plan.plan_name === "Premium" && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-primary text-primary-foreground">
                            <Star className="w-3 h-3 mr-1" /> Most Popular
                          </Badge>
                        </div>
                      )}
                      <CardHeader className="text-center pb-4">
                        <CardTitle className="text-2xl">{plan.plan_name}</CardTitle>
                         <p className="text-muted-foreground">{plan.description || `${plan.plan_name} subscription plan`}</p>
                        <div className="text-4xl font-bold text-primary">${price}<span className="text-lg font-medium text-muted-foreground">/mo</span></div>
                        <p className="text-sm text-muted-foreground">{billingCycle === 'yearly' ? `Billed $${displayPrice} annually` : 'Billed monthly'}</p>
                      </CardHeader>
                      <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Check className="w-5 h-5 text-green-400" />
                            <span>Up to {plan.device_limit} devices</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Check className="w-5 h-5 text-green-400" />
                            <span>{plan.video_quality} quality</span>
                          </div>
                        </div>
                        <Button
                          className="w-full mt-4"
                          variant={selectedPlan === plan.plan_id ? "default" : "outline"}
                          onClick={() => handlePlanChange(plan)}
                          disabled={currentSubscription?.plan_id === plan.plan_id}
                        >
                          {currentSubscription?.plan_id === plan.plan_id ? "Current Plan" : "Choose Plan"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="current" className="mt-6">
              <Card>
                <CardHeader><CardTitle>Current Subscription</CardTitle></CardHeader>
                <CardContent>
                  {currentSubscription ? (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-primary/10 rounded-lg border border-primary/20 space-y-4 sm:space-y-0">
                    {/* Left: Plan info */}
                    <div className="flex flex-col">
                      <h3 className="text-xl font-semibold">{currentSubscription.plan_name} Plan</h3>
                      <p className="text-muted-foreground">${currentSubscription.price}/{currentSubscription.billing_cycle === 'monthly' ? 'mo' : 'yr'}</p>
                      <p className="text-sm text-muted-foreground">
                        Next billing: {new Date(currentSubscription.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    {/* Right: Badge + Buttons */}
                    <div className="flex flex-col sm:items-end space-y-2">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
                      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 w-full sm:w-auto">
                        <Button className="w-full sm:w-auto" variant="outline" onClick={() => setModal({isOpen: true, title: "Info", message: "Plan upgrade flow is not implemented in this demo.", onConfirm: null})}>Upgrade Plan</Button>
                        <Button className="w-full sm:w-auto" variant="destructive" onClick={handleCancelSubscription}>Cancel</Button>
                      </div>
                    </div>
                  </div>
                  ) : (
                    <p className="text-muted-foreground p-6 text-center">No active subscription. Choose a plan to get started!</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="mt-6 space-y-6">
               <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                        <CreditCard className="w-5 h-5 mr-2" /> Payment Methods
                    </div>
                    <Button size="sm" onClick={() => setModal({isOpen: true, title: "Info", message: "Add payment flow is not implemented in this demo.", onConfirm: null})}>Add New</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentMethods.length > 0 ? paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 bg-card/50 rounded-lg border">
                      <div className="flex items-center space-x-4">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <span>{method.card_type} **** {method.last4}</span>
                        <span className="text-muted-foreground">Expires {method.expiry_date}</span>
                      </div>
                       {method.is_default && <Badge variant="secondary">Default</Badge>}
                    </div>
                  )) : <p className="text-muted-foreground text-center py-4">No payment methods found.</p>}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Billing History</CardTitle></CardHeader>
                <CardContent>
                  {billingHistory.length > 0 ? (
                    <table className="w-full table-auto border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Plan</th>
                          <th className="text-left p-2">Amount</th>
                          <th className="text-left p-2">Payment Method</th>
                          <th className="text-left p-2">Start Date</th>
                          <th className="text-left p-2">End Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {billingHistory.map((sub: any) => (
                          <tr key={sub.subscription_id} className="border-b hover:bg-muted/10">
                            <td className="p-2">{sub.plan_name}</td>
                            <td className="p-2">${sub.price}</td>
                            <td className="p-2">{sub.payment ? `${sub.payment.card_type} **** ${sub.payment.last4}` : "N/A"}</td>
                            <td className="p-2">{new Date(sub.start_date).toLocaleDateString()}</td>
                            <td className="p-2">{new Date(sub.end_date).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No billing history found.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
