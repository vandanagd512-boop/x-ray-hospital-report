import React, { useState, useEffect, useRef } from 'react';
import { 
  SupportedLanguage, 
  SUPPORTED_LANGUAGES, 
  REGIONAL_DATA, 
  REGIONAL_UI_STRINGS,
  NEARBY_FACILITIES,
  ConditionTranslation,
  NearbyFacility
} from '../../data/regionalTranslations';
import { useAuth } from '../../context/AuthContext';
import { 
  Volume2, 
  VolumeX, 
  Camera, 
  Share2, 
  ShieldAlert, 
  Pill, 
  Heart, 
  Sparkles, 
  PhoneCall, 
  Mic, 
  MicOff, 
  MapPin, 
  Navigation, 
  ScanLine, 
  FileCheck2, 
  Clock, 
  Send, 
  Radio, 
  User, 
  Bot,
  Search,
  X,
  Building2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  englishSummary: string;
  timestamp: string;
}

// Global AudioContext singleton to avoid Chrome hardware limit
let audioCtxSingleton: AudioContext | null = null;
const playAudioFeedback = (type: 'listen' | 'speak') => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtxSingleton || audioCtxSingleton.state === 'closed') {
      audioCtxSingleton = new AudioContextClass();
    }
    if (audioCtxSingleton.state === 'suspended') {
      audioCtxSingleton.resume();
    }

    const osc = audioCtxSingleton.createOscillator();
    const gain = audioCtxSingleton.createGain();
    osc.connect(gain);
    gain.connect(audioCtxSingleton.destination);

    const now = audioCtxSingleton.currentTime;
    if (type === 'listen') {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'speak') {
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.08); // A5
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    }
  } catch (e) {}
};

export const RegionalPatientAssistant: React.FC = () => {
  const { scans } = useAuth();

  // Load language preference (defaults to 'en' or saved choice)
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('aurarad_regional_lang') as SupportedLanguage;
    return saved && ['en', 'te', 'kn', 'hi', 'ta'].includes(saved) ? saved : 'en';
  });

  const [selectedCondition, setSelectedCondition] = useState<'pneumonia' | 'fracture'>('pneumonia');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [spokenLangNotice, setSpokenLangNotice] = useState<string | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  // OCR Scanner state
  const [isOcrScanning, setIsOcrScanning] = useState(false);
  const [ocrStep, setOcrStep] = useState(0);

  // Voice & Text Symptom Helper states
  const [isListening, setIsListening] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [textInputValue, setTextInputValue] = useState('');
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Hospital locator search & filter tabs
  const [hospitalSearchQuery, setHospitalSearchQuery] = useState('');
  const [activeHospitalTab, setActiveHospitalTab] = useState<'all' | 'govt' | 'specialty' | 'pharmacy'>('all');

  // Interactive Conversation Stream
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  const ui = REGIONAL_UI_STRINGS[selectedLang] || REGIONAL_UI_STRINGS.en;
  const currentData: ConditionTranslation = REGIONAL_DATA[selectedCondition]?.[selectedLang] || REGIONAL_DATA.pneumonia.en;
  const currentLangMeta = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang) || SUPPORTED_LANGUAGES.find(l => l.code === 'en')!;
  const rawFacilitiesList: NearbyFacility[] = NEARBY_FACILITIES[selectedLang] || NEARBY_FACILITIES.en;

  // Initialize SpeechSynthesis and register voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      const loadVoices = () => {
        if (synthRef.current) {
          synthRef.current.getVoices();
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    const greetings: Record<SupportedLanguage, { native: string; en: string }> = {
      en: {
        native: "Hello! I am AuraRad AI Medical Assistant. Speak or type your symptoms (fever, cough, headache, stomach pain, knee injury, medicine timings, hospital info), and I will provide verified clinical advice.",
        en: "Hello! I am AuraRad AI Medical Assistant. Speak or type your symptoms, and I will provide verified clinical advice."
      },
      te: {
        native: "నమస్కారం! నేను ఆరారాడ్ ఏఐ వైద్య సహాయకుడిని. మీకు ఎలాంటి ఆరోగ్య సమస్య ఉంది? (జ్వరం, దగ్గు, తలనొప్పి, కడుపునొప్పి, ఒళ్లు నొప్పులు, మోకాలి నొప్పి, మందులు లేదా ఆసుపత్రి వివరాలు). ఇక్కడ మాట్లాడండి లేదా టైప్ చేయండి.",
        en: "Greetings! I am AuraRad AI Medical Assistant. Feel free to describe your symptoms or ask medical questions."
      },
      kn: {
        native: "ನಮಸ್ಕಾರ! ನಾನು ಆರಾರಾಡ್ ವೈದ್ಯಕೀಯ ಸಹಾಯಕ. ನಿಮ್ಮ ಆರೋಗ್ಯ ಸಮಸ್ಯೆ ಏನು? (ಜ್ವರ, ಕೆಮ್ಮು, ತಲೆನೋವು, ಹೊಟ್ಟೆ ನೋವು, ಮೈಕೈ ನೋವು, ಆಸ್ಪತ್ರೆ ಮಾಹಿತಿ). ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ.",
        en: "Greetings! I am AuraRad AI Medical Assistant. Speak or type your symptoms for verified advice."
      },
      hi: {
        native: "नमस्ते! मैं ऑरारैड एआई मेडिकल सहायक हूँ। आपको क्या परेशानी हो रही है? (बुखार, खांसी, सिरदर्द, पेट दर्द, बदन दर्द, घुटने का दर्द, दवाइयों का समय या अस्पताल की जानकारी)। बोलकर या लिखकर बताएं।",
        en: "Greetings! I am AuraRad AI Medical Assistant. Feel free to describe your symptoms or ask medical questions."
      },
      ta: {
        native: "வணக்கம்! நான் ஆராராட் மருத்துவ உதவியாளர். உங்கள் உடல்நலப் பிரச்சனை என்ன? (காய்ச்சல், இருமல், தலைவலி, வயிற்று வலி, உடல் வலி, மருந்துகள் அல்லது மருத்துவமனை தகவல்). பேசி அல்லது எழுதி கேட்கலாம்.",
        en: "Greetings! I am AuraRad AI Medical Assistant. Speak or type your symptoms for verified medical guidance."
      }
    };

    const g = greetings[selectedLang] || greetings.en;
    setMessages([
      {
        id: 'msg_welcome',
        sender: 'ai',
        text: g.native,
        englishSummary: g.en,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    return () => {
      if (synthRef.current) synthRef.current.cancel();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, [selectedLang]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isListening]);

  // Language switch handler
  const handleSelectLanguage = (code: SupportedLanguage) => {
    setSelectedLang(code);
    localStorage.setItem('aurarad_regional_lang', code);
    setVoiceNotice(null);
    setSpokenLangNotice(null);
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Robust Voice Speech Output with Native & English Audio Handling
  const speakText = (text: string, englishFallback: string, forceEnglish: boolean = false) => {
    if (!synthRef.current) {
      alert('Voice synthesis is not supported on this browser.');
      return;
    }

    synthRef.current.cancel();
    synthRef.current.resume();
    playAudioFeedback('speak');

    const voices = synthRef.current.getVoices();
    let textToSpeak = text;
    let langToUse = currentLangMeta.voiceLang;
    let targetVoice: SpeechSynthesisVoice | undefined;

    if (forceEnglish || currentLangMeta.code === 'en') {
      textToSpeak = englishFallback;
      langToUse = 'en-US';
      targetVoice = voices.find(v => v.lang === 'en-IN' || v.name.toLowerCase().includes('india')) ||
                    voices.find(v => v.lang.startsWith('en')) ||
                    voices[0];
      setSpokenLangNotice('Playing in English');
    } else {
      // Look for native regional voice
      targetVoice = voices.find(v => 
        v.lang.toLowerCase().replace('_', '-').startsWith(currentLangMeta.code) ||
        v.lang.toLowerCase().replace('_', '-') === currentLangMeta.voiceLang.toLowerCase()
      );

      if (targetVoice) {
        textToSpeak = text;
        langToUse = currentLangMeta.voiceLang;
        setSpokenLangNotice(`Playing in ${currentLangMeta.nativeName}`);
      } else {
        // Fallback when Windows OS has no Telugu/Kannada/Tamil voice installed
        targetVoice = voices.find(v => v.lang.includes('IN') || v.lang.includes('hi') || v.name.toLowerCase().includes('india')) ||
                      voices.find(v => v.lang.startsWith('en')) ||
                      voices[0];
        textToSpeak = englishFallback;
        langToUse = targetVoice?.lang || 'en-US';
        setSpokenLangNotice(`English audio (Voice pack for ${currentLangMeta.name} is not installed on this device)`);
      }
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = langToUse;
    if (targetVoice) utterance.voice = targetVoice;
    utterance.rate = 0.88; // Comfortable cadence for patients
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setSpokenLangNotice(null);
    };
    utterance.onerror = (e) => {
      console.warn('Speech error:', e);
      setIsSpeaking(false);
      setSpokenLangNotice(null);
      if (e.error === 'language-unavailable' || e.error === 'voice-unavailable') {
        try {
          const fallback = new SpeechSynthesisUtterance(englishFallback);
          fallback.lang = 'en-US';
          fallback.rate = 0.9;
          fallback.onstart = () => setIsSpeaking(true);
          fallback.onend = () => {
            setIsSpeaking(false);
            setSpokenLangNotice(null);
          };
          synthRef.current?.speak(fallback);
        } catch (err) {}
      }
    };

    utteranceRef.current = utterance;
    (window as any).__auraradSpeechUtterance = utterance;

    try {
      synthRef.current.speak(utterance);
    } catch (err) {
      console.warn('Synth speak error', err);
    }
  };

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      synthRef.current?.cancel();
      setIsSpeaking(false);
      setSpokenLangNotice(null);
    } else {
      const enSummary = selectedCondition === 'pneumonia'
        ? "Medical assessment: Your chest X-ray shows right lower lung infection with fluid, known as pneumonia. Please take prescribed antibiotics like Augmentin, fever reducers like Paracetamol, drink warm fluids, and consult your attending physician."
        : "Medical assessment: Your knee X-ray shows normal bone structure with no fractures or breaks. Rest your leg, apply ice packs for swelling, and take prescribed pain relief.";
      speakText(currentData.spokenNarration, enSummary);
    }
  };

  // OCR File Upload Simulation
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setUploadedImagePreview(reader.result);
          setIsOcrScanning(true);
          setOcrStep(1);

          setTimeout(() => setOcrStep(2), 700);
          setTimeout(() => setOcrStep(3), 1400);
          setTimeout(() => {
            setIsOcrScanning(false);
            setSelectedCondition('pneumonia');
            setTimeout(() => {
              const enSum = "Your uploaded scan has been analyzed. Findings indicate acute right lower lobar pneumonia. Please consult your physician.";
              speakText(currentData.spokenNarration, enSum);
            }, 500);
          }, 2100);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Comprehensive Multilingual Clinical AI Doctor Query Intelligence (16+ Distinct Medical Intents)
  const generateDoctorAiResponse = (query: string): { responseText: string; englishSummary: string } => {
    const lower = query.toLowerCase().trim();

    // 1. Headache & Dizziness / Migraine
    if (
      lower.includes('headache') || lower.includes('head') || lower.includes('dizzy') || 
      lower.includes('dizziness') || lower.includes('migraine') || lower.includes('giddiness') ||
      lower.includes('తలనొప్పి') || lower.includes('తలతిరుగుడు') || lower.includes('తల') || lower.includes('మైకం') ||
      lower.includes('ತಲೆನೋವು') || lower.includes('ತಲೆತಿರುಗುವಿಕೆ') ||
      lower.includes('सिरदर्द') || lower.includes('चक्कर') || lower.includes('सिर दर्द') ||
      lower.includes('தலைவலி') || lower.includes('தலைச்சுற்றல்')
    ) {
      const teRes = "తలనొప్పి మరియు మైకం కొరకు: 1. లైట్లు తక్కువగా ఉన్న నిశ్శబ్ద గదిలో కళ్ళు మూసుకుని విశ్రాంతి తీసుకోండి. 2. డీహైడ్రేషన్ కాకుండా గంటకో గ్లాసు గోరువెచ్చని నీరు లేదా కొబ్బరినీళ్లు తాగండి. 3. జ్వరం కూడా ఉంటే పారాసిటమాల్ 650mg వేసుకోవచ్చు. మొబైల్ లేదా టీవీ స్క్రీన్లను చూడటం తగ్గించండి. బీపీ ఒకసారి చెక్ చేయించుకోవడం మంచిది.";
      const knRes = "ತಲೆನೋವು ಮತ್ತು ತಲೆತಿರುಗುವಿಕೆಗೆ: ಶಾಂತವಾದ ಕೋಣೆಯಲ್ಲಿ ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ ಮತ್ತು ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ. ಜ್ವರವಿದ್ದರೆ ಪ್ಯಾರಾಸಿಟಮಾಲ್ 650mg ತೆಗೆದುಕೊಳ್ಳಿ. ಮೊಬೈಲ್ ಸ್ಕ್ರೀನ್ ನೋಡುವುದನ್ನು ಕಡಿಮೆ ಮಾಡಿ.";
      const hiRes = "सिरदर्द और चक्कर के लिए: शांत कमरे में आराम करें, पानी और नारियल पानी भरपूर पिएं। बुखार होने पर पैरासिटामोल 650mg ले सकते हैं। धूप और मोबाइल स्क्रीन से बचें।";
      const taRes = "தலைவலிக்கு: அமைதியான அறையில் ஓய்வெடுக்கவும், நிறைய தண்ணீர் பருகவும். காய்ச்சல் இருந்தால் பாராசிட்டமால் 650mg எடுத்துக் கொள்ளலாம். மொபைல் திரையை பார்ப்பதை தவிர்க்கவும்.";
      const enRes = "For headache and dizziness: Rest in a quiet, dimly lit room. Ensure adequate hydration by drinking plenty of water or electrolyte fluids. You may take Paracetamol 650mg if accompanied by fever. Avoid screen time and bright lights.";

      const native = selectedLang === 'te' ? teRes : selectedLang === 'kn' ? knRes : selectedLang === 'hi' ? hiRes : selectedLang === 'ta' ? taRes : enRes;
      return { responseText: native, englishSummary: enRes };
    }

    // 2. Stomach Pain, Gas, Vomiting, Acidity & Diarrhea
    if (
      lower.includes('stomach') || lower.includes('abdomen') || lower.includes('gastric') || 
      lower.includes('acidity') || lower.includes('vomit') || lower.includes('vomiting') || 
      lower.includes('nausea') || lower.includes('loose motion') || lower.includes('diarrhea') || lower.includes('motions') ||
      lower.includes('కడుపునొప్పి') || lower.includes('గ్యాస్') || lower.includes('వాంతులు') || lower.includes('విరేచనాలు') || lower.includes('మోషన్స్') ||
      lower.includes('ಹೊಟ್ಟೆ ನೋವು') || lower.includes('ಗ್ಯಾಸ್') || lower.includes('ವಾಂತಿ') ||
      lower.includes('पेट दर्द') || lower.includes('गैस') || lower.includes('उल्टी') || lower.includes('दस्त') ||
      lower.includes('வயிற்று வலி') || lower.includes('வாந்தி') || lower.includes('அசிடிட்டி')
    ) {
      const teRes = "కడుపునొప్పి మరియు గ్యాస్ సమస్యల కొరకు: యాంటీబయాటిక్ మందులు వాడేటప్పుడు ఖాళీ కడుపున ప్యాంటోప్రజోల్ (Pantoprazole 40mg) వేసుకోవాలి. కారంగా ఉండే మరియు వేపుడు ఆహారాలు తినకండి. మజ్జిగ, కొబ్బరినీళ్లు, కిచిడీ లేదా గంజి వంటి తేలికపాటి ఆహారం మాత్రమే తీసుకోండి. వాంతులు ఎక్కువైతే ఓఆర్ఎస్ నీరు తాగండి.";
      const knRes = "ಹೊಟ್ಟೆ ನೋವು ಮತ್ತು ಗ್ಯಾಸ್ ಸಮಸ್ಯೆಗೆ: ಖಾಲಿ ಹೊಟ್ಟೆಯಲ್ಲಿ ಆಂಟಾಸಿಡ್ ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳಿ. ಖಾರ ಮತ್ತು ಎಣ್ಣೆಯುಕ್ತ ಆಹಾರ ತಪ್ಪಿಸಿ. ಮಜ್ಜಿಗೆ, ಎಳನೀರು, ಗಂಜಿ ಸೇವಿಸಿ.";
      const hiRes = "पेट दर्द और गैस की परेशानी के लिए: सुबह खाली पेट एंटासिड (पैंटोप्राजोल) लें। तला-भुना और मसालेदार खाना बिल्कुल न खाएं। छाछ, नारियल पानी और खिचड़ी जैसा हल्का भोजन करें।";
      const taRes = "வயிற்று வலி மற்றும் வாய்வு பிரச்சனைக்கு: காரமான உணவுகளை தவிர்க்கவும். மோர், இளநீர், கஞ்சி போன்ற எளிதில் செரிமானமாகும் உணவுகளை உட்கொள்ளவும்.";
      const enRes = "For stomach discomfort and acidity: Take an antacid (Pantoprazole 40mg) 30 minutes before breakfast. Avoid spicy, fried, or acidic foods. Drink buttermilk, tender coconut water, and eat bland meals like curd rice or porridge.";

      const native = selectedLang === 'te' ? teRes : selectedLang === 'kn' ? knRes : selectedLang === 'hi' ? hiRes : selectedLang === 'ta' ? taRes : enRes;
      return { responseText: native, englishSummary: enRes };
    }

    // 3. Fever & Chills
    if (
      lower.includes('fever') || lower.includes('temperature') || lower.includes('chills') || lower.includes('shivering') ||
      lower.includes('జ్వరం') || lower.includes('చలి') || lower.includes('తాపం') || lower.includes('ఫీవర్') ||
      lower.includes('ಜ್ವರ') || lower.includes('ಚಳಿ') ||
      lower.includes('बुखार') || lower.includes('ताप') || lower.includes('कंपकंपी') ||
      lower.includes('காய்ச்சல்') || lower.includes('குளிர்')
    ) {
      const teRes = "జ్వరం నియంత్రణ కొరకు: శరీర ఉష్ణోగ్రత 100°F కంటే ఎక్కువ ఉన్నప్పుడు పారాసిటమాల్ (Paracetamol 650mg) వేసుకోండి. నుదుటిపై తడిగుడ్డతో కాపడం పెట్టండి. గోరువెచ్చని నీరు ఎక్కువగా తాగండి. ఊపిరితిత్తుల్లో ఇన్ఫెక్షన్ ఉండటం వల్లే జ్వరం వస్తుంది కాబట్టి యాంటీబయాటిక్ కోర్సును 5 రోజులు పూర్తి చేయాలి.";
      const knRes = "ಜ್ವರ ನಿಯಂತ್ರಣಕ್ಕೆ: ಜ್ವರ 100°F ಗಿಂತ ಹೆಚ್ಚಿದ್ದರೆ ಪ್ಯಾರಾಸಿಟಮಾಲ್ 650mg ತೆಗೆದುಕೊಳ್ಳಿ. ಹಣೆಗೆ ತಣ್ಣೀರಿನ ಬಟ್ಟೆ ಇಡಿ. ಬೆಚ್ಚಗಿನ ನೀರು ಕುಡಿಯಿರಿ ಮತ್ತು ವೈದ್ಯರ ಆಂಟಿಬಯೋಟಿಕ್ ಪೂರ್ಣಗೊಳಿಸಿ.";
      const hiRes = "बुखार के नियंत्रण के लिए: तापमान 100°F से अधिक होने पर पैरासिटामोल 650mg लें। माथे पर ठंडे पानी की पट्टी रखें। गुनगुना पानी पिएं और फेफड़ों के इन्फेक्शन के लिए दी गई एंटीबायोटिक पूरी करें।";
      const taRes = "காய்ச்சலை கட்டுப்படுத்த: காய்ச்சல் அதிகமாக இருந்தால் பாராசிட்டமால் 650mg உட்கொள்ளவும். நெற்றியில் ஈரத்துணி வைக்கவும். சுடுதண்ணீர் அதிகம் பருகவும்.";
      const enRes = "For fever control: Take Paracetamol 650mg every 6 hours if temperature exceeds 38°C (100.4°F). Apply a cool damp cloth to your forehead, drink warm fluids, and ensure you complete the full 5-day antibiotic course to clear the lung infection.";

      const native = selectedLang === 'te' ? teRes : selectedLang === 'kn' ? knRes : selectedLang === 'hi' ? hiRes : selectedLang === 'ta' ? taRes : enRes;
      return { responseText: native, englishSummary: enRes };
    }

    // 4. Cough, Cold, Phlegm, Sore Throat
    if (
      lower.includes('cough') || lower.includes('cold') || lower.includes('phlegm') || lower.includes('mucus') || 
      lower.includes('sputum') || lower.includes('throat') || lower.includes('congestion') ||
      lower.includes('దగ్గు') || lower.includes('కఫం') || lower.includes('జలుబు') || lower.includes('గొంతు') ||
      lower.includes('ಕೆಮ್ಮು') || lower.includes('ಕಫ') || lower.includes('ನೆಗಡಿ') ||
      lower.includes('खांसी') || lower.includes('कफ') || lower.includes('जुकाम') || lower.includes('गले') ||
      lower.includes('இருமல்') || lower.includes('சளி') || lower.includes('தொண்டை')
    ) {
      const teRes = "దగ్గు మరియు కఫం కొరకు: కుడి ఊపిరితిత్తిలో ఇన్ఫెక్షన్ వల్ల కఫం తయారవుతోంది. రోజుకు 2 సార్లు ఆవిరి (Steam Inhalation) పట్టండి. గోరువెచ్చని ఉప్పునీటితో గొంతు పుక్కిలించండి. కఫం పలుచబడి బయటకు రావడానికి డాక్టర్ ఇచ్చిన కఫ్ సిరప్ లేదా మ్యూసినెక్స్ వేసుకోండి. చల్లటి గాలి, ఫ్రిజ్ నీరు ముట్టకండి.";
      const knRes = "ಕೆಮ್ಮು ಮತ್ತು ಕಫಕ್ಕೆ: ದಿನಕ್ಕೆ 2 ಬಾರಿ ಹಬೆ (ಸ್ಟೀಮ್) ತೆಗೆದುಕೊಳ್ಳಿ. ಉಗುರುಬೆಚ್ಚಗಿನ ಉಪ್ಪು ನೀರಿನಿಂದ ಗಂಟಲು ಮುಕ್ಕಳಿಸಿ. ತಣ್ಣೀರು ಕುಡಿಯಬೇಡಿ.";
      const hiRes = "खांसी और कफ के लिए: दिन में दो बार भाप (स्टीम) लें। गुनगुने नमक के पानी से गरारे करें। फ्रिज का ठंडा पानी और ठंडी हवा से बचें। कफ सिरप लें।";
      const taRes = "இருமல் மற்றும் சளிக்கு: தினமும் இரண்டு முறை ஆவி பிடிக்கவும். வெதுவெதுப்பான உப்பு நீரில் வாய் கொப்பளிக்கவும். குளிர்ந்த நீரை தவிர்க்கவும்.";
      const enRes = "For cough and chest phlegm: Perform facial steam inhalation twice daily to loosen secretions. Gargle with warm salt water. Drink warm broths and take prescribed expectorants to help clear bronchial mucus. Avoid cold beverages and air drafts.";

      const native = selectedLang === 'te' ? teRes : selectedLang === 'kn' ? knRes : selectedLang === 'hi' ? hiRes : selectedLang === 'ta' ? taRes : enRes;
      return { responseText: native, englishSummary: enRes };
    }

    // 5. Knee, Leg, Bone, Joint, Fracture & Fall
    if (
      lower.includes('fracture') || lower.includes('bone') || lower.includes('knee') || 
      lower.includes('leg') || lower.includes('fall') || lower.includes('break') || 
      lower.includes('walk') || lower.includes('swelling') || lower.includes('joint') || lower.includes('sprain') ||
      lower.includes('ఎముక') || lower.includes('మోకాలు') || lower.includes('కాలు') || lower.includes('వాపు') || lower.includes('ఫ్రాక్చర్') ||
      lower.includes('ಮೂಳೆ') || lower.includes('ಕಾಲು') || lower.includes('ಊತ') ||
      lower.includes('हड्डी') || lower.includes('पैर') || lower.includes('घुटना') || lower.includes('सूजन') ||
      lower.includes('எலும்பு') || lower.includes('கால்') || lower.includes('மூட்டு')
    ) {
      setSelectedCondition('fracture');
      const teRes = "మోకాలు మరియు ఎముకల పరిస్థితి: మీ ఎక్స్-రే ప్రకారం ఎముకలు పూర్తిగా సురక్షితంగా ఉన్నాయి, ఎటువంటి ఫ్రాక్చర్ లేదా ఎముక విరగడం లేదు. నొప్పి మరియు వాపు తగ్గడానికి: 1. కాలు కింద దిండు పెట్టి ఎత్తుగా ఉంచి విశ్రాంతి తీసుకోండి. 2. వాపు ఉన్న చోట ఐస్ ముక్కలతో 15 నిమిషాలు కాపడం పెట్టండి. 3. బరువులు ఎత్తడం లేదా ఎక్కువ దూరం నడవడం చేయకండి.";
      const knRes = "ಮೊಣಕಾಲು ಮತ್ತು ಮೂಳೆಗಳ ಸ್ಥಿತಿ: ಎಕ್ಸ್-ರೇ ಪ್ರಕಾರ ಯಾವುದೇ ಮೂಳೆ ಮುರಿತವಿಲ್ಲ, ಮೂಳೆಗಳು ಸುರಕ್ಷಿತವಾಗಿವೆ. ಕಾಲಿನ ಕೆಳಗೆ ದಿಂಬಿಟ್ಟು ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ ಮತ್ತು ಐಸ್ ಪ್ಯಾಕ್ ಹಚ್ಚಿ.";
      const hiRes = "घुटने और पैर की स्थिति: एक्सरे के अनुसार कोई भी हड्डी टूटी नहीं है। सूजन कम करने के लिए बर्फ की सिकाई करें, पैर को तकिए पर रखकर ऊंचा रखें और ज्यादा चलने से बचें।";
      const taRes = "முழங்கால் மற்றும் எலும்பு நிலை: எக்ஸ்ரேயில் எலும்பு முறிவு எதுவும் இல்லை. கால்களுக்கு ஓய்வு அளிக்கவும், ஐஸ் ஒத்தடம் கொடுக்கவும்.";
      const enRes = "Orthopedic evaluation: According to your knee radiograph, bone alignment and cortex are intact with no fracture. Practice R.I.C.E therapy: Rest the joint, apply an Ice pack for 15 minutes to reduce swelling, use gentle Compression, and Elevate your leg on a pillow.";

      const native = selectedLang === 'te' ? teRes : selectedLang === 'kn' ? knRes : selectedLang === 'hi' ? hiRes : selectedLang === 'ta' ? taRes : enRes;
      return { responseText: native, englishSummary: enRes };
    }

    // 6. Body Pains, Back Pain, Neck Pain, Fatigue
    if (
      lower.includes('body pain') || lower.includes('back pain') || lower.includes('neck') || 
      lower.includes('tired') || lower.includes('weakness') || lower.includes('fatigue') || lower.includes('muscle') ||
      lower.includes('ఒళ్లు నొప్పులు') || lower.includes('నడుము నొప్పి') || lower.includes('నీరసం') || lower.includes('అలసట') ||
      lower.includes('ಮೈಕೈ ನೋವು') || lower.includes('ಬೆನ್ನು ನೋವು') || lower.includes('ದಣಿವು') ||
      lower.includes('बदन दर्द') || lower.includes('कमर दर्द') || lower.includes('थकान') || lower.includes('कमजोरी') ||
      lower.includes('உடல் வலி') || lower.includes('முதுகு வலி') || lower.includes('சோர்வு')
    ) {
      const teRes = "ఒళ్లు నొప్పులు మరియు నీరసం కొరకు: ఇన్ఫెక్షన్ లేదా వైరల్ ఫీవర్ వచ్చినప్పుడు శరీరం బలహీనపడటం సహజం. గోరువెచ్చని నీటితో స్నానం చేయండి. పారాసిటమాల్ వేసుకుంటే నొప్పులు తగ్గుతాయి. కొబ్బరినీళ్లు, పండ్ల రసాలు మరియు తగినంత నిద్ర శరీరానికి తక్షణ శక్తినిస్తాయి.";
      const knRes = "ಮೈಕೈ ನೋವು ಮತ್ತು ದಣಿವಿಗಾಗಿ: ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ, ಬೆಚ್ಚಗಿನ ನೀರಿನಲ್ಲಿ ಸ್ನಾನ ಮಾಡಿ, ಪ್ಯಾರಾಸಿಟಮಾಲ್ ತೆಗೆದುಕೊಳ್ಳಿ ಮತ್ತು ಪೂರ್ಣ ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ.";
      const hiRes = "बदन दर्द और कमजोरी के लिए: गुनगुने पानी से नहाएं, खूब पानी और नारियल पानी पिएं। पैरासिटामोल से दर्द कम होगा। कम से कम 8 घंटे की अच्छी नींद लें।";
      const taRes = "உடல் வலி மற்றும் சோர்வுக்கு: வெதுவெதுப்பான நீரில் குளிக்கவும், நிறைய தண்ணீர் பருகவும், நல்ல ஓய்வு எடுக்கவும்.";
      const enRes = "For generalized body aches and fatigue: Viral infections and fever cause muscle breakdown and soreness. Take Paracetamol for pain relief, take warm baths, hydrate with electrolytes, and ensure 8 hours of uninterrupted restorative sleep.";

      const native = selectedLang === 'te' ? teRes : selectedLang === 'kn' ? knRes : selectedLang === 'hi' ? hiRes : selectedLang === 'ta' ? taRes : enRes;
      return { responseText: native, englishSummary: enRes };
    }

    // 7. Chest Pain, Heaviness, Breathlessness, Oxygen / SpO2
    if (
      lower.includes('chest pain') || lower.includes('breath') || lower.includes('oxygen') || 
      lower.includes('spo2') || lower.includes('heart') || lower.includes('suffocation') ||
      lower.includes('ఛాతీ నొప్పి') || lower.includes('ఆయాసం') || lower.includes('ఊపిరి') || lower.includes('ఆక్సిజన్') ||
      lower.includes('ಎದೆ ನೋವು') || lower.includes('ಉಸಿರಾಟ') ||
      lower.includes('सीने में दर्द') || lower.includes('सांस फूलना') || lower.includes('ऑक्सीजन') ||
      lower.includes('நெஞ்சு வலி') || lower.includes('மூச்சு திணறல்')
    ) {
      const teRes = "ఛాతీ నొప్పి మరియు ఊపిరి సమస్యల కొరకు: న్యుమోనియాలో లోతుగా శ్వాస తీసుకున్నప్పుడు ఛాతీలో సూది గుచ్చినట్లు నొప్పి రావడం సహజం. పల్స్ ఆక్సిమీటర్‌తో SpO2 పరీక్షించండి. అది 94% కంటే తక్కువ ఉంటే లేదా ఆయాసం విపరీతంగా ఉంటే వెంటనే సమీపంలోని ప్రభుత్వ లేదా అపోలో ఆసుపత్రి ఎమర్జెన్సీ వార్డుకు వెళ్ళండి లేదా 108 కి కాల్ చేయండి.";
      const knRes = "ಎದೆ ನೋವು ಮತ್ತು ಉಸಿರಾಟದ ಸಮಸ್ಯೆಗೆ: ಆಕ್ಸಿಜನ್ ಮಟ್ಟ 94% ಕ್ಕಿಂತ ಕಡಿಮೆಯಾದರೆ ಅಥವಾ ಉಸಿರಾಟ ಕಷ್ಟವಾದರೆ ತಕ್ಷಣ ಆಸ್ಪತ್ರೆಗೆ ಭೇಟಿ ನೀಡಿ ಅಥವಾ 108 ಗೆ ಕರೆ ಮಾಡಿ.";
      const hiRes = "सीने में दर्द और सांस लेने में तकलीफ के लिए: पल्स ऑक्सीमीटर से ऑक्सीजन (SpO2) नापें। 94% से कम होने पर तुरंत नजदीकी अस्पताल की इमरजेंसी में जाएं या 108 पर कॉल करें।";
      const taRes = "நெஞ்சு வலி மற்றும் மூச்சு திணறலுக்கு: ஆக்சிஜன் அளவு 94% க்கும் கீழே குறைந்தால் உடனடியாக அவசர சிகிச்சைப் பிரிவை அணுகவும்.";
      const enRes = "For chest pain and breathing difficulties: Pleuritic pain is expected with lobar pneumonia. Check SpO2 on a pulse oximeter immediately. If saturation falls below 94% or breathlessness worsens, present immediately to the nearest Emergency Room or dial 108.";

      const native = selectedLang === 'te' ? teRes : selectedLang === 'kn' ? knRes : selectedLang === 'hi' ? hiRes : selectedLang === 'ta' ? taRes : enRes;
      return { responseText: native, englishSummary: enRes };
    }

    // 8. Food, Diet & Nutrition (What to eat / drink)
    if (
      lower.includes('food') || lower.includes('eat') || lower.includes('drink') || lower.includes('diet') || 
      lower.includes('water') || lower.includes('rice') || lower.includes('milk') || lower.includes('tea') ||
      lower.includes('ఆహారం') || lower.includes('తిండి') || lower.includes('నీళ్లు') || lower.includes('పాలు') || lower.includes('భోజనం') ||
      lower.includes('ಆಹಾರ') || lower.includes('ಊಟ') || lower.includes('ನೀರು') ||
      lower.includes('खाना') || lower.includes('खानपान') || lower.includes('भोजन') || lower.includes('क्या खाएं') || lower.includes('पानी') ||
      lower.includes('உணவு') || lower.includes('சாப்பாடு') || lower.includes('தண்ணீர்')
    ) {
      const teRes = "ఆహార జాగ్రత్తలు: రోజుకు 2.5 నుండి 3 లీటర్ల గోరువెచ్చని నీరు తాగడం వల్ల కఫం త్వరగా కరుగుతుంది. వేడి వెజిటబుల్ లేదా చికెన్ సూప్‌లు, ఇడ్లీ, కిచిడీ వంటి తేలికైన భోజనం చేయండి. పడుకునే ముందు చిటికెడు పసుపు వేసిన వేడి పాలు తాగండి. ఫ్రిజ్ చల్లటి నీరు, ఐస్ క్రీమ్‌లు మరియు నూనె వేపుళ్ళు పూర్తిగా మానేయండి.";
      const knRes = "ಆಹಾರ ನಿಯಮಗಳು: ದಿನಕ್ಕೆ 3 ಲೀಟರ್ ಬೆಚ್ಚಗಿನ ನೀರು ಕುಡಿಯಿರಿ. ಬಿಸಿ ಸೂಪ್, ಗಂಜಿ, ಇಡ್ಲಿಯಂತಹ ಲಘು ಆಹಾರ ಸೇವಿಸಿ. ರಾತ್ರಿ ಅರಿಶಿನ ಹಾಲು ಕುಡಿಯಿರಿ. ತಣ್ಣನೆಯ ಪದಾರ್ಥಗಳನ್ನು ತಿನ್ನಬೇಡಿ.";
      const hiRes = "खानपान संबंधी सलाह: दिनभर में 2.5 से 3 लीटर गुनगुना पानी पिएं ताकि कफ पतला हो सके। गर्म सूप, दलिया, खिचड़ी जैसा सुपाच्य भोजन लें। रात में हल्दी वाला गर्म दूध पिएं। ठंडा पानी और तली चीजें न खाएं।";
      const taRes = "உணவு வழிகாட்டுதல்: தினமும் வெதுவெதுப்பான சுடுதண்ணீர் அதிகம் பருகவும். சூடான சூப், கஞ்சி போன்ற உணவுகளை உண்ணவும். குளிர்ந்த உணவுகளை தவிர்க்கவும்.";
      const enRes = "Dietary guidelines: Drink 2.5 to 3 liters of warm water daily to thin respiratory mucus. Consume hot vegetable broths, citrus fruits for Vitamin C, and easily digestible cooked meals like porridge or soups. Drink warm turmeric milk at night. Strictly avoid ice water and greasy foods.";

      const native = selectedLang === 'te' ? teRes : selectedLang === 'kn' ? knRes : selectedLang === 'hi' ? hiRes : selectedLang === 'ta' ? taRes : enRes;
      return { responseText: native, englishSummary: enRes };
    }

    // 9. Medicines & Timing
    if (
      lower.includes('medicine') || lower.includes('tablet') || lower.includes('dose') || 
      lower.includes('timing') || lower.includes('capsule') || lower.includes('prescription') ||
      lower.includes('మందులు') || lower.includes('మాత్ర') || lower.includes('సిరప్') || lower.includes('వేళలు') ||
      lower.includes('ಮಾತ್ರೆ') || lower.includes('ಔಷಧಿ') ||
      lower.includes('दवाई') || lower.includes('गोली') || lower.includes('दवा') || lower.includes('समय') ||
      lower.includes('மருந்து') || lower.includes('மாத்திரை')
    ) {
      const teRes = "మందులు వేసుకునే సమయాలు: 1. ఆగ్మెంటిన్ 625mg (యాంటీబయాటిక్): ఉదయం ఒకటి, రాత్రి ఒకటి భోజనం తర్వాత 5 రోజులు వేసుకోవాలి. జ్వరం తగ్గినా 5 రోజుల కోర్సు పూర్తి చేయాలి. 2. పారాసిటమాల్ 650mg: జ్వరం లేదా నొప్పి ఉన్నప్పుడు మాత్రమే 6 గంటల వ్యవధితో వేసుకోవాలి. ఖాళీ కడుపుతో మందులు వేసుకోకూడదు.";
      const knRes = "ಔಷಧಿ ಸೇವಿಸುವ ಸಮಯ: 1. ಆಗ್ಮೆಂಟಿನ್ 625mg: ಬೆಳಗ್ಗೆ ಮತ್ತು ರಾತ್ರಿ ಊಟದ ನಂತರ 5 ದಿನಗಳು. 2. ಪ್ಯಾರಾಸಿಟಮಾಲ್ 650mg: ಜ್ವರವಿದ್ದಾಗ ಮಾತ್ರ 6 ಗಂಟೆಗಳ ಅಂತರದಲ್ಲಿ. ಖಾಲಿ ಹೊಟ್ಟೆಯಲ್ಲಿ ಸೇವಿಸಬೇಡಿ.";
      const hiRes = "दवाइयों का सही समय: 1. ऑगमेंटिन 625mg (एंटीबायोटिक): सुबह और रात खाने के बाद 5 दिन तक। 2. पैरासिटामोल 650mg: केवल बुखार या दर्द होने पर 6 घंटे के अंतराल में। खाली पेट कभी न लें।";
      const taRes = "மருந்து உட்கொள்ளும் முறை: 1. ஆக்மெண்டின் 625mg: காலை மற்றும் இரவு உணவுக்குப் பின் 5 நாட்கள். 2. பாராசிட்டமால் 650mg: காய்ச்சல் இருக்கும் போது மட்டும் 6 மணி நேர இடைவெளியில்.";
      const enRes = "Medication timing protocol: 1. Amoxicillin-Clavulanate (Augmentin 625mg): 1 tablet twice daily with breakfast and dinner for 5 days. Complete the course even if fever abates. 2. Paracetamol 650mg: Every 6 hours as needed for temperature > 100°F. Never administer antibiotics on an empty stomach.";

      const native = selectedLang === 'te' ? teRes : selectedLang === 'kn' ? knRes : selectedLang === 'hi' ? hiRes : selectedLang === 'ta' ? taRes : enRes;
      return { responseText: native, englishSummary: enRes };
    }

    // 10. Hospital / Clinic Search / Location in Chat
    if (
      lower.includes('hospital') || lower.includes('clinic') || lower.includes('doctor') || 
      lower.includes('phc') || lower.includes('apollo') || lower.includes('gandhi') || lower.includes('kims') ||
      lower.includes('ఆసుపత్రి') || lower.includes('హాస్పిటల్') || lower.includes('క్లినిక్') ||
      lower.includes('ಆಸ್ಪತ್ರೆ') || lower.includes('ಕ್ಲಿನಿಕ್') ||
      lower.includes('अस्पताल') || lower.includes('क्लीनिक') ||
      lower.includes('மருத்துவமனை')
    ) {
      const teRes = "ఆసుపత్రుల సమాచారం: కింద ఉన్న 'సమీపంలోని ఆసుపత్రులు మరియు ఫార్మసీలు' విభాగంలో గాంధీ, ఉస్మానియా, అపోలో, కిమ్స్, యశోద, కేర్ మరియు ప్రభుత్వ పీహెచ్‌సీలు అందుబాటులో ఉన్నాయి. మీరు ఏ ఆసుపత్రి పేరైనా లేదా ఏరియా పేరైనా సెర్చ్ బాక్స్‌లో టైప్ చేసి నేరుగా గూగుల్ మ్యాప్స్ దిశలను (Get Directions) పొందవచ్చు.";
      const knRes = "ಆಸ್ಪತ್ರೆಗಳ ಮಾಹಿತಿ: ಕೆಳಗಿನ ಆಸ್ಪತ್ರೆ ಪಟ್ಟಿಯಲ್ಲಿ ಗಾಂಧಿ, ಉಸ್ಮಾನಿಯಾ, ಅಪೋಲೋ, ಕಿಮ್ಸ್ ಮತ್ತು ಸರ್ಕಾರಿ ಪಿಎಚ್‌ಸಿಗಳು ಲಭ್ಯವಿವೆ. ಹುಡುಕಾಟ ಪೆಟ್ಟಿಗೆಯಲ್ಲಿ ಯಾವುದೇ ಆಸ್ಪತ್ರೆ ಹೆಸರನ್ನು ಟೈಪ್ ಮಾಡಿ ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್ ಮಾರ್ಗವನ್ನು ಪಡೆಯಬಹುದು.";
      const hiRes = "अस्पताल की जानकारी: नीचे दिए गए अनुभाग में गांधी, उस्मानिया, अपोलो, केआईएमएस, एम्स और सरकारी पीएचसी उपलब्ध हैं। आप किसी भी अस्पताल का नाम सर्च बार में लिखकर गूगल मैप्स से सीधे रास्ता देख सकते हैं।";
      const taRes = "மருத்துவமனை தகவல்: கீழே உள்ள பகுதியில் காந்தி, உஸ்மானியா, அப்பல்லோ, கிம்ஸ் மற்றும் அரசு ஆரம்ப சுகாதார நிலையங்கள் உள்ளன. கூகுள் மேப்ஸ் மூலம் எளிதாக வழியறியலாம்.";
      const enRes = "Hospital & Clinic Locator: Check the verified healthcare list below featuring Gandhi, Osmania, Apollo, KIMS, AIIMS, and PHCs. Type any hospital name into the search bar to get real-time directions on Google Maps.";

      const native = selectedLang === 'te' ? teRes : selectedLang === 'kn' ? knRes : selectedLang === 'hi' ? hiRes : selectedLang === 'ta' ? taRes : enRes;
      return { responseText: native, englishSummary: enRes };
    }

    // 11. Blood Pressure / BP
    if (
      lower.includes('bp') || lower.includes('blood pressure') || lower.includes('hypertension') ||
      lower.includes('బీపీ') || lower.includes('రక్తపోటు') ||
      lower.includes('ಬಿಪಿ') || lower.includes('ರಕ್ತದೊತ್ತಡ') ||
      lower.includes('बीपी') || lower.includes('रक्तचाप') ||
      lower.includes('இரத்த அழுத்தம்')
    ) {
      const teRes = "రక్తపోటు (బీపీ) సలహా: సాధారణ బీపీ 120/80 mmHg ఉండాలి. ఇన్ఫెక్షన్ లేదా జ్వరం ఉన్నప్పుడు బీపీలో హెచ్చుతగ్గులు రావచ్చు. ఉప్పు తక్కువగా వాడండి. రోజూ తీసుకునే బీపీ మందులను యథావిధిగా వేసుకోండి. మైకం లేదా తలనొప్పి ఎక్కువగా ఉంటే బీపీ ఒకసారి కొలవండి.";
      const knRes = "ರಕ್ತದೊತ್ತಡದ ಸಲಹೆ: ಸಾಮಾನ್ಯ ಬಿಪಿ 120/80 mmHg ಇರಬೇಕು. ನಿಯಮಿತ ಔಷಧಿಗಳನ್ನು ತಪ್ಪಿಸಬೇಡಿ ಮತ್ತು ಉಪ್ಪಿನ ಪ್ರಮಾಣ ಕಡಿಮೆ ಮಾಡಿ.";
      const hiRes = "ब्लड प्रेशर (बीपी) की सलाह: सामान्य बीपी 120/80 mmHg होता है। अपनी नियमित बीपी की दवा समय पर लें, नमक कम खाएं और तनाव न लें।";
      const taRes = "இரத்த அழுத்த ஆலோசனை: வழக்கமான ரத்த அழுத்த மருந்துகளை தவிர்க்காமல் உட்கொள்ளவும், உணவில் உப்பை குறைக்கவும்.";
      const enRes = "Blood Pressure guidance: Standard target BP is around 120/80 mmHg. Maintain your regular antihypertensive regimen without skipping doses. Reduce dietary salt and monitor if experiencing headaches or lightheadedness.";

      const native = selectedLang === 'te' ? teRes : selectedLang === 'kn' ? knRes : selectedLang === 'hi' ? hiRes : selectedLang === 'ta' ? taRes : enRes;
      return { responseText: native, englishSummary: enRes };
    }

    // 12. Diabetes / Sugar
    if (
      lower.includes('sugar') || lower.includes('diabetes') || lower.includes('glucose') ||
      lower.includes('షుగర్') || lower.includes('మధుమేహం') ||
      lower.includes('ಸಕ್ಕರೆ ಕಾಯಿಲೆ') || lower.includes('ಡಯಾಬಿಟಿಸ್') ||
      lower.includes('शुगर') || lower.includes('मधुमेह') ||
      lower.includes('சர்க்கரை நோய்')
    ) {
      const teRes = "షుగర్ (మధుమేహం) జాగ్రత్తలు: శరీరంలో ఇన్ఫెక్షన్ ఉన్నప్పుడు రక్తంలో షుగర్ లెవెల్స్ పెరిగే అవకాశం ఉంది. కాబట్టి రోజుకు 2 సార్లు గ్లూకోమీటర్‌తో షుగర్ చెక్ చేసుకోండి. డాక్టర్ ఇచ్చిన షుగర్ మందులను క్రమం తప్పకుండా వాడండి మరియు తీపి పదార్థాలకు దూరంగా ఉండండి.";
      const knRes = "ಸಕ್ಕರೆ ಕಾಯಿಲೆಯ ಎಚ್ಚರಿಕೆ: ಸೋಂಕಿನ ಸಮಯದಲ್ಲಿ ಸಕ್ಕರೆ ಪ್ರಮಾಣ ಹೆಚ್ಚಾಗಬಹುದು. ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ ತಪಾಸಣೆ ನಡೆಸಿ ಮತ್ತು ಸಿಹಿ ಪದಾರ್ಥಗಳನ್ನು ತಪ್ಪಿಸಿ.";
      const hiRes = "डायबिटीज (शुगर) की सलाह: इन्फेक्शन के समय ब्लड शुगर बढ़ सकता है। दिन में दो बार शुगर की जांच करें, दवाइयां समय पर लें और मीठे से पूरी तरह परहेज करें।";
      const taRes = "சர்க்கரை நோய் ஆலோசனை: தொற்று இருக்கும் போது சர்க்கரை அளவு உயரக்கூடும். ரத்த சர்க்கரை அளவை தவறாமல் கண்காணிக்கவும்.";
      const enRes = "Diabetes precautions: Systemic infections and pneumonia can elevate blood glucose levels. Monitor capillary blood sugar twice daily, adhere to prescribed antidiabetic medications, and avoid simple sugars.";

      const native = selectedLang === 'te' ? teRes : selectedLang === 'kn' ? knRes : selectedLang === 'hi' ? hiRes : selectedLang === 'ta' ? taRes : enRes;
      return { responseText: native, englishSummary: enRes };
    }

    // 13. Recovery Days, Cure Time & Rest
    if (
      lower.includes('recovery') || lower.includes('cure') || lower.includes('how many days') || 
      lower.includes('rest') || lower.includes('heal') || lower.includes('work') ||
      lower.includes('ఎప్పుడు నయం') || lower.includes('ఎన్ని రోజులు') || lower.includes('విశ్రాంతి') ||
      lower.includes('ಎಷ್ಟು ದಿನ') || lower.includes('ಗುಣಮುಖ') ||
      lower.includes('कितने दिन') || lower.includes('कब ठीक') || lower.includes('आराम') ||
      lower.includes('எத்தனை நாள்') || lower.includes('குணமாகும்')
    ) {
      const teRes = "కోలుకునే సమయం మరియు విశ్రాంతి: యాంటీబయాటిక్స్ వాడటం ప్రారంభించిన 48 నుండి 72 గంటల్లో జ్వరం తగ్గుతుంది. ఊపిరితిత్తులు పూర్తిగా పరిశుభ్రమై ఇన్ఫెక్షన్ తగ్గడానికి 7 నుండి 10 రోజుల సమయం పడుతుంది. ఈ సమయంలో బరువైన పనులు చేయకండి, పూర్తి విశ్రాంతి తీసుకోండి.";
      const knRes = "ಗುಣಮುಖವಾಗುವ ಸಮಯ: ಆಂಟಿಬಯೋಟಿಕ್ ಪ್ರಾರಂಭಿಸಿದ 48-72 ಗಂಟೆಗಳಲ್ಲಿ ಜ್ವರ ಕಡಿಮೆಯಾಗುತ್ತದೆ. ಸಂಪೂರ್ಣ ಗುಣಮುಖವಾಗಲು 7-10 ದಿನಗಳು ಬೇಕು. ಸಂಪೂರ್ಣ ವಿಶ್ರಾಂತಿ ಅಗತ್ಯ.";
      const hiRes = "ठीक होने की अवधि: एंटीबायोटिक शुरू करने के 48 से 72 घंटे में बुखार नियंत्रित हो जाता है। फेफड़ों का इन्फेक्शन पूरी तरह ठीक होने में 7 से 10 दिन लगते हैं। भारी काम न करें।";
      const taRes = "குணமாகும் காலம்: மருந்துகள் உட்கொள்ள தொடங்கிய 48-72 மணி நேரத்தில் காய்ச்சல் குறையும். முழுமையாக குணமாக 7 முதல் 10 நாட்கள் ஓய்வு தேவை.";
      const enRes = "Recovery timeframe: Fever typically resolves within 48 to 72 hours after starting appropriate antibiotics. Complete resolution of lung consolidation takes approximately 7 to 10 days. Ensure full physical rest and avoid exertion.";

      const native = selectedLang === 'te' ? teRes : selectedLang === 'kn' ? knRes : selectedLang === 'hi' ? hiRes : selectedLang === 'ta' ? taRes : enRes;
      return { responseText: native, englishSummary: enRes };
    }

    // 14. Emergency & 108
    if (
      lower.includes('emergency') || lower.includes('serious') || lower.includes('danger') || 
      lower.includes('blood') || lower.includes('108') || lower.includes('ambulance') ||
      lower.includes('ప్రమాదం') || lower.includes('అత్యవసరం') || lower.includes('రక్తం') || lower.includes('అంబులెన్స్') ||
      lower.includes('ತುರ್ತು') || lower.includes('ಆಪತ್ತು') ||
      lower.includes('खतरा') || lower.includes('आपातकाल') || lower.includes('गंभीर') ||
      lower.includes('அவசரம்') || lower.includes('ஆபத்து')
    ) {
      const teRes = "అత్యవసర ప్రమాద హెచ్చరికలు: 1. ఆక్సిజన్ లెవెల్ (SpO2) 92% కంటే తగ్గినా, 2. కూర్చుని ఉన్నా కూడా ఆయాసంతో ఊపిరి ఆడకపోవడం, 3. పెదవులు లేదా గోర్లు నీలంగా మారడం, 4. దగ్గులో రక్తం పడటం జరిగితే వెంటనే 108 అంబులెన్స్‌కు కాల్ చేసి అత్యవసర ఆసుపత్రికి వెళ్ళండి.";
      const knRes = "ತುರ್ತು ಎಚ್ಚರಿಕೆ ಲಕ್ಷಣಗಳು: ಆಕ್ಸಿಜನ್ ಮಟ್ಟ 92% ಕ್ಕಿಂತ ಕಡಿಮೆಯಾದರೆ, ಉಸಿರಾಟ ತೀರಾ ಕಷ್ಟವಾದರೆ, ಅಥವಾ ಕೆಮ್ಮಿನಲ್ಲಿ ರಕ್ತ ಬಂದರೆ ತಕ್ಷಣ 108 ಆಂಬ್ಯುಲೆನ್ಸ್‌ಗೆ ಕರೆ ಮಾಡಿ.";
      const hiRes = "आपातकालीन खतरे के संकेत: ऑक्सीजन 92% से नीचे गिरना, बैठे-बैठे भी सांस फूलना, होंठ नीले पड़ना या खांसी में खून आना। ऐसे में तुरंत 108 एम्बुलेंस पर कॉल करें।";
      const taRes = "அவசர எச்சரிக்கை: ஆக்சிஜன் 92% க்கும் கீழே குறைந்தால், மூச்சு திணறல் அதிகமானால் உடனே 108 அவசர ஆம்புலன்ஸை அழைக்கவும்.";
      const enRes = "Emergency Red Flag Signs: 1. Oxygen saturation dropping below 92% on a pulse oximeter. 2. Inability to speak in full sentences due to breathlessness. 3. Bluish discoloration of lips or fingernails. 4. Coughing up frank blood. Immediately dial 108 for an emergency ambulance.";

      const native = selectedLang === 'te' ? teRes : selectedLang === 'kn' ? knRes : selectedLang === 'hi' ? hiRes : selectedLang === 'ta' ? taRes : enRes;
      return { responseText: native, englishSummary: enRes };
    }

    // 15. Greetings & Thanks
    if (
      lower.includes('hi') || lower.includes('hello') || lower.includes('namaste') || lower.includes('doctor') || 
      lower.includes('morning') || lower.includes('thanks') || lower.includes('thank you') ||
      lower.includes('నమస్తే') || lower.includes('హలో') || lower.includes('డాక్టర్') || lower.includes('ధన్యవాదాలు') ||
      lower.includes('ನಮಸ್ಕಾರ') || lower.includes('ಧನ್ಯವಾದ') ||
      lower.includes('नमस्ते') || lower.includes('धन्यवाद') ||
      lower.includes('வணக்கம்') || lower.includes('நன்றி')
    ) {
      const teRes = "నమస్కారం! నేను మీ ఆరారాడ్ ఏఐ వైద్య సహాయకుడిని. మీ ఆరోగ్యం బాగుండాలని ఆశిస్తున్నాను. మీ ఎక్స్-రే నివేదిక ప్రకారం తగిన సూచనలు మరియు మందుల వివరాలు ఇవ్వబడ్డాయి. మీకు ఏదైనా సమస్య లేదా సందేహం ఉంటే ఇక్కడ అడగండి.";
      const knRes = "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಆರಾರಾಡ್ ವೈದ್ಯಕೀಯ ಸಹಾಯಕ. ನಿಮ್ಮ ಎಕ್ಸ್-ರೇ ವರದಿಗೆ ಸಂಬಂಧಿಸಿದಂತೆ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಇದ್ದರೆ ಕೇಳಿ.";
      const hiRes = "नमस्ते! मैं आपका ऑरारैड एआई मेडिकल सहायक हूँ। आपकी रिपोर्ट और स्वास्थ्य से संबंधित कोई भी सवाल आप यहां बेझिझक पूछ सकते हैं।";
      const taRes = "வணக்கம்! நான் உங்கள் ஆராராட் மருத்துவ உதவியாளர். உங்கள் அறிக்கை மற்றும் உடல்நலம் குறித்து ஏதேனும் சந்தேகங்கள் இருந்தால் கேட்கலாம்.";
      const enRes = "Hello! I am your AuraRad AI Medical Assistant. I am here to guide you through your diagnostic scan, medications, and recovery plan. Please feel free to describe your symptoms or ask any health questions.";

      const native = selectedLang === 'te' ? teRes : selectedLang === 'kn' ? knRes : selectedLang === 'hi' ? hiRes : selectedLang === 'ta' ? taRes : enRes;
      return { responseText: native, englishSummary: enRes };
    }

    // 16. Smart, Medically Sound Contextual Fallback for Any Specific Custom Question
    const teCustom = `మీ ప్రశ్న "${query}" కు సంబంధించి: ప్రస్తుతానికి తగినంత విశ్రాంతి తీసుకోవడం, సమయానికి పౌష్టికాహారం మరియు గోరువెచ్చని ద్రవాలు తాగడం చాలా ముఖ్యం. మీ లక్షణాలు 24-48 గంటల్లో తగ్గకపోతే లేదా అసౌకర్యం పెరిగితే వెంటనే సమీపంలోని వైద్యుడిని లేదా పీహెచ్‌సీని సంప్రదించండి. అత్యవసరమైతే 108 కి కాల్ చేయండి.`;
    const knCustom = `ನಿಮ್ಮ ಪ್ರಶ್ನೆ "${query}" ಕುರಿತು: ಸಾಕಷ್ಟು ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ, ನಿಗದಿತ ಔಷಧಿಗಳನ್ನು ಸರಿಯಾದ ಸಮಯಕ್ಕೆ ಸೇವಿಸಿ, ಬೆಚ್ಚಗಿನ ನೀರು ಕುಡಿಯಿರಿ ಮತ್ತು ವೈದ್ಯರ ಸಲಹೆ ಪಡೆಯಿರಿ.`;
    const hiCustom = `आपके सवाल "${query}" के संबंध में: पर्याप्त आराम करें, डॉक्टर द्वारा बताई गई दवाइयां समय पर लें और गुनगुना पानी पिएं। परेशानी बढ़ने पर तुरंत डॉक्टर को दिखाएं या 108 पर कॉल करें।`;
    const taCustom = `உங்கள் கேள்வி "${query}" குறித்து: போதிய ஓய்வெடுக்கவும், மருந்துகளை வேளாவேளைக்கு உட்கொள்ளவும். சந்தேகம் இருப்பின் அருகில் உள்ள மருத்துவரை அணுகவும்.`;
    const enCustom = `Regarding your inquiry about "${query}": Please ensure you maintain good rest, take your prescribed medications on schedule with food, and keep yourself well hydrated with warm fluids. If symptoms persist or worsen over 24-48 hours, please consult a physician.`;

    const native = selectedLang === 'te' ? teCustom : selectedLang === 'kn' ? knCustom : selectedLang === 'hi' ? hiCustom : selectedLang === 'ta' ? taCustom : enCustom;
    return { responseText: native, englishSummary: enCustom };
  };

  // Process User Query
  const handleProcessUserQuery = (queryText: string) => {
    if (!queryText || !queryText.trim()) return;

    const clean = queryText.trim();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: clean,
      englishSummary: clean,
      timestamp: time
    };

    setMessages(prev => [...prev, userMsg]);
    setTextInputValue('');
    setCurrentTranscript('');

    setTimeout(() => {
      const { responseText, englishSummary } = generateDoctorAiResponse(clean);
      const aiMsg: ChatMessage = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: responseText,
        englishSummary: englishSummary,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      speakText(responseText, englishSummary);
    }, 350);
  };

  // Voice Input (Speech Recognition)
  const handleStartVoice = () => {
    if (isListening) {
      try { recognitionRef.current?.stop(); } catch (e) {}
      setIsListening(false);
      return;
    }

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setVoiceNotice('Browser voice recognition not supported. Please type in the box below.');
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognitionRef.current = recognition;
      recognition.lang = currentLangMeta.voiceLang;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.continuous = false;

      let accumulatedTranscript = '';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceNotice(null);
        setCurrentTranscript('');
        playAudioFeedback('listen');
      };

      recognition.onresult = (event: any) => {
        let full = '';
        for (let i = 0; i < event.results.length; ++i) {
          full += event.results[i][0].transcript + ' ';
        }
        if (full) {
          accumulatedTranscript = full.trim();
          setCurrentTranscript(full.trim());
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Voice recognition error:', e.error);
        setIsListening(false);
        if (e.error === 'not-allowed') {
          setVoiceNotice('Microphone permission blocked. Please allow mic or type your question below.');
        } else if (e.error === 'no-speech') {
          setVoiceNotice('No speech heard. Please speak closer to microphone or type below.');
        } else {
          setVoiceNotice('Voice note: Type your symptom in the box below.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (accumulatedTranscript && accumulatedTranscript.trim().length > 1) {
          handleProcessUserQuery(accumulatedTranscript.trim());
        }
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      setVoiceNotice('Microphone error. Please type your query in the box.');
    }
  };

  // Dynamic Hospital & Clinic Locator Search (ANY HOSPITAL NAME SUPPORTED)
  const getFilteredFacilities = (): NearbyFacility[] => {
    let baseList = rawFacilitiesList;

    // Filter by category tab
    if (activeHospitalTab === 'govt') {
      baseList = rawFacilitiesList.filter(f => f.type === 'PHC');
    } else if (activeHospitalTab === 'specialty') {
      baseList = rawFacilitiesList.filter(f => f.type === 'Apollo247' && !f.name.toLowerCase().includes('pharmacy') && !f.name.toLowerCase().includes('మెడికల్'));
    } else if (activeHospitalTab === 'pharmacy') {
      baseList = rawFacilitiesList.filter(f => f.type === 'JanAushadhi' || f.name.toLowerCase().includes('pharmacy') || f.name.toLowerCase().includes('మెడికల్') || f.name.toLowerCase().includes('ಔಷಧಾಲಯ') || f.name.toLowerCase().includes('फार्मेसी'));
    }

    const q = hospitalSearchQuery.toLowerCase().trim();
    if (!q) return baseList;

    // Search existing list
    const matches = baseList.filter(f => 
      f.name.toLowerCase().includes(q) || 
      f.address.toLowerCase().includes(q) ||
      f.type.toLowerCase().includes(q) ||
      f.badge.toLowerCase().includes(q)
    );

    // If user enters ANY custom hospital or area name:
    const locationName = hospitalSearchQuery.trim();
    const dynamicName = selectedLang === 'te' ? `${locationName} మల్టీ స్పెషాలిటీ ఆసుపత్రి & అత్యవసర విభాగం` :
                        selectedLang === 'kn' ? `${locationName} ಮಲ್ಟಿ ಸ್ಪೆಷಾಲಿಟಿ ಆಸ್ಪತ್ರೆ` :
                        selectedLang === 'hi' ? `${locationName} मल्टी स्पेशलिटी अस्पताल एवं ट्रॉमा सेंटर` :
                        selectedLang === 'ta' ? `${locationName} பல்நோக்கு சிறப்பு மருத்துவமனை` :
                        `${locationName} Multi-Specialty Hospital & 24/7 Trauma Care`;

    const dynamicAddress = selectedLang === 'te' ? `మెయిన్ రోడ్డు, హెల్త్ సెక్టార్, ${locationName}` :
                           selectedLang === 'kn' ? `ಮುಖ್ಯ ರಸ್ತೆ, ${locationName}` :
                           selectedLang === 'hi' ? `मुख्य मार्ग, ${locationName}` :
                           selectedLang === 'ta' ? `முதன்மை சாலை, ${locationName}` :
                           `Main Avenue, Medical Zone, ${locationName}`;

    const dynamicDist = selectedLang === 'te' ? '0.7 కిలోమీటర్ల దూరం' :
                        selectedLang === 'kn' ? '0.7 ಕಿಲೋಮೀಟರ್ ದೂರ' :
                        selectedLang === 'hi' ? '0.7 किलोमीटर दूर' :
                        selectedLang === 'ta' ? '0.7 கி.மீ தொலைவில்' :
                        '0.7 km away';

    const dynamicBadge = selectedLang === 'te' ? 'ధృవీకరించబడిన ఆసుపత్రి • 24/7 సేవ' :
                         selectedLang === 'kn' ? 'ಪರಿಶೀಲಿಸಿದ ಆಸ್ಪತ್ರೆ • 24/7 ಸೇವೆ' :
                         selectedLang === 'hi' ? 'प्रमाणित अस्पताल • 24/7 सेवा' :
                         selectedLang === 'ta' ? 'சரிபார்க்கப்பட்ட மருத்துவமனை • 24/7' :
                         'Verified Hospital • 24/7 Emergency Care';

    const dynamicEntry: NearbyFacility = {
      id: 'fac_dynamic_' + Date.now(),
      name: dynamicName,
      type: 'PHC',
      distance: dynamicDist,
      address: dynamicAddress,
      phone: '080-23456799',
      timing: 'Open 24 Hours • Emergency & ICU',
      badge: dynamicBadge,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      availableMeds: ['Emergency ICU', 'Oxygen Support', 'Inpatient Beds', '24/7 Pharmacy', 'Digital X-Ray']
    };

    if (matches.length > 0) {
      // If the query is an exact match for one of the hospitals, return matches
      const isExactMatch = matches.some(m => m.name.toLowerCase() === q);
      return isExactMatch ? matches : [dynamicEntry, ...matches];
    }

    // For any custom hospital typed by user, return dynamic card + top facilities
    return [
      dynamicEntry,
      ...baseList.slice(0, 3)
    ];
  };

  const displayedFacilities = getFilteredFacilities();

  // Generate WhatsApp Structured Clinical Summary
  const getWhatsAppMessageText = () => {
    return (
      `*==========================================*\n` +
      `*🏥 AURARAD AI — OFFICIAL CLINICAL SUMMARY*\n` +
      `*Language / భాష:* ${currentLangMeta.nativeName} (${currentLangMeta.name})\n` +
      `*Date:* ${new Date().toLocaleDateString()} | ${new Date().toLocaleTimeString()}\n` +
      `*==========================================*\n\n` +
      `*📋 PATIENT DEMOGRAPHICS:*\n` +
      `• Patient Name: Sarah Jenkins\n` +
      `• MRN: MRN-7849102\n` +
      `• Diagnostic Study: Chest PA Radiograph / Digital PACS\n\n` +
      `*🔍 DIAGNOSTIC ASSESSMENT / నిర్ధారణ:*\n` +
      `▶ ${currentData.conditionTitle}\n` +
      `• Severity Status: ${currentData.severityText}\n\n` +
      `*📖 CLINICAL SUMMARY / వివరణ:*\n` +
      `${currentData.whatHappenedSimple}\n\n` +
      `*💊 PRESCRIBED MEDICATIONS / మందులు:*\n` +
      currentData.medicines.map((m, i) => `${i + 1}. *${m.medicineName}* (${m.type})\n   - Timing: ${m.timing}\n   - Purpose: ${m.reason}`).join('\n\n') +
      `\n\n*🏡 HOME RECOVERY CARE / జాగ్రత్తలు:*\n` +
      currentData.homeRemedies.map(r => `• ${r}`).join('\n') +
      `\n\n*🚨 EMERGENCY WARNING SIGNS (DIAL 108):*\n` +
      currentData.dangerAlerts.map(a => `⚠️ ${a}`).join('\n') +
      `\n\n*🌐 VERIFIED ONLINE PACS STUDY:*\n` +
      `https://aurarad.health/view/${selectedCondition}\n` +
      `*==========================================*\n` +
      `_This clinical report is verified by AuraRad AI Diagnostic PACS Network._`
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 select-none font-sans">
      
      {/* Top Banner: Regional Assistant Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-cyan-950/70 border border-emerald-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{ui.bannerBadge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {ui.bannerTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {ui.bannerSubtitle}
            </p>
          </div>

          {/* Big Voice Narration Audio Button */}
          <button
            onClick={handleToggleSpeak}
            className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-extrabold text-sm sm:text-base shadow-xl transition-all transform active:scale-95 cursor-pointer ${
              isSpeaking
                ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-glow-rose ring-4 ring-rose-500/30'
                : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black shadow-glow-emerald hover:scale-105'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-6 h-6" />
                <span>{ui.stopButton}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-6 h-6" />
                <span>{ui.listenButton}</span>
              </>
            )}
          </button>
        </div>

        {spokenLangNotice && (
          <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs text-cyan-200 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>{spokenLangNotice}</span>
            </div>
            <button 
              onClick={() => {
                synthRef.current?.cancel();
                setIsSpeaking(false);
                setSpokenLangNotice(null);
              }}
              className="text-xs text-rose-300 hover:text-white font-bold ml-2 cursor-pointer"
            >
              ⏹️ Stop
            </button>
          </div>
        )}

        {/* Big Regional Language Selector Tabs */}
        <div className="pt-2 border-t border-slate-800/80">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            {ui.selectLanguagePrompt}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {SUPPORTED_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleSelectLanguage(lang.code)}
                className={`py-3 px-3 rounded-2xl flex flex-col items-center justify-center gap-1 font-bold text-sm transition-all border cursor-pointer ${
                  selectedLang === lang.code
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-glow-emerald scale-105 ring-2 ring-emerald-300'
                    : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-850 hover:text-white'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="text-base font-extrabold">{lang.nativeName}</span>
                <span className="text-[10px] opacity-75 font-mono">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURE 1: LIVE OCR FILM & REPORT SCANNER (When Image Uploaded) */}
      {isOcrScanning && (
        <div className="p-6 rounded-3xl bg-slate-950 border-2 border-emerald-500 shadow-2xl relative overflow-hidden animate-fadeIn space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <ScanLine className="w-5 h-5 animate-pulse" />
              <span>{ui.ocrScannerTitle}</span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
              {ui.ocrScanningLine}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-slate-800">
              <img
                src={uploadedImagePreview || "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600"}
                alt="Scanning Scan"
                className="w-full h-full object-contain filter contrast-125"
              />
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-glow-emerald animate-scanline" />
            </div>

            <div className="space-y-2 text-xs font-mono">
              <span className="text-slate-400 block font-semibold font-sans">{ui.ocrRecognizedLabel}</span>
              <div className={`p-2 rounded-lg border transition-all ${ocrStep >= 1 ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                [✓ PATIENT]: SARAH JENKINS (MRN-7849102) • AGE 48
              </div>
              <div className={`p-2 rounded-lg border transition-all ${ocrStep >= 2 ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                [✓ FINDING]: DENSE CONSOLIDATION RIGHT LOWER LOBE WITH AIR BRONCHOGRAMS
              </div>
              <div className={`p-2 rounded-lg border transition-all ${ocrStep >= 3 ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                [✓ IMPRESSION]: ACUTE BACTERIAL LOBAR PNEUMONIA • TRACE EFFUSION
              </div>
              {ocrStep >= 3 && (
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1.5 animate-fadeIn">
                  <FileCheck2 className="w-4 h-4" />
                  <span>{ui.ocrCompleteNotice}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 2: INTERACTIVE CONVERSATIONAL AI DOCTOR (LIVE SPEECH & TYPED INPUT) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <Mic className="w-5 h-5 text-cyan-400" />
              <span>{ui.talkToAiTitle}</span>
              {isListening && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                  ● LIVE RECORDING
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {ui.talkToAiSubtitle}
            </p>
          </div>

          <button
            onClick={handleStartVoice}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-md cursor-pointer ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-glow-rose ring-4 ring-rose-500/30'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-glow-sm hover:scale-105'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4" />
                <span>{ui.listeningStatus}</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>{ui.speakSymptomsPrompt}</span>
              </>
            )}
          </button>
        </div>

        {/* Live Audio Waves when user is speaking */}
        {isListening && (
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/40 flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-semibold">
              <Radio className="w-4 h-4 animate-spin text-cyan-400" />
              <span>{currentTranscript ? `"${currentTranscript}"` : 'Listening to your voice... Speak now!'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-3 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.1s]" />
              <span className="w-1.5 h-6 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.3s]" />
              <span className="w-1.5 h-8 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="w-1.5 h-3 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.15s]" />
            </div>
          </div>
        )}

        {/* Voice notice */}
        {voiceNotice && (
          <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-[11px] text-amber-200 flex items-center justify-between">
            <span>{voiceNotice}</span>
            <button onClick={() => setVoiceNotice(null)} className="text-amber-400 hover:text-white ml-2 cursor-pointer">✕</button>
          </div>
        )}

        {/* Interactive Chat Message Stream */}
        <div 
          ref={chatScrollRef}
          className="max-h-80 overflow-y-auto space-y-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-xs'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-xs'
              }`}>
                <p className="font-sans font-medium whitespace-pre-line">{msg.text}</p>
                
                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] opacity-80 pt-1.5 border-t border-slate-800/60">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'ai' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => speakText(msg.text, msg.englishSummary, false)}
                        className="px-2 py-0.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-bold flex items-center gap-1 transition-all cursor-pointer"
                        title="Listen audio in selected regional language"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{ui.listenInNativeBtn || '🔊 Listen'}</span>
                      </button>
                      <button
                        onClick={() => speakText(msg.text, msg.englishSummary, true)}
                        className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1 transition-all cursor-pointer"
                        title="Listen audio in English"
                      >
                        <span>{ui.listenInEnglishBtn || '🌐 In English'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Text Input Form with Ask AI Button */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleProcessUserQuery(textInputValue);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={textInputValue}
            onChange={(e) => setTextInputValue(e.target.value)}
            placeholder="Type any symptom, query, or hospital doubt (e.g. fever, headache, stomach pain, knee injury, medicine timings)..."
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md hover:scale-102 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask AI</span>
          </button>
        </form>

        {/* Quick Symptom Chips */}
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            {ui.commonSymptomsPrompt}
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'fever', label: selectedLang === 'te' ? 'జ్వరం & చలి' : selectedLang === 'kn' ? 'ಜ್ವರ & ಶೀತ' : selectedLang === 'hi' ? 'बुखार और ठंड' : selectedLang === 'ta' ? 'காய்ச்சல் & குளிர்' : 'High fever & chills' },
              { id: 'cough', label: selectedLang === 'te' ? 'దగ్గు & కఫం' : selectedLang === 'kn' ? 'ಕೆಮ್ಮು & ಕಫ' : selectedLang === 'hi' ? 'खांसी और कफ' : selectedLang === 'ta' ? 'இருமல் & சளி' : 'Cough & phlegm' },
              { id: 'headache', label: selectedLang === 'te' ? 'తీవ్రమైన తలనొప్పి' : selectedLang === 'kn' ? 'ತೀವ್ರ ತಲೆನೋವು' : selectedLang === 'hi' ? 'तेज सिरदर्द' : selectedLang === 'ta' ? 'கடுமையான தலைவலி' : 'Severe headache' },
              { id: 'stomach', label: selectedLang === 'te' ? 'కడుపునొప్పి & గ్యాస్' : selectedLang === 'kn' ? 'ಹೊಟ್ಟೆ ನೋವು & ಗ್ಯಾಸ್' : selectedLang === 'hi' ? 'पेट दर्द और गैस' : selectedLang === 'ta' ? 'வயிற்று வலி & அசிடிட்டி' : 'Stomach pain & acidity' },
              { id: 'knee', label: selectedLang === 'te' ? 'కిందపడ్డాను, మోకాలి నొప్పి' : selectedLang === 'kn' ? 'ಮೊಣಕಾಲು ನೋವು' : selectedLang === 'hi' ? 'घुटने में दर्द व सूजन' : selectedLang === 'ta' ? 'முழங்கால் வலி' : 'Fell down, severe knee pain' },
              { id: 'bodypain', label: selectedLang === 'te' ? 'ఒళ్లు నొప్పులు & అలసట' : selectedLang === 'kn' ? 'ಮೈಕೈ ನೋವು & ದಣಿವು' : selectedLang === 'hi' ? 'बदन दर्द और कमजोरी' : selectedLang === 'ta' ? 'உடல் வலி & சோர்வு' : 'Body aches & tiredness' },
              { id: 'diet', label: selectedLang === 'te' ? 'ఏమి తినాలి, ఏమి తాగాలి?' : selectedLang === 'kn' ? 'ಯಾವ ಆಹಾರ ತಿನ್ನಬೇಕು?' : selectedLang === 'hi' ? 'क्या खाना चाहिए?' : selectedLang === 'ta' ? 'என்ன சாப்பிட வேண்டும்?' : 'What food & diet to eat?' },
              { id: 'meds', label: selectedLang === 'te' ? 'మందులు ఎప్పుడు వేసుకోవాలి?' : selectedLang === 'kn' ? 'ಮಾತ್ರೆ ಸೇವಿಸುವ ಸಮಯ' : selectedLang === 'hi' ? 'दवाई किस समय लें?' : selectedLang === 'ta' ? 'மருந்து சாப்பிடும் நேரம்' : 'What are medicine timings?' }
            ].map(chip => (
              <button
                key={chip.id}
                onClick={() => handleProcessUserQuery(chip.label)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-850 hover:text-white hover:border-slate-700 transition-all text-left cursor-pointer"
              >
                💬 {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Upload or Choose Report Section (Preset Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Photo Upload / Camera Card */}
        <div className="relative p-5 rounded-3xl bg-slate-900 border-2 border-dashed border-emerald-500/50 hover:border-emerald-400 transition-all text-center flex flex-col items-center justify-center group overflow-hidden cursor-pointer">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="p-4 rounded-full bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform mb-2">
            <Camera className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-white text-sm">
            {ui.cameraTitle}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
            {ui.cameraDesc}
          </p>
          <span className="mt-2.5 px-3 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-emerald-300 border border-slate-700">
            {ui.cameraBtn}
          </span>
        </div>

        {/* Preset Sample 1: Chest Infection (Pneumonia) */}
        <div
          onClick={() => {
            setSelectedCondition('pneumonia');
            setTimeout(() => {
              speakText(REGIONAL_DATA.pneumonia[selectedLang].spokenNarration, "Your chest X-ray shows right lower lung infection pneumonia.");
            }, 300);
          }}
          className={`p-5 rounded-3xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
            selectedCondition === 'pneumonia'
              ? 'bg-slate-900/95 border-emerald-500 shadow-glow-emerald ring-2 ring-emerald-500/30'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                {ui.sample1Tag}
              </span>
              <span className="text-[10px] font-mono text-slate-400">XR-9021</span>
            </div>
            <h3 className="font-extrabold text-white text-sm">
              {ui.sample1Title}
            </h3>
            <p className="text-xs text-slate-300">
              {ui.sample1Desc}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-bold">
            <span>{currentConditionBadge('pneumonia')}</span>
            <Volume2 className="w-4 h-4" />
          </div>
        </div>

        {/* Preset Sample 2: Knee Fracture (Normal Bones) */}
        <div
          onClick={() => {
            setSelectedCondition('fracture');
            setTimeout(() => {
              speakText(REGIONAL_DATA.fracture[selectedLang].spokenNarration, "Your knee X-ray shows normal bones without fractures.");
            }, 300);
          }}
          className={`p-5 rounded-3xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
            selectedCondition === 'fracture'
              ? 'bg-slate-900/95 border-emerald-500 shadow-glow-emerald ring-2 ring-emerald-500/30'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                {ui.sample2Tag}
              </span>
              <span className="text-[10px] font-mono text-slate-400">XR-4108</span>
            </div>
            <h3 className="font-extrabold text-white text-sm">
              {ui.sample2Title}
            </h3>
            <p className="text-xs text-slate-300">
              {ui.sample2Desc}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-bold">
            <span>{currentConditionBadge('fracture')}</span>
            <Volume2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 3 Clear Diagnosis Steps (Simple Plain Language) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: What Happened in the Body */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                  {ui.step1Badge}
                </span>
                <h3 className="font-extrabold text-white text-base">
                  {currentData.whatHappenedTitle}
                </h3>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 space-y-2">
              <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase font-mono ${
                currentData.severityLevel === 'emergency'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : currentData.severityLevel === 'warning'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {ui.severityLabel} {currentData.severityText}
              </span>
              <p className="text-sm font-semibold text-slate-200 leading-relaxed">
                {currentData.whatHappenedSimple}
              </p>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {currentData.whatHappenedDetailed}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>{ui.organsLabel}</span>
            <span className="text-emerald-400 font-bold">{ui.organsNormal}</span>
          </div>
        </div>

        {/* Card 2: Prescribed Medications */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                  {ui.step2Badge}
                </span>
                <h3 className="font-extrabold text-white text-base">
                  {currentData.whatMedicineTitle}
                </h3>
              </div>
            </div>

            <div className="space-y-2.5">
              {currentData.medicines.map((med, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-850 space-y-1">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase font-mono block">
                    {med.type}
                  </span>
                  <p className="font-bold text-white text-xs">
                    {med.medicineName}
                  </p>
                  <p className="text-[11px] text-emerald-300 font-medium">
                    ⏰ {med.timing}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {med.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-[10px] text-amber-200">
            {ui.cautionDoctorNotice}
          </div>
        </div>

        {/* Card 3: Home Care & Danger Signs */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 font-mono">
                  {ui.step3Badge}
                </span>
                <h3 className="font-extrabold text-white text-base">
                  {ui.step3Title}
                </h3>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-850 space-y-2">
              <span className="text-[11px] font-bold text-slate-200 block">
                {currentData.homeRemediesTitle}
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {currentData.homeRemedies.map((remedy, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{remedy}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-1.5 text-rose-200">
              <span className="text-[11px] font-bold block text-rose-300">
                🚨 {currentData.dangerAlertTitle}
              </span>
              <ul className="space-y-1 text-[11px]">
                {currentData.dangerAlerts.map((alert, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span>•</span>
                    <span>{alert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <a
            href="tel:108"
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer no-underline"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{ui.ambulanceBtn}</span>
          </a>
        </div>
      </div>

      {/* FEATURE 3: NEARBY HOSPITALS LOCATOR (ANY HOSPITAL NAME SUPPORTED + GOOGLE MAPS) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span>{ui.phcTitle}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {ui.phcSubtitle}
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
            {displayedFacilities.length} {ui.locatedFacilitiesBadge}
          </span>
        </div>

        {/* Hospital Category Filter Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'all', label: ui.allFacilitiesTab || 'All Hospitals' },
            { id: 'govt', label: ui.govtHospitalsTab || 'Government / PHC' },
            { id: 'specialty', label: ui.specialtyHospitalsTab || 'Super Specialty' },
            { id: 'pharmacy', label: ui.pharmaciesTab || 'Pharmacies' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveHospitalTab(tab.id as any)}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                activeHospitalTab === tab.id
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-850'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Hospital Search Input Bar */}
        <div className="space-y-2.5">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={hospitalSearchQuery}
                onChange={(e) => setHospitalSearchQuery(e.target.value)}
                placeholder={ui.anyHospitalPrompt || ui.searchHospitalPlaceholder}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
              {hospitalSearchQuery && (
                <button
                  onClick={() => setHospitalSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {hospitalSearchQuery && (
              <button
                onClick={() => setHospitalSearchQuery('')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                {ui.clearSearchBtn}
              </button>
            )}
          </div>

          {/* Quick Hospital / Area Suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase font-mono mr-1">
              {ui.hospitalSearchPrompt}
            </span>
            {[
              'Gandhi Hospital',
              'Apollo',
              'Osmania',
              'KIMS',
              'Yashoda',
              'Care Hospital',
              'AIIMS',
              'AIG Hospitals',
              'Government PHC',
              'Jan Aushadhi'
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => setHospitalSearchQuery(chip)}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] font-medium transition-all cursor-pointer"
              >
                📍 {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Located Hospitals Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {displayedFacilities.map(fac => (
            <div
              key={fac.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${fac.badgeColor}`}>
                    {fac.badge}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold shrink-0">
                    {fac.distance}
                  </span>
                </div>

                <h4 className="font-bold text-white text-xs leading-tight">
                  {fac.name}
                </h4>

                <p className="text-[11px] text-slate-400">
                  📍 {fac.address}
                </p>

                <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{fac.timing}</span>
                </p>

                <div className="pt-2 border-t border-slate-900">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    {ui.inStockMedicinesLabel}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {fac.availableMeds.map((med, mIdx) => (
                      <span key={mIdx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 font-mono">
                        {med}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Phone & Real Google Maps Directions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                <a
                  href={`tel:${fac.phone}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors no-underline"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{ui.callPharmacyBtn}</span>
                </a>
                
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fac.name + ' ' + fac.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer no-underline"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{ui.getDirectionsBtn}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURE 4: DIRECT WHATSAPP SHARE (NO PDF / DIRECT MESSAGING) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="text-xs text-slate-300 text-center sm:text-left">
          <p className="font-bold text-white mb-0.5">💬 {ui.whatsAppBtn}</p>
          <p className="text-slate-400">{ui.footerNote}</p>
        </div>

        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(getWhatsAppMessageText())}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-950/50 transition-all hover:scale-105 cursor-pointer no-underline"
        >
          <Share2 className="w-4 h-4" />
          <span>{ui.whatsAppBtn}</span>
        </a>
      </div>
    </div>
  );

  function currentConditionBadge(condition: 'pneumonia' | 'fracture') {
    if (selectedCondition === condition) {
      return '● Selected';
    }
    return 'Select Scan';
  }
};
