export type SupportedLanguage = 'te' | 'kn' | 'hi' | 'ta' | 'en';

export interface RegionalLanguageMeta {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  voiceLang: string; // SpeechSynthesis language code, e.g. 'te-IN', 'kn-IN', 'hi-IN', 'ta-IN', 'en-IN'
  flag: string;
}

export const SUPPORTED_LANGUAGES: RegionalLanguageMeta[] = [
  { code: 'en', name: 'English', nativeName: 'English', voiceLang: 'en-US', flag: '🌐' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', voiceLang: 'te-IN', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', voiceLang: 'kn-IN', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', voiceLang: 'hi-IN', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', voiceLang: 'ta-IN', flag: '🇮🇳' }
];

export interface ConditionTranslation {
  conditionTitle: string;
  severityLevel: 'safe' | 'warning' | 'emergency';
  severityText: string;
  whatHappenedTitle: string;
  whatHappenedSimple: string;
  whatHappenedDetailed: string;
  whatMedicineTitle: string;
  medicines: {
    type: string;
    medicineName: string;
    timing: string;
    reason: string;
  }[];
  homeRemediesTitle: string;
  homeRemedies: string[];
  dangerAlertTitle: string;
  dangerAlerts: string[];
  spokenNarration: string;
  spokenNarrationEnglish?: string;
}

export interface NearbyFacility {
  id: string;
  name: string;
  type: 'PHC' | 'JanAushadhi' | 'Apollo247' | 'MedPlus';
  distance: string;
  address: string;
  phone: string;
  timing: string;
  badge: string;
  badgeColor: string;
  availableMeds: string[];
}

export interface SymptomQuery {
  id: string;
  label: string;
  response: string;
  voiceNarration: string;
  englishFallbackVoice?: string;
  conditionKey: 'pneumonia' | 'fracture';
}

export const REGIONAL_DATA: Record<string, Record<SupportedLanguage, ConditionTranslation>> = {
  // 1. Bacterial Pneumonia (Sarah Jenkins X-Ray)
  pneumonia: {
    en: {
      conditionTitle: 'Right Lower Lung Infection with Fluid (Lobar Pneumonia)',
      severityLevel: 'warning',
      severityText: 'Moderate Severity — Requires Prompt Medical Treatment',
      whatHappenedTitle: 'What is Happening in Plain Terms?',
      whatHappenedSimple: 'A localized bacterial infection has developed in the lower portion of your right lung, filling air pockets with inflammatory fluid and white blood cells. This explains your fever, productive cough, and right-sided chest discomfort. Your heart size is completely normal.',
      whatHappenedDetailed: 'Normally, lungs are like porous sponges that allow air to pass easily. In one section, the air pockets are currently filled with fluid, reducing airflow.',
      whatMedicineTitle: 'What Medications Are Typically Prescribed?',
      medicines: [
        {
          type: 'Targeted Antibiotic',
          medicineName: 'Amoxicillin-Clavulanate (Augmentin 625mg / 875mg) or Azithromycin',
          timing: 'Twice daily with meals for 5 to 7 days',
          reason: 'To kill the bacteria causing the lung infection. Complete the full course even if fever resolves.'
        },
        {
          type: 'Fever & Pain Relief',
          medicineName: 'Acetaminophen (Paracetamol / Tylenol 650mg)',
          timing: 'Every 6 hours as needed for temperature > 38.3°C',
          reason: 'Controls high body temperature and relieves pleuritic chest discomfort.'
        },
        {
          type: 'Expectorant / Mucus Thinner',
          medicineName: 'Guaifenesin (Mucinex 400mg)',
          timing: '2 to 3 times daily with plenty of water',
          reason: 'Thins thick bronchial secretions so your cough can easily expel them.'
        }
      ],
      homeRemediesTitle: 'Important Home Recovery Steps:',
      homeRemedies: [
        'Drink 2.5 to 3 liters of warm water or broth daily to thin mucus.',
        'Sleep with 2 pillows to keep your torso elevated at 30-45 degrees.',
        'Avoid all cigarette smoke, vaping, and airborne dust.',
        'Take 10 deep, slow breaths every hour while awake.'
      ],
      dangerAlertTitle: 'Seek Emergency Room Care Immediately If:',
      dangerAlerts: [
        'Struggling to breathe even while resting or sitting still',
        'Lips or fingernails turning bluish or gray',
        'Coughing up frank dark or bright blood',
        'Oxygen level on pulse oximeter drops below 92%'
      ],
      spokenNarration: 'Hello. Your chest X-ray shows an infection and fluid in the lower part of your right lung, known as pneumonia. This is causing your cough and fever. Under medical supervision, you should take prescribed antibiotics and fever reducers. Drink plenty of warm water. If you experience severe shortness of breath, please visit the emergency hospital immediately.'
    },

    te: {
      conditionTitle: 'కుడి ఊపిరితిత్తులో ఇన్ఫెక్షన్ మరియు నీరు (న్యుమోనియా)',
      severityLevel: 'warning',
      severityText: 'మధ్యస్థ సమస్య — వెంటనే డాక్టర్‌ను కలవాలి',
      whatHappenedTitle: 'మీ శరీరంలో ఏం జరిగింది?',
      whatHappenedSimple: 'మీ కుడి ఊపిరితిత్తి కింది భాగంలో బ్యాక్టీరియా వల్ల ఇన్ఫెక్షన్ వచ్చి చీము/నీరు చేరింది. దీనివల్లనే మీకు దగ్గు, పక్కటెముకల్లో నొప్పి, తీవ్రమైన జ్వరం వస్తున్నాయి. గుండె బాగానే ఉంది.',
      whatHappenedDetailed: 'ఊపిరితిత్తులు గాలి పీల్చే స్పాంజి లాంటివి. ప్రస్తుతం ఒక భాగంలో నీరు చేరి గాలి ఆడటం కష్టమవుతోంది.',
      whatMedicineTitle: 'ఏ మందులు వాడాలి?',
      medicines: [
        {
          type: 'ఇన్ఫెక్షన్ తగ్గించే మాత్ర (యాంటీబయాటిక్)',
          medicineName: 'ఆగ్మెంటిన్ (Augmentin 625mg / 875mg) లేదా అజిత్రోమైసిన్',
          timing: 'రోజుకు 2 సార్లు, భోజనం చేసిన తర్వాత 5 నుండి 7 రోజులు',
          reason: 'ఊపిరితిత్తుల్లో ఉన్న బ్యాక్టీరియా క్రిములను పూర్తిగా చంపడానికి. జ్వరం తగ్గినా కోర్సు మొత్తం పూర్తి చేయాలి.'
        },
        {
          type: 'జ్వరం మరియు నొప్పి బిళ్ళ',
          medicineName: 'పారాసిటమాల్ (Dolo 650 / Paracetamol)',
          timing: 'జ్వరం 100°F కంటే ఎక్కువ ఉన్నప్పుడు, 6 గంటలకు ఒకసారి',
          reason: 'తీవ్రమైన జ్వరాన్ని తగ్గించి, ఛాతీ నొప్పి నుండి ఉపశమనం ఇస్తుంది.'
        },
        {
          type: 'కఫం కరిగించే సిరప్',
          medicineName: 'మ్యూసినెక్స్ లేదా గ్వైఫెనెసిన్ సిరప్',
          timing: 'రోజుకు 2 లేదా 3 సార్లు గోరువెచ్చని నీటితో',
          reason: 'ఛాతీలో గడ్డకట్టిన తెమడను కరిగించి బయటకు పంపుతుంది.'
        }
      ],
      homeRemediesTitle: 'ఇంట్లో తీసుకోవలసిన ముఖ్య జాగ్రత్తలు:',
      homeRemedies: [
        'రోజుకు కనీసం 3 లీటర్ల గోరువెచ్చని నీరు తాగాలి (కఫం త్వరగా కరుగుతుంది).',
        'పడుకునేటప్పుడు తల కింద 2 దిండ్లు పెట్టుకుని కొద్దిగా వాలుగా పడుకోవాలి.',
        'పొగ, చల్లని గాలి, ధూమపానానికి దూరంగా ఉండాలి.',
        'గంటకు 5 సార్లు దీర్ఘంగా శ్వాస పీల్చి వదలాలి.'
      ],
      dangerAlertTitle: 'ఈ లక్షణాలు కనిపిస్తే వెంటనే పెద్ద ఆసుపత్రికి వెళ్ళండి:',
      dangerAlerts: [
        'కూర్చున్నా కూడా ఆయాసం, ఊపిరి అందకపోవడం',
        'పెదవులు లేదా గోళ్లు నీలం రంగులోకి మారడం',
        'రక్తంతో కూడిన కఫం పడటం',
        'ఆక్సిజన్ లెవెల్ 92% కంటే తగ్గడం'
      ],
      spokenNarration: 'నమస్కారం. మీ ఛాతీ ఎక్స్-రే ప్రకారం మీ కుడి ఊపిరితిత్తులో ఇన్ఫెక్షన్ మరియు నీరు చేరింది. దీనినే న్యుమోనియా అంటారు. దీనివల్లనే మీకు దగ్గు మరియు జ్వరం వస్తున్నాయి. డాక్టర్‌ను సంప్రదించి ఆగ్మెంటిన్ యాంటీబయాటిక్ మరియు జ్వరానికి పారాసిటమాల్ వేసుకోవాలి. గోరువెచ్చని నీరు ఎక్కువగా తాగండి. ఊపిరి తీసుకోవడం కష్టమైతే వెంటనే అత్యవసర చికిత్సకు వెళ్ళండి.'
    },

    kn: {
      conditionTitle: 'ಬಲ ಶ್ವಾಸಕೋಶದಲ್ಲಿ ಸೋಂಕು ಮತ್ತು ಕಫ/ನೀರು (ನ್ಯುಮೋನಿಯಾ)',
      severityLevel: 'warning',
      severityText: 'ಮಧ್ಯಮ ತೊಂದರೆ — ತಕ್ಷಣ ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ',
      whatHappenedTitle: 'ನಿಮ್ಮ ದೇಹದಲ್ಲಿ ಏನಾಗಿದೆ?',
      whatHappenedSimple: 'ನಿಮ್ಮ ಬಲ ಶ್ವಾಸಕೋಶದ ಕೆಳಭಾಗದಲ್ಲಿ ಬ್ಯಾಕ್ಟೀರಿಯಾ ಸೋಂಕು ಉಂಟಾಗಿದ್ದು, ಕಫ ಮತ್ತು ನೀರು ತುಂಬಿಕೊಂಡಿದೆ. ಇದರಿಂದಾಗಿ ಕೆಮ್ಮು, ಜ್ವರ ಮತ್ತು ಎದೆ ನೋವು ಬರುತ್ತಿದೆ. ನಿಮ್ಮ ಹೃದಯವು ಆರೋಗ್ಯಕರವಾಗಿದೆ.',
      whatHappenedDetailed: 'ಶ್ವಾಸಕೋಶವು ಗಾಳಿ ತುಂಬುವ ಸ್ಪಂಜಿನಂತೆ ಇರುತ್ತದೆ. ಸೋಂಕಿನಿಂದಾಗಿ ಗಾಳಿ ಆಡುವ ಜಾಗದಲ್ಲಿ ಕಫ ತುಂಬಿಕೊಂಡಿದೆ.',
      whatMedicineTitle: 'ಯಾವ ಔಷಧಿಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಬೇಕು?',
      medicines: [
        {
          type: 'ಸೋಂಕು ನಿವಾರಕ ಮಾತ್ರೆ (ಆಂಟಿಬಯೋಟಿಕ್)',
          medicineName: 'ಆಗ್ಮೆಂಟಿನ್ (Augmentin 625mg) ಅಥವಾ ಅಜಿಥ್ರೊಮೈಸಿನ್',
          timing: 'ದಿನಕ್ಕೆ 2 ಬಾರಿ, ಊಟದ ನಂತರ 5 ರಿಂದ 7 ದಿನಗಳವರೆಗೆ',
          reason: 'ಶ್ವಾಸಕೋಶದಲ್ಲಿರುವ ಸೋಂಕಿನ ಕ್ರಿಮಿಗಳನ್ನು ಕೊಲ್ಲಲು. ಮಧ್ಯದಲ್ಲೇ ನಿಲ್ಲಿಸಬಾರದು.'
        },
        {
          type: 'ಜ್ವರ ಮತ್ತು ಮೈಕೈ ನೋವಿನ ಮಾತ್ರೆ',
          medicineName: 'ಪ್ಯಾರಸಿಟಮಾಲ್ (Dolo 650)',
          timing: 'ಜ್ವರ ಬಂದಾಗ ಮಾತ್ರ, 6 ಗಂಟೆಗಳ ಅಂತರದಲ್ಲಿ',
          reason: 'ಜ್ವರ ಮತ್ತು ಎದೆಯ ಚುಚ್ಚುವ ನೋವನ್ನು ಕಡಿಮೆ ಮಾಡಲು.'
        },
        {
          type: 'ಕಫ ಕರಗಿಸುವ ಸಿರಪ್',
          medicineName: 'ಗ್ವೈಫೆನೆಸಿನ್ ಕಫ ಸಿರಪ್',
          timing: 'ದಿನಕ್ಕೆ 2-3 ಬಾರಿ ಉಗುರುಬೆಚ್ಚಗಿನ ನೀರಿನೊಂದಿಗೆ',
          reason: 'ಎದೆಯಲ್ಲಿ ಕಟ್ಟಿಕೊಂಡಿರುವ ಗಟ್ಟಿ ಕಫವನ್ನು ಕರಗಿಸಿ ಹೊರಹಾಕಲು.'
        }
      ],
      homeRemediesTitle: 'ಮನೆಯಲ್ಲಿ ಮಾಡಬೇಕಾದ ಉಪಚಾರಗಳು:',
      homeRemedies: [
        'ದಿನಕ್ಕೆ ಕನಿಷ್ಠ 2.5 ರಿಂದ 3 ಲೀಟರ್ ಬೆಚ್ಚಗಿನ ನೀರು ಕುಡಿಯಿರಿ.',
        'ಮಲಗುವಾಗ ತಲೆಯ ಕೆಳಗೆ 2 ದಿಂಬುಗಳನ್ನು ಇಟ್ಟು ಸ್ವಲ್ಪ ಎತ್ತರವಾಗಿ ಮಲಗಿ.',
        'ತಣ್ಣನೆಯ ಗಾಳಿ, ಧೂಮಪಾನದಿಂದ ಸಂಪೂರ್ಣವಾಗಿ ದೂರವಿರಿ.',
        'ಆಗಾಗ ಆಳವಾಗಿ ಉಸಿರಾಡಿ ಕಫವನ್ನು ಹೊರಹಾಕಿ.'
      ],
      dangerAlertTitle: 'ಈ ಲಕ್ಷಣಗಳು ಕಂಡರೆ ತಕ್ಷಣ ಆಸ್ಪತ್ರೆಗೆ ಧಾವಿಸಿ:',
      dangerAlerts: [
        'ಕುಳಿತಿದ್ದರೂ ಉಸಿರಾಡಲು ತುಂಬಾ ಕಷ್ಟವಾಗುವುದು',
        'ತುಟಿಗಳು ಅಥವಾ ಉಗುರುಗಳು ನೀಲಿ ಬಣ್ಣಕ್ಕೆ ತಿರುಗುವುದು',
        'ಕೆಮ್ಮಿದಾಗ ರಕ್ತ ಬರುವುದು',
        'ಆಕ್ಸಿಜನ್ ಮಟ್ಟ 92% ಕ್ಕಿಂತ ಕಡಿಮೆಯಾಗುವುದು'
      ],
      spokenNarration: 'ನಮಸ್ಕಾರ. ನಿಮ್ಮ ಎದೆಯ ಎಕ್ಸ್-ರೇ ಪರೀಕ್ಷೆಯ ಪ್ರಕಾರ ಬಲ ಶ್ವಾಸಕೋಶದಲ್ಲಿ ಸೋಂಕು ಮತ್ತು ಕಫ ತುಂಬಿದೆ. ಇದನ್ನು ನ್ಯುಮೋನಿಯಾ ಎಂದು ಕರೆಯುತ್ತಾರೆ. ಇದರಿಂದ ಕೆಮ್ಮು ಮತ್ತು ಜ್ವರ ಬರುತ್ತಿದೆ. ವೈದ್ಯರ ಸಲಹೆಯಂತೆ ಆಂಟಿಬಯೋಟಿಕ್ ಮಾತ್ರೆ ಮತ್ತು ಜ್ವರಕ್ಕೆ ಡೋಲೋ ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳಿ. ಬೆಚ್ಚಗಿನ ನೀರನ್ನು ಹೆಚ್ಚಾಗಿ ಕುಡಿಯಿರಿ. ಉಸಿರಾಟ ತುಂಬಾ ಕಷ್ಟವಾದರೆ ತಕ್ಷಣ ಆಸ್ಪತ್ರೆಗೆ ಭೇಟಿ ನೀಡಿ.'
    },

    hi: {
      conditionTitle: 'दाहिने फेफड़े में इन्फेक्शन और कफ (निमोनिया)',
      severityLevel: 'warning',
      severityText: 'मध्यम समस्या — तुरंत डॉक्टर को दिखाएं',
      whatHappenedTitle: 'आपकी रिपोर्ट में क्या आया है?',
      whatHappenedSimple: 'आपके दाहिने फेफड़े के निचले हिस्से में बैक्टीरिया का इन्फेक्शन हो गया है और वहां पानी/बलगम जमा हो गया है। इसी कारण आपको तेज बुखार, खांसी और सीने में दर्द हो रहा है। आपका दिल बिल्कुल ठीक है।',
      whatHappenedDetailed: 'फेफड़े स्पंज की तरह होते हैं जो हवा खींचते हैं। इन्फेक्शन की वजह से एक हिस्से में हवा की जगह मवाद भर गया है।',
      whatMedicineTitle: 'कौन सी दवाइयां लेनी होंगी?',
      medicines: [
        {
          type: 'इन्फेक्शन खत्म करने वाली गोली (एंटीबायोटिक)',
          medicineName: 'ऑगमेंटिन (Augmentin 625mg) या एजिथ्रोमाइसिन',
          timing: 'दिन में 2 बार, खाना खाने के बाद 5 से 7 दिनों तक',
          reason: 'फेफड़े के कीटाणुओं को पूरी तरह खत्म करने के लिए। कोर्स बीच में न छोड़ें।'
        },
        {
          type: 'बुखार और दर्द की गोली',
          medicineName: 'पैरासिटामोल (Dolo 650 / Paracetamol)',
          timing: 'बुखार होने पर, 6 घंटे के अंतराल पर',
          reason: 'तेज बुखार को उतारने और सीने के दर्द में राहत देने के लिए।'
        },
        {
          type: 'बलगम निकालने वाला सिरप',
          medicineName: 'ग्वाइफेनेसिन सिरप (Mucinex)',
          timing: 'दिन में 2 से 3 बार गर्म पानी के साथ',
          reason: 'जमे हुए कफ को पतला करके बाहर निकालने के लिए।'
        }
      ],
      homeRemediesTitle: 'घर पर क्या सावधानियां बरतें?',
      homeRemedies: [
        'दिन भर में कम से कम 3 लीटर गुनगुना पानी या सूप पिएं।',
        'सोते समय सिर के नीचे 2 तकिए लगाकर थोड़ा ऊंचा होकर सोएं।',
        'धूल, धुएं और सिगरेट/बीड़ी से बिल्कुल दूर रहें।',
        'हर एक घंटे में 5 बार गहरी सांस लें और छोड़ें।'
      ],
      dangerAlertTitle: 'अगर ये लक्षण दिखें तो तुरंत बड़े अस्पताल जाएं:',
      dangerAlerts: [
        'बैठे-बैठे भी सांस फूलना और दम घुटना',
        'होंठ या उंगलियों का नीला पड़ना',
        'खांसी में खून आना',
        'ऑक्सीजन लेवल (SpO2) 92% से नीचे गिरना'
      ],
      spokenNarration: 'नमस्ते। आपकी छाती के एक्सरे में दाहिने फेफड़े में इन्फेक्शन और पानी पाया गया है। इसे निमोनिया कहते हैं। इसी वजह से आपको खांसी और बुखार आ रहा है। डॉक्टर की सलाह से एंटीबायोटिक और बुखार की गोली लें। दिन में गुनगुना पानी ज्यादा पिएं। अगर सांस लेने में ज्यादा तकलीफ हो तो तुरंत अस्पताल जाएं।'
    },

    ta: {
      conditionTitle: 'வலது நுரையீரலில் தொற்று மற்றும் சளி/நீர் (நிமோனியா)',
      severityLevel: 'warning',
      severityText: 'கவனிக்க வேண்டிய பிரச்சனை — உடனே மருத்துவரை அணுகவும்',
      whatHappenedTitle: 'உங்கள் உடலில் என்ன நடந்துள்ளது?',
      whatHappenedSimple: 'உங்கள் வலது நுரையீரலின் கீழ் பகுதியில் பாக்டீரியா தொற்று ஏற்பட்டு நீர் மற்றும் சளி தேங்கியுள்ளது. இதனால்தான் காய்ச்சல், இருமல், நெஞ்சு வலி ஏற்படுகிறது. உங்கள் இதயம் நல்ல நிலையில் உள்ளது.',
      whatHappenedDetailed: 'நுரையீரல் காற்று நிரம்பும் பஞ்சு போன்றது. தொற்று காரணமாக ஒரு பகுதியில் சளி அடைத்துள்ளது.',
      whatMedicineTitle: 'என்ன மருந்துகள் சாப்பிட வேண்டும்?',
      medicines: [
        {
          type: 'தொற்று எதிர்ப்பு மாத்திரை (Antibiotic)',
          medicineName: 'ஆக்மெண்டின் (Augmentin 625mg) அல்லது அசித்ரோமைசின்',
          timing: 'தினமும் 2 வேளை, உணவுக்குப் பின் 5-7 நாட்கள்',
          reason: 'நுரையீரலில் உள்ள கிருமிகளை அழிக்க. குணமாகும் வரை முழுமையாக சாப்பிட வேண்டும்.'
        },
        {
          type: 'காய்ச்சல் மற்றும் வலி மாத்திரை',
          medicineName: 'பாராசிட்டமால் (Dolo 650)',
          timing: 'காய்ச்சல் இருக்கும்போது 6 மணி நேர இடைவெளியில்',
          reason: 'காய்ச்சலை கட்டுப்படுத்தவும் நெஞ்சு வலியை குறைக்கவும்.'
        },
        {
          type: 'சளி வெளியேற்றும் மருந்து',
          medicineName: 'சளி நிவாரண சிரப்',
          timing: 'தினமும் 2-3 வேளை வெதுவெதுப்பான நீருடன்',
          reason: 'நெஞ்சில் கட்டியிருக்கும் கெட்டியான சளியை கரைத்து வெளியேற்ற.'
        }
      ],
      homeRemediesTitle: 'வீட்டில் செய்ய வேண்டியவை:',
      homeRemedies: [
        'தினமும் 3 லிட்டர் வெதுவெதுப்பான நீர் அருந்தவும்.',
        'படுக்கும்போது 2 தலையணைகள் வைத்து சற்று சாய்வாக படுக்கவும்.',
        'புகை மற்றும் தூசியை தவிர்க்கவும்.',
        'அடிக்கடி ஆழ்ந்த மூச்சு பயிற்சி செய்யவும்.'
      ],
      dangerAlertTitle: 'உடனடியாக அவசர சிகிச்சை பிரிவுக்கு செல்ல வேண்டிய அறிகுறிகள்:',
      dangerAlerts: [
        'மூச்சு விடுவதில் அதீத சிரமம் அல்லது மூச்சு திணறல்',
        'உதடுகள் அல்லது விரல்கள் நீல நிறமாக மாறுவது',
        'இருமலில் ரத்தம் வருவது',
        'ஆக்சிஜன் அளவு 92% க்கும் கீழே குறைவது'
      ],
      spokenNarration: 'வணக்கம். உங்கள் நெஞ்சு எக்ஸ்ரே பரிசோதனையில் வலது நுரையீரலில் தொற்று மற்றும் சளி உள்ளது தெரியவந்துள்ளது. இதற்கு நிமோனியா என்று பெயர். இதனால்தான் காய்ச்சல் மற்றும் இருமல் உள்ளது. மருத்துவர் ஆலோசனைப்படி ஆன்டிபயாடிக் மாத்திரை உட்கொள்ளவும். சுடுதண்ணீர் அதிகம் குடிக்கவும். மூச்சு திணறல் அதிகமானால் உடனே மருத்துவமனைக்கு செல்லவும்.'
    }
  },

  // 2. Bone Fracture / Normal (James Wilson Knee X-Ray)
  fracture: {
    en: {
      conditionTitle: 'Intact Osseous Architecture — No Fracture Identified',
      severityLevel: 'safe',
      severityText: 'Safe / Normal — Bones and Joints Are Structurally Sound',
      whatHappenedTitle: 'What is Happening?',
      whatHappenedSimple: 'Your radiograph confirms there are no broken bones, hairline cracks, or joint dislocations. Pain is likely due to a muscular sprain or ligament strain.',
      whatHappenedDetailed: 'All bones are intact and joint alignment is preserved.',
      whatMedicineTitle: 'Suggested Care & Medications:',
      medicines: [
        {
          type: 'Mild Analgesic',
          medicineName: 'Acetaminophen or Topical Pain Gel (Volini)',
          timing: 'As needed after meals',
          reason: 'Relieves joint discomfort and local muscular strain.'
        }
      ],
      homeRemediesTitle: 'Recovery Guidelines:',
      homeRemedies: [
        'Rest and elevate the joint on a pillow.',
        'Apply an ice pack for 15 minutes twice daily.'
      ],
      dangerAlertTitle: 'Seek Doctor If:',
      dangerAlerts: ['Inability to bear any weight on the leg'],
      spokenNarration: 'Hello. Your X-ray shows no broken bones or fractures. The pain is likely from a muscle sprain. Rest, apply ice, and take mild pain relief if needed.'
    },

    te: {
      conditionTitle: 'ఎముకలో పగులు / విరుగుడు లేదు (సాధారణ ఎముకలు)',
      severityLevel: 'safe',
      severityText: 'ప్రమాదం లేదు — ఎముకలు దృఢంగా ఉన్నాయి',
      whatHappenedTitle: 'మీ శరీరంలో ఏం జరిగింది?',
      whatHappenedSimple: 'మీ మోకాలి ఎక్స్-రేలో ఎముకలు ఏవీ విరగలేదు లేదా పగలలేదు. కీళ్ళు సరైన స్థానంలోనే ఉన్నాయి. నొప్పి కండరాలు లేదా నరాల ఒత్తిడి వల్ల వచ్చి ఉండవచ్చు.',
      whatHappenedDetailed: 'ఎముకలు దృఢంగా ఉన్నాయి, ఎటువంటి పగుళ్లు కనిపించలేదు.',
      whatMedicineTitle: 'ఏ మందులు వేసుకోవాలి?',
      medicines: [
        {
          type: 'నొప్పి తగ్గించే బిళ్ళ',
          medicineName: 'పారాసిటమాల్ లేదా ఐబూప్రోఫెన్ (డాక్టర్ సలహాతో)',
          timing: 'నొప్పి ఎక్కువగా ఉన్నప్పుడు భోజనం తర్వాత',
          reason: 'వాపు మరియు కండరాల నొప్పి తగ్గించడానికి.'
        },
        {
          type: 'లేపనం / జెల్',
          medicineName: 'వోలిని లేదా డైక్లోఫెనాక్ జెల్',
          timing: 'రోజుకు 2-3 సార్లు మోకాలిపై సున్నితంగా రాయాలి',
          reason: 'పైపై నొప్పులను త్వరగా తగ్గిస్తుంది.'
        }
      ],
      homeRemediesTitle: 'ఇంట్లో జాగ్రత్తలు (R.I.C.E పద్ధతి):',
      homeRemedies: [
        'విశ్రాంతి: మోకాలిపై ఎక్కువ బరువు వేయకుండా విశ్రాంతి ఇవ్వండి.',
        'ఐస్ ప్యాక్: రోజుకు 3 సార్లు ఐస్ ముక్కలతో 15 నిమిషాలు కాపడం పెట్టండి.',
        'ఎత్తుగా ఉంచండి: పడుకున్నప్పుడు మోకాలి కింద దిండు పెట్టుకోండి.'
      ],
      dangerAlertTitle: 'ఎప్పుడు డాక్టర్‌ను మళ్ళీ కలవాలి?',
      dangerAlerts: [
        'కాలు అస్సలు నేలపై మోపలేకపోవడం',
        'మోకాలు విపరీతంగా వాచి ఎర్రబడటం'
      ],
      spokenNarration: 'నమస్కారం. మీ మోకాలి ఎక్స్-రే చాలా బాగుంది. ఎముకలు ఏవీ విరగలేదు. నొప్పి కండరాల బెణుకు వల్ల వచ్చి ఉండవచ్చు. ఐస్ ప్యాక్ పెట్టుకుని విశ్రాంతి తీసుకోండి. నొప్పి ఉంటే డాక్టర్ సూచించిన నొప్పి బిళ్ళ వేసుకోండి.'
    },

    kn: {
      conditionTitle: 'ಮೂಳೆ ಮುರಿತವಿಲ್ಲ — ಮೂಳೆಗಳು ಸುರಕ್ಷಿತವಾಗಿವೆ',
      severityLevel: 'safe',
      severityText: 'ಚಿಂತೆಯಿಲ್ಲ — ಮೂಳೆಗಳಲ್ಲಿ ಯಾವುದೇ ಬಿರುಕಿಲ್ಲ',
      whatHappenedTitle: 'ನಿಮ್ಮ ವರದಿಯಲ್ಲಿ ಏನಿದೆ?',
      whatHappenedSimple: 'ನಿಮ್ಮ ಮೊಣಕಾಲಿನ ಎಕ್ಸ್-ರೇಯಲ್ಲಿ ಯಾವುದೇ ಮೂಳೆ ಮುರಿದಿಲ್ಲ. ಕೀಲುಗಳು ಸರಿಯಾದ ಜಾಗದಲ್ಲಿವೆ. ನೋವು ಸ್ನಾಯುಗಳ ಸೆಳೆತದಿಂದ ಇರಬಹುದು.',
      whatHappenedDetailed: 'ಎಲ್ಲಾ ಮೂಳೆಗಳು ಗಟ್ಟಿಯಾಗಿವೆ, ಯಾವುದೇ ಹಾನಿಯಾಗಿಲ್ಲ.',
      whatMedicineTitle: 'ಯಾವ ಔಷಧ ಬಳಸಬೇಕು?',
      medicines: [
        {
          type: 'ನೋವು ನಿವಾರಕ ಮಾತ್ರೆ',
          medicineName: 'ಪ್ಯಾರಸಿಟಮಾಲ್',
          timing: 'ನೋವು ಇದ್ದಾಗ ಊಟದ ನಂತರ',
          reason: 'ಸ್ನಾಯು ಸೆಳೆತದ ನೋವು ಕಡಿಮೆ ಮಾಡಲು.'
        }
      ],
      homeRemediesTitle: 'ಮನೆಯಲ್ಲಿ ವಿಶ್ರಾಂತಿ ಕ್ರಮಗಳು:',
      homeRemedies: [
        'ಐಸ್ ಹಚ್ಚಿ: ದಿನಕ್ಕೆ 2-3 ಬಾರಿ ಐಸ್ ಪ್ಯಾಕ್ ಇಡಿ.',
        'ಹೆಚ್ಚು ನಡೆಯಬೇಡಿ, ಮೊಣಕಾಲಿಗೆ ವಿಶ್ರಾಂತಿ ನೀಡಿ.'
      ],
      dangerAlertTitle: 'ಎಚ್ಚರಿಕೆಯ ಲಕ್ಷಣಗಳು:',
      dangerAlerts: ['ಕಾಲು ಊರಲು ಸಾಧ್ಯವಾಗದೇ ಇರುವುದು', 'ಅತಿಯಾದ ಊತ ಕಂಡುಬರುವುದು'],
      spokenNarration: 'ನಮಸ್ಕಾರ. ನಿಮ್ಮ ಎಕ್ಸ್-ರೇಯಲ್ಲಿ ಯಾವುದೇ ಮೂಳೆ ಮುರಿದಿಲ್ಲ. ಸ್ನಾಯುಗಳ ಊತದಿಂದ ನೋವು ಇರಬಹುದು. ಐಸ್ ಪ್ಯಾಕ್ ಇಟ್ಟು ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ.'
    },

    hi: {
      conditionTitle: 'हड्डी में कोई फ्रैक्चर नहीं है (हड्डियां सुरक्षित हैं)',
      severityLevel: 'safe',
      severityText: 'चिंता की कोई बात नहीं — कोई फ्रैक्चर नहीं है',
      whatHappenedTitle: 'रिपोर्ट में क्या आया है?',
      whatHappenedSimple: 'आपके घुटने के एक्सरे में कोई भी हड्डी टूटी या चटकती हुई नहीं मिली है। जोड़ बिल्कुल सही जगह पर हैं। दर्द मांसपेशियों में खिंचाव या मोच की वजह से हो सकता है।',
      whatHappenedDetailed: 'हड्डियां मजबूत और सुरक्षित हैं।',
      whatMedicineTitle: 'कौन सी दवा लें?',
      medicines: [
        {
          type: 'दर्द निवारक गोली',
          medicineName: 'पैरासिटामोल या दर्द निवारक जेल',
          timing: 'दर्द होने पर भोजन के बाद',
          reason: 'सूजन और दर्द को शांत करने के लिए।'
        }
      ],
      homeRemediesTitle: 'घर पर क्या करें:',
      homeRemedies: [
        'बर्फ की सिकाई: दिन में 2-3 बार 15 मिनट बर्फ लगाएं।',
        'पैर पर ज्यादा वजन न डालें और आराम करें।'
      ],
      dangerAlertTitle: 'डॉक्टर को कब दिखाएं:',
      dangerAlerts: ['पैर जमीन पर बिल्कुल न टिक पाना', 'घुटने में बहुत ज्यादा सूजन आना'],
      spokenNarration: 'नमस्ते। आपकी एक्सरे रिपोर्ट में कोई भी हड्डी टूटी नहीं है। दर्द मोच की वजह से हो सकता है। बर्फ की सिकाई करें और आराम करें।'
    },

    ta: {
      conditionTitle: 'எலும்பு முறிவு இல்லை — எலும்புகள் பாதுகாப்பாக உள்ளன',
      severityLevel: 'safe',
      severityText: 'பயப்பட தேவையில்லை — விரிசல் இல்லை',
      whatHappenedTitle: 'உடலில் என்ன பிரச்சனை?',
      whatHappenedSimple: 'உங்கள் முழங்கால் எக்ஸ்ரேயில் எலும்பு முறிவு எதுவும் இல்லை. தசை பிடிப்பு காரணமாக வலி இருக்கலாம்.',
      whatHappenedDetailed: 'எலும்புகள் சீராக உள்ளன.',
      whatMedicineTitle: 'மருந்துகள்:',
      medicines: [
        {
          type: 'வலி நிவாரணி',
          medicineName: 'பாராசிட்டமால் மற்றும் வலி நிவாரண ஜெல்',
          timing: 'வலி இருக்கும் போது',
          reason: 'வீக்கம் மற்றும் வலியை குறைக்க.'
        }
      ],
      homeRemediesTitle: 'வீட்டு குறிப்புகள்:',
      homeRemedies: ['ஐஸ் ஒத்தடம் கொடுக்கவும்.', 'அதிகமாக நடக்காமல் ஓய்வெடுக்கவும்.'],
      dangerAlertTitle: 'எச்சரிக்கை:',
      dangerAlerts: ['காலை தரையில் ஊன்ற முடியாமல் போவது'],
      spokenNarration: 'வணக்கம். உங்கள் எக்ஸ்ரேயில் எலும்பு முறிவு எதுவும் இல்லை. ஐஸ் ஒத்தடம் கொடுத்து ஓய்வெடுக்கவும்.'
    }
  }
};

export interface UiTranslations {
  bannerBadge: string;
  bannerTitle: string;
  bannerSubtitle: string;
  listenButton: string;
  stopButton: string;
  selectLanguagePrompt: string;
  cameraTitle: string;
  cameraDesc: string;
  cameraBtn: string;
  sample1Title: string;
  sample1Tag: string;
  sample1Desc: string;
  sample2Title: string;
  sample2Tag: string;
  sample2Desc: string;
  analyzingTitle: string;
  analyzingDesc: string;
  severityLabel: string;
  step1Badge: string;
  step2Badge: string;
  step3Badge: string;
  step3Title: string;
  organsLabel: string;
  organsNormal: string;
  cautionDoctorNotice: string;
  ambulanceBtn: string;
  whatsAppBtn: string;
  printBtn: string;
  footerNote: string;
  // New features
  ocrScannerTitle: string;
  ocrScanningLine: string;
  ocrRecognizedLabel: string;
  ocrCompleteNotice: string;
  phcTitle: string;
  phcSubtitle: string;
  callPharmacyBtn: string;
  getDirectionsBtn: string;
  talkToAiTitle: string;
  talkToAiSubtitle: string;
  speakSymptomsPrompt: string;
  listeningStatus: string;
  aiThinkingStatus: string;
  commonSymptomsPrompt: string;
  copyReportBtn?: string;
  reportCopiedNotice?: string;
  facilitiesNearYouBadge: string;
  searchHospitalPlaceholder: string;
  hospitalSearchPrompt: string;
  clearSearchBtn: string;
  locatedFacilitiesBadge: string;
  inStockMedicinesLabel: string;
  downloadPdfReportBtn: string;
  whatsAppPdfShareBtn: string;
  allFacilitiesTab: string;
  govtHospitalsTab: string;
  specialtyHospitalsTab: string;
  pharmaciesTab: string;
  anyHospitalPrompt: string;
  listenInNativeBtn: string;
  listenInEnglishBtn: string;
}

export const REGIONAL_UI_STRINGS: Record<SupportedLanguage, UiTranslations> = {
  en: {
    bannerBadge: 'Rural & Plain-Language Health Assistant • Voice Engine',
    bannerTitle: 'X-Ray & Medical Report Plain Translation (Regional Voice AI)',
    bannerSubtitle: 'Designed for everyone to understand medical scans and medications in their native language with voice narration.',
    listenButton: '🔊 Listen Voice Audio',
    stopButton: '⏹️ Stop Voice',
    selectLanguagePrompt: 'SELECT YOUR PREFERRED LANGUAGE:',
    cameraTitle: '📷 Take Photo / Upload Scan',
    cameraDesc: 'Snap a photo of your X-ray film or printed paper report. AI reads and speaks it aloud.',
    cameraBtn: 'Take Photo of Scan / Report',
    sample1Title: 'Chest X-Ray (Sarah Jenkins)',
    sample1Tag: 'Pneumonia / Lung Infection',
    sample1Desc: 'Right lower lung infection & high fever',
    sample2Title: 'Knee X-Ray (James Wilson)',
    sample2Tag: 'Bones Safe / Normal',
    sample2Desc: 'No fracture detected • Muscular strain',
    analyzingTitle: 'Analyzing your medical scan...',
    analyzingDesc: 'Reading image findings and converting to plain language with audio.',
    severityLabel: 'SEVERITY STATUS:',
    step1Badge: 'Step 1',
    step2Badge: 'Step 2',
    step3Badge: 'Step 3',
    step3Title: 'Precautions & Emergency Warnings',
    organsLabel: 'Heart & other organs:',
    organsNormal: 'Healthy (Normal)',
    cautionDoctorNotice: '⚠️ Please verify with a doctor or certified pharmacist before taking medicines.',
    ambulanceBtn: 'Emergency Ambulance: Dial 108',
    whatsAppBtn: 'Share Formal WhatsApp Summary',
    printBtn: 'Print Full Report',
    footerNote: 'Easily share this voice summary with family members or your local healthcare worker.',
    ocrScannerTitle: 'Live OCR Medical Text & Film Scanner',
    ocrScanningLine: 'Laser scanning paper text & DICOM tags...',
    ocrRecognizedLabel: 'Recognized Clinical Findings:',
    ocrCompleteNotice: '✓ Optical text recognition complete — Speech synthesized',
    phcTitle: 'Nearby Government Clinics (PHCs) & 24/7 Pharmacies',
    phcSubtitle: 'Locate free government healthcare centers and verified medicine stores near you',
    callPharmacyBtn: 'Call Pharmacy',
    getDirectionsBtn: 'Get Directions',
    talkToAiTitle: '🎙️ Talk to AI Doctor (Voice Symptom Helper)',
    talkToAiSubtitle: 'Speak your symptoms in your language or select common issues below',
    speakSymptomsPrompt: 'Hold to Speak Symptoms',
    listeningStatus: 'Listening to your voice... Speak now',
    aiThinkingStatus: 'Analyzing your symptoms with clinical database...',
    commonSymptomsPrompt: 'Or Tap a Common Symptom to Ask AI:',
    copyReportBtn: 'Copy Full Text Report',
    reportCopiedNotice: '✓ Formal report copied to clipboard!',
    facilitiesNearYouBadge: 'Verified Healthcare Centers',
    searchHospitalPlaceholder: 'Enter hospital name or area (e.g. Apollo, Gandhi, KIMS, PHC)...',
    hospitalSearchPrompt: 'Search by Hospital or Area Name:',
    clearSearchBtn: 'Clear',
    locatedFacilitiesBadge: 'Facilities Located',
    inStockMedicinesLabel: 'In-Stock Medicines:',
        downloadPdfReportBtn: 'Download Official PDF Report',
    whatsAppPdfShareBtn: 'Share Official PDF to WhatsApp',
    allFacilitiesTab: 'All Hospitals & Centers',
    govtHospitalsTab: 'Government & PHC (Free)',
    specialtyHospitalsTab: 'Super Specialty & ICU',
    pharmaciesTab: 'Pharmacies & Jan Aushadhi',
    anyHospitalPrompt: 'Search or enter ANY hospital name (e.g. Apollo, Yashoda, Gandhi, Care, KIMS, PHC):',
    listenInNativeBtn: '🔊 Listen',
    listenInEnglishBtn: '🌐 In English'
  },

  te: {
    bannerBadge: 'గ్రామీణ & సులభ భాషా సహాయకుడు • వాయిస్ అసిస్టెంట్',
    bannerTitle: 'ఎక్స్-రే & రిపోర్ట్ సులభ వివరణ (Regional Voice AI)',
    bannerSubtitle: 'చదువురాని వారు కూడా సులభంగా అర్థం చేసుకునేలా మీ మాతృభాషలో రిపోర్ట్ మరియు మందుల వివరాలు.',
    listenButton: '🔊 వినండి (Listen Voice Audio)',
    stopButton: '⏹️ ఆపండి (Stop Voice)',
    selectLanguagePrompt: 'మీ భాషను ఎంచుకోండి / SELECT LANGUAGE:',
    cameraTitle: '📷 ఫోటో తీయండి / అప్‌లోడ్ చేయండి',
    cameraDesc: 'ఎక్స్-రే ఫిల్మ్ లేదా పేపర్ రిపోర్ట్ ఫోటో తీసి పెట్టండి. కంప్యూటర్ వెంటనే చదివి చెప్తుంది.',
    cameraBtn: 'ఫోటో తీయండి / అప్‌లోడ్ చేయండి',
    sample1Title: 'ఛాతీ ఎక్స్-రే (Sarah Jenkins)',
    sample1Tag: 'న్యుమోనియా (Pneumonia)',
    sample1Desc: 'కుడి ఊపిరితిత్తులో ఇన్ఫెక్షన్ & జ్వరం',
    sample2Title: 'మోకాలి ఎక్స్-రే (James Wilson)',
    sample2Tag: 'ఎముకలు బాగున్నాయి (Safe)',
    sample2Desc: 'ఎముక పగులు లేదు • కండరాల బెణుకు',
    analyzingTitle: 'మీ రిపోర్టును విశ్లేషిస్తున్నాము...',
    analyzingDesc: 'రాతను చదివి మీ భాషలోకి మారుస్తున్నాము.',
    severityLabel: 'ప్రమాద స్థాయి / SEVERITY STATUS:',
    step1Badge: 'స్టెప్ 1',
    step2Badge: 'స్టెప్ 2',
    step3Badge: 'స్టెప్ 3',
    step3Title: 'జాగ్రత్తలు & హెచ్చరికలు',
    organsLabel: 'గుండె & ఇతర అవయవాలు:',
    organsNormal: 'క్షేమం (Normal)',
    cautionDoctorNotice: '⚠️ డాక్టర్ లేదా మెడికల్ షాప్ వారి సలహా తీసుకున్న తర్వాతే మందులు వాడండి.',
    ambulanceBtn: 'అత్యవసర అంబులెన్స్: 108 కు కాల్ చేయండి',
    whatsAppBtn: 'వాట్సాప్‌లో అధికారిక సారాంశం పంపండి',
    printBtn: 'పూర్తి నివేదిక ప్రింట్ చేయండి',
    footerNote: 'కుటుంబ సభ్యులకు లేదా ఊరి ఆర్.ఎం.పి/ఆశా కార్యకర్తకు వాట్సాప్‌లో సులభంగా పంపవచ్చు.',
    ocrScannerTitle: 'లైవ్ పేపర్ & రిపోర్ట్ ఓ.సి.ఆర్ స్కానర్',
    ocrScanningLine: 'పేపర్ రాతను మరియు ఎక్స్-రే ఫిల్మ్‌ను స్కాన్ చేస్తున్నాము...',
    ocrRecognizedLabel: 'గుర్తించబడిన వైద్య వివరాలు:',
    ocrCompleteNotice: '✓ రాతను విజయవంతంగా చదివాము — ఆడియో సిద్ధంగా ఉంది',
    phcTitle: 'దగ్గరలోని ప్రాథమిక ఆరోగ్య కేంద్రాలు (PHC) & మందుల దుకాణాలు',
    phcSubtitle: 'ఉచిత ప్రభుత్వ ఆసుపత్రులు మరియు జన్ ఔషధి తక్కువ ధర మందుల షాపులు',
    callPharmacyBtn: 'కాల్ చేయండి',
    getDirectionsBtn: 'దారి చూడండి',
    talkToAiTitle: '🎙️ వాయిస్‌తో మాట్లాడండి (లక్షణాల సహాయకుడు)',
    talkToAiSubtitle: 'మీ సమస్యను నోటితో చెప్పండి లేదా కింద ఉన్న వాటిని నొక్కండి',
    speakSymptomsPrompt: 'నొక్కి మీ సమస్యను చెప్పండి',
    listeningStatus: 'మీ మాటలను వింటున్నాము... మాట్లాడండి',
    aiThinkingStatus: 'మీ లక్షణాలను విశ్లేషిస్తున్నాము...',
    commonSymptomsPrompt: 'లేదా ఈ సమస్యలపై క్లిక్ చేయండి:',
    copyReportBtn: 'రిపోర్ట్ కాపీ చేయండి',
    reportCopiedNotice: '✓ రిపోర్ట్ కాపీ అయ్యింది!',
    facilitiesNearYouBadge: 'ధృవీకరించబడిన వైద్య కేంద్రాలు',
    searchHospitalPlaceholder: 'ఆసుపత్రి లేదా ప్రాంతం పేరు టైప్ చేయండి (ఉదా: అపోలో, గాంధీ, కిమ్స్, పీహెచ్‌సీ)...',
    hospitalSearchPrompt: 'ఆసుపత్రి లేదా ప్రాంతం పేరుతో వెతకండి:',
    clearSearchBtn: 'రిసెట్',
    locatedFacilitiesBadge: 'దొరికిన ఆసుపత్రులు',
    inStockMedicinesLabel: 'అందుబాటులో ఉన్న మందులు:',
    downloadPdfReportBtn: 'అధికారిక పీడీఎఫ్ రిపోర్ట్ డౌన్‌లోడ్',
    whatsAppPdfShareBtn: 'వాట్సాప్‌లో అధికారిక పీడీఎఫ్ పంపండి',
    allFacilitiesTab: 'అన్ని ఆసుపత్రులు',
    govtHospitalsTab: 'ప్రభుత్వ ఆసుపత్రులు & పీహెచ్‌సీ (ఉచితం)',
    specialtyHospitalsTab: 'సూపర్ స్పెషాలిటీ & ఐసీయూ',
    pharmaciesTab: 'మెడికల్ షాపులు & జన్ ఔషధి',
    anyHospitalPrompt: 'ఏ ఆసుపత్రి పేరైనా వెతకండి లేదా నమోదు చేయండి (ఉదా: అపోలో, యశోద, గాంధీ, కేర్, కిమ్స్, పీహెచ్‌సీ):',
    listenInNativeBtn: '🔊 వినండి',
    listenInEnglishBtn: '🌐 ఆంగ్లంలో (In English)'
  },

  kn: {
    bannerBadge: 'ಗ್ರಾಮೀಣ & ಸರಳ ಭಾಷಾ ಸಹಾಯಕ • ಧ್ವನಿ ಎಂಜಿನ್',
    bannerTitle: 'ಎಕ್ಸ್-ರೇ & ವರದಿ ಸರಳ ವಿವರಣೆ (ಧ್ವನಿ AI)',
    bannerSubtitle: 'ಯಾರಾದರೂ ಸುಲಭವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯಲ್ಲಿ ಧ್ವನಿಯೊಂದಿಗೆ ವರದಿ ವಿವರ ಮತ್ತು ಔಷಧಿಗಳು.',
    listenButton: '🔊 ಧ್ವನಿ ಕೇಳಿ (Listen Audio)',
    stopButton: '⏹️ ನಿಲ್ಲಿಸಿ (Stop Voice)',
    selectLanguagePrompt: 'ನಿಮ್ಮ ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ / SELECT LANGUAGE:',
    cameraTitle: '📷 ಫೋಟೋ ತೆಗೆಯಿರಿ / ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    cameraDesc: 'ಎಕ್ಸ್-ರೇ ಫಿಲ್ಮ್ ಅಥವಾ ಕಾಗದದ ವರದಿಯ ಫೋಟೋ ತೆಗೆಯಿರಿ. ಕಂಪ್ಯೂಟರ್ ತಕ್ಷಣ ಧ್ವನಿಯಲ್ಲಿ ತಿಳಿಸುತ್ತದೆ.',
    cameraBtn: 'ಫೋಟೋ ತೆಗೆಯಿರಿ / ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    sample1Title: 'ಎದೆಯ ಎಕ್ಸ್-ರೇ (Sarah Jenkins)',
    sample1Tag: 'ನ್ಯುಮೋನಿಯಾ (Pneumonia)',
    sample1Desc: 'ಬಲ ಶ್ವಾಸಕೋಶದಲ್ಲಿ ಸೋಂಕು & ಜ್ವರ',
    sample2Title: 'ಮೊಣಕಾಲು ಎಕ್ಸ್-ರೇ (James Wilson)',
    sample2Tag: 'ಮೂಳೆಗಳು ಸುರಕ್ಷಿತ (Safe)',
    sample2Desc: 'ಮೂಳೆ ಮುರಿತವಿಲ್ಲ • ಸ್ನಾಯು ಸೆಳೆತ',
    analyzingTitle: 'ವರದಿಯನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
    analyzingDesc: 'ವರದಿಯನ್ನು ಓದಿ ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಧ್ವನಿಗೆ ಪರಿವರ್ತಿಸಲಾಗುತ್ತಿದೆ.',
    severityLabel: 'ಗಂಭೀರತೆಯ ಸ್ಥಿತಿ / SEVERITY STATUS:',
    step1Badge: 'ಹಂತ 1',
    step2Badge: 'ಹಂತ 2',
    step3Badge: 'ಹಂತ 3',
    step3Title: 'ಮುನ್ನೆಚ್ಚರಿಕೆಗಳು & ತುರ್ತು ಎಚ್ಚರಿಕೆ',
    organsLabel: 'ಹೃದಯ ಮತ್ತು ಇತರ ಅಂಗಗಳು:',
    organsNormal: 'ಆರೋಗ್ಯಕರ (Normal)',
    cautionDoctorNotice: '⚠️ ವೈದ್ಯರು ಅಥವಾ ಔಷಧ ತಜ್ಞರ ಸಲಹೆ ಪಡೆದ ನಂತರವೇ ಔಷಧ ತೆಗೆದುಕೊಳ್ಳಿ.',
    ambulanceBtn: 'ತುರ್ತು ಆಂಬ್ಯುಲೆನ್ಸ್: 108 ಗೆ ಕರೆ ಮಾಡಿ',
    whatsAppBtn: 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಅಧಿಕೃತ ವರದಿ ಕಳುಹಿಸಿ',
    printBtn: 'ಪೂರ್ಣ ವರದಿ ಪ್ರಿಂಟ್ ಮಾಡಿ',
    footerNote: 'ಕುಟುಂಬದ ಸದಸ್ಯರಿಗೆ ಅಥವಾ ಸ್ಥಳೀಯ ಆರೋಗ್ಯ ಕಾರ್ಯಕರ್ತರಿಗೆ ವಾಟ್ಸಾಪ್ ಮೂಲಕ ಸುಲಭವಾಗಿ ಕಳುಹಿಸಿ.',
    ocrScannerTitle: 'ಲೈವ್ ಪೇಪರ್ & ವರದಿ ಓ.ಸಿ.ಆರ್ ಸ್ಕ್ಯಾನರ್',
    ocrScanningLine: 'ವರದಿಯ ಅಕ್ಷರಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
    ocrRecognizedLabel: 'ಗುರುತಿಸಲಾದ ವೈದ್ಯಕೀಯ ವಿವರಗಳು:',
    ocrCompleteNotice: '✓ ಸ್ಕ್ಯಾನಿಂಗ್ ಪೂರ್ಣಗೊಂಡಿದೆ — ಧ್ವನಿ ಸಿದ್ಧವಾಗಿದೆ',
    phcTitle: 'ಹತ್ತಿರದ ಸರ್ಕಾರಿ ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರಗಳು (PHC) & ಔಷಧಾಲಯಗಳು',
    phcSubtitle: 'ಉಚಿತ ಸರ್ಕಾರಿ ಚಿಕಿತ್ಸಾಲಯಗಳು ಮತ್ತು ಜನೌಷಧಿ ಕೇಂದ್ರಗಳು',
    callPharmacyBtn: 'ಕರೆ ಮಾಡಿ',
    getDirectionsBtn: 'ಮಾರ್ಗ ನೋಡಿ',
    talkToAiTitle: '🎙️ ಧ್ವನಿಯ ಮೂಲಕ ಮಾತನಾಡಿ (ಲಕ್ಷಣಗಳ ಸಹಾಯಕ)',
    talkToAiSubtitle: 'ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಧ್ವನಿಯಲ್ಲಿ ತಿಳಿಸಿ ಅಥವಾ ಕೆಳಗಿನ ಆಯ್ಕೆಗಳನ್ನು ಒತ್ತಿ',
    speakSymptomsPrompt: 'ಒತ್ತಿ ನಿಮ್ಮ ಸಮಸ್ಯೆ ಹೇಳಿ',
    listeningStatus: 'ನಿಮ್ಮ ಧ್ವನಿಯನ್ನು ಆಲಿಸಲಾಗುತ್ತಿದೆ... ಮಾತನಾಡಿ',
    aiThinkingStatus: 'ನಿಮ್ಮ ಲಕ್ಷಣಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
    commonSymptomsPrompt: 'ಅಥವಾ ಈ ಸಾಮಾನ್ಯ ಲಕ್ಷಣಗಳ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ:',
    copyReportBtn: 'ವರದಿ ಕಾಪಿ ಮಾಡಿ',
    reportCopiedNotice: '✓ ವರದಿ ಕಾಪಿಯಾಗಿದೆ!',
    facilitiesNearYouBadge: 'ಪರಿಶೀಲಿಸಿದ ವೈದ್ಯಕೀಯ ಕೇಂದ್ರಗಳು',
    searchHospitalPlaceholder: 'ಆಸ್ಪತ್ರೆ ಅಥವಾ ಸ್ಥಳದ ಹೆಸರು ನಮೂದಿಸಿ (ಉದಾ: ಅಪೋಲೋ, ಗಾಂಧಿ, ಕಿಮ್ಸ್)...',
    hospitalSearchPrompt: 'ಆಸ್ಪತ್ರೆ ಅಥವಾ ಸ್ಥಳದ ಹೆಸರಿನಿಂದ ಹುಡುಕಿ:',
    clearSearchBtn: 'ಮರುಹೊಂದಿಸಿ',
    locatedFacilitiesBadge: 'ಕಂಡುಬಂದ ಆಸ್ಪತ್ರೆಗಳು',
    inStockMedicinesLabel: 'ಲಭ್ಯವಿರುವ ಔಷಧಿಗಳು:',
    downloadPdfReportBtn: 'ಅಧಿಕೃತ ಪಿಡಿಎಫ್ ವರದಿ ಡೌನ್‌ಲೋಡ್',
    whatsAppPdfShareBtn: 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಅಧಿಕೃತ ಪಿಡಿಎಫ್ ಕಳುಹಿಸಿ',
    allFacilitiesTab: 'ಎಲ್ಲಾ ಆಸ್ಪತ್ರೆಗಳು',
    govtHospitalsTab: 'ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಗಳು & ಪಿಎಚ್‌ಸಿ (ಉಚಿತ)',
    specialtyHospitalsTab: 'ಸೂಪರ್ ಸ್ಪೆಷಾಲಿಟಿ & ಐಸಿಯು',
    pharmaciesTab: 'ಔಷಧಾಲಯಗಳು & ಜನೌಷಧಿ',
    anyHospitalPrompt: 'ಯಾವುದೇ ಆಸ್ಪತ್ರೆ ಹೆಸರು ಹುಡುಕಿ ಅಥವಾ ನಮೂದಿಸಿ (ಅಪೋಲೋ, ಗಾಂಧಿ, ಕಿಮ್ಸ್, ಪಿಎಚ್‌ಸಿ):',
    listenInNativeBtn: '🔊 ಆಲಿಸಿ',
    listenInEnglishBtn: '🌐 ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ (In English)'
  },

  hi: {
    bannerBadge: 'ग्रामीण एवं सरल भाषा सहायक • वॉयस इंजन',
    bannerTitle: 'एक्स-रे और मेडिकल रिपोर्ट का सरल विवरण (वॉयस AI)',
    bannerSubtitle: 'अपनी मातृभाषा में रिपोर्ट और दवाइयों की जानकारी आवाज के साथ आसानी से समझें।',
    listenButton: '🔊 आवाज में सुनें (Listen Audio)',
    stopButton: '⏹️ रोकें (Stop Voice)',
    selectLanguagePrompt: 'अपनी भाषा चुनें / SELECT LANGUAGE:',
    cameraTitle: '📷 फोटो खींचें / अपलोड करें',
    cameraDesc: 'एक्स-रे फिल्म या पर्चे की फोटो खींचें। कंप्यूटर पढ़कर आवाज में समझाएगा।',
    cameraBtn: 'फोटो लें / अपलोड करें',
    sample1Title: 'छाती का एक्स-रे (Sarah Jenkins)',
    sample1Tag: 'निमोनिया (Pneumonia)',
    sample1Desc: 'दाहिने फेफड़े में इन्फेक्शन और बुखार',
    sample2Title: 'घुटने का एक्स-रे (James Wilson)',
    sample2Tag: 'हड्डियां सुरक्षित (Safe)',
    sample2Desc: 'कोई फ्रैक्चर नहीं • मांसपेशियों में खिंचाव',
    analyzingTitle: 'आपकी रिपोर्ट का विश्लेषण हो रहा है...',
    analyzingDesc: 'रिपोर्ट को पढ़कर आपकी भाषा में ऑडियो तैयार किया जा रहा है।',
    severityLabel: 'गंभीरता की स्थिति / SEVERITY STATUS:',
    step1Badge: 'चरण 1',
    step2Badge: 'चरण 2',
    step3Badge: 'चरण 3',
    step3Title: 'सावधानियां एवं आपातकालीन चेतावनी',
    organsLabel: 'दिल और अन्य अंग:',
    organsNormal: 'बिल्कुल ठीक (Normal)',
    cautionDoctorNotice: '⚠️ डॉक्टर या फार्मासिस्ट की सलाह के बाद ही दवाइयां लें।',
    ambulanceBtn: 'आपातकालीन एम्बुलेंस: 108 पर कॉल करें',
    whatsAppBtn: 'व्हाट्सएप पर आधिकारिक रिपोर्ट भेजें',
    printBtn: 'पूरी रिपोर्ट प्रिंट करें',
    footerNote: 'परिवार के सदस्यों या स्थानीय स्वास्थ्य कार्यकर्ता को व्हाट्सएप पर आसानी से भेजें।',
    ocrScannerTitle: 'लाइव पर्चा एवं रिपोर्ट ओसीआर स्कैनर',
    ocrScanningLine: 'पर्चे के टेक्स्ट और फिल्म को स्कैन किया जा रहा है...',
    ocrRecognizedLabel: 'पहचाने गए मेडिकल निष्कर्ष:',
    ocrCompleteNotice: '✓ टेक्स्ट स्कैनिंग पूरी हुई — ऑडियो तैयार है',
    phcTitle: 'नजदीकी प्राथमिक स्वास्थ्य केंद्र (PHC) एवं मेडिकल स्टोर',
    phcSubtitle: 'मुफ्त सरकारी अस्पताल एवं जन औषधि सस्ती दवा दुकानें',
    callPharmacyBtn: 'कॉल करें',
    getDirectionsBtn: 'रास्ता देखें',
    talkToAiTitle: '🎙️ बोलकर लक्षण बताएं (वॉयस डॉक्टर सहायक)',
    talkToAiSubtitle: 'अपनी आवाज में अपनी बीमारी बताएं या नीचे दिए गए लक्षणों को चुनें',
    speakSymptomsPrompt: 'दबाकर लक्षण बोलें',
    listeningStatus: 'आपकी आवाज सुनी जा रही है... बोलिए',
    aiThinkingStatus: 'आपके लक्षणों की जांच हो रही है...',
    commonSymptomsPrompt: 'या इन आम लक्षणों पर क्लिक करें:',
    copyReportBtn: 'रिपोर्ट कॉपी करें',
    reportCopiedNotice: '✓ रिपोर्ट कॉपी हो गई!',
    facilitiesNearYouBadge: 'प्रमाणित स्वास्थ्य केंद्र',
    searchHospitalPlaceholder: 'अस्पताल या इलाके का नाम दर्ज करें (जैसे: अपोलो, गांधी, केआईएमएस, पीएचसी)...',
    hospitalSearchPrompt: 'अस्पताल या इलाके के नाम से खोजें:',
    clearSearchBtn: 'रीसेट',
    locatedFacilitiesBadge: 'मिले अस्पताल',
    inStockMedicinesLabel: 'उपलब्ध दवाएं:',
    downloadPdfReportBtn: 'आधिकारिक पीडीएफ रिपोर्ट डाउनलोड',
    whatsAppPdfShareBtn: 'व्हाट्सएप पर आधिकारिक पीडीएफ भेजें',
    allFacilitiesTab: 'सभी अस्पताल एवं केंद्र',
    govtHospitalsTab: 'सरकारी अस्पताल एवं पीएचसी (मुफ्त)',
    specialtyHospitalsTab: 'सुपर स्पेशलिटी एवं आईसीयू',
    pharmaciesTab: 'दवा दुकानें एवं जन औषधि',
    anyHospitalPrompt: 'किसी भी अस्पताल का नाम खोजें या लिखें (जैसे: अपोलो, गांधी, यशोदा, केयर, केआईएमएस, पीएचसी):',
    listenInNativeBtn: '🔊 सुनें',
    listenInEnglishBtn: '🌐 अंग्रेज़ी में (In English)'
  },

  ta: {
    bannerBadge: 'கிராமப்புற எளிய மொழி உதவியாளர் • குரல் சேவை',
    bannerTitle: 'எக்ஸ்-ரே மற்றும் அறிக்கை எளிய விளக்கம் (குரல் AI)',
    bannerSubtitle: 'உங்கள் தாய்மொழியில் குரல் வழியே மருத்துவ அறிக்கை மற்றும் மருந்துகளை எளிதில் புரிந்துகொள்ளலாம்.',
    listenButton: '🔊 குரல் வழியே கேளுங்கள் (Listen Audio)',
    stopButton: '⏹️ நிறுத்துங்கள் (Stop Voice)',
    selectLanguagePrompt: 'மொழியைத் தேர்ந்தெடுக்கவும் / SELECT LANGUAGE:',
    cameraTitle: '📷 புகைப்படம் எடுக்கவும் / பதிவேற்றவும்',
    cameraDesc: 'எக்ஸ்-ரே பிலிம் அல்லது ரிப்போர்ட் புகைப்படம் எடுக்கவும். கணினி படித்து குரலில் கூறும்.',
    cameraBtn: 'புகைப்படம் எடுக்கவும்',
    sample1Title: 'நெஞ்சு எக்ஸ்-ரே (Sarah Jenkins)',
    sample1Tag: 'நிமோனியா (Pneumonia)',
    sample1Desc: 'வலது நுரையீரலில் தொற்று & காய்ச்சல்',
    sample2Title: 'முழங்கால் எக்ஸ்-ரே (James Wilson)',
    sample2Tag: 'எலும்புகள் சீராக உள்ளன (Safe)',
    sample2Desc: 'எலும்பு விரிசல் இல்லை • தசை பிடிப்பு',
    analyzingTitle: 'அறிக்கை ஆய்வு செய்யப்படுகிறது...',
    analyzingDesc: 'மருத்துவ அறிக்கையை படித்து உங்கள் மொழியில் ஒலி வடிவில் மாற்றுகிறது.',
    severityLabel: 'பாதிப்பு நிலை / SEVERITY STATUS:',
    step1Badge: 'படி 1',
    step2Badge: 'படி 2',
    step3Badge: 'படி 3',
    step3Title: 'முன்னெச்சரிக்கைகள் & எச்சரிக்கைகள்',
    organsLabel: 'இதயம் மற்றும் பிற உறுப்புகள்:',
    organsNormal: 'சீராக உள்ளது (Normal)',
    cautionDoctorNotice: '⚠️ மருத்துவர் அல்லது மருந்தாளுநரின் ஆலோசனைக்குப் பிறகே மருந்துகளை உட்கொள்ளவும்.',
    ambulanceBtn: 'அவசர ஆம்புலன்ஸ்: 108 ஐ அழைக்கவும்',
    whatsAppBtn: 'வாட்ஸ்அப்பில் அதிகாரப்பூர்வ அறிக்கை பகிரவும்',
    printBtn: 'முழு அறிக்கை அச்சிடவும்',
    footerNote: 'குடும்பத்தினர் அல்லது உள்ளூர் சுகாதார பணியாளருக்கு வாட்ஸ்அப் மூலம் எளிதாக அனுப்பலாம்.',
    ocrScannerTitle: 'நேரலை அறிக்கை ஸ்கேனர் (OCR)',
    ocrScanningLine: 'மருத்துவ அறிக்கையை ஸ்கேன் செய்கிறது...',
    ocrRecognizedLabel: 'கண்டறியப்பட்ட தகவல்கள்:',
    ocrCompleteNotice: '✓ ஸ்கேனிங் முடிந்தது — குரல் விளக்கம் தயார்',
    phcTitle: 'அருகிலுள்ள அரசு ஆரம்ப சுகாதார நிலையங்கள் (PHC) & மருந்தகங்கள்',
    phcSubtitle: 'இலவச அரசு சிகிச்சை மையங்கள் மற்றும் மக்கள் மருந்தகங்கள்',
    callPharmacyBtn: 'அழைக்கவும்',
    getDirectionsBtn: 'வழி பார்க்கவும்',
    talkToAiTitle: '🎙️ பேசி உதவி பெறவும் (குரல் உதவியாளர்)',
    talkToAiSubtitle: 'உங்கள் அறிகுறிகளை குரலில் கூறவும் அல்லது கீழே தேர்ந்தெடுக்கவும்',
    speakSymptomsPrompt: 'அழுத்தி அறிகுறிகளை கூறவும்',
    listeningStatus: 'உங்கள் குரல் கேட்கப்படுகிறது... பேசுங்கள்',
    aiThinkingStatus: 'உங்கள் அறிகுறிகள் ஆய்வு செய்யப்படுகிறது...',
    commonSymptomsPrompt: 'அல்லது பொதுவான அறிகுறிகளை கிளிக் செய்யவும்:',
    copyReportBtn: 'அறிக்கையை நகலெடுக்கவும்',
    reportCopiedNotice: '✓ அறிக்கை நகலெடுக்கப்பட்டது!',
    facilitiesNearYouBadge: 'சரிபார்க்கப்பட்ட மருத்துவ மையங்கள்',
    searchHospitalPlaceholder: 'மருத்துவமனை அல்லது பகுதியின் பெயரை உள்ளிடவும் (எ.கா: அப்பல்லோ, காந்தி)...',
    hospitalSearchPrompt: 'மருத்துவமனை அல்லது பகுதி வாரியாக தேடுங்கள்:',
    clearSearchBtn: 'மீட்டமை',
    locatedFacilitiesBadge: 'கண்டறியப்பட்ட மையங்கள்',
    inStockMedicinesLabel: 'கையிருப்பில் உள்ள மருந்துகள்:',
    downloadPdfReportBtn: 'அதிகாரப்பூர்ವ பிடிஎஃப் அறிக்கை பதிவிறக்கு',
    whatsAppPdfShareBtn: 'வாட்ஸ்அப்பில் அதிகாரப்பூர்வ பிடிஎஃப் பகிரவும்',
    allFacilitiesTab: 'அனைத்து மருத்துவமனைகள்',
    govtHospitalsTab: 'அரசு ஆரம்ப சுகாதார நிலையங்கள் (இலவசம்)',
    specialtyHospitalsTab: 'பல்நோக்கு சிறப்பு மருத்துவமனை & ஐசியூ',
    pharmaciesTab: 'மருந்தகங்கள் & மக்கள் மருந்தகம்',
    anyHospitalPrompt: 'எந்த மருத்துவமனை பெயரையும் தேடவும் அல்லது தட்டச்சு செய்யவும் (எ.கா: அப்பல்லோ, காந்தி, கிம்ஸ்):',
    listenInNativeBtn: '🔊 கேட்கவும்',
    listenInEnglishBtn: '🌐 ஆங்கிலத்தில் (In English)'
  }
};

// Verified nearby PHCs and Government/Generic Pharmacies in 100% pure single language
export const NEARBY_FACILITIES: Record<SupportedLanguage, NearbyFacility[]> = {
  en: [
    {
      id: 'fac_01',
      name: 'Government Primary Health Centre (PHC)',
      type: 'PHC',
      distance: '1.2 km away',
      address: 'Near Old Bus Stand, Community Health Sector',
      phone: '080-23456781',
      timing: 'Open 24 Hours • Emergency & IPD',
      badge: '100% Free Consultation & Antibiotics',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      availableMeds: ['Amoxicillin 500mg', 'Paracetamol 650mg', 'Oral Rehydration Salts', 'Nebulization Solution']
    },
    {
      id: 'fac_02',
      name: 'Gandhi Government General Hospital & Trauma Center',
      type: 'PHC',
      distance: '2.4 km away',
      address: 'Hospital Road, Sector 5, Central Zone',
      phone: '080-23456780',
      timing: '24/7 Multi-Specialty & ICU Trauma Ward',
      badge: 'Government Multi-Specialty Hospital',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      availableMeds: ['Emergency ICU', 'Ventilators', 'Digital CT / MRI', 'All Generic Antibiotics']
    },
    {
      id: 'fac_03',
      name: 'Osmania General Hospital',
      type: 'PHC',
      distance: '3.8 km away',
      address: 'Afzal Gunj, High Court Road',
      phone: '040-24600121',
      timing: '24/7 Government Tertiary Emergency Care',
      badge: 'Free Inpatient Beds & Surgery',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      availableMeds: ['Trauma ICU', 'Pulmonology Ward', 'Emergency Blood Bank', 'Free Generic Pharmacy']
    },
    {
      id: 'fac_04',
      name: 'AIIMS Super Specialty Hospital',
      type: 'PHC',
      distance: '5.2 km away',
      address: 'National Highway Medical Enclave',
      phone: '040-23458900',
      timing: 'Open 24 Hours • Advanced Emergency Care',
      badge: 'Apex Central Government Institute',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      availableMeds: ['Advanced Radiology', 'Critical Care ICU', 'Respiratory Medicine', 'Generic Dispensary']
    },
    {
      id: 'fac_05',
      name: 'Apollo Multi-Specialty Hospital & 24/7 Pharmacy',
      type: 'Apollo247',
      distance: '0.8 km away',
      address: 'Main Commercial Avenue, Diagnostic Block',
      phone: '080-23456783',
      timing: 'Open 24 Hours • Free Home Delivery',
      badge: '24/7 Super-Specialty Healthcare',
      badgeColor: 'bg-brand-500/20 text-brand-300 border-brand-500/30',
      availableMeds: ['Augmentin 625 Duo', 'Dolo 650', 'Mucinex Expectorant', 'Digital Pulse Oximeter', 'Steam Vaporizer']
    },
    {
      id: 'fac_06',
      name: 'KIMS Multi-Specialty Hospital',
      type: 'Apollo247',
      distance: '3.1 km away',
      address: 'Ring Road Junction, Health City',
      phone: '080-23456785',
      timing: 'Open 24 Hours • Emergency Care',
      badge: 'Level 1 Trauma & Cardiac Unit',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      availableMeds: ['Pulmonology Unit', 'Orthopedic Surgery', 'Emergency ICU Beds', 'Advanced Radiology']
    },
    {
      id: 'fac_07',
      name: 'Yashoda Super Specialty Hospital',
      type: 'Apollo247',
      distance: '2.1 km away',
      address: 'Raj Bhavan Road, Somajiguda',
      phone: '040-45674567',
      timing: 'Open 24 Hours • Comprehensive Trauma & Emergency',
      badge: 'Advanced Pulmonology & Critical Care',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      availableMeds: ['Emergency ICU', 'Interventional Pulmonology', 'CT/MRI Diagnostics', '24/7 Pharmacy']
    },
    {
      id: 'fac_08',
      name: 'Care Hospitals & Critical Care Institute',
      type: 'Apollo247',
      distance: '2.8 km away',
      address: 'Road No 1, Banjara Hills',
      phone: '040-61656565',
      timing: '24/7 Multi-Specialty Emergency Care',
      badge: 'Cardiac & Respiratory Emergency',
      badgeColor: 'bg-brand-500/20 text-brand-300 border-brand-500/30',
      availableMeds: ['Emergency Beds', 'Ventilator Care', 'Inpatient Pharmacy', 'Specialist Doctors']
    },
    {
      id: 'fac_09',
      name: 'AIG Hospitals (Asian Institute of Sciences)',
      type: 'Apollo247',
      distance: '4.5 km away',
      address: 'Mindspace Road, Gachibowli',
      phone: '040-42444222',
      timing: 'Open 24 Hours • Multi-Organ Emergency',
      badge: 'Super Specialty & Organ Care',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      availableMeds: ['Advanced ICU', 'Diagnostic Ultrasound', 'Antibiotic Infusions', '24/7 Pharmacy']
    },
    {
      id: 'fac_10',
      name: 'Rainbow Children & Family Hospital',
      type: 'Apollo247',
      distance: '1.9 km away',
      address: 'Road No 2, Banjara Hills',
      phone: '040-44665555',
      timing: '24/7 Pediatric & Adult Emergency',
      badge: 'Family Medicine & Emergency Care',
      badgeColor: 'bg-brand-500/20 text-brand-300 border-brand-500/30',
      availableMeds: ['Pediatric Antibiotics', 'Nebulizers', 'Emergency Pediatric ICU', 'Family Clinic']
    },
    {
      id: 'fac_11',
      name: 'Pradhan Mantri Jan Aushadhi Kendra',
      type: 'JanAushadhi',
      distance: '1.8 km away',
      address: 'Shop Number 4, Gandhi Chowk, Market Road',
      phone: '080-23456782',
      timing: '08:00 AM – 10:00 PM',
      badge: 'Generic Medicines at 50% to 80% Discount',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      availableMeds: ['Amoxicillin + Clavulanate 625 (₹72)', 'Paracetamol 650 (₹14/strip)', 'Cough Expectorant Syrup']
    },
    {
      id: 'fac_12',
      name: 'MedPlus 24/7 Pharmacy & Diagnostic Center',
      type: 'Apollo247',
      distance: '0.6 km away',
      address: 'Shop 12, Main Bazaar, Health Lane',
      phone: '040-67006700',
      timing: 'Open 24 Hours • Free Home Delivery',
      badge: 'Prescription Medicines & Instant Delivery',
      badgeColor: 'bg-brand-500/20 text-brand-300 border-brand-500/30',
      availableMeds: ['Augmentin 625', 'Dolo 650', 'Steam Inhalers', 'Pulse Oximeter', 'ORS Drinks']
    }
  ],

  te: [
    {
      id: 'fac_01',
      name: 'ప్రభుత్వ ప్రాథమిక ఆరోగ్య కేంద్రం (పీహెచ్‌సీ)',
      type: 'PHC',
      distance: '1.2 కిలోమీటర్ల దూరం',
      address: 'పాత బస్టాండ్ దగ్గర, ఆరోగ్య శాఖ రోడ్డు',
      phone: '080-23456781',
      timing: '24 గంటలు తెరిచి ఉంటుంది (అత్యవసర విభాగం)',
      badge: '100% ఉచిత డాక్టర్ పరీక్ష మరియు మందులు',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      availableMeds: ['ఆమోక్సిసిలిన్ యాంటీబయాటిక్', 'పారాసిటమాల్ 650', 'ఓఆర్ఎస్ ప్యాకెట్లు', 'ఆవిరి పీల్చే మందు']
    },
    {
      id: 'fac_02',
      name: 'గాంధీ ప్రభుత్వ సర్వజన ఆసుపత్రి & అత్యవసర విభాగం',
      type: 'PHC',
      distance: '2.4 కిలోమీటర్ల దూరం',
      address: 'ఆసుపత్రి రోడ్డు, సెక్టార్ 5, మెయిన్ సెంటర్',
      phone: '080-23456780',
      timing: '24 గంటలు అత్యవసర చికిత్స & ఐసీయూ',
      badge: 'ప్రభుత్వ పెద్ద సూపర్ స్పెషాలిటీ ఆసుపత్రి',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      availableMeds: ['అత్యవసర ఐసీయూ బెడ్లు', 'ఆక్సిజన్ సదుపాయం', 'డిజిటల్ ఎక్స్-రే మరియు సీటీ స్కాన్', 'ఉచిత మందులు']
    },
    {
      id: 'fac_03',
      name: 'ఉస్మానియా ప్రభుత్వ సర్వజన ఆసుపత్రి',
      type: 'PHC',
      distance: '3.8 కిలోమీటర్ల దూరం',
      address: 'అఫ్జల్ గంజ్, హైకోర్టు రోడ్డు',
      phone: '040-24600121',
      timing: '24 గంటలు ఉచిత ప్రభుత్వ అత్యవసర సేవలు',
      badge: 'ఉచిత బెడ్లు మరియు ఆపరేషన్ సదుపాయం',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      availableMeds: ['ట్రామా ఐసీయూ', 'ఊపిరితిత్తుల వార్డు', 'ఎమర్జెన్సీ బ్లడ్ బ్యాంక్', 'ఉచిత జనరిక్ మందులు']
    },
    {
      id: 'fac_04',
      name: 'ఎయిమ్స్ సూపర్ స్పెషాలిటీ ఆసుపత్రి (AIIMS)',
      type: 'PHC',
      distance: '5.2 కిలోమీటర్ల దూరం',
      address: 'నేషనల్ హైవే మెడికల్ క్యాంపస్',
      phone: '040-23458900',
      timing: '24 గంటలు అత్యాధునిక అత్యవసర విభాగం',
      badge: 'కేంద్ర ప్రభుత్వ అత్యున్నత వైద్య సంస్థ',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      availableMeds: ['అధునాతన రేడియాలజీ', 'క్రిటికల్ కేర్ ఐసీయూ', 'రెస్పిరేటరీ మెడిసిన్', 'ఉచిత మందుల కౌంటర్']
    },
    {
      id: 'fac_05',
      name: 'అపోలో సూపర్ స్పెషాలిటీ ఆసుపత్రి & 24 గంటల మెడికల్స్',
      type: 'Apollo247',
      distance: '0.8 కిలోమీటర్ల దూరం',
      address: 'మెయిన్ కమర్షియల్ రోడ్డు, డయాగ్నస్టిక్ బ్లాక్',
      phone: '080-23456783',
      timing: '24 గంటలు తెరిచి ఉంటుంది • ఉచిత డోర్ డెలివరీ',
      badge: '24 గంటలు స్పెషలిస్ట్ డాక్టర్లు అందుబాటులో ఉంటారు',
      badgeColor: 'bg-brand-500/20 text-brand-300 border-brand-500/30',
      availableMeds: ['ఆగ్మెంటిన్ 625', 'డోలో 650', 'దగ్గు సిరప్', 'ఆక్సిజన్ మీటర్', 'ఆవిరి యంత్రం']
    },
    {
      id: 'fac_06',
      name: 'కిమ్స్ మల్టీ స్పెషాలిటీ ఆసుపత్రి',
      type: 'Apollo247',
      distance: '3.1 కిలోమీటర్ల దూరం',
      address: 'రింగ్ రోడ్డు జంక్షన్, హెల్త్ సిటీ',
      phone: '080-23456785',
      timing: '24 గంటలు అత్యవసర విభాగం & ఐసీయూ',
      badge: 'అత్యవసర గుండె మరియు ఊపిరితిత్తుల చికిత్స',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      availableMeds: ['ఊపిరితిత్తుల స్పెషలిస్ట్', 'ఎముకల శస్త్రచికిత్స', 'అత్యవసర వెంటిలేటర్', 'అధునాతన రేడియాలజీ']
    },
    {
      id: 'fac_07',
      name: 'యశోద సూపర్ స్పెషాలిటీ ఆసుపత్రి',
      type: 'Apollo247',
      distance: '2.1 కిలోమీటర్ల దూరం',
      address: 'రాజ్ భవన్ రోడ్డు, సోమాజిగూడ',
      phone: '040-45674567',
      timing: '24 గంటలు అత్యవసర ట్రామా & క్రిటికల్ కేర్',
      badge: 'అధునాతన పల్మనాలజీ మరియు ఎమర్జెన్సీ',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      availableMeds: ['అత్యవసర ఐసీయూ', 'ఊపిరితిత్తుల విభాగం', 'సీటీ మరియు ఎంఆర్ఐ', '24 గంటల ఫార్మసీ']
    },
    {
      id: 'fac_08',
      name: 'కేర్ మల్టీ స్పెషాలిటీ ఆసుపత్రి',
      type: 'Apollo247',
      distance: '2.8 కిలోమీటర్ల దూరం',
      address: 'రోడ్ నంబర్ 1, బంజారా హిల్స్',
      phone: '040-61656565',
      timing: '24 గంటలు మల్టీ స్పెషాలిటీ అత్యవసర చికిత్స',
      badge: 'గుండె మరియు ఊపిరితిత్తుల అత్యవసర కేంద్రం',
      badgeColor: 'bg-brand-500/20 text-brand-300 border-brand-500/30',
      availableMeds: ['ఎమర్జెన్సీ బెడ్లు', 'వెంటిలేటర్ సదుపాయం', 'ఇన్‌పేషెంట్ ఫార్మసీ', 'నిపుణులైన వైద్యులు']
    },
    {
      id: 'fac_09',
      name: 'ఏఐజీ మల్టీ స్పెషాలిటీ హాస్పిటల్స్',
      type: 'Apollo247',
      distance: '4.5 కిలోమీటర్ల దూరం',
      address: 'మైండ్‌స్పేస్ రోడ్డు, గచ్చిబౌలి',
      phone: '040-42444222',
      timing: '24 గంటలు సమగ్ర అత్యవసర విభాగం',
      badge: 'అధునాతన సూపర్ స్పెషాలిటీ కేర్',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      availableMeds: ['అధునాతన ఐసీయూ', 'అల్ట్రాసౌండ్ & సీటీ', 'యాంటీబయాటిక్ ఇంజెక్షన్లు', '24 గంటల మందుల షాప్']
    },
    {
      id: 'fac_10',
      name: 'రెయిన్‌బో చిల్డ్రన్స్ & ఫ్యామిలీ ఆసుపత్రి',
      type: 'Apollo247',
      distance: '1.9 కిలోమీటర్ల దూరం',
      address: 'రోడ్ నంబర్ 2, బంజారా హిల్స్',
      phone: '040-44665555',
      timing: '24 గంటలు పిల్లలు & కుటుంబ అత్యవసర విభాగం',
      badge: 'ఫ్యామిలీ మెడిసిన్ మరియు ఎమర్జెన్సీ కేర్',
      badgeColor: 'bg-brand-500/20 text-brand-300 border-brand-500/30',
      availableMeds: ['పిల్లల యాంటీబయాటిక్స్', 'నెబులైజర్లు', 'పీడియాట్రిక్ ఐసీయూ', 'జనరల్ క్లినిక్']
    },
    {
      id: 'fac_11',
      name: 'ప్రధానమంత్రి భారతీయ జన్ ఔషధి కేంద్రం',
      type: 'JanAushadhi',
      distance: '1.8 కిలోమీటర్ల దూరం',
      address: 'షాప్ నంబర్ 4, గాంధీ చౌక్, మెయిన్ బజార్',
      phone: '080-23456782',
      timing: 'ఉదయం 8:00 నుండి రాత్రి 10:00 వరకు',
      badge: '50% నుండి 80% తక్కువ ధరకే నాణ్యమైన జనరిక్ మందులు',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      availableMeds: ['ఆగ్మెంటిన్ 625 (₹72 రూపాయలు)', 'పారాసిటమాల్ (₹14 రూపాయలు)', 'దగ్గు మందు సిరప్']
    },
    {
      id: 'fac_12',
      name: 'మెడ్‌ప్లస్ 24 గంటల మెడికల్ షాప్ & ల్యాబ్',
      type: 'Apollo247',
      distance: '0.6 కిలోమీటర్ల దూరం',
      address: 'షాప్ 12, మెయిన్ బజార్, హెల్త్ లేన్',
      phone: '040-67006700',
      timing: '24 గంటలు తెరిచి ఉంటుంది • హోమ్ డెలివరీ',
      badge: 'ధృవీకరించబడిన మందులు & వేగవంతమైన డెలివరీ',
      badgeColor: 'bg-brand-500/20 text-brand-300 border-brand-500/30',
      availableMeds: ['ఆగ్మెంటిన్ 625', 'డోలో 650', 'ఆవిరి మిషన్', 'పల్స్ ఆక్సిమీటర్', 'ఓఆర్ఎస్ డ్రింక్స్']
    }
  ],

  kn: [
    {
      id: 'fac_01',
      name: 'ಸರ್ಕಾರಿ ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ (ಪಿಎಚ್‌ಸಿ)',
      type: 'PHC',
      distance: '1.2 ಕಿಲೋಮೀಟರ್ ದೂರ',
      address: 'ಹಳೆಯ ಬಸ್ ನಿಲ್ದಾಣದ ಹತ್ತಿರ, ಆರೋಗ್ಯ ವಿಭಾಗ',
      phone: '080-23456781',
      timing: '24 ಗಂಟೆ ತೆರೆದಿರುತ್ತದೆ (ತುರ್ತು ಚಿಕಿತ್ಸೆ)',
      badge: '100% ಉಚಿತ ತಪಾಸಣೆ ಮತ್ತು ಔಷಧಿಗಳು',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      availableMeds: ['ಅಮೋಕ್ಸಿಸಿಲಿನ್ ಮಾತ್ರೆಗಳು', 'ಪ್ಯಾರಾಸಿಟಮಾಲ್ 650', 'ಒಆರ್‌ಎಸ್ ಪೌಡರ್', 'ನೆಬುಲೈಸರ್']
    },
    {
      id: 'fac_02',
      name: 'ಗಾಂಧಿ ಸರ್ಕಾರಿ ಜನರಲ್ ಆಸ್ಪತ್ರೆ & ಟ್ರಾಮಾ ಸೆಂಟರ್',
      type: 'PHC',
      distance: '2.4 ಕಿಲೋಮೀಟರ್ ದೂರ',
      address: 'ಆಸ್ಪತ್ರೆ ರಸ್ತೆ, ಸೆಕ್ಟರ್ 5',
      phone: '080-23456780',
      timing: '24 ಗಂಟೆಗಳ ತುರ್ತು ನಿಗಾ ಘಟಕ',
      badge: 'ಸರ್ಕಾರಿ ಬಹು-ವಿಶೇಷ ಆಸ್ಪತ್ರೆ',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      availableMeds: ['ಐಸಿಯು ಬೆಡ್‌ಗಳು', 'ಆಕ್ಸಿಜನ್ ಸೌಲಭ್ಯ', 'ಡಿಜಿಟಲ್ ಎಕ್ಸ್-ರೇ', 'ಉಚಿತ ಔಷಧಿಗಳು']
    },
    {
      id: 'fac_03',
      name: 'ಉಸ್ಮಾನಿಯಾ ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆ',
      type: 'PHC',
      distance: '3.8 ಕಿಲೋಮೀಟರ್ ದೂರ',
      address: 'ಅಫ್ಜಲ್ ಗಂಜ್ ಮುಖ್ಯ ರಸ್ತೆ',
      phone: '040-24600121',
      timing: '24 ಗಂಟೆಗಳ ಉಚಿತ ಸರ್ಕಾರಿ ತುರ್ತು ಚಿಕಿತ್ಸೆ',
      badge: 'ಉಚಿತ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ ಮತ್ತು ಒಳರೋಗಿ ಬೆಡ್‌ಗಳು',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      availableMeds: ['ಟ್ರಾಮಾ ಐಸಿಯು', 'ಶ್ವಾಸಕೋಶ ವಾರ್ಡ್', 'ಬ್ಲಡ್ ಬ್ಯಾಂಕ್', 'ಉಚಿತ ಜೆನೆರಿಕ್ ಔಷಧಿ']
    },
    {
      id: 'fac_04',
      name: 'ಏಮ್ಸ್ ಸೂಪರ್ ಸ್ಪೆಷಾಲಿಟಿ ಆಸ್ಪತ್ರೆ (AIIMS)',
      type: 'PHC',
      distance: '5.2 ಕಿಲೋಮೀಟರ್ ದೂರ',
      address: 'ರಾಷ್ಟ್ರೀಯ ಹೆದ್ದಾರಿ ಕ್ಯಾಂಪಸ್',
      phone: '040-23458900',
      timing: '24 ಗಂಟೆ ಅತ್ಯಾಧುನಿಕ ತುರ್ತು ಸೇವೆ',
      badge: 'ಕೇಂದ್ರ ಸರ್ಕಾರದ ಪ್ರಮುಖ ವೈದ್ಯಕೀಯ ಸಂಸ್ಥೆ',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      availableMeds: ['ರೇಡಿಯಾಲಜಿ', 'ಕ್ರಿಟಿಕಲ್ ಕೇರ್ ಐಸಿಯು', 'ಉಸಿರಾಟ ವಿಭಾಗ', 'ಉಚಿತ ಔಷಧಿಗಳು']
    },
    {
      id: 'fac_05',
      name: 'ಅಪೋಲೋ 24 ಗಂಟೆಗಳ ಆಸ್ಪತ್ರೆ & ಔಷಧಾಲಯ',
      type: 'Apollo247',
      distance: '0.8 ಕಿಲೋಮೀಟರ್ ದೂರ',
      address: 'ಮುಖ್ಯ ರಸ್ತೆ, ಆಸ್ಪತ್ರೆ ಗೇಟ್ ಎದುರು',
      phone: '080-23456783',
      timing: '24 ಗಂಟೆ ತೆರೆದಿರುತ್ತದೆ • ಉಚಿತ ಮನೆ ಬಾಗಿಲಿಗೆ',
      badge: '24 ಗಂಟೆ ವೈದ್ಯಕೀಯ ಸಿಬ್ಬಂದಿ ಲಭ್ಯ',
      badgeColor: 'bg-brand-500/20 text-brand-300 border-brand-500/30',
      availableMeds: ['ಆಗ್ಮೆಂಟಿನ್ 625', 'ಡೋಲೋ 650', 'ಕೆಮ್ಮಿನ ಸಿರಪ್', 'ಪಲ್ಸ್ ಆಕ್ಸಿಮೀಟರ್', 'ಸ್ಟೀಮ್ ಯಂತ್ರ']
    },
    {
      id: 'fac_06',
      name: 'ಕಿಮ್ಸ್ ಸೂಪರ್ ಸ್ಪೆಷಾಲಿಟಿ ಆಸ್ಪತ್ರೆ',
      type: 'Apollo247',
      distance: '3.1 ಕಿಲೋಮೀಟರ್ ದೂರ',
      address: 'ರಿಂಗ್ ರಸ್ತೆ, ಹೆಲ್ತ್ ಸಿಟಿ',
      phone: '080-23456785',
      timing: '24 ಗಂಟೆ ತುರ್ತು ಸೇವೆ',
      badge: 'ಹೃದಯ ಮತ್ತು ಶ್ವಾಸಕೋಶದ ತುರ್ತು ಚಿಕಿತ್ಸೆ',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      availableMeds: ['ಶ್ವಾಸಕೋಶ ತಜ್ಞರು', 'ಮೂಳೆ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ', 'ಐಸಿಯು ಬೆಡ್‌ಗಳು', 'ಎಕ್ಸ್-ರೇ ಸ್ಕ್ಯಾನಿಂಗ್']
    },
    {
      id: 'fac_07',
      name: 'ಯಶೋದಾ ಸೂಪರ್ ಸ್ಪೆಷಾಲಿಟಿ ಆಸ್ಪತ್ರೆ',
      type: 'Apollo247',
      distance: '2.1 ಕಿಲೋಮೀಟರ್ ದೂರ',
      address: 'ರಾಜ್ ಭವನ ರಸ್ತೆ, ಸೋಮಾಜಿಗುಡ',
      phone: '040-45674567',
      timing: '24 ಗಂಟೆ ತುರ್ತು ಟ್ರಾಮಾ & ಕ್ರಿಟಿಕಲ್ ಕೇರ್',
      badge: 'ಅತ್ಯಾಧುನಿಕ ಶ್ವಾಸಕೋಶ ವಿಭಾಗ',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      availableMeds: ['ತುರ್ತು ಐಸಿಯು', 'ಶ್ವಾಸಕೋಶ ತಪಾಸಣೆ', 'ಸಿಟಿ ಸ್ಕ್ಯಾನ್', '24 ಗಂಟೆ ಫಾರ್ಮಸಿ']
    },
    {
      id: 'fac_08',
      name: 'ಕೇರ್ ಆಸ್ಪತ್ರೆ & ಕಾರ್ಡಿಯೋ ಸೆಂಟರ್',
      type: 'Apollo247',
      distance: '2.8 ಕಿಲೋಮೀಟರ್ ದೂರ',
      address: 'ರಸ್ತೆ ನಂ 1, ಬಂಜಾರಾ ಹಿಲ್ಸ್',
      phone: '040-61656565',
      timing: '24 ಗಂಟೆಗಳ ತುರ್ತು ಚಿಕಿತ್ಸೆ',
      badge: 'ಹೃದಯ ಮತ್ತು ಶ್ವಾಸಕೋಶದ ತುರ್ತು ಕೇಂದ್ರ',
      badgeColor: 'bg-brand-500/20 text-brand-300 border-brand-500/30',
      availableMeds: ['ಎಮರ್ಜೆನ್ಸಿ ಬೆಡ್‌ಗಳು', 'ವೆಂಟಿಲೇಟರ್', 'ಔಷಧಿ ಅಂಗಡಿ', 'ತಜ್ಞ ವೈದ್ಯರು']
    },
    {
      id: 'fac_09',
      name: 'ಎಐಜಿ ಮಲ್ಟಿ ಸ್ಪೆಷಾಲಿಟಿ ಆಸ್ಪತ್ರೆ',
      type: 'Apollo247',
      distance: '4.5 ಕಿಲೋಮೀಟರ್ ದೂರ',
      address: 'ಮೈಂಡ್‌ಸ್ಪೇಸ್ ರಸ್ತೆ, ಗಚಿಬೌಲಿ',
      phone: '040-42444222',
      timing: '24 ಗಂಟೆ ಸಮಗ್ರ ತುರ್ತು ಸೇವೆ',
      badge: 'ಸೂಪರ್ ಸ್ಪೆಷಾಲಿಟಿ ತುರ್ತು ಚಿಕಿತ್ಸೆ',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      availableMeds: ['ಅಡ್ವಾನ್ಸ್ಡ್ ಐಸಿಯು', 'ಅಲ್ಟ್ರಾಸೌಂಡ್', 'ಆಂಟಿಬಯೋಟಿಕ್ ಚಿಕಿತ್ಸೆ', '24 ಗಂಟೆ ಫಾರ್ಮಸಿ']
    },
    {
      id: 'fac_10',
      name: 'ರೇನ್‌ಬೋ ಮಕ್ಕಳ ಮತ್ತು ಕುಟುಂಬ ಆಸ್ಪತ್ರೆ',
      type: 'Apollo247',
      distance: '1.9 ಕಿಲೋಮೀಟರ್ ದೂರ',
      address: 'ರಸ್ತೆ ನಂ 2, ಬಂಜಾರಾ ಹಿಲ್ಸ್',
      phone: '040-44665555',
      timing: '24 ಗಂಟೆ ಮಕ್ಕಳ ತುರ್ತು ಚಿಕಿತ್ಸೆ',
      badge: 'ಕುಟುಂಬ ಆರೋಗ್ಯ ಮತ್ತು ತುರ್ತು ಸೇವೆ',
      badgeColor: 'bg-brand-500/20 text-brand-300 border-brand-500/30',
      availableMeds: ['ಮಕ್ಕಳ ಆಂಟಿಬಯೋಟಿಕ್ಸ್', 'ನೆಬುಲೈಜರ್', 'ಪೀಡಿಯಾಟ್ರಿಕ್ ಐಸಿಯು', 'ಕ್ಲಿನಿಕ್']
    },
    {
      id: 'fac_11',
      name: 'ಪ್ರಧಾನಮಂತ್ರಿ ಜನ ಔಷಧಿ ಕೇಂದ್ರ',
      type: 'JanAushadhi',
      distance: '1.8 ಕಿಲೋಮೀಟರ್ ದೂರ',
      address: 'ಅಂಗಡಿ ಸಂಖ್ಯೆ 4, ಗಾಂಧಿ ವೃತ್ತ, ಮಾರುಕಟ್ಟೆ ರಸ್ತೆ',
      phone: '080-23456782',
      timing: 'ಬೆಳಿಗ್ಗೆ 8:00 ರಿಂದ ರಾತ್ರಿ 10:00 ರವರೆಗೆ',
      badge: 'ಕಡಿಮೆ ಬೆಲೆಯ ಜೆನೆರಿಕ್ ಔಷಧಿಗಳು (80% ರಿಯಾಯಿತಿ)',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      availableMeds: ['ಆಗ್ಮೆಂಟಿನ್ 625 (₹72)', 'ಪ್ಯಾರಾಸಿಟಮಾಲ್ (₹14)', 'ಕೆಮ್ಮಿನ ಸಿರಪ್']
    },
    {
      id: 'fac_12',
      name: 'ಮೆಡ್‌ಪ್ಲಸ್ 24 ಗಂಟೆಗಳ ಔಷಧಾಲಯ & ಡಯಾಗ್ನಸ್ಟಿಕ್ಸ್',
      type: 'Apollo247',
      distance: '0.6 ಕಿಲೋಮೀಟರ್ ದೂರ',
      address: 'ಅಂಗಡಿ 12, ಮುಖ್ಯ ಮಾರುಕಟ್ಟೆ ರಸ್ತೆ',
      phone: '040-67006700',
      timing: '24 ಗಂಟೆ ತೆರೆದಿರುತ್ತದೆ • ಉಚಿತ ಹೋಮ್ ಡೆಲಿವರಿ',
      badge: 'ಅಧಿಕೃತ ಔಷಧಿಗಳು & ತಕ್ಷಣದ ವಿತರಣೆ',
      badgeColor: 'bg-brand-500/20 text-brand-300 border-brand-500/30',
      availableMeds: ['ಆಗ್ಮೆಂಟಿನ್ 625', 'ಡೋಲೋ 650', 'ಸ್ಟೀಮ್ ಮೆಷಿನ್', 'ಪಲ್ಸ್ ಆಕ್ಸಿಮೀಟರ್', 'ಒಆರ್‌ಎಸ್']
    }
  ],

  hi: [
    {
      id: 'fac_01',
      name: 'सरकारी प्राथमिक स्वास्थ्य केंद्र (PHC)',
      type: 'PHC',
      distance: '1.2 किलोमीटर दूर',
      address: 'पुराने बस स्टैंड के पास, स्वास्थ्य विभाग मार्ग',
      phone: '080-23456781',
      timing: '24 घंटे खुला रहता है (आपातकालीन वार्ड)',
      badge: '100% मुफ्त डॉक्टर परामर्श एवं दवाएं',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      availableMeds: ['एमोक्सिसिलिन', 'पैरासिटामोल 650', 'ओआरएस पैकेट', 'नेबुलाइजर भाप']
    },
    {
      id: 'fac_02',
      name: 'गांधी सरकारी जनरल अस्पताल एवं ट्रॉमा सेंटर',
      type: 'PHC',
      distance: '2.4 किलोमीटर दूर',
      address: 'हॉस्पिटल रोड, सेक्टर 5, सेंट्रल जोन',
      phone: '080-23456780',
      timing: '24 घंटे आपातकालीन ट्रॉमा एवं आईसीयू',
      badge: 'बड़ा सरकारी मल्टी-स्पेशलिटी अस्पताल',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      availableMeds: ['आपातकालीन आईसीयू', 'ऑक्सीजन बेड', 'डिजिटल एक्सरे एवं सीटी स्कैन', 'मुफ्त दवाइयां']
    },
    {
      id: 'fac_03',
      name: 'उस्मानिया सरकारी जनरल अस्पताल',
      type: 'PHC',
      distance: '3.8 किलोमीटर दूर',
      address: 'अफजल गंज, हाई कोर्ट मार्ग',
      phone: '040-24600121',
      timing: '24 घंटे मुफ्त सरकारी आपातकालीन सेवाएं',
      badge: 'मुफ्त बेड एवं सर्जरी सुविधा',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      availableMeds: ['ट्रॉमा आईसीयू', 'फेफड़ा वार्ड', 'इमरजेंसी ब्लड बैंक', 'मुफ्त जेनेरिक दवाएं']
    },
    {
      id: 'fac_04',
      name: 'एम्स सुपर स्पेशलिटी अस्पताल (AIIMS)',
      type: 'PHC',
      distance: '5.2 किलोमीटर दूर',
      address: 'नेशनल हाईवे मेडिकल कैंपस',
      phone: '040-23458900',
      timing: '24 घंटे अत्याधुनिक आपातकालीन सेवा',
      badge: 'केंद्र सरकार का शीर्ष मेडिकल संस्थान',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      availableMeds: ['डिजिटल रेडियोलॉजी', 'क्रिटिकल केयर आईसीयू', 'श्वसन रोग विभाग', 'मुफ्त दवा काउंटर']
    },
    {
      id: 'fac_05',
      name: 'अपोलो मल्टी-स्पेशलिटी अस्पताल एवं 24 घंटे फार्मेसी',
      type: 'Apollo247',
      distance: '0.8 किलोमीटर दूर',
      address: 'मुख्य मार्ग, अस्पताल के सामने',
      phone: '080-23456783',
      timing: '24 घंटे खुला • फ्री होम डिलीवरी',
      badge: '24 घंटे विशेषज्ञ डॉक्टर एवं फार्मासिस्ट सेवा',
      badgeColor: 'bg-brand-500/20 text-brand-300 border-brand-500/30',
      availableMeds: ['ऑगमेंटिन 625', 'डोलो 650', 'खांसी सिरप', 'पल्स ऑक्सीमीटर', 'भाप की मशीन']
    },
    {
      id: 'fac_06',
      name: 'केआईएमएस सुपर स्पेशलिटी अस्पताल',
      type: 'Apollo247',
      distance: '3.1 किलोमीटर दूर',
      address: 'रिंग रोड जंक्शन, हेल्थ सिटी',
      phone: '080-23456785',
      timing: '24 घंटे आपातकालीन सेवा',
      badge: 'हृदय एवं फेफड़े का आपातकालीन केंद्र',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      availableMeds: ['छाती रोग विशेषज्ञ', 'हड्डी रोग विभाग', 'आईसीयू वेंटिलेटर', 'डिजिटल रेडियोलॉजी']
    },
    {
      id: 'fac_07',
      name: 'यशोदा सुपर स्पेशलिटी अस्पताल',
      type: 'Apollo247',
      distance: '2.1 किलोमीटर दूर',
      address: 'राज भवन रोड, सोमाजीगुड़ा',
      phone: '040-45674567',
      timing: '24 घंटे इमरजेंसी ट्रॉमा एवं क्रिटिकल केयर',
      badge: 'उन्नत फेफड़ा एवं आपातकालीन विभाग',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      availableMeds: ['इमरजेंसी आईसीयू', 'पल्मोनोलॉजी वार्ड', 'सीटी और एमआरआई', '24 घंटे फार्मेसी']
    },
    {
      id: 'fac_08',
      name: 'केयर मल्टी-स्पेशलिटी अस्पताल',
      type: 'Apollo247',
      distance: '2.8 किलोमीटर दूर',
      address: 'रोड नंबर 1, बंजारा हिल्स',
      phone: '040-61656565',
      timing: '24 घंटे आपातकालीन ट्रॉमा केयर',
      badge: 'हृदय और श्वसन आपातकालीन केंद्र',
      badgeColor: 'bg-brand-500/20 text-brand-300 border-brand-500/30',
      availableMeds: ['इमरजेंसी बेड', 'वेंटिलेटर सपोर्ट', 'अस्पताल फार्मेसी', 'विशेषज्ञ डॉक्टर']
    },
    {
      id: 'fac_09',
      name: 'एआईजी मल्टी स्पेशलिटी अस्पताल',
      type: 'Apollo247',
      distance: '4.5 किलोमीटर दूर',
      address: 'माइंडस्पेस रोड, गाचीबोवली',
      phone: '040-42444222',
      timing: '24 घंटे सुपर स्पेशलिटी आपातकालीन वार्ड',
      badge: 'अत्याधुनिक मल्टी-ऑर्गन केयर',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      availableMeds: ['एडवांस्ड आईसीयू', 'अल्ट्रासाउंड एवं सीटी', 'एंटीबायोटिक ड्रिप', '24 घंटे मेडिकल']
    },
    {
      id: 'fac_10',
      name: 'रेनबो चिल्ड्रन्स एवं फैमिली अस्पताल',
      type: 'Apollo247',
      distance: '1.9 किलोमीटर दूर',
      address: 'रोड नंबर 2, बंजारा हिल्स',
      phone: '040-44665555',
      timing: '24 घंटे बाल एवं पारिवारिक आपातकालीन सेवा',
      badge: 'पारिवारिक स्वास्थ्य एवं आपातकालीन सेवा',
      badgeColor: 'bg-brand-500/20 text-brand-300 border-brand-500/30',
      availableMeds: ['बच्चों की एंटीबायोटिक', 'नेबुलाइजर', 'पीडियाट्रिक आईसीयू', 'जनरल ओपीडी']
    },
    {
      id: 'fac_11',
      name: 'प्रधानमंत्री जन औषधि केंद्र',
      type: 'JanAushadhi',
      distance: '1.8 किलोमीटर दूर',
      address: 'दुकान नंबर 4, गांधी चौक, बाजार मार्ग',
      phone: '080-23456782',
      timing: 'सुबह 8:00 से रात 10:00 बजे तक',
      badge: '50% से 80% सस्ती जेनेरिक दवाएं',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      availableMeds: ['एमोक्सिसिलिन+क्लैव 625 (₹72)', 'पैरासिटामोल 650 (₹14)', 'खांसी का सिरप']
    },
    {
      id: 'fac_12',
      name: 'मेडप्लस 24 घंटे फार्मेसी एवं लैब',
      type: 'Apollo247',
      distance: '0.6 किलोमीटर दूर',
      address: 'दुकान 12, मुख्य बाजार मार्ग',
      phone: '040-67006700',
      timing: '24 घंटे खुला • फ्री होम डिलीवरी',
      badge: 'प्रमाणित दवाएं एवं त्वरित होम डिलीवरी',
      badgeColor: 'bg-brand-500/20 text-brand-300 border-brand-500/30',
      availableMeds: ['ऑगमेंटिन 625', 'डोलो 650', 'भाप की मशीन', 'पल्स ऑक्सीमीटर', 'ओआरएस']
    }
  ],

  ta: [
    {
      id: 'fac_01',
      name: 'அரசு ஆரம்ப சுகாதார நிலையம் (PHC)',
      type: 'PHC',
      distance: '1.2 கி.மீ தொலைவில்',
      address: 'பழைய பேருந்து நிலையம் அருகில்',
      phone: '080-23456781',
      timing: '24 மணி நேரமும் திறந்திருக்கும் (அவசர பிரிவு)',
      badge: '100% இலவச பரிசோதனை மற்றும் மருந்துகள்',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      availableMeds: ['அமாக்சிசிலின்', 'பாராசிட்டமால் 650', 'ஓஆர்எஸ் கரைசல்', 'நெபுலைசர்']
    },
    {
      id: 'fac_02',
      name: 'காந்தி அரசு தலைமை பொது மருத்துவமனை & அவசர மையம்',
      type: 'PHC',
      distance: '2.4 கி.மீ தொலைவில்',
      address: 'மருத்துவமனை சாலை, மத்திய மண்டலம்',
      phone: '080-23456780',
      timing: '24 மணி நேர தீவிர சிகிச்சை & அவசர பிரிவு',
      badge: 'அரசு பல்நோக்கு சிறப்பு மருத்துவமனை',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      availableMeds: ['அவசர தீவிர சிகிச்சை', 'ஆக்சிஜன் படுக்கைகள்', 'டிஜிட்டல் எக்ஸ்ரே & சிடி ஸ்கேன்', 'இலவச மருந்துகள்']
    },
    {
      id: 'fac_03',
      name: 'உஸ்மானியா அரசு பொது மருத்துவமனை',
      type: 'PHC',
      distance: '3.8 கி.மீ தொலைவில்',
      address: 'அப்சல் கஞ்ச் பிரதான சாலை',
      phone: '040-24600121',
      timing: '24 மணி நேர இலவச அரசு அவசர சிகிச்சை',
      badge: 'இலவச படுக்கைகள் & அறுவை சிகிச்சை',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      availableMeds: ['ட்ராமா ஐசியூ', 'நுரையீரல் வார்டு', 'இரத்த வங்கி', 'இலவச ஜெனரிக் மருந்துகள்']
    },
    {
      id: 'fac_04',
      name: 'எய்ம்ஸ் சிறப்பு மருத்துவமனை (AIIMS)',
      type: 'PHC',
      distance: '5.2 கி.மீ தொலைவில்',
      address: 'தேசிய நெடுஞ்சாலை மருத்துவ வளாகம்',
      phone: '040-23458900',
      timing: '24 மணி நேர அதிநவீன அவசர சிகிச்சை',
      badge: 'மத்திய அரசின் முதன்மை மருத்துவ நிறுவனம்',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      availableMeds: ['டிஜிட்டல் ரேடியாலஜி', 'தீவிர சிகிச்சை ஐசியூ', 'சுவாச சிகிச்சை பிரிவு', 'இலவச மருந்தகம்']
    },
    {
      id: 'fac_05',
      name: 'அப்பல்லோ சிறப்பு மருத்துவமனை & 24 மணி நேர மருந்தகம்',
      type: 'Apollo247',
      distance: '0.8 கி.மீ தொலைவில்',
      address: 'மெயின் ரோடு, மருத்துவமனை எதிரில்',
      phone: '080-23456783',
      timing: '24 மணி நேரமும் திறந்திருக்கும் • டோர் டெலிவரி',
      badge: '24 மணி நேரமும் மருத்துவர் & மருந்தாளர் சேவை',
      badgeColor: 'bg-brand-500/20 text-brand-300 border-brand-500/30',
      availableMeds: ['ஆக்மெண்டின் 625', 'டோலோ 650', 'இருமல் சிரப்', 'பல்ஸ் ஆக்சிமீட்டர்', 'நீராவி பிடிக்கும் கருவி']
    },
    {
      id: 'fac_06',
      name: 'கிம்ஸ் பல்நோக்கு சிறப்பு மருத்துவமனை',
      type: 'Apollo247',
      distance: '3.1 கி.மீ தொலைவில்',
      address: 'ரிங் ரோடு சந்திப்பு, ஹெல்த் சிட்டி',
      phone: '080-23456785',
      timing: '24 மணி நேர அவசர சிகிச்சை',
      badge: 'இதயம் மற்றும் நுரையீரல் அவசர சிகிச்சை மையம்',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      availableMeds: ['நுரையீரல் சிறப்பு மருத்துவர்', 'எலும்பு முறிவு சிகிச்சை', 'தீவிர சிகிச்சை படுக்கைகள்', 'எக்ஸ்ரே ஸ்கேனிங்']
    },
    {
      id: 'fac_07',
      name: 'யசோதா சூப்பர் ஸ்பெஷாலிட்டி மருத்துவமனை',
      type: 'Apollo247',
      distance: '2.1 கி.மீ தொலைவில்',
      address: 'ராஜ் பவன் சாலை, சோமாஜிகுடா',
      phone: '040-45674567',
      timing: '24 மணி நேர அவசர ட்ராமா & தீவிர சிகிச்சை பிரிவு',
      badge: 'அதிநவீன நுரையீரல் மற்றும் அவசர சிகிச்சை',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      availableMeds: ['அவசர ஐசியூ', 'நுரையீரல் வார்டு', 'சிடி மற்றும் எம்ஆர்ஐ', '24 மணி நேர மருந்தகம்']
    },
    {
      id: 'fac_08',
      name: 'கேர் பல்நோக்கு மருத்துவமனை',
      type: 'Apollo247',
      distance: '2.8 கி.மீ தொலைவில்',
      address: 'சாலை எண் 1, பஞ்சாரா ஹில்ஸ்',
      phone: '040-61656565',
      timing: '24 மணி நேர அவசர சிகிச்சை',
      badge: 'இதய மற்றும் சுவாச அவசர சிகிச்சை மையம்',
      badgeColor: 'bg-brand-500/20 text-brand-300 border-brand-500/30',
      availableMeds: ['அவசர படுக்கைகள்', 'வென்டிலேட்டர் வசதி', 'மருந்தகம்', 'நிபுணர் மருத்துவர்கள்']
    },
    {
      id: 'fac_09',
      name: 'ஏஐஜி சிறப்பு மருத்துவமனை',
      type: 'Apollo247',
      distance: '4.5 கி.மீ தொலைவில்',
      address: 'மைண்ட்பேஸ் சாலை, கச்சிபௌலி',
      phone: '040-42444222',
      timing: '24 மணி நேர முழுமையான அவசர சிகிச்சை',
      badge: 'அதிநவீன சூப்பர் ஸ்பெஷாலிட்டி சிகிச்சை',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      availableMeds: ['அட்வான்ஸ்டு ஐசியூ', 'அல்ட்ராசவுண்ட் & சிடி', 'ஆன்டிபயாடிக் ஊசிகள்', 'மருந்து கடை']
    },
    {
      id: 'fac_10',
      name: 'ரெயின்போ குழந்தைகள் மற்றும் குடும்ப மருத்துவமனை',
      type: 'Apollo247',
      distance: '1.9 கி.மீ தொலைவில்',
      address: 'சாலை எண் 2, பஞ்சாரா ஹில்ஸ்',
      phone: '040-44665555',
      timing: '24 மணி நேர குழந்தைகள் அவசர சிகிச்சை',
      badge: 'குடும்ப நலம் மற்றும் அவசர சிகிச்சை',
      badgeColor: 'bg-brand-500/20 text-brand-300 border-brand-500/30',
      availableMeds: ['குழந்தைகளுக்கான மருந்துகள்', 'நெபுலைசர்', 'பீடியாட்ரிக் ஐசியூ', 'பொது கிளினிக்']
    },
    {
      id: 'fac_11',
      name: 'பிரதமர் மக்கள் மருந்தகம் (ஜன் ஔஷதி)',
      type: 'JanAushadhi',
      distance: '1.8 கி.மீ தொலைவில்',
      address: 'கடை எண் 4, காந்தி சதுக்கம், மெயின் ரோடு',
      phone: '080-23456782',
      timing: 'காலை 8:00 முதல் இரவு 10:00 வரை',
      badge: 'மலிவு விலை தரமான ஜெனரிக் மருந்துகள் (80% தள்ளுபடி)',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      availableMeds: ['ஆக்மெண்டின் 625 (₹72)', 'பாராசிட்டமால் (₹14)', 'இருமல் மருந்து']
    },
    {
      id: 'fac_12',
      name: 'மெட்பிளஸ் 24 மணி நேர மருந்தகம் & ஆய்வகம்',
      type: 'Apollo247',
      distance: '0.6 கி.மீ தொலைவில்',
      address: 'கடை 12, மெயின் பஜார், சுகாதார சாலை',
      phone: '040-67006700',
      timing: '24 மணி நேரமும் திறந்திருக்கும் • இலவச டோர் டெலிவரி',
      badge: 'சான்றளிக்கப்பட்ட மருந்துகள் & உடனடி டெலிவரி',
      badgeColor: 'bg-brand-500/20 text-brand-300 border-brand-500/30',
      availableMeds: ['ஆக்மெண்டின் 625', 'டோலோ 650', 'நீராவி பிடிக்கும் கருவி', 'பல்ஸ் ஆக்சிமீட்டர்', 'ஓஆர்எஸ்']
    }
  ]
};

