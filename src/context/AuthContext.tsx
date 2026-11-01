import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, MedicalScan, DiagnosticReport, AuditLog } from '../types';
import { MOCK_USERS, MOCK_SCANS, MOCK_AUDIT_LOGS } from '../data/mockData';

export type NavigationTab = 'landing' | 'radiologist' | 'doctor' | 'patient' | 'admin' | 'viewer' | 'regional';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'critical' | 'info' | 'success';
  read: boolean;
}

interface AuthContextType {
  currentUser: User;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  scans: MedicalScan[];
  selectedScan: MedicalScan | null;
  selectScan: (scanId: string) => void;
  addScan: (newScan: Partial<MedicalScan>) => MedicalScan;
  updateScanReport: (scanId: string, report: DiagnosticReport) => void;
  runAiReAnalysis: (scanId: string) => Promise<void>;
  isAnalyzing: boolean;
  activeReportScan: MedicalScan | null;
  openReportModal: (scan: MedicalScan) => void;
  closeReportModal: () => void;
  activeCarePlanScan: MedicalScan | null;
  openCarePlanModal: (scan: MedicalScan) => void;
  closeCarePlanModal: () => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  auditLogs: AuditLog[];
  addAuditLog: (action: string, resource: string, status?: 'SUCCESS' | 'WARNING' | 'ALERT') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('radiologist');
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS['radiologist']);
  const [activeTab, setActiveTab] = useState<NavigationTab>('landing');
  const [scans, setScans] = useState<MedicalScan[]>(() => {
    const saved = localStorage.getItem('aurarad_scans');
    if (!saved) return MOCK_SCANS;
    try {
      const parsed: MedicalScan[] = JSON.parse(saved);
      // Ensure mock scans receive updated carePlan
      return parsed.map(s => {
        const mock = MOCK_SCANS.find(m => m.id === s.id);
        if (mock && !s.carePlan) {
          return { ...s, carePlan: mock.carePlan };
        }
        return s;
      });
    } catch {
      return MOCK_SCANS;
    }
  });
  const [selectedScanId, setSelectedScanId] = useState<string>(MOCK_SCANS[0].id);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeReportScan, setActiveReportScan] = useState<MedicalScan | null>(null);
  const [activeCarePlanScan, setActiveCarePlanScan] = useState<MedicalScan | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_1',
      title: 'STAT AI Alert: Pneumothorax / Consolidation',
      message: 'ACC-2026-90812 (Sarah Jenkins) flagged with 96.4% confidence in Right Lower Lobe.',
      time: '2m ago',
      type: 'critical',
      read: false
    },
    {
      id: 'notif_2',
      title: 'Report Signed & Transmitted to EHR',
      message: 'ACC-2026-90820 (Elena Rostova - Lung-RADS 4A) finalized by Dr. Elena Vance.',
      time: '18m ago',
      type: 'success',
      read: false
    },
    {
      id: 'notif_3',
      title: 'New CT Angiogram Ingested',
      message: 'ACC-2026-90855 ordered by Dr. Marcus Chen (Emergency Dept).',
      time: '45m ago',
      type: 'info',
      read: true
    }
  ]);

  useEffect(() => {
    localStorage.setItem('aurarad_scans', JSON.stringify(scans));
  }, [scans]);

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    setCurrentUser(MOCK_USERS[role] || MOCK_USERS['radiologist']);
    
    // Automatically route to the user's specific dashboard
    if (role === 'radiologist') setActiveTab('radiologist');
    else if (role === 'doctor') setActiveTab('doctor');
    else if (role === 'patient') setActiveTab('patient');
    else if (role === 'admin') setActiveTab('admin');

    addAuditLog(`ROLE_SWITCH_TO_${role.toUpperCase()}`, `User switched role to ${role}`, 'SUCCESS');
  };

  const selectScan = (scanId: string) => {
    setSelectedScanId(scanId);
    setActiveTab('viewer');
    const scan = scans.find(s => s.id === scanId);
    if (scan) {
      addAuditLog('VIEW_SCAN_DICOM', `${scan.accessionNumber} (${scan.patientName})`, 'SUCCESS');
    }
  };

  const addScan = (newScanData: Partial<MedicalScan>): MedicalScan => {
    const newScan: MedicalScan = {
      id: `scan_${Date.now()}`,
      accessionNumber: `ACC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      mrn: `MRN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      patientId: 'usr_pat_custom',
      patientName: newScanData.patientName || 'Anonymous Patient',
      patientAge: newScanData.patientAge || 45,
      patientGender: newScanData.patientGender || 'Other',
      modality: newScanData.modality || 'X-Ray',
      studyDescription: newScanData.studyDescription || 'Diagnostic Medical Examination',
      bodyPart: newScanData.bodyPart || 'Thoracic Cavity',
      scanDate: new Date().toLocaleString(),
      priority: newScanData.priority || 'STAT',
      status: 'AI Analyzed',
      imageUrl: newScanData.imageUrl || 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200',
      aiOverallConfidence: 94.2,
      aiSummary: 'Rapid AI neural inference detected focal architectural distortion and density variation. Radiologist validation recommended.',
      patientFriendlySummary: 'Scan uploaded and pre-screened by diagnostic AI. Radiologist review in progress.',
      referringPhysician: currentUser.role === 'doctor' ? currentUser.name : 'Dr. Marcus Chen, MD',
      clinicalIndication: newScanData.clinicalIndication || 'Urgent evaluation for respiratory / clinical symptoms.',
      turnaroundTimeTarget: newScanData.priority === 'STAT' ? '15 min' : '2 hours',
      hospital: 'Metro General Medical Center',
      department: 'Urgent Diagnostic Suite',
      aiFindings: [
        {
          id: `fnd_${Date.now()}_1`,
          title: 'Suspicious Focal Density',
          category: 'nodule',
          confidence: 93.8,
          severity: 'critical',
          location: 'Mid-Thoracic Zone',
          description: 'High-attenuation focus detected by convolutional feature map.',
          boundingBox: { x: 45, y: 40, width: 22, height: 22 },
          heatmapType: 'red-hot',
          recommendation: 'Immediate formal reading and comparison with baseline.'
        }
      ],
      ...newScanData
    };

    setScans(prev => [newScan, ...prev]);
    setSelectedScanId(newScan.id);
    addAuditLog('INGEST_SCAN_SUCCESS', `${newScan.accessionNumber} (${newScan.modality})`, 'SUCCESS');
    return newScan;
  };

  const updateScanReport = (scanId: string, report: DiagnosticReport) => {
    setScans(prev =>
      prev.map(s => {
        if (s.id === scanId) {
          return {
            ...s,
            status: report.status === 'Finalized' ? 'Finalized' : 'Draft',
            report
          };
        }
        return s;
      })
    );
    addAuditLog(
      report.status === 'Finalized' ? 'SIGN_REPORT_FINAL' : 'SAVE_REPORT_DRAFT',
      `Report for ${scanId} by ${currentUser.name}`,
      'SUCCESS'
    );
  };

  const runAiReAnalysis = async (scanId: string) => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 1400));
    setScans(prev =>
      prev.map(s => {
        if (s.id === scanId) {
          return {
            ...s,
            status: 'AI Analyzed',
            aiOverallConfidence: Math.min(99.4, s.aiOverallConfidence + 1.2)
          };
        }
        return s;
      })
    );
    setIsAnalyzing(false);
    addAuditLog('AI_DEEP_INFERENCE_TRIGGERED', `Re-analyzed scan ${scanId}`, 'SUCCESS');
  };

  const openReportModal = (scan: MedicalScan) => {
    setActiveReportScan(scan);
    addAuditLog('GENERATE_PRINTABLE_PDF_REPORT', `${scan.accessionNumber}`, 'SUCCESS');
  };

  const closeReportModal = () => {
    setActiveReportScan(null);
  };

  const openCarePlanModal = (scan: MedicalScan) => {
    setActiveCarePlanScan(scan);
    addAuditLog('VIEW_PLAIN_LANGUAGE_CARE_PLAN', `${scan.accessionNumber}`, 'SUCCESS');
  };

  const closeCarePlanModal = () => {
    setActiveCarePlanScan(null);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const addAuditLog = (action: string, resource: string, status: 'SUCCESS' | 'WARNING' | 'ALERT' = 'SUCCESS') => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorName: currentUser.name,
      actorRole: currentRole,
      action,
      resource,
      ipAddress: '10.14.88.192 (Encrypted Session)',
      status
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const selectedScan = scans.find(s => s.id === selectedScanId) || scans[0] || null;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        switchRole,
        activeTab,
        setActiveTab,
        scans,
        selectedScan,
        selectScan,
        addScan,
        updateScanReport,
        runAiReAnalysis,
        isAnalyzing,
        activeReportScan,
        openReportModal,
        closeReportModal,
        activeCarePlanScan,
        openCarePlanModal,
        closeCarePlanModal,
        notifications,
        markNotificationRead,
        auditLogs,
        addAuditLog
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
