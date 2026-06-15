import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation & Common
      home: "Home",
      about: "About",
      contact: "Contact",
      login: "Login",
      logout: "Logout",
      dashboard: "Dashboard",
      
      // AI Consultation
      aiConsultation: "AI Voice Consultation",
      aiConsultationDesc: "Speak with our AI doctor in your preferred language for instant health guidance",
      selectLanguage: "Select Language",
      commonSymptoms: "Common Symptoms",
      clickSymptomConsult: "Click on a symptom for quick consultation",
      currentAssessment: "Current Assessment",
      severityLevel: "Severity Level",
      recommendation: "Recommendation",
      aiDoctorConsultation: "AI Doctor Consultation",
      available247: "Available 24/7",
      currentlySpeaking: "Currently speaking in",
      typeSymptoms: "Type your symptoms or health concerns...",
      listeningSpeak: "Listening... Speak now",
      voiceNotSupported: "Voice recognition not supported",
      clickMicrophone: "Click microphone to speak or type your message",
      
      // Symptoms
      fever: "Fever",
      headache: "Headache",
      cough: "Cough",
      chestPain: "Chest Pain",
      difficultyBreathing: "Difficulty Breathing",
      stomachPain: "Stomach Pain",
      dizziness: "Dizziness",
      nausea: "Nausea",
      
      // Severity
      mild: "mild",
      moderate: "moderate",
      high: "high",
      
      // Emergency
      emergency: "Emergency",
      emergencyResponse: "Emergency Response",
      selectEmergencyType: "Select Emergency Type",
      patientLocation: "Patient Location",
      describeEmergency: "Describe the emergency situation...",
      patientAge: "Patient Age",
      patientGender: "Patient Gender",
      male: "Male",
      female: "Female",
      other: "Other",
      reportEmergency: "Report Emergency",
      
      // Dashboard
      welcome: "Welcome",
      upcomingConsultations: "Upcoming Consultations",
      recentActivity: "Recent Activity",
      bookConsultation: "Book Consultation",
      viewHistory: "View History",
      
      // Forms
      submit: "Submit",
      cancel: "Cancel",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      search: "Search",
    }
  },
  hi: {
    translation: {
      // Navigation & Common
      home: "होम",
      about: "हमारे बारे में",
      contact: "संपर्क करें",
      login: "लॉगिन",
      logout: "लॉगआउट",
      dashboard: "डैशबोर्ड",
      
      // AI Consultation
      aiConsultation: "एआई वॉयस परामर्श",
      aiConsultationDesc: "तुरंत स्वास्थ्य मार्गदर्शन के लिए अपनी पसंदीदा भाषा में हमारे एआई डॉक्टर से बात करें",
      selectLanguage: "भाषा चुनें",
      commonSymptoms: "सामान्य लक्षण",
      clickSymptomConsult: "त्वरित परामर्श के लिए किसी लक्षण पर क्लिक करें",
      currentAssessment: "वर्तमान आकलन",
      severityLevel: "गंभीरता स्तर",
      recommendation: "सिफारिश",
      aiDoctorConsultation: "एआई डॉक्टर परामर्श",
      available247: "24/7 उपलब्ध",
      currentlySpeaking: "वर्तमान में बोल रहे हैं",
      typeSymptoms: "अपने लक्षण या स्वास्थ्य चिंताएं टाइप करें...",
      listeningSpeak: "सुन रहा है... अब बोलें",
      voiceNotSupported: "वॉयस पहचान समर्थित नहीं है",
      clickMicrophone: "बोलने के लिए माइक्रोफ़ोन पर क्लिक करें या अपना संदेश टाइप करें",
      
      // Symptoms
      fever: "बुखार",
      headache: "सिरदर्द",
      cough: "खांसी",
      chestPain: "सीने में दर्द",
      difficultyBreathing: "सांस लेने में कठिनाई",
      stomachPain: "पेट दर्द",
      dizziness: "चक्कर आना",
      nausea: "मतली",
      
      // Severity
      mild: "हल्का",
      moderate: "मध्यम",
      high: "उच्च",
      
      // Emergency
      emergency: "आपातकाल",
      emergencyResponse: "आपातकालीन प्रतिक्रिया",
      selectEmergencyType: "आपातकालीन प्रकार चुनें",
      patientLocation: "रोगी का स्थान",
      describeEmergency: "आपातकालीन स्थिति का वर्णन करें...",
      patientAge: "रोगी की आयु",
      patientGender: "रोगी का लिंग",
      male: "पुरुष",
      female: "महिला",
      other: "अन्य",
      reportEmergency: "आपातकाल रिपोर्ट करें",
      
      // Dashboard
      welcome: "स्वागत है",
      upcomingConsultations: "आगामी परामर्श",
      recentActivity: "हाल की गतिविधि",
      bookConsultation: "परामर्श बुक करें",
      viewHistory: "इतिहास देखें",
      
      // Forms
      submit: "जमा करें",
      cancel: "रद्द करें",
      save: "सहेजें",
      edit: "संपादित करें",
      delete: "हटाएं",
      search: "खोजें",
    }
  },
  bn: {
    translation: {
      // Navigation & Common
      home: "হোম",
      about: "আমাদের সম্পর্কে",
      contact: "যোগাযোগ",
      login: "লগইন",
      logout: "লগআউট",
      dashboard: "ড্যাশবোর্ড",
      
      // AI Consultation
      aiConsultation: "এআই ভয়েস পরামর্শ",
      aiConsultationDesc: "তাৎক্ষণিক স্বাস্থ্য নির্দেশনার জন্য আপনার পছন্দের ভাষায় আমাদের এআই ডাক্তারের সাথে কথা বলুন",
      selectLanguage: "ভাষা নির্বাচন করুন",
      commonSymptoms: "সাধারণ লক্ষণ",
      clickSymptomConsult: "দ্রুত পরামর্শের জন্য একটি লক্ষণে ক্লিক করুন",
      currentAssessment: "বর্তমান মূল্যায়ন",
      severityLevel: "তীব্রতার স্তর",
      recommendation: "সুপারিশ",
      aiDoctorConsultation: "এআই ডাক্তার পরামর্শ",
      available247: "২৪/৭ উপলব্ধ",
      currentlySpeaking: "বর্তমানে কথা বলছে",
      typeSymptoms: "আপনার লক্ষণ বা স্বাস্থ্য সমস্যা টাইপ করুন...",
      listeningSpeak: "শুনছি... এখন বলুন",
      voiceNotSupported: "ভয়েস স্বীকৃতি সমর্থিত নয়",
      clickMicrophone: "কথা বলতে মাইক্রোফোনে ক্লিক করুন বা আপনার বার্তা টাইপ করুন",
      
      // Symptoms
      fever: "জ্বর",
      headache: "মাথাব্যথা",
      cough: "কাশি",
      chestPain: "বুকে ব্যথা",
      difficultyBreathing: "শ্বাসকষ্ট",
      stomachPain: "পেট ব্যথা",
      dizziness: "মাথা ঘোরা",
      nausea: "বমি বমি ভাব",
      
      // Severity
      mild: "হালকা",
      moderate: "মাঝারি",
      high: "উচ্চ",
      
      // Emergency
      emergency: "জরুরি",
      emergencyResponse: "জরুরি প্রতিক্রিয়া",
      selectEmergencyType: "জরুরি ধরন নির্বাচন করুন",
      patientLocation: "রোগীর অবস্থান",
      describeEmergency: "জরুরি পরিস্থিতি বর্ণনা করুন...",
      patientAge: "রোগীর বয়স",
      patientGender: "রোগীর লিঙ্গ",
      male: "পুরুষ",
      female: "মহিলা",
      other: "অন্যান্য",
      reportEmergency: "জরুরি রিপোর্ট করুন",
      
      // Dashboard
      welcome: "স্বাগতম",
      upcomingConsultations: "আসন্ন পরামর্শ",
      recentActivity: "সাম্প্রতিক কার্যকলাপ",
      bookConsultation: "পরামর্শ বুক করুন",
      viewHistory: "ইতিহাস দেখুন",
      
      // Forms
      submit: "জমা দিন",
      cancel: "বাতিল করুন",
      save: "সংরক্ষণ করুন",
      edit: "সম্পাদনা করুন",
      delete: "মুছুন",
      search: "অনুসন্ধান করুন",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
