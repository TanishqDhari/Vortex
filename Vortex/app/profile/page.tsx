"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MediaCard } from "@/components/media-card"
import { Edit, Camera, Calendar, Mail, User, Crown, CreditCard, History, Bookmark } from "lucide-react"

type UserData = {
  user_id: number;
  fname: string;
  lname: string;
  email: string;
  dob: string;
  login_type: string;
  created_at?: string;
  user_password: string;
}

type MediaItem = {
  media_id: number;
  title: string;
  release_year: number;
  rating: number;
  image: string;
  genres: string[];
  synopsis?: string;
  duration?: number;
}

const watchHistory = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `Movie/Show ${i + 1}`,
  year: 2024,
  rating: 8.0 + Math.random(),
  image: `/placeholder.svg?height=400&width=300&query=watch history ${i + 1}`,
  genre: ["Action", "Drama"],
  watchedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  progress: Math.floor(Math.random() * 100),
}))

const watchlist = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: `Watchlist Item ${i + 1}`,
  year: 2024,
  rating: 8.0 + Math.random(),
  image: `/placeholder.svg?height=400&width=300&query=watchlist item ${i + 1}`,
  genre: ["Drama", "Thriller"],
  addedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
}))

const paymentHistory = [
  { id: 1, date: "2024-11-15", amount: "$14.99", plan: "Premium", status: "Paid", method: "Credit Card" },
  { id: 2, date: "2024-10-15", amount: "$14.99", plan: "Premium", status: "Paid", method: "Credit Card" },
  { id: 3, date: "2024-09-15", amount: "$14.99", plan: "Premium", status: "Paid", method: "Credit Card" },
  { id: 4, date: "2024-08-15", amount: "$14.99", plan: "Premium", status: "Paid", method: "Credit Card" },
]

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [watchHistory, setWatchHistory] = useState<MediaItem[]>([])
  const [watchlist, setWatchlist] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
  })

  useEffect(() => {
    async function fetchUserData() {
      const storedUserId = localStorage.getItem("userId");

    if (!storedUserId) {
      console.log("No userId found in localStorage. Redirecting to login.");
      window.location.href = "/login";
      return;
    }

    const userId = parseInt(storedUserId, 10);
    if (isNaN(userId) || userId <= 0) {
      console.log("Invalid userId in localStorage. Redirecting to login.");
      window.location.href = "/login";
      return;
    }
    
      try {        
        const [userRes, historyRes, watchlistRes] = await Promise.all([
          fetch(`/api/user/${userId}`),
          fetch(`/api/user/${userId}/watch-history`),
          fetch(`/api/user/${userId}/watchlist`)
        ]);
        
        if (userRes.ok) {
          const userDataArray = await userRes.json();
          if (userDataArray.length > 0) {
            const user = userDataArray[0];
            setUserData(user);
            setFormData({
              firstName: user.fname,
              lastName: user.lname,
              email: user.email,
              dateOfBirth: user.dob,
            });
          }
        }

        if (historyRes.ok) {
          const history = await historyRes.json();
          setWatchHistory(history);
        }

        if (watchlistRes.ok) {
          const watchlistData = await watchlistRes.json();
          setWatchlist(watchlistData);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  const handleSave = async () => {
    if (!userData) return;
    
    try {
      const response = await fetch(`/api/user/${userData.user_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userData.user_id,
          fname: formData.firstName,
          lname: formData.lastName,
          email: formData.email,
          dob: formData.dateOfBirth,
          login_type: userData.login_type,
          user_password: userData.user_password || ""
        })
      });

      if (response.ok) {
        setUserData(prev => prev ? {
          ...prev,
          fname: formData.firstName,
          lname: formData.lastName,
          email: formData.email,
          dob: formData.dateOfBirth
        } : null);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update user data:", error);
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <div className="flex-1 ml-16 flex items-center justify-center">
          <div className="text-muted-foreground">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <div className="flex-1 ml-16 flex items-center justify-center">
          <div className="text-muted-foreground">User not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <div className="flex-1 ml-16">
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="px-6 py-4">
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
          </div>
        </div>

        <div className="p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                    <div className="relative">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src="/placeholder.svg" alt="Profile" />
                        <AvatarFallback className="text-2xl">
                          {userData.fname?.[0] || "U"}
                          {userData.lname?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                        variant="secondary"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h2 className="text-2xl font-bold text-foreground">
                          {userData.fname} {userData.lname}
                        </h2>
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{userData.email}</p>
                    </div>
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{watchHistory.length}</div>
                    <p className="text-sm text-muted-foreground">Items Watched</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{watchlist.length}</div>
                    <p className="text-sm text-muted-foreground">Watchlist Items</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {watchHistory.reduce((total, item) => total + (item.duration || 0), 0)}
                    </div>
                    <p className="text-sm text-muted-foreground">Minutes Watched</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {watchHistory.length > 0 ? Math.round(watchHistory.reduce((sum, item) => sum + (item.rating || 0), 0) / watchHistory.length * 10) / 10 : 0}
                    </div>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                  </CardContent>
                </Card>
              </div>

              {/* Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {watchHistory.length > 0 ? (
                      // Extract unique genres from watch history as preferences
                      Array.from(new Set(watchHistory.flatMap(item => item.genres || []))).slice(0, 5).map((pref) => (
                        <Badge key={pref} variant="secondary">
                          {pref}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No preferences available yet. Start watching to build your preferences!</p>
                    )}
                  </div>
                  <Button variant="outline" className="mt-4 bg-transparent">
                    Update Preferences
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Continue Watching</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {watchHistory.slice(0, 6).map((item) => (
                      <MediaCard 
                        key={item.media_id} 
                        id={item.media_id}
                        title={item.title || "Untitled"}
                        year={item.release_year || 0}
                        rating={item.rating || 0}
                        image={item.image || "/placeholder.svg"}
                        genre={item.genres || []}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="watchlist" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bookmark className="w-5 h-5 mr-2" />
                    My Watchlist ({watchlist.length} items)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {watchlist.map((item) => (
                      <div key={item.media_id} className="space-y-2">
                        <MediaCard 
                          id={item.media_id}
                          title={item.title || "Untitled"}
                          year={item.release_year || 0}
                          rating={item.rating || 0}
                          image={item.image || "/placeholder.svg"}
                          genre={item.genres || []}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <History className="w-5 h-5 mr-2" />
                    Watch History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {watchHistory.map((item) => (
                      <div
                        key={item.media_id}
                        className="flex items-center space-x-4 p-4 bg-card/50 rounded-lg hover:bg-card/80 transition-colors"
                      >
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-16 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">Year: {item.release_year}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {item.genres && item.genres.length > 0 && (
                              <Badge variant="outline">{item.genres[0]}</Badge>
                            )}
                            <span className="text-sm text-muted-foreground">⭐ {(item.rating || 0).toFixed(1)}</span>
                          </div>
                        </div>
                        <Button variant="outline">Watch Again</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscription" className="space-y-6">
              {/* Current Subscription */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Crown className="w-5 h-5 mr-2" />
                    Current Subscription
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">Premium Plan</h3>
                      <p className="text-muted-foreground">$14.99/month</p>
                      <p className="text-sm text-muted-foreground">
                        Next billing: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-2">
                        Active
                      </Badge>
                      <div className="space-x-2">
                        <Button variant="outline">Change Plan</Button>
                        <Button variant="outline">Cancel</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: 1, date: "2024-11-15", amount: "$14.99", plan: "Premium", status: "Paid", method: "Credit Card" },
                      { id: 2, date: "2024-10-15", amount: "$14.99", plan: "Premium", status: "Paid", method: "Credit Card" },
                      { id: 3, date: "2024-09-15", amount: "$14.99", plan: "Premium", status: "Paid", method: "Credit Card" },
                    ].map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 bg-card/50 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{payment.amount}</p>
                          <p className="text-sm text-muted-foreground">
                            {payment.plan} Plan • {payment.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={payment.status === "Paid" ? "secondary" : "destructive"} className="mb-1">
                            {payment.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground">{payment.method}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    View All Payments
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="firstName"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange("firstName", e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="lastName"
                              value={formData.lastName}
                              onChange={(e) => handleInputChange("lastName", e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <Button onClick={handleSave}>Save Changes</Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground">First Name</Label>
                          <p className="font-medium">{userData.fname}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Last Name</Label>
                          <p className="font-medium">{userData.lname}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Email</Label>
                        <p className="font-medium">{userData.email}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Date of Birth</Label>
                        <p className="font-medium">{new Date(userData.dob).toLocaleDateString()}</p>
                      </div>
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Information
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Account Security */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-card/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">Password</h4>
                      <p className="text-sm text-muted-foreground">Last updated 3 months ago</p>
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-card/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                    <div>
                      <h4 className="font-medium text-foreground">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all data. This action cannot be undone.
                      </p>
                    </div>
                    <Button variant="destructive">Delete Account</Button>
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