"use client";

import React, { useState } from "react";
import {
  FolderGit2,
  Users,
  CheckCircle2,
  Clock,
  Code,
  FileText,
  MessageSquare,
  Award,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  ChevronRight,
  Plus,
  Search,
  Bell,
  LogOut,
  ExternalLink,
  Download,
  Copy,
  Send,
  Sliders,
  BarChart3,
  UserCheck,
  Building2,
  AlertTriangle,
  Play,
  ArrowRight,
  Check,
  X,
  Star,
  FileCheck,
  Terminal,
  Cpu,
  Layers,
  TrendingUp,
  Bookmark,
  Shield,
  Zap,
  HelpCircle,
  ChevronDown,
  Lock,
  Mail,
  User,
  Hash,
  Upload,
  RefreshCw,
  Eye,
  KeyRound,
  LayoutDashboard,
  Filter,
  ArrowUpRight
} from "lucide-react";

// ==========================================
// DATA INTERFACES
// ==========================================

export interface Member {
  name: string;
  role: string;
  roll: string;
  email: string;
}

export interface Milestone {
  id: number;
  title: string;
  desc: string;
  weight: number;
  status: "completed" | "in_progress" | "pending";
  dueDate: string;
}

export interface FileItem {
  id: number;
  name: string;
  category: "SRS" | "Design" | "Report" | "Thesis" | "Other";
  version: string;
  size: string;
  uploadedBy: string;
  date: string;
  desc: string;
}

export interface CodeSnippet {
  id: number;
  filename: string;
  lang: string;
  author: string;
  commit: string;
  code: string;
}

export interface DiscussionMsg {
  id: number;
  sender: string;
  role: "student" | "faculty" | "admin";
  time: string;
  text: string;
}

export interface FeedbackItem {
  id: number;
  faculty: string;
  date: string;
  rating: number;
  type: string;
  comment: string;
}

export interface Evaluation {
  presentation: number; // max 20
  codeQuality: number; // max 25
  documentation: number; // max 15
  viva: number; // max 15
  innovation: number; // max 25
  total: number; // max 100
  grade: string;
  verdict: string;
  remarks: string;
  evaluator: string;
  date: string;
}

export interface Project {
  id: number;
  title: string;
  domain: string;
  techStack: string;
  abstract: string;
  githubUrl: string;
  liveDemoUrl: string;
  status: "in_progress" | "submitted" | "evaluated";
  progress: number;
  leader: string;
  guide: string;
  guideId: string;
  members: Member[];
  milestones: Milestone[];
  files: FileItem[];
  codeSnippets: CodeSnippet[];
  discussions: DiscussionMsg[];
  feedbacks: FeedbackItem[];
  evaluation: Evaluation | null;
  finalSubmission?: {
    thesisFile: string;
    repoUrl: string;
    demoUrl: string;
    submittedAt: string;
    notes: string;
  } | null;
}

export interface FacultyGuideOption {
  id: string;
  name: string;
  dept: string;
  domain: string;
  email: string;
  availableSlots: number;
}

// ==========================================
// INITIAL MOCK DATA
// ==========================================

const FACULTY_GUIDES: FacultyGuideOption[] = [
  { id: "fac1", name: "Prof. Arvind Verma", dept: "Computer Science & Engineering", domain: "Web SaaS, Cloud & Docker", email: "arvind.verma@projecthub.edu", availableSlots: 2 },
  { id: "fac2", name: "Dr. Anita Deshmukh", dept: "Artificial Intelligence & Data Science", domain: "Deep Learning, Medical Imaging", email: "anita.deshmukh@projecthub.edu", availableSlots: 1 },
  { id: "fac3", name: "Dr. Suresh Rane", dept: "Cybersecurity & Cryptography", domain: "Zero-Knowledge Proofs, Blockchain", email: "suresh.rane@projecthub.edu", availableSlots: 3 },
  { id: "fac4", name: "Prof. Meera Kulkarni", dept: "Information Technology", domain: "IoT, Embedded Systems, Edge AI", email: "meera.kulkarni@projecthub.edu", availableSlots: 2 }
];

const INITIAL_PROJECT: Project = {
  id: 1,
  title: "DevSphere: AI-Powered Autonomous Cloud IDE & Code Review Engine",
  domain: "Web SaaS & Cloud",
  techStack: "Python Flask, React, Docker Engine, PostgreSQL, Redis, Monaco Editor",
  abstract: "A centralized developer workspace integrating containerized sandboxes, continuous AST static analysis, automated vulnerability detection, and real-time team pair programming.",
  githubUrl: "https://github.com/projecthub-team/devsphere-cloud-ide",
  liveDemoUrl: "https://devsphere.demo.projecthub.edu",
  status: "in_progress",
  progress: 75,
  leader: "Aarav Sharma",
  guide: "Prof. Arvind Verma",
  guideId: "fac1",
  members: [
    { name: "Aarav Sharma", role: "Team Leader & Backend Architect", roll: "CS2022-041", email: "aarav.sharma@projecthub.edu" },
    { name: "Priya Patel", role: "Frontend Lead & UI/UX Design", roll: "CS2022-089", email: "priya.patel@projecthub.edu" },
    { name: "Rohan Gupta", role: "DevOps & Docker Infrastructure", roll: "CS2022-112", email: "rohan.gupta@projecthub.edu" }
  ],
  milestones: [
    { id: 1, title: "Milestone 1: IEEE SRS & System Architecture", desc: "Detailed requirement gathering, microservice architecture diagrams, and IEEE SRS signoff.", weight: 20, status: "completed", dueDate: "Aug 20, 2026" },
    { id: 2, title: "Milestone 2: Container Sandbox & Code Editor Integration", desc: "Docker orchestration on host, isolated container spinup, and terminal streaming.", weight: 25, status: "completed", dueDate: "Sep 10, 2026" },
    { id: 3, title: "Milestone 3: AI Code Review & AST Vulnerability Scanner", desc: "Integrate AST parser with heuristics to flag SQLi, XSS, and unhandled promises.", weight: 30, status: "completed", dueDate: "Sep 20, 2026" },
    { id: 4, title: "Milestone 4: Multi-tenant Load Testing & Final Viva Defense", desc: "Benchmarking with 100 concurrent developers and final viva presentation thesis.", weight: 25, status: "pending", dueDate: "Nov 15, 2026" }
  ],
  files: [
    { id: 1, name: "DevSphere_SRS_Specification_v1.2.pdf", category: "SRS", version: "v1.2", size: "1,420 KB", uploadedBy: "Aarav Sharma", date: "Aug 18, 2026", desc: "Finalized IEEE Software Requirements Specification approved by guide." },
    { id: 2, name: "System_Architecture_Diagrams.pdf", category: "Design", version: "v1.0", size: "860 KB", uploadedBy: "Priya Patel", date: "Sep 02, 2026", desc: "Component diagram, sequence diagrams, and Docker network topology." }
  ],
  codeSnippets: [
    {
      id: 1,
      filename: "sandbox_runner.py",
      lang: "python",
      author: "Aarav Sharma",
      commit: "Implement secure resource-constrained Docker container runtime",
      code: `import docker
import os

class SandboxManager:
    def __init__(self):
        self.client = docker.from_env()
        self.default_mem_limit = "512m"
        self.default_cpu_quota = 50000

    def spin_isolated_container(self, user_id: str, image_tag: str = "python:3.11-slim"):
        container_name = f"devsphere-sandbox-{user_id}"
        try:
            container = self.client.containers.run(
                image_tag,
                detach=True,
                name=container_name,
                mem_limit=self.default_mem_limit,
                cpu_quota=self.default_cpu_quota,
                network_mode="none", # Strict air-gapped isolation
                tty=True
            )
            return {"status": "running", "id": container.id, "name": container_name}
        except Exception as e:
            return {"status": "error", "message": str(e)}`
    }
  ],
  discussions: [
    { id: 1, sender: "Prof. Arvind Verma", role: "faculty", time: "Sep 12, 11:30 AM", text: "Team DevSphere, excellent execution on Milestone 2. Please ensure the AST security parser in Milestone 3 covers parameterized query verification." },
    { id: 2, sender: "Aarav Sharma", role: "student", time: "Sep 12, 02:15 PM", text: "Thank you Professor! We have integrated AST visitor patterns for Python and JavaScript. We will demo the vulnerability scanner this Friday." }
  ],
  feedbacks: [
    { id: 1, faculty: "Prof. Arvind Verma", date: "Sep 10, 2026", rating: 5, type: "Milestone Sign-off", comment: "Docker sandbox execution is fast and secure. Memory limits enforced properly. Approved Milestone 2." }
  ],
  evaluation: {
    presentation: 19,
    codeQuality: 24,
    documentation: 14,
    viva: 14,
    innovation: 24,
    total: 95,
    grade: "A+",
    verdict: "Approved with Distinction",
    remarks: "Outstanding capstone implementation. The containerized sandbox architecture meets industrial benchmark standards.",
    evaluator: "Prof. Arvind Verma",
    date: "Sep 22, 2026"
  },
  finalSubmission: {
    thesisFile: "DevSphere_Final_Capstone_Thesis_v1.0.pdf",
    repoUrl: "https://github.com/projecthub-team/devsphere-cloud-ide",
    demoUrl: "https://devsphere.demo.projecthub.edu",
    submittedAt: "Sep 21, 2026",
    notes: "Completed all 4 milestones, AST static scanner, and live container deployment on AWS."
  }
};

