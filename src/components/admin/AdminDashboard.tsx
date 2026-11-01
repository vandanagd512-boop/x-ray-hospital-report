import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_HOSPITALS, MOCK_USERS } from '../../data/mockData';
import { 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Database, 
  Users, 
  Lock, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Search, 
  Server,
  BarChart3,
  Settings
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { auditLogs, scans, currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'audit' | 'settings'>('overview');
  const [logFilter, setLogFilter] = useState('');

  // AI Configuration Settings
  const [sensitivityThreshold, setSensitivityThreshold] = useState(95);
  const [specificityThreshold, setSpecificityThreshold] = useState(92);
  const [statEscalationCutoff, setStatEscalationCutoff] = useState(90);
  const [aeTitle, setAeTitle] = useState('AURARAD_SCP');
  const [port, setPort] = useState(11112);

  const filteredLogs = auditLogs.filter(log =>
    log.actorName.toLowerCase().includes(logFilter.toLowerCase()) ||
    log.action.toLowerCase().includes(logFilter.toLowerCase()) ||
    log.resource.toLowerCase().includes(logFilter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>Enterprise PACS & AI Administration</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              SuperAdmin Console
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Alexander Cross • Health Informatics Director • HIPAA Compliance Node #1
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Analytics & KPIs
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'users'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Personnel
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'audit'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            HIPAA Audit Trail
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            System Tuning
          </button>
        </div>
      </div>

      {/* Tab: Overview & Analytics */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Executive Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <span>Total Scans Processed Today</span>
                <Activity className="w-4 h-4 text-brand-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">455</span>
                <span className="text-xs text-emerald-400 font-bold">+18% vs avg</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Across 3 hospital branches</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <span>AI Concordance Rate</span>
                <Cpu className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">98.4%</span>
                <span className="text-xs text-cyan-400 font-bold">Gold Standard</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Validated against 10k reads</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <span>Mean STAT Turnaround</span>
                <Activity className="w-4 h-4 text-rose-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">14.2 min</span>
                <span className="text-xs text-emerald-400 font-bold">-76% faster</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Baseline without AI was 68 min</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <span>HIPAA Security Status</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-400">100%</span>
                <span className="text-xs text-slate-300">Compliant</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Zero unauthorized access events</p>
            </div>
          </div>

          {/* Hospital Branch Network Performance */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Server className="w-4 h-4 text-amber-400" />
              <span>Connected Hospital Radiology Hubs</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MOCK_HOSPITALS.map(hosp => (
                <div
                  key={hosp.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs leading-tight">{hosp.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{hosp.city}</p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  <div className="pt-2 border-t border-slate-850 space-y-1.5 text-[11px] font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Studies Today:</span>
                      <span className="text-white font-bold">{hosp.activeStudies}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>AI Concordance:</span>
                      <span className="text-emerald-400 font-bold">{hosp.aiConcordanceRate}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Mean TAT:</span>
                      <span className="text-cyan-400 font-bold">{hosp.meanTatMinutes} min</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Critical Cases:</span>
                      <span className="text-rose-400 font-bold">{hosp.criticalCasesToday} STAT</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Personnel & Role Directory */}
      {activeTab === 'users' && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Credentialed Clinical & Technical Staff</h3>
            <span className="text-xs text-slate-400">RBAC Security Enforced</span>
          </div>

          <div className="divide-y divide-slate-800/60 text-xs">
            {Object.values(MOCK_USERS).map(u => (
              <div key={u.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{u.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-amber-300 border border-slate-700">
                        {u.role}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs mt-0.5">{u.title}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{u.email}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Active & Authenticated
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1 font-mono">
                    {u.credentials || 'Standard Verified User'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: HIPAA Audit Trail */}
      {activeTab === 'audit' && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl space-y-4">
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Immutable HIPAA Audit & Access Trail</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Every scan inspection, AI inference, and report signature is cryptographically logged.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search audit trail..."
                value={logFilter}
                onChange={e => setLogFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Timestamp</th>
                  <th className="py-2.5 px-4 font-semibold">Actor / Entity</th>
                  <th className="py-2.5 px-4 font-semibold">Role</th>
                  <th className="py-2.5 px-4 font-semibold">Action Triggered</th>
                  <th className="py-2.5 px-4 font-semibold">Target Resource</th>
                  <th className="py-2.5 px-4 font-semibold">IP / Node</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-4 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-2.5 px-4 text-white font-sans font-semibold whitespace-nowrap">{log.actorName}</td>
                    <td className="py-2.5 px-4 uppercase text-amber-400 text-[10px]">{log.actorRole}</td>
                    <td className="py-2.5 px-4 text-cyan-400 font-bold">{log.action}</td>
                    <td className="py-2.5 px-4 text-slate-300 max-w-xs truncate font-sans">{log.resource}</td>
                    <td className="py-2.5 px-4 text-slate-500 text-[10px] whitespace-nowrap">{log.ipAddress}</td>
                    <td className="py-2.5 px-4 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'SUCCESS'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: System & AI Tuning */}
      {activeTab === 'settings' && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-2xl space-y-6">
          <div>
            <h3 className="font-bold text-white text-base">AuraRad AI Sensitivity & PACS Network Calibration</h3>
            <p className="text-xs text-slate-400 mt-1">
              Adjust neural network operational points, ROC thresholds, and DICOM communication ports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
            {/* AI Thresholds */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-brand-400" />
                <span>Neural Detection Operating Curve</span>
              </h4>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Pneumothorax / Consolidation Sensitivity:</span>
                  <span className="font-mono font-bold text-brand-400">{sensitivityThreshold}%</span>
                </div>
                <input
                  type="range"
                  min={85}
                  max={99}
                  value={sensitivityThreshold}
                  onChange={e => setSensitivityThreshold(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Higher sensitivity flags subtle micro-nodules with lower false-negative rate.
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>STAT Triage Escalation Cutoff:</span>
                  <span className="font-mono font-bold text-rose-400">{statEscalationCutoff}%</span>
                </div>
                <input
                  type="range"
                  min={70}
                  max={98}
                  value={statEscalationCutoff}
                  onChange={e => setStatEscalationCutoff(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Cases exceeding this threshold automatically trigger audio chime & SMS alert to on-call radiologist.
                </p>
              </div>
            </div>

            {/* PACS AE Title & DICOM Endpoints */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>DICOM C-STORE Application Entity</span>
              </h4>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Application Entity (AE) Title:</label>
                <input
                  type="text"
                  value={aeTitle}
                  onChange={e => setAeTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">DICOM TLS Port:</label>
                <input
                  type="number"
                  value={port}
                  onChange={e => setPort(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={() => alert('PACS Configuration saved successfully!')}
                  className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
