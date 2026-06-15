import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { 
  Heart, 
  Calendar, 
  Phone, 
  AlertTriangle, 
  Activity,
  FileText,
  LogOut,
  Stethoscope
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EmergencyResponse } from "@/components/EmergencyResponse";
import { ConsultationForm } from "@/components/ConsultationForm";
import { IVRSimulator } from "@/components/IVRSimulator";
import { PatientApprovalRequests } from "@/components/PatientApprovalRequests";

const PatientDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patientData, setPatientData] = useState<any>(null);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showConsultation, setShowConsultation] = useState(false);
  const [showIVR, setShowIVR] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchPatientData();
  }, [user]);

  const fetchPatientData = async () => {
    try {
      const { data: patient } = await supabase
        .from("patients")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      setPatientData(patient);

      if (patient) {
        const { data: consultationsData } = await supabase
          .from("consultations")
          .select("*")
          .eq("patient_id", patient.id)
          .order("created_at", { ascending: false })
          .limit(5);

        setConsultations(consultationsData || []);
      }
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
            <div className="p-2 rounded-lg bg-primary/10">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Patient Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome, {patientData?.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowEmergency(true)}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-emergency/10">
                  <AlertTriangle className="h-6 w-6 text-emergency" />
                </div>
                <div>
                  <CardTitle className="text-lg">Emergency</CardTitle>
                  <CardDescription>Get immediate help</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowConsultation(true)}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">New Consultation</CardTitle>
                  <CardDescription>Book AI consultation</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowIVR(true)}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-secondary/10">
                  <Phone className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-lg">IVR System</CardTitle>
                  <CardDescription>Call *108</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Patient Approval Requests */}
        <PatientApprovalRequests />

        {/* Patient Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Patient ID</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm font-bold text-primary">{patientData?.patient_id}</p>
                  <Badge variant="secondary" className="text-xs">Share with relatives</Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{patientData?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium">{patientData?.age} years</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium capitalize">{patientData?.gender}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Village</p>
                <p className="font-medium">{patientData?.village}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{patientData?.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Consultations */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Consultations</CardTitle>
              <CardDescription>Your consultation history</CardDescription>
            </CardHeader>
            <CardContent>
              {consultations.length > 0 ? (
                <div className="space-y-4">
                  {consultations.map((consultation) => (
                    <div
                      key={consultation.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-primary" />
                          <span className="font-medium capitalize">
                            {consultation.consultation_type}
                          </span>
                        </div>
                        <Badge variant={consultation.status === "completed" ? "default" : "secondary"}>
                          {consultation.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Symptoms:</strong> {consultation.symptoms}
                      </p>
                      {consultation.diagnosis && (
                        <p className="text-sm text-muted-foreground">
                          <strong>Diagnosis:</strong> {consultation.diagnosis}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(consultation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No consultations yet</p>
                  <Button className="mt-4" onClick={() => navigate("/")}>
                    Start Consultation
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Health Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Health Tips</CardTitle>
            <CardDescription>Stay healthy with these tips</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">💧 Stay Hydrated</h4>
                <p className="text-sm text-muted-foreground">
                  Drink at least 8 glasses of water daily for optimal health
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">🏃 Exercise Regularly</h4>
                <p className="text-sm text-muted-foreground">
                  30 minutes of daily exercise keeps you fit and healthy
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">🍎 Eat Healthy</h4>
                <p className="text-sm text-muted-foreground">
                  Include fruits and vegetables in every meal
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">😴 Get Enough Sleep</h4>
                <p className="text-sm text-muted-foreground">
                  7-8 hours of quality sleep is essential for good health
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Emergency Dialog */}
      <Dialog open={showEmergency} onOpenChange={setShowEmergency}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-auto p-0">
          <EmergencyResponse />
        </DialogContent>
      </Dialog>

      {/* Consultation Dialog */}
      <Dialog open={showConsultation} onOpenChange={setShowConsultation}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-auto">
          <ConsultationForm onSuccess={() => {
            setShowConsultation(false);
            fetchPatientData();
          }} />
        </DialogContent>
      </Dialog>

      {/* IVR Dialog */}
      <Dialog open={showIVR} onOpenChange={setShowIVR}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-auto p-0">
          <IVRSimulator />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientDashboard;
