import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { 
  Building2, 
  Bed, 
  Ambulance, 
  AlertTriangle,
  LogOut,
  Users,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const HospitalDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hospitalData, setHospitalData] = useState<any>(null);
  const [emergencyCases, setEmergencyCases] = useState<any[]>([]);
  const [bedsAvailable, setBedsAvailable] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchHospitalData();
  }, [user]);

  const fetchHospitalData = async () => {
    try {
      const { data: hospital } = await supabase
        .from("hospitals")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      setHospitalData(hospital);
      setBedsAvailable(hospital?.beds_available?.toString() || "0");

      const { data: cases } = await supabase
        .from("emergency_cases")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(10);

      setEmergencyCases(cases || []);
    } catch (error: any) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBeds = async () => {
    try {
      const bedCount = parseInt(bedsAvailable);
      
      const { error } = await supabase
        .from("hospitals")
        .update({ beds_available: bedCount })
        .eq("user_id", user?.id);

      if (error) throw error;

      // Update local state immediately
      setHospitalData(prev => ({
        ...prev,
        beds_available: bedCount
      }));

      toast({
        title: "Updated successfully",
        description: "Bed availability updated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Building2 className="h-6 w-6 text-success" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Hospital Dashboard</h1>
              <p className="text-sm text-muted-foreground">{hospitalData?.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Available Beds</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Bed className="h-8 w-8" />
                {hospitalData?.beds_available || 0}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Ambulance Service</CardDescription>
              <CardTitle className="text-lg flex items-center gap-2">
                <Ambulance className="h-6 w-6" />
                <Badge variant={hospitalData?.ambulance_available ? "default" : "secondary"}>
                  {hospitalData?.ambulance_available ? "Available" : "Not Available"}
                </Badge>
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Emergency Cases</CardDescription>
              <CardTitle className="text-3xl">{emergencyCases.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Verification Status</CardDescription>
              <Badge variant={hospitalData?.verified ? "default" : "secondary"} className="w-fit">
                {hospitalData?.verified ? "Verified" : "Pending"}
              </Badge>
            </CardHeader>
          </Card>
        </div>

        {/* Hospital Info and Management */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Hospital Profile */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Hospital Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{hospitalData?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{hospitalData?.address}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{hospitalData?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{hospitalData?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Specialty</p>
                <p className="font-medium">{hospitalData?.specialty}</p>
              </div>
            </CardContent>
          </Card>

          {/* Resource Management */}
          <Card>
            <CardHeader>
              <CardTitle>Resource Management</CardTitle>
              <CardDescription>Update your hospital resources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="beds">Available Beds</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="beds"
                    type="number"
                    value={bedsAvailable}
                    onChange={(e) => setBedsAvailable(e.target.value)}
                    placeholder="Number of beds"
                  />
                  <Button onClick={handleUpdateBeds}>Update</Button>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ambulance className="h-5 w-5" />
                    <span className="font-medium">Ambulance</span>
                  </div>
                  <Badge variant={hospitalData?.ambulance_available ? "default" : "secondary"}>
                    {hospitalData?.ambulance_available ? "Available" : "Not Available"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Statistics</CardTitle>
              <CardDescription>Real-time hospital metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-sm">Bed Occupancy</span>
                </div>
                <span className="font-bold">75%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-success" />
                  <span className="text-sm">Active Patients</span>
                </div>
                <span className="font-bold">24</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-emergency" />
                  <span className="text-sm">Emergency Cases</span>
                </div>
                <span className="font-bold">{emergencyCases.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Cases */}
        <Card>
          <CardHeader>
            <CardTitle>Active Emergency Cases</CardTitle>
            <CardDescription>Monitor emergency situations in your area</CardDescription>
          </CardHeader>
          <CardContent>
            {emergencyCases.length > 0 ? (
              <div className="space-y-4">
                {emergencyCases.map((emergencyCase) => (
                  <div
                    key={emergencyCase.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-emergency" />
                        <span className="font-medium">{emergencyCase.emergency_type}</span>
                      </div>
                      <Badge variant="destructive">{emergencyCase.priority}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {emergencyCase.description}
                    </p>
                    {emergencyCase.location && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Location:</strong> {emergencyCase.location}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(emergencyCase.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No active emergency cases</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default HospitalDashboard;
