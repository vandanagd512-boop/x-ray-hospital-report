# AuraRad AI — Enterprise Radiology Intelligence & PACS Platform

AuraRad AI is an enterprise-grade, high-performance web platform engineered for hospital networks, diagnostic imaging centers, and emergency trauma suites. It provides real-time Computer-Aided Diagnostic (CAD) pre-screening, an interactive high-resolution DICOM viewport with clinical windowing and measurement tools, structured reporting aligned with ACR standards, and role-based access for Radiologists, Referring Physicians, Patients, and Hospital Administrators.

---

## 🌟 Key Platform Features

### 1. High-Resolution Interactive DICOM Viewer
- **Multi-Modality Support:** Digital Radiography (X-Ray), Helical Multidetector CT, 3T MRI (Axial T2, FLAIR, DWI, ADC), and Duplex Ultrasound.
- **Precision Viewport Navigation:** Smooth mouse drag pan, continuous wheel zoom (0.5x to 5.0x), zoom to fit, and reset.
- **Clinical Windowing Presets:**
  - `Default` standard window
  - `Lung Window` (W:1500, L:-600) for parenchymal opacities & pneumothoraces
  - `Bone Window` (W:2000, L:400) for microfractures & cortical continuity
  - `Soft Tissue` (W:400, L:50) for mediastinum & organ boundaries
  - `Brain Window` (W:80, L:40) for stroke cytotoxic edema vs ischemia
- **Direct Image Processing:** Fine-tuning brightness & contrast sliders, plus **Invert Grayscale** (negative view for bone density analysis).
- **Interactive Measurement Caliper:** Click & drag caliper to calculate physical lesion lengths in millimeters ($mm$) with visual crosshair reticles.
- **Prior Comparison Mode:** Side-by-side split screen view synchronized with prior baseline examinations (e.g. 12-month interval CT nodule growth tracking).
- **Multi-Slice CT/MRI Navigation:** Slice scrubbing slider with previous/next shortcuts.

### 2. Deep Convolutional AI CAD Intelligence
- **Real-Time Pathology Detection:** Identifies acute conditions (Lobar Pneumonia, Pleural Effusions, Acute MCA Ischemic Stroke, Pulmonary Embolism, Solitary Pulmonary Nodules, Carotid Stenosis).
- **Multi-Layer Visualizations:**
  - Dual-gradient neural activation heatmaps (CAM/Grad-CAM simulation).
  - Bounding boxes with confidence percentages and anatomical localization tags.
  - Interactive feedback: Radiologists can concur ("Thumbs Up") or flag false positives ("Thumbs Down").
- **1-Click Report Insertion:** Transfer AI findings and quantitative measurements directly into the formal structured report.

### 3. Structured ACR Diagnostic Report Editor & Verification
- **Reporting Lexicon:** Structured sections for Clinical History, Technique & Protocol, Comparison, Anatomical Findings, Impression, Recommendations, and ICD-10 Coding.
- **RADS Category Grading:** Lung-RADS (1 through 4B) and BI-RADS scoring.
- **AI Auto-Draft:** Converts quantitative neural findings into formal ACR radiological prose with 1 click.
- **Digital Cryptographic Signing:** Finalizes reports with SHA-256 electronic signature stamps and immutable HL7 FHIR sync.
- **Hospital-Grade PDF Print:** Cleveland Clinic / Mayo Clinic standard printable report with hospital letterhead, patient barcode, key image snapshot, and verification QR code.

### 4. Role-Based Access Control (RBAC)
- **Attending Radiologist (Dr. Elena Vance, MD, FACR):** Diagnostic worklist with STAT prioritization, full DICOM viewport, AI findings, and report finalization.
- **Referring Doctor (Dr. Marcus Chen, MD):** Order new scans with immediate AI pre-read preview, track requisition statuses, review signed reports, and consult radiology.
- **Patient Portal (Sarah Jenkins):** View imaging records, read patient-friendly plain-language AI explanations, download official PDF reports, and book appointments.
- **Hospital Administrator (Alexander Cross):** Real-time analytics on scan volume, mean Turnaround Time (TAT), AI concordance rate (98.4%), credentialed personnel directory, and immutable HIPAA audit logs.
- **Seamless 1-Click Role Switcher:** Quickly explore every role's perspective from the navigation bar.

---

## 🛠️ Architecture & Tech Stack

- **Framework:** React 19 + TypeScript (Strict Mode)
- **Bundler:** Vite 6 with instant Hot Module Replacement (HMR)
- **Styling:** Tailwind CSS with custom medical dark/light glassmorphic utility classes
- **Icons:** Lucide React (feather medical icons)
- **State Management:** React Context API (`AuthProvider`, `ThemeContext`) with local persistence
- **Security Protocols:** HIPAA Security Rule compliant architecture, simulated DICOM C-STORE AE Title & TLS port endpoints.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ (tested on Node v24.12.0)
- npm or pnpm

### Running in Development
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production
```bash
npm run build
```
Creates an optimized, production-ready bundle in the `dist/` directory.

### Previewing Production Build
```bash
npm run preview
```

---

## 📄 Compliance & Regulatory Notes
AuraRad AI is engineered for clinical decision support. All AI models simulate FDA 510(k)-cleared computer-aided detection protocols and adhere to the American College of Radiology (ACR) and DICOM 3.0 standards.
