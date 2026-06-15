import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { 
  Stethoscope, 
  Users, 
  AlertTriangle, 
  Activity,
  LogOut,
  CheckCircle,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DoctorDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [doctorData, setDoctorData] = useState<any>(null);
  const [emergencyCases, setEmergencyCases] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchDoctorData();
  }, [user]);

  const fetchDoctorData = async () => {
    try {
      const { data: doctor } = await supabase
        .from("doctors")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      setDoctorData(doctor);
      setAvailable(doctor?.available || false);

      if (doctor) {
        // Fetch consultations assigned to this doctor
        const { data: consultationsData } = await supabase
          .from("consultations")
          .select(`
            *,
            patients (
              name,
              age,
              gender,
              phone,
              village,
              patient_id
            )
          `)
          .eq("doctor_id", doctor.id)
          .order("created_at", { ascending: false });

        setConsultations(consultationsData || []);
      }

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

  const handleAvailabilityToggle = async (checked: boolean) => {
    try {
      const { error } = await supabase
        .from("doctors")
        .update({ available: checked })
        .eq("user_id", user?.id);

      if (error) throw error;

      setAvailable(checked);
      toast({
        title: checked ? "You are now available" : "You are now unavailable",
        description: checked ? "Patients can now consult you" : "Patients cannot consult you",
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
            <div className="p-2 rounded-lg bg-secondary/10">
              <Stethoscope className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Doctor Dashboard</h1>
              <p className="text-sm text-muted-foreground">Dr. {doctorData?.name}</p>
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
              <CardDescription>Active Emergency Cases</CardDescription>
              <CardTitle className="text-3xl">{emergencyCases.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                <AlertTriangle className="h-3 w-3 inline mr-1" />
                Requires immediate attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Availability Status</CardDescription>
              <div className="flex items-center gap-3 mt-2">
                <Switch checked={available} onCheckedChange={handleAvailabilityToggle} />
                <Badge variant={available ? "default" : "secondary"}>
                  {available ? "Available" : "Unavailable"}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Specialization</CardDescription>
              <CardTitle className="text-lg">{doctorData?.specialization || "General"}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Hospital</CardDescription>
              <CardTitle className="text-lg">{doctorData?.hospital || "N/A"}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Consultations Assigned to Doctor */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Consultations</CardTitle>
            <CardDescription>Patients waiting for your consultation</CardDescription>
          </CardHeader>
          <CardContent>
            {consultations.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {consultations.map((consultation: any) => (
                  <div
                    key={consultation.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-lg">{consultation.patients?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Patient ID: {consultation.patients?.patient_id}
                        </p>
                      </div>
                      <Badge variant={consultation.status === "completed" ? "default" : "secondary"}>
                        {consultation.status}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Department:</strong> {consultation.department}
                      </div>
                      <div>
                        <strong>Symptoms:</strong>
                        <p className="text-muted-foreground mt-1">{consultation.symptoms}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t">
                        <div>
                          <span className="text-muted-foreground">Age:</span> {consultation.patients?.age}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Gender:</span> {consultation.patients?.gender}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Phone:</span> {consultation.patients?.phone}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Village:</span> {consultation.patients?.village}
                        </div>
                      </div>
                      {consultation.diagnosis && (
                        <div className="mt-2 pt-2 border-t">
                          <strong>Diagnosis:</strong>
                          <p className="text-muted-foreground mt-1">{consultation.diagnosis}</p>
                        </div>
                      )}
                      {consultation.treatment && (
                        <div>
                          <strong>Treatment:</strong>
                          <p className="text-muted-foreground mt-1">{consultation.treatment}</p>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      Requested: {new Date(consultation.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No consultations assigned yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile and Emergency Cases */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Doctor Profile */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">Dr. {doctorData?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Specialization</p>
                <p className="font-medium">{doctorData?.specialization}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hospital</p>
                <p className="font-medium">{doctorData?.hospital}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{doctorData?.phone}</p>
              </div>
              <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-2">Status</p>
                <div className="flex items-center gap-2">
                  {available ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium text-success">Available for consultations</span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Not available</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Cases */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Active Emergency Cases</CardTitle>
              <CardDescription>Cases requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              {emergencyCases.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
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
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto py-4" onClick={() => navigate("/")}>
                <div className="text-center w-full">
                  <Users className="h-6 w-6 mx-auto mb-2" />
                  <p className="font-medium">View All Patients</p>
                </div>
              </Button>
              <Button variant="outline" className="h-auto py-4" onClick={() => navigate("/")}>
                <div className="text-center w-full">
                  <Activity className="h-6 w-6 mx-auto mb-2" />
                  <p className="font-medium">Consultation History</p>
                </div>
              </Button>
              <Button variant="outline" className="h-auto py-4" onClick={() => navigate("/")}>
                <div className="text-center w-full">
                  <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
                  <p className="font-medium">Emergency Dashboard</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DoctorDashboard;
