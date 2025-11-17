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
import { Edit, Camera, Calendar, Mail, User, Crown, History } from "lucide-react"
import { useRouter } from "next/navigation"

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

type SubscriptionData = {
  subscription_id: number;
  plan_name: string;
  price: number;
  billing_cycle: 30 | 365;
  start_date: string;
  end_date: string;
  status: 'Active' | 'Cancelled' | 'Expired';
} 


type PaymentData = {
  payment_id: number;
  payment_amount: string;
  payment_mode: string;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [watchHistory, setWatchHistory] = useState<MediaItem[]>([])
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)
  const [payments, setPayments] = useState<PaymentData[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
  })
  const [preferences, setPreferences] = useState<{genre_id: number, genre_name: string}[]>([])
  
  
  useEffect(() => {
    async function fetchPreferences() {
      const storedUserId = localStorage.getItem("userId");
      if (!storedUserId) return;
      const userId = parseInt(storedUserId, 10);
      try {
        const res = await fetch(`/api/prefers/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setPreferences(data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    
    fetchPreferences();
  }, []);
  
  useEffect(() => {
    async function fetchProfileData() {
      const storedUserId = localStorage.getItem("userId");
      if (!storedUserId) return window.location.href = "/login";
      
      const userId = parseInt(storedUserId, 10);
      if (isNaN(userId) || userId <= 0) return window.location.href = "/login";
      
      try {
        const [userRes, historyRes, subRes, paymentRes] = await Promise.all([
          fetch(`/api/user/${userId}`),
          fetch(`/api/user/${userId}/watch-history`),
          fetch(`/api/subscription?user_id=${userId}`),
          fetch(`/api/payment?user_id=${userId}`),
        ]);
        
        // User Data
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
        
        // Watch History
        if (historyRes.ok) {
          const history = await historyRes.json();
          setWatchHistory(history);
        }
        
        // Subscription
        if (subRes.ok) {
          const subData = await subRes.json();
          setSubscriptionData(subData);
        }
        
        // Payment History
        if (paymentRes.ok) {
          const paymentData = await paymentRes.json();
          setPayments(paymentData || []);
        }
        
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfileData();
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
  
  const handleUpdatePreferences = async (selectedGenreIds: number[]) => {
    if (!userData) return;
    try {
      const res = await fetch(`/api/prefers/${userData.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ genres: selectedGenreIds }),
      });
      if (res.ok) {
        setPreferences(prev => prev.map(g => selectedGenreIds.includes(g.genre_id) ? g : g));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 ml-16 flex items-center justify-center">
        <div className="text-muted-foreground">Loading profile...</div>
      </div>
    </div>
  )

  if (!userData) return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 ml-16 flex items-center justify-center">
        <div className="text-muted-foreground">User not found</div>
      </div>
    </div>
  )

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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src="/placeholder.svg" alt="Profile" />
                      <AvatarFallback className="text-2xl">{userData.fname?.[0]}{userData.lname?.[0]}</AvatarFallback>
                    </Avatar>
                    <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0" variant="secondary">
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="text-2xl font-bold text-foreground">{userData.fname} {userData.lname}</h2>
                      <Badge className="bg-primary/20 text-primary border-primary/30"><Crown className="w-3 h-3 mr-1" />Premium</Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">{userData.email}</p>
                  </div>
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-primary">{watchHistory.length}</div><p className="text-sm text-muted-foreground">Items Watched</p></CardContent></Card>
                <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-primary">{watchHistory.reduce((total, item) => total + (item.duration || 0), 0)}</div><p className="text-sm text-muted-foreground">Minutes Watched</p></CardContent></Card>
                <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-primary">{watchHistory.length > 0 ? Math.round(watchHistory.reduce((sum, item) => sum + (item.rating || 0), 0) / watchHistory.length * 10) / 10 : 0}</div><p className="text-sm text-muted-foreground">Avg Rating</p></CardContent></Card>
              </div>

              {/* Preferences */}
              <Card>
                <CardHeader><CardTitle>Your Preferences</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {watchHistory.length > 0 ? Array.from(new Set(watchHistory.flatMap(item => item.genres || []))).slice(0, 5).map((pref) => (
                      <Badge key={pref} variant="secondary">{pref}</Badge>
                    )) : <p className="text-muted-foreground">No preferences yet. Start watching to build them!</p>}
                  </div>
                  <Button variant="outline" className="mt-4 bg-transparent">Update Preferences</Button>
                </CardContent>
              </Card>

              {/* Continue Watching */}
              <Card>
                <CardHeader><CardTitle>Continue Watching</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {watchHistory.slice(0, 6).map((item) => (
                      <MediaCard key={item.media_id} id={item.media_id} title={item.title || "Untitled"} year={item.release_year || 0} rating={item.rating || 0} image={item.image || "/placeholder.svg"} genre={item.genres || []} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader><CardTitle className="flex items-center"><History className="w-5 h-5 mr-2" />Watch History</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {watchHistory.map((item) => (
                      <div key={item.media_id} className="flex items-center space-x-4 p-4 bg-card/50 rounded-lg hover:bg-card/80 transition-colors">
                        <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-16 h-24 object-cover rounded" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">Year: {item.release_year}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {item.genres && item.genres.length > 0 && <Badge variant="outline">{item.genres[0]}</Badge>}
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
              <Card>
                <CardHeader><CardTitle className="flex items-center"><Crown className="w-5 h-5 mr-2" />Current Subscription</CardTitle></CardHeader>
                <CardContent>
                  {subscriptionData ? (
                    <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{subscriptionData.plan_name} Plan</h3>
                        <p className="text-muted-foreground">${subscriptionData.price} / {subscriptionData.billing_cycle === 30 ? 'month' : 'year'}</p>
                        <p className="text-sm text-muted-foreground">Next billing: {new Date(subscriptionData.end_date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-2">{subscriptionData.status}</Badge>
                        <div className="space-x-2">
                          <Button variant="outline" onClick={() => window.location.href = "/subscription"}>Change Plan</Button>
                          <Button variant="outline">Cancel</Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-card/50 rounded-lg">
                      <p className="text-muted-foreground">You do not have an active subscription.</p>
                      <Button className="mt-3" onClick={() => window.location.href = "/subscription"}>View Plans</Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment History */}
              <Card>
                <CardHeader><CardTitle className="flex items-center"><Badge className="mr-2">💳</Badge>Payment History</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {payments.length > 0 ? payments.map((payment) => (
                      <div key={payment.payment_id} className="flex items-center justify-between p-4 bg-card/50 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">${payment.payment_amount}</p>
                          <p className="text-sm text-muted-foreground"> {payment.payment_mode} • {subscriptionData ? new Date(subscriptionData.start_date).toLocaleDateString() : "N/A"}</p>

                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="mb-1">Paid</Badge>
                        </div>
                      </div>
                    )) : (
                      <p className="text-muted-foreground">No payment history found.</p>
                    )}
                  </div>
                  <Button variant="outline" className="w-full mt-4 bg-transparent">View All Payments</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input id="firstName" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} className="pl-10" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input id="lastName" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} className="pl-10" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} className="pl-10" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={(e) => handleInputChange("dateOfBirth", e.target.value)} className="pl-10" />
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <Button onClick={handleSave}>Save Changes</Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
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
                        <Edit className="w-4 h-4 mr-2" /> Edit Information
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Account Security</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-card/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive/20">
                <CardHeader><CardTitle className="text-destructive">Danger Zone</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                    <div>
                      <h4 className="font-medium text-foreground">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and all data. This action cannot be undone.</p>
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
