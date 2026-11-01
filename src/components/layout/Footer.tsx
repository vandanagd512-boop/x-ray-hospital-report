import React from 'react';
import { ShieldCheck, Activity, Lock, Cpu, Database, Server } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950/90 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand & Purpose */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">AuraRad AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Enterprise PACS & Real-Time Computer-Aided Diagnostic (CAD) Intelligence platform engineered for tertiary hospital networks, imaging centers, and emergency trauma suites.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>FHIR R4 & DICOM 3.0 Realtime Feed</span>
            </div>
          </div>

          {/* Clinical Capabilities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Clinical Modalities
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                <span className="text-brand-400">›</span> Digital Radiography (Chest & Ortho)
              </li>
              <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                <span className="text-brand-400">›</span> Helical Multidetector CT (PE & Trauma)
              </li>
              <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                <span className="text-brand-400">›</span> 3T Neuro & Musculoskeletal MRI
              </li>
              <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                <span className="text-brand-400">›</span> Color & Spectral Doppler Ultrasound
              </li>
              <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                <span className="text-brand-400">›</span> Lung-RADS & BI-RADS Structured CAD
              </li>
            </ul>
          </div>

          {/* Architecture & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Security & Regulatory
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                <span>HIPAA Title II Security Rule</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-brand-400" />
                <span>AES-256 GCM Rest & TLS 1.3 Transit</span>
              </li>
              <li className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-brand-400" />
                <span>FDA 510(k) Cleared Algorithms</span>
              </li>
              <li className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-brand-400" />
                <span>SOC 2 Type II Certified Cloud</span>
              </li>
              <li className="flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-brand-400" />
                <span>ISO 27001 & HL7 FHIR Interoperable</span>
              </li>
            </ul>
          </div>

          {/* PACS Nodes & Hospital Connectivity */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Hospital PACS Endpoints
            </h4>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-[11px] font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">AE TITLE:</span>
                <span className="text-brand-300 font-bold">AURARAD_SCP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">PORT:</span>
                <span className="text-slate-200">11112 (TLS DICOM)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">GPU NODE:</span>
                <span className="text-emerald-400">CLUST_TENSOR_08</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">AVG INFERENCE:</span>
                <span className="text-cyan-400">1.18 sec</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            © 2026 AuraRad Medical Technologies Inc. All rights reserved. Built for clinical decision support.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">HIPAA BAA Agreement</span>
            <span className="hover:text-white cursor-pointer transition-colors">DICOM Conformance Statement</span>
            <span className="hover:text-white cursor-pointer transition-colors">Radiology Support Desk</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
