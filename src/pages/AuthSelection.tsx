import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Stethoscope, 
  Heart, 
  Users, 
  Building2, 
  UserCircle 
} from "lucide-react";

const AuthSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Welcome to Village Health Whisperer
          </h1>
          <p className="text-xl text-muted-foreground">
            Select your role to continue
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card 
            className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-primary/20 hover:border-primary/50 cursor-pointer gradient-card overflow-hidden"
            onClick={() => navigate("/auth/patient")}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-bl-full -mr-16 -mt-16"></div>
            <CardHeader className="relative">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground w-fit mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Heart className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                Patient
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed mb-4">
                Access healthcare services and consultations
              </CardDescription>
              <Button className="w-full" variant="outline">
                Continue as Patient
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-primary/20 hover:border-primary/50 cursor-pointer gradient-card overflow-hidden"
            onClick={() => navigate("/auth/doctor")}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-bl-full -mr-16 -mt-16"></div>
            <CardHeader className="relative">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground w-fit mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Stethoscope className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                Doctor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed mb-4">
                Provide medical consultations and support
              </CardDescription>
              <Button className="w-full" variant="outline">
                Continue as Doctor
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-primary/20 hover:border-primary/50 cursor-pointer gradient-card overflow-hidden"
            onClick={() => navigate("/auth/hospital")}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-bl-full -mr-16 -mt-16"></div>
            <CardHeader className="relative">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-success to-success/80 text-success-foreground w-fit mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Building2 className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                Hospital
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed mb-4">
                Manage hospital services and resources
              </CardDescription>
              <Button className="w-full" variant="outline">
                Continue as Hospital
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-primary/20 hover:border-primary/50 cursor-pointer gradient-card overflow-hidden"
            onClick={() => navigate("/auth/asha-worker")}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-bl-full -mr-16 -mt-16"></div>
            <CardHeader className="relative">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-warning to-warning/80 text-warning-foreground w-fit mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                ASHA Worker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed mb-4">
                Community health worker access
              </CardDescription>
              <Button className="w-full" variant="outline">
                Continue as ASHA Worker
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-primary/20 hover:border-primary/50 cursor-pointer gradient-card overflow-hidden"
            onClick={() => navigate("/auth/relative")}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-bl-full -mr-16 -mt-16"></div>
            <CardHeader className="relative">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-accent to-accent/80 text-accent-foreground w-fit mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <UserCircle className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                Relative
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed mb-4">
                Monitor and support patient care
              </CardDescription>
              <Button className="w-full" variant="outline">
                Continue as Relative
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button variant="ghost" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthSelection;