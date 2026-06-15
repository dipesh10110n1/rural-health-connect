import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Clock, 
  Ambulance, 
  Heart, 
  User,
  Navigation
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const EmergencyResponse = () => {
  const [emergencyData, setEmergencyData] = useState({
    type: "",
    location: "",
    description: "",
    patientAge: "",
    patientGender: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const emergencyTypes = [
    { type: "accident", label: "Road Accident", icon: "🚗", priority: "high" },
    { type: "cardiac", label: "Cardiac Emergency", icon: "❤️", priority: "critical" },
    { type: "breathing", label: "Breathing Problem", icon: "🫁", priority: "high" },
    { type: "bleeding", label: "Heavy Bleeding", icon: "🩸", priority: "critical" },
    { type: "pregnancy", label: "Pregnancy Emergency", icon: "🤱", priority: "high" },
    { type: "poisoning", label: "Poisoning", icon: "☠️", priority: "critical" },
    { type: "burns", label: "Burns", icon: "🔥", priority: "high" },
    { type: "other", label: "Other Emergency", icon: "🚨", priority: "medium" }
  ];

  const handleEmergencyReport = async () => {
    setIsSubmitting(true);
    
    // Simulate emergency processing
    setTimeout(() => {
      toast({
        title: "Emergency Alert Sent!",
        description: "Nearest hospital and ambulance have been notified. Help is on the way.",
        variant: "default"
      });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-emergency-light">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-emergency text-white rounded-full">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Emergency Response System</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Immediate AI-guided first aid assistance with automatic hospital and ambulance alerts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Emergency Report Form */}
          <Card className="border-l-4 border-l-emergency">
            <CardHeader>
              <CardTitle className="text-2xl text-emergency">Report Emergency</CardTitle>
              <CardDescription>
                Select emergency type and provide location for immediate assistance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Emergency Type Selection */}
              <div>
                <label className="text-sm font-medium mb-3 block">Emergency Type</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {emergencyTypes.map((emergency) => (
                    <Button
                      key={emergency.type}
                      variant={emergencyData.type === emergency.type ? "default" : "outline"}
                      className="h-auto p-4 flex-col gap-2"
                      onClick={() => setEmergencyData({...emergencyData, type: emergency.type})}
                    >
                      <span className="text-2xl">{emergency.icon}</span>
                      <span className="text-xs text-center">{emergency.label}</span>
                      <Badge 
                        variant={emergency.priority === "critical" ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {emergency.priority}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Village name, landmarks, or address"
                    value={emergencyData.location}
                    onChange={(e) => setEmergencyData({...emergencyData, location: e.target.value})}
                  />
                  <Button variant="outline" size="icon">
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Patient Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Patient Age</label>
                  <Input
                    type="number"
                    placeholder="Age"
                    value={emergencyData.patientAge}
                    onChange={(e) => setEmergencyData({...emergencyData, patientAge: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Gender</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={emergencyData.patientGender}
                    onChange={(e) => setEmergencyData({...emergencyData, patientGender: e.target.value})}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium mb-2 block">Brief Description</label>
                <Textarea
                  placeholder="Describe the emergency situation..."
                  value={emergencyData.description}
                  onChange={(e) => setEmergencyData({...emergencyData, description: e.target.value})}
                  rows={3}
                />
              </div>

              {/* Emergency Button */}
              <Button 
                className="w-full bg-emergency hover:bg-emergency/90 text-white text-lg py-6"
                onClick={handleEmergencyReport}
                disabled={!emergencyData.type || !emergencyData.location || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Clock className="mr-2 h-5 w-5 animate-spin" />
                    Sending Alert...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Send Emergency Alert
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* First Aid Instructions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Immediate First Aid</CardTitle>
                <CardDescription>
                  Follow these steps while help is on the way
                </CardDescription>
              </CardHeader>
              <CardContent>
                {emergencyData.type === "cardiac" && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                      <p>Check if the person is conscious and breathing</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                      <p>If not breathing, start CPR: 30 chest compressions, 2 rescue breaths</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                      <p>Continue CPR until help arrives</p>
                    </div>
                  </div>
                )}
                {emergencyData.type === "bleeding" && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                      <p>Apply direct pressure to the wound with clean cloth</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                      <p>Elevate the injured area above heart level if possible</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                      <p>Do not remove objects embedded in the wound</p>
                    </div>
                  </div>
                )}
                {!emergencyData.type && (
                  <p className="text-muted-foreground italic">Select an emergency type to see specific first aid instructions</p>
                )}
              </CardContent>
            </Card>

            {/* Response Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-secondary flex items-center gap-2">
                  <Ambulance className="h-5 w-5" />
                  Response Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-success-light rounded-lg">
                    <div className="flex items-center gap-3">
                      <Heart className="h-5 w-5 text-success" />
                      <span>Nearest Hospital</span>
                    </div>
                    <Badge variant="secondary">2.3 km away</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Ambulance className="h-5 w-5 text-primary" />
                      <span>Ambulance</span>
                    </div>
                    <Badge variant="secondary">ETA: 12 min</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-secondary" />
                      <span>Local ASHA Worker</span>
                    </div>
                    <Badge variant="secondary">Notified</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};