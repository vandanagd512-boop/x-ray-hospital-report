import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Modality, ScanPriority } from '../../types';
import { 
  UploadCloud, 
  X, 
  FileImage, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ScanOrderModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addScan, selectScan } = useAuth();

  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<number>(45);
  const [patientGender, setPatientGender] = useState<'M' | 'F' | 'Other'>('F');
  const [modality, setModality] = useState<Modality>('X-Ray');
  const [studyDescription, setStudyDescription] = useState('Chest X-Ray PA & Lateral Projection');
  const [bodyPart, setBodyPart] = useState('Thorax / Lungs');
  const [priority, setPriority] = useState<ScanPriority>('STAT');
  const [clinicalIndication, setClinicalIndication] = useState('');
  const [selectedImage, setSelectedImage] = useState<string>('https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200');
  const [isUploading, setIsUploading] = useState(false);
  const [aiSimulationStep, setAiSimulationStep] = useState<string>('');

  if (!isOpen) return null;

  // Preset medical samples for quick testing
  const sampleScans = [
    {
      title: 'Chest Radiograph (Infiltrate)',
      modality: 'X-Ray' as Modality,
      study: 'Chest X-Ray PA Projection',
      part: 'Lungs / Thorax',
      url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200'
    },
    {
      title: 'Brain MRI (Neuro / Stroke)',
      modality: 'MRI' as Modality,
      study: 'Brain MRI Axial T2/FLAIR',
      part: 'Brain / Neuro',
      url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1200'
    },
    {
      title: 'Helical Thoracic CT',
      modality: 'CT' as Modality,
      study: 'Low-Dose Chest CT Screen',
      part: 'Thoracic Cavity',
      url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200'
    },
    {
      title: 'Vascular Ultrasound',
      modality: 'Ultrasound' as Modality,
      study: 'Carotid Duplex Doppler',
      part: 'Cervical Vasculature',
      url: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=1200'
    }
  ];

  const handleSelectPreset = (sample: typeof sampleScans[0]) => {
    setModality(sample.modality);
    setStudyDescription(sample.study);
    setBodyPart(sample.part);
    setSelectedImage(sample.url);
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSelectedImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    // Realistic AI Ingestion & Pre-screening simulation
    setAiSimulationStep('Parsing DICOM Metadata & Tags...');
    await new Promise(r => setTimeout(r, 600));

    setAiSimulationStep('De-identifying PHI & Routing to Tensor Cluster...');
    await new Promise(r => setTimeout(r, 700));

    setAiSimulationStep('Running Convolutional Neural CAD Detection...');
    await new Promise(r => setTimeout(r, 800));

    const newScan = addScan({
      patientName: patientName || 'Jonathan Pierce',
      patientAge,
      patientGender,
      modality,
      studyDescription,
      bodyPart,
      priority,
      clinicalIndication: clinicalIndication || 'Acute dyspnea and localized thoracic symptoms, rule out focal consolidation or pneumothorax.',
      imageUrl: selectedImage
    });

    setIsUploading(false);
    onClose();
    selectScan(newScan.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Order Scan & Ingest Imaging Study</h2>
              <p className="text-xs text-slate-400">
                Direct DICOM upload with automated AI CAD pre-screening and PACS routing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          
          {/* Preset Samples Selector */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Select Sample Clinical Modality or Upload DICOM:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {sampleScans.map((sample, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectPreset(sample)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                    selectedImage === sample.url
                      ? 'border-brand-400 bg-slate-800/90 shadow-glow-sm'
                      : 'border-slate-800 bg-slate-950 hover:bg-slate-800/50'
                  }`}
                >
                  <img
                    src={sample.url}
                    alt={sample.title}
                    className="w-full h-16 object-cover rounded-lg mb-1.5"
                  />
                  <p className="font-semibold text-white truncate text-[11px]">{sample.title}</p>
                  <p className="text-[10px] text-cyan-400 font-mono">{sample.modality}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Upload Dropzone */}
          <div className="relative border-2 border-dashed border-slate-700 hover:border-brand-500/50 rounded-xl p-4 text-center bg-slate-950/50 transition-colors">
            <input
              type="file"
              accept="image/*,.dcm"
              onChange={handleCustomFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center">
              <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
              <p className="font-semibold text-slate-200">
                Drag and drop your own scan image or <span className="text-brand-400">browse file</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Supports DICOM (.dcm), High-Res PNG, JPEG, TIFF (Automatic PHI scrub applied)
              </p>
            </div>
          </div>

          {/* Patient Demographics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Patient Full Name:
              </label>
              <input
                type="text"
                placeholder="e.g. Jonathan Pierce"
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Age:
              </label>
              <input
                type="number"
                value={patientAge}
                onChange={e => setPatientAge(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Gender:
              </label>
              <select
                value={patientGender}
                onChange={e => setPatientGender(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Modality & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Modality:
              </label>
              <select
                value={modality}
                onChange={e => setModality(e.target.value as Modality)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="X-Ray">Digital Radiography (X-Ray)</option>
                <option value="CT">Computed Tomography (CT)</option>
                <option value="MRI">Magnetic Resonance Imaging (MRI)</option>
                <option value="Ultrasound">Diagnostic Ultrasound</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Triage Urgency:
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as ScanPriority)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500 font-bold"
              >
                <option value="STAT">STAT (Critical &lt;15m read)</option>
                <option value="Urgent">Urgent (&lt;60m read)</option>
                <option value="Routine">Routine (&lt;24h)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Anatomical Region:
              </label>
              <input
                type="text"
                value={bodyPart}
                onChange={e => setBodyPart(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Clinical Indication */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Clinical Indication / Symptoms:
            </label>
            <textarea
              rows={2}
              placeholder="e.g. 5 days of worsening pleuritic chest pain, fever, hemoptysis..."
              value={clinicalIndication}
              onChange={e => setClinicalIndication(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Live AI Pre-Screening Callout */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-brand-950/40 via-cyan-950/20 to-slate-950 border border-brand-500/30 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white text-xs">
                Instant Automated Neural CAD Pipeline
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Upon submission, AuraRad will generate an immediate preliminary finding heatmap and highlight critical pathologies for the radiologist reading queue.
              </p>
            </div>
          </div>

          {/* Processing Indicator if active */}
          {isUploading && (
            <div className="p-4 rounded-xl bg-slate-950 border border-brand-500/50 flex items-center gap-3 animate-fadeIn">
              <Activity className="w-5 h-5 text-brand-400 animate-spin" />
              <div>
                <p className="font-semibold text-brand-300 text-xs">AI Inference in Progress</p>
                <p className="text-[11px] text-slate-400 font-mono">{aiSimulationStep}</p>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 text-white font-bold shadow-glow-sm hover:from-brand-500 hover:to-cyan-500 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              <span>{isUploading ? 'Ingesting Study...' : 'Submit & Ingest to PACS'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
