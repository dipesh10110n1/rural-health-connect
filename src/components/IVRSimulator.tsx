import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  PhoneCall, 
  Volume2, 
  VolumeX,
  RotateCcw,
  MessageSquare
} from "lucide-react";
import { useVoice } from "./VoiceProvider";
import { useToast } from "@/hooks/use-toast";

interface IVRMenuOption {
  key: string;
  text: string;
  speech: string;
  action?: string;
  submenu?: IVRMenuOption[];
}

export const IVRSimulator = () => {
  const [currentMenu, setCurrentMenu] = useState<IVRMenuOption[]>([]);
  const [menuPath, setMenuPath] = useState<string[]>([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [currentInstruction, setCurrentInstruction] = useState("");
  const { speakText, isPlaying, stopSpeech, currentLanguage } = useVoice();
  const { toast } = useToast();

  // IVR Menu Structure
  const mainMenu: IVRMenuOption[] = [
    {
      key: "1",
      text: "Emergency Medical Help",
      speech: "Press 1 for immediate emergency medical assistance",
      action: "emergency"
    },
    {
      key: "2", 
      text: "Talk to AI Doctor",
      speech: "Press 2 to speak with our AI doctor for health consultation",
      action: "ai-doctor"
    },
    {
      key: "3",
      text: "Find Nearest Hospital",
      speech: "Press 3 to locate the nearest hospital or medical facility",
      submenu: [
        {
          key: "1",
          text: "General Hospital",
          speech: "Press 1 for general hospitals",
          action: "find-hospital-general"
        },
        {
          key: "2",
          text: "Maternity Hospital",
          speech: "Press 2 for maternity hospitals",
          action: "find-hospital-maternity"
        },
        {
          key: "3",
          text: "Pediatric Hospital", 
          speech: "Press 3 for children's hospitals",
          action: "find-hospital-pediatric"
        }
      ]
    },
    {
      key: "4",
      text: "Health Information",
      speech: "Press 4 for health tips and disease prevention information",
      submenu: [
        {
          key: "1",
          text: "Vaccination Schedule",
          speech: "Press 1 for vaccination information",
          action: "vaccination-info"
        },
        {
          key: "2",
          text: "Hygiene Tips",
          speech: "Press 2 for hygiene and cleanliness tips", 
          action: "hygiene-tips"
        },
        {
          key: "3",
          text: "Seasonal Health Alerts",
          speech: "Press 3 for current health alerts in your area",
          action: "health-alerts"
        }
      ]
    },
    {
      key: "5",
      text: "Connect to Health Worker",
      speech: "Press 5 to speak with your local ASHA or health worker",
      action: "connect-asha"
    },
    {
      key: "0",
      text: "Repeat Menu",
      speech: "Press 0 to hear this menu again",
      action: "repeat"
    }
  ];

  // Multilingual greetings
  const greetings = {
    "English": "Welcome to Village Health Whisperer. Your health is our priority. Please listen carefully to the menu options.",
    "हिंदी (Hindi)": "गांव स्वास्थ्य व्हिस्परर में आपका स्वागत है। आपका स्वास्थ्य हमारी प्राथमिकता है। कृपया मेनू विकल्पों को ध्यान से सुनें।",
    "বাংলা (Bengali)": "গ্রাম স্বাস্থ্য হুইসপারারে আপনাকে স্वাগতম। আপনার স্वাস্থ্য আমাদের অগ্রাধিকার। অনুগ্রহ করে মেনু অপশনগুলো মনোযোগ দিয়ে শুনুন।"
  };

  const menuInstructions = {
    "English": "Please choose from the following options: ",
    "हिंदी (Hindi)": "कृपया निम्नलिखित विकल्पों में से चुनें: ",
    "বাংলা (Bengali)": "অনুগ্রহ করে নিম্নলিখিত বিকল্পগুলির মধ্যে থেকে বেছে নিন: "
  };

  const startCall = async () => {
    setIsCallActive(true);
    setCurrentMenu(mainMenu);
    setMenuPath([]);
    
    const greeting = greetings[currentLanguage as keyof typeof greetings] || greetings["English"];
    setCurrentInstruction(greeting);
    
    toast({
      title: "IVR Call Connected",
      description: "You are now connected to Village Health Whisperer IVR system",
    });

    // Speak the greeting and then the menu
    await speakText(greeting);
    setTimeout(() => {
      playCurrentMenu();
    }, 1000);
  };

  const endCall = () => {
    setIsCallActive(false);
    setCurrentMenu([]);
    setMenuPath([]);
    setCurrentInstruction("");
    stopSpeech();
    
    toast({
      title: "Call Ended",
      description: "Thank you for using Village Health Whisperer",
    });
  };

  const playCurrentMenu = async () => {
    if (currentMenu.length === 0) return;
    
    const instruction = menuInstructions[currentLanguage as keyof typeof menuInstructions] || menuInstructions["English"];
    let menuText = instruction;
    
    for (const option of currentMenu) {
      menuText += `${option.speech}. `;
    }
    
    setCurrentInstruction(menuText);
    await speakText(menuText);
  };

  const handleMenuSelection = async (key: string) => {
    const selectedOption = currentMenu.find(option => option.key === key);
    
    if (!selectedOption) {
      const errorMsg = currentLanguage === "हिंदी (Hindi)" ? 
        "गलत विकल्प। कृपया फिर से कोशिश करें।" : 
        "Invalid option. Please try again.";
      await speakText(errorMsg);
      return;
    }

    if (selectedOption.action === "repeat") {
      await playCurrentMenu();
      return;
    }

    if (selectedOption.submenu) {
      setCurrentMenu(selectedOption.submenu);
      setMenuPath([...menuPath, selectedOption.text]);
      
      const submenuMsg = `You selected ${selectedOption.text}. `;
      setCurrentInstruction(submenuMsg);
      await speakText(submenuMsg);
      
      setTimeout(() => {
        playCurrentMenu();
      }, 1000);
    } else if (selectedOption.action) {
      await handleAction(selectedOption.action, selectedOption.text);
    }
  };

  const handleAction = async (action: string, optionText: string) => {
    let responseText = "";
    const isHindi = currentLanguage === "हिंदी (Hindi)";
    
    switch (action) {
      case "emergency":
        responseText = isHindi ? 
          "आपातकालीन सेवा सक्रिय की गई। निकटतम अस्पताल और एम्बुलेंस को सूचित किया गया है। कृपया शांत रहें और प्राथमिक चिकित्सा निर्देशों का पालन करें।" :
          "Emergency services activated. Nearest hospital and ambulance have been notified. Please remain calm and follow first aid instructions.";
        break;
      case "ai-doctor":
        responseText = isHindi ?
          "आपको हमारे एआई डॉक्टर से जोड़ा जा रहा है। कृपया अपने लक्षणों का स्पष्ट वर्णन करें।" :
          "Connecting you to our AI doctor for consultation. Please describe your symptoms clearly.";
        break;
      case "find-hospital-general":
        responseText = isHindi ?
          "निकटतम सामान्य अस्पताल अपोलो अस्पताल है, 15 किलोमीटर दूर। फोन: +91-11-26925858" :
          "The nearest general hospital is Apollo Hospital, 15 kilometers away. Phone: +91-11-26925858";
        break;
      case "find-hospital-maternity":
        responseText = isHindi ?
          "निकटतम प्रसूति अस्पताल फोर्टिस महिला अस्पताल है, 12 किलोमीटर दूर। फोन: +91-124-4962200" :
          "The nearest maternity hospital is Fortis Women's Hospital, 12 kilometers away. Phone: +91-124-4962200";
        break;
      case "find-hospital-pediatric":
        responseText = isHindi ?
          "निकटतम बाल चिकित्सा अस्पताल रेनबो चिल्ड्रन अस्पताल है, 10 किलोमीटर दूर। फोन: +91-11-49474747" :
          "The nearest pediatric hospital is Rainbow Children's Hospital, 10 kilometers away. Phone: +91-11-49474747";
        break;
      case "vaccination-info":
        responseText = isHindi ?
          "अगले सप्ताह टीकाकरण अभियान निर्धारित है। उपलब्ध टीके: पोलियो, खसरा, हेपेटाइटिस बी। अपने आशा कार्यकर्ता से संपर्क करें।" :
          "Next vaccination drive is scheduled for next week. Vaccines available: Polio, Measles, Hepatitis B. Contact your ASHA worker.";
        break;
      case "hygiene-tips":
        responseText = isHindi ?
          "साबुन से बार-बार हाथ धोएं, उबला हुआ पानी पिएं, आसपास सफाई रखें, भोजन को ढककर रखें।" :
          "Wash hands frequently with soap, drink boiled water, keep surroundings clean, cover food properly.";
        break;
      case "health-alerts":
        responseText = isHindi ?
          "वर्तमान में आपके क्षेत्र में डेंगू और मलेरिया का खतरा है। मच्छरों से सुरक्षा के लिए उपाय करें।" :
          "Current health alert in your area: Dengue and Malaria risk. Take precautions against mosquitoes.";
        break;
      case "connect-asha":
        responseText = isHindi ?
          "आपको आपके स्थानीय आशा कार्यकर्ता से जोड़ा जा रहा है। कृपया प्रतीक्षा करें।" :
          "Connecting you to your local ASHA worker. Please hold while we establish the connection.";
        break;
      default:
        responseText = isHindi ?
          "सेवा सक्रिय की गई। गांव स्वास्थ्य व्हिस्परर का उपयोग करने के लिए धन्यवाद।" :
          "Service activated. Thank you for using Village Health Whisperer.";
    }

    setCurrentInstruction(responseText);
    await speakText(responseText);
    
    toast({
      title: isHindi ? "सेवा सक्रिय" : "Service Activated",
      description: optionText,
    });

    // After action, return to main menu or end call
    setTimeout(() => {
      if (action === "emergency") {
        endCall();
      } else {
        goToMainMenu();
      }
    }, 3000);
  };

  const goBack = () => {
    if (menuPath.length > 0) {
      // Go back to previous menu level
      const newPath = [...menuPath];
      newPath.pop();
      setMenuPath(newPath);
      
      // Navigate back to appropriate menu
      let menu = mainMenu;
      for (const pathItem of newPath) {
        const option = menu.find(opt => opt.text === pathItem);
        if (option && option.submenu) {
          menu = option.submenu;
        }
      }
      setCurrentMenu(menu);
      playCurrentMenu();
    }
  };

  const goToMainMenu = () => {
    setCurrentMenu(mainMenu);
    setMenuPath([]);
    playCurrentMenu();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary text-primary-foreground rounded-full">
              <Phone className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">IVR System</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Interactive Voice Response - Call *108* or use this simulator
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Phone Interface */}
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Virtual Phone Interface
              </CardTitle>
              <CardDescription>
                Simulate calling our IVR system from any phone
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isCallActive ? (
                <div className="text-center space-y-4">
                  <div className="text-6xl mb-4">📞</div>
                  <p className="text-muted-foreground">
                    Press the call button to connect to Village Health Whisperer IVR
                  </p>
                  <Button 
                    onClick={startCall}
                    className="w-full bg-success hover:bg-success/90 text-white text-lg py-6"
                  >
                    <PhoneCall className="mr-2 h-6 w-6" />
                    Start IVR Call
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Call Status */}
                  <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                      <span className="font-medium">Call Active</span>
                    </div>
                    <Badge variant="secondary">Connected</Badge>
                  </div>

                  {/* Current Path */}
                  {menuPath.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Path: Main Menu {menuPath.map(path => ` > ${path}`).join("")}
                    </div>
                  )}

                  {/* Keypad */}
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((key) => (
                      <Button
                        key={key}
                        variant="outline"
                        className="aspect-square text-xl font-bold"
                        onClick={() => handleMenuSelection(key.toString())}
                        disabled={key === "*" || key === "#"}
                      >
                        {key}
                      </Button>
                    ))}
                  </div>

                  {/* Call Controls */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={goBack}
                      disabled={menuPath.length === 0}
                      className="flex-1"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Go Back
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={isPlaying ? stopSpeech : playCurrentMenu}
                      className="flex-1"
                    >
                      {isPlaying ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
                      {isPlaying ? "Stop" : "Repeat"}
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={endCall}
                      className="flex-1"
                    >
                      End Call
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Instructions */}
          <Card className="border-l-4 border-l-secondary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Current Instructions
              </CardTitle>
              <CardDescription>
                What you would hear on a real phone call
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isCallActive ? (
                <div className="space-y-4">
                  <div className="p-4 bg-secondary/10 rounded-lg">
                    <p className="text-sm leading-relaxed">
                      {currentInstruction || "Connecting..."}
                    </p>
                  </div>
                  
                  {currentMenu.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Available Options:</h4>
                      {currentMenu.map((option) => (
                        <div 
                          key={option.key}
                          className="flex items-center gap-3 p-2 bg-background border rounded-lg"
                        >
                          <Badge variant="outline">{option.key}</Badge>
                          <span className="text-sm">{option.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {isPlaying ? (
                      <>
                        <Volume2 className="h-4 w-4 animate-pulse" />
                        Speaking...
                      </>
                    ) : (
                      <>
                        <Phone className="h-4 w-4" />
                        Waiting for input...
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Phone className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Start a call to see instructions
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>How to Use IVR</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Dial *108* from any phone (basic or smartphone)</p>
              <p>• Listen carefully to menu options</p>
              <p>• Press numbers on your keypad to select</p>
              <p>• Press 0 to repeat the menu</p>
              <p>• Available 24/7 in multiple languages</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Supported Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["English", "हिंदी", "বাংলা", "తెలుగు", "தமிழ்", "मराठी", "ગુજરાતી"].map(lang => (
                  <Badge key={lang} variant="secondary">{lang}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};