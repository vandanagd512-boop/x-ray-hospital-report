import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Activity, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  FileText, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Eye, 
  Lock, 
  TrendingUp, 
  Clock, 
  Star,
  Sliders,
  Flame,
  Check
} from 'lucide-react';

interface Props {
  onOpenUpload: () => void;
}

export const LandingPage: React.FC<Props> = ({ onOpenUpload }) => {
  const { setActiveTab, switchRole } = useAuth();

  // Mini-PACS Interactive Preview states
  const [previewAiOverlay, setPreviewAiOverlay] = useState(true);
  const [previewInvert, setPreviewInvert] = useState(false);
  const [previewModality, setPreviewModality] = useState<'xray' | 'ct' | 'mri' | 'us'>('xray');

  // ROI Calculator states
  const [monthlyVolume, setMonthlyVolume] = useState(2500);

  const modalitiesData = {
    xray: {
      title: 'Digital Radiography (CXR & Skeletal)',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200',
      tag: 'Tension Pneumothorax & Pneumonia CAD',
      detection: 'Right Lower Lobe Consolidation (96.4% Conf)',
      desc: 'Instant detection of lung consolidation, pleural effusions, pneumothorax, and cardiomegaly within 1.2 seconds of DICOM ingestion.'
    },
    ct: {
      title: 'Multidetector Helical CT',
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200',
      tag: 'Pulmonary Embolism & Lung-RADS 4A',
      detection: 'Solitary Nodule 11.4mm (Lung-RADS 4A)',
      desc: 'Sub-millimeter volumetric lung nodule tracking, automated volume doubling time calculation, and acute filling defect identification.'
    },
    mri: {
      title: 'High-Field 3T Neuro MRI',
      image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1200',
      tag: 'Acute MCA Stroke DWI-FLAIR Mismatch',
      detection: 'Left MCA Ischemic Infarct (97.8% Conf)',
      desc: 'Rapid identification of early cytotoxic edema, ischemic penumbra, and hemorrhage exclusion for immediate stroke code escalation.'
    },
    us: {
      title: 'Duplex Color & Spectral Ultrasound',
      image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=1200',
      tag: 'Carotid Stenosis & Hemodynamic Doppler',
      detection: 'Hemodynamic ICA Stenosis 68% (PSV 182 cm/s)',
      desc: 'Real-time vascular lumen narrowing quantification, plaque characterization, and spectral velocity ratio validation.'
    }
  };

  // Calculations for ROI
  const hoursSaved = Math.round(monthlyVolume * 0.18); // 11 mins saved per case
  const turnaroundBoost = 74; // % reduction in TAT
  const estCostSavings = (monthlyVolume * 14.5).toLocaleString();

  return (
    <div className="space-y-24 py-10 overflow-hidden">
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Value Prop */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-brand-500/30 text-xs font-semibold text-brand-300 shadow-glow-sm">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
              <span>Next-Gen Enterprise AI Radiology & PACS Workspace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              AI-Augmented Radiology with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-cyan-400 to-teal-300">Zero-Latency</span> Diagnostics.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Equip your radiologists and clinical teams with FDA-aligned computer-aided detection, real-time STAT triage prioritization, high-resolution DICOM canvas tools, and automated structured report authoring.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  switchRole('radiologist');
                  setActiveTab('radiologist');
                }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 text-white font-bold text-sm shadow-glow-md hover:from-brand-500 hover:to-cyan-400 transition-all hover:scale-[1.02]"
              >
                <span>Launch Radiologist PACS</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('regional')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-bold text-sm shadow-glow-emerald hover:from-emerald-500 hover:to-teal-500 transition-all hover:scale-[1.02]"
              >
                <span>Regional Voice AI (Telugu / Kannada / Hindi / Tamil)</span>
                <span className="text-base">🔊</span>
              </button>

              <button
                onClick={onOpenUpload}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Upload Scan for AI CAD</span>
              </button>
            </div>

            {/* Key Trust Signals */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <p className="text-2xl font-bold text-white font-sans">98.4%</p>
                <p className="text-slate-400 mt-0.5">CAD Sensitivity</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-400 font-sans">14.2 min</p>
                <p className="text-slate-400 mt-0.5">Mean STAT TAT</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-cyan-400 font-sans">100%</p>
                <p className="text-slate-400 mt-0.5">HIPAA Compliant</p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Mini-PACS Preview Widget */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-4 overflow-hidden group">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="font-bold text-white font-mono">LIVE PACS SIMULATION</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPreviewAiOverlay(!previewAiOverlay)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      previewAiOverlay ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    AI Heatmap: {previewAiOverlay ? 'ON' : 'OFF'}
                  </button>
                  <button
                    onClick={() => setPreviewInvert(!previewInvert)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      previewInvert ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Invert
                  </button>
                </div>
              </div>

              {/* Interactive Image Frame */}
              <div className="relative my-3 rounded-xl overflow-hidden bg-black aspect-[4/3] flex items-center justify-center">
                <img
                  src={modalitiesData[previewModality].image}
                  alt="Medical Scan Preview"
                  className="w-full h-full object-contain filter"
                  style={{ filter: previewInvert ? 'invert(1)' : 'none' }}
                />

                {/* AI Heatmap Overlay */}
                {previewAiOverlay && (
                  <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-70">
                    <svg className="w-full h-full">
                      <radialGradient id="heroAiGrad" cx="62%" cy="60%" r="28%">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                        <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                      </radialGradient>
                      <rect width="100%" height="100%" fill="url(#heroAiGrad)" />
                    </svg>
                  </div>
                )}

                {/* Bounding box detection */}
                {previewAiOverlay && (
                  <div className="absolute top-[48%] left-[50%] w-[32%] h-[30%] border-2 border-rose-500 bg-rose-500/20 rounded">
                    <div className="absolute -top-6 left-0 px-1.5 py-0.5 rounded bg-slate-950 text-white text-[10px] font-mono font-bold border border-rose-500 whitespace-nowrap shadow-md">
                      {modalitiesData[previewModality].detection}
                    </div>
                  </div>
                )}

                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-cyan-300 font-mono text-[10px] border border-slate-700">
                  {modalitiesData[previewModality].tag}
                </div>
              </div>

              {/* Modality Selector Buttons */}
              <div className="grid grid-cols-4 gap-1.5 pt-1 text-xs">
                {(['xray', 'ct', 'mri', 'us'] as (keyof typeof modalitiesData)[]).map(mod => (
                  <button
                    key={mod}
                    onClick={() => setPreviewModality(mod)}
                    className={`py-1.5 rounded-lg text-center font-bold uppercase text-[11px] transition-all ${
                      previewModality === mod
                        ? 'bg-brand-500 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mod}
                  </button>
                ))}
              </div>

              <div className="mt-3 text-center">
                <button
                  onClick={() => {
                    switchRole('radiologist');
                    setActiveTab('radiologist');
                  }}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-brand-300 font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Full Viewport with Measurement Tools</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance & Accreditations Banner */}
      <section className="border-y border-slate-800/80 bg-slate-900/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
            Enterprise Medical Compliance & Standard PACS Interoperability
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-400 font-semibold text-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>HIPAA Title II Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-brand-400" />
              <span>FDA 510(k) Cleared Algorithms</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>DICOM 3.0 & C-STORE Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              <span>HL7 FHIR R4 Integration</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-400" />
              <span>SOC 2 Type II Audited</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Clinical Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 font-mono">
            Seamless Hospital Integration
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-1">
            End-to-End Clinical Diagnostic Workflow
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Engineered to streamline throughput from image capture to verified report delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Ingestion & PHI Scrub',
              desc: 'Seamless DICOM router receives scans from CT/MRI/X-Ray scanners, verifies checksums, and scrubs patient PHI for compliant GPU inference.',
              icon: <Layers className="w-6 h-6 text-brand-400" />
            },
            {
              step: '02',
              title: 'Deep AI CAD Triage',
              desc: 'Multi-layer CNN ensemble scans for life-threatening conditions (PE, Stroke, Pneumothorax) and escalates STAT cases to the top of the worklist.',
              icon: <Zap className="w-6 h-6 text-cyan-400" />
            },
            {
              step: '03',
              title: 'Radiologist Review',
              desc: 'Attending radiologist uses high-precision windowing, interactive calipers, prior study sync, and AI heatmap layers to confirm findings.',
              icon: <Eye className="w-6 h-6 text-purple-400" />
            },
            {
              step: '04',
              title: 'EHR Sync & PDF Export',
              desc: 'Automated 1-click structured reporting generates ACR-compliant impressions, ICD-10 codes, cryptographic signature, and instant EHR sync.',
              icon: <FileText className="w-6 h-6 text-emerald-400" />
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                  {item.icon}
                </div>
                <span className="text-3xl font-extrabold text-slate-800 group-hover:text-slate-700 transition-colors font-mono">
                  {item.step}
                </span>
              </div>
              <h3 className="font-bold text-white text-base mt-2">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Hospital ROI Calculator */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Interactive Value & Efficiency Model
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Calculate Your Hospital's Operational ROI
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Slide to your facility's monthly imaging volume to see projected turnaround time reductions and radiologist hours saved.
            </p>
          </div>

          {/* Slider */}
          <div className="space-y-3 max-w-xl mx-auto">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-300">
              <span>Monthly Imaging Studies:</span>
              <span className="text-xl font-bold font-mono text-brand-400">
                {monthlyVolume.toLocaleString()} scans
              </span>
            </div>
            <input
              type="range"
              min={500}
              max={15000}
              step={250}
              value={monthlyVolume}
              onChange={e => setMonthlyVolume(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>500 (Community Clinic)</span>
              <span>7,500 (Regional Hospital)</span>
              <span>15,000+ (Academic Medical Center)</span>
            </div>
          </div>

          {/* Calculated Output Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-850 text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Radiologist Hours Saved
              </span>
              <p className="text-3xl font-extrabold text-brand-400 mt-2 font-mono">
                {hoursSaved} hrs
              </p>
              <p className="text-[11px] text-slate-500 mt-1">~{Math.round(hoursSaved / 8)} full diagnostic shifts/mo</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-850 text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Turnaround Time (TAT) Acceleration
              </span>
              <p className="text-3xl font-extrabold text-emerald-400 mt-2 font-mono">
                -{turnaroundBoost}%
              </p>
              <p className="text-[11px] text-slate-500 mt-1">14 min average vs 68 min baseline</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-850 text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Annual Productivity Value
              </span>
              <p className="text-3xl font-extrabold text-cyan-400 mt-2 font-mono">
                ${estCostSavings}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Based on ACR benchmark hourly compensation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Explorers Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-900/60 via-slate-900 to-cyan-950/60 border border-brand-500/30 text-center space-y-6">
          <h2 className="text-3xl font-extrabold text-white">
            Ready to Experience AuraRad in Action?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Switch between Radiologist, Doctor, Patient, and Admin modes with 1 click to test the full lifecycle of diagnostic imaging.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                switchRole('radiologist');
                setActiveTab('radiologist');
              }}
              className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-xs shadow-glow-sm transition-all"
            >
              Enter Radiologist Worklist
            </button>
            <button
              onClick={() => {
                switchRole('doctor');
                setActiveTab('doctor');
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all"
            >
              Enter Doctor Portal
            </button>
            <button
              onClick={() => {
                switchRole('patient');
                setActiveTab('patient');
              }}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all"
            >
              Enter Patient Portal
            </button>
            <button
              onClick={() => {
                switchRole('admin');
                setActiveTab('admin');
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all"
            >
              Enter Admin Console
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
