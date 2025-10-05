"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Crown, CreditCard, Calendar, Users, Monitor, Tv, Download, Shield, Zap, Star } from "lucide-react"

const subscriptionPlans = [
  {
    id: "basic",
    name: "Basic",
    price: { monthly: 8.99, yearly: 89.99 },
    description: "Perfect for casual viewers",
    features: ["HD streaming", "1 device at a time", "Limited downloads", "Standard support", "Ad-supported content"],
    limitations: ["No 4K content", "Limited offline downloads", "Ads during content"],
    color: "border-border",
    popular: false,
  },
  {
    id: "standard",
    name: "Standard",
    price: { monthly: 12.99, yearly: 129.99 },
    description: "Great for families",
    features: [
      "Full HD streaming",
      "2 devices simultaneously",
      "Unlimited downloads",
      "Priority support",
      "Ad-free experience",
      "Early access to new releases",
    ],
    limitations: ["No 4K content"],
    color: "border-primary",
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: { monthly: 16.99, yearly: 169.99 },
    description: "Ultimate viewing experience",
    features: [
      "4K Ultra HD streaming",
      "4 devices simultaneously",
      "Unlimited downloads",
      "Premium support",
      "Ad-free experience",
      "Early access to new releases",
      "Exclusive premium content",
      "Dolby Atmos audio",
    ],
    limitations: [],
    color: "border-primary",
    popular: false,
  },
]

const currentSubscription = {
  plan: "Standard",
  status: "Active",
  nextBilling: "2024-12-15",
  price: "$12.99/month",
  paymentMethod: "•••• •••• •••• 4242",
}

