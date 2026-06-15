import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { 
  UserCircle, 
  Heart, 
  Phone, 
  AlertTriangle,
  LogOut,
  Activity,
  FileText,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RelativeDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [relativeData, setRelativeData] = useState<any>(null);
  const [patientData, setPatientData] = useState<any>(null);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [patientIdInput, setPatientIdInput] = useState("");
  const [linkingPatient, setLinkingPatient] = useState(false);
  const [linkRequests, setLinkRequests] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchRelativeData();
  }, [user]);

  const fetchRelativeData = async () => {
    try {
      const { data: relative } = await supabase
        .from("relatives")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      setRelativeData(relative);

      // Fetch link requests
      if (relative) {
        const { data: requests } = await supabase
          .from("relative_link_requests")
          .select("*, patients(name, patient_id)")
          .eq("relative_id", relative.id)
          .order("requested_at", { ascending: false });
        
        setLinkRequests(requests || []);
      }

      if (relative?.patient_id) {
        const { data: patient } = await supabase
          .from("patients")
          .select("*")
          .eq("id", relative.patient_id)
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
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkPatient = async () => {
    if (!patientIdInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a patient ID",
        variant: "destructive",
      });
      return;
    }

    setLinkingPatient(true);
    try {
      // Find patient by patient_id (medical staff can search)
      const { data: patient, error: patientError } = await supabase
        .from("patients")
        .select("id, name")
        .eq("patient_id", patientIdInput.trim())
        .maybeSingle();

      if (patientError) {
        // Patient not found or no permission
        toast({
          title: "Patient not found",
          description: "No patient found with this ID. Please verify the ID and try again.",
          variant: "destructive",
        });
        return;
      }

      if (!patient) {
        toast({
          title: "Patient not found",
          description: "No patient found with this ID. Please check and try again.",
          variant: "destructive",
        });
        return;
      }

      // Create link request instead of direct linking
      const { error: requestError } = await supabase
        .from("relative_link_requests")
        .insert({
          relative_id: relativeData.id,
          patient_id: patient.id,
          status: "pending"
        });

      if (requestError) {
        if (requestError.code === "23505") {
          toast({
            title: "Request already exists",
            description: "You have already sent a request to this patient.",
            variant: "destructive",
          });
        } else {
          throw requestError;
        }
        return;
      }

      toast({
        title: "Request Sent!",
        description: `A link request has been sent to ${patient.name}. You will be notified once they approve.`,
      });

      setLinkDialogOpen(false);
      setPatientIdInput("");
      fetchRelativeData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLinkingPatient(false);
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
            <div className="p-2 rounded-lg bg-accent/10">
              <UserCircle className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Caregiver Dashboard</h1>
              <p className="text-sm text-muted-foreground">{relativeData?.name}</p>
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
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-emergency/10">
                  <AlertTriangle className="h-6 w-6 text-emergency" />
                </div>
                <div>
                  <CardTitle className="text-lg">Emergency Help</CardTitle>
                  <CardDescription>Get immediate assistance</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Contact Doctor</CardTitle>
                  <CardDescription>Call healthcare provider</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-secondary/10">
                  <Calendar className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Schedule Visit</CardTitle>
                  <CardDescription>Book appointment</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Caregiver and Patient Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Caregiver Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{relativeData?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Relation</p>
                <p className="font-medium">{relativeData?.relation_to_patient}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{relativeData?.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Patient Info */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>Your care recipient</CardDescription>
            </CardHeader>
            <CardContent>
              {patientData ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{patientData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Age & Gender</p>
                    <p className="font-medium">{patientData.age} years • {patientData.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Village</p>
                    <p className="font-medium">{patientData.village}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{patientData.phone}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">No patient linked yet</p>
                  <Button variant="link" className="mt-2" onClick={() => setLinkDialogOpen(true)}>
                    Link Patient Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Health Status */}
          <Card>
            <CardHeader>
              <CardTitle>Health Status</CardTitle>
              <CardDescription>Current health overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Recent Consultations</span>
                  </div>
                  <p className="text-2xl font-bold">{consultations.length}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">Overall Status</span>
                  </div>
                  <Badge variant="default">Stable</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Link Requests */}
        {linkRequests.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Link Requests</CardTitle>
              <CardDescription>Your patient linking requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {linkRequests.map((request: any) => (
                  <div key={request.id} className="p-4 border rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium">{request.patients?.name}</p>
                      <p className="text-sm text-muted-foreground">ID: {request.patients?.patient_id}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Requested: {new Date(request.requested_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={
                      request.status === "approved" ? "default" : 
                      request.status === "rejected" ? "destructive" : "secondary"
                    }>
                      {request.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Medical History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Medical History</CardTitle>
            <CardDescription>Patient's consultation records</CardDescription>
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
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Diagnosis:</strong> {consultation.diagnosis}
                      </p>
                    )}
                    {consultation.treatment && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Treatment:</strong> {consultation.treatment}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(consultation.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No consultation history available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Care Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Caregiver Tips</CardTitle>
            <CardDescription>Essential care guidelines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">📋 Medication Tracking</h4>
                <p className="text-sm text-muted-foreground">
                  Keep a detailed log of all medications and their timings
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">🩺 Regular Check-ups</h4>
                <p className="text-sm text-muted-foreground">
                  Schedule routine health check-ups and follow-ups
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">📞 Emergency Contacts</h4>
                <p className="text-sm text-muted-foreground">
                  Keep doctor and ambulance numbers readily available
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">💚 Emotional Support</h4>
                <p className="text-sm text-muted-foreground">
                  Provide emotional comfort and companionship
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Link Patient Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Patient Link</DialogTitle>
            <DialogDescription>
              Enter the unique Patient ID to send a link request. The patient must approve this request before you can access their information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient ID</Label>
              <Input
                id="patientId"
                placeholder="PAT-YYYYMMDD-XXXX"
                value={patientIdInput}
                onChange={(e) => setPatientIdInput(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Example format: PAT-20250116-1234
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLinkPatient} disabled={linkingPatient}>
              {linkingPatient ? "Sending Request..." : "Send Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RelativeDashboard;
