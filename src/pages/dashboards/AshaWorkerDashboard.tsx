import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  MapPin, 
  AlertTriangle, 
  Activity,
  LogOut,
  HeartPulse,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AshaWorkerDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workerData, setWorkerData] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [emergencyCases, setEmergencyCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchWorkerData();
  }, [user]);

  const fetchWorkerData = async () => {
    try {
      const { data: worker } = await supabase
        .from("health_workers")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      setWorkerData(worker);

      if (worker?.village) {
        const { data: villagePatients } = await supabase
          .from("patients")
          .select("*")
          .eq("village", worker.village)
          .limit(10);

        setPatients(villagePatients || []);
      }

      const { data: cases } = await supabase
        .from("emergency_cases")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(5);

      setEmergencyCases(cases || []);
    } catch (error: any) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
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
            <div className="p-2 rounded-lg bg-warning/10">
              <Users className="h-6 w-6 text-warning" />
            </div>
            <div>
              <h1 className="text-xl font-bold">ASHA Worker Dashboard</h1>
              <p className="text-sm text-muted-foreground">{workerData?.name}</p>
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
              <CardDescription>Village Patients</CardDescription>
              <CardTitle className="text-3xl">{patients.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                <Users className="h-3 w-3 inline mr-1" />
                In your service area
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Emergencies</CardDescription>
              <CardTitle className="text-3xl">{emergencyCases.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                <AlertTriangle className="h-3 w-3 inline mr-1" />
                Requires attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Service Area</CardDescription>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {workerData?.village}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Verification Status</CardDescription>
              <Badge variant={workerData?.verified ? "default" : "secondary"} className="w-fit">
                {workerData?.verified ? "Verified" : "Pending"}
              </Badge>
            </CardHeader>
          </Card>
        </div>

        {/* Worker Profile and Patients */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Worker Profile */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{workerData?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium">{workerData?.role}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Village/Area</p>
                <p className="font-medium">{workerData?.village}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{workerData?.phone}</p>
              </div>
              <div className="pt-4 border-t">
                <Button className="w-full" onClick={() => navigate("/")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Create Health Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Village Patients */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Patients in Your Area</CardTitle>
              <CardDescription>Residents of {workerData?.village}</CardDescription>
            </CardHeader>
            <CardContent>
              {patients.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {patients.map((patient) => (
                    <div
                      key={patient.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {patient.age} years • {patient.gender}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            📱 {patient.phone}
                          </p>
                        </div>
                        <Badge variant="outline">{patient.village}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No patients registered yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Emergency Alerts */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Emergency Alerts</CardTitle>
            <CardDescription>Monitor emergency cases in your area</CardDescription>
          </CardHeader>
          <CardContent>
            {emergencyCases.length > 0 ? (
              <div className="space-y-4">
                {emergencyCases.map((emergencyCase) => (
                  <div
                    key={emergencyCase.id}
                    className="p-4 border border-emergency/30 rounded-lg bg-emergency/5"
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
                        <MapPin className="h-3 w-3 inline mr-1" />
                        {emergencyCase.location}
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
                <p>No active emergencies</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Community Health Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Community Health Activities</CardTitle>
            <CardDescription>Important tasks and reminders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <HeartPulse className="h-4 w-4" />
                  Health Checkup Camps
                </h4>
                <p className="text-sm text-muted-foreground">
                  Organize monthly health checkup camps for your village
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Vaccination Drives
                </h4>
                <p className="text-sm text-muted-foreground">
                  Track and promote vaccination programs in your area
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Health Education
                </h4>
                <p className="text-sm text-muted-foreground">
                  Conduct awareness sessions on hygiene and nutrition
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Patient Follow-ups
                </h4>
                <p className="text-sm text-muted-foreground">
                  Regular follow-ups with chronic disease patients
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AshaWorkerDashboard;
