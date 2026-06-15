import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Phone, 
  Heart, 
  Users, 
  MapPin, 
  Shield, 
  Zap, 
  MessageCircle, 
  Stethoscope,
  AlertTriangle,
  Activity,
  Clock,
  Globe,
  Menu
} from "lucide-react";
import heroImage from "@/assets/rural-telemedicine-hero.jpg";
import { EmergencyResponse } from "@/components/EmergencyResponse";
import { AIConsultation } from "@/components/AIConsultation";
import { HealthWorkerDashboard } from "@/components/HealthWorkerDashboard";
import { DoctorNetwork } from "@/components/DoctorNetwork";
import { IVRSimulator } from "@/components/IVRSimulator";
import { USSDMenu } from "@/components/USSDMenu";
import { ExternalDBSetup } from "@/components/ExternalDBSetup";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");

  const renderSection = () => {
    switch (activeSection) {
      case "emergency":
        return <EmergencyResponse />;
      case "consultation":
        return <AIConsultation />;
      case "health-workers":
        return <HealthWorkerDashboard />;
      case "doctors":
        return <DoctorNetwork />;
      case "ivr":
        return <IVRSimulator />;
      case "ussd":
        return <USSDMenu />;
      case "backup":
        return <ExternalDBSetup />;
      default:
        return <HomePage />;
    }
  };

  const HomePage = () => (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 gradient-hero opacity-95" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center text-primary-foreground animate-fade-in">
          <Badge className="mb-6 bg-secondary/90 backdrop-blur-sm text-secondary-foreground px-8 py-3 text-lg rounded-full shadow-2xl hover:scale-105 transition-transform">
            🎯 SDG 3: Good Health & Well-being
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
            Village Health
            <br />
            <span className="bg-gradient-to-r from-secondary-light via-accent to-secondary bg-clip-text text-transparent animate-pulse">
              Whisperer
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-95">
            AI-Powered Rural Telemedicine Platform providing 24/7 healthcare access 
            through voice technology, connecting villages to qualified doctors
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <Button 
              size="lg" 
              variant="emergency"
              className="text-lg px-10 py-4 text-base"
              onClick={() => setActiveSection("emergency")}
            >
              <AlertTriangle className="mr-2 h-6 w-6" />
              Emergency Response
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-10 py-4 text-base border-2 border-white/80 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-primary"
              onClick={() => setActiveSection("ivr")}
            >
              <Phone className="mr-2 h-6 w-6" />
              IVR System (*108)
            </Button>
          </div>
          
          <div className="flex justify-center items-center gap-8 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              24/7 Available
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Multi-language Support
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Voice & Text Access
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary px-6 py-2 text-sm rounded-full">
              ✨ Our Features
            </Badge>
            <h2 className="text-5xl font-extrabold text-foreground mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Comprehensive Rural Healthcare Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Bridging the healthcare gap in rural communities through innovative AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-primary/20 hover:border-primary/50 gradient-card overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-bl-full -mr-16 -mt-16"></div>
              <CardHeader className="relative">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-emergency to-emergency/80 text-emergency-foreground w-fit mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">Emergency First Response</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Immediate AI-guided first aid with automatic ambulance and hospital alerts
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-primary/20 hover:border-primary/50 gradient-card overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-bl-full -mr-16 -mt-16"></div>
              <CardHeader className="relative">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground w-fit mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <MessageCircle className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">AI Voice Doctor</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Multi-dialect voice consultation with symptom triage and treatment recommendations
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-primary/20 hover:border-primary/50 gradient-card overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-bl-full -mr-16 -mt-16"></div>
              <CardHeader className="relative">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground w-fit mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">Health Worker Network</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Empowering ASHA/ANM workers with digital tools and training modules
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-primary/20 hover:border-primary/50 gradient-card overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-bl-full -mr-16 -mt-16"></div>
              <CardHeader className="relative">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground w-fit mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <Stethoscope className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">Doctor Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Verified doctor network with specialty matching and availability tracking
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-primary/20 hover:border-primary/50 gradient-card overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-bl-full -mr-16 -mt-16"></div>
              <CardHeader className="relative">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-success to-success/80 text-success-foreground w-fit mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <Heart className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">Preventive Care</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Community health alerts, vaccination reminders, and outbreak detection
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-primary/20 hover:border-primary/50 gradient-card overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-bl-full -mr-16 -mt-16"></div>
              <CardHeader className="relative">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground w-fit mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">Offline-First Design</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Works without internet, syncs when connection is available
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Multi-Channel Access */}
      <section className="py-24 bg-gradient-to-b from-muted/50 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,hsl(var(--secondary)/0.1),transparent_50%)]"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20 animate-fade-in">
            <Badge className="mb-4 bg-secondary/10 text-secondary px-6 py-2 text-sm rounded-full">
              📱 Access Methods
            </Badge>
            <h2 className="text-5xl font-extrabold text-foreground mb-6 bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent">
              Multiple Ways to Access Care
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Designed for all technology levels - from basic phones to smartphones
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Card className="text-center border-2 border-primary/30 hover:border-primary hover:shadow-2xl transition-all duration-300 group gradient-card overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="relative">
                <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-primary to-primary-dark mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
                  <Phone className="h-12 w-12 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl font-bold mb-3">IVR Voice Calls</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Simple dial-in number for voice consultation in local languages
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setActiveSection("consultation")}
                >
                  Try Voice Consultation
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-secondary/30 hover:border-secondary hover:shadow-2xl transition-all duration-300 group gradient-card overflow-hidden relative md:scale-105">
              <div className="absolute top-0 right-0 bg-gradient-to-bl from-secondary/20 to-transparent w-full h-full"></div>
              <CardHeader className="relative">
                <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-secondary to-secondary-light mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
                  <Activity className="h-12 w-12 text-secondary-foreground" />
                </div>
                <CardTitle className="text-2xl font-bold mb-3">USSD Menu System</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Step-by-step menu navigation for keypad phones without internet
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <Button 
                  className="w-full" 
                  variant="secondary"
                  onClick={() => setActiveSection("ussd")}
                >
                  Access USSD (*108#)
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-success/30 hover:border-success hover:shadow-2xl transition-all duration-300 group gradient-card overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="relative">
                <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-success to-success/80 mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
                  <MapPin className="h-12 w-12 text-success-foreground" />
                </div>
                <CardTitle className="text-2xl font-bold mb-3">Mobile App & Web</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Full-featured app with maps, video calls, and health records
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <Button 
                  className="w-full"
                  variant="success"
                  onClick={() => setActiveSection("doctors")}
                >
                  Open Web Platform
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-24 gradient-hero text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <Badge className="mb-6 bg-white/20 backdrop-blur-sm text-white px-8 py-3 text-lg rounded-full shadow-xl">
            📊 Our Impact
          </Badge>
          <h2 className="text-5xl font-extrabold mb-16 animate-fade-in">Making Real Impact</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { number: "24/7", label: "Emergency Response", icon: "⚡" },
              { number: "15%", label: "Reduction in Maternal Deaths", icon: "💚" },
              { number: "100+", label: "Villages Connected", icon: "🏘️" },
              { number: "50+", label: "Languages Supported", icon: "🗣️" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-5xl mb-3 animate-float" style={{ animationDelay: `${index * 0.2}s` }}>{stat.icon}</div>
                <div className="text-5xl md:text-6xl font-extrabold mb-3 group-hover:scale-110 transition-transform">{stat.number}</div>
                <div className="text-lg opacity-95 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <div>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-primary/20 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg group-hover:scale-110 transition-transform">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Village Health Whisperer</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Button 
                variant={activeSection === "home" ? "default" : "ghost"}
                onClick={() => setActiveSection("home")}
              >
                Home
              </Button>
              <Button 
                variant={activeSection === "emergency" ? "default" : "ghost"}
                onClick={() => setActiveSection("emergency")}
              >
                Emergency
              </Button>
              <Button 
                variant={activeSection === "ivr" ? "default" : "ghost"}
                onClick={() => setActiveSection("ivr")}
              >
                IVR System
              </Button>
              <Button 
                variant={activeSection === "ussd" ? "default" : "ghost"}
                onClick={() => setActiveSection("ussd")}
              >
                USSD Menu
              </Button>
              <Button 
                variant={activeSection === "consultation" ? "default" : "ghost"}
                onClick={() => setActiveSection("consultation")}
              >
                AI Consultation
              </Button>
              <Button 
                variant={activeSection === "health-workers" ? "default" : "ghost"}
                onClick={() => setActiveSection("health-workers")}
              >
                Health Workers
              </Button>
              <Button 
                variant={activeSection === "doctors" ? "default" : "ghost"}
                onClick={() => setActiveSection("doctors")}
              >
                Doctor Network
              </Button>
              <Button 
                variant={activeSection === "backup" ? "default" : "ghost"}
                onClick={() => setActiveSection("backup")}
              >
                Database Backup
              </Button>
              <Button 
                variant="default"
                asChild
              >
                <a href="/auth">Login / Sign Up</a>
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="flex md:hidden items-center gap-3">
              <Button 
                variant="default"
                size="sm"
                asChild
              >
                <a href="/auth">Login</a>
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col gap-4 mt-8">
                    <Button 
                      variant={activeSection === "home" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection("home")}
                    >
                      Home
                    </Button>
                    <Button 
                      variant={activeSection === "emergency" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection("emergency")}
                    >
                      Emergency
                    </Button>
                    <Button 
                      variant={activeSection === "ivr" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection("ivr")}
                    >
                      IVR System
                    </Button>
                    <Button 
                      variant={activeSection === "ussd" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection("ussd")}
                    >
                      USSD Menu
                    </Button>
                    <Button 
                      variant={activeSection === "consultation" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection("consultation")}
                    >
                      AI Consultation
                    </Button>
                    <Button 
                      variant={activeSection === "health-workers" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection("health-workers")}
                    >
                      Health Workers
                    </Button>
                    <Button 
                      variant={activeSection === "doctors" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection("doctors")}
                    >
                      Doctor Network
                    </Button>
                    <Button 
                      variant={activeSection === "backup" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection("backup")}
                    >
                      Database Backup
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {renderSection()}
      </main>
    </div>
  );
};

export default Index;