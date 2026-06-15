import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Building2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const HospitalAuth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bedsAvailable, setBedsAvailable] = useState("");
  const [ambulanceAvailable, setAmbulanceAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, "hospital", {
          name,
          address,
          phone,
          specialty,
          beds_available: parseInt(bedsAvailable) || 0,
          ambulance_available: ambulanceAvailable
        });

        if (error) throw error;
        
        toast({
          title: "Account created!",
          description: "Welcome to Village Health Whisperer",
        });
        navigate("/dashboard/hospital");
      } else {
        const { error } = await signIn(email, password);
        
        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in",
        });
        navigate("/dashboard/hospital");
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
      <Card className="w-full max-w-md gradient-card border-2 border-success/20">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/auth")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-success to-success/80 text-success-foreground shadow-lg">
              <Building2 className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl">{isSignUp ? "Hospital Sign Up" : "Hospital Login"}</CardTitle>
          <CardDescription>
            {isSignUp ? "Register your hospital" : "Access your hospital portal"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <Label htmlFor="name">Hospital Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter hospital name"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Full address"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Contact Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Hospital contact number"
                  />
                </div>
                <div>
                  <Label htmlFor="specialty">Specialty</Label>
                  <Input
                    id="specialty"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="e.g., Multi-specialty, Maternity"
                  />
                </div>
                <div>
                  <Label htmlFor="beds">Available Beds</Label>
                  <Input
                    id="beds"
                    type="number"
                    value={bedsAvailable}
                    onChange={(e) => setBedsAvailable(e.target.value)}
                    placeholder="Number of available beds"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ambulance"
                    checked={ambulanceAvailable}
                    onCheckedChange={(checked) => setAmbulanceAvailable(checked as boolean)}
                  />
                  <Label htmlFor="ambulance">Ambulance Service Available</Label>
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
                placeholder="Hospital email address"
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
                placeholder="Enter password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : (isSignUp ? "Sign Up" : "Login")}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            {isSignUp ? (
              <>
                Already registered?{" "}
                <Button variant="link" className="p-0" onClick={() => setIsSignUp(false)}>
                  Login
                </Button>
              </>
            ) : (
              <>
                Not registered yet?{" "}
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

export default HospitalAuth;