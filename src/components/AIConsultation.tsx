import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  MicOff, 
  MessageCircle, 
  Volume2, 
  Phone, 
  Languages, 
  Heart,
  ThermometerSun,
  Activity,
  Clock,
  VolumeX,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useVoice } from "./VoiceProvider";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/config";

export const AIConsultation = () => {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const getInitialMessage = (lang: string) => {
    const messages = {
      "en": "Namaste! I am your AI Medical Assistant. How can I help you today? You can speak in Hindi, English, or your local language to describe your symptoms.",
      "hi": "नमस्ते! मैं आपका एआई चिकित्सा सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं? आप अपने लक्षणों का वर्णन करने के लिए हिंदी, अंग्रेजी या अपनी स्थानीय भाषा में बोल सकते हैं।",
      "bn": "নমস্কার! আমি আপনার এআই চিকিৎসা সহায়ক। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি? আপনি আপনার লক্ষণ বর্ণনা করতে হিন্দি, ইংরেজি বা আপনার স্থানীয় ভাষায় কথা বলতে পারেন।"
    };
    return messages[lang as keyof typeof messages] || messages["en"];
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content: getInitialMessage("en"),
      timestamp: new Date(),
      severity: null
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [patientInfo, setPatientInfo] = useState({
    symptoms: [],
    severity: null,
    recommendation: null
  });
  
  const { toast } = useToast();
  const { speakText, isPlaying, stopSpeech, currentLanguage, setCurrentLanguage } = useVoice();
  const recognition = useRef<SpeechRecognition | null>(null);
  const conversationHistory = useRef<Array<{role: string, content: string}>>([]);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      recognition.current = new SpeechRecognitionAPI();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      
      recognition.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
        // Automatically send the voice input
        if (transcript.trim()) {
          handleAIResponse(transcript);
        }
      };

      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event);
        setIsListening(false);
        toast({
          title: "Voice Error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive"
        });
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const languages = [
    { code: "en", name: "English", speechLang: "en-US" },
    { code: "hi", name: "हिंदी (Hindi)", speechLang: "hi-IN" },
    { code: "bn", name: "বাংলা (Bengali)", speechLang: "bn-BD" },
    { code: "te", name: "తెలుగు (Telugu)", speechLang: "te-IN" },
    { code: "ta", name: "தமிழ் (Tamil)", speechLang: "ta-IN" },
    { code: "mr", name: "मराठी (Marathi)", speechLang: "mr-IN" },
    { code: "gu", name: "ગુજરાતી (Gujarati)", speechLang: "gu-IN" }
  ];

  const commonSymptoms = [
    { key: "fever", severity: "moderate", icon: <ThermometerSun className="h-4 w-4" /> },
    { key: "headache", severity: "mild", icon: <Activity className="h-4 w-4" /> },
    { key: "cough", severity: "mild", icon: <Heart className="h-4 w-4" /> },
    { key: "chestPain", severity: "high", icon: <Heart className="h-4 w-4" /> },
    { key: "difficultyBreathing", severity: "high", icon: <Activity className="h-4 w-4" /> },
    { key: "stomachPain", severity: "moderate", icon: <Activity className="h-4 w-4" /> },
    { key: "dizziness", severity: "moderate", icon: <Activity className="h-4 w-4" /> },
    { key: "nausea", severity: "mild", icon: <Activity className="h-4 w-4" /> }
  ];

  const handleVoiceInput = () => {
    if (!isListening && recognition.current) {
      setIsListening(true);
      const currentLang = languages.find(l => l.name === currentLanguage);
      recognition.current.lang = currentLang?.speechLang || "en-US";
      recognition.current.start();
      
      toast({
        title: t('listeningSpeak'),
        description: t('typeSymptoms').replace('...', ''),
      });
    } else if (isListening && recognition.current) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  const handleTextInput = () => {
    if (inputMessage.trim()) {
      handleAIResponse(inputMessage);
      setInputMessage("");
    }
  };

  const handleSymptomClick = (symptom) => {
    const message = `I am experiencing ${t(symptom.key).toLowerCase()}`;
    handleAIResponse(message);
  };

  const handleAIResponse = async (userMessage: string) => {
    // Add user message
    const userMsg = {
      id: messages.length + 1,
      type: "user",
      content: userMessage,
      timestamp: new Date(),
      severity: null
    };
    
    setMessages(prev => [...prev, userMsg]);
    
    // Add language context to the message if not English
    const languagePrefix = currentLanguage !== "English" 
      ? `[User is speaking in ${currentLanguage}. Please respond in ${currentLanguage}] `
      : "";
    
    conversationHistory.current.push({ 
      role: "user", 
      content: languagePrefix + userMessage 
    });
    setIsProcessing(true);

    try {

      // Create placeholder for AI response
      const aiMsgId = messages.length + 2;
      let aiResponse = "";
      let severity = "mild";

      const streamUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/medical-consultation`;
      const response = await fetch(streamUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory.current
        })
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to get AI response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              aiResponse += content;
              
              // Update or create AI message
              setMessages(prev => {
                const lastMsg = prev[prev.length - 1];
                if (lastMsg?.type === "ai" && lastMsg.id === aiMsgId) {
                  return prev.map(msg => 
                    msg.id === aiMsgId 
                      ? { ...msg, content: aiResponse }
                      : msg
                  );
                }
                return [...prev, {
                  id: aiMsgId,
                  type: "ai",
                  content: aiResponse,
                  timestamp: new Date(),
                  severity
                }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Determine severity from response
      const lowerResponse = aiResponse.toLowerCase();
      if (lowerResponse.includes("emergency") || lowerResponse.includes("urgent") || lowerResponse.includes("immediately")) {
        severity = "high";
      } else if (lowerResponse.includes("doctor") || lowerResponse.includes("clinic") || lowerResponse.includes("consult")) {
        severity = "moderate";
      }

      // Update final message with severity
      setMessages(prev => 
        prev.map(msg => 
          msg.id === aiMsgId 
            ? { ...msg, severity }
            : msg
        )
      );

      // Extract recommendation
      let recommendation = "Follow the advice provided";
      if (severity === "high") {
        recommendation = "Seek immediate medical attention";
      } else if (severity === "moderate") {
        recommendation = "Consult a doctor soon";
      }

      setPatientInfo({
        symptoms: [userMessage.slice(0, 50)],
        severity,
        recommendation
      });

      conversationHistory.current.push({ role: "assistant", content: aiResponse });
      
      // Auto-speak the AI response
      if (aiResponse.trim()) {
        speakText(aiResponse);
      }
      
    } catch (error) {
      console.error("AI consultation error:", error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary/5">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary text-primary-foreground rounded-full">
              <MessageCircle className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">{t('aiConsultation')}</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('aiConsultationDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Language & Quick Symptoms */}
          <div className="space-y-6">
            {/* Language Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  {t('selectLanguage')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {languages.map((lang) => (
                    <Button
                      key={lang.code}
                      variant={currentLanguage === lang.name ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => {
                        setCurrentLanguage(lang.name);
                        i18n.changeLanguage(lang.code);
                      }}
                    >
                      {lang.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Symptoms */}
            <Card>
              <CardHeader>
                <CardTitle>{t('commonSymptoms')}</CardTitle>
                <CardDescription>{t('clickSymptomConsult')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {commonSymptoms.map((symptom) => (
                    <Button
                      key={symptom.key}
                      variant="outline"
                      className="justify-start"
                      onClick={() => handleSymptomClick(symptom)}
                    >
                      {symptom.icon}
                      <span className="ml-2">{t(symptom.key)}</span>
                      <Badge 
                        variant={symptom.severity === "high" ? "destructive" : 
                                symptom.severity === "moderate" ? "secondary" : "outline"}
                        className="ml-auto"
                      >
                        {t(symptom.severity)}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Assessment */}
            {patientInfo.severity && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">{t('currentAssessment')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium">{t('severityLevel')}:</span>
                    <Badge 
                      variant={patientInfo.severity === "high" ? "destructive" : 
                              patientInfo.severity === "moderate" ? "secondary" : "outline"}
                      className="ml-2"
                    >
                      {t(patientInfo.severity)}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">{t('recommendation')}:</span>
                    <p className="text-sm text-muted-foreground mt-1">{patientInfo.recommendation}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t('aiDoctorConsultation')}</span>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {t('available247')}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {t('currentlySpeaking')}: <strong>{currentLanguage}</strong>
                </CardDescription>
              </CardHeader>
              
              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.type === "ai" ? (
                        <div className="prose prose-sm max-w-none leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                              ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-1">{children}</ul>,
                              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                              strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className="font-medium leading-relaxed">
                          {message.content}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.type === "ai" && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => speakText(message.content)}
                            disabled={isPlaying}
                          >
                            {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>

              {/* Input Area */}
              <div className="p-6 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder={t('typeSymptoms')}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleTextInput()}
                  />
                  <Button onClick={handleTextInput} disabled={!inputMessage.trim() || isProcessing}>
                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={handleVoiceInput}
                    disabled={!recognition.current || isProcessing}
                    className={isListening ? "bg-emergency animate-pulse" : ""}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {isListening ? t('listeningSpeak') : 
                   !recognition.current ? t('voiceNotSupported') :
                   t('clickMicrophone')}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};