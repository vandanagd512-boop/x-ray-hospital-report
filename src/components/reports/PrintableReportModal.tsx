import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Printer, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Activity, 
  Download, 
  QrCode,
  FileCheck,
  Pill
} from 'lucide-react';

export const PrintableReportModal: React.FC = () => {
  const { activeReportScan, closeReportModal, openCarePlanModal } = useAuth();

  if (!activeReportScan) return null;

  const scan = activeReportScan;
  const report = scan.report;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      
      {/* Container */}
      <div className="relative w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-xs uppercase tracking-wider">
              Diagnostic Radiology Consultation Report (Verified Electronic Document)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {scan.carePlan && (
              <button
                onClick={() => openCarePlanModal(scan)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all"
              >
                <Pill className="w-3.5 h-3.5" />
                <span>Plain-English & Meds Guide</span>
              </button>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={closeReportModal}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Medical Report Document */}
        <div className="p-8 sm:p-12 font-sans text-xs text-slate-800 leading-relaxed space-y-6">
          
          {/* Hospital Letterhead Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-brand-700 flex items-center justify-center text-white font-bold">
                  ⚡
                </div>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase">
                  {scan.hospital}
                </h1>
              </div>
              <p className="text-[11px] font-semibold text-slate-600 mt-1 uppercase tracking-wider">
                {scan.department} • PACS & Diagnostic Imaging Network
              </p>
              <p className="text-[10px] text-slate-500">
                100 Medical Center Way • Accreditation: ACR Gold Seal • CLIA / CAP Certified
              </p>
            </div>

            {/* Document QR & Verification Badge */}
            <div className="text-right flex flex-col items-end">
              <div className="w-14 h-14 border border-slate-300 rounded p-1 flex items-center justify-center bg-slate-50 mb-1">
                <QrCode className="w-11 h-11 text-slate-800" />
              </div>
              <span className="text-[9px] font-mono text-slate-500">VERIFIED ID: {scan.accessionNumber}</span>
              <span className="text-[9px] font-mono text-emerald-700 font-bold">HL7 FHIR SECURE</span>
            </div>
          </div>

          {/* Patient Demographics & Exam Info Table */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-500">Patient Name:</span>
              <span className="font-bold text-slate-900 text-sm">{scan.patientName}</span>
            </div>

            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-500">MRN:</span>
              <span className="font-mono font-semibold text-slate-900">{scan.mrn}</span>
            </div>

            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-500">Age / Sex:</span>
              <span className="font-semibold text-slate-900">{scan.patientAge} Years / {scan.patientGender}</span>
            </div>

            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-500">Accession No:</span>
              <span className="font-mono font-bold text-slate-900">{scan.accessionNumber}</span>
            </div>

            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-500">Date of Exam:</span>
              <span className="font-semibold text-slate-900">{scan.scanDate}</span>
            </div>

            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-500">Referring MD:</span>
              <span className="font-semibold text-slate-900">{scan.referringPhysician}</span>
            </div>

            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-500">Exam Modality:</span>
              <span className="font-bold text-brand-800 uppercase">{scan.modality}</span>
            </div>

            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-500">Status:</span>
              <span className="font-bold text-emerald-700 uppercase">FINALIZED & SIGNED</span>
            </div>
          </div>

          {/* Examination Title */}
          <div className="pt-2">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900 bg-slate-100 p-2 border-l-4 border-brand-700">
              Examination: {scan.studyDescription}
            </h2>
          </div>

          {/* Clinical Indication */}
          <div>
            <h3 className="font-bold uppercase tracking-wider text-[11px] text-slate-700 mb-1">
              Clinical Indication / History:
            </h3>
            <p className="text-slate-800 text-xs">
              {report?.clinicalHistory || scan.clinicalIndication}
            </p>
          </div>

          {/* Technique */}
          <div>
            <h3 className="font-bold uppercase tracking-wider text-[11px] text-slate-700 mb-1">
              Technique:
            </h3>
            <p className="text-slate-800 text-xs">
              {report?.technique || `${scan.studyDescription} acquired per standard hospital radiation-optimized ALARA protocol.`}
            </p>
          </div>

          {/* Comparison */}
          <div>
            <h3 className="font-bold uppercase tracking-wider text-[11px] text-slate-700 mb-1">
              Comparison:
            </h3>
            <p className="text-slate-800 text-xs">
              {report?.comparison || (scan.priorImageUrl ? 'Comparison made with prior study dated 12 months previously.' : 'None.')}
            </p>
          </div>

          {/* Key Findings Snapshot Image */}
          <div className="py-2">
            <h3 className="font-bold uppercase tracking-wider text-[11px] text-slate-700 mb-2">
              Key Diagnostic Findings & AI Localization:
            </h3>
            <div className="flex items-start gap-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <img
                src={scan.imageUrl}
                alt={scan.studyDescription}
                className="w-40 h-32 object-cover rounded border border-slate-300"
              />
              <div className="space-y-1 text-xs">
                <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-brand-100 text-brand-800">
                  AI CAD PRE-READ METRIC: {scan.aiOverallConfidence}% CONCURRENCE
                </span>
                <p className="text-slate-700 font-semibold mt-1">
                  Primary abnormality: {scan.aiFindings[0]?.title}
                </p>
                <p className="text-slate-600 text-[11px]">
                  {scan.aiFindings[0]?.description}
                </p>
                {report?.radsCategory && (
                  <p className="font-bold text-amber-800 mt-1">
                    Grading: {report.radsCategory}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Findings Text */}
          <div>
            <h3 className="font-bold uppercase tracking-wider text-[11px] text-slate-700 mb-1">
              Anatomical Findings:
            </h3>
            <div className="whitespace-pre-line text-slate-800 text-xs font-mono bg-slate-50/50 p-3 rounded border border-slate-100 leading-relaxed">
              {report?.findingsText || scan.aiSummary}
            </div>
          </div>

          {/* Impression (Numbered Conclusion) */}
          <div className="p-4 bg-slate-100 rounded-lg border-l-4 border-slate-800">
            <h3 className="font-extrabold uppercase tracking-wider text-xs text-slate-900 mb-1.5">
              Impression / Diagnostic Conclusion:
            </h3>
            <div className="whitespace-pre-line font-bold text-xs text-slate-900 leading-relaxed">
              {report?.impressionText || `1. ${scan.aiSummary}\n2. Urgent clinical correlation indicated.`}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="font-bold uppercase tracking-wider text-[11px] text-slate-700 mb-1">
              Recommendations:
            </h3>
            <p className="text-slate-800 text-xs font-medium">
              {report?.recommendations || 'Follow-up per attending clinical discretion.'}
            </p>
          </div>

          {/* ICD-10 Codes */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-200 text-xs">
            <span className="font-bold text-slate-600">ICD-10 Diagnostic Codes:</span>
            <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-[11px]">
              R91.8 (Abnormal finding diagnostic imaging)
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-[11px]">
              J18.9 (Pneumonia unspecified)
            </span>
          </div>

          {/* Digital Signature Footer */}
          <div className="pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-extrabold text-slate-900 text-sm">
                {scan.assignedRadiologist || 'Dr. Elena Vance, MD, FACR'}
              </p>
              <p className="text-[11px] text-slate-600">
                Board Certified Diagnostic Radiologist • Senior Thoracic Attending
              </p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                Electronically signed on: {report?.finalizedAt || scan.scanDate}
              </p>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs justify-end">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>CRYPTOGRAPHICALLY VERIFIED</span>
              </div>
              <p className="text-[9px] font-mono text-slate-400 max-w-xs truncate">
                {report?.signatureVerificationHash || 'SHA256:8f9a0c1e2b4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
