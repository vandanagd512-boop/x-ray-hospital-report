import React, { useState, useRef, useEffect, useId } from 'react';
import { MedicalScan, AIFinding } from '../../types';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  Sliders, 
  Eye, 
  EyeOff, 
  Layers, 
  Ruler, 
  Columns, 
  Flame, 
  Sparkles, 
  ShieldAlert, 
  Crosshair, 
  Download, 
  SunMedium, 
  Contrast,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Props {
  scan: MedicalScan;
  onSelectFinding?: (finding: AIFinding) => void;
  activeFindingId?: string;
}

type WindowPreset = 'default' | 'lung' | 'bone' | 'soft-tissue' | 'brain';

export const DicomViewer: React.FC<Props> = ({ scan, onSelectFinding, activeFindingId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const filterId = useId().replace(/:/g, '');

  // Viewport transformation states
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Windowing & Display filters
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [isInverted, setIsInverted] = useState(false);
  const [windowPreset, setWindowPreset] = useState<WindowPreset>('default');

  // AI Layers toggles
  const [showAiOverlays, setShowAiOverlays] = useState(true);
  const [showHeatmaps, setShowHeatmaps] = useState(true);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  // Tools & Modes
  const [activeTool, setActiveTool] = useState<'pan' | 'caliper' | 'angle' | 'roi'>('pan');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [currentSlice, setCurrentSlice] = useState(0);

  // Interactive Caliper measurement state
  const [caliperPoints, setCaliperPoints] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const [isDrawingCaliper, setIsDrawingCaliper] = useState(false);

  // Apply Window Preset values
  const applyPreset = (preset: WindowPreset) => {
    setWindowPreset(preset);
    switch (preset) {
      case 'lung':
        setBrightness(115);
        setContrast(145);
        break;
      case 'bone':
        setBrightness(90);
        setContrast(180);
        break;
      case 'soft-tissue':
        setBrightness(105);
        setContrast(120);
        break;
      case 'brain':
        setBrightness(98);
        setContrast(165);
        break;
      default:
        setBrightness(100);
        setContrast(100);
        break;
    }
  };

  const resetViewport = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setBrightness(100);
    setContrast(100);
    setIsInverted(false);
    setWindowPreset('default');
    setCaliperPoints(null);
  };

  // Mouse drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === 'pan') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    } else if (activeTool === 'caliper') {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left - pan.x) / (rect.width * zoom)) * 100;
      const clickY = ((e.clientY - rect.top - pan.y) / (rect.height * zoom)) * 100;
      setCaliperPoints({ x1: clickX, y1: clickY, x2: clickX + 12, y2: clickY + 8 });
      setIsDrawingCaliper(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && activeTool === 'pan') {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    } else if (isDrawingCaliper && caliperPoints && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const curX = ((e.clientX - rect.left - pan.x) / (rect.width * zoom)) * 100;
      const curY = ((e.clientY - rect.top - pan.y) / (rect.height * zoom)) * 100;
      setCaliperPoints(prev => (prev ? { ...prev, x2: curX, y2: curY } : null));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsDrawingCaliper(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom(prev => Math.min(Math.max(0.5, prev * zoomFactor), 5));
  };

  // Calculate measurement distance in mm
  const calculateDistanceMm = () => {
    if (!caliperPoints) return 0;
    const dx = caliperPoints.x2 - caliperPoints.x1;
    const dy = caliperPoints.y2 - caliperPoints.y1;
    const distPx = Math.sqrt(dx * dx + dy * dy);
    // 1% of standard 400mm chest field ~ 4mm
    return (distPx * 3.8).toFixed(1);
  };

  const currentDisplayImage = scan.slices && scan.slices.length > 0
    ? scan.slices[currentSlice]
    : scan.imageUrl;

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl select-none">
      
      {/* Top DICOM Metadata & Tool Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs gap-3">
        
        {/* Left: Study & Patient Info Badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700 font-mono">
            <span className="text-slate-400 font-sans">ACC:</span>
            <span className="font-bold text-brand-300">{scan.accessionNumber}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-300 font-medium">
            <span>{scan.patientName}</span>
            <span className="text-slate-500">•</span>
            <span>{scan.patientAge}y/{scan.patientGender}</span>
            <span className="text-slate-500">•</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 border border-slate-700 text-cyan-400">
              {scan.modality}
            </span>
          </div>

          {/* Priority Pill */}
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            scan.priority === 'STAT'
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
              : scan.priority === 'Urgent'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
          }`}>
            {scan.priority}
          </span>
        </div>

        {/* Center: Window Presets */}
        <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
          <span className="text-[10px] font-semibold text-slate-400 px-2 uppercase font-mono">Window:</span>
          {(['default', 'lung', 'bone', 'soft-tissue', 'brain'] as WindowPreset[]).map(preset => (
            <button
              key={preset}
              onClick={() => applyPreset(preset)}
              className={`px-2 py-0.5 text-[11px] rounded transition-all capitalize ${
                windowPreset === preset
                  ? 'bg-brand-500 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {preset.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Right: Mode & Tool Switchers */}
        <div className="flex items-center gap-2">
          {/* Caliper Tool */}
          <button
            onClick={() => setActiveTool(activeTool === 'caliper' ? 'pan' : 'caliper')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
              activeTool === 'caliper'
                ? 'bg-emerald-500 text-white shadow-glow-emerald'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
            title="Measurement Caliper (mm)"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Caliper</span>
          </button>

          {/* Prior Comparison Toggle */}
          {scan.priorImageUrl && (
            <button
              onClick={() => setComparisonMode(!comparisonMode)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                comparisonMode
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
              title="Compare with prior scan (Side-by-Side)"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Prior Sync</span>
            </button>
          )}

          {/* AI Layers Toggle */}
          <button
            onClick={() => setShowAiOverlays(!showAiOverlays)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
              showAiOverlays
                ? 'bg-gradient-to-r from-brand-600 to-cyan-600 text-white shadow-glow-sm'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
            title="Toggle AI Neural Heatmap and Bounding Boxes"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>AI CAD</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Workspace */}
      <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
        
        {/* Onscreen DICOM HUD Overlays (Top-Left & Top-Right) */}
        <div className="absolute top-3 left-4 z-20 pointer-events-none text-[11px] font-mono text-cyan-400/90 leading-tight drop-shadow-md">
          <p className="font-bold text-white text-xs">{scan.patientName.toUpperCase()}</p>
          <p>MRN: {scan.mrn}</p>
          <p>STUDY: {scan.studyDescription}</p>
          <p>DATE: {scan.scanDate}</p>
          <p className="text-brand-300 mt-1">FOV: 350mm • KVP: 120 • MA: 320</p>
        </div>

        <div className="absolute top-3 right-4 z-20 pointer-events-none text-[11px] font-mono text-right text-cyan-400/90 leading-tight drop-shadow-md">
          <p className="font-bold text-white text-xs">{scan.hospital.toUpperCase()}</p>
          <p>ZOOM: {(zoom * 100).toFixed(0)}%</p>
          <p>BRIGHTNESS: {brightness}% • CONTRAST: {contrast}%</p>
          <p>PRESET: {windowPreset.toUpperCase()}</p>
          <p className="text-emerald-400 mt-1">AI CAD SENSITIVITY: 98.4%</p>
        </div>

        {/* Anatomical Orientation Markers */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-xs font-bold text-yellow-400/80 font-mono">
          SUPERIOR
        </div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-xs font-bold text-yellow-400/80 font-mono">
          INFERIOR
        </div>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none text-xs font-bold text-yellow-400/80 font-mono">
          RIGHT
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none text-xs font-bold text-yellow-400/80 font-mono">
          LEFT
        </div>

        {/* Comparison Mode Split Screen */}
        {comparisonMode && scan.priorImageUrl ? (
          <div className="grid grid-cols-2 w-full h-full divide-x divide-slate-800">
            {/* Left: Prior Examination */}
            <div className="relative flex flex-col items-center justify-center p-2 bg-slate-950">
              <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                PRIOR STUDY (Baseline - 12 Mo Ago)
              </span>
              <img
                src={scan.priorImageUrl}
                alt="Prior Baseline Scan"
                className="max-h-full max-w-full object-contain filter"
                style={{
                  filter: `brightness(${brightness}%) contrast(${contrast}%) ${isInverted ? 'invert(1)' : ''}`
                }}
              />
            </div>

            {/* Right: Current Study */}
            <div className="relative flex flex-col items-center justify-center p-2 bg-slate-950">
              <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/40">
                CURRENT STUDY (With AI CAD)
              </span>
              <div className="relative max-h-full max-w-full flex items-center justify-center">
                <img
                  src={currentDisplayImage}
                  alt="Current Study"
                  className="max-h-full max-w-full object-contain filter"
                  style={{
                    filter: `brightness(${brightness}%) contrast(${contrast}%) ${isInverted ? 'invert(1)' : ''}`
                  }}
                />

                {/* AI Overlays on Current */}
                {showAiOverlays && scan.aiFindings.map(finding => {
                  if (!finding.boundingBox) return null;
                  const b = finding.boundingBox;
                  const isHighlighted = activeFindingId === finding.id;
                  return (
                    <div
                      key={finding.id}
                      onClick={() => onSelectFinding?.(finding)}
                      className={`absolute cursor-pointer transition-all duration-300 rounded border-2 ${
                        isHighlighted
                          ? 'border-rose-400 bg-rose-500/30 ring-4 ring-rose-500/40'
                          : finding.severity === 'critical'
                          ? 'border-rose-500/90 bg-rose-500/15'
                          : 'border-amber-400/90 bg-amber-400/15'
                      }`}
                      style={{
                        left: `${b.x}%`,
                        top: `${b.y}%`,
                        width: `${b.width}%`,
                        height: `${b.height}%`
                      }}
                    >
                      <div className="absolute -top-6 left-0 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-950/90 text-white border border-rose-500/60 flex items-center gap-1 whitespace-nowrap shadow-lg">
                        <span>{finding.title}</span>
                        <span className="text-yellow-400">{finding.confidence.toFixed(1)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Single Main Interactive Canvas Viewport */
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
            className={`relative w-full h-full flex items-center justify-center overflow-hidden cursor-${
              activeTool === 'pan' ? (isDragging ? 'grabbing' : 'grab') : 'crosshair'
            }`}
          >
            {/* Medical Imaging Display Element with Smooth CSS Transform */}
            <div
              className="relative transition-transform duration-75 origin-center inline-block"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
              }}
            >
              <img
                src={currentDisplayImage}
                alt={scan.studyDescription}
                draggable={false}
                className="max-h-[78vh] max-w-[85vw] object-contain shadow-2xl pointer-events-none"
                style={{
                  filter: `brightness(${brightness}%) contrast(${contrast}%) ${isInverted ? 'invert(1)' : ''}`
                }}
              />

              {/* AI Neural Heatmap Gradient Layer */}
              {showAiOverlays && showHeatmaps && (
                <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-65">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <radialGradient id={`aiHeatmap-${filterId}`} cx="65%" cy="62%" r="22%" fx="65%" fy="62%">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.85" />
                        <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.6" />
                        <stop offset="75%" stopColor="#06b6d4" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                      </radialGradient>
                      <radialGradient id={`aiHeatmap2-${filterId}`} cx="75%" cy="75%" r="14%" fx="75%" fy="75%">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.75" />
                        <stop offset="60%" stopColor="#10b981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#aiHeatmap-${filterId})`} />
                    <rect width="100%" height="100%" fill={`url(#aiHeatmap2-${filterId})`} />
                  </svg>
                </div>
              )}

              {/* AI Bounding Boxes & Quantitative Markers */}
              {showAiOverlays && showBoundingBoxes && scan.aiFindings.map(finding => {
                if (!finding.boundingBox) return null;
                const b = finding.boundingBox;
                const isHighlighted = activeFindingId === finding.id;

                return (
                  <div
                    key={finding.id}
                    onClick={e => {
                      e.stopPropagation();
                      onSelectFinding?.(finding);
                    }}
                    className={`absolute cursor-pointer transition-all duration-200 rounded border-2 ${
                      isHighlighted
                        ? 'border-rose-400 bg-rose-500/35 ring-4 ring-rose-500/50 shadow-glow-rose'
                        : finding.severity === 'critical'
                        ? 'border-rose-500/90 bg-rose-500/15 hover:bg-rose-500/30'
                        : finding.severity === 'warning'
                        ? 'border-amber-400/90 bg-amber-400/15 hover:bg-amber-400/30'
                        : 'border-cyan-400/90 bg-cyan-400/10 hover:bg-cyan-400/20'
                    }`}
                    style={{
                      left: `${b.x}%`,
                      top: `${b.y}%`,
                      width: `${b.width}%`,
                      height: `${b.height}%`
                    }}
                  >
                    {/* Corner Crosshair Reticles */}
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-white" />
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-white" />
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-white" />
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-white" />

                    {/* AI Label & Confidence Tag */}
                    {showLabels && (
                      <div className="absolute -top-7 left-0 px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-slate-950/95 text-white border border-slate-700 flex items-center gap-1.5 whitespace-nowrap shadow-xl">
                        <span className={`w-2 h-2 rounded-full ${
                          finding.severity === 'critical' ? 'bg-rose-500 animate-ping' : 'bg-amber-400'
                        }`} />
                        <span>{finding.title}</span>
                        <span className="text-cyan-400 font-bold">{finding.confidence.toFixed(1)}%</span>
                        {finding.measurementMm && (
                          <span className="text-emerald-400 ml-1">({finding.measurementMm}mm)</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Interactive Caliper Line Graphic */}
              {caliperPoints && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <line
                    x1={`${caliperPoints.x1}%`}
                    y1={`${caliperPoints.y1}%`}
                    x2={`${caliperPoints.x2}%`}
                    y2={`${caliperPoints.y2}%`}
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  {/* Endpoint crosses */}
                  <circle cx={`${caliperPoints.x1}%`} cy={`${caliperPoints.y1}%`} r="4" fill="#10b981" />
                  <circle cx={`${caliperPoints.x2}%`} cy={`${caliperPoints.y2}%`} r="4" fill="#10b981" />
                  {/* Distance Text Tag */}
                  <rect
                    x={`${(caliperPoints.x1 + caliperPoints.x2) / 2 - 4}%`}
                    y={`${(caliperPoints.y1 + caliperPoints.y2) / 2 - 3}%`}
                    width="80"
                    height="20"
                    fill="#0f172a"
                    stroke="#10b981"
                    rx="4"
                  />
                  <text
                    x={`${(caliperPoints.x1 + caliperPoints.x2) / 2}%`}
                    y={`${(caliperPoints.y1 + caliperPoints.y2) / 2 + 1}%`}
                    fill="#34d399"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {calculateDistanceMm()} mm
                  </text>
                </svg>
              )}
            </div>
          </div>
        )}

        {/* Slice Navigation Bar for multi-frame CT/MRI */}
        {scan.slices && scan.slices.length > 1 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700 shadow-xl backdrop-blur-md">
            <button
              onClick={() => setCurrentSlice(prev => Math.max(0, prev - 1))}
              disabled={currentSlice === 0}
              className="p-1 rounded bg-slate-800 text-slate-300 disabled:opacity-30 hover:bg-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-300">
              Slice <span className="font-bold text-brand-300">{currentSlice + 1}</span> of {scan.slices.length}
            </span>
            <input
              type="range"
              min={0}
              max={scan.slices.length - 1}
              value={currentSlice}
              onChange={e => setCurrentSlice(Number(e.target.value))}
              className="w-32 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <button
              onClick={() => setCurrentSlice(prev => Math.min(scan.slices!.length - 1, prev + 1))}
              disabled={currentSlice === scan.slices.length - 1}
              className="p-1 rounded bg-slate-800 text-slate-300 disabled:opacity-30 hover:bg-slate-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900/95 border-t border-slate-800 text-xs gap-3">
        
        {/* Zoom & Viewport controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoom(prev => Math.max(0.5, prev - 0.2))}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-300 px-1 w-12 text-center">
            {(zoom * 100).toFixed(0)}%
          </span>
          <button
            onClick={() => setZoom(prev => Math.min(5, prev + 0.2))}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={resetViewport}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors ml-1"
            title="Reset Viewport"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Sliders: Brightness & Contrast */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <SunMedium className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="range"
              min={50}
              max={180}
              value={brightness}
              onChange={e => setBrightness(Number(e.target.value))}
              className="w-20 sm:w-28 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
              title="Brightness"
            />
          </div>
          <div className="flex items-center gap-2">
            <Contrast className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="range"
              min={60}
              max={220}
              value={contrast}
              onChange={e => setContrast(Number(e.target.value))}
              className="w-20 sm:w-28 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
              title="Contrast"
            />
          </div>
        </div>

        {/* Invert & Toggle buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsInverted(!isInverted)}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
              isInverted
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Invert Grayscale (Negative view)"
          >
            Invert Grayscale
          </button>

          <button
            onClick={() => setShowHeatmaps(!showHeatmaps)}
            disabled={!showAiOverlays}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-all ${
              showHeatmaps && showAiOverlays
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                : 'bg-slate-800 text-slate-500 border border-slate-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Heatmap</span>
          </button>

          <button
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            disabled={!showAiOverlays}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-all ${
              showBoundingBoxes && showAiOverlays
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                : 'bg-slate-800 text-slate-500 border border-slate-700'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">ROIs</span>
          </button>
        </div>
      </div>
    </div>
  );
};
