import { User, MedicalScan, Appointment, AuditLog, HospitalFacility } from '../types';

export const MOCK_USERS: Record<string, User> = {
  radiologist: {
    id: 'usr_rad_01',
    name: 'Dr. Elena Vance, MD, FACR',
    role: 'radiologist',
    email: 'elena.vance@aurarad.health',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250',
    title: 'Chief Diagnostic Radiologist',
    department: 'Department of Thoracic & Trauma Imaging',
    hospital: 'Metro General Medical Center',
    credentials: 'Board Certified ABR, Harvard Medical Fellow'
  },
  doctor: {
    id: 'usr_doc_01',
    name: 'Dr. Marcus Chen, MD',
    role: 'doctor',
    email: 'marcus.chen@metrohealth.org',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250',
    title: 'Attending Pulmonologist & Critical Care',
    department: 'Pulmonology & Intensive Care Unit',
    hospital: 'Metro General Medical Center',
    credentials: 'MD, FCCP'
  },
  patient: {
    id: 'usr_pat_01',
    name: 'Sarah Jenkins',
    role: 'patient',
    email: 'sarah.jenkins@email.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    title: 'Patient #PX-8942',
    department: 'Outpatient Imaging Services',
    hospital: 'Metro General Medical Center'
  },
  admin: {
    id: 'usr_adm_01',
    name: 'Alexander Cross',
    role: 'admin',
    email: 'alex.cross@aurarad.health',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    title: 'Enterprise PACS & AI Systems Director',
    department: 'Health Informatics & Hospital IT',
    hospital: 'AuraRad Enterprise Network'
  }
};

export const MOCK_SCANS: MedicalScan[] = [
  {
    id: 'scan_cxr_001',
    accessionNumber: 'ACC-2026-90812',
    mrn: 'MRN-7849102',
    patientId: 'usr_pat_01',
    patientName: 'Sarah Jenkins',
    patientAge: 48,
    patientGender: 'F',
    modality: 'X-Ray',
    studyDescription: 'Chest X-Ray PA & Lateral Projection',
    bodyPart: 'Thorax / Chest',
    scanDate: '2026-10-24 08:30 AM',
    priority: 'STAT',
    status: 'AI Analyzed',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200',
    priorImageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1200',
    aiOverallConfidence: 94.6,
    aiSummary: 'Right lower lobe dense consolidation with air bronchograms consistent with lobar pneumonia. Associated mild reactive blunting of the right costophrenic angle indicating early pleural effusion. Cardiothoracic index normal (0.42).',
    patientFriendlySummary: 'Your chest X-ray shows localized fluid and inflammation in the lower right lung, typical of pneumonia. Your heart size is completely normal. Dr. Chen and the radiology team have recommended targeted antibiotic treatment.',
    referringPhysician: 'Dr. Marcus Chen, MD (Pulmonology)',
    assignedRadiologist: 'Dr. Elena Vance, MD, FACR',
    clinicalIndication: 'Persistent productive cough for 6 days, fever 38.9°C, localized right pleuritic chest discomfort.',
    turnaroundTimeTarget: '15 min (STAT)',
    hospital: 'Metro General Medical Center',
    department: 'Emergency & Acute Imaging',
    aiFindings: [
      {
        id: 'fnd_01',
        title: 'Right Lower Lobe Consolidation',
        category: 'consolidation',
        confidence: 96.4,
        severity: 'critical',
        location: 'Right Lower Lung Zone (Retrocardiac & Basilar)',
        description: 'Dense homogeneous airspace opacification with visualized air bronchograms, typical of acute bacterial alveolar pneumonia.',
        boundingBox: { x: 54, y: 52, width: 28, height: 26 },
        heatmapType: 'red-hot',
        measurementMm: 64.2,
        recommendation: 'Immediate antibiotic therapy and clinical correlation. Follow-up radiography in 4-6 weeks to document resolution.'
      },
      {
        id: 'fnd_02',
        title: 'Right Reactive Pleural Effusion (Trace)',
        category: 'effusion',
        confidence: 88.2,
        severity: 'warning',
        location: 'Right Costophrenic Sulcus',
        description: 'Meniscus sign and blunting of right lateral costophrenic angle, consistent with parapneumonic pleural fluid accumulation.',
        boundingBox: { x: 68, y: 72, width: 18, height: 14 },
        heatmapType: 'amber-warning',
        recommendation: 'Monitor with decubitus view or bedside ultrasound if fever does not defervesce.'
      },
      {
        id: 'fnd_03',
        title: 'Cardiothoracic Ratio Within Normal Limits',
        category: 'normal',
        confidence: 99.1,
        severity: 'normal',
        location: 'Cardiac Silhouette & Mediastinum',
        description: 'Cardiac diameter measures 13.1 cm with maximal thoracic internal diameter 31.4 cm (ratio 0.417 < 0.50). No mediastinal widening.',
        boundingBox: { x: 38, y: 44, width: 26, height: 32 },
        heatmapType: 'cyan-glow'
      }
    ],
    carePlan: {
      summaryTitle: 'Right Lower Lobe Bacterial Pneumonia with Reactive Fluid',
      coreDiagnosis: 'Acute Community-Acquired Lobar Pneumonia (Right Lung)',
      whatIsHappening: 'Your right lower lung has developed a localized bacterial infection. In a healthy lung, millions of microscopic air sacs (alveoli) are filled with air so oxygen can pass into your blood. Right now, in the bottom section of your right lung, those air sacs have become filled with inflammatory fluid and white blood cells fighting the infection. There is also a small amount of extra protective fluid pooling in the corner between your lung and ribs (a pleural effusion).',
      engineeringAnalogy: 'Think of your lungs as an HVAC filtration and gas-exchange manifold. Normally, air travels smoothly through branching ducts into porous sponge filters. Due to a bacterial buildup, one quadrant of your filter unit has become saturated with liquid and debris, restricting airflow through that specific branch. Meanwhile, the outer casing has a slight fluid accumulation due to local pressure and heat (inflammation).',
      jargonGlossary: [
        {
          medicalTerm: 'Dense Consolidation',
          simpleExplanation: 'Air sacs filled with liquid/pus instead of air, making that lung area look solid white on the X-ray.',
          engineeringAnalogy: 'A porous air filter soaked with water and sediment, blocking normal airflow.',
          urgency: 'High'
        },
        {
          medicalTerm: 'Air Bronchograms',
          simpleExplanation: 'The branching breathing tubes (bronchi) are still open and dark with air, surrounded by the fluid-filled lung tissue.',
          engineeringAnalogy: 'Open metal pipes still conducting air even while the surrounding insulation is waterlogged.',
          urgency: 'Medium'
        },
        {
          medicalTerm: 'Blunting of Costophrenic Angle (Pleural Effusion)',
          simpleExplanation: 'A small accumulation of fluid in the bottom corner of your chest cavity outside the lung.',
          engineeringAnalogy: 'Water collecting in the lowest sump/drainage basin of a machine enclosure.',
          urgency: 'Medium'
        },
        {
          medicalTerm: 'Cardiothoracic Ratio (0.417 Normal)',
          simpleExplanation: 'Your heart size is completely healthy and normal (taking up less than 50% of the chest width).',
          engineeringAnalogy: 'The primary pump dimensions and clearances are well within normal operating tolerances.',
          urgency: 'Low'
        }
      ],
      suggestedMedications: [
        {
          name: 'Amoxicillin-Clavulanate (Augmentin) OR Azithromycin',
          category: 'First-Line Targeted Antibiotic',
          typicalDose: '875/125 mg orally twice daily with meals for 5 to 7 days',
          purpose: 'Eradicates the bacterial pathogens (typically Streptococcus pneumoniae or Haemophilus) causing the lung infiltration.',
          commonExamples: 'Augmentin, Amoxil, Zithromax',
          instructions: 'Must complete the FULL prescribed course even if fever resolves after 48 hours to prevent antibiotic resistance.',
          cautionNotes: 'Inform doctor immediately if you have any known Penicillin or Cephalosporin allergies.'
        },
        {
          name: 'Acetaminophen (Paracetamol) or Ibuprofen',
          category: 'Antipyretic & Analgesic (Fever / Chest Pain Relief)',
          typicalDose: 'Acetaminophen 500-1000 mg every 6 hours as needed for temperature > 38.3°C (Max 3,000 mg/day)',
          purpose: 'Reduces high fever (reported at 38.9°C), lowers bodily metabolic demand, and relieves sharp pleuritic chest pain during breathing.',
          commonExamples: 'Tylenol, Advil, Motrin',
          instructions: 'Take with a glass of water. Do not exceed 3,000 mg Acetaminophen in 24 hours.',
          cautionNotes: 'Avoid Ibuprofen if you have active stomach ulcers, renal impairment, or severe asthma.'
        },
        {
          name: 'Guaifenesin (Expectorant) & Warm Steam Inhalation',
          category: 'Airway Clearance & Mucolytic',
          typicalDose: '400 mg every 4 hours or 1200 mg extended release every 12 hours with copious water',
          purpose: 'Thins thick bronchial mucus and phlegm, allowing your body\'s natural ciliary escalator to expel trapped bacterial debris.',
          commonExamples: 'Mucinex, Robitussin Mucus',
          instructions: 'Drink at least 2.5 to 3 liters of fluids daily; hydration is essential for expectorants to work effectively.',
          cautionNotes: 'Avoid cough suppressants (like heavy codeine) that completely stop coughing, because coughing out the fluid is necessary for recovery.'
        }
      ],
      homeCarePlan: [
        'High Fluid Intake: Drink 2.5 to 3 liters of warm water, broth, or electrolyte liquids daily to prevent dehydration from fever and thin out chest secretions.',
        'Deep Breathing & Incentive Spirometry: Take 10 deep, slow breaths every hour while awake, followed by a supported cough to reopen collapsed alveoli.',
        'Rest & Semi-Upright Sleeping: Elevate your head and torso with 2-3 pillows (30-45 degree angle) to reduce pressure on the lower lungs and facilitate better diaphragm movement.',
        'Avoid All Smoke & Vaping: Complete avoidance of second-hand smoke, vaping, or airborne irritants that paralyze airway cilia.'
      ],
      warningSignsEmergency: [
        'Shortness of breath or struggling to breathe while simply resting or talking',
        'Fingertips or lips turning blue or pale gray (cyanosis)',
        'Pulse oximeter reading dropping below 92% (or below 90% if prior lung conditions)',
        'Confusion, severe dizziness, or extreme lethargy',
        'Coughing up frank dark red or bright blood',
        'Fever spiking above 39.5°C that does not respond to antipyretics'
      ],
      questionsForDoctor: [
        'Is my pneumonia suitable for outpatient oral antibiotics, or do I need IV antibiotics?',
        'Should I get a sputum culture or blood tests (like CRP/CBC) to confirm the exact bacterial strain?',
        'When should I schedule my follow-up chest X-ray to ensure the consolidation has fully cleared (usually 6 weeks)?',
        'Once I recover, am I a candidate for the pneumococcal vaccine (Prevnar 20 / Pneumovax 23)?'
      ]
    }
  },
  {
    id: 'scan_mri_002',
    accessionNumber: 'ACC-2026-90815',
    mrn: 'MRN-4421098',
    patientId: 'usr_pat_02',
    patientName: 'Robert Davis',
    patientAge: 62,
    patientGender: 'M',
    modality: 'MRI',
    studyDescription: 'Brain MRI Protocol (Axial FLAIR, T2, DWI, ADC Map)',
    bodyPart: 'Brain / Neuro',
    scanDate: '2026-10-24 09:45 AM',
    priority: 'STAT',
    status: 'In Review',
    imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1200',
    priorImageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200',
    slices: [
      'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200'
    ],
    currentSliceIndex: 1,
    aiOverallConfidence: 97.1,
    aiSummary: 'Acute diffusion restriction on DWI with corresponding ADC hypointensity in the left middle cerebral artery (MCA) M2 insular territory, diagnostic of acute ischemic infarction. No intracranial hemorrhage or midline shift.',
    patientFriendlySummary: 'Brain MRI indicates early restricted blood circulation in a localized region on the left side of the brain. No bleeding or swelling was found. The stroke team is actively administering neuroprotective protocols.',
    referringPhysician: 'Dr. Gregory House, MD (Neurology)',
    assignedRadiologist: 'Dr. Elena Vance, MD, FACR',
    clinicalIndication: 'Sudden onset right facial droop and expressive aphasia 2 hours prior to arrival. NIHSS score 7.',
    turnaroundTimeTarget: '10 min (Code Stroke)',
    hospital: 'Metro Comprehensive Stroke Center',
    department: 'Neuroradiology Division',
    aiFindings: [
      {
        id: 'fnd_04',
        title: 'Acute Ischemic Infarction (Left MCA Territory)',
        category: 'hemorrhage',
        confidence: 97.8,
        severity: 'critical',
        location: 'Left Insular Cortex & Frontoparietal Operculum',
        description: 'Restricted diffusion with high signal on DWI and corresponding low ADC values without T2-FLAIR signal changes (DWI-FLAIR mismatch positive, indicates tissue salvageability within 4.5h window).',
        boundingBox: { x: 32, y: 36, width: 22, height: 24 },
        heatmapType: 'red-hot',
        recommendation: 'Urgent evaluation for IV thrombolysis and endovascular mechanical thrombectomy.'
      },
      {
        id: 'fnd_05',
        title: 'Absence of Intracranial Hemorrhage',
        category: 'normal',
        confidence: 99.4,
        severity: 'normal',
        location: 'Subdural, Epidural, and Subarachnoid Spaces',
        description: 'No blood-fluid levels on gradient echo or susceptibility weighted imaging (SWI). Midline structures are central with ventricles within normal caliber.',
        boundingBox: { x: 42, y: 40, width: 16, height: 20 },
        heatmapType: 'cyan-glow'
      }
    ]
  },
  {
    id: 'scan_ct_003',
    accessionNumber: 'ACC-2026-90820',
    mrn: 'MRN-3309187',
    patientId: 'usr_pat_03',
    patientName: 'Elena Rostova',
    patientAge: 56,
    patientGender: 'F',
    modality: 'CT',
    studyDescription: 'High-Resolution Chest CT without Contrast (Lung Cancer Screening Protocol)',
    bodyPart: 'Chest / Lungs',
    scanDate: '2026-10-23 02:15 PM',
    priority: 'Routine',
    status: 'Finalized',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200',
    priorImageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200',
    aiOverallConfidence: 91.8,
    aiSummary: 'Well-circumscribed solid pulmonary nodule in the anterior segment of the right upper lobe measuring 11.4 mm x 9.8 mm. Compared to prior examination 12 months ago, nodule has enlarged by 2.2 mm. Lung-RADS Category 4A (Suspicious).',
    patientFriendlySummary: 'CT scan identified a small nodule in the upper right lung that has grown slightly since your last scan a year ago. It requires specialized follow-up, and your physician will discuss a PET-CT or fine-needle tissue test.',
    referringPhysician: 'Dr. Marcus Chen, MD (Pulmonology)',
    assignedRadiologist: 'Dr. Elena Vance, MD, FACR',
    clinicalIndication: 'Annual low-dose CT follow-up for 35 pack-year smoking history. Asymptomatic.',
    turnaroundTimeTarget: '24 hours',
    hospital: 'Metro Cancer & Oncology Center',
    department: 'Diagnostic Thoracic CT',
    aiFindings: [
      {
        id: 'fnd_06',
        title: 'Solitary Solid Pulmonary Nodule',
        category: 'nodule',
        confidence: 93.5,
        severity: 'warning',
        location: 'Right Upper Lobe, Anterior Segment (Subpleural)',
        description: 'Solid nodule with mildly lobulated borders measuring 11.4 x 9.8 mm (mean diameter 10.6 mm). Demonstrates volume doubling time of 395 days compared with study from October 2025 (prior diameter 8.4 mm).',
        boundingBox: { x: 58, y: 32, width: 14, height: 14 },
        heatmapType: 'amber-warning',
        measurementMm: 11.4,
        biRadsLungRads: 'Lung-RADS 4A',
        recommendation: 'Tissue sampling via robotic bronchoscopy or 18F-FDG PET/CT scan recommended within 1 month.'
      }
    ],
    report: {
      id: 'rep_003',
      scanId: 'scan_ct_003',
      accessionNumber: 'ACC-2026-90820',
      patientId: 'usr_pat_03',
      patientName: 'Elena Rostova',
      radiologistName: 'Dr. Elena Vance, MD, FACR',
      radiologistTitle: 'Senior Thoracic Radiologist',
      status: 'Finalized',
      finalizedAt: '2026-10-23 04:30 PM',
      clinicalHistory: '56-year-old female with long-standing tobacco exposure, low-dose lung cancer screening program follow-up.',
      technique: 'Helical multidetector CT of the thorax performed from lung apices through adrenal glands without intravenous iodinated contrast at low-dose parameters (100 kVp, modulated mA). Reconstructed at 1.0 mm slice thickness with high-frequency lung algorithm.',
      comparison: 'Prior low-dose chest CT dated October 14, 2025.',
      findingsText: 'LUNGS AND PLEURA: Interval growth of a solitary solid nodule in the right upper lobe anterior segment, currently measuring 11.4 x 9.8 mm (series 3, image 42) compared to 8.4 x 7.6 mm previously. The borders are mildly lobulated without definite cavitation or internal calcification. No satellite nodules or tree-in-bud opacities. The remainder of the lung parenchyma is clear of infiltrates or emphysematous changes. Pleural spaces are dry without pneumothorax or effusion.\n\nMEDIASTINUM & HILA: No enlarged mediastinal, paratracheal, or subcarinal lymph nodes by size criteria (short axis all < 10 mm). Great vessels and cardiac silhouette appear unremarkable.\n\nUPPER ABDOMEN & CHEST WALL: Scanned portions of upper abdomen show bilateral adrenal glands within normal morphology and dimensions. Visualized osseous structures demonstrate no suspicious osteolytic or osteoblastic metastases.',
      impressionText: '1. Enlarged solid right upper lobe pulmonary nodule (mean diameter 10.6 mm, prior 8.0 mm), classified as Lung-RADS 4A (Suspicious).\n2. No evidence of mediastinal/hilar adenopathy or gross metastatic spread.',
      recommendations: 'Recommend diagnostic 18F-FDG PET-CT scan or CT-guided/robotic navigational bronchoscopic biopsy in accordance with ACR Lung-RADS 4A guidelines.',
      icd10Codes: [
        { code: 'R91.1', description: 'Solitary pulmonary nodule' },
        { code: 'Z87.891', description: 'Personal history of nicotine dependence' }
      ],
      radsCategory: 'Lung-RADS 4A',
      signatureVerificationHash: 'SHA256:7f4c89a01e92d83b0921cf816ea9825b2901a88c78411b0e9a712f55ac678129',
      qrVerificationId: 'AURARAD-SIG-90820-VANCE'
    }
  },
  {
    id: 'scan_us_004',
    accessionNumber: 'ACC-2026-90833',
    mrn: 'MRN-8902144',
    patientId: 'usr_pat_04',
    patientName: 'David Miller',
    patientAge: 59,
    patientGender: 'M',
    modality: 'Ultrasound',
    studyDescription: 'Bilateral Carotid Arterial Duplex Ultrasound with Color & Spectral Doppler',
    bodyPart: 'Vascular / Carotid',
    scanDate: '2026-10-24 11:20 AM',
    priority: 'Urgent',
    status: 'AI Analyzed',
    imageUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=1200',
    priorImageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200',
    aiOverallConfidence: 89.4,
    aiSummary: 'Internal carotid artery (ICA) bifurcation demonstrates heterogeneous fibrocalcific atherosclerotic plaque causing 65-70% hemodynamic diameter stenosis. Peak systolic velocity (PSV) elevated at 182 cm/s (ICA/CCA velocity ratio 3.1).',
    patientFriendlySummary: 'Ultrasound shows cholesterol and mineral buildup in the main neck artery supplying your brain, narrowing the channel by approximately 65-70%. Blood continues to flow through. Vascular specialists will evaluate medication optimization.',
    referringPhysician: 'Dr. Emily Watson, MD (Cardiovascular)',
    assignedRadiologist: 'Dr. Elena Vance, MD, FACR',
    clinicalIndication: 'Recent episode of transient amaurosis fugax (temporary loss of vision in right eye) resolving in 15 minutes.',
    turnaroundTimeTarget: '60 min',
    hospital: 'Metro Vascular Institute',
    department: 'Non-Invasive Vascular Lab',
    aiFindings: [
      {
        id: 'fnd_07',
        title: 'Moderate-to-Severe Internal Carotid Artery Stenosis',
        category: 'mass',
        confidence: 91.2,
        severity: 'critical',
        location: 'Right Carotid Bulb and Proximal ICA',
        description: 'Heterogeneous calcified plaque with surface irregularity causing spectral broadening and flow acceleration. PSV = 182 cm/s, End-diastolic velocity = 64 cm/s.',
        boundingBox: { x: 44, y: 38, width: 24, height: 26 },
        heatmapType: 'red-hot',
        recommendation: 'Recommend prompt vascular surgical consultation. Consider CT Angiography of head and neck for definitive anatomical grading.'
      }
    ]
  },
  {
    id: 'scan_cxr_005',
    accessionNumber: 'ACC-2026-90840',
    mrn: 'MRN-1192840',
    patientId: 'usr_pat_05',
    patientName: 'James Wilson',
    patientAge: 34,
    patientGender: 'M',
    modality: 'X-Ray',
    studyDescription: 'Right Knee Radiograph AP, Lateral & Sunrise Views',
    bodyPart: 'Musculoskeletal / Knee',
    scanDate: '2026-10-24 01:10 PM',
    priority: 'Routine',
    status: 'Finalized',
    imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1200',
    aiOverallConfidence: 96.8,
    aiSummary: 'No acute cortical disruption, fracture, or joint dislocation identified. Joint space preserved across medial and lateral compartments. No significant joint effusion in suprapatellar bursa.',
    patientFriendlySummary: 'Your knee X-ray shows no broken bones or cartilage alignment problems. The joint space is healthy and intact. Pain may be soft-tissue or ligament related.',
    referringPhysician: 'Dr. Tyler Rodriguez, MD (Sports Medicine)',
    assignedRadiologist: 'Dr. Elena Vance, MD, FACR',
    clinicalIndication: 'Twisting injury while running 48 hours ago, lateral joint line tenderness.',
    turnaroundTimeTarget: '2 hours',
    hospital: 'Metro Orthopedic Institute',
    department: 'Orthopedic Imaging',
    aiFindings: [
      {
        id: 'fnd_08',
        title: 'Intact Osseous Architecture & Absence of Acute Fracture',
        category: 'normal',
        confidence: 97.4,
        severity: 'normal',
        location: 'Proximal Tibia, Distal Femur, and Patella',
        description: 'Smooth cortical margins without step-off, periosteal reaction, or impaction. Fabella noted as an anatomical variant in the lateral head of gastrocnemius.',
        boundingBox: { x: 40, y: 42, width: 22, height: 25 },
        heatmapType: 'cyan-glow'
      }
    ]
  },
  {
    id: 'scan_ct_006',
    accessionNumber: 'ACC-2026-90855',
    mrn: 'MRN-6729014',
    patientId: 'usr_pat_06',
    patientName: 'Maria Gomez',
    patientAge: 44,
    patientGender: 'F',
    modality: 'CT',
    studyDescription: 'CT Pulmonary Angiography (CTPA) PE Protocol',
    bodyPart: 'Chest / Vasculature',
    scanDate: '2026-10-24 02:40 PM',
    priority: 'STAT',
    status: 'Pending AI',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200',
    aiOverallConfidence: 95.2,
    aiSummary: 'Acute segmental pulmonary embolus detected in the right posterior basal pulmonary arterial branch with sharp filling defect. Right ventricular to left ventricular (RV/LV) diameter ratio 0.88 (no right heart strain).',
    patientFriendlySummary: 'CT scan has identified a small localized clot in an artery of your lower right lung. Crucially, your heart shows no signs of strain, and doctors have started anticoagulation medicine to safely dissolve it.',
    referringPhysician: 'Dr. Marcus Chen, MD (Emergency Medicine)',
    assignedRadiologist: 'Dr. Elena Vance, MD, FACR',
    clinicalIndication: 'Sudden onset pleuritic chest pain and dyspnea after 14-hour international flight. D-Dimer elevated at 3,240 ng/mL.',
    turnaroundTimeTarget: '15 min (STAT)',
    hospital: 'Metro General Medical Center',
    department: 'Emergency & Critical Care Imaging',
    aiFindings: [
      {
        id: 'fnd_09',
        title: 'Acute Segmental Pulmonary Embolism',
        category: 'nodule',
        confidence: 95.8,
        severity: 'critical',
        location: 'Right Lower Lobe Posterior Basal Segmental Artery',
        description: 'Partial filling defect surrounded by iodinated contrast (polo mint sign on cross-section) within the right posterior basal artery.',
        boundingBox: { x: 57, y: 58, width: 16, height: 16 },
        heatmapType: 'red-hot',
        recommendation: 'Immediate systemic therapeutic anticoagulation (low molecular weight heparin or direct oral anticoagulant) per institutional PE protocol.'
      }
    ]
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt_01',
    patientId: 'usr_pat_01',
    patientName: 'Sarah Jenkins',
    modality: 'X-Ray',
    study: 'Chest X-Ray 4-Week Follow-up',
    date: '2026-11-20',
    time: '10:00 AM',
    location: 'Metro General — Suite 204 Outpatient Imaging',
    physician: 'Dr. Marcus Chen, MD',
    preparationNotes: 'No fasting required. Wear comfortable clothing without metal fasteners or jewelry.',
    status: 'Scheduled'
  },
  {
    id: 'apt_02',
    patientId: 'usr_pat_01',
    patientName: 'Sarah Jenkins',
    modality: 'CT',
    study: 'High-Resolution Thoracic CT',
    date: '2026-12-15',
    time: '02:30 PM',
    location: 'Advanced Diagnostic Pavilion — CT Scanner 3',
    physician: 'Dr. Marcus Chen, MD',
    preparationNotes: 'Fast 4 hours prior if intravenous contrast is ordered. Hydrate with 2 glasses of water before arrival.',
    status: 'Scheduled'
  }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_01',
    timestamp: '2026-10-24 14:48:22',
    actorName: 'Dr. Elena Vance, MD',
    actorRole: 'radiologist',
    action: 'SIGNED_REPORT_FINAL',
    resource: 'ACC-2026-90820 (Elena Rostova - Lung-RADS 4A)',
    patientMrn: 'MRN-3309187',
    ipAddress: '10.14.88.42 (Internal Radiology Workstation)',
    status: 'SUCCESS'
  },
  {
    id: 'log_02',
    timestamp: '2026-10-24 14:42:10',
    actorName: 'AuraRad Diagnostic AI Engine v4.2',
    actorRole: 'admin',
    action: 'AI_INFERENCE_COMPLETED',
    resource: 'ACC-2026-90812 (Sarah Jenkins - Pneumonia / Effusion)',
    patientMrn: 'MRN-7849102',
    ipAddress: '10.14.0.12 (GPU Cluster Alpha)',
    status: 'SUCCESS'
  },
  {
    id: 'log_03',
    timestamp: '2026-10-24 14:31:05',
    actorName: 'Dr. Marcus Chen, MD',
    actorRole: 'doctor',
    action: 'ORDER_STAT_SCAN',
    resource: 'ACC-2026-90855 (Maria Gomez - CT Pulmonary Angio)',
    patientMrn: 'MRN-6729014',
    ipAddress: '10.14.32.19 (ED Triage Terminal 4)',
    status: 'ALERT'
  },
  {
    id: 'log_04',
    timestamp: '2026-10-24 13:15:40',
    actorName: 'Sarah Jenkins',
    actorRole: 'patient',
    action: 'VIEWED_PATIENT_REPORT',
    resource: 'ACC-2026-90812 (Chest X-Ray Findings)',
    patientMrn: 'MRN-7849102',
    ipAddress: '172.56.21.94 (Encrypted Patient Mobile App)',
    status: 'SUCCESS'
  },
  {
    id: 'log_05',
    timestamp: '2026-10-24 12:05:18',
    actorName: 'Alexander Cross',
    actorRole: 'admin',
    action: 'UPDATE_AI_THRESHOLD',
    resource: 'Pneumothorax Sensitivity Sensitivity: 98.2% -> 99.0%',
    ipAddress: '10.14.2.5 (Admin Secured Console)',
    status: 'SUCCESS'
  }
];

export const MOCK_HOSPITALS: HospitalFacility[] = [
  {
    id: 'hosp_01',
    name: 'Metro General Medical Center',
    city: 'San Francisco, CA',
    activeStudies: 142,
    aiConcordanceRate: 98.2,
    meanTatMinutes: 14.2,
    criticalCasesToday: 9
  },
  {
    id: 'hosp_02',
    name: 'St. Jude University Hospital & Childrens Health',
    city: 'Boston, MA',
    activeStudies: 98,
    aiConcordanceRate: 97.6,
    meanTatMinutes: 18.5,
    criticalCasesToday: 4
  },
  {
    id: 'hosp_03',
    name: 'Northwestern Memorial Radiology Network',
    city: 'Chicago, IL',
    activeStudies: 215,
    aiConcordanceRate: 98.9,
    meanTatMinutes: 12.8,
    criticalCasesToday: 15
  }
];
