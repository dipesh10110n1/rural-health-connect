import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Award,
  RotateCcw,
  ArrowRight,
  Trophy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  moduleTitle: string;
  onQuizComplete: (score: number) => void;
}

// Quiz questions for different modules
const quizQuestions: Record<string, Question[]> = {
  "Basic Health Assessment": [
    {
      id: "bha-q1",
      question: "What is the normal range for adult resting heart rate?",
      options: ["40-60 bpm", "60-100 bpm", "100-120 bpm", "120-140 bpm"],
      correctAnswer: 1,
      explanation: "Normal adult resting heart rate is 60-100 beats per minute."
    },
    {
      id: "bha-q2",
      question: "Which of the following is NOT a vital sign?",
      options: ["Blood pressure", "Temperature", "Height", "Respiratory rate"],
      correctAnswer: 2,
      explanation: "Height is a measurement but not a vital sign. Vital signs include blood pressure, temperature, pulse, and respiratory rate."
    },
    {
      id: "bha-q3",
      question: "When should you refer a patient to a doctor immediately?",
      options: ["Mild headache", "Blood pressure above 180/120", "Common cold", "Minor skin rash"],
      correctAnswer: 1,
      explanation: "Blood pressure above 180/120 is a hypertensive crisis requiring immediate medical attention."
    },
    {
      id: "bha-q4",
      question: "What is the correct order for patient assessment?",
      options: ["Treatment, History, Examination", "History, Examination, Assessment", "Examination, History, Treatment", "Assessment, Treatment, History"],
      correctAnswer: 1,
      explanation: "The correct order is History taking, Physical Examination, then Assessment/Diagnosis."
    },
    {
      id: "bha-q5",
      question: "Normal body temperature in Celsius is approximately:",
      options: ["35°C", "37°C", "39°C", "41°C"],
      correctAnswer: 1,
      explanation: "Normal body temperature is approximately 37°C (98.6°F)."
    }
  ],
  "Maternal Health Care": [
    {
      id: "mhc-q1",
      question: "How many antenatal checkups are recommended during pregnancy?",
      options: ["At least 2", "At least 4", "At least 6", "At least 8"],
      correctAnswer: 1,
      explanation: "WHO recommends at least 4 antenatal care visits during pregnancy."
    },
    {
      id: "mhc-q2",
      question: "Which is a danger sign during pregnancy requiring immediate attention?",
      options: ["Mild nausea", "Severe headache with blurred vision", "Occasional back pain", "Frequent urination"],
      correctAnswer: 1,
      explanation: "Severe headache with blurred vision can indicate pre-eclampsia, a serious condition."
    },
    {
      id: "mhc-q3",
      question: "Iron and folic acid supplements should be taken for how long during pregnancy?",
      options: ["First trimester only", "100 days", "180 days", "Only when anemic"],
      correctAnswer: 2,
      explanation: "IFA tablets should be taken for 180 days during pregnancy as per national guidelines."
    },
    {
      id: "mhc-q4",
      question: "When should breastfeeding be initiated after birth?",
      options: ["After 24 hours", "Within 1 hour", "After 6 hours", "When mother feels ready"],
      correctAnswer: 1,
      explanation: "Early initiation of breastfeeding within 1 hour of birth is recommended by WHO."
    },
    {
      id: "mhc-q5",
      question: "What is the recommended duration for exclusive breastfeeding?",
      options: ["3 months", "6 months", "9 months", "12 months"],
      correctAnswer: 1,
      explanation: "Exclusive breastfeeding is recommended for the first 6 months of life."
    }
  ],
  "Child Vaccination Schedule": [
    {
      id: "cvs-q1",
      question: "At what age should a child receive the first dose of BCG vaccine?",
      options: ["At birth", "6 weeks", "3 months", "9 months"],
      correctAnswer: 0,
      explanation: "BCG vaccine is given at birth or as early as possible."
    },
    {
      id: "cvs-q2",
      question: "What is the correct temperature range for vaccine storage?",
      options: ["-10 to 0°C", "0 to 4°C", "2 to 8°C", "8 to 15°C"],
      correctAnswer: 2,
      explanation: "Most vaccines should be stored at 2-8°C to maintain their effectiveness."
    },
    {
      id: "cvs-q3",
      question: "Measles vaccine is typically given at what age?",
      options: ["6 weeks", "14 weeks", "9 months", "15 months"],
      correctAnswer: 2,
      explanation: "First dose of measles vaccine is given at 9 months of age."
    },
    {
      id: "cvs-q4",
      question: "What does AEFI stand for?",
      options: ["After Effects From Immunization", "Adverse Events Following Immunization", "All Events Following Injection", "Annual Evaluation For Immunization"],
      correctAnswer: 1,
      explanation: "AEFI stands for Adverse Events Following Immunization."
    },
    {
      id: "cvs-q5",
      question: "Which vaccine requires multiple doses for complete protection?",
      options: ["BCG", "Measles", "DPT", "All vaccines require only one dose"],
      correctAnswer: 2,
      explanation: "DPT requires multiple doses (primary series + boosters) for complete protection."
    }
  ],
  "Emergency First Aid": [
    {
      id: "efa-q1",
      question: "What is the first step in CPR for an unresponsive adult?",
      options: ["Give rescue breaths", "Check for breathing", "Call for help", "Start chest compressions"],
      correctAnswer: 2,
      explanation: "First call for help, then check breathing, then begin CPR if needed."
    },
    {
      id: "efa-q2",
      question: "For choking in a conscious adult, what technique should be used?",
      options: ["Back slaps only", "Abdominal thrusts (Heimlich)", "CPR", "Finger sweep"],
      correctAnswer: 1,
      explanation: "Abdominal thrusts (Heimlich maneuver) is the recommended technique for conscious choking adults."
    },
    {
      id: "efa-q3",
      question: "How should you treat a minor burn?",
      options: ["Apply ice directly", "Cool with running water for 10-20 min", "Apply butter", "Cover with cotton"],
      correctAnswer: 1,
      explanation: "Cool burns with clean, cool running water for 10-20 minutes. Never apply ice or butter."
    },
    {
      id: "efa-q4",
      question: "What should NOT be done for a snake bite victim?",
      options: ["Keep the victim calm", "Immobilize the affected limb", "Cut and suck the wound", "Transport to hospital quickly"],
      correctAnswer: 2,
      explanation: "Never cut or suck a snake bite wound. Keep calm, immobilize, and transport to hospital."
    },
    {
      id: "efa-q5",
      question: "What is the correct chest compression rate for adult CPR?",
      options: ["60-80 per minute", "80-100 per minute", "100-120 per minute", "120-140 per minute"],
      correctAnswer: 2,
      explanation: "The recommended chest compression rate is 100-120 compressions per minute."
    }
  ],
  "Digital Health Records": [
    {
      id: "dhr-q1",
      question: "What is the primary benefit of electronic health records?",
      options: ["They look modern", "Easy access and sharing of patient data", "They cost less paper", "Patients prefer them"],
      correctAnswer: 1,
      explanation: "EHRs enable easy access, sharing, and updating of patient information across healthcare providers."
    },
    {
      id: "dhr-q2",
      question: "What should be done with patient data to ensure privacy?",
      options: ["Share with anyone who asks", "Keep it confidential and secure", "Post on social media for backup", "Delete after each visit"],
      correctAnswer: 1,
      explanation: "Patient data must be kept confidential and secure as per privacy laws and medical ethics."
    },
    {
      id: "dhr-q3",
      question: "When working offline, what should you do with collected data?",
      options: ["Discard it", "Sync when connection is available", "Re-collect when online", "Store on paper only"],
      correctAnswer: 1,
      explanation: "Offline data should be synced to the central system when internet connection is restored."
    },
    {
      id: "dhr-q4",
      question: "What information is essential in a patient health record?",
      options: ["Only name", "Complete demographics, history, and treatments", "Just the diagnosis", "Phone number only"],
      correctAnswer: 1,
      explanation: "A complete health record includes demographics, medical history, diagnoses, treatments, and follow-ups."
    },
    {
      id: "dhr-q5",
      question: "How often should patient records be updated?",
      options: ["Once a year", "Never", "At every visit or when health status changes", "Only during emergencies"],
      correctAnswer: 2,
      explanation: "Records should be updated at every visit or whenever there's a change in health status."
    }
  ]
};

