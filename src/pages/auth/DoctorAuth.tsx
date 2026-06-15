import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Stethoscope, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DoctorAuth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [phone, setPhone] = useState("");
  const [hospital, setHospital] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, "doctor", {
          name,
          specialization,
          phone,
          hospital
        });

        if (error) throw error;
        
        toast({
          title: "Account created!",
          description: "Welcome to Village Health Whisperer",
        });
        navigate("/dashboard/doctor");
      } else {
        const { error } = await signIn(email, password);
        
        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in",
        });
        navigate("/dashboard/doctor");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md gradient-card border-2 border-secondary/20">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/auth")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-lg">
              <Stethoscope className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl">{isSignUp ? "Doctor Sign Up" : "Doctor Login"}</CardTitle>
          <CardDescription>
            {isSignUp ? "Create your doctor account" : "Access your consultation portal"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Dr. Full Name"
                  />
                </div>
                <div>
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g., General Medicine, Pediatrics"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="hospital">Hospital/Clinic</Label>
                  <Input
                    id="hospital"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    placeholder="Enter hospital or clinic name"
                  />
                </div>
              </>
            )}
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : (isSignUp ? "Sign Up" : "Login")}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <Button variant="link" className="p-0" onClick={() => setIsSignUp(false)}>
                  Login
                </Button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <Button variant="link" className="p-0" onClick={() => setIsSignUp(true)}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorAuth;