import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { UserCircle, Check, X } from "lucide-react";

export const PatientApprovalRequests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      const { data: patientData } = await supabase
        .from("patients")
        .select("id")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (!patientData) return;

      const { data } = await supabase
        .from("relative_link_requests")
        .select(`
          *,
          relatives (
            name,
            phone,
            relation_to_patient
          )
        `)
        .eq("patient_id", patientData.id)
        .eq("status", "pending")
        .order("requested_at", { ascending: false });

      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      const { error } = await supabase.rpc("approve_relative_link", {
        request_id: requestId
      });

      if (error) throw error;

      toast({
        title: "Request Approved",
        description: "The caregiver can now access your medical information.",
      });

      fetchRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from("relative_link_requests")
        .update({ status: "rejected", responded_at: new Date().toISOString() })
        .eq("id", requestId);

      if (error) throw error;

      toast({
        title: "Request Rejected",
        description: "The link request has been declined.",
      });

      fetchRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading || requests.length === 0) return null;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCircle className="h-5 w-5" />
          Caregiver Access Requests
        </CardTitle>
        <CardDescription>
          Review and approve caregivers who want to access your medical information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="p-4 border rounded-lg bg-muted/30">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold">{request.relatives?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Relation: {request.relatives?.relation_to_patient}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Phone: {request.relatives?.phone}
                  </p>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Requested: {new Date(request.requested_at).toLocaleString()}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleApprove(request.id)}
                  className="flex-1"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReject(request.id)}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