// Symptom voice query options
export const SYMPTOM_QUERIES: Record<SupportedLanguage, SymptomQuery[]> = {
  en: [
    {
      id: 'sym_1',
      label: 'High fever and productive cough for 3 days',
      conditionKey: 'pneumonia',
      response: 'Based on high fever and productive cough, there is a strong possibility of lower respiratory infection or pneumonia. Avoid cold water, take prescribed antipyretics like Paracetamol, and consult a physician for antibiotic evaluation.',
      voiceNarration: 'High fever and deep cough indicate a possible lung infection. Stay well hydrated, rest in an elevated position, and see a doctor for targeted antibiotic treatment.'
    },
    {
      id: 'sym_2',
      label: 'Sharp right-side chest pain when breathing deeply',
      conditionKey: 'pneumonia',
      response: 'Sharp chest pain worsening on deep inspiration is characteristic of pleuritic chest inflammation associated with lung infections. Please get a chest radiograph to rule out pleural effusion.',
      voiceNarration: 'Sharp chest pain during breathing indicates pleurisy or lung inflammation. Avoid heavy lifting and visit a health center for an X-ray.'
    },
    {
      id: 'sym_3',
      label: 'Fell down, severe knee pain and swelling',
      conditionKey: 'fracture',
      response: 'Acute post-traumatic knee pain and swelling should be evaluated with an X-ray to exclude fractures. Follow the R.I.C.E protocol (Rest, Ice pack for 15 minutes, Compression, and Elevation).',
      voiceNarration: 'For sudden knee pain after a fall, apply an ice pack, elevate your leg on a pillow, and avoid putting full weight until an X-ray confirms bones are safe.'
    }
  ],

  te: [
    {
      id: 'sym_1',
      label: '3 రోజులుగా తీవ్రమైన జ్వరం మరియు దగ్గు ఉంది',
      conditionKey: 'pneumonia',
      response: 'తీవ్రమైన జ్వరం మరియు దగ్గు ఊపిరితిత్తుల ఇన్ఫెక్షన్ లేదా న్యుమోనియాకు సంకేతం కావచ్చు. గోరువెచ్చని నీరు తాగండి, పారాసిటమాల్ వేసుకోండి మరియు వెంటనే డాక్టర్ వద్ద ఎక్స్-రే తీయించండి.',
      voiceNarration: 'మూడు రోజులుగా జ్వరం మరియు దగ్గు ఉండటం ఊపిరితిత్తుల్లో ఇన్ఫెక్షన్‌కు కారణం కావచ్చు. గోరువెచ్చని నీరు తాగండి మరియు డాక్టర్‌ను సంప్రదించండి.'
    },
    {
      id: 'sym_2',
      label: 'గాలి పీల్చినప్పుడు ఛాతీలో పక్కటెముకల నొప్పి వస్తోంది',
      conditionKey: 'pneumonia',
      response: 'లోతుగా ఊపిరి పీల్చినప్పుడు ఛాతీలో నొప్పి రావడం న్యుమోనియా లేదా ప్లూరల్ ఎఫ్యూషన్ (నీరు చేరడం) వల్ల కావచ్చు. బరువులు ఎత్తకండి, డాక్టర్‌ను కలవండి.',
      voiceNarration: 'గాలి పీల్చేటప్పుడు ఛాతీ నొప్పి వస్తే ఊపిరితిత్తుల వాపు ఉండవచ్చు. వెంటనే దగ్గరలోని ప్రాథమిక ఆరోగ్య కేంద్రానికి వెళ్ళండి.'
    },
    {
      id: 'sym_3',
      label: 'కిందపడ్డాను, మోకాలు వాచి విపరీతమైన నొప్పి ఉంది',
      conditionKey: 'fracture',
      response: 'మోకాలిపై ఐస్ ప్యాక్ పెట్టండి. కాలు కింద దిండు పెట్టి ఎత్తుగా ఉంచండి. ఎముక విరిగిందో లేదో తెలుసుకోవడానికి వెంటనే ఎక్స్-రే తీయించాలి.',
      voiceNarration: 'మోకాలి నొప్పి కోసం ఐస్ ముక్కలతో కాపడం పెట్టండి, కాలు ఎత్తుగా ఉంచండి మరియు ఎక్స్-రే తీయించండి.'
    }
  ],

  kn: [
    {
      id: 'sym_1',
      label: '3 ದಿನಗಳಿಂದ ವಿಪರೀತ ಜ್ವರ ಮತ್ತು ಕೆಮ್ಮು ಇದೆ',
      conditionKey: 'pneumonia',
      response: 'ತೀವ್ರ ಜ್ವರ ಮತ್ತು ಕೆಮ್ಮು ಶ್ವಾಸಕೋಶದ ಸೋಂಕಿನ ಲಕ್ಷಣವಾಗಿರಬಹುದು. ಬೆಚ್ಚಗಿನ ನೀರು ಕುಡಿಯಿರಿ ಮತ್ತು ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ.',
      voiceNarration: 'ಜ್ವರ ಮತ್ತು ಕೆಮ್ಮು ಶ್ವಾಸಕೋಶದ ಸೋಂಕನ್ನು ಸೂಚಿಸುತ್ತದೆ. ಬೆಚ್ಚಗಿನ ನೀರು ಕುಡಿಯಿರಿ ಮತ್ತು ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.'
    },
    {
      id: 'sym_2',
      label: 'ಉಸಿರಾಡುವಾಗ ಎದೆಯಲ್ಲಿ ಚುಚ್ಚುವ ನೋವು',
      conditionKey: 'pneumonia',
      response: 'ಉಸಿರಾಡುವಾಗ ಎದೆ ನೋವು ಬರುವುದು ನ್ಯುಮೋನಿಯಾದ ಸಂಕೇತ. ತಕ್ಷಣ ಎದೆಯ ಎಕ್ಸ್-ರೇ ಪರೀಕ್ಷೆ ಮಾಡಿಸಿಕೊಳ್ಳಿ.',
      voiceNarration: 'ಎದೆ ನೋವು ಇದ್ದರೆ ಶ್ವಾಸಕೋಶದಲ್ಲಿ ನೀರು ತುಂಬಿರಬಹುದು. ತಕ್ಷಣ ಆಸ್ಪತ್ರೆಗೆ ಭೇಟಿ ನೀಡಿ.'
    },
    {
      id: 'sym_3',
      label: 'ಕಾಲು ಜಾರಿ ಬಿದ್ದೆ, ಮೊಣಕಾಲು ಊದಿಕೊಂಡು ನೋವಿದೆ',
      conditionKey: 'fracture',
      response: 'ಮೊಣಕಾಲಿಗೆ ಐಸ್ ಪ್ಯಾಕ್ ಇಡಿ ಮತ್ತು ವಿಶ್ರಾಂತಿ ನೀಡಿ. ಮೂಳೆ ಮುರಿದಿದೆಯೇ ಎಂದು ತಿಳಿಯಲು ಎಕ್ಸ್-ರೇ ಮಾಡಿಸಿ.',
      voiceNarration: 'ಮೊಣಕಾಲಿಗೆ ಐಸ್ ಹಚ್ಚಿ ಮತ್ತು ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ.'
    }
  ],

  hi: [
    {
      id: 'sym_1',
      label: '3 दिन से तेज बुखार और खांसी आ रही है',
      conditionKey: 'pneumonia',
      response: 'तेज बुखार और खांसी फेफड़ों में इन्फेक्शन या निमोनिया का संकेत हो सकता है। गुनगुना पानी पिएं और डॉक्टर से मिलकर एंटीबायोटिक लें।',
      voiceNarration: 'तेज बुखार और खांसी फेफड़ों में इन्फेक्शन हो सकता है। गुनगुना पानी पिएं और डॉक्टर से सलाह लें।'
    },
    {
      id: 'sym_2',
      label: 'गहरी सांस लेने पर सीने में तेज दर्द होता है',
      conditionKey: 'pneumonia',
      response: 'सांस लेने पर सीने में दर्द होना निमोनिया या फेफड़ों में सूजन का लक्षण है। तुरंत छाती का एक्सरे कराएं।',
      voiceNarration: 'सांस लेते समय सीने में दर्द होने पर तुरंत नजदीकी अस्पताल में डॉक्टर को दिखाएं।'
    },
    {
      id: 'sym_3',
      label: 'फिसलकर गिर गया, घुटने में तेज दर्द और सूजन है',
      conditionKey: 'fracture',
      response: 'घुटने पर बर्फ की सिकाई करें और पैर को तकिए पर ऊंचा रखें। हड्डी की जांच के लिए एक्सरे कराएं।',
      voiceNarration: 'घुटने पर बर्फ लगाएं, पैर ऊंचा रखें और एक्सरे कराएं।'
    }
  ],

  ta: [
    {
      id: 'sym_1',
      label: '3 நாட்களாக கடுமையான காய்ச்சல் மற்றும் இருமல்',
      conditionKey: 'pneumonia',
      response: 'கடுமையான காய்ச்சல் மற்றும் இருமல் நுரையீரல் தொற்றுக்கான அறிகுறி. சுடுதண்ணீர் அருந்தவும், மருத்துவரை அணுகவும்.',
      voiceNarration: 'காய்ச்சல் மற்றும் இருமல் நுரையீரல் தொற்றுக்கு காரணமாக இருக்கலாம். உடனடியாக மருத்துவரை அணுகவும்.'
    },
    {
      id: 'sym_2',
      label: 'மூச்சு விடும்போது நெஞ்சில் கடுமையான வலி',
      conditionKey: 'pneumonia',
      response: 'மூச்சு விடும்போது நெஞ்சு வலி இருப்பது நிமோனியா தொற்றை குறிக்கிறது. எக்ஸ்ரே பரிசோதனை செய்யவும்.',
      voiceNarration: 'நெஞ்சு வலி அதிகமாக இருந்தால் உடனடியாக ஆரம்ப சுகாதார நிலையத்திற்கு செல்லவும்.'
    },
    {
      id: 'sym_3',
      label: 'கீழே விழுந்து முழங்கால் வீக்கம் மற்றும் வலி',
      conditionKey: 'fracture',
      response: 'முழங்காலுக்கு ஐஸ் ஒத்தடம் கொடுக்கவும், ஓய்வெடுக்கவும். எக்ஸ்ரே எடுத்து பார்க்கவும்.',
      voiceNarration: 'ஐஸ் ஒத்தடம் கொடுத்து ஓய்வெடுக்கவும்.'
    }
  ]
};
