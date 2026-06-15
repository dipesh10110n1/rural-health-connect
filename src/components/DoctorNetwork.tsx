import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Stethoscope, 
  MapPin, 
  Clock, 
  Star, 
  Phone,
  Video,
  Calendar,
  Filter,
  Users,
  Activity,
  Heart
} from "lucide-react";

export const DoctorNetwork = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");

  const doctors = [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      specialty: "General Medicine",
      experience: 12,
      rating: 4.8,
      availability: "Available Now",
      location: "Apollo Hospital, Delhi",
      distance: "45 km",
      consultationFee: 300,
      languages: ["Hindi", "English"],
      image: "/placeholder-doctor.jpg",
      nextSlot: "Today 3:00 PM"
    },
    {
      id: 2,
      name: "Dr. Priya Sharma",
      specialty: "Gynecology",
      experience: 8,
      rating: 4.9,
      availability: "Available",
      location: "Fortis Hospital, Gurgaon",
      distance: "52 km",
      consultationFee: 500,
      languages: ["Hindi", "English", "Punjabi"],
      image: "/placeholder-doctor.jpg",
      nextSlot: "Tomorrow 10:00 AM"
    },
    {
      id: 3,
      name: "Dr. Amit Singh",
      specialty: "Pediatrics",
      experience: 15,
      rating: 4.7,
      availability: "Busy",
      location: "Max Hospital, Noida",
      distance: "38 km",
      consultationFee: 400,
      languages: ["Hindi", "English"],
      image: "/placeholder-doctor.jpg",
      nextSlot: "Tomorrow 4:00 PM"
    },
    {
      id: 4,
      name: "Dr. Sunita Reddy",
      specialty: "Cardiology",
      experience: 20,
      rating: 4.9,
      availability: "Available",
      location: "AIIMS, Delhi",
      distance: "48 km",
      consultationFee: 600,
      languages: ["Hindi", "English", "Telugu"],
      image: "/placeholder-doctor.jpg",
      nextSlot: "Today 6:00 PM"
    }
  ];

  const hospitals = [
    {
      name: "Apollo Hospital",
      location: "Delhi",
      distance: "45 km",
      specialties: ["Cardiology", "Neurology", "Oncology", "Emergency"],
      emergencyAvailable: true,
      rating: 4.6,
      phone: "+91-11-26925858"
    },
    {
      name: "Fortis Hospital",
      location: "Gurgaon",
      distance: "52 km",
      specialties: ["Gynecology", "Orthopedics", "Gastrology"],
      emergencyAvailable: true,
      rating: 4.4,
      phone: "+91-124-4962200"
    },
    {
      name: "Max Super Specialty Hospital",
      location: "Noida",
      distance: "38 km",
      specialties: ["Pediatrics", "Dermatology", "ENT"],
      emergencyAvailable: false,
      rating: 4.3,
      phone: "+91-120-3988888"
    }
  ];

  const specialties = [
    "General Medicine",
    "Pediatrics",
    "Gynecology",
    "Cardiology",
    "Orthopedics",
    "Dermatology",
    "ENT",
    "Ophthalmology"
  ];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "all" || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary text-primary-foreground rounded-full">
              <Stethoscope className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Doctor & Hospital Network</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with verified doctors and hospitals for expert medical consultation and treatment
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary">150+</div>
              <div className="text-sm text-muted-foreground">Verified Doctors</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-secondary">25+</div>
              <div className="text-sm text-muted-foreground">Partner Hospitals</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-success">24/7</div>
              <div className="text-sm text-muted-foreground">Emergency Care</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-warning">50+</div>
              <div className="text-sm text-muted-foreground">Specialties</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="doctors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="doctors">Find Doctors</TabsTrigger>
            <TabsTrigger value="hospitals">Hospital Directory</TabsTrigger>
            <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
          </TabsList>

          {/* Doctors Tab */}
          <TabsContent value="doctors">
            {/* Search and Filter */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      placeholder="Search doctors by name or specialty..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select 
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                  >
                    <option value="all">All Specialties</option>
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Doctor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="border-l-4 border-l-primary hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                        <Stethoscope className="h-10 w-10 text-primary" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-lg">{doctor.name}</h3>
                            <p className="text-muted-foreground">{doctor.specialty}</p>
                          </div>
                          <Badge 
                            variant={doctor.availability === "Available Now" ? "secondary" : 
                                   doctor.availability === "Available" ? "outline" : "destructive"}
                          >
                            {doctor.availability}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            {doctor.rating} ({doctor.experience} years)
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {doctor.distance}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Next: {doctor.nextSlot}
                          </div>
                          <div className="font-medium text-foreground">
                            ₹{doctor.consultationFee}
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm text-muted-foreground mb-1">Languages:</p>
                          <div className="flex gap-1">
                            {doctor.languages.map(lang => (
                              <Badge key={lang} variant="outline" className="text-xs">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            <Phone className="h-4 w-4 mr-2" />
                            Voice Call
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Video className="h-4 w-4 mr-2" />
                            Video Call
                          </Button>
                          <Button size="sm" variant="outline">
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Hospitals Tab */}
          <TabsContent value="hospitals">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hospitals.map((hospital, index) => (
                <Card key={index} className="border-l-4 border-l-secondary">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{hospital.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-4 w-4" />
                          {hospital.location} • {hospital.distance}
                        </CardDescription>
                      </div>
                      {hospital.emergencyAvailable && (
                        <Badge variant="destructive">Emergency</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{hospital.rating}</span>
                        <span className="text-muted-foreground text-sm">rating</span>
                      </div>
                      
                      <div>
                        <p className="font-medium mb-2">Specialties:</p>
                        <div className="flex flex-wrap gap-1">
                          {hospital.specialties.map(specialty => (
                            <Badge key={specialty} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Hospital
                        </Button>
                        <Button size="sm" variant="outline">
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{hospital.phone}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Emergency Tab */}
          <TabsContent value="emergency">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-emergency">
                <CardHeader>
                  <CardTitle className="text-emergency flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Emergency Hotlines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { service: "National Emergency", number: "112", available: "24/7" },
                    { service: "Medical Emergency", number: "102", available: "24/7" },
                    { service: "Ambulance Service", number: "108", available: "24/7" },
                    { service: "Rural Health Helpline", number: "104", available: "24/7" },
                    { service: "Poison Control", number: "1066", available: "24/7" }
                  ].map((emergency, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-emergency-light rounded-lg">
                      <div>
                        <div className="font-medium">{emergency.service}</div>
                        <div className="text-sm text-muted-foreground">Available {emergency.available}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-emergency">{emergency.number}</div>
                        <Button size="sm" className="mt-1">
                          <Phone className="h-4 w-4 mr-1" />
                          Call Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Emergency Protocols
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <h4 className="font-medium mb-1">Cardiac Emergency</h4>
                      <p className="text-sm text-muted-foreground">Call 102, start CPR if needed, contact nearest cardiology hospital</p>
                    </div>
                    <div className="p-3 bg-secondary/10 rounded-lg">
                      <h4 className="font-medium mb-1">Road Accident</h4>
                      <p className="text-sm text-muted-foreground">Call 108, don't move patient, ensure airway is clear</p>
                    </div>
                    <div className="p-3 bg-warning/10 rounded-lg">
                      <h4 className="font-medium mb-1">Pregnancy Emergency</h4>
                      <p className="text-sm text-muted-foreground">Contact nearest maternity hospital, call 102 for ambulance</p>
                    </div>
                    <div className="p-3 bg-success/10 rounded-lg">
                      <h4 className="font-medium mb-1">Poisoning</h4>
                      <p className="text-sm text-muted-foreground">Call 1066 poison control, don't induce vomiting</p>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-emergency hover:bg-emergency/90 text-white">
                    <Heart className="h-4 w-4 mr-2" />
                    Download Emergency Guide
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};