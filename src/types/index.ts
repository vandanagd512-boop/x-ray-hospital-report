export type UserRole = 'radiologist' | 'doctor' | 'patient' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar: string;
  title: string;
  department: string;
  hospital: string;
  credentials?: string;
}

export type Modality = 'X-Ray' | 'CT' | 'MRI' | 'Ultrasound';

export type ScanPriority = 'STAT' | 'Urgent' | 'Routine';

export type ScanStatus = 
  | 'Pending AI' 
  | 'AI Analyzed' 
  | 'In Review' 
  | 'Draft' 
  | 'Finalized' 
  | 'Addendum';

export interface BoundingBox {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
}

export interface AIFinding {
  id: string;
  title: string;
  category: 'nodule' | 'consolidation' | 'effusion' | 'fracture' | 'hemorrhage' | 'mass' | 'normal';
  confidence: number; // 0 - 100
  severity: 'critical' | 'warning' | 'moderate' | 'normal';
  location: string;
  description: string;
  boundingBox?: BoundingBox;
  heatmapType?: 'red-hot' | 'cyan-glow' | 'amber-warning';
  measurementMm?: number;
  recommendation?: string;
  biRadsLungRads?: string;
}

export interface MedicalScan {
  id: string;
  accessionNumber: string;
  mrn: string; // Medical Record Number
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'M' | 'F' | 'Other';
  modality: Modality;
  studyDescription: string;
  bodyPart: string;
  scanDate: string;
  priority: ScanPriority;
  status: ScanStatus;
  imageUrl: string;
  priorImageUrl?: string;
  slices?: string[];
  currentSliceIndex?: number;
  aiFindings: AIFinding[];
  aiOverallConfidence: number;
  aiSummary: string;
  patientFriendlySummary: string;
  referringPhysician: string;
  assignedRadiologist?: string;
  clinicalIndication: string;
  turnaroundTimeTarget: string; // e.g. "15 min"
  hospital: string;
  department: string;
  report?: DiagnosticReport;
  carePlan?: PlainLanguageCarePlan;
}

export interface MedicationRecommendation {
  name: string;
  category: string;
  typicalDose: string;
  purpose: string;
  commonExamples: string;
  instructions: string;
  cautionNotes: string;
}

export interface JargonTranslatorItem {
  medicalTerm: string;
  simpleExplanation: string;
  engineeringAnalogy: string;
  urgency: 'Low' | 'Medium' | 'High';
}

export interface PlainLanguageCarePlan {
  summaryTitle: string;
  coreDiagnosis: string;
  whatIsHappening: string;
  engineeringAnalogy: string;
  jargonGlossary: JargonTranslatorItem[];
  suggestedMedications: MedicationRecommendation[];
  homeCarePlan: string[];
  warningSignsEmergency: string[];
  questionsForDoctor: string[];
}

export interface DiagnosticReport {
  id: string;
  scanId: string;
  accessionNumber: string;
  patientId: string;
  patientName: string;
  radiologistName: string;
  radiologistTitle: string;
  status: 'Draft' | 'Finalized' | 'Addendum';
  finalizedAt?: string;
  clinicalHistory: string;
  technique: string;
  comparison: string;
  findingsText: string;
  impressionText: string;
  recommendations: string;
  icd10Codes: { code: string; description: string }[];
  radsCategory?: string; // e.g. "Lung-RADS 4A (Suspicious)"
  signatureVerificationHash?: string;
  qrVerificationId?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  modality: Modality;
  study: string;
  date: string;
  time: string;
  location: string;
  physician: string;
  preparationNotes: string;
  status: 'Scheduled' | 'Completed' | 'In Progress' | 'Cancelled';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  resource: string;
  patientMrn?: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'ALERT';
}

export interface HospitalFacility {
  id: string;
  name: string;
  city: string;
  activeStudies: number;
  aiConcordanceRate: number;
  meanTatMinutes: number;
  criticalCasesToday: number;
}
