import React, { useState } from 'react';
import { MedicalScan, AIFinding } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  PlusCircle, 
  Check, 
  ThumbsUp, 
  ThumbsDown, 
  Zap, 
  ArrowUpRight,
  TrendingUp,
  Brain,
  Pill
} from 'lucide-react';

interface Props {
  scan: MedicalScan;
  onSelectFinding: (finding: AIFinding) => void;
  activeFindingId?: string;
  onInsertFinding: (findingText: string) => void;
  onReAnalyze: () => void;
  isAnalyzing: boolean;
}

export const AiFindingsPanel: React.FC<Props> = ({
  scan,
  onSelectFinding,
  activeFindingId,
  onInsertFinding,
  onReAnalyze,
  isAnalyzing
}) => {
  const { openCarePlanModal } = useAuth();
  const [feedback, setFeedback] = useState<Record<string, 'agreed' | 'rejected'>>({});

  const handleFeedback = (findingId: string, type: 'agreed' | 'rejected') => {
    setFeedback(prev => ({ ...prev, [findingId]: type }));
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      
      {/* Panel Header */}
      <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-brand-500/20 to-cyan-500/20 border border-brand-500/30 text-brand-400">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm">AuraRad AI Findings</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-brand-500/20 text-cyan-300 border border-brand-500/30">
                v4.2 Neural CAD
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Confidence Index: <span className="text-brand-400 font-bold">{scan.aiOverallConfidence}%</span> • 12 Layer CNN Ensemble
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {scan.carePlan && (
            <button
              onClick={() => openCarePlanModal(scan)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-all shadow-sm"
              title="Open Plain-English Translation & Medication Guidance"
            >
              <Pill className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Plain English & Meds</span>
            </button>
          )}

          {/* Re-analyze button */}
          <button
            onClick={onReAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all disabled:opacity-50"
          >
            <Zap className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin text-amber-400' : 'text-brand-400'}`} />
            <span>{isAnalyzing ? 'Inferring...' : 'Re-Run AI'}</span>
          </button>
        </div>
      </div>

      {/* AI Diagnostic Summary Card */}
      <div className="p-4 bg-gradient-to-b from-brand-950/30 to-transparent border-b border-slate-800/80">
        <div className="p-3.5 rounded-xl bg-slate-850 border border-brand-500/20 shadow-inner">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Automated CAD Pre-Read Summary
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-900/60 text-brand-300 border border-brand-700">
              TAT: {scan.turnaroundTimeTarget}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {scan.aiSummary}
          </p>
        </div>
      </div>

      {/* Findings List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
        <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
          <span>Detected Pathologies ({scan.aiFindings.length})</span>
          <span className="text-[11px] text-slate-500">Click card to locate in viewer</span>
        </div>

        {scan.aiFindings.map(finding => {
          const isSelected = activeFindingId === finding.id;
          const userStatus = feedback[finding.id];

          return (
            <div
              key={finding.id}
              onClick={() => onSelectFinding(finding)}
              className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-slate-800/90 border-brand-400 shadow-glow-sm ring-1 ring-brand-400/40'
                  : 'bg-slate-850/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              {/* Card Top: Title & Severity Badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  {finding.severity === 'critical' ? (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  ) : finding.severity === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">
                      {finding.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {finding.location}
                    </p>
                  </div>
                </div>

                {/* Confidence Badge */}
                <div className="text-right shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    finding.confidence > 90
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {finding.confidence.toFixed(1)}% Conf
                  </span>
                  {finding.biRadsLungRads && (
                    <span className="block mt-1 text-[10px] font-bold text-cyan-300">
                      {finding.biRadsLungRads}
                    </span>
                  )}
                </div>
              </div>

              {/* Confidence Progress Bar */}
              <div className="mt-2.5 w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    finding.confidence > 90
                      ? 'bg-gradient-to-r from-amber-400 to-rose-500'
                      : 'bg-gradient-to-r from-cyan-400 to-brand-500'
                  }`}
                  style={{ width: `${finding.confidence}%` }}
                />
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                {finding.description}
              </p>

              {/* Recommendation if present */}
              {finding.recommendation && (
                <div className="mt-2.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                  <span>{finding.recommendation}</span>
                </div>
              )}

              {/* Actions & Radiologist Feedback */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
                {/* Insert to report button */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onInsertFinding(`- ${finding.title} (${finding.location}): ${finding.description} (AI Confidence: ${finding.confidence.toFixed(1)}%).`);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold bg-brand-600/20 text-brand-300 hover:bg-brand-600/30 border border-brand-500/30 transition-colors"
                >
                  <PlusCircle className="w-3 h-3" />
                  <span>Insert to Report</span>
                </button>

                {/* Agree / Disagree Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleFeedback(finding.id, 'agreed');
                    }}
                    className={`p-1.5 rounded transition-colors ${
                      userStatus === 'agreed'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-emerald-400 hover:bg-slate-700'
                    }`}
                    title="Concur with AI finding"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleFeedback(finding.id, 'rejected');
                    }}
                    className={`p-1.5 rounded transition-colors ${
                      userStatus === 'rejected'
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700'
                    }`}
                    title="Reject / Mark false positive"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
