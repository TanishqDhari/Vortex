import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CarouselSpacing } from "@/components/landing-carousel"
import Link from "next/link"

export default function LandingPage(){
  return (
    <div className="min-h-screen bg-background">

      {/* Navbar */}
      <header className="absolute top-0 left-1/2 w-[90vw] -translate-x-1/2 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/vortex_logo_purple.svg" alt="Vortex Logo" width={250} height={180} />
          </div>
          <div className="flex items-center space-x-3">
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="min-h-[100vh] relative py-2 px-4 flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg.jpg')"}}
      >
        <div className="absolute inset-0 bg-black/75"/>
        <div className="container mx-auto text-center relative z-10 text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
            Your Premium
            <span className="text-primary block mt-2">Cinema Experience</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Stream thousands of movies and TV shows in stunning quality. Personalized recommendations, multiple
            profiles, and seamless viewing across all devices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-2xl px-12 py-6" asChild>
              <Link href="/signup">Get Started  </Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Trending Now</h2>
          <CarouselSpacing/>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Vortex?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience cinema like never before with our cutting-edge features
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-[linear-gradient(-45deg,#192145,#210e17)] p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl text-primary">⚡</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Recommendations</h3>
                <p className="text-muted-foreground">
                  Personalized content suggestions based on your viewing history and preferences
                </p>
              </CardContent>
            </Card>
            <Card className="bg-[linear-gradient(-45deg,#192145,#210e17)] p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl text-primary">👥</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Multiple Profiles</h3>
                <p className="text-muted-foreground">
                  Create up to 5 profiles per account with individual watchlists and preferences
                </p>
              </CardContent>
            </Card>
            <Card className="bg-[linear-gradient(-45deg,#192145,#210e17)] p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl text-primary">📱</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Cross-Platform</h3>
                <p className="text-muted-foreground">
                  Watch seamlessly across all your devices with synchronized progress
                </p>
              </CardContent>
            </Card>
            <Card className="bg-[linear-gradient(-45deg,#192145,#210e17)] p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl text-primary">⭐</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">4K Ultra HD</h3>
                <p className="text-muted-foreground">Crystal clear streaming in 4K resolution with Dolby Atmos sound</p>
              </CardContent>
            </Card>
            <Card className="bg-[linear-gradient(-45deg,#192145,#210e17)] p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl text-primary">🛡️</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Parental Controls</h3>
                <p className="text-muted-foreground">
                  Advanced content filtering and viewing restrictions for family safety
                </p>
              </CardContent>
            </Card>
            <Card className="bg-[linear-gradient(-45deg,#192145,#210e17)] p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl text-primary">⬇️</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Offline Downloads</h3>
                <p className="text-muted-foreground">
                  Download your favorite content to watch offline anywhere, anytime
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Watching?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join millions of viewers who trust Vortex for their entertainment needs
          </p>
          <Button size="lg" className="text-2xl px-12 py-6" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-12 bg-white/8">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/vortex_logo_purple.svg" alt="Vortex Logo" width={150} height={150} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="hover:text-foreground transition-colors">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/feedback" className="hover:text-foreground transition-colors">
                    Feedback
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-foreground transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Vortex Cinema. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