export const QuizPlayer = ({
  isOpen,
  onClose,
  moduleTitle,
  onQuizComplete
}: QuizPlayerProps) => {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const questions = quizQuestions[moduleTitle] || quizQuestions["Basic Health Assessment"];
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleSelectAnswer = (index: number) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setIsAnswerSubmitted(true);
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
      toast({
        title: "Correct! ✓",
        description: "Great job!",
      });
    } else {
      toast({
        title: "Incorrect",
        description: "Review the explanation below.",
        variant: "destructive"
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz completed
      const score = Math.round((correctAnswers / questions.length) * 100);
      setIsQuizCompleted(true);
      onQuizComplete(score);
      
      // Save score to localStorage
      localStorage.setItem(`quiz_score_${moduleTitle}`, score.toString());
    }
  };

  const handleRetryQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setCorrectAnswers(0);
    setIsQuizCompleted(false);
  };

  const handleClose = () => {
    handleRetryQuiz();
    onClose();
  };

  const score = Math.round((correctAnswers / questions.length) * 100);
  const isPassing = score >= 70;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Quiz: {moduleTitle}
          </DialogTitle>
        </DialogHeader>

        {!isQuizCompleted ? (
          <div className="space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>{correctAnswers} correct</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Question */}
            <Card>
              <CardContent className="pt-6">
                <p className="text-lg font-medium mb-4">{currentQuestion.question}</p>
                
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = index === currentQuestion.correctAnswer;
                    const showResult = isAnswerSubmitted;
                    
                    let cardClass = "cursor-pointer transition-all border-2 ";
                    if (showResult) {
                      if (isCorrect) {
                        cardClass += "border-success bg-success/10";
                      } else if (isSelected && !isCorrect) {
                        cardClass += "border-destructive bg-destructive/10";
                      } else {
                        cardClass += "border-muted opacity-50";
                      }
                    } else if (isSelected) {
                      cardClass += "border-primary bg-primary/5";
                    } else {
                      cardClass += "border-muted hover:border-primary/50";
                    }

                    return (
                      <Card
                        key={index}
                        className={cardClass}
                        onClick={() => handleSelectAnswer(index)}
                      >
                        <CardContent className="p-4 flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            showResult && isCorrect ? 'bg-success text-success-foreground' :
                            showResult && isSelected && !isCorrect ? 'bg-destructive text-destructive-foreground' :
                            isSelected ? 'bg-primary text-primary-foreground' :
                            'bg-muted'
                          }`}>
                            {showResult && isCorrect ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : showResult && isSelected && !isCorrect ? (
                              <XCircle className="h-4 w-4" />
                            ) : (
                              <span className="text-sm font-medium">
                                {String.fromCharCode(65 + index)}
                              </span>
                            )}
                          </div>
                          <span className="flex-1">{option}</span>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Explanation */}
                {isAnswerSubmitted && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">Explanation:</p>
                    <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              {!isAnswerSubmitted ? (
                <Button 
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                >
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNextQuestion}>
                  {currentQuestionIndex < questions.length - 1 ? (
                    <>
                      Next Question
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    "View Results"
                  )}
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Quiz Results */
          <div className="text-center space-y-6 py-4">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
              isPassing ? 'bg-success/20' : 'bg-warning/20'
            }`}>
              {isPassing ? (
                <Trophy className="h-12 w-12 text-success" />
              ) : (
                <RotateCcw className="h-12 w-12 text-warning" />
              )}
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-2">
                {isPassing ? "Congratulations!" : "Keep Learning!"}
              </h3>
              <p className="text-muted-foreground">
                {isPassing 
                  ? "You've passed the quiz and earned your certificate!" 
                  : "You need 70% to pass. Review the lessons and try again."}
              </p>
            </div>

            <div className="flex justify-center gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{score}%</div>
                <div className="text-sm text-muted-foreground">Your Score</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">{correctAnswers}/{questions.length}</div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </div>
            </div>

            {isPassing && (
              <Badge className="text-lg py-2 px-4 bg-success">
                <Award className="h-5 w-5 mr-2" />
                Certificate Earned!
              </Badge>
            )}

            <div className="flex justify-center gap-3 pt-4">
              {!isPassing && (
                <Button variant="outline" onClick={handleRetryQuiz}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              )}
              <Button onClick={handleClose}>
                {isPassing ? "Complete" : "Close"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuizPlayer;
