import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { RadiologistWorklist } from './RadiologistWorklist';
import { DicomViewer } from './DicomViewer';
import { AiFindingsPanel } from './AiFindingsPanel';
import { ReportEditor } from './ReportEditor';
import { AIFinding } from '../../types';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Brain, 
  LayoutList, 
  Sparkles,
  Printer
} from 'lucide-react';

export const RadiologistDashboard: React.FC = () => {
  const { 
    scans, 
    selectedScan, 
    selectScan, 
    runAiReAnalysis, 
    isAnalyzing,
    openReportModal 
  } = useAuth();

  const [activeView, setActiveView] = useState<'worklist' | 'viewer'>('worklist');
  const [activeSidebarTab, setActiveSidebarTab] = useState<'ai' | 'report'>('ai');
  const [highlightedFinding, setHighlightedFinding] = useState<AIFinding | undefined>(undefined);
  const [textToInsert, setTextToInsert] = useState<string>('');

  // Finding current index for case cycling
  const currentIndex = scans.findIndex(s => s.id === selectedScan?.id);

  const handleNextCase = () => {
    if (currentIndex < scans.length - 1) {
      selectScan(scans[currentIndex + 1].id);
    }
  };

  const handlePrevCase = () => {
    if (currentIndex > 0) {
      selectScan(scans[currentIndex - 1].id);
    }
  };

  const handleOpenViewer = (scanId: string) => {
    selectScan(scanId);
    setActiveView('viewer');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* View Switcher Bar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>PACS Diagnostic Command Center</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/20 text-brand-400 border border-brand-500/30">
              Dr. Elena Vance, MD
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Department of Thoracic & Trauma Imaging • High-Resolution Diagnostic Display Node #4
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveView('worklist')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeView === 'worklist'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Study Worklist</span>
            </button>

            <button
              onClick={() => setActiveView('viewer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeView === 'viewer'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Diagnostic Workspace</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeView === 'worklist' ? (
        <RadiologistWorklist onOpenViewer={handleOpenViewer} />
      ) : (
        /* Diagnostic Workspace (Viewer + Findings + Report) */
        <div className="space-y-4">
          
          {/* Top Case Navigation Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveView('worklist')}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-semibold">Back to Worklist</span>
              </button>
              <span className="text-slate-600">|</span>
              <span className="font-mono text-slate-300">
                Case <span className="font-bold text-white">{currentIndex + 1}</span> of {scans.length}
              </span>
            </div>

            {/* Next / Previous Case Shortcuts */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevCase}
                disabled={currentIndex === 0}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Case</span>
              </button>

              <button
                onClick={handleNextCase}
                disabled={currentIndex === scans.length - 1}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
              >
                <span>Next Case</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grid Layout: Viewer on Left (7 cols), Side Panel on Right (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[750px]">
            
            {/* Viewer Column (7 or 8 columns on desktop) */}
            <div className="lg:col-span-7 xl:col-span-7 h-[750px]">
              {selectedScan && (
                <DicomViewer
                  scan={selectedScan}
                  onSelectFinding={f => setHighlightedFinding(f)}
                  activeFindingId={highlightedFinding?.id}
                />
              )}
            </div>

            {/* Right Side Panel: AI Findings & Structured Reporting Tabs */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col h-[750px]">
              
              {/* Tab Selector */}
              <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl mb-3 shrink-0">
                <button
                  onClick={() => setActiveSidebarTab('ai')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeSidebarTab === 'ai'
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span>AI Findings ({selectedScan?.aiFindings.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveSidebarTab('report')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeSidebarTab === 'report'
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Structured Report</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-hidden">
                {activeSidebarTab === 'ai' && selectedScan && (
                  <AiFindingsPanel
                    scan={selectedScan}
                    onSelectFinding={f => setHighlightedFinding(f)}
                    activeFindingId={highlightedFinding?.id}
                    onInsertFinding={text => {
                      setTextToInsert(text);
                      setActiveSidebarTab('report');
                    }}
                    onReAnalyze={() => runAiReAnalysis(selectedScan.id)}
                    isAnalyzing={isAnalyzing}
                  />
                )}

                {activeSidebarTab === 'report' && selectedScan && (
                  <ReportEditor
                    scan={selectedScan}
                    externalInsertedText={textToInsert}
                    onClearInsertedText={() => setTextToInsert('')}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
