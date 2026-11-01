import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { RoleSwitcherModal } from './RoleSwitcherModal';
import { 
  Activity, 
  Sun, 
  Moon, 
  Bell, 
  ChevronDown, 
  Shield, 
  UploadCloud, 
  Layers, 
  FileText, 
  Settings, 
  UserCheck, 
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Languages
} from 'lucide-react';

interface Props {
  onOpenUpload: () => void;
}

export const Navbar: React.FC<Props> = ({ onOpenUpload }) => {
  const { 
    currentUser, 
    currentRole, 
    activeTab, 
    setActiveTab, 
    scans, 
    notifications, 
    markNotificationRead 
  } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Count STAT scans
  const statCount = scans.filter(s => s.priority === 'STAT' && s.status !== 'Finalized').length;
  const unreadNotifs = notifications.filter(n => !n.read).length;

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo & System Status */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('landing')}
              className="flex items-center gap-2.5 group focus:outline-none text-left"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 via-brand-500 to-cyan-400 p-0.5 shadow-glow-sm group-hover:shadow-glow-md transition-all">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Activity className="w-5 h-5 text-brand-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold tracking-tight text-white font-sans">AuraRad</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-400 border border-brand-500/30 rounded">
                    AI
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>PACS v4.2 • HIPAA</span>
                </div>
              </div>
            </button>

            {/* Navigation Tabs */}
            <nav className="hidden lg:flex items-center space-x-1 pl-4 border-l border-slate-800">
              <button
                onClick={() => setActiveTab('landing')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'landing'
                    ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Overview
              </button>

              <button
                onClick={() => setActiveTab('radiologist')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'radiologist'
                    ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>Radiologist PACS</span>
                {statCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white animate-pulse">
                    {statCount} STAT
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('viewer')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                  activeTab === 'viewer'
                    ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Diagnostic Viewer</span>
              </button>

              <button
                onClick={() => setActiveTab('doctor')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'doctor'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Doctor Portal
              </button>

              <button
                onClick={() => setActiveTab('patient')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'patient'
                    ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Patient Portal
              </button>

              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'admin'
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Admin & Audit
              </button>

              {/* Regional Indian Languages Voice Assistant */}
              <button
                onClick={() => setActiveTab('regional')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm ${
                  activeTab === 'regional'
                    ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald font-black scale-105'
                    : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-500/40'
                }`}
              >
                <Languages className="w-3.5 h-3.5 text-emerald-400" />
                <span>Regional Voice AI (గ్రామీణ)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </button>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Upload Button */}
            <button
              onClick={onOpenUpload}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-brand-600 to-cyan-600 text-white shadow-glow-sm hover:from-brand-500 hover:to-cyan-500 transition-all hover:scale-[1.02]"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Scan</span>
            </button>

            {/* Notification Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-950 animate-pulse" />
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="font-semibold text-sm text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-brand-400" />
                      Clinical & AI Event Stream
                    </span>
                    <span className="text-xs text-slate-400">{unreadNotifs} new</span>
                  </div>
                  <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto mt-2">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`py-2.5 px-2 rounded-lg cursor-pointer transition-colors ${
                          n.read ? 'opacity-60 hover:bg-slate-800/40' : 'bg-slate-800/60 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {n.type === 'critical' ? (
                            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{n.message}</p>
                            <span className="text-[10px] text-slate-400 font-mono mt-1 block">{n.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Role Switcher Pill */}
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-full bg-slate-900 border border-slate-700 hover:border-brand-500/50 hover:bg-slate-800/80 transition-all shadow-sm group"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-brand-500/40"
              />
              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-white leading-tight">
                    {currentUser.name.split(',')[0]}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-800 text-brand-400 border border-slate-700">
                    {currentRole}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-400 transition-colors" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center justify-around px-2 py-2 border-t border-slate-800/80 bg-slate-950/90 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-2.5 py-1 rounded ${activeTab === 'landing' ? 'bg-brand-500/20 text-brand-400 font-bold' : 'text-slate-400'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('radiologist')}
            className={`px-2.5 py-1 rounded ${activeTab === 'radiologist' ? 'bg-brand-500/20 text-brand-400 font-bold' : 'text-slate-400'}`}
          >
            PACS Worklist
          </button>
          <button
            onClick={() => setActiveTab('viewer')}
            className={`px-2.5 py-1 rounded ${activeTab === 'viewer' ? 'bg-brand-500/20 text-brand-400 font-bold' : 'text-slate-400'}`}
          >
            Viewer
          </button>
          <button
            onClick={() => setActiveTab('doctor')}
            className={`px-2.5 py-1 rounded ${activeTab === 'doctor' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            Doctor
          </button>
          <button
            onClick={() => setActiveTab('patient')}
            className={`px-2.5 py-1 rounded ${activeTab === 'patient' ? 'bg-purple-500/20 text-purple-400 font-bold' : 'text-slate-400'}`}
          >
            Patient
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-2.5 py-1 rounded ${activeTab === 'admin' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-400'}`}
          >
            Admin
          </button>
          <button
            onClick={() => setActiveTab('regional')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'regional' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-emerald-400 font-bold'}`}
          >
            Regional Voice AI
          </button>
        </div>
      </header>

      {/* Role Switcher Interactive Modal */}
      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </>
  );
};
