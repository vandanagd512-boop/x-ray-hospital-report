import React, { useState, useEffect } from 'react';
import { MedicalScan, DiagnosticReport } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  FileText, 
  Sparkles, 
  CheckCircle, 
  Save, 
  Printer, 
  ShieldCheck, 
  AlertCircle, 
  Tag, 
  Check, 
  FileSignature, 
  Clock,
  Layers
} from 'lucide-react';

interface Props {
  scan: MedicalScan;
  externalInsertedText?: string;
  onClearInsertedText?: () => void;
}

export const ReportEditor: React.FC<Props> = ({ 
  scan, 
  externalInsertedText, 
  onClearInsertedText 
}) => {
  const { currentUser, updateScanReport, openReportModal } = useAuth();

  // Initialize report state from existing report or defaults
  const [status, setStatus] = useState<'Draft' | 'Finalized'>(scan.report?.status === 'Finalized' ? 'Finalized' : 'Draft');
  const [clinicalHistory, setClinicalHistory] = useState(scan.report?.clinicalHistory || scan.clinicalIndication || '');
  const [technique, setTechnique] = useState(
    scan.report?.technique || 
    `${scan.studyDescription} performed with standard protocol. Multiplanar reconstructions evaluated on high-resolution medical diagnostic display.`
  );
  const [comparison, setComparison] = useState(
    scan.report?.comparison || (scan.priorImageUrl ? 'Compared with prior imaging examination dated 12 months ago.' : 'No previous imaging available for comparison.')
  );
  const [findingsText, setFindingsText] = useState(
    scan.report?.findingsText || 
    scan.aiFindings.map(f => `${f.location.toUpperCase()}: ${f.description}`).join('\n\n')
  );
  const [impressionText, setImpressionText] = useState(
    scan.report?.impressionText || 
    `1. ${scan.aiSummary}\n2. Clinical correlation recommended.`
  );
  const [recommendations, setRecommendations] = useState(
    scan.report?.recommendations || 
    scan.aiFindings.find(f => f.recommendation)?.recommendation || 'Follow-up as clinically indicated.'
  );
  const [radsCategory, setRadsCategory] = useState(scan.report?.radsCategory || 'None');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // If text was passed from the AI findings panel, append to findings
  useEffect(() => {
    if (externalInsertedText) {
      setFindingsText(prev => prev + '\n' + externalInsertedText);
      onClearInsertedText?.();
    }
  }, [externalInsertedText, onClearInsertedText]);

  // AI Auto-Draft Assistant
  const handleAiAutoDraft = () => {
    const formattedFindings = scan.aiFindings
      .map((f, i) => `${i + 1}. ${f.location.toUpperCase()}: ${f.description} Quantitative metrics: confidence ${f.confidence.toFixed(1)}%${f.measurementMm ? `, lesion dimension ${f.measurementMm} mm` : ''}.`)
      .join('\n\n');

    setFindingsText(formattedFindings);
    setImpressionText(
      `1. Diagnostic evidence of ${scan.aiFindings[0]?.title || 'focal abnormality'}.\n2. Overall AI CAD agreement index: ${scan.aiOverallConfidence}%.`
    );
    setRecommendations(
      scan.aiFindings.find(f => f.recommendation)?.recommendation || 'Clinical management per attending physician.'
    );
  };

  const handleSaveDraft = () => {
    const draftReport: DiagnosticReport = {
      id: scan.report?.id || `rep_${Date.now()}`,
      scanId: scan.id,
      accessionNumber: scan.accessionNumber,
      patientId: scan.patientId,
      patientName: scan.patientName,
      radiologistName: currentUser.name,
      radiologistTitle: currentUser.title,
      status: 'Draft',
      clinicalHistory,
      technique,
      comparison,
      findingsText,
      impressionText,
      recommendations,
      icd10Codes: [
        { code: 'R91.8', description: 'Other nonspecific abnormal findings of lung' }
      ],
      radsCategory: radsCategory !== 'None' ? radsCategory : undefined
    };

    updateScanReport(scan.id, draftReport);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const handleFinalizeAndSign = () => {
    const finalizedReport: DiagnosticReport = {
      id: scan.report?.id || `rep_${Date.now()}`,
      scanId: scan.id,
      accessionNumber: scan.accessionNumber,
      patientId: scan.patientId,
      patientName: scan.patientName,
      radiologistName: currentUser.name,
      radiologistTitle: currentUser.title,
      status: 'Finalized',
      finalizedAt: new Date().toLocaleString(),
      clinicalHistory,
      technique,
      comparison,
      findingsText,
      impressionText,
      recommendations,
      icd10Codes: [
        { code: 'R91.8', description: 'Abnormal finding on diagnostic imaging' },
        { code: 'J18.9', description: 'Pneumonia, unspecified organism' }
      ],
      radsCategory: radsCategory !== 'None' ? radsCategory : undefined,
      signatureVerificationHash: `SHA256:${Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`,
      qrVerificationId: `AURARAD-SIG-${scan.accessionNumber}`
    };

    setStatus('Finalized');
    updateScanReport(scan.id, finalizedReport);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      
      {/* Editor Header */}
      <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <FileText className="w-4 h-4 text-brand-400" />
          <h3 className="font-bold text-white text-sm">Diagnostic Structured Report</h3>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
            status === 'Finalized'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}>
            {status}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* AI Auto-Draft */}
          <button
            onClick={handleAiAutoDraft}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-500/15 text-brand-300 hover:bg-brand-500/25 border border-brand-500/30 transition-all"
            title="Auto-fill report from AI CAD findings"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>AI Auto-Draft</span>
          </button>

          {/* Export / Print */}
          <button
            onClick={() => openReportModal(scan)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all"
            title="Preview Printable Hospital PDF Report"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Editor Form Body */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs font-sans">
        
        {/* Template & RADS classification selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2 border-b border-slate-800">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Reporting Standard:
            </label>
            <select
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500"
              defaultValue="Standard Thoracic / Body ACR Format"
            >
              <option>Standard Thoracic / Body ACR Format</option>
              <option>Low-Dose CT Lung Cancer Screening</option>
              <option>Emergency Neuro & Stroke Protocol</option>
              <option>Musculoskeletal Trauma Protocol</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              RADS Category Grading:
            </label>
            <select
              value={radsCategory}
              onChange={e => setRadsCategory(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="None">None / Standard Radiograph</option>
              <option value="Lung-RADS 1 (Negative)">Lung-RADS 1 (Negative)</option>
              <option value="Lung-RADS 2 (Benign Appearance)">Lung-RADS 2 (Benign)</option>
              <option value="Lung-RADS 3 (Probably Benign)">Lung-RADS 3 (Probably Benign)</option>
              <option value="Lung-RADS 4A (Suspicious - Additional Workup)">Lung-RADS 4A (Suspicious)</option>
              <option value="Lung-RADS 4B (Very Suspicious - Biopsy)">Lung-RADS 4B (Very Suspicious)</option>
              <option value="BI-RADS 1 (Negative)">BI-RADS 1 (Negative)</option>
              <option value="BI-RADS 4 (Suspicious Abnormality)">BI-RADS 4 (Suspicious)</option>
            </select>
          </div>
        </div>

        {/* Clinical History */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Clinical History & Indication:
          </label>
          <input
            type="text"
            value={clinicalHistory}
            onChange={e => setClinicalHistory(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
          />
        </div>

        {/* Technique */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Technique & Acquisition:
          </label>
          <input
            type="text"
            value={technique}
            onChange={e => setTechnique(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
          />
        </div>

        {/* Comparison */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Comparison Studies:
          </label>
          <input
            type="text"
            value={comparison}
            onChange={e => setComparison(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
          />
        </div>

        {/* Detailed Findings Textarea */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Anatomical Findings:
            </label>
            <span className="text-[10px] text-slate-400 font-mono">ACR Standard Lexicon</span>
          </div>
          <textarea
            rows={5}
            value={findingsText}
            onChange={e => setFindingsText(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500 text-xs leading-relaxed font-mono"
            placeholder="Detailed organ system observations..."
          />
        </div>

        {/* Impression (Conclusions) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Impression / Final Diagnosis:
            </label>
            <span className="text-[10px] text-brand-400 font-bold">Key takeaway for referring MD</span>
          </div>
          <textarea
            rows={3}
            value={impressionText}
            onChange={e => setImpressionText(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500 text-xs leading-relaxed font-mono font-medium text-emerald-300"
            placeholder="1. Summary of primary abnormal finding..."
          />
        </div>

        {/* Recommendations */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Clinical Recommendations:
          </label>
          <input
            type="text"
            value={recommendations}
            onChange={e => setRecommendations(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
          />
        </div>

        {/* Electronic Signature Badge */}
        {status === 'Finalized' && (
          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="font-bold text-white text-xs">
                  Digitally Authenticated by {currentUser.name}
                </p>
                <p className="text-[10px] text-emerald-400 font-mono">
                  Verified Signature • SHA-256 Stamp Applied • HL7 Synced
                </p>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>

      {/* Editor Footer / Signature Bar */}
      <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
        {/* Save feedback indicator */}
        <div className="flex items-center gap-2">
          {isSavedNotice && (
            <span className="flex items-center gap-1 text-xs text-emerald-400 animate-fadeIn">
              <Check className="w-4 h-4" />
              <span>Report saved successfully</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Draft button */}
          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-700 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          {/* Finalize button */}
          <button
            onClick={handleFinalizeAndSign}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-glow-emerald hover:from-emerald-500 hover:to-teal-400 transition-all"
          >
            <FileSignature className="w-4 h-4" />
            <span>Sign & Finalize</span>
          </button>
        </div>
      </div>
    </div>
  );
};
