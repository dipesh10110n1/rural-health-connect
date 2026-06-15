import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  ArrowLeft,
  Hash,
  RotateCcw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface USSDOption {
  key: string;
  title: string;
  description: string;
  action?: string;
  submenu?: USSDOption[];
}

export const USSDMenu = () => {
  const [currentMenu, setCurrentMenu] = useState<USSDOption[]>([]);
  const [menuPath, setMenuPath] = useState<string[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [ussdCode, setUssdCode] = useState("*108#");
  const { toast } = useToast();

  const mainMenu: USSDOption[] = [
    {
      key: "1",
      title: "Emergency Help",
      description: "Immediate medical emergency assistance",
      action: "emergency"
    },
    {
      key: "2",
      title: "Find Doctor",
      description: "Locate nearby doctors and hospitals",
      submenu: [
        {
          key: "1",
          title: "General Doctor",
          description: "Find general practitioners",
          action: "find-general-doctor"
        },
        {
          key: "2", 
          title: "Specialist Doctor",
          description: "Find specialist doctors",
          action: "find-specialist"
        },
        {
          key: "3",
          title: "Nearest Hospital",
          description: "Find closest hospital",
          action: "find-hospital"
        }
      ]
    },
    {
      key: "3",
      title: "Health Info",
      description: "Health tips and information",
      submenu: [
        {
          key: "1",
          title: "Vaccination",
          description: "Vaccination schedule and info",
          action: "vaccination-info"
        },
        {
          key: "2",
          title: "Disease Prevention",
          description: "Prevention tips",
          action: "prevention-tips"
        }
      ]
    },
    {
      key: "4",
      title: "ASHA Worker",
      description: "Connect with local health worker",
      action: "connect-asha"
    },
    {
      key: "0",
      title: "Main Menu",
      description: "Return to main menu",
      action: "main-menu"
    }
  ];

  const startUSSDSession = () => {
    setIsSessionActive(true);
    setCurrentMenu(mainMenu);
    setMenuPath([]);
    
    toast({
      title: "USSD Session Started",
      description: `Dialed ${ussdCode} - Connection established`,
    });
  };

  const endSession = () => {
    setIsSessionActive(false);
    setCurrentMenu([]);
    setMenuPath([]);
    
    toast({
      title: "Session Ended",
      description: "USSD session terminated",
    });
  };

  const selectOption = (key: string) => {
    const option = currentMenu.find(opt => opt.key === key);
    
    if (!option) {
      toast({
        title: "Invalid Option",
        description: "Please select a valid option",
        variant: "destructive"
      });
      return;
    }

    if (option.action === "main-menu") {
      setCurrentMenu(mainMenu);
      setMenuPath([]);
      return;
    }

    if (option.submenu) {
      setCurrentMenu(option.submenu);
      setMenuPath([...menuPath, option.title]);
    } else if (option.action) {
      handleAction(option.action, option.title);
    }
  };

  const handleAction = (action: string, title: string) => {
    let result = "";
    
    switch (action) {
      case "emergency":
        result = "Emergency services notified. Ambulance dispatched. Stay calm.";
        break;
      case "find-general-doctor":
        result = "Dr. Rajesh Kumar - 2km away\nPhone: +91-98765-43210\nAvailable: 9 AM - 6 PM";
        break;
      case "find-specialist":
        result = "Cardiologist: Dr. Priya - 15km\nPediatrician: Dr. Amit - 8km\nPress 1 for details";
        break;
      case "find-hospital":
        result = "Apollo Hospital - 12km\nFortis Hospital - 18km\nEmergency: Call 108";
        break;
      case "vaccination-info":
        result = "Next vaccination drive: 15th March\nPolio, Measles, BCG available\nContact ASHA worker";
        break;
      case "prevention-tips":
        result = "Wash hands regularly\nDrink clean water\nEat nutritious food\nExercise daily";
        break;
      case "connect-asha":
        result = "Connecting to ASHA worker Sunita Devi...\nPhone: +91-98765-12345\nPlease wait...";
        break;
      default:
        result = "Service completed. Thank you.";
    }

    toast({
      title: "USSD Response",
      description: result,
      duration: 5000
    });

    // Auto return to main menu after action
    setTimeout(() => {
      setCurrentMenu(mainMenu);
      setMenuPath([]);
    }, 3000);
  };

  const goBack = () => {
    if (menuPath.length > 0) {
      const newPath = [...menuPath];
      newPath.pop();
      setMenuPath(newPath);
      
      // Navigate back to appropriate menu level
      let menu = mainMenu;
      for (const pathItem of newPath) {
        const option = menu.find(opt => opt.title === pathItem);
        if (option && option.submenu) {
          menu = option.submenu;
        }
      }
      setCurrentMenu(menu);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-secondary text-secondary-foreground rounded-full">
              <Smartphone className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">USSD Menu System</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            For basic phones without internet - Dial *108#
          </p>
        </div>

        {/* Phone Interface */}
        <Card className="border-l-4 border-l-secondary">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Mobile Phone Interface</span>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Smartphone className="h-3 w-3" />
                Basic Phone
              </Badge>
            </CardTitle>
            <CardDescription>
              Works on any mobile phone, no smartphone or internet required
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {!isSessionActive ? (
              /* Dial Screen */
              <div className="text-center space-y-6">
                <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-lg">
                  <div className="border border-green-400 p-2">
                    {ussdCode}
                  </div>
                </div>
                
                <p className="text-muted-foreground">
                  Dial the USSD code above from any mobile phone to access Village Health Whisperer services
                </p>
                
                <Button 
                  onClick={startUSSDSession}
                  className="w-full bg-secondary hover:bg-secondary/90 text-lg py-6"
                >
                  <Hash className="mr-2 h-6 w-6" />
                  Dial *108# (Simulate)
                </Button>
              </div>
            ) : (
              /* USSD Menu */
              <div className="space-y-4">
                {/* Menu Display */}
                <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div className="border border-green-400 p-3 min-h-[200px]">
                    <div className="mb-2 font-bold">Village Health Whisperer</div>
                    {menuPath.length > 0 && (
                      <div className="mb-2 text-xs">
                        Path: Main {menuPath.map(path => ` > ${path}`).join("")}
                      </div>
                    )}
                    <div className="mb-2">Choose an option:</div>
                    
                    {currentMenu.map((option) => (
                      <div key={option.key} className="mb-1">
                        {option.key}. {option.title}
                      </div>
                    ))}
                    
                    <div className="mt-3 text-xs">
                      Reply with option number
                    </div>
                  </div>
                </div>

                {/* Option Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {currentMenu.map((option) => (
                    <Button
                      key={option.key}
                      variant="outline"
                      onClick={() => selectOption(option.key)}
                      className="h-12 text-lg font-bold"
                    >
                      {option.key}
                    </Button>
                  ))}
                </div>

                {/* Control Buttons */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={goBack}
                    disabled={menuPath.length === 0}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setCurrentMenu(mainMenu);
                      setMenuPath([]);
                    }}
                    className="flex-1"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Main Menu
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    onClick={endSession}
                    className="flex-1"
                  >
                    End Session
                  </Button>
                </div>
                
                {/* Current Menu Details */}
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <h4 className="font-medium mb-2">Available Options:</h4>
                    {currentMenu.map((option) => (
                      <div key={option.key} className="text-sm text-muted-foreground mb-1">
                        <strong>{option.key}</strong>: {option.description}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>How USSD Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Dial *108# from any mobile phone</p>
              <p>• No internet or smartphone required</p>
              <p>• Works on 2G, 3G, 4G networks</p>
              <p>• Real-time menu navigation</p>
              <p>• Available in local languages</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Coverage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Emergency medical assistance</p>
              <p>• Doctor and hospital finder</p>
              <p>• Health information and tips</p>
              <p>• ASHA worker connection</p>
              <p>• Vaccination schedules</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};