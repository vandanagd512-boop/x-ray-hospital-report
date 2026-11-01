import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { RadiologistDashboard } from './components/radiologist/RadiologistDashboard';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { PatientPortal } from './components/patient/PatientPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PrintableReportModal } from './components/reports/PrintableReportModal';
import { ScanOrderModal } from './components/doctor/ScanOrderModal';
import { PlainLanguageCareModal } from './components/patient/PlainLanguageCareModal';
import { RegionalPatientAssistant } from './components/multilingual/RegionalPatientAssistant';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, activeCarePlanScan, closeCarePlanModal } = useAuth();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 bg-grid-pattern selection:bg-brand-500 selection:text-white transition-colors duration-200">
      
      {/* Global Clinical Navigation */}
      <Navbar onOpenUpload={() => setIsUploadModalOpen(true)} />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {activeTab === 'landing' && (
          <LandingPage onOpenUpload={() => setIsUploadModalOpen(true)} />
        )}

        {(activeTab === 'radiologist' || activeTab === 'viewer') && (
          <RadiologistDashboard />
        )}

        {activeTab === 'doctor' && (
          <DoctorDashboard />
        )}

        {activeTab === 'patient' && (
          <PatientPortal />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard />
        )}

        {activeTab === 'regional' && (
          <RegionalPatientAssistant />
        )}
      </main>

      {/* Hospital Footer */}
      <Footer />

      {/* Global Interactive Modals */}
      <PrintableReportModal />
      {activeCarePlanScan && (
        <PlainLanguageCareModal
          scan={activeCarePlanScan}
          isOpen={!!activeCarePlanScan}
          onClose={closeCarePlanModal}
        />
      )}
      <ScanOrderModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
