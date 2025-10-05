"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Crown, CreditCard, Calendar, Users, Monitor, Tv, Download, Shield, Zap, Star } from "lucide-react";

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Dynamic data
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [billingHistory, setBillingHistory] = useState<any[]>([]);

  // Fetch data dynamically on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [plansRes, currentRes, paymentsRes, historyRes] = await Promise.all([
          fetch("/api/subscriptions/plans").then((r) => r.json()),
          fetch("/api/subscriptions/current").then((r) => r.json()),
          fetch("/api/subscriptions/payments").then((r) => r.json()),
          fetch("/api/subscriptions/history").then((r) => r.json()),
        ]);

        setSubscriptionPlans(plansRes);
        setCurrentSubscription(currentRes);
        setPaymentMethods(paymentsRes);
        setBillingHistory(historyRes);

        // Set default selected plan
        setSelectedPlan(currentRes.plan.toLowerCase());
      } catch (error) {
        console.error("Failed to fetch subscription data:", error);
      }
    }

    fetchData();
  }, []);

  const handlePlanChange = (planId: string) => {
    setSelectedPlan(planId);
    // Call API to change plan
    console.log("Change plan to:", planId);
  };

  const handleCancelSubscription = () => {
    console.log("Cancelling subscription...");
    // Call API to cancel subscription
  };

  if (!currentSubscription || subscriptionPlans.length === 0) return <div>Loading...</div>;

  return (
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

          {/* Plans Tab */}
          <TabsContent value="plans" className="space-y-6">
            {/* Billing Toggle */}
            <Card>
              <CardContent className="p-6 flex items-center justify-center space-x-4">
                <Label className={billingCycle === "monthly" ? "font-semibold" : ""}>Monthly</Label>
                <Switch
                  checked={billingCycle === "yearly"}
                  onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
                />
                <Label className={billingCycle === "yearly" ? "font-semibold" : ""}>
                  Yearly
                  <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30">Save 20%</Badge>
                </Label>
              </CardContent>
            </Card>

            {/* Pricing Plans */}
            <div className="grid md:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative border ${plan.popular ? "ring-2 ring-primary" : ""} ${
                    selectedPlan === plan.id ? "ring-2 ring-primary" : ""
                  } transition-all hover:shadow-lg cursor-pointer`}
                  onClick={() => handlePlanChange(plan.id)}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-primary">${plan.price[billingCycle].toFixed(2)}</div>
                      <p className="text-muted-foreground">per {billingCycle}</p>
                    </div>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {plan.features.map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      className="w-full"
                      variant={selectedPlan === plan.id ? "default" : "outline"}
                      onClick={() => handlePlanChange(plan.id)}>
                      {currentSubscription.plan.toLowerCase() === plan.id ? "Current Plan" : "Choose Plan"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Current Plan Tab */}
          <TabsContent value="current" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Subscription</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-6 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <Crown className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{currentSubscription.plan} Plan</h3>
                      <p className="text-muted-foreground">{currentSubscription.price}</p>
                      <p className="text-sm text-muted-foreground">
                        Next billing: {new Date(currentSubscription.nextBilling).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {currentSubscription.status}
                    </Badge>
                    <div className="space-x-2">
                      <Button variant="outline">Upgrade Plan</Button>
                      <Button variant="outline" onClick={handleCancelSubscription}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-border">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {method.brand} •••• {method.last4}
                        </p>
                        <p className="text-sm text-muted-foreground">{method.type}</p>
                      </div>
                      {method.isDefault && (
                        <Badge variant="secondary" className="ml-2">
                          Default
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
