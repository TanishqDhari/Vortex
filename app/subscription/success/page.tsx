import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Play, Crown, Download, Tv } from "lucide-react"
import Link from "next/link"

export default function SubscriptionSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Success Message */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Welcome to Vortex Premium!</h1>
          <p className="text-xl text-muted-foreground">Your subscription has been activated successfully</p>
        </div>

        {/* Subscription Details */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Premium Plan</h3>
                  <p className="text-muted-foreground">$16.99/month</p>
                  <p className="text-sm text-muted-foreground">Next billing: January 15, 2025</p>
                </div>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
            </div>
          </CardContent>
        </Card>

        {/* What's Included */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">What's included in your plan:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Tv className="w-4 h-4 text-primary" />
                </div>
                <span>4K Ultra HD streaming</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Play className="w-4 h-4 text-primary" />
                </div>
                <span>4 simultaneous streams</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Download className="w-4 h-4 text-primary" />
                </div>
                <span>Unlimited downloads</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Crown className="w-4 h-4 text-primary" />
                </div>
                <span>Exclusive premium content</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">What's next?</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                  1
                </div>
                <span>Set up your profile and preferences</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                  2
                </div>
                <span>Download the Vortex app on your devices</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                  3
                </div>
                <span>Start watching your favorite content in 4K</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/home">Start Watching</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/profile">Set Up Profile</Link>
          </Button>
        </div>

        {/* Support */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Need help? Contact our{" "}
            <Link href="/support" className="text-primary hover:underline">
              support team
            </Link>{" "}
            anytime.
          </p>
        </div>
      </div>
    </div>
  )
}
