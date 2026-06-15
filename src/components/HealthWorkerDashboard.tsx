import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoLessonPlayer } from "@/components/VideoLessonPlayer";
import { QuizPlayer } from "@/components/QuizPlayer";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Plus, 
  Search, 
  BookOpen, 
  TrendingUp, 
  MapPin, 
  Phone,
  CheckCircle,
  AlertCircle,
  Calendar,
  Activity,
  Award,
  Video,
  ClipboardCheck,
  Star,
  Clock,
  PlayCircle
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  description: string;
  completed: boolean;
  progress: number;
}

interface TrainingModule {
  title: string;
  progress: number;
  duration: string;
  status: string;
  lessons: Lesson[];
  completedLessons: number;
  hasQuiz: boolean;
  quizScore: number | null;
  certificate: boolean;
}

export const HealthWorkerDashboard = () => {
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "Priya Sharma",
      age: 28,
      village: "Ramgarh",
      condition: "Pregnancy - 7 months",
      lastVisit: "2 days ago",
      priority: "high",
      phone: "+91 9876543210"
    },
    {
      id: 2,
      name: "Ram Kumar",
      age: 45,
      village: "Govindpur",
      condition: "Diabetes monitoring",
      lastVisit: "1 week ago",
      priority: "medium",
      phone: "+91 9876543211"
    },
    {
      id: 3,
      name: "Sunita Devi",
      age: 35,
      village: "Ramgarh",
      condition: "Hypertension",
      lastVisit: "3 days ago",
      priority: "medium",
      phone: "+91 9876543212"
    }
  ]);

  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    village: "",
    phone: "",
    condition: ""
  });

  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>([
    {
      title: "Basic Health Assessment",
      progress: 100,
      duration: "45 min",
      status: "completed",
      lessons: [
        { id: "bha-1", title: "Introduction to Health Assessment", duration: "5 min", videoUrl: "", description: "Learn the basics of patient health assessment", completed: true, progress: 100 },
        { id: "bha-2", title: "Vital Signs Measurement", duration: "8 min", videoUrl: "", description: "How to measure blood pressure, pulse, and temperature", completed: true, progress: 100 },
        { id: "bha-3", title: "Patient Interview Techniques", duration: "6 min", videoUrl: "", description: "Effective communication with patients", completed: true, progress: 100 },
        { id: "bha-4", title: "Physical Examination Basics", duration: "7 min", videoUrl: "", description: "Basic physical examination procedures", completed: true, progress: 100 },
        { id: "bha-5", title: "Symptom Recognition", duration: "5 min", videoUrl: "", description: "Identifying common symptoms", completed: true, progress: 100 },
        { id: "bha-6", title: "Documentation & Records", duration: "4 min", videoUrl: "", description: "Recording patient information accurately", completed: true, progress: 100 },
        { id: "bha-7", title: "Referral Guidelines", duration: "5 min", videoUrl: "", description: "When and how to refer patients", completed: true, progress: 100 },
        { id: "bha-8", title: "Assessment Summary", duration: "5 min", videoUrl: "", description: "Putting it all together", completed: true, progress: 100 }
      ],
      completedLessons: 8,
      hasQuiz: true,
      quizScore: 92,
      certificate: true
    },
    {
      title: "Maternal Health Care",
      progress: 75,
      duration: "60 min",
      status: "in-progress",
      lessons: [
        { id: "mhc-1", title: "Pregnancy Overview", duration: "5 min", videoUrl: "", description: "Understanding pregnancy stages", completed: true, progress: 100 },
        { id: "mhc-2", title: "Antenatal Care", duration: "6 min", videoUrl: "", description: "Prenatal checkups and monitoring", completed: true, progress: 100 },
        { id: "mhc-3", title: "Nutrition During Pregnancy", duration: "5 min", videoUrl: "", description: "Essential nutrients for mother and baby", completed: true, progress: 100 },
        { id: "mhc-4", title: "High-Risk Pregnancy", duration: "7 min", videoUrl: "", description: "Identifying and managing high-risk cases", completed: true, progress: 100 },
        { id: "mhc-5", title: "Labor and Delivery Signs", duration: "5 min", videoUrl: "", description: "Recognizing signs of labor", completed: true, progress: 100 },
        { id: "mhc-6", title: "Safe Delivery Practices", duration: "6 min", videoUrl: "", description: "Ensuring safe childbirth", completed: true, progress: 100 },
        { id: "mhc-7", title: "Postnatal Care", duration: "5 min", videoUrl: "", description: "Care after delivery", completed: true, progress: 100 },
        { id: "mhc-8", title: "Breastfeeding Support", duration: "5 min", videoUrl: "", description: "Helping mothers with breastfeeding", completed: true, progress: 100 },
        { id: "mhc-9", title: "Newborn Care Basics", duration: "5 min", videoUrl: "", description: "Essential newborn care", completed: true, progress: 100 },
        { id: "mhc-10", title: "Family Planning", duration: "4 min", videoUrl: "", description: "Contraception options and counseling", completed: false, progress: 40 },
        { id: "mhc-11", title: "Maternal Mental Health", duration: "4 min", videoUrl: "", description: "Addressing postpartum depression", completed: false, progress: 0 },
        { id: "mhc-12", title: "Emergency Obstetric Care", duration: "3 min", videoUrl: "", description: "Handling pregnancy emergencies", completed: false, progress: 0 }
      ],
      completedLessons: 9,
      hasQuiz: true,
      quizScore: null,
      certificate: false
    },
    {
      title: "Child Vaccination Schedule",
      progress: 100,
      duration: "30 min",
      status: "completed",
      lessons: [
        { id: "cvs-1", title: "Immunization Importance", duration: "5 min", videoUrl: "", description: "Why vaccines matter", completed: true, progress: 100 },
        { id: "cvs-2", title: "National Immunization Schedule", duration: "6 min", videoUrl: "", description: "Understanding the vaccine schedule", completed: true, progress: 100 },
        { id: "cvs-3", title: "Vaccine Storage & Handling", duration: "5 min", videoUrl: "", description: "Cold chain management", completed: true, progress: 100 },
        { id: "cvs-4", title: "Administration Techniques", duration: "5 min", videoUrl: "", description: "Safe injection practices", completed: true, progress: 100 },
        { id: "cvs-5", title: "AEFI Management", duration: "5 min", videoUrl: "", description: "Handling adverse reactions", completed: true, progress: 100 },
        { id: "cvs-6", title: "Record Keeping", duration: "4 min", videoUrl: "", description: "Vaccination documentation", completed: true, progress: 100 }
      ],
      completedLessons: 6,
      hasQuiz: true,
      quizScore: 88,
      certificate: true
    },
    {
      title: "Emergency First Aid",
      progress: 40,
      duration: "90 min",
      status: "in-progress",
      lessons: [
        { id: "efa-1", title: "First Aid Principles", duration: "5 min", videoUrl: "", description: "Basic first aid concepts", completed: true, progress: 100 },
        { id: "efa-2", title: "CPR Basics", duration: "8 min", videoUrl: "", description: "Cardiopulmonary resuscitation", completed: true, progress: 100 },
        { id: "efa-3", title: "Choking Response", duration: "5 min", videoUrl: "", description: "Helping choking victims", completed: true, progress: 100 },
        { id: "efa-4", title: "Bleeding Control", duration: "6 min", videoUrl: "", description: "Managing wounds and bleeding", completed: true, progress: 100 },
        { id: "efa-5", title: "Fracture Management", duration: "6 min", videoUrl: "", description: "Handling bone injuries", completed: true, progress: 100 },
        { id: "efa-6", title: "Burns Treatment", duration: "5 min", videoUrl: "", description: "First aid for burns", completed: true, progress: 100 },
        { id: "efa-7", title: "Snake Bite Response", duration: "7 min", videoUrl: "", description: "Managing snake bites in rural areas", completed: false, progress: 30 },
        { id: "efa-8", title: "Drowning Response", duration: "6 min", videoUrl: "", description: "Water emergency management", completed: false, progress: 0 },
        { id: "efa-9", title: "Heat Stroke", duration: "5 min", videoUrl: "", description: "Managing heat-related illness", completed: false, progress: 0 },
        { id: "efa-10", title: "Poisoning Response", duration: "6 min", videoUrl: "", description: "First aid for poisoning", completed: false, progress: 0 },
        { id: "efa-11", title: "Seizure Management", duration: "5 min", videoUrl: "", description: "Helping during seizures", completed: false, progress: 0 },
        { id: "efa-12", title: "Allergic Reactions", duration: "5 min", videoUrl: "", description: "Managing anaphylaxis", completed: false, progress: 0 },
        { id: "efa-13", title: "Shock Recognition", duration: "5 min", videoUrl: "", description: "Identifying and treating shock", completed: false, progress: 0 },
        { id: "efa-14", title: "Emergency Transport", duration: "6 min", videoUrl: "", description: "Safe patient transport", completed: false, progress: 0 },
        { id: "efa-15", title: "First Aid Kit", duration: "5 min", videoUrl: "", description: "Essential supplies and usage", completed: false, progress: 0 }
      ],
      completedLessons: 6,
      hasQuiz: true,
      quizScore: null,
      certificate: false
    },
    {
      title: "Digital Health Records",
      progress: 0,
      duration: "35 min",
      status: "not-started",
      lessons: [
        { id: "dhr-1", title: "Introduction to EHR", duration: "5 min", videoUrl: "", description: "Understanding electronic health records", completed: false, progress: 0 },
        { id: "dhr-2", title: "Data Entry Basics", duration: "7 min", videoUrl: "", description: "Accurate data recording", completed: false, progress: 0 },
        { id: "dhr-3", title: "Mobile App Usage", duration: "8 min", videoUrl: "", description: "Using health apps on mobile", completed: false, progress: 0 },
        { id: "dhr-4", title: "Data Privacy", duration: "7 min", videoUrl: "", description: "Protecting patient information", completed: false, progress: 0 },
        { id: "dhr-5", title: "Offline Data Sync", duration: "8 min", videoUrl: "", description: "Working without internet", completed: false, progress: 0 }
      ],
      completedLessons: 0,
      hasQuiz: true,
      quizScore: null,
      certificate: false
    }
  ]);

  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizModule, setQuizModule] = useState<TrainingModule | null>(null);
  const { toast } = useToast();

  const skillAssessments = [
    { skill: "Patient Communication", level: 85, badge: "Expert" },
    { skill: "Health Monitoring", level: 72, badge: "Proficient" },
    { skill: "Emergency Response", level: 60, badge: "Intermediate" },
    { skill: "Digital Tools", level: 45, badge: "Beginner" },
    { skill: "Community Outreach", level: 90, badge: "Expert" }
  ];

  const upcomingWebinars = [
    { title: "Monsoon Disease Prevention", date: "Dec 10, 2025", time: "10:00 AM", speaker: "Dr. Priya Sharma" },
    { title: "Mental Health First Aid", date: "Dec 15, 2025", time: "2:00 PM", speaker: "Dr. Rakesh Gupta" },
    { title: "Nutrition for Rural Communities", date: "Dec 20, 2025", time: "11:00 AM", speaker: "Dr. Anita Desai" }
  ];

  const handleOpenVideoPlayer = (module: TrainingModule) => {
    setSelectedModule(module);
    setIsVideoPlayerOpen(true);
  };

  const handleOpenQuiz = (module: TrainingModule) => {
    setQuizModule(module);
    setIsQuizOpen(true);
  };

  const handleQuizComplete = (score: number) => {
    if (quizModule) {
      setTrainingModules(prev => prev.map(module => 
        module.title === quizModule.title 
          ? { 
              ...module, 
              quizScore: score, 
              certificate: score >= 70,
              status: score >= 70 ? "completed" : module.status
            }
          : module
      ));
      
      if (score >= 70) {
        toast({
          title: "Certificate Earned!",
          description: `Congratulations! You've earned a certificate for ${quizModule.title}`,
        });
      }
    }
  };

  const handleLessonComplete = (lessonId: string) => {
    setTrainingModules(prev => prev.map(module => ({
      ...module,
      lessons: module.lessons.map(lesson => 
        lesson.id === lessonId ? { ...lesson, completed: true, progress: 100 } : lesson
      ),
      completedLessons: module.lessons.filter(l => l.id === lessonId ? true : l.completed).length
    })));
  };

  const handleProgressUpdate = (lessonId: string, progress: number) => {
    setTrainingModules(prev => prev.map(module => ({
      ...module,
      lessons: module.lessons.map(lesson => 
        lesson.id === lessonId ? { ...lesson, progress } : lesson
      )
    })));
  };

  const healthAlerts = [
    {
      id: 1,
      type: "outbreak",
      message: "Dengue cases reported in nearby villages - increase surveillance",
      severity: "high",
      date: "Today"
    },
    {
      id: 2,
      type: "vaccination",
      message: "Polio vaccination drive scheduled for next week",
      severity: "medium",
      date: "Tomorrow"
    },
    {
      id: 3,
      type: "weather",
      message: "Heavy rains expected - prepare for waterborne diseases",
      severity: "medium",
      date: "2 days ago"
    }
  ];

  const addPatient = () => {
    if (newPatient.name && newPatient.age && newPatient.village) {
      setPatients([...patients, {
        id: patients.length + 1,
        ...newPatient,
        age: parseInt(newPatient.age),
        lastVisit: "Today",
        priority: "medium"
      }]);
      setNewPatient({ name: "", age: "", village: "", phone: "", condition: "" });
    }
  };

  return (
    <div className="min-h-screen bg-secondary/10">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-secondary text-secondary-foreground rounded-full">
              <Users className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">ASHA Worker Dashboard</h1>
              <p className="text-xl text-muted-foreground">Empowering community health workers with digital tools</p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary">{patients.length}</div>
                <div className="text-sm text-muted-foreground">Active Patients</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-secondary">8</div>
                <div className="text-sm text-muted-foreground">Visits This Week</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-success">95%</div>
                <div className="text-sm text-muted-foreground">Training Complete</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-warning">2</div>
                <div className="text-sm text-muted-foreground">Active Alerts</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="patients">Patient Management</TabsTrigger>
            <TabsTrigger value="training">Training Modules</TabsTrigger>
            <TabsTrigger value="alerts">Health Alerts</TabsTrigger>
            <TabsTrigger value="reports">Community Reports</TabsTrigger>
          </TabsList>

          {/* Patient Management */}
          <TabsContent value="patients">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add New Patient */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Patient
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Patient Name"
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                  />
                  <Input
                    type="number"
                    placeholder="Age"
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                  />
                  <Input
                    placeholder="Village"
                    value={newPatient.village}
                    onChange={(e) => setNewPatient({...newPatient, village: e.target.value})}
                  />
                  <Input
                    placeholder="Phone Number"
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                  />
                  <Textarea
                    placeholder="Health Condition"
                    value={newPatient.condition}
                    onChange={(e) => setNewPatient({...newPatient, condition: e.target.value})}
                    rows={2}
                  />
                  <Button onClick={addPatient} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Patient
                  </Button>
                </CardContent>
              </Card>

              {/* Patient List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-10" placeholder="Search patients..." />
                  </div>
                </div>

                {patients.map((patient) => (
                  <Card key={patient.id} className="border-l-4 border-l-primary">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{patient.name}</h3>
                            <Badge 
                              variant={patient.priority === "high" ? "destructive" : "secondary"}
                            >
                              {patient.priority}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4" />
                              Age: {patient.age}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {patient.village}
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {patient.phone}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Last visit: {patient.lastVisit}
                            </div>
                          </div>
                          
                          <p className="mt-3 text-sm font-medium">{patient.condition}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Training Modules */}
          <TabsContent value="training">
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-4 text-center">
                    <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold text-primary">2</div>
                    <p className="text-xs text-muted-foreground">Certificates Earned</p>
                  </CardContent>
                </Card>
                <Card className="bg-success/5 border-success/20">
                  <CardContent className="pt-4 text-center">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success" />
                    <div className="text-2xl font-bold text-success">29</div>
                    <p className="text-xs text-muted-foreground">Lessons Completed</p>
                  </CardContent>
                </Card>
                <Card className="bg-warning/5 border-warning/20">
                  <CardContent className="pt-4 text-center">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-warning" />
                    <div className="text-2xl font-bold text-warning">4.5h</div>
                    <p className="text-xs text-muted-foreground">Learning Time</p>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/5 border-secondary/20">
                  <CardContent className="pt-4 text-center">
                    <Star className="h-8 w-8 mx-auto mb-2 text-secondary" />
                    <div className="text-2xl font-bold text-secondary">90%</div>
                    <p className="text-xs text-muted-foreground">Avg Quiz Score</p>
                  </CardContent>
                </Card>
              </div>

              {/* Training Modules */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Training Modules
                  </CardTitle>
                  <CardDescription>
                    Complete training modules to enhance your healthcare skills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {trainingModules.map((module, index) => (
                      <Card key={index} className="border border-border hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-semibold mb-1">{module.title}</h3>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {module.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Video className="h-3 w-3" />
                                  {module.completedLessons}/{module.lessons.length} lessons
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <Badge 
                                variant={
                                  module.status === "completed" ? "secondary" :
                                  module.status === "in-progress" ? "default" : "outline"
                                }
                              >
                                {module.status === "completed" ? "Completed" :
                                 module.status === "in-progress" ? "In Progress" : "Not Started"}
                              </Badge>
                              {module.certificate && (
                                <span className="text-xs text-success flex items-center gap-1">
                                  <Award className="h-3 w-3" />
                                  Certified
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Progress</span>
                              <span className="text-sm font-medium">{module.progress}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${module.progress}%` }}
                              />
                            </div>
                            
                            {module.quizScore !== null && (
                              <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                                <span className="text-sm flex items-center gap-1">
                                  <ClipboardCheck className="h-4 w-4" />
                                  Quiz Score
                                </span>
                                <Badge variant={module.quizScore >= 80 ? "default" : "secondary"}>
                                  {module.quizScore}%
                                </Badge>
                              </div>
                            )}
                            
                            <div className="flex gap-2 mt-4">
                              <Button 
                                variant={module.status === "completed" ? "outline" : "default"}
                                className="flex-1"
                                onClick={() => handleOpenVideoPlayer(module)}
                              >
                                {module.status === "completed" ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Review
                                  </>
                                ) : module.status === "in-progress" ? (
                                  <>
                                    <PlayCircle className="h-4 w-4 mr-2" />
                                    Continue
                                  </>
                                ) : (
                                  <>
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    Start
                                  </>
                                )}
                              </Button>
                              {module.hasQuiz && (
                                <Button 
                                  variant="secondary"
                                  onClick={() => handleOpenQuiz(module)}
                                  disabled={module.progress < 100}
                                >
                                  <ClipboardCheck className="h-4 w-4 mr-2" />
                                  {module.quizScore !== null ? `Retake (${module.quizScore}%)` : "Take Quiz"}
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Skill Assessment & Webinars */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Skill Assessment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Skill Assessment
                    </CardTitle>
                    <CardDescription>Your proficiency levels across different areas</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {skillAssessments.map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{skill.skill}</span>
                          <Badge 
                            variant={
                              skill.badge === "Expert" ? "default" :
                              skill.badge === "Proficient" ? "secondary" : "outline"
                            }
                          >
                            {skill.badge}
                          </Badge>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              skill.level >= 80 ? "bg-success" :
                              skill.level >= 60 ? "bg-primary" :
                              skill.level >= 40 ? "bg-warning" : "bg-muted-foreground"
                            }`}
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full mt-4">
                      Take Skill Assessment Test
                    </Button>
                  </CardContent>
                </Card>

                {/* Upcoming Webinars */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5" />
                      Upcoming Webinars
                    </CardTitle>
                    <CardDescription>Live training sessions from experts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {upcomingWebinars.map((webinar, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <h4 className="font-semibold mb-1">{webinar.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Speaker: {webinar.speaker}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {webinar.date} at {webinar.time}
                          </span>
                          <Button size="sm" variant="outline">
                            Register
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Certificates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Your Certificates
                  </CardTitle>
                  <CardDescription>Download and share your achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trainingModules.filter(m => m.certificate).map((module, index) => (
                      <Card key={index} className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                        <CardContent className="pt-6 text-center">
                          <Award className="h-12 w-12 mx-auto mb-3 text-primary" />
                          <h4 className="font-semibold mb-1">{module.title}</h4>
                          <p className="text-xs text-muted-foreground mb-3">
                            Quiz Score: {module.quizScore}%
                          </p>
                          <Button size="sm" variant="outline" className="w-full">
                            Download Certificate
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Health Alerts */}
          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Community Health Alerts
                </CardTitle>
                <CardDescription>
                  Stay updated with important health information for your area
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {healthAlerts.map((alert) => (
                  <Card 
                    key={alert.id} 
                    className={`border-l-4 ${
                      alert.severity === "high" ? "border-l-emergency" : "border-l-warning"
                    }`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge 
                              variant={alert.severity === "high" ? "destructive" : "secondary"}
                            >
                              {alert.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{alert.date}</span>
                          </div>
                          <p className="font-medium">{alert.message}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Mark Read
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Community Reports */}
          <TabsContent value="reports">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Health Report</CardTitle>
                  <CardDescription>Generate reports for your assigned area</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-success/10 rounded-lg">
                      <div className="text-2xl font-bold text-success">25</div>
                      <div className="text-sm text-muted-foreground">Consultations</div>
                    </div>
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <div className="text-2xl font-bold text-primary">12</div>
                      <div className="text-sm text-muted-foreground">Referrals</div>
                    </div>
                    <div className="text-center p-4 bg-secondary/10 rounded-lg">
                      <div className="text-2xl font-bold text-secondary">8</div>
                      <div className="text-sm text-muted-foreground">Follow-ups</div>
                    </div>
                    <div className="text-center p-4 bg-warning/10 rounded-lg">
                      <div className="text-2xl font-bold text-warning">3</div>
                      <div className="text-sm text-muted-foreground">Emergency Cases</div>
                    </div>
                  </div>
                  <Button className="w-full">
                    Generate Full Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Village Health Status</CardTitle>
                  <CardDescription>Overview of your assigned villages</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {["Ramgarh", "Govindpur", "Maheshpur"].map((village) => (
                    <div key={village} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{village}</div>
                        <div className="text-sm text-muted-foreground">Population: 2,500</div>
                      </div>
                      <Badge variant="secondary">Good Health</Badge>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View Detailed Analysis
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Video Lesson Player */}
      <VideoLessonPlayer
        isOpen={isVideoPlayerOpen}
        onClose={() => setIsVideoPlayerOpen(false)}
        module={selectedModule}
        onLessonComplete={handleLessonComplete}
        onProgressUpdate={handleProgressUpdate}
      />

      {/* Quiz Player */}
      <QuizPlayer
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        moduleTitle={quizModule?.title || ""}
        onQuizComplete={handleQuizComplete}
      />
    </div>
  );
};