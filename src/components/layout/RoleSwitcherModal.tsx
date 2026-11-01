import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { UserCheck, Stethoscope, Eye, ShieldCheck, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { currentRole, switchRole } = useAuth();

  if (!isOpen) return null;

  const roles: {
    id: UserRole;
    title: string;
    personName: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    border: string;
    features: string[];
  }[] = [
    {
      id: 'radiologist',
      title: 'Radiologist (Attending)',
      personName: 'Dr. Elena Vance, MD, FACR',
      subtitle: 'Chief Diagnostic Radiologist, Thoracic & Trauma',
      icon: <Eye className="w-6 h-6 text-brand-400" />,
      color: 'from-blue-500/20 to-cyan-500/10 text-brand-400',
      border: 'border-brand-500/30 hover:border-brand-400',
      features: ['Full PACS Diagnostic Canvas', 'AI Finding Heatmaps & Contours', 'Windowing (Lung/Bone/Brain)', 'Caliper Measurements', 'ACR Structured Report Sign-off']
    },
    {
      id: 'doctor',
      title: 'Referring Doctor',
      personName: 'Dr. Marcus Chen, MD',
      subtitle: 'Attending Pulmonologist & Critical Care',
      icon: <Stethoscope className="w-6 h-6 text-emerald-400" />,
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400',
      border: 'border-emerald-500/30 hover:border-emerald-400',
      features: ['Patient Cohort Tracking', 'Upload Scans & Order AI Pre-Read', 'STAT Prioritization', 'Review Finalized Reports', 'Consult Radiologist']
    },
    {
      id: 'patient',
      title: 'Patient Portal',
      personName: 'Sarah Jenkins',
      subtitle: 'Patient #PX-8942 • Thoracic Follow-up',
      icon: <UserCheck className="w-6 h-6 text-purple-400" />,
      color: 'from-purple-500/20 to-pink-500/10 text-purple-400',
      border: 'border-purple-500/30 hover:border-purple-400',
      features: ['Imaging History & Timeline', 'Patient-Friendly AI Explanations', 'Download Verified PDF Reports', 'Schedule Upcoming Imaging', 'Exam Prep Instructions']
    },
    {
      id: 'admin',
      title: 'Hospital Admin',
      personName: 'Alexander Cross',
      subtitle: 'Enterprise PACS & AI Systems Director',
      icon: <ShieldCheck className="w-6 h-6 text-amber-400" />,
      color: 'from-amber-500/20 to-orange-500/10 text-amber-400',
      border: 'border-amber-500/30 hover:border-amber-400',
      features: ['AI Accuracy & Concordance KPIs', 'Mean Turnaround Time (TAT)', 'Modality Volume Analytics', 'HIPAA Audit Trail Logs', 'PACS AE Title & AI Sensitivity Tuning']
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-brand-400 animate-pulse" />
              Switch Active Role Perspective
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Experience the entire hospital imaging workflow from every stakeholder's view.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 max-h-[75vh] overflow-y-auto">
          {roles.map(role => {
            const isSelected = currentRole === role.id;
            return (
              <div
                key={role.id}
                onClick={() => {
                  switchRole(role.id);
                  onClose();
                }}
                className={`group relative p-5 rounded-xl border cursor-pointer transition-all duration-200 bg-gradient-to-b ${
                  isSelected
                    ? `${role.border} bg-slate-800/90 shadow-glow-sm ring-1 ring-brand-400/50`
                    : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg bg-slate-800 border border-slate-700 ${role.color}`}>
                      {role.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-base">{role.title}</span>
                        {isSelected && (
                          <span className="px-2 py-0.5 text-[10px] font-semibold bg-brand-500/20 text-brand-400 border border-brand-500/30 rounded-full">
                            Active Role
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-300 mt-0.5">{role.personName}</p>
                      <p className="text-xs text-slate-400">{role.subtitle}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2">
                    Key Capabilities:
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {role.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="text-brand-400 text-xs">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <button
                    className={`w-full py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                      isSelected
                        ? 'bg-brand-500 text-white shadow-glow-sm'
                        : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700 group-hover:text-white'
                    }`}
                  >
                    {isSelected ? 'Currently Selected' : `Switch to ${role.title}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-xs text-slate-400">
          <span>Security Protocol: Role-Based Access Control (RBAC) active.</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
            Zero-Trust HIPAA Session
          </span>
        </div>
      </div>
    </div>
  );
};
