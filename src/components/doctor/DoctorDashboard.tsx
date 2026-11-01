import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ScanOrderModal } from './ScanOrderModal';
import { 
  Stethoscope, 
  UploadCloud, 
  Search, 
  FileText, 
  Eye, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  UserPlus, 
  Sparkles,
  PhoneCall,
  Printer
} from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const { scans, selectScan, openReportModal, currentUser } = useAuth();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const doctorScans = scans.filter(s =>
    s.patientName.toLowerCase().includes(search.toLowerCase()) ||
    s.accessionNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.studyDescription.toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount = scans.filter(s => s.status !== 'Finalized').length;
  const readyCount = scans.filter(s => s.status === 'Finalized').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header with Title and Order Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>Referring Physician Portal</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {currentUser.name}
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Department of Pulmonology & Critical Care • Inpatient & Outpatient Diagnostic Requisitions
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-xs shadow-glow-emerald hover:from-emerald-500 hover:to-teal-400 transition-all hover:scale-[1.02]"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Order Scan & Request AI Pre-Read</span>
          </button>
        </div>
      </div>

      {/* Physician KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <span>Awaiting Radiologist Final Sign</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{pendingCount}</span>
            <span className="text-xs text-amber-300">AI Pre-Screened</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Live tracking on emergency queue</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <span>Verified Reports Ready</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{readyCount}</span>
            <span className="text-xs text-emerald-300">Ready for Patient Discharge</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Directly viewable & printable</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <span>Radiology Reading Room</span>
            <PhoneCall className="w-4 h-4 text-brand-400" />
          </div>
          <div className="mt-3">
            <span className="text-xs font-bold text-white block">Dr. Elena Vance, MD (On-Duty)</span>
            <span className="text-[11px] text-slate-400 block mt-0.5 font-mono">Speed Dial: Ext. 4821</span>
          </div>
          <p className="text-[11px] text-brand-400 mt-1">Direct line for critical peer consult</p>
        </div>
      </div>

      {/* Patient Studies List */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/60">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by patient name or study..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>
          <div className="text-xs text-slate-400">
            Showing <span className="font-bold text-white">{doctorScans.length}</span> Active Patient Requisitions
          </div>
        </div>

        <div className="divide-y divide-slate-800/70">
          {doctorScans.map(scan => {
            const isFinal = scan.status === 'Finalized';

            return (
              <div
                key={scan.id}
                className="p-5 hover:bg-slate-800/40 transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
              >
                {/* Left: Patient & Study Meta */}
                <div className="flex items-start gap-4">
                  <img
                    src={scan.imageUrl}
                    alt={scan.studyDescription}
                    onClick={() => selectScan(scan.id)}
                    className="w-16 h-16 object-cover rounded-xl border border-slate-700 cursor-pointer hover:border-brand-400 transition-colors shadow-sm shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-sm hover:text-brand-300 cursor-pointer" onClick={() => selectScan(scan.id)}>
                        {scan.patientName}
                      </h3>
                      <span className="text-xs font-mono text-slate-400">({scan.patientAge}y/{scan.patientGender})</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        scan.priority === 'STAT'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {scan.priority}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-300 mt-1">
                      {scan.studyDescription}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-1 font-mono">
                      <span>ACC: {scan.accessionNumber}</span>
                      <span>•</span>
                      <span>{scan.scanDate}</span>
                    </div>

                    {/* AI Finding preview */}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="p-1 rounded bg-brand-500/10 text-brand-400">
                        <Sparkles className="w-3 h-3" />
                      </span>
                      <span className="text-xs text-slate-300">
                        {scan.aiSummary.substring(0, 95)}...
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Status Pill & Action Buttons */}
                <div className="flex items-center gap-3 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800">
                  <div className="text-right hidden sm:block mr-2">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                      isFinal
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {scan.status}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {isFinal ? 'Verified by Dr. Vance' : 'Queue Time: 8m'}
                    </p>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => selectScan(scan.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Inspect DICOM</span>
                  </button>

                  <button
                    onClick={() => openReportModal(scan)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-glow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{isFinal ? 'View Report' : 'Draft Report'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scan Order Modal */}
      <ScanOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </div>
  );
};
