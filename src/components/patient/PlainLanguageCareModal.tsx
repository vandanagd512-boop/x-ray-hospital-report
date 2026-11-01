import React, { useState } from 'react';
import { MedicalScan } from '../../types';
import { 
  Heart, 
  HelpCircle, 
  BookOpen, 
  Pill, 
  AlertOctagon, 
  Wrench, 
  Activity, 
  CheckCircle2, 
  X, 
  Printer, 
  Sparkles, 
  ShieldAlert, 
  Info, 
  ChevronRight,
  ClipboardList
} from 'lucide-react';

interface Props {
  scan: MedicalScan;
  isOpen: boolean;
  onClose: () => void;
}

export const PlainLanguageCareModal: React.FC<Props> = ({ scan, isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'jargon' | 'meds' | 'warnings' | 'questions'>('overview');

  if (!isOpen) return null;

  const plan = scan.carePlan;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-brand-500/20 to-cyan-500/20 border border-emerald-500/40 text-emerald-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  Plain-Language Diagnostic & Care Guide
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Engineering & Layman Breakdown
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Demystifying medical jargon into everyday terms with clinical medication pathways
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-2 px-6 py-2.5 border-b border-slate-800 bg-slate-950/50 text-xs overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveSection('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all ${
              activeSection === 'overview'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Diagnosis & Analogy</span>
          </button>

          <button
            onClick={() => setActiveSection('jargon')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all ${
              activeSection === 'jargon'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Jargon Translator</span>
          </button>

          <button
            onClick={() => setActiveSection('meds')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all ${
              activeSection === 'meds'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Medications & Dosages</span>
          </button>

          <button
            onClick={() => setActiveSection('warnings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all ${
              activeSection === 'warnings'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Emergency Red Flags</span>
          </button>

          <button
            onClick={() => setActiveSection('questions')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all ${
              activeSection === 'questions'
                ? 'bg-purple-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Questions for Your Doctor</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300">
          
          {/* Medical Disclaimer Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3 text-amber-200">
            <Info className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
            <div className="text-[11px] leading-relaxed">
              <strong className="font-bold text-amber-300 block">Medical Safety & Educational Notice:</strong>
              This plain-language summary and medication guide is designed for educational clarity and patient comprehension. All prescription decisions, dosages, and treatment plans must be validated and prescribed by a licensed physician or attending healthcare provider based on your full physical examination and medical history.
            </div>
          </div>

          {/* Section: Overview & Engineering Analogy */}
          {activeSection === 'overview' && plan && (
            <div className="space-y-5">
              {/* Core Diagnosis Card */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 font-mono">
                  Primary Finding
                </span>
                <h3 className="text-xl font-bold text-white">
                  {plan.summaryTitle}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {plan.whatIsHappening}
                </p>
              </div>

              {/* Engineering Analogy Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/30 via-slate-950 to-slate-950 border border-cyan-500/30 space-y-3">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                  <Wrench className="w-4 h-4 text-cyan-400" />
                  <span>The Engineering Analogy (How to visualize this):</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  {plan.engineeringAnalogy}
                </p>
              </div>

              {/* Home Care & Recovery Rules */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Actionable Home Recovery Plan:</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {plan.homeCarePlan.map((step, idx) => (
                    <li key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-xs text-slate-300">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Section: Jargon Translator */}
          {activeSection === 'jargon' && plan && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h3 className="text-sm font-bold text-white">Radiology Jargon Decoded</h3>
                  <p className="text-xs text-slate-400">
                    What those complex words on the official report actually mean in standard language
                  </p>
                </div>
                <span className="text-xs font-mono text-cyan-400">
                  {plan.jargonGlossary.length} Terms Explained
                </span>
              </div>

              <div className="space-y-3">
                {plan.jargonGlossary.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-brand-300 font-mono">
                        "{item.medicalTerm}"
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.urgency === 'High'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        Significance: {item.urgency}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                      <p className="text-slate-200 text-xs">
                        <strong className="text-white">Plain English:</strong> {item.simpleExplanation}
                      </p>
                      <p className="text-slate-400 text-[11px] pt-1 border-t border-slate-800/80">
                        <strong className="text-cyan-400 font-mono">Engineering Analogy:</strong> {item.engineeringAnalogy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Suggested Medications */}
          {activeSection === 'meds' && plan && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Evidence-Based Clinical Medication Protocol
                  </h3>
                  <p className="text-xs text-slate-400">
                    Standard pharmacological regimens typically prescribed by pulmonologists for this finding
                  </p>
                </div>
                <span className="text-xs font-mono text-emerald-400">
                  Standard of Care
                </span>
              </div>

              <div className="space-y-4">
                {plan.suggestedMedications.map((med, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono">
                          {med.category}
                        </span>
                        <h4 className="text-base font-bold text-white mt-0.5">
                          {med.name}
                        </h4>
                        <span className="text-xs text-slate-400 font-medium">
                          Common Brands: {med.commonExamples}
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold sm:text-right">
                        <span>Standard Dose:</span>
                        <span className="block text-white text-[11px]">{med.typicalDose}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <strong className="text-slate-300">How it works:</strong>
                        <p className="text-slate-400 mt-0.5">{med.purpose}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                        <div>
                          <strong className="text-brand-300">Administration Guidelines:</strong>{' '}
                          <span className="text-slate-300">{med.instructions}</span>
                        </div>
                        <div className="text-amber-300">
                          <strong>Precautions & Allergies:</strong>{' '}
                          <span>{med.cautionNotes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Emergency Red Flags */}
          {activeSection === 'warnings' && plan && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-rose-400 text-sm">
                  <AlertOctagon className="w-5 h-5 text-rose-500 animate-ping" />
                  <span>When to Seek Immediate Emergency Room (ER) Care:</span>
                </div>
                <p className="text-xs text-rose-200">
                  If you or the patient experience any of the following symptoms, do not wait for a routine clinic visit. Go to the nearest emergency department or dial emergency services (911) immediately:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {plan.warningSignsEmergency.map((sign, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 flex items-start gap-3"
                  >
                    <span className="p-1 rounded-full bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
                      ⚠️
                    </span>
                    <span className="text-xs font-semibold text-slate-200 leading-snug">
                      {sign}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Questions for Doctor */}
          {activeSection === 'questions' && plan && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Physician Consultation Preparation Sheet
                </h3>
                <p className="text-xs text-slate-400">
                  Print or take these exact questions with you to your appointment with Dr. Chen or your primary care physician:
                </p>
              </div>

              <div className="space-y-2.5">
                {plan.questionsForDoctor.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3 hover:border-purple-500/40 transition-colors"
                  >
                    <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold font-mono text-xs shrink-0">
                      Q{idx + 1}
                    </span>
                    <span className="text-xs font-medium text-slate-200 leading-relaxed">
                      {q}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            Study Ref: <span className="font-mono text-slate-200">{scan.accessionNumber}</span> ({scan.patientName})
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Guide</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
