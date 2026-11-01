import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_APPOINTMENTS } from '../../data/mockData';
import { Appointment } from '../../types';
import { 
  Heart, 
  Calendar, 
  FileText, 
  Download, 
  Eye, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Info,
  CheckCircle2,
  CalendarPlus,
  Share2,
  Pill,
  HelpCircle
} from 'lucide-react';

export const PatientPortal: React.FC = () => {
  const { scans, selectScan, openReportModal, openCarePlanModal, currentUser } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // New appointment form state
  const [bookModality, setBookModality] = useState('X-Ray');
  const [bookDate, setBookDate] = useState('2026-11-28');
  const [bookTime, setBookTime] = useState('09:30 AM');
  const [bookLocation, setBookLocation] = useState('Metro General — Suite 204 Outpatient Imaging');

  const patientScans = scans.filter(s => s.patientId === currentUser.id || s.patientName.includes('Sarah'));

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const newApt: Appointment = {
      id: `apt_${Date.now()}`,
      patientId: currentUser.id,
      patientName: currentUser.name,
      modality: bookModality as any,
      study: `${bookModality} Diagnostic Follow-up Examination`,
      date: bookDate,
      time: bookTime,
      location: bookLocation,
      physician: 'Dr. Marcus Chen, MD',
      preparationNotes: 'Arrive 15 minutes before scheduled slot. Wear comfortable clothing with no metal fasteners.',
      status: 'Scheduled'
    };
    setAppointments(prev => [newApt, ...prev]);
    setIsBookModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border border-purple-500/30 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Encrypted Patient Health Portal
              </span>
              <span className="text-xs text-slate-400 font-mono">MRN: #PX-8942</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Access your medical scans, radiologist-verified diagnostic reports, patient-friendly AI explanations, and appointment schedules in one secure place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsBookModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-glow-sm transition-all hover:scale-105"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Schedule New Imaging</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Imaging History (Left) and Upcoming Appointments (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: My Imaging Records & Timeline (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <span>My Imaging Records & Clinical Reports</span>
            </h2>
            <span className="text-xs text-slate-400">{patientScans.length} studies on file</span>
          </div>

          <div className="space-y-4">
            {patientScans.map(scan => (
              <div
                key={scan.id}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all shadow-xl space-y-4"
              >
                {/* Header: Date, Modality & Status */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={scan.imageUrl}
                      alt={scan.studyDescription}
                      onClick={() => selectScan(scan.id)}
                      className="w-14 h-14 object-cover rounded-xl border border-slate-700 cursor-pointer hover:border-purple-400 transition-colors"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {scan.modality}
                        </span>
                        <h3 className="font-bold text-white text-sm">
                          {scan.studyDescription}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>{scan.scanDate}</span>
                        <span>•</span>
                        <span>{scan.hospital}</span>
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Verified by Radiologist
                  </span>
                </div>

                {/* Patient-Friendly AI Explanation Box */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/30 via-slate-950 to-slate-950 border border-purple-500/20 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                      <span>Plain Language Diagnosis:</span>
                    </div>
                    {scan.carePlan && (
                      <button
                        onClick={() => openCarePlanModal(scan)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition-all shadow-sm"
                      >
                        <Pill className="w-3 h-3 text-emerald-400" />
                        <span>Medicines & Jargon Translator</span>
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {scan.patientFriendlySummary}
                  </p>
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800/80 gap-3">
                  <div className="text-[11px] text-slate-400 font-mono">
                    Interpreted by: <span className="text-slate-300 font-semibold">{scan.assignedRadiologist}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {scan.carePlan && (
                      <button
                        onClick={() => openCarePlanModal(scan)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 text-xs font-bold transition-colors"
                      >
                        <Pill className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Understand Report & Meds</span>
                      </button>
                    )}

                    <button
                      onClick={() => selectScan(scan.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-purple-400" />
                      <span>View Imaging</span>
                    </button>

                    <button
                      onClick={() => openReportModal(scan)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-sm transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Official PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Appointments & Care Guidance (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-400" />
              <span>Upcoming Appointments</span>
            </h2>
            <span className="text-xs text-slate-400">{appointments.length} scheduled</span>
          </div>

          <div className="space-y-3">
            {appointments.map(apt => (
              <div
                key={apt.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 font-mono">
                      {apt.modality} Scan
                    </span>
                    <h4 className="font-bold text-white text-xs mt-0.5">{apt.study}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {apt.status}
                  </span>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{apt.date} at {apt.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{apt.location}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{apt.preparationNotes}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Educational / Prep Widget */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Radiation & Patient Safety</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              All scans are acquired using ALARA protocols (As Low As Reasonably Achievable). AuraRad AI reconstruction algorithms allow up to 40% radiation dose reduction while preserving crystal-clear diagnostic contrast.
            </p>
          </div>
        </div>
      </div>

      {/* Appointment Booking Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-1">Schedule Diagnostic Examination</h3>
            <p className="text-xs text-slate-400 mb-4">
              Book your physician-ordered imaging session directly into the hospital PACS queue.
            </p>

            <form onSubmit={handleBookAppointment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Imaging Modality:</label>
                <select
                  value={bookModality}
                  onChange={e => setBookModality(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="X-Ray">Chest / Skeletal X-Ray</option>
                  <option value="CT">Thoracic CT Scan</option>
                  <option value="MRI">Brain / Spine MRI</option>
                  <option value="Ultrasound">Abdominal / Vascular Ultrasound</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date:</label>
                  <input
                    type="date"
                    value={bookDate}
                    onChange={e => setBookDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Preferred Time:</label>
                  <select
                    value={bookTime}
                    onChange={e => setBookTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
                  >
                    <option>08:30 AM</option>
                    <option>10:00 AM</option>
                    <option>01:30 PM</option>
                    <option>03:45 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Facility Branch:</label>
                <select
                  value={bookLocation}
                  onChange={e => setBookLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option>Metro General — Suite 204 Outpatient Imaging</option>
                  <option>Northwestern Pavilion — Scanner Bay 2</option>
                  <option>St. Jude Diagnostics Center — Ground Floor</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
