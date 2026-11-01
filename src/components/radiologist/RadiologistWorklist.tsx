import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Modality, ScanPriority, ScanStatus, MedicalScan } from '../../types';
import { 
  Search, 
  Filter, 
  Eye, 
  FileText, 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  ChevronRight,
  SlidersHorizontal,
  Flame
} from 'lucide-react';

interface Props {
  onOpenViewer: (scanId: string) => void;
}

export const RadiologistWorklist: React.FC<Props> = ({ onOpenViewer }) => {
  const { scans, selectScan, openReportModal } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModality, setSelectedModality] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Filter logic
  const filteredScans = scans.filter(scan => {
    const matchesSearch = 
      scan.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.accessionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.studyDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.clinicalIndication.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesModality = selectedModality === 'All' || scan.modality === selectedModality;
    const matchesPriority = selectedPriority === 'All' || scan.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'All' || scan.status === selectedStatus;

    return matchesSearch && matchesModality && matchesPriority && matchesStatus;
  });

  const statCount = scans.filter(s => s.priority === 'STAT' && s.status !== 'Finalized').length;
  const urgentCount = scans.filter(s => s.priority === 'Urgent' && s.status !== 'Finalized').length;
  const finalizedCount = scans.filter(s => s.status === 'Finalized').length;

  return (
    <div className="space-y-6">
      
      {/* Top Triage Metrics Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* STAT Alert Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              STAT Emergency Queue
            </span>
            <span className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{statCount}</span>
            <span className="text-xs text-rose-300 font-medium">Studies requiring &lt;15m read</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Automated Stroke, PE & Pneumothorax Triage
          </div>
        </div>

        {/* Urgent Studies Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Urgent Inpatients
            </span>
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{urgentCount}</span>
            <span className="text-xs text-amber-300 font-medium">Under 60m SLA</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Target TAT adherence: 99.1%
          </div>
        </div>

        {/* AI CAD Concordance Rate */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-950/40 via-slate-900 to-slate-900 border border-brand-500/30 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AI Concordance
            </span>
            <span className="p-2 rounded-lg bg-brand-500/10 text-brand-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">98.4%</span>
            <span className="text-xs text-brand-300 font-medium">+1.4% vs benchmark</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Sensitivity: 99.2% • Specificity: 97.6%
          </div>
        </div>

        {/* Completed Today */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Signed & Finalized
            </span>
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{finalizedCount}</span>
            <span className="text-xs text-emerald-300 font-medium">EHR Synced</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Average read time: 4.8 min/case
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient, accession, MRN, pathology..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Modality Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {['All', 'X-Ray', 'CT', 'MRI', 'Ultrasound'].map(mod => (
              <button
                key={mod}
                onClick={() => setSelectedModality(mod)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedModality === mod
                    ? 'bg-brand-500 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mod}
              </button>
            ))}
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {['All', 'STAT', 'Urgent', 'Routine'].map(prio => (
              <button
                key={prio}
                onClick={() => setSelectedPriority(prio)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedPriority === prio
                    ? 'bg-slate-700 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {prio}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main PACS Worklist Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            {/* Table Header */}
            <thead className="bg-slate-950/90 text-slate-400 uppercase tracking-wider text-[11px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Priority</th>
                <th className="py-3.5 px-4 font-semibold">Patient & Demographics</th>
                <th className="py-3.5 px-4 font-semibold">Accession & Modality</th>
                <th className="py-3.5 px-4 font-semibold">Study Description</th>
                <th className="py-3.5 px-4 font-semibold">AI Neural Pre-Read</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredScans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No studies match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredScans.map(scan => {
                  const topFinding = scan.aiFindings[0];

                  return (
                    <tr
                      key={scan.id}
                      onClick={() => onOpenViewer(scan.id)}
                      className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
                    >
                      {/* Priority Tag */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          scan.priority === 'STAT'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                            : scan.priority === 'Urgent'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        }`}>
                          {scan.priority === 'STAT' && <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />}
                          {scan.priority}
                        </span>
                      </td>

                      {/* Patient Info */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-white group-hover:text-brand-300 transition-colors">
                          {scan.patientName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {scan.mrn} • {scan.patientAge}y/{scan.patientGender}
                        </div>
                      </td>

                      {/* Accession & Modality */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                        <div className="text-slate-300 font-medium">{scan.accessionNumber}</div>
                        <div className="mt-0.5">
                          <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 text-cyan-400 border border-slate-700">
                            {scan.modality}
                          </span>
                        </div>
                      </td>

                      {/* Study Description & Time */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-200 font-medium max-w-xs truncate">
                          {scan.studyDescription}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{scan.scanDate}</span>
                        </div>
                      </td>

                      {/* AI Neural Findings Badge */}
                      <td className="py-3.5 px-4">
                        {topFinding ? (
                          <div className="flex items-center gap-2 max-w-sm">
                            <span className={`p-1 rounded shrink-0 ${
                              topFinding.severity === 'critical'
                                ? 'bg-rose-500/20 text-rose-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              <Sparkles className="w-3.5 h-3.5" />
                            </span>
                            <div className="truncate">
                              <span className="font-semibold text-slate-200">{topFinding.title}</span>
                              <span className="ml-1.5 text-[10px] font-mono text-cyan-400 font-bold">
                                {topFinding.confidence.toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Pending AI Inference</span>
                        )}
                      </td>

                      {/* Scan Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          scan.status === 'Finalized'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : scan.status === 'In Review'
                            ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {scan.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => onOpenViewer(scan.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white transition-all shadow-sm"
                            title="Launch Diagnostic Canvas"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openReportModal(scan)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition-all shadow-sm"
                            title="View / Print Hospital Report"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