export default function ProjectHubApp() {
  // Navigation & Role State
  const [currentView, setCurrentView] = useState<"public" | "student_portal" | "faculty_hub" | "admin_console" | "auth">("public");
  const [authSubView, setAuthSubView] = useState<"login" | "register" | "forgot">("login");
  const [authRoleTab, setAuthRoleTab] = useState<"student" | "faculty" | "admin">("student");

  // Sub-tabs inside portals
  const [studentTab, setStudentTab] = useState<"overview" | "milestones" | "code" | "files" | "chat" | "rubric">("overview");
  const [facultyTab, setFacultyTab] = useState<"requests" | "projects" | "evaluator">("requests");
  const [adminTab, setAdminTab] = useState<"approvals" | "users" | "projects">("approvals");

  // Core Data State
  const [project, setProject] = useState<Project>(INITIAL_PROJECT);
  const [guideRequests, setGuideRequests] = useState([
    {
      id: 101,
      title: "QuantumLedger: Post-Quantum Blockchain Consensus",
      leader: "Tanvi Joshi (AI2023-054)",
      members: "3 Members (Tanvi, Sameer, Rishi)",
      domain: "Cybersecurity & Blockchain",
      submittedDate: "Sep 22, 2026",
      status: "pending"
    }
  ]);
  const [pendingStudents, setPendingStudents] = useState([
    { id: 201, name: "Kunal Verma", roll: "CS2023-019", dept: "Computer Science", email: "kunal.verma@projecthub.edu", date: "Sep 22, 2026" },
    { id: 202, name: "Tanvi Joshi", roll: "AI2023-054", dept: "Artificial Intelligence", email: "tanvi.joshi@projecthub.edu", date: "Sep 22, 2026" },
    { id: 203, name: "Sameer Khan", roll: "IT2023-082", dept: "Information Technology", email: "sameer.khan@projecthub.edu", date: "Sep 23, 2026" }
  ]);
  const [registeredUsers, setRegisteredUsers] = useState([
    { id: 1, name: "Aarav Sharma", roll: "CS2022-041", role: "Student Leader", dept: "Computer Science", email: "aarav.sharma@projecthub.edu", status: "Active" },
    { id: 2, name: "Priya Patel", roll: "CS2022-089", role: "Student Member", dept: "Computer Science", email: "priya.patel@projecthub.edu", status: "Active" },
    { id: 3, name: "Rohan Gupta", roll: "CS2022-112", role: "Student Member", dept: "Computer Science", email: "rohan.gupta@projecthub.edu", status: "Active" },
    { id: 4, name: "Prof. Arvind Verma", roll: "FAC-CSE-004", role: "Faculty Guide", dept: "Computer Science", email: "arvind.verma@projecthub.edu", status: "Active" },
    { id: 5, name: "Dr. Anita Deshmukh", roll: "FAC-AI-012", role: "Faculty Guide", dept: "Artificial Intelligence", email: "anita.deshmukh@projecthub.edu", status: "Active" },
    { id: 6, name: "Dr. Rajesh Mehta", roll: "ADM-DEAN-001", role: "Administrator", dept: "Dean of Academics", email: "rajesh.mehta@projecthub.edu", status: "Active" }
  ]);

  // Modals state
  const [showTourModal, setShowTourModal] = useState(false);
  const [tourStep, setTourStep] = useState(1);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopicInput, setAiTopicInput] = useState("Autonomous Cloud Computing & DevSecOps");
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSubmitFinalModal, setShowSubmitFinalModal] = useState(false);
  const [showCommitModal, setShowCommitModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Forms State
  const [newChatMsg, setNewChatMsg] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Project Form
  const [formTitle, setFormTitle] = useState("");
  const [formDomain, setFormDomain] = useState("Web SaaS & Cloud");
  const [formGuide, setFormGuide] = useState("fac1");

  // Upload Form
  const [uploadDocName, setUploadDocName] = useState("");
  const [uploadCategory, setUploadCategory] = useState<"SRS" | "Design" | "Report" | "Thesis" | "Other">("SRS");

  // Faculty Evaluation Sliders
  const [evalProblem, setEvalProblem] = useState(19);
  const [evalCode, setEvalCode] = useState(24);
  const [evalExecution, setEvalExecution] = useState(24);
  const [evalDoc, setEvalDoc] = useState(14);
  const [evalViva, setEvalViva] = useState(14);
  const [evalRemarks, setEvalRemarks] = useState("Outstanding technical implementation and clean documentation.");

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle milestone completion
  const toggleMilestone = (id: number) => {
    const updated = project.milestones.map((m) => {
      if (m.id === id) {
        return {
          ...m,
          status: (m.status === "completed" ? "pending" : "completed") as "completed" | "pending"
        };
      }
      return m;
    });
    const completedCount = updated.filter((m) => m.status === "completed").length;
    const newProgress = Math.round((completedCount / updated.length) * 100);
    setProject({ ...project, milestones: updated, progress: newProgress });
    showToast(`Milestone status updated! Overall progress is now ${newProgress}%`);
  };

  // Send student chat message
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMsg.trim()) return;
    const msg: DiscussionMsg = {
      id: Date.now(),
      sender: "Aarav Sharma",
      role: "student",
      time: "Just now",
      text: newChatMsg
    };
    setProject({ ...project, discussions: [...project.discussions, msg] });
    setNewChatMsg("");
    showToast("Message sent to Faculty Supervisor!");
  };

  // Handle Faculty Guide Evaluation
  const handlePublishEvaluation = () => {
    const total = evalProblem + evalCode + evalExecution + evalDoc + evalViva;
    let grade = "A+";
    if (total < 60) grade = "F";
    else if (total < 70) grade = "C";
    else if (total < 80) grade = "B";
    else if (total < 90) grade = "A";

    const evalObj: Evaluation = {
      presentation: evalProblem,
      codeQuality: evalCode,
      documentation: evalDoc,
      viva: evalViva,
      innovation: evalExecution,
      total,
      grade,
      verdict: total >= 80 ? "Approved with Distinction" : total >= 60 ? "Approved" : "Needs Revision",
      remarks: evalRemarks,
      evaluator: "Prof. Arvind Verma",
      date: "Sep 23, 2026"
    };

    setProject({ ...project, evaluation: evalObj, status: "evaluated" });
    showToast(`Evaluation published! Total Score: ${total}/100 (${grade})`);
  };

  // Quick Demo Login Handler
  const handleDemoLogin = (role: "student" | "faculty" | "admin") => {
    if (role === "student") setCurrentView("student_portal");
    else if (role === "faculty") setCurrentView("faculty_hub");
    else if (role === "admin") setCurrentView("admin_console");
    showToast(`Signed in as Demo ${role.toUpperCase()}`);
  };

  // Calculate live total for faculty evaluator
  const liveTotalScore = evalProblem + evalCode + evalExecution + evalDoc + evalViva;
  const liveGrade = liveTotalScore >= 90 ? "A+" : liveTotalScore >= 80 ? "A" : liveTotalScore >= 70 ? "B" : liveTotalScore >= 60 ? "C" : "F";

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfdfc] text-slate-800 antialiased font-sans-modern">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f2427] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-500/30 animate-bounce">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* 🌟 UNIVERSAL TOP BAR WITH 1-CLICK ROLE SWITCHER & CLEAN NAV */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentView("public")} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-[#008766] flex items-center justify-center text-white font-bold text-xl shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-[#0f2427]">Project<span className="text-[#008766]">Hub</span></span>
                <span className="snapflow-pill-badge !text-[10px] !py-0.5 !px-2 hidden sm:inline-flex">Academic OS</span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">University Capstone Collaboration</p>
            </div>
          </div>

          {/* Role Quick Switcher Pills */}
          <div className="flex items-center bg-slate-100/90 p-1.5 rounded-full border border-slate-200/80 text-xs font-semibold">
            <button
              onClick={() => setCurrentView("public")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                currentView === "public"
                  ? "bg-white text-[#008766] shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🏠 Home</span>
            </button>
            <button
              onClick={() => setCurrentView("student_portal")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all ${
                currentView === "student_portal"
                  ? "bg-[#008766] text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🎓 Student</span>
            </button>
            <button
              onClick={() => setCurrentView("faculty_hub")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all ${
                currentView === "faculty_hub"
                  ? "bg-[#008766] text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>👨‍🏫 Faculty</span>
            </button>
            <button
              onClick={() => setCurrentView("admin_console")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all ${
                currentView === "admin_console"
                  ? "bg-[#008766] text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🛡️ Admin</span>
            </button>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAiModal(true)}
              className="hidden lg:flex items-center gap-1.5 bg-[#e6f4f1] text-[#008766] hover:bg-[#d5ece7] border border-[#bfe5dc] px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Assistant</span>
            </button>

            {currentView === "public" ? (
              <button
                onClick={() => { setCurrentView("auth"); setAuthSubView("login"); }}
                className="bg-[#008766] hover:bg-[#007054] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            ) : (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-1.5 text-slate-600 hover:text-rose-600 px-3 py-1.5 rounded-xl hover:bg-rose-50 transition-colors text-xs font-bold border border-slate-200 hover:border-rose-200 shadow-2xs cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 1. 🌐 PUBLIC LANDING PAGE (SNAPFLOW TEAL MINIMALIST STYLE) */}
      {/* ============================================================ */}
      {currentView === "public" && (
        <main className="flex-1">
          {/* Hero Section */}
          <section className="snapflow-hero-bg pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-100 text-center relative overflow-hidden">
            <div className="max-w-4xl mx-auto">
              
              {/* Mint Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e6f4f1] border border-[#bfe5dc] text-[#008766] text-xs font-bold uppercase tracking-wider mb-6 shadow-xs animate-fade-in">
                <Sparkles className="w-3.5 h-3.5" />
                <span>WELCOME TO PROJECT HUB · UNIFIED ACADEMIC OS</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0f2427] tracking-tight leading-[1.15] mb-6">
                Seamless solutions for <br className="hidden sm:inline" />
                <span className="italic text-[#008766] font-serif">your academic growth</span>
              </h1>

              {/* Subhead */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-9 leading-relaxed font-normal">
                Empower student engineering teams, faculty supervisors, and departmental administrators with centralized milestone tracking, IEEE deliverable vaults, source code reviews, and certified 5-criteria rubric evaluation.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14">
                <button
                  onClick={() => setCurrentView("student_portal")}
                  className="bg-[#008766] hover:bg-[#007054] text-white px-7 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-md shadow-emerald-800/15 hover:shadow-lg flex items-center gap-2 group"
                >
                  <span>Explore Student Portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => setShowTourModal(true)}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-xs flex items-center gap-2"
                >
                  <Play className="w-4 h-4 text-[#008766] fill-[#008766]" />
                  <span>Watch 2-Min Tour</span>
                </button>
              </div>

              {/* Video Tour Showcase Card */}
              <div className="max-w-3xl mx-auto rounded-3xl p-3 bg-white/80 border border-slate-200/90 shadow-2xl backdrop-blur-sm relative group">
                <div className="rounded-2xl bg-gradient-to-br from-[#0f2427] to-[#043328] p-8 sm:p-12 text-white relative overflow-hidden flex flex-col items-center justify-center min-h-[260px]">
                  
                  {/* Decorative mesh */}
                  <div className="absolute inset-0 bg-[radial-gradient(#008766_1px,transparent_1px)] [background-size:16px_16px] opacity-25"></div>

                  {/* Pulsing Play Button */}
                  <button
                    onClick={() => setShowTourModal(true)}
                    className="snapflow-play-btn w-16 h-16 rounded-full flex items-center justify-center mb-4 z-10 cursor-pointer"
                    title="Play Tour"
                  >
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </button>

                  <h2 className="text-xl font-extrabold z-10 mb-1">Watch Academic Workflow Tour</h2>
                  <p className="text-xs text-emerald-200/80 z-10 max-w-md text-center">
                    Discover how university departments evaluate capstone projects, verify code commits, and publish rubrics in less than 2 minutes.
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* ============================================================ */}
          {/* 🌟 SLIDE 3 INTEGRATION: OUR SOLUTION & 6 KEY BENEFITS */}
          {/* ============================================================ */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
            <div className="max-w-6xl mx-auto">
              
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="snapflow-pill-badge mb-3">OUR SOLUTION — PROJECT HUB</span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0f2427] tracking-tight mb-4">
                  A Single Unified Platform for Project Collaboration & Management
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  ProjectHub brings Students, Faculty, and Admin together onto one centralized workspace, eliminating fragmented chat channels, lost attachments, and unstandardized rubrics.
                </p>
              </div>

              {/* 6 Key Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: <Building2 className="w-6 h-6 text-[#008766]" />,
                    title: "1. One Centralized Platform",
                    desc: "Brings Student engineering teams, Faculty supervisors, and Academic Dean onto one transparent hub."
                  },
                  {
                    icon: <Users className="w-6 h-6 text-[#008766]" />,
                    title: "2. Real-Time Collaboration",
                    desc: "Centralized discussion threads, instant milestone notifications, and direct guide communication."
                  },
                  {
                    icon: <Code className="w-6 h-6 text-[#008766]" />,
                    title: "3. Online Code Sharing",
                    desc: "In-browser syntax-highlighted code viewer, version commits, and AST vulnerability analysis."
                  },
                  {
                    icon: <TrendingUp className="w-6 h-6 text-[#008766]" />,
                    title: "4. Faculty Monitoring",
                    desc: "Live visibility into milestone burndown, deliverable submissions, and team progress metrics."
                  },
                  {
                    icon: <ShieldCheck className="w-6 h-6 text-[#008766]" />,
                    title: "5. Secure File Storage",
                    desc: "Categorized deliverable vault for IEEE SRS, UML architectures, progress reports, and final dissertations."
                  },
                  {
                    icon: <Award className="w-6 h-6 text-[#008766]" />,
                    title: "6. Easy 5-Criteria Evaluation",
                    desc: "Standardized 100-point rubric scoring terminal with instant letter-grade (A+ to F) publishing."
                  }
                ].map((card, idx) => (
                  <div key={idx} className="snapflow-card p-6 rounded-2xl border border-slate-200/80 bg-white">
                    <div className="w-12 h-12 rounded-xl bg-[#e6f4f1] border border-[#bfe5dc] flex items-center justify-center mb-4">
                      {card.icon}
                    </div>
                    <h3 className="text-base font-bold text-[#0f2427] mb-2">{card.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{card.desc}</p>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* ============================================================ */}
          {/* 👥 SLIDE 1 INTEGRATION: SYSTEM USERS & RESPONSIBILITIES */}
          {/* ============================================================ */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f7faf9] border-b border-slate-100">
            <div className="max-w-6xl mx-auto">
              
              <div className="text-center max-w-2xl mx-auto mb-14">
                <span className="snapflow-pill-badge mb-3">SYSTEM ROLES & RESPONSIBILITIES</span>
                <h2 className="text-3xl font-black text-[#0f2427] tracking-tight mb-3">
                  Tailored Portals for Every Stakeholder
                </h2>
                <p className="text-slate-600 text-sm">
                  Click any role card below to jump straight into its dedicated interactive portal.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 1. Student Card */}
                <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:border-[#008766] transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-[#e6f4f1] text-[#008766] flex items-center justify-center font-bold text-xl">
                        🎓
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-[#0f2427]">Student Portal</h3>
                        <p className="text-xs text-slate-500">Engineering Teams & Capstones</p>
                      </div>
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#008766] shrink-0" />
                        <span><strong>Register & Login</strong> with Department Roll No</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#008766] shrink-0" />
                        <span><strong>Create Team Project</strong> (2 to 4 Members)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#008766] shrink-0" />
                        <span><strong>Select Faculty Guide</strong> from verified list</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#008766] shrink-0" />
                        <span><strong>Upload Deliverables</strong> (SRS, UML, Reports)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#008766] shrink-0" />
                        <span><strong>Code Collaboration</strong> & Commit History</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#008766] shrink-0" />
                        <span><strong>Submit Final Project</strong> & Review Rubric</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => setCurrentView("student_portal")}
                    className="w-full py-2.5 bg-[#e6f4f1] hover:bg-[#008766] text-[#008766] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <span>Launch Student Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 2. Faculty Card */}
                <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:border-[#008766] transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
                        👨‍🏫
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-[#0f2427]">Faculty Guide Hub</h3>
                        <p className="text-xs text-slate-500">Project Mentors & Reviewers</p>
                      </div>
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                        <span><strong>Faculty Authentication</strong> & Profile</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                        <span><strong>Accept / Decline</strong> Supervision Requests</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                        <span><strong>Monitor Team Progress</strong> & Milestones</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                        <span><strong>Provide Constructive Feedback</strong> & Chat</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                        <span><strong>5-Criteria Rubric Scoring</strong> (/100 pts)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                        <span><strong>Publish Official Grade (A+)</strong></span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => setCurrentView("faculty_hub")}
                    className="w-full py-2.5 bg-amber-50 hover:bg-amber-600 text-amber-800 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <span>Launch Faculty Hub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 3. Admin Card */}
                <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:border-[#008766] transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl">
                        🛡️
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-[#0f2427]">Admin Console</h3>
                        <p className="text-xs text-slate-500">Department Heads & Deans</p>
                      </div>
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span><strong>Administrative SSO & Security</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span><strong>Approve Student Registrations</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span><strong>Bulk Approve All</strong> pending queue</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span><strong>Manage Users & Faculty</strong> directory</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span><strong>Monitor All Department Projects</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span><strong>Audit College Compliance</strong></span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => setCurrentView("admin_console")}
                    className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-800 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <span>Launch Admin Console</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>
          </section>

          {/* ============================================================ */}
          {/* 🔄 SLIDE 2 INTEGRATION: INTERACTIVE OVERALL WORKFLOW FLOW */}
          {/* ============================================================ */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-6xl mx-auto">
              
              <div className="text-center max-w-2xl mx-auto mb-14">
                <span className="snapflow-pill-badge mb-3">COMPLETE LIFECYCLE FLOWCHART</span>
                <h2 className="text-3xl font-black text-[#0f2427] tracking-tight mb-3">
                  Overall System Workflow
                </h2>
                <p className="text-slate-600 text-sm">
                  From initial account approval to final 5-criteria thesis defense.
                </p>
              </div>

              {/* Visual Interactive Steps Flow */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { step: "01", title: "Authentication & Approval", desc: "Student registration verified by Admin with email login.", action: () => { setCurrentView("auth"); setAuthSubView("login"); } },
                  { step: "02", title: "Team & Guide Assignment", desc: "Form team (2–4) & send proposal to Faculty Guide.", action: () => { setCurrentView("student_portal"); setShowNewProjectModal(true); } },
                  { step: "03", title: "Milestones & Deliverables", desc: "Burn down IEEE SRS, UML models, and code commits.", action: () => { setCurrentView("student_portal"); setStudentTab("milestones"); } },
                  { step: "04", title: "Rubric Defense & Grade", desc: "Faculty conducts 5-criteria viva and issues official A+ grade.", action: () => { setCurrentView("faculty_hub"); setFacultyTab("evaluator"); } }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={item.action}
                    className="bg-[#f8fafc] hover:bg-[#e6f4f1] border border-slate-200 hover:border-[#008766] p-5 rounded-2xl cursor-pointer transition-all group"
                  >
                    <div className="text-xs font-extrabold text-[#008766] mb-2">{item.step}</div>
                    <h3 className="text-sm font-bold text-[#0f2427] group-hover:text-[#008766] mb-1 flex items-center justify-between">
                      <span>{item.title}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* Bottom CTA Banner */}
          <section className="py-14 px-4 bg-[#0f2427] text-white text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black mb-3">Scale Your Academic Workflows with ProjectHub</h2>
              <p className="text-xs sm:text-sm text-emerald-200/70 mb-6">
                Join engineering students, faculty guides, and college deans organizing and certifying capstone projects.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => handleDemoLogin("student")}
                  className="bg-[#008766] hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
                >
                  Student 1-Click Demo
                </button>
                <button
                  onClick={() => handleDemoLogin("faculty")}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-5 py-2.5 rounded-xl border border-white/20 transition-all"
                >
                  Faculty 1-Click Demo
                </button>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ============================================================ */}
      {/* 2. 🎓 STUDENT PORTAL VIEW (`student_portal`) */}
      {/* ============================================================ */}
      {currentView === "student_portal" && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Top Project Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                  <span className="snapflow-pill-badge !text-[11px]">Active Capstone</span>
                  <span className="text-xs text-slate-500 font-semibold">• ID: #CSE-2026-001</span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-medium">{project.domain}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0f2427] tracking-tight mb-2">
                  {project.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                  {project.abstract}
                </p>
              </div>

              {/* Progress Ring & Fast Actions */}
              <div className="flex flex-wrap items-center gap-4 shrink-0">
                <div className="bg-[#e6f4f1] border border-[#bfe5dc] p-4 rounded-2xl text-center min-w-[120px]">
                  <div className="text-2xl font-black text-[#008766]">{project.progress}%</div>
                  <div className="text-[11px] font-bold text-slate-600">Milestones Done</div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setShowSubmitFinalModal(true)}
                    className="bg-[#008766] hover:bg-[#007054] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Final Project</span>
                  </button>
                  <button
                    onClick={() => setShowNewProjectModal(true)}
                    className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#008766]" />
                    <span>+ New Project</span>
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Student Portal Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-200">
            {[
              { id: "overview", label: "📊 Overview", icon: LayoutDashboard },
              { id: "milestones", label: `🎯 Milestones (${project.milestones.length})`, icon: CheckCircle2 },
              { id: "code", label: "💻 Code Collab", icon: Code },
              { id: "files", label: `📁 Deliverables Vault (${project.files.length})`, icon: FileText },
              { id: "chat", label: `💬 Faculty Chat (${project.discussions.length})`, icon: MessageSquare },
              { id: "rubric", label: "⭐ Rubric Scorecard (A+)", icon: Award }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStudentTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  studentTab === tab.id
                    ? "bg-[#008766] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:text-[#0f2427] border border-slate-200 hover:border-slate-300"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* SUB-VIEW 1: OVERVIEW */}
          {studentTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Team Roster (2-4 Members) */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-[#0f2427] flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#008766]" />
                    <span>Team Members ({project.members.length}/4)</span>
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Allocated</span>
                </div>

                <div className="space-y-3 mb-4">
                  {project.members.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-[#0f2427] flex items-center gap-1.5">
                          <span>{m.name}</span>
                          {idx === 0 && <span className="text-[9px] bg-[#008766] text-white px-1.5 py-0.2 rounded font-semibold">Leader</span>}
                        </div>
                        <div className="text-[11px] text-slate-500">{m.roll} • {m.role}</div>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold bg-white px-2 py-0.5 rounded border border-emerald-100">Verified</span>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  * Teams must contain 2 to 4 engineering students per academic guideline.
                </p>
              </div>

              {/* Faculty Guide Assigned */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-[#0f2427] flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#008766]" />
                    <span>Faculty Supervisor</span>
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Active</span>
                </div>

                <div className="p-4 rounded-xl bg-[#e6f4f1]/50 border border-[#bfe5dc] mb-4">
                  <div className="font-bold text-sm text-[#0f2427]">{project.guide}</div>
                  <div className="text-xs text-slate-600 mb-2">Associate Professor, Computer Science</div>
                  <div className="text-xs text-[#008766] font-medium flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>arvind.verma@projecthub.edu</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setStudentTab("chat")}
                    className="flex-1 py-2 bg-[#008766] hover:bg-[#007054] text-white text-xs font-bold rounded-xl transition-all text-center"
                  >
                    Open Supervisor Chat
                  </button>
                </div>
              </div>

              {/* Quick Deliverable Summary */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-[#0f2427] flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#008766]" />
                    <span>Key Deliverables</span>
                  </h3>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="text-xs text-[#008766] font-bold hover:underline"
                  >
                    + Upload
                  </button>
                </div>

                <div className="space-y-2.5 mb-4">
                  {project.files.map((file) => (
                    <div key={file.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="truncate mr-2">
                        <div className="text-xs font-bold text-[#0f2427] truncate">{file.name}</div>
                        <div className="text-[10px] text-slate-500">{file.category} • {file.size} • {file.date}</div>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">PDF</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setStudentTab("files")}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                >
                  View All Deliverables ({project.files.length})
                </button>
              </div>

            </div>
          )}

          {/* SUB-VIEW 2: INTERACTIVE MILESTONES */}
          {studentTab === "milestones" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-black text-[#0f2427]">Capstone Milestone Burn-Down</h3>
                  <p className="text-xs text-slate-500">Click the checkbox to toggle status and recalculate progress automatically.</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500">Progress: </span>
                  <span className="text-lg font-black text-[#008766]">{project.progress}%</span>
                </div>
              </div>

              <div className="space-y-4">
                {project.milestones.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => toggleMilestone(m.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      m.status === "completed"
                        ? "bg-[#e6f4f1]/40 border-[#bfe5dc]"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                        m.status === "completed"
                          ? "bg-[#008766] border-[#008766] text-white"
                          : "border-slate-400 bg-white"
                      }`}>
                        {m.status === "completed" && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#0f2427] flex items-center gap-2">
                          <span>{m.title}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">Weight: {m.weight}%</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{m.desc}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        m.status === "completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {m.status}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" />
                        <span>Due: {m.dueDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-VIEW 3: CODE COLLAB */}
          {studentTab === "code" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-black text-[#0f2427] flex items-center gap-2">
                    <Code className="w-5 h-5 text-[#008766]" />
                    <span>In-Browser Code Repository</span>
                  </h3>
                  <p className="text-xs text-slate-500">Live source code synchronization and syntax-highlighted editor.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(project.codeSnippets[0]?.code || "");
                      showToast("Code copied to clipboard!");
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </button>
                  <button
                    onClick={() => setShowCommitModal(true)}
                    className="bg-[#008766] hover:bg-[#007054] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Commit Code</span>
                  </button>
                </div>
              </div>

              {/* Code Viewer */}
              {project.codeSnippets.map((snippet) => (
                <div key={snippet.id} className="rounded-2xl overflow-hidden border border-slate-800 bg-[#0d1b1e] text-slate-200 font-mono-code text-xs">
                  <div className="bg-[#081316] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <Terminal className="w-4 h-4" />
                      <span>{snippet.filename}</span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 uppercase">{snippet.lang}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans-modern">
                      Commit: <span className="text-slate-200">{snippet.commit}</span> by <span className="text-[#008766] font-bold">{snippet.author}</span>
                    </div>
                  </div>
                  <pre className="p-4 overflow-x-auto text-emerald-100 leading-relaxed">
                    <code>{snippet.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          )}

          {/* SUB-VIEW 4: DELIVERABLES VAULT */}
          {studentTab === "files" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-black text-[#0f2427]">Academic Deliverable Vault</h3>
                  <p className="text-xs text-slate-500">IEEE SRS documents, UML designs, progress reports, and thesis PDFs.</p>
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-[#008766] hover:bg-[#007054] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>+ Upload Deliverable</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.files.map((file) => (
                  <div key={file.id} className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-[#008766] transition-all">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-[#e6f4f1] text-[#008766] flex items-center justify-center font-bold shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full uppercase">
                        {file.category} ({file.version})
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#0f2427] mb-1">{file.name}</h4>
                    <p className="text-xs text-slate-500 mb-3">{file.desc}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                      <span>Uploaded by {file.uploadedBy}</span>
                      <span>{file.size}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-VIEW 5: CHAT & FEEDBACK */}
          {studentTab === "chat" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              <div className="mb-6">
                <h3 className="text-lg font-black text-[#0f2427]">Supervisor Guidance & Team Chat</h3>
                <p className="text-xs text-slate-500">Direct real-time consultation with {project.guide}.</p>
              </div>

              <div className="space-y-3.5 mb-6 max-h-[380px] overflow-y-auto p-2">
                {project.discussions.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-2xl max-w-xl ${
                      msg.role === "faculty"
                        ? "bg-[#e6f4f1] border border-[#bfe5dc] mr-auto"
                        : "bg-slate-100 border border-slate-200 ml-auto"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <span className={`text-xs font-bold ${msg.role === "faculty" ? "text-[#008766]" : "text-slate-800"}`}>
                        {msg.sender} {msg.role === "faculty" && "(Faculty Supervisor)"}
                      </span>
                      <span className="text-[10px] text-slate-400">{msg.time}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="flex gap-2">
                <input
                  type="text"
                  value={newChatMsg}
                  onChange={(e) => setNewChatMsg(e.target.value)}
                  placeholder="Ask a question or provide progress update to your supervisor..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                />
                <button
                  type="submit"
                  className="bg-[#008766] hover:bg-[#007054] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}

          {/* SUB-VIEW 6: RUBRIC & FINAL EVALUATION */}
          {studentTab === "rubric" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <span className="snapflow-pill-badge mb-2">OFFICIAL SCORECARD</span>
                  <h3 className="text-2xl font-black text-[#0f2427]">5-Criteria Academic Rubric Evaluation</h3>
                  <p className="text-xs text-slate-500">Evaluated by {project.evaluation?.evaluator || project.guide} on {project.evaluation?.date || "Sep 22, 2026"}</p>
                </div>

                <div className="bg-[#e6f4f1] border border-[#bfe5dc] p-4 rounded-2xl text-center min-w-[140px]">
                  <div className="text-3xl font-black text-[#008766]">{project.evaluation?.total || 95}/100</div>
                  <div className="text-xs font-bold text-emerald-800">Grade: {project.evaluation?.grade || "A+"}</div>
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[
                  { name: "1. Problem & Literature", score: project.evaluation?.presentation || 19, max: 20 },
                  { name: "2. Architecture & Code", score: project.evaluation?.codeQuality || 24, max: 25 },
                  { name: "3. Execution & Milestones", score: project.evaluation?.innovation || 24, max: 25 },
                  { name: "4. IEEE Deliverables", score: project.evaluation?.documentation || 14, max: 15 },
                  { name: "5. Viva Voce Defense", score: project.evaluation?.viva || 14, max: 15 }
                ].map((crit, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-slate-700 mb-1">{crit.name}</div>
                    <div className="text-xl font-extrabold text-[#008766]">{crit.score} <span className="text-xs text-slate-400 font-normal">/ {crit.max} pts</span></div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-[#008766] h-full rounded-full" style={{ width: `${(crit.score / crit.max) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Remarks Card */}
              <div className="p-5 rounded-2xl bg-[#e6f4f1]/50 border border-[#bfe5dc]">
                <h4 className="text-xs font-bold text-[#008766] uppercase tracking-wider mb-1">Supervisor Remarks & Signoff:</h4>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{project.evaluation?.remarks || "Outstanding capstone implementation. Clean dockerized sandbox and AST static scanner meets university standards."}"
                </p>
              </div>
            </div>
          )}

        </main>
      )}

      {/* ============================================================ */}
      {/* 3. 👨‍🏫 FACULTY GUIDE HUB (`faculty_hub`) */}
      {/* ============================================================ */}
      {currentView === "faculty_hub" && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Faculty Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="snapflow-pill-badge mb-2">FACULTY SUPERVISOR PORTAL</span>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0f2427]">Prof. Arvind Verma</h1>
                <p className="text-xs sm:text-sm text-slate-600">Department of Computer Science & Engineering • 2 Supervised Projects</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-[#e6f4f1] border border-[#bfe5dc] px-4 py-2.5 rounded-2xl text-center">
                  <div className="text-lg font-black text-[#008766]">1 Pending</div>
                  <div className="text-[10px] font-bold text-slate-600">Guide Request</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-200">
            {[
              { id: "requests", label: `📥 Guide Requests (${guideRequests.filter(r => r.status === 'pending').length})` },
              { id: "projects", label: "📋 Supervised Projects (2)" },
              { id: "evaluator", label: "⭐ 5-Criteria Rubric Evaluator (/100)" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFacultyTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  facultyTab === tab.id
                    ? "bg-[#008766] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:text-[#0f2427] border border-slate-200 hover:border-slate-300"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* TAB 1: GUIDE REQUESTS */}
          {facultyTab === "requests" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              <h3 className="text-lg font-black text-[#0f2427] mb-2">Incoming Supervision Proposals</h3>
              <p className="text-xs text-slate-500 mb-6">Review student project applications and decide to accept or reject.</p>

              <div className="space-y-4">
                {guideRequests.map((req) => (
                  <div key={req.id} className="p-5 rounded-2xl border border-slate-200 bg-[#f8fafc] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-[#0f2427]">{req.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${req.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {req.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600">{req.leader} • {req.members}</div>
                      <div className="text-[11px] text-slate-400 mt-1">Domain: {req.domain} • Submitted: {req.submittedDate}</div>
                    </div>

                    {req.status === "pending" ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setGuideRequests(guideRequests.map(r => r.id === req.id ? { ...r, status: "accepted" } : r));
                            showToast("Proposal Accepted! Added to supervised projects list.");
                          }}
                          className="bg-[#008766] hover:bg-[#007054] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                        >
                          Accept Proposal
                        </button>
                        <button
                          onClick={() => {
                            setGuideRequests(guideRequests.map(r => r.id === req.id ? { ...r, status: "declined" } : r));
                            showToast("Proposal Declined.");
                          }}
                          className="bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold px-4 py-2 rounded-xl transition-all"
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-emerald-600">✓ Proposal Approved</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SUPERVISED PROJECTS */}
          {facultyTab === "projects" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="snapflow-pill-badge !text-[10px]">Team DevSphere</span>
                  <span className="text-xs font-bold text-[#008766]">75% Done</span>
                </div>
                <h4 className="text-base font-bold text-[#0f2427] mb-2">{project.title}</h4>
                <p className="text-xs text-slate-500 mb-4 line-clamp-2">{project.abstract}</p>
                <div className="text-xs text-slate-600 mb-4">
                  Leader: <strong>Aarav Sharma</strong> • 3 Members • 2 Deliverables Uploaded
                </div>
                <button
                  onClick={() => { setFacultyTab("evaluator"); }}
                  className="w-full py-2 bg-[#008766] hover:bg-[#007054] text-white text-xs font-bold rounded-xl transition-all"
                >
                  Open 5-Criteria Rubric Evaluator
                </button>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="snapflow-pill-badge !text-[10px]">Team NeuroScan</span>
                  <span className="text-xs font-bold text-emerald-600">100% (A+)</span>
                </div>
                <h4 className="text-base font-bold text-[#0f2427] mb-2">NeuroScan: Multimodal MRI Brain Tumor Segmentation</h4>
                <p className="text-xs text-slate-500 mb-4 line-clamp-2">Clinical deep learning pipeline with 3D-UNet and Grad-CAM explainability.</p>
                <div className="text-xs text-slate-600 mb-4">
                  Leader: <strong>Neha Singh</strong> • 2 Members • Grade Issued: <strong>95/100 (A+)</strong>
                </div>
                <button
                  onClick={() => showToast("Viewing NeuroScan evaluation records")}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                >
                  View Final Evaluation Record
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: RUBRIC EVALUATOR */}
          {facultyTab === "evaluator" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="snapflow-pill-badge mb-2">OFFICIAL SCORING TERMINAL</span>
                  <h3 className="text-xl font-black text-[#0f2427]">5-Criteria Capstone Rubric</h3>
                  <p className="text-xs text-slate-500">Evaluating: {project.title} (Team DevSphere)</p>
                </div>

                <div className="bg-[#e6f4f1] border border-[#bfe5dc] p-4 rounded-2xl text-center min-w-[140px]">
                  <div className="text-3xl font-black text-[#008766]">{liveTotalScore}/100</div>
                  <div className="text-xs font-bold text-emerald-800">Grade: {liveGrade}</div>
                </div>
              </div>

              {/* Interactive Sliders */}
              <div className="space-y-5 mb-6">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-2">
                    <span>1. Problem Definition & Literature Review (Max: 20)</span>
                    <span className="text-[#008766] font-black text-sm">{evalProblem} pts</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={evalProblem}
                    onChange={(e) => setEvalProblem(Number(e.target.value))}
                    className="w-full accent-[#008766] cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-2">
                    <span>2. System Architecture & Code Implementation (Max: 25)</span>
                    <span className="text-[#008766] font-black text-sm">{evalCode} pts</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    value={evalCode}
                    onChange={(e) => setEvalCode(Number(e.target.value))}
                    className="w-full accent-[#008766] cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-2">
                    <span>3. Execution & Milestone Delivery (Max: 25)</span>
                    <span className="text-[#008766] font-black text-sm">{evalExecution} pts</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    value={evalExecution}
                    onChange={(e) => setEvalExecution(Number(e.target.value))}
                    className="w-full accent-[#008766] cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-2">
                    <span>4. IEEE Deliverables & Documentation (Max: 15)</span>
                    <span className="text-[#008766] font-black text-sm">{evalDoc} pts</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={evalDoc}
                    onChange={(e) => setEvalDoc(Number(e.target.value))}
                    className="w-full accent-[#008766] cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-2">
                    <span>5. Viva Voce Defense & Q&A (Max: 15)</span>
                    <span className="text-[#008766] font-black text-sm">{evalViva} pts</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={evalViva}
                    onChange={(e) => setEvalViva(Number(e.target.value))}
                    className="w-full accent-[#008766] cursor-pointer"
                  />
                </div>
              </div>

              {/* Remarks Text Area */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 mb-2">Supervisor Remarks & Feedback:</label>
                <textarea
                  rows={3}
                  value={evalRemarks}
                  onChange={(e) => setEvalRemarks(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                />
              </div>

              <button
                onClick={handlePublishEvaluation}
                className="w-full py-3 bg-[#008766] hover:bg-[#007054] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>Publish Official 5-Criteria Evaluation ({liveTotalScore}/100 • Grade {liveGrade})</span>
              </button>
            </div>
          )}

        </main>
      )}

      {/* ============================================================ */}
      {/* 4. 🛡️ ADMINISTRATOR CONSOLE (`admin_console`) */}
      {/* ============================================================ */}
      {currentView === "admin_console" && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Admin Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="snapflow-pill-badge mb-2">ACADEMIC DEAN & ADMIN CONSOLE</span>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0f2427]">Dr. Rajesh Mehta</h1>
                <p className="text-xs sm:text-sm text-slate-600">Dean of Academics • University Engineering Board</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setPendingStudents([]);
                    showToast("All pending registrations approved!");
                  }}
                  className="bg-[#008766] hover:bg-[#007054] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Bulk Approve All ({pendingStudents.length})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-200">
            {[
              { id: "approvals", label: `⏳ Student Registrations (${pendingStudents.length})` },
              { id: "users", label: `👥 User Directory (${registeredUsers.length})` },
              { id: "projects", label: "📁 All College Projects (2)" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  adminTab === tab.id
                    ? "bg-[#008766] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:text-[#0f2427] border border-slate-200 hover:border-slate-300"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* TAB 1: PENDING APPROVALS */}
          {adminTab === "approvals" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              <h3 className="text-lg font-black text-[#0f2427] mb-2">Student Verification Queue</h3>
              <p className="text-xs text-slate-500 mb-6">Verify student enrollments before granting access to ProjectHub portals.</p>

              {pendingStudents.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs font-bold">
                  ✓ No pending approvals! All student accounts are verified.
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingStudents.map((st) => (
                    <div key={st.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-[#0f2427]">{st.name} ({st.roll})</div>
                        <div className="text-[11px] text-slate-500">{st.dept} • {st.email}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setPendingStudents(pendingStudents.filter(p => p.id !== st.id));
                            showToast(`Approved ${st.name}!`);
                          }}
                          className="bg-[#008766] hover:bg-[#007054] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setPendingStudents(pendingStudents.filter(p => p.id !== st.id));
                            showToast(`Rejected registration for ${st.name}`);
                          }}
                          className="text-rose-600 hover:bg-rose-50 text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: USER DIRECTORY */}
          {adminTab === "users" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              <h3 className="text-lg font-black text-[#0f2427] mb-4">University User Directory</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-3">Name</th>
                      <th className="py-3 px-3">Role</th>
                      <th className="py-3 px-3">Department</th>
                      <th className="py-3 px-3">Email</th>
                      <th className="py-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {registeredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-bold text-[#0f2427]">{u.name}</td>
                        <td className="py-3 px-3 text-[#008766] font-semibold">{u.role}</td>
                        <td className="py-3 px-3 text-slate-600">{u.dept}</td>
                        <td className="py-3 px-3 text-slate-500">{u.email}</td>
                        <td className="py-3 px-3"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Active</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ALL PROJECTS AUDIT */}
          {adminTab === "projects" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              <h3 className="text-lg font-black text-[#0f2427] mb-4">Cross-Departmental Project Audit</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#0f2427]">DevSphere: Cloud IDE & Review Engine</h4>
                    <p className="text-xs text-slate-500">Computer Science • Guide: Prof. Arvind Verma • 3 Members</p>
                  </div>
                  <span className="text-xs font-bold text-[#008766]">75% Progress</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#0f2427]">NeuroScan: Multimodal MRI Brain Segmentation</h4>
                    <p className="text-xs text-slate-500">AI & Data Science • Guide: Dr. Anita Deshmukh • 2 Members</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">100% Completed (A+)</span>
                </div>
              </div>
            </div>
          )}

        </main>
      )}

      {/* ============================================================ */}
      {/* 5. 🔐 AUTHENTICATION VIEW (`auth`) */}
      {/* ============================================================ */}
      {currentView === "auth" && (
        <main className="flex-1 flex items-center justify-center p-4 snapflow-hero-bg">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/90 shadow-2xl">
            
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#008766] flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3 shadow-md shadow-emerald-700/20">
                P
              </div>
              <h2 className="text-2xl font-black text-[#0f2427]">ProjectHub Sign In</h2>
              <p className="text-xs text-slate-500">Choose your academic role to proceed</p>
            </div>

            {/* Role Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6 text-xs font-bold">
              <button
                onClick={() => setAuthRoleTab("student")}
                className={`flex-1 py-2 rounded-lg transition-all ${authRoleTab === "student" ? "bg-white text-[#008766] shadow-xs" : "text-slate-500"}`}
              >
                🎓 Student
              </button>
              <button
                onClick={() => setAuthRoleTab("faculty")}
                className={`flex-1 py-2 rounded-lg transition-all ${authRoleTab === "faculty" ? "bg-white text-[#008766] shadow-xs" : "text-slate-500"}`}
              >
                👨‍🏫 Faculty
              </button>
              <button
                onClick={() => setAuthRoleTab("admin")}
                className={`flex-1 py-2 rounded-lg transition-all ${authRoleTab === "admin" ? "bg-white text-[#008766] shadow-xs" : "text-slate-500"}`}
              >
                🛡️ Admin
              </button>
            </div>

            {/* Instant 1-Click Demo */}
            <button
              onClick={() => handleDemoLogin(authRoleTab)}
              className="w-full mb-4 py-3 bg-[#e6f4f1] hover:bg-[#d4ede7] text-[#008766] border border-[#bfe5dc] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Instant 1-Click {authRoleTab.toUpperCase()} Demo</span>
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-[10px] uppercase font-bold text-slate-400">or with credentials</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {/* Form Inputs */}
            <form onSubmit={(e) => { e.preventDefault(); handleDemoLogin(authRoleTab); }} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email / Roll Number</label>
                <input
                  type="text"
                  placeholder={authRoleTab === "student" ? "aarav.sharma@projecthub.edu" : authRoleTab === "faculty" ? "arvind.verma@projecthub.edu" : "admin@projecthub.edu"}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#008766] hover:bg-[#007054] text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Sign In to {authRoleTab.toUpperCase()} Portal
              </button>
            </form>

            <div className="text-center mt-6">
              <button
                onClick={() => setCurrentView("public")}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                ← Back to Homepage
              </button>
            </div>

          </div>
        </main>
      )}

      {/* ============================================================ */}
      {/* 📹 TOUR MODAL */}
      {/* ============================================================ */}
      {showTourModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setShowTourModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="snapflow-pill-badge mb-2">STEP {tourStep} OF 4</span>
              <h3 className="text-xl font-black text-[#0f2427]">
                {tourStep === 1 && "1. Registration & 2-4 Member Team Formation"}
                {tourStep === 2 && "2. Selecting Verified Faculty Guide"}
                {tourStep === 3 && "3. Milestone Tracking & Deliverables Vault"}
                {tourStep === 4 && "4. 5-Criteria Rubric Evaluation & Grade"}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              {tourStep === 1 && "Students register with academic roll numbers, awaiting admin approval. Teams of 2 to 4 members are formed with assigned technical roles."}
              {tourStep === 2 && "Teams browse available faculty supervisors by research domain and submit project proposals for approval."}
              {tourStep === 3 && "Track IEEE SRS, UML architectures, code commits, and progress reports in a centralized secure vault."}
              {tourStep === 4 && "Faculty evaluators conduct the defense and publish standardized scores across 5 criteria totaling 100 points."}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setTourStep(Math.max(1, tourStep - 1))}
                disabled={tourStep === 1}
                className="text-xs font-bold text-slate-400 disabled:opacity-30 hover:text-slate-700"
              >
                Previous
              </button>

              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map(s => (
                  <div key={s} className={`w-2.5 h-2.5 rounded-full ${s === tourStep ? "bg-[#008766]" : "bg-slate-200"}`}></div>
                ))}
              </div>

              {tourStep < 4 ? (
                <button
                  onClick={() => setTourStep(tourStep + 1)}
                  className="bg-[#008766] hover:bg-[#007054] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={() => { setShowTourModal(false); setCurrentView("student_portal"); }}
                  className="bg-[#008766] hover:bg-[#007054] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                >
                  Start Demo →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ✨ AI THESIS & CODE AUDIT MODAL */}
      {/* ============================================================ */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setShowAiModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <Sparkles className="w-5 h-5 text-[#008766]" />
              <h3 className="text-xl font-black text-[#0f2427]">AI Thesis & Research Assistant</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">Brainstorm novel IEEE capstone topics or perform AST security audit.</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Enter Domain / Research Interest:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiTopicInput}
                    onChange={(e) => setAiTopicInput(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                  />
                  <button
                    onClick={() => {
                      setAiResult(`💡 Recommended Capstone Topics for "${aiTopicInput}":\n\n1. "Zero-Trust Microservices Orchestrator with eBPF Kernel Observability"\n2. "Decentralized Federated Learning for Medical DICOM Image Analysis"\n3. "Automated AST Vulnerability Remediation using LLM Heuristics"`);
                    }}
                    className="bg-[#008766] hover:bg-[#007054] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shrink-0"
                  >
                    Brainstorm
                  </button>
                </div>
              </div>

              {aiResult && (
                <div className="p-4 rounded-2xl bg-[#e6f4f1]/60 border border-[#bfe5dc] text-xs text-slate-800 whitespace-pre-line leading-relaxed font-mono-code">
                  {aiResult}
                </div>
              )}
            </div>

            <div className="text-right">
              <button
                onClick={() => setShowAiModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ➕ CREATE PROJECT MODAL (2-4 MEMBERS & GUIDE SELECTION) */}
      {/* ============================================================ */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setShowNewProjectModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#0f2427] mb-1">Create Team Project</h3>
            <p className="text-xs text-slate-500 mb-6">Allocate 2 to 4 members and select your department guide.</p>

            <form onSubmit={(e) => {
              e.preventDefault();
              setShowNewProjectModal(false);
              showToast("New project proposal created successfully!");
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Autonomous Edge Computing Cluster"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Faculty Guide</label>
                <select
                  value={formGuide}
                  onChange={(e) => setFormGuide(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                >
                  {FACULTY_GUIDES.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.domain})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Team Members (2–4 Students)</label>
                <div className="space-y-2">
                  <input type="text" value="Aarav Sharma (Leader - CS2022-041)" disabled className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600" />
                  <input type="text" placeholder="Member 2 Name & Roll No" defaultValue="Priya Patel (CS2022-089)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800" />
                  <input type="text" placeholder="Member 3 Name & Roll No (Optional)" defaultValue="Rohan Gupta (CS2022-112)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#008766] hover:bg-[#007054] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs"
                >
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 📁 UPLOAD DELIVERABLE MODAL */}
      {/* ============================================================ */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#0f2427] mb-1">Upload Academic Deliverable</h3>
            <p className="text-xs text-slate-500 mb-6">Store IEEE SRS, architecture diagrams, or progress reports.</p>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!uploadDocName) return;
              const newFile: FileItem = {
                id: Date.now(),
                name: uploadDocName.endsWith(".pdf") ? uploadDocName : `${uploadDocName}.pdf`,
                category: uploadCategory,
                version: "v1.0",
                size: "1,250 KB",
                uploadedBy: "Aarav Sharma",
                date: "Sep 23, 2026",
                desc: `Submitted deliverable for ${uploadCategory} stage.`
              };
              setProject({ ...project, files: [newFile, ...project.files] });
              setShowUploadModal(false);
              setUploadDocName("");
              showToast(`Uploaded ${newFile.name} successfully!`);
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Document Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., DevSphere_Final_Thesis_v1.0.pdf"
                  value={uploadDocName}
                  onChange={(e) => setUploadDocName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                >
                  <option value="SRS">IEEE SRS Document</option>
                  <option value="Design">UML / System Architecture</option>
                  <option value="Report">Milestone Progress Report</option>
                  <option value="Thesis">Final Dissertation / Thesis</option>
                  <option value="Other">Other Deliverable</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#008766] hover:bg-[#007054] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs"
                >
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 📤 SUBMIT FINAL PROJECT MODAL */}
      {/* ============================================================ */}
      {showSubmitFinalModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setShowSubmitFinalModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#0f2427] mb-1">Submit Final Capstone Project</h3>
            <p className="text-xs text-slate-500 mb-6">Submit final thesis PDF, Git repository URL, and staging demo link for official grading.</p>

            <form onSubmit={(e) => {
              e.preventDefault();
              setProject({
                ...project,
                status: "submitted",
                finalSubmission: {
                  thesisFile: "DevSphere_Final_Capstone_Thesis_v1.0.pdf",
                  repoUrl: "https://github.com/projecthub-team/devsphere-cloud-ide",
                  demoUrl: "https://devsphere.demo.projecthub.edu",
                  submittedAt: "Sep 23, 2026",
                  notes: "Final capstone submission ready for faculty rubric evaluation."
                }
              });
              setShowSubmitFinalModal(false);
              showToast("Final Capstone submitted! Notified Faculty Supervisor.");
            }} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">GitHub / GitLab Repository URL</label>
                <input
                  type="url"
                  required
                  defaultValue="https://github.com/projecthub-team/devsphere-cloud-ide"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Live Staging / Demo URL</label>
                <input
                  type="url"
                  required
                  defaultValue="https://devsphere.demo.projecthub.edu"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Thesis / Dissertation PDF File</label>
                <input
                  type="text"
                  required
                  defaultValue="DevSphere_Final_Capstone_Thesis_v1.0.pdf"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSubmitFinalModal(false)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#008766] hover:bg-[#007054] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs"
                >
                  Submit Final Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 💻 COMMIT CODE MODAL */}
      {/* ============================================================ */}
      {showCommitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setShowCommitModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#0f2427] mb-1">Commit Code to Repository</h3>
            <p className="text-xs text-slate-500 mb-6">Sync new code snippet with your team's online workspace.</p>

            <form onSubmit={(e) => {
              e.preventDefault();
              setShowCommitModal(false);
              showToast("Code committed and synchronized!");
            }} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Commit Message</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Implement Docker network bridge isolation"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Filename</label>
                <input
                  type="text"
                  required
                  defaultValue="sandbox_runner.py"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCommitModal(false)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#008766] hover:bg-[#007054] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs"
                >
                  Push Commit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 🚪 LOGOUT CONFIRMATION MODAL */}
      {/* ============================================================ */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl relative text-center">
            
            {/* Close Button */}
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
              <LogOut className="w-7 h-7 text-rose-600" />
            </div>

            {/* Title & Description */}
            <h3 className="text-xl font-black text-[#0f2427] mb-2">Confirm Sign Out</h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
              Are you sure you want to log out of <strong>ProjectHub</strong>? Your active workspace and milestone progress are securely saved.
            </p>

            {/* Current Active Session Info Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 mb-6 text-left flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#008766] text-white flex items-center justify-center font-bold text-base shrink-0">
                {currentView === "student_portal" ? "🎓" : currentView === "faculty_hub" ? "👨‍🏫" : "🛡️"}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-[#0f2427]">
                  {currentView === "student_portal" ? "Aarav Sharma (Student Leader)" : currentView === "faculty_hub" ? "Prof. Arvind Verma (Faculty Guide)" : "Dr. Rajesh Mehta (Dean of Academics)"}
                </div>
                <div className="text-[11px] text-slate-500">
                  {currentView === "student_portal" ? "Computer Science • Team DevSphere" : currentView === "faculty_hub" ? "Supervising 2 Active Capstones" : "Academic Board Administration"}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  setCurrentView("public");
                  showToast("Logged out successfully. Have a great day!");
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Yes, Log Out
              </button>
            </div>

          </div>
        </div>
      )}
      <footer className="bg-white border-t border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#008766] flex items-center justify-center text-white font-bold text-xs">
              P
            </div>
            <span className="font-bold text-[#0f2427]">ProjectHub</span>
            <span>— Academic Collaboration Platform</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView("public")} className="hover:text-[#008766] transition-colors">Home</button>
            <button onClick={() => setCurrentView("student_portal")} className="hover:text-[#008766] transition-colors">Student Portal</button>
            <button onClick={() => setCurrentView("faculty_hub")} className="hover:text-[#008766] transition-colors">Faculty Hub</button>
            <button onClick={() => setCurrentView("admin_console")} className="hover:text-[#008766] transition-colors">Admin Console</button>
          </div>

          <div>© 2026 ProjectHub Inc. All rights reserved.</div>
        </div>
      </footer>

    </div>
  );
}