const paymentMethods = [
  { id: 1, type: "Credit Card", last4: "4242", brand: "Visa", isDefault: true },
  { id: 2, type: "Credit Card", last4: "8888", brand: "Mastercard", isDefault: false },
]

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [selectedPlan, setSelectedPlan] = useState("standard")

  const handlePlanChange = (planId: string) => {
    setSelectedPlan(planId)
    // Handle plan change logic
  }

  const handleCancelSubscription = () => {
    // Handle subscription cancellation
    console.log("Cancelling subscription...")
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <div className="flex-1 ml-16">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="px-6 py-4">
            <h1 className="text-3xl font-bold text-foreground flex items-center">
              <Crown className="w-8 h-8 mr-3 text-primary" />
              Subscription
            </h1>
            <p className="text-muted-foreground mt-1">Manage your subscription and billing</p>
          </div>
        </div>

        <div className="p-6">
          <Tabs defaultValue="plans" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="plans">Plans & Pricing</TabsTrigger>
              <TabsTrigger value="current">Current Plan</TabsTrigger>
              <TabsTrigger value="billing">Billing & Payment</TabsTrigger>
            </TabsList>

            <TabsContent value="plans" className="space-y-6">
              {/* Billing Toggle */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center space-x-4">
                    <Label htmlFor="billing-toggle" className={billingCycle === "monthly" ? "font-semibold" : ""}>
                      Monthly
                    </Label>
                    <Switch
                      id="billing-toggle"
                      checked={billingCycle === "yearly"}
                      onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
                    />
                    <Label htmlFor="billing-toggle" className={billingCycle === "yearly" ? "font-semibold" : ""}>
                      Yearly
                      <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30">Save 20%</Badge>
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing Plans */}
              <div className="grid md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`relative ${plan.color} ${plan.popular ? "ring-2 ring-primary" : ""} ${
                      selectedPlan === plan.id ? "ring-2 ring-primary" : ""
                    } transition-all hover:shadow-lg cursor-pointer`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
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
                        <p className="text-muted-foreground">per {billingCycle === "monthly" ? "month" : "year"}</p>
                        {billingCycle === "yearly" && (
                          <p className="text-sm text-green-400">
                            Save ${((plan.price.monthly * 12 - plan.price.yearly) / 12).toFixed(2)}/month
                          </p>
                        )}
                      </div>
                      <p className="text-muted-foreground">{plan.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                        {plan.limitations.map((limitation, index) => (
                          <div key={index} className="flex items-center space-x-3 opacity-60">
                            <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                              <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                            </div>
                            <span className="text-sm line-through">{limitation}</span>
                          </div>
                        ))}
                      </div>
                      <Button
                        className="w-full"
                        variant={selectedPlan === plan.id ? "default" : "outline"}
                        onClick={() => handlePlanChange(plan.id)}
                      >
                        {currentSubscription.plan.toLowerCase() === plan.id
                          ? "Current Plan"
                          : selectedPlan === plan.id
                            ? "Select Plan"
                            : "Choose Plan"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Plan Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Plan Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4">Features</th>
                          <th className="text-center py-3 px-4">Basic</th>
                          <th className="text-center py-3 px-4">Standard</th>
                          <th className="text-center py-3 px-4">Premium</th>
                        </tr>
                      </thead>
                      <tbody className="space-y-2">
                        <tr className="border-b border-border/50">
                          <td className="py-3 px-4 flex items-center">
                            <Monitor className="w-4 h-4 mr-2" />
                            Video Quality
                          </td>
                          <td className="text-center py-3 px-4">HD</td>
                          <td className="text-center py-3 px-4">Full HD</td>
                          <td className="text-center py-3 px-4">4K Ultra HD</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-3 px-4 flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            Simultaneous Streams
                          </td>
                          <td className="text-center py-3 px-4">1</td>
                          <td className="text-center py-3 px-4">2</td>
                          <td className="text-center py-3 px-4">4</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-3 px-4 flex items-center">
                            <Download className="w-4 h-4 mr-2" />
                            Downloads
                          </td>
                          <td className="text-center py-3 px-4">Limited</td>
                          <td className="text-center py-3 px-4">Unlimited</td>
                          <td className="text-center py-3 px-4">Unlimited</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-3 px-4 flex items-center">
                            <Shield className="w-4 h-4 mr-2" />
                            Ad-free Experience
                          </td>
                          <td className="text-center py-3 px-4">✗</td>
                          <td className="text-center py-3 px-4">✓</td>
                          <td className="text-center py-3 px-4">✓</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="current" className="space-y-6">
              {/* Current Subscription */}
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

              {/* Usage Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Usage This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-card/50 rounded-lg">
                      <Tv className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold text-foreground">47</div>
                      <p className="text-sm text-muted-foreground">Hours Watched</p>
                    </div>
                    <div className="text-center p-4 bg-card/50 rounded-lg">
                      <Monitor className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold text-foreground">2</div>
                      <p className="text-sm text-muted-foreground">Active Devices</p>
                    </div>
                    <div className="text-center p-4 bg-card/50 rounded-lg">
                      <Download className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold text-foreground">12</div>
                      <p className="text-sm text-muted-foreground">Downloads</p>
                    </div>
                    <div className="text-center p-4 bg-card/50 rounded-lg">
                      <Zap className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold text-foreground">98%</div>
                      <p className="text-sm text-muted-foreground">Uptime</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Plan Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-card/50 rounded-lg">
                      <Check className="w-5 h-5 text-green-400" />
                      <span>Full HD streaming quality</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-card/50 rounded-lg">
                      <Check className="w-5 h-5 text-green-400" />
                      <span>2 simultaneous streams</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-card/50 rounded-lg">
                      <Check className="w-5 h-5 text-green-400" />
                      <span>Unlimited downloads</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-card/50 rounded-lg">
                      <Check className="w-5 h-5 text-green-400" />
                      <span>Ad-free experience</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-card/50 rounded-lg">
                      <Check className="w-5 h-5 text-green-400" />
                      <span>Priority customer support</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-card/50 rounded-lg">
                      <Check className="w-5 h-5 text-green-400" />
                      <span>Early access to new releases</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

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
                      className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-border"
                    >
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
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full bg-transparent">
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>

              {/* Billing History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Billing History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { date: "2024-11-15", amount: "$12.99", status: "Paid", invoice: "INV-001" },
                      { date: "2024-10-15", amount: "$12.99", status: "Paid", invoice: "INV-002" },
                      { date: "2024-09-15", amount: "$12.99", status: "Paid", invoice: "INV-003" },
                      { date: "2024-08-15", amount: "$12.99", status: "Paid", invoice: "INV-004" },
                    ].map((bill, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-border"
                      >
                        <div>
                          <p className="font-medium text-foreground">{bill.amount}</p>
                          <p className="text-sm text-muted-foreground">
                            Standard Plan • {new Date(bill.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant="secondary">{bill.status}</Badge>
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    View All Invoices
                  </Button>
                </CardContent>
              </Card>

              {/* Next Billing */}
              <Card>
                <CardHeader>
                  <CardTitle>Next Billing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Standard Plan</p>
                        <p className="text-sm text-muted-foreground">
                          Next charge on {new Date(currentSubscription.nextBilling).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{currentSubscription.price}</p>
                        <p className="text-sm text-muted-foreground">{currentSubscription.paymentMethod}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
