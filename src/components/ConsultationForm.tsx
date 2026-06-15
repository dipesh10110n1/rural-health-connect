import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Stethoscope, User, Clock, CheckCircle } from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  hospital: string;
  available: boolean;
}

const departments = [
  "General Medicine",
  "Cardiology",
  "Pediatrics",
  "Gynecology",
  "Orthopedics",
  "Dermatology",
  "ENT",
  "Ophthalmology",
  "Neurology",
  "Psychiatry"
];

export const ConsultationForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [patientData, setPatientData] = useState<any>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [formData, setFormData] = useState({
    symptoms: "",
    department: "",
    doctorId: ""
  });

  useEffect(() => {
    fetchPatientData();
  }, [user]);

  useEffect(() => {
    if (formData.department) {
      fetchDoctorsByDepartment(formData.department);
    } else {
      setDoctors([]);
      setFormData(prev => ({ ...prev, doctorId: "" }));
    }
  }, [formData.department]);

  const fetchPatientData = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("patients")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    
    setPatientData(data);
  };

  const fetchDoctorsByDepartment = async (department: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("doctors")
        .select("id, name, specialization, hospital, available")
        .eq("specialization", department)
        .eq("available", true);

      if (error) throw error;
      setDoctors(data || []);
    } catch (error: any) {
      console.error("Error fetching doctors:", error);
      toast({
        title: "Error",
        description: "Failed to load doctors",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientData) {
      toast({
        title: "Error",
        description: "Patient data not found",
        variant: "destructive"
      });
      return;
    }

    if (!formData.symptoms || !formData.department || !formData.doctorId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("consultations")
        .insert({
          patient_id: patientData.id,
          symptoms: formData.symptoms,
          department: formData.department,
          doctor_id: formData.doctorId,
          status: "pending",
          consultation_type: "scheduled"
        });

      if (error) throw error;

      toast({
        title: "Consultation Booked",
        description: "The doctor has been notified and will review your case",
      });

      // Reset form
      setFormData({
        symptoms: "",
        department: "",
        doctorId: ""
      });

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Error creating consultation:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to book consultation",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Stethoscope className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Book a Consultation</CardTitle>
              <CardDescription>
                Select a department and doctor for your consultation
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Symptoms */}
            <div className="space-y-2">
              <Label htmlFor="symptoms">Describe Your Symptoms *</Label>
              <Textarea
                id="symptoms"
                placeholder="Please describe your health concerns in detail..."
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                rows={4}
                required
              />
            </div>

            {/* Department Selection */}
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value, doctorId: "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Doctor Selection */}
            {formData.department && (
              <div className="space-y-2">
                <Label htmlFor="doctor">Select Doctor *</Label>
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading doctors...</p>
                ) : doctors.length > 0 ? (
                  <div className="space-y-3">
                    {doctors.map((doctor) => (
                      <Card
                        key={doctor.id}
                        className={`cursor-pointer transition-all ${
                          formData.doctorId === doctor.id
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() => setFormData({ ...formData, doctorId: doctor.id })}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg bg-secondary/10">
                                <User className="h-5 w-5 text-secondary" />
                              </div>
                              <div>
                                <p className="font-semibold">Dr. {doctor.name}</p>
                                <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                                <p className="text-sm text-muted-foreground">{doctor.hospital}</p>
                              </div>
                            </div>
                            {doctor.available && (
                              <Badge variant="default" className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Available
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">
                        No doctors available in this department at the moment
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !formData.symptoms || !formData.department || !formData.doctorId}
            >
              {loading ? "Booking..." : "Book Consultation"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};