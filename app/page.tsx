"use client";

import React, { useState, useEffect } from "react";
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
  LogIn,
  UserPlus,
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
  ArrowLeft,
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
  EyeOff,
  KeyRound,
  LayoutDashboard,
  Filter,
  ArrowUpRight,
  GitPullRequest,
  GitBranch,
  GitCommit,
  QrCode,
  Share2,
  MessageCircle,
  AlertCircle,
  Trash2,
  Edit3,
  CheckCheck
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
  branch?: string;
}

export interface Issue {
  id: number;
  title: string;
  desc: string;
  label: "bug" | "feature" | "enhancement" | "task" | "docs";
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "open" | "closed";
  creator: string;
  assignee: string;
  comments: { id: number; author: string; text: string; time: string }[];
  createdAt: string;
}

export interface PullRequest {
  id: number;
  title: string;
  desc: string;
  sourceBranch: string;
  targetBranch: string;
  status: "open" | "merged" | "closed";
  author: string;
  createdAt: string;
  mergedBy?: string;
}

export interface ActivityItem {
  id: number;
  title: string;
  desc?: string;
  time: string;
  type: "commit" | "pr" | "issue" | "join" | "file";
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
  inviteCode: string;
  members: Member[];
  milestones: Milestone[];
  files: FileItem[];
  codeSnippets: CodeSnippet[];
  issues: Issue[];
  pullRequests: PullRequest[];
  activities: ActivityItem[];
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
  inviteCode: "hub_wy-y-ebtzRI",
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
      filename: "README.md",
      lang: "markdown",
      author: "Aarav Sharma",
      commit: "Initial repository setup with architecture guidelines",
      branch: "main",
      code: `# DevSphere – AI Cloud IDE & Code Review Engine

> A centralized cloud developer workspace integrating containerized sandboxes, AST security reviews, and multi-member team collaboration.

## 🚀 Key Modules
- **Container Sandbox**: Docker worker runner with 512MB RAM quotas
- **AST Security Parser**: Heuristic static vulnerability detector
- **Live Collaboration**: WebSocket terminal & synchronized editor

## 👥 Core Team
- **Aarav Sharma** (Leader & Backend)
- **Priya Patel** (Frontend Lead & UI/UX)
- **Rohan Gupta** (DevOps & Infrastructure)
`
    },
    {
      id: 2,
      filename: "sandbox_runner.py",
      lang: "python",
      author: "Aarav Sharma",
      commit: "Implement secure resource-constrained Docker container runtime",
      branch: "main",
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
    },
    {
      id: 3,
      filename: "auth_middleware.py",
      lang: "python",
      author: "Priya Patel",
      commit: "Add JWT token validation & CORS policies",
      branch: "main",
      code: `from functools import wraps
import jwt
from flask import request, jsonify

SECRET_KEY = "projecthub-devsphere-jwt-secret"

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Token is missing"}), 401
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = data["user_id"]
        except Exception as e:
            return jsonify({"error": "Invalid or expired token"}), 401
        return f(current_user, *args, **kwargs)
    return decorated`
    }
  ],
  issues: [
    {
      id: 1,
      title: "Optimize Docker WebSocket terminal latency",
      desc: "Investigate socket chunk buffering when streaming high-throughput compiler stdout to the client.",
      label: "enhancement",
      priority: "High",
      status: "open",
      creator: "Aarav Sharma",
      assignee: "Rohan Gupta",
      comments: [
        { id: 1, author: "Rohan Gupta", text: "Benchmarked 40ms drop using binary buffer frames. Pushing PR shortly.", time: "1h ago" }
      ],
      createdAt: "Today"
    },
    {
      id: 2,
      title: "Add AST parameter validation for SQL queries",
      desc: "Flag raw string concatenation inside DB cursor executes across Python files.",
      label: "feature",
      priority: "Critical",
      status: "open",
      creator: "Prof. Arvind Verma",
      assignee: "Aarav Sharma",
      comments: [],
      createdAt: "Yesterday"
    },
    {
      id: 3,
      title: "Fix Monaco Editor theme flash on dark mode toggle",
      desc: "Theme provider state sync on initial mount causing white flicker.",
      label: "bug",
      priority: "Medium",
      status: "closed",
      creator: "Priya Patel",
      assignee: "Priya Patel",
      comments: [{ id: 2, author: "Priya Patel", text: "Resolved by caching theme token in localStorage.", time: "2d ago" }],
      createdAt: "3d ago"
    }
  ],
  pullRequests: [
    {
      id: 1,
      title: "Feature: Redis Cache Layer & AST Security Rules",
      desc: "Adds distributed token rate limiter and 14 new AST visitor rules for SQLi and XSS protection.",
      sourceBranch: "feature/redis-ast",
      targetBranch: "main",
      status: "open",
      author: "Priya Patel",
      createdAt: "2h ago"
    }
  ],
  activities: [
    { id: 1, title: "Aarav Sharma committed 'sandbox_runner.py'", desc: "Implement secure resource-constrained Docker container runtime", time: "Just now", type: "commit" },
    { id: 2, title: "Priya Patel opened Pull Request #1", desc: "Feature: Redis Cache Layer & AST Security Rules", time: "2h ago", type: "pr" },
    { id: 3, title: "Rohan Gupta commented on Issue #1", desc: "Benchmarked 40ms drop using binary buffer frames.", time: "3h ago", type: "issue" },
    { id: 4, title: "Priya Patel uploaded 'System_Architecture_Diagrams.pdf'", desc: "Design Deliverable v1.0", time: "Sep 02, 2026", type: "file" }
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

export interface CurrentUser {
  name: string;
  role: "student" | "faculty" | "admin";
  roleLabel: string;
  email: string;
  roll: string;
  dept: string;
  handle?: string;
}

export default function ProjectHubApp() {
  // Navigation & Role State
  const [currentView, setCurrentView] = useState<"public" | "about" | "roles" | "student_portal" | "faculty_hub" | "admin_console" | "auth">("public");
  const [authSubView, setAuthSubView] = useState<"login" | "register" | "forgot">("login");
  const [authRoleTab, setAuthRoleTab] = useState<"student" | "faculty" | "admin">("student");

  // Active Logged-in User State (null when logged out)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // Sub-tabs inside portals
  const [studentTab, setStudentTab] = useState<"overview" | "team" | "code" | "issues" | "prs" | "activity" | "milestones" | "files" | "chat" | "rubric">("overview");
  const [facultyTab, setFacultyTab] = useState<"requests" | "projects" | "evaluator">("requests");
  const [adminTab, setAdminTab] = useState<"approvals" | "users" | "projects">("approvals");

  // Core Data State
  const [project, setProject] = useState<Project>(INITIAL_PROJECT);
  
  // GitHub Collaboration & Invite Modals State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showJoinSimModal, setShowJoinSimModal] = useState(false);
  const [showNewIssueModal, setShowNewIssueModal] = useState(false);
  const [showNewPrModal, setShowNewPrModal] = useState(false);
  const [showNewCodeFileModal, setShowNewCodeFileModal] = useState(false);

  // Invite Simulation Form
  const [newMemberName, setNewMemberName] = useState("Kunal Verma");
  const [newMemberRole, setNewMemberRole] = useState("AI / ML Specialist & Data Pipeline");
  const [newMemberEmail, setNewMemberEmail] = useState("kunal.verma@projecthub.edu");

  // Issues Form State
  const [issueFilter, setIssueFilter] = useState<"all" | "open" | "closed">("open");
  const [newIssueTitle, setNewIssueTitle] = useState("");
  const [newIssueDesc, setNewIssueDesc] = useState("");
  const [newIssueLabel, setNewIssueLabel] = useState<"bug" | "feature" | "enhancement" | "task" | "docs">("enhancement");
  const [newIssuePriority, setNewIssuePriority] = useState<"Critical" | "High" | "Medium" | "Low">("Medium");
  const [newIssueAssignee, setNewIssueAssignee] = useState("Aarav Sharma");
  const [issueCommentInput, setIssueCommentInput] = useState<{ [key: number]: string }>({});

  // PR Form State
  const [newPrTitle, setNewPrTitle] = useState("");
  const [newPrDesc, setNewPrDesc] = useState("");
  const [newPrSource, setNewPrSource] = useState("feature/new-module");
  const [newPrTarget, setNewPrTarget] = useState("main");

  // Code Studio State
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [editedCodeContent, setEditedCodeContent] = useState("");
  const [commitMsgInput, setCommitMsgInput] = useState("Update module implementation");
  const [newFileName, setNewFileName] = useState("");
  const [newFileLang, setNewFileLang] = useState("python");
  const [newFileContent, setNewFileContent] = useState("");
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
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([
    { id: 1, name: "Aarav Sharma", roll: "CS2022-041", handle: "@aarav123", role: "Student Leader", dept: "Computer Science", email: "aarav.sharma@projecthub.edu", password: "student@123", status: "Active" },
    { id: 2, name: "Priya Patel", roll: "CS2022-089", handle: "@priya123", role: "Student Member", dept: "Computer Science", email: "priya.patel@projecthub.edu", password: "student@123", status: "Active" },
    { id: 3, name: "Rohan Gupta", roll: "CS2022-112", handle: "@rohan123", role: "Student Member", dept: "Computer Science", email: "rohan.gupta@projecthub.edu", password: "student@123", status: "Active" },
    { id: 4, name: "Prof. Arvind Verma", roll: "FAC-CSE-004", handle: "@arvind123", role: "Faculty Guide", dept: "Computer Science", email: "arvind.verma@projecthub.edu", password: "faculty@123", status: "Active" },
    { id: 5, name: "Dr. Anita Deshmukh", roll: "FAC-AI-012", handle: "@anita123", role: "Faculty Guide", dept: "Artificial Intelligence", email: "anita.deshmukh@projecthub.edu", password: "faculty@123", status: "Active" },
    { id: 6, name: "Dr. Rajesh Mehta", roll: "ADM-DEAN-001", handle: "@admin123", role: "Administrator", dept: "Dean of Academics", email: "admin@projecthub.edu", password: "admin@123", status: "Active" }
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
  const [showFacultyRoleModal, setShowFacultyRoleModal] = useState(false);

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

  // Registration & Auth Form State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [regName, setRegName] = useState("");
  const [regHandle, setRegHandle] = useState("");
  const [regRoll, setRegRoll] = useState("");
  const [regDept, setRegDept] = useState("Computer Science & Engineering");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  // Storage keys for real-time collaboration persistence
  const STORAGE_KEY = "projecthub_capstone_data_v2";
  const USER_STORAGE_KEY = "projecthub_active_user_v2";

  // Load initial data from localStorage on mount & listen for real-time changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setProject(JSON.parse(saved));
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECT));
        }
      } catch (e) {}

      try {
        const savedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (savedUser) {
          const u = JSON.parse(savedUser);
          setCurrentUser(u);
          if (u.role === "student") setCurrentView("student_portal");
          else if (u.role === "faculty") setCurrentView("faculty_hub");
          else if (u.role === "admin") setCurrentView("admin_console");
        }
      } catch (e) {}

      // Cross-tab real-time sync via StorageEvent
      const handleStorage = (e: StorageEvent) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            setProject(JSON.parse(e.newValue));
          } catch (err) {}
        }
        if (e.key === USER_STORAGE_KEY && e.newValue) {
          try {
            const u = JSON.parse(e.newValue);
            setCurrentUser(u);
          } catch (err) {}
        }
      };
      window.addEventListener("storage", handleStorage);

      // BroadcastChannel for instant same-origin sync
      let channel: BroadcastChannel | null = null;
      try {
        channel = new BroadcastChannel("projecthub_collab_channel");
        channel.onmessage = (event) => {
          if (event.data?.project) {
            setProject(event.data.project);
          }
        };
      } catch (err) {}

      return () => {
        window.removeEventListener("storage", handleStorage);
        if (channel) channel.close();
      };
    }
  }, []);

  // Persist project changes to localStorage whenever project updates
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
      try {
        const channel = new BroadcastChannel("projecthub_collab_channel");
        channel.postMessage({ type: "PROJECT_UPDATE", project });
        channel.close();
      } catch (e) {}
    }
  }, [project]);

  // Persist active user to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (currentUser) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
  }, [currentUser]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Quick autofill sample data for fast testing / demonstration
  const handleQuickFillRegistration = (role: "student" | "faculty" | "admin") => {
    if (role === "student") {
      setRegName("Kunal Verma");
      setRegHandle("@kunal123");
      setRegRoll("CS2023-019");
      setRegDept("Computer Science & Engineering");
      setRegEmail("kunal.verma@projecthub.edu");
      setRegPassword("student@123");
      setRegConfirmPassword("student@123");
      showToast("✨ Sample student details filled (@kunal123)! Click Register to continue.");
    } else if (role === "faculty") {
      setRegName("Dr. Anita Deshmukh");
      setRegHandle("@anita123");
      setRegRoll("FAC-AI-012");
      setRegDept("Artificial Intelligence & Data Science");
      setRegEmail("anita.deshmukh@projecthub.edu");
      setRegPassword("faculty@123");
      setRegConfirmPassword("faculty@123");
      showToast("✨ Sample faculty details filled (@anita123)! Click Register to continue.");
    } else {
      setRegName("Dr. Rajesh Mehta");
      setRegHandle("@admin123");
      setRegRoll("ADM-DEAN-001");
      setRegDept("Dean of Academics");
      setRegEmail("admin@projecthub.edu");
      setRegPassword("admin@123");
      setRegConfirmPassword("admin@123");
      showToast("✨ Sample administrator details filled (@admin123)! Click Register to continue.");
    }
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
      sender: currentUser ? currentUser.name : "Aarav Sharma",
      role: (currentUser ? currentUser.role : "student") as "student" | "faculty" | "admin",
      time: "Just now",
      text: newChatMsg
    };
    setProject({ ...project, discussions: [...project.discussions, msg] });
    setNewChatMsg("");
    showToast("Message sent to Faculty Supervisor!");
  };

  // GitHub Collaboration Handlers
  const handleSimulateJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    const newMember: Member = {
      name: newMemberName,
      role: newMemberRole,
      roll: `CS2023-0${Math.floor(Math.random() * 80 + 20)}`,
      email: newMemberEmail || `${newMemberName.toLowerCase().replace(/\s+/g, '.')}@projecthub.edu`
    };
    const newActivity: ActivityItem = {
      id: Date.now(),
      title: `${newMemberName} joined team as ${newMemberRole}`,
      desc: "Joined via shareable project invitation link",
      time: "Just now",
      type: "join"
    };
    setProject({
      ...project,
      members: [...project.members, newMember],
      activities: [newActivity, ...(project.activities || [])]
    });
    setShowJoinSimModal(false);
    setShowInviteModal(false);
    showToast(`🎉 ${newMemberName} successfully joined the project team as ${newMemberRole}!`);
  };

  const handleSaveCodeCommit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetSnippet = project.codeSnippets[activeFileIndex];
    if (!targetSnippet) return;

    const updatedSnippets = [...project.codeSnippets];
    updatedSnippets[activeFileIndex] = {
      ...targetSnippet,
      code: editedCodeContent || targetSnippet.code,
      commit: commitMsgInput || "Update source module",
      author: currentUser?.name || "Aarav Sharma"
    };

    const newActivity: ActivityItem = {
      id: Date.now(),
      title: `${currentUser?.name || "Aarav Sharma"} committed '${targetSnippet.filename}'`,
      desc: commitMsgInput || "Update source module",
      time: "Just now",
      type: "commit"
    };

    setProject({
      ...project,
      codeSnippets: updatedSnippets,
      activities: [newActivity, ...(project.activities || [])]
    });
    setIsEditingCode(false);
    showToast(`✅ File '${targetSnippet.filename}' committed successfully to repository!`);
  };

  const handleAddNewCodeFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    const newSnippet: CodeSnippet = {
      id: Date.now(),
      filename: newFileName.trim(),
      lang: newFileLang,
      author: currentUser?.name || "Aarav Sharma",
      commit: commitMsgInput || `Add ${newFileName.trim()}`,
      branch: "main",
      code: newFileContent || `// ${newFileName}\n// Created in ProjectHub Code Studio\n`
    };
    const newActivity: ActivityItem = {
      id: Date.now(),
      title: `${currentUser?.name || "Aarav Sharma"} created file '${newFileName}'`,
      desc: `Committed new ${newFileLang} module to main branch`,
      time: "Just now",
      type: "commit"
    };
    setProject({
      ...project,
      codeSnippets: [...project.codeSnippets, newSnippet],
      activities: [newActivity, ...(project.activities || [])]
    });
    setShowNewCodeFileModal(false);
    setNewFileName("");
    setNewFileContent("");
    setActiveFileIndex(project.codeSnippets.length);
    showToast(`🎉 File '${newSnippet.filename}' created and committed to repository!`);
  };

  const handleDeleteCodeFile = (index: number) => {
    const targetSnippet = project.codeSnippets[index];
    if (!targetSnippet) return;
    const updatedSnippets = project.codeSnippets.filter((_, idx) => idx !== index);
    const newActivity: ActivityItem = {
      id: Date.now(),
      title: `${currentUser?.name || "Aarav Sharma"} deleted file '${targetSnippet.filename}'`,
      time: "Just now",
      type: "commit"
    };
    setProject({
      ...project,
      codeSnippets: updatedSnippets,
      activities: [newActivity, ...(project.activities || [])]
    });
    setActiveFileIndex(0);
    showToast(`🗑️ File '${targetSnippet.filename}' removed from repository.`);
  };

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIssueTitle.trim()) return;
    const newIssue: Issue = {
      id: (project.issues?.length || 0) + 1,
      title: newIssueTitle.trim(),
      desc: newIssueDesc || "No description provided.",
      label: newIssueLabel,
      priority: newIssuePriority,
      status: "open",
      creator: currentUser?.name || "Aarav Sharma",
      assignee: newIssueAssignee,
      comments: [],
      createdAt: "Just now"
    };
    const newActivity: ActivityItem = {
      id: Date.now(),
      title: `${currentUser?.name || "Aarav Sharma"} opened Issue #${newIssue.id}`,
      desc: newIssueTitle,
      time: "Just now",
      type: "issue"
    };
    setProject({
      ...project,
      issues: [newIssue, ...(project.issues || [])],
      activities: [newActivity, ...(project.activities || [])]
    });
    setShowNewIssueModal(false);
    setNewIssueTitle("");
    setNewIssueDesc("");
    showToast(`🐛 Issue #${newIssue.id} created successfully!`);
  };

  const handleToggleIssue = (id: number) => {
    const updated = (project.issues || []).map(iss => {
      if (iss.id === id) {
        return {
          ...iss,
          status: (iss.status === "open" ? "closed" : "open") as "open" | "closed"
        };
      }
      return iss;
    });
    const target = updated.find(i => i.id === id);
    setProject({ ...project, issues: updated });
    showToast(`Issue #${id} marked as ${target?.status?.toUpperCase()}!`);
  };

  const handleAddIssueComment = (issueId: number, e: React.FormEvent) => {
    e.preventDefault();
    const commentText = issueCommentInput[issueId];
    if (!commentText || !commentText.trim()) return;

    const updated = (project.issues || []).map(iss => {
      if (iss.id === issueId) {
        return {
          ...iss,
          comments: [
            ...iss.comments,
            {
              id: Date.now(),
              author: currentUser?.name || "Aarav Sharma",
              text: commentText.trim(),
              time: "Just now"
            }
          ]
        };
      }
      return iss;
    });
    setProject({ ...project, issues: updated });
    setIssueCommentInput({ ...issueCommentInput, [issueId]: "" });
    showToast("Comment posted to issue thread!");
  };

  const handleCreatePr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrTitle.trim()) return;
    const newPr: PullRequest = {
      id: (project.pullRequests?.length || 0) + 1,
      title: newPrTitle.trim(),
      desc: newPrDesc || "Feature patch ready for review.",
      sourceBranch: newPrSource,
      targetBranch: newPrTarget,
      status: "open",
      author: currentUser?.name || "Aarav Sharma",
      createdAt: "Just now"
    };
    const newActivity: ActivityItem = {
      id: Date.now(),
      title: `${currentUser?.name || "Aarav Sharma"} opened Pull Request #${newPr.id}`,
      desc: `${newPrTitle} (${newPrSource} → ${newPrTarget})`,
      time: "Just now",
      type: "pr"
    };
    setProject({
      ...project,
      pullRequests: [newPr, ...(project.pullRequests || [])],
      activities: [newActivity, ...(project.activities || [])]
    });
    setShowNewPrModal(false);
    setNewPrTitle("");
    setNewPrDesc("");
    showToast(`🔀 Pull Request #${newPr.id} submitted for review!`);
  };

  const handleMergePr = (id: number) => {
    const updated = (project.pullRequests || []).map(pr => {
      if (pr.id === id) {
        return {
          ...pr,
          status: "merged" as "merged",
          mergedBy: currentUser?.name || "Aarav Sharma"
        };
      }
      return pr;
    });
    const target = updated.find(p => p.id === id);
    const newActivity: ActivityItem = {
      id: Date.now(),
      title: `${currentUser?.name || "Aarav Sharma"} merged Pull Request #${id}`,
      desc: target?.title,
      time: "Just now",
      type: "pr"
    };
    setProject({
      ...project,
      pullRequests: updated,
      activities: [newActivity, ...(project.activities || [])]
    });
    showToast(`🎉 Pull Request #${id} merged into ${target?.targetBranch}!`);
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

  // Quick Demo Login Handler (Updates currentUser and navigates to the portal)
  const handleDemoLogin = (role: "student" | "faculty" | "admin") => {
    if (role === "student") {
      const user: CurrentUser = {
        name: "Aarav Sharma",
        role: "student",
        roleLabel: "Student Leader",
        email: "aarav.sharma@projecthub.edu",
        roll: "CS2022-041",
        dept: "Computer Science & Engineering"
      };
      setCurrentUser(user);
      setCurrentView("student_portal");
      showToast("🎉 Signed in as Aarav Sharma (Student Leader)");
    } else if (role === "faculty") {
      const user: CurrentUser = {
        name: "Prof. Arvind Verma",
        role: "faculty",
        roleLabel: "Faculty Guide",
        email: "arvind.verma@projecthub.edu",
        roll: "FAC-CSE-004",
        dept: "Computer Science & Engineering"
      };
      setCurrentUser(user);
      setCurrentView("faculty_hub");
      showToast("🎉 Signed in as Prof. Arvind Verma (Faculty Guide)");
    } else if (role === "admin") {
      const user: CurrentUser = {
        name: "Dr. Rajesh Mehta",
        role: "admin",
        roleLabel: "Dean of Academics",
        email: "admin@projecthub.edu",
        roll: "ADM-DEAN-001",
        dept: "Dean of Academics"
      };
      setCurrentUser(user);
      setCurrentView("admin_console");
      showToast("🎉 Signed in as Dr. Rajesh Mehta (Dean of Academics)");
    }
  };

  // Custom Form Login Handler
  const handleCustomLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawInput = loginEmail.trim();
    const enteredPassword = loginPassword.trim();

    if (!rawInput || !enteredPassword) {
      showToast("Please enter your User ID (@username) and password.");
      return;
    }

    const lowerInput = rawInput.toLowerCase();
    const idRegex = /^@[a-zA-Z][a-zA-Z0-9_]*[0-9]+$/;

    // 🛡️ ADMIN AUTHENTICATION (Static ID: @admin123, Password: admin@123)
    if (authRoleTab === "admin" || lowerInput === "@admin123" || lowerInput === "admin@projecthub.edu" || lowerInput === "admin") {
      if (lowerInput === "@admin123" || lowerInput === "admin@projecthub.edu" || lowerInput === "admin" || authRoleTab === "admin") {
        if (enteredPassword !== "admin@123") {
          showToast("❌ Invalid Admin Password! For @admin123, password is: admin@123");
          return;
        }

        const adminUser: CurrentUser = {
          name: "Dr. Rajesh Mehta",
          role: "admin",
          roleLabel: "Dean of Academics",
          email: "admin@projecthub.edu",
          roll: "ADM-DEAN-001",
          dept: "Dean of Academics",
          handle: "@admin123"
        };
        setCurrentUser(adminUser);
        setCurrentView("admin_console");
        showToast("🎉 Signed in successfully as Administrator (@admin123)");
        return;
      }
    }

    // 🎓 STUDENT AUTHENTICATION (@<name><digits>)
    if (authRoleTab === "student") {
      // Check default demo IDs
      if (lowerInput === "@student123" || lowerInput === "@aarav123" || lowerInput === "aarav.sharma@projecthub.edu" || lowerInput.includes("aarav")) {
        const studentUser: CurrentUser = {
          name: "Aarav Sharma",
          role: "student",
          roleLabel: "Student Leader",
          email: "aarav.sharma@projecthub.edu",
          roll: "CS2022-041",
          dept: "Computer Science & Engineering",
          handle: lowerInput.startsWith("@") ? lowerInput : "@aarav123"
        };
        setCurrentUser(studentUser);
        setCurrentView("student_portal");
        showToast(`🎉 Signed in successfully as Aarav Sharma (${studentUser.handle})`);
        return;
      }

      // Check registered users
      const matchedUser = registeredUsers.find(
        (u) => (u.handle && u.handle.toLowerCase() === lowerInput) || u.email.toLowerCase() === lowerInput
      );
      if (matchedUser) {
        if (matchedUser.password && matchedUser.password !== enteredPassword) {
          showToast(`❌ Incorrect password for ${rawInput}!`);
          return;
        }
        const userObj: CurrentUser = {
          name: matchedUser.name,
          role: "student",
          roleLabel: matchedUser.role,
          email: matchedUser.email,
          roll: matchedUser.roll,
          dept: matchedUser.dept,
          handle: matchedUser.handle || lowerInput
        };
        setCurrentUser(userObj);
        setCurrentView("student_portal");
        showToast(`🎉 Welcome back, ${matchedUser.name}!`);
        return;
      }

      // If ID format matches @name<digits> or email
      if (idRegex.test(lowerInput) || lowerInput.includes("@")) {
        const cleanHandle = lowerInput.startsWith("@") ? lowerInput : `@${lowerInput.split('@')[0]}123`;
        const derivedName = lowerInput.startsWith("@") 
          ? lowerInput.slice(1).replace(/[0-9]/g, "").toUpperCase() + " (Student)"
          : "Student Member";
        const userObj: CurrentUser = {
          name: derivedName,
          role: "student",
          roleLabel: "Student Member",
          email: lowerInput.includes(".") ? lowerInput : `${cleanHandle.replace('@', '')}@projecthub.edu`,
          roll: `CS2023-${Math.floor(100 + Math.random() * 900)}`,
          dept: "Computer Science & Engineering",
          handle: cleanHandle
        };
        setCurrentUser(userObj);
        setCurrentView("student_portal");
        showToast(`🎉 Signed in successfully (${userObj.handle})!`);
        return;
      } else {
        showToast("❌ Invalid Student ID! Must start with '@' and end with numbers (e.g. @student123 or @kunal123)");
        return;
      }
    }

    // 👨‍🏫 FACULTY AUTHENTICATION (@<name><digits>)
    if (authRoleTab === "faculty") {
      // Check default demo IDs
      if (lowerInput === "@faculty123" || lowerInput === "@arvind123" || lowerInput === "arvind.verma@projecthub.edu" || lowerInput.includes("arvind")) {
        const facultyUser: CurrentUser = {
          name: "Prof. Arvind Verma",
          role: "faculty",
          roleLabel: "Faculty Guide",
          email: "arvind.verma@projecthub.edu",
          roll: "FAC-CSE-004",
          dept: "Computer Science & Engineering",
          handle: lowerInput.startsWith("@") ? lowerInput : "@arvind123"
        };
        setCurrentUser(facultyUser);
        setCurrentView("faculty_hub");
        showToast(`🎉 Signed in successfully as Prof. Arvind Verma (${facultyUser.handle})`);
        return;
      }

      // Check registered users
      const matchedUser = registeredUsers.find(
        (u) => (u.handle && u.handle.toLowerCase() === lowerInput) || u.email.toLowerCase() === lowerInput
      );
      if (matchedUser) {
        if (matchedUser.password && matchedUser.password !== enteredPassword) {
          showToast(`❌ Incorrect password for ${rawInput}!`);
          return;
        }
        const userObj: CurrentUser = {
          name: matchedUser.name,
          role: "faculty",
          roleLabel: matchedUser.role,
          email: matchedUser.email,
          roll: matchedUser.roll,
          dept: matchedUser.dept,
          handle: matchedUser.handle || lowerInput
        };
        setCurrentUser(userObj);
        setCurrentView("faculty_hub");
        showToast(`🎉 Welcome back, ${matchedUser.name}!`);
        return;
      }

      // If ID format matches @name<digits> or email
      if (idRegex.test(lowerInput) || lowerInput.includes("@")) {
        const cleanHandle = lowerInput.startsWith("@") ? lowerInput : `@${lowerInput.split('@')[0]}123`;
        const derivedName = lowerInput.startsWith("@")
          ? "Prof. " + lowerInput.slice(1).replace(/[0-9]/g, "").toUpperCase()
          : "Faculty Guide";
        const userObj: CurrentUser = {
          name: derivedName,
          role: "faculty",
          roleLabel: "Faculty Guide",
          email: lowerInput.includes(".") ? lowerInput : `${cleanHandle.replace('@', '')}@projecthub.edu`,
          roll: `FAC-CSE-${Math.floor(100 + Math.random() * 900)}`,
          dept: "Computer Science & Engineering",
          handle: cleanHandle
        };
        setCurrentUser(userObj);
        setCurrentView("faculty_hub");
        showToast(`🎉 Signed in successfully (${userObj.handle})!`);
        return;
      } else {
        showToast("❌ Invalid Faculty ID! Must start with '@' and end with numbers (e.g. @faculty123 or @arvind101)");
        return;
      }
    }
  };

  // Registration Form Handler
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim() || !regConfirmPassword.trim()) {
      showToast("Please fill all required fields.");
      return;
    }

    // Format & Validate User ID (@<name><digits>)
    let handleInput = regHandle.trim();
    if (!handleInput) {
      const cleanName = regName.toLowerCase().replace(/[^a-z]/g, "");
      const randomDigits = Math.floor(100 + Math.random() * 900);
      handleInput = `@${cleanName || (authRoleTab === "student" ? "student" : "faculty")}${randomDigits}`;
    } else if (!handleInput.startsWith("@")) {
      handleInput = `@${handleInput}`;
    }

    const idRegex = /^@[a-zA-Z][a-zA-Z0-9_]*[0-9]+$/;
    if (!idRegex.test(handleInput)) {
      showToast("❌ Invalid User ID format! Must start with '@', contain name, and end with numbers (e.g. @student123 or @kunal99)");
      return;
    }

    // Password validation & Confirm Password match
    if (regPassword.length < 6) {
      showToast("❌ Password must be at least 6 characters long.");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      showToast("❌ Passwords do not match! Please verify both password fields.");
      return;
    }

    // Check if handle or email is already registered
    const existingUser = registeredUsers.find(
      (u) => (u.handle && u.handle.toLowerCase() === handleInput.toLowerCase()) || u.email.toLowerCase() === regEmail.toLowerCase()
    );
    if (existingUser) {
      showToast(`❌ User ID ${handleInput} or email is already registered! Please choose another.`);
      return;
    }

    const generatedRoll = regRoll.trim() || (authRoleTab === "student" ? "CS2023-NEW" : authRoleTab === "faculty" ? "FAC-NEW-01" : "ADM-NEW-01");
    const newStudent = {
      id: Date.now(),
      name: regName,
      roll: generatedRoll,
      dept: regDept,
      email: regEmail,
      date: "Today"
    };
    setPendingStudents([newStudent, ...pendingStudents]);

    const newUserRecord = {
      id: Date.now(),
      name: regName,
      roll: generatedRoll,
      handle: handleInput,
      password: regPassword,
      role: authRoleTab === "student" ? "Student Member" : authRoleTab === "faculty" ? "Faculty Guide" : "Administrator",
      dept: regDept,
      email: regEmail,
      status: "Active"
    };
    setRegisteredUsers([newUserRecord, ...registeredUsers]);

    const newUser: CurrentUser = {
      name: regName,
      role: authRoleTab,
      roleLabel: authRoleTab === "student" ? "Student Member" : authRoleTab === "faculty" ? "Faculty Guide" : "Administrator",
      email: regEmail,
      roll: generatedRoll,
      dept: regDept,
      handle: handleInput
    };
    setCurrentUser(newUser);

    showToast(`🎉 Registered successfully with ID ${handleInput}! Welcome, ${regName}.`);
    if (authRoleTab === "student") setCurrentView("student_portal");
    else if (authRoleTab === "faculty") setCurrentView("faculty_hub");
    else setCurrentView("admin_console");
  };

  // Forgot Password Handler
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      showToast("Please enter your registered email address.");
      return;
    }
    showToast(`📧 Password reset instructions have been sent to ${forgotEmail}!`);
    setAuthSubView("login");
  };

  // Logout Handler
  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    setCurrentUser(null);
    setCurrentView("public");
    showToast("👋 You have been logged out successfully. Have a great day!");
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

          {/* Main Navigation Switcher Pills */}
          <div className="flex items-center bg-slate-100/90 p-1.5 rounded-full border border-slate-200/80 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setCurrentView("public")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                currentView === "public"
                  ? "bg-white text-[#008766] shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🏠 Home</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentView("about")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                currentView === "about"
                  ? "bg-white text-[#008766] shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>ℹ️ About Us</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentView("roles")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                currentView === "roles"
                  ? "bg-white text-[#008766] shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🧭 Portals Hub</span>
            </button>

            {/* If user is logged in, show active workspace shortcut pill */}
            {currentUser && (
              <button
                type="button"
                onClick={() => {
                  if (currentUser.role === "student") setCurrentView("student_portal");
                  else if (currentUser.role === "faculty") setCurrentView("faculty_hub");
                  else setCurrentView("admin_console");
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  currentView === "student_portal" || currentView === "faculty_hub" || currentView === "admin_console"
                    ? "bg-[#008766] text-white shadow-sm font-bold"
                    : "text-[#008766] hover:text-[#007054] bg-[#008766]/10 font-bold"
                }`}
              >
                <span>🚀 My Workspace</span>
              </button>
            )}
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2.5">
            {currentUser ? (
              // 🌟 LOGGED IN STATE: Show User Profile Badge + Logout Button
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => {
                    if (currentUser.role === "student") setCurrentView("student_portal");
                    else if (currentUser.role === "faculty") setCurrentView("faculty_hub");
                    else setCurrentView("admin_console");
                  }}
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
                  title="Click to go to your active workspace"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#008766] text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.role === "student" ? "🎓" : currentUser.role === "faculty" ? "👨‍🏫" : "🛡️"}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-[#0f2427] leading-none">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-500">{currentUser.roleLabel}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center gap-1.5 text-slate-600 hover:text-rose-600 px-3 py-1.5 rounded-xl hover:bg-rose-50 transition-colors text-xs font-bold border border-slate-200 hover:border-rose-200 shadow-2xs cursor-pointer"
                  title="Sign Out of ProjectHub"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span className="hidden sm:inline">Log Out</span>
                </button>
              </div>
            ) : (
              // 🌟 LOGGED OUT STATE: Show Login and Register Buttons (NO LOGOUT BUTTON)
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthSubView("login");
                    setAuthRoleTab("student");
                    setCurrentView("auth");
                  }}
                  className="flex items-center gap-1.5 text-slate-700 hover:text-[#008766] bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#008766] text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-2xs cursor-pointer"
                  title="Sign in to your account"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#008766]" />
                  <span>Login</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthSubView("register");
                    setAuthRoleTab("student");
                    setCurrentView("auth");
                  }}
                  className="bg-[#008766] hover:bg-[#007054] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  title="Create a new account"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 1. 🌐 PUBLIC LANDING PAGE (WITH THEMATIC ACADEMIC BACKGROUND) */}
      {/* ============================================================ */}
      {currentView === "public" && (
        <main className="flex-1 relative flex flex-col justify-center items-center min-h-[calc(100vh-4.5rem)] overflow-hidden">
          {/* Rich Website Thematic Background Image with Ambient Overlays */}
          <div className="absolute inset-0 pointer-events-none select-none z-0">
            {/* 3D Geometric Nodes & Network Background */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-45 mix-blend-multiply"
              style={{ backgroundImage: `url('/hero-bg.jpg')` }}
            />
            {/* Ambient Radial & Linear Soft Gradients for Superior Contrast & Aesthetics */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-[#fbfdfc]/70 to-[#eef7f4]/85 backdrop-blur-[0.5px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,135,102,0.14),transparent_70%)]" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[360px] bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Clean Hero Content with Glassmorphic Card Container */}
          <section className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
            <div className="max-w-4xl mx-auto backdrop-blur-md bg-white/80 border border-white/90 rounded-3xl p-8 sm:p-14 shadow-[0_20px_60px_-15px_rgba(0,135,102,0.16)] ring-1 ring-emerald-500/10">
              
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
              <div className="flex flex-wrap items-center justify-center gap-3.5">
                <button
                  type="button"
                  onClick={() => setCurrentView("roles")}
                  className="bg-[#008766] hover:bg-[#007054] text-white px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-md shadow-emerald-800/20 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 group cursor-pointer"
                >
                  <span>Explore Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentView("about")}
                  className="bg-white/95 hover:bg-white text-slate-700 border border-slate-300/90 px-6 py-4 rounded-2xl font-bold text-base transition-all shadow-xs hover:border-[#008766] hover:text-[#008766] flex items-center gap-2 cursor-pointer"
                >
                  <span>ℹ️ About Us</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowTourModal(true)}
                  className="bg-white/95 hover:bg-white text-slate-700 border border-slate-300/90 px-6 py-4 rounded-2xl font-bold text-base transition-all shadow-xs hover:border-[#008766] flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 text-[#008766] fill-[#008766]" />
                  <span>Watch 2-Min Tour</span>
                </button>
              </div>

            </div>
          </section>
        </main>
      )}

      {/* ============================================================ */}
      {/* ℹ️ ABOUT US / PLATFORM OVERVIEW (`about`) */}
      {/* ============================================================ */}
      {currentView === "about" && (
        <main className="flex-1">
          
          {/* About Header Banner */}
          <section className="snapflow-hero-bg pt-12 pb-14 px-4 sm:px-6 lg:px-8 border-b border-slate-100 text-center relative">
            <div className="max-w-4xl mx-auto">
              
              <div className="flex items-center justify-between mb-6 max-w-xl mx-auto">
                <button
                  type="button"
                  onClick={() => setCurrentView("public")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#008766] bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-2xs transition-all cursor-pointer"
                >
                  <span>← Back to Homepage</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentView("roles")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#008766] hover:bg-[#007054] px-4 py-1.5 rounded-full shadow-xs transition-all cursor-pointer"
                >
                  <span>Explore Portals →</span>
                </button>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e6f4f1] border border-[#bfe5dc] text-[#008766] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ABOUT PROJECT HUB · PLATFORM ARCHITECTURE</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f2427] tracking-tight mb-4">
                About ProjectHub
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                A unified academic operating system purpose-built for engineering institutions to streamline capstone projects, mentor guidance, deliverable vaulting, and accredited rubric defense.
              </p>
            </div>
          </section>

          {/* 🌟 SLIDE 3 INTEGRATION: OUR SOLUTION & 6 KEY BENEFITS */}
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

          {/* 👥 SLIDE 1 INTEGRATION: SYSTEM USERS & RESPONSIBILITIES */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f7faf9] border-b border-slate-100">
            <div className="max-w-6xl mx-auto">
              
              <div className="text-center max-w-2xl mx-auto mb-14">
                <span className="snapflow-pill-badge mb-3">SYSTEM ROLES & RESPONSIBILITIES</span>
                <h2 className="text-3xl font-black text-[#0f2427] tracking-tight mb-3">
                  Tailored Portals for Every Stakeholder
                </h2>
                <p className="text-slate-600 text-sm">
                  Click any role card below to register and launch its dedicated interactive portal.
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

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthRoleTab("student");
                        setAuthSubView("login");
                        setCurrentView("auth");
                      }}
                      className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5 text-[#008766]" />
                      <span>Sign In</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthRoleTab("student");
                        setAuthSubView("register");
                        setCurrentView("auth");
                      }}
                      className="py-2.5 bg-[#008766] hover:bg-[#007054] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Register</span>
                    </button>
                  </div>
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

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthRoleTab("faculty");
                        setAuthSubView("login");
                        setCurrentView("auth");
                      }}
                      className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5 text-amber-600" />
                      <span>Sign In</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthRoleTab("faculty");
                        setAuthSubView("register");
                        setCurrentView("auth");
                      }}
                      className="py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Register</span>
                    </button>
                  </div>
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

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthRoleTab("admin");
                        setAuthSubView("login");
                        setCurrentView("auth");
                      }}
                      className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Sign In</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthRoleTab("admin");
                        setAuthSubView("register");
                        setCurrentView("auth");
                      }}
                      className="py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Register</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </section>

          {/* 🔄 SLIDE 2 INTEGRATION: INTERACTIVE OVERALL WORKFLOW FLOW */}
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
                  { step: "01", title: "Authentication & Approval", desc: "Student registration verified by Admin with email verification.", action: () => { setAuthRoleTab("student"); setCurrentView("auth"); } },
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
                  type="button"
                  onClick={() => handleDemoLogin("student")}
                  className="bg-[#008766] hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  🎓 Student 1-Click Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("faculty")}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  👨‍🏫 Faculty 1-Click Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("admin")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  🛡️ Admin 1-Click Demo
                </button>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ============================================================ */}
      {/* 🧭 PORTALS / ROLES SELECTION VIEW (3 CENTER SQUARE BOXES) */}
      {/* ============================================================ */}
      {currentView === "roles" && (
        <main className="flex-1 snapflow-hero-bg flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl w-full mx-auto">
            
            {/* Top Back Navigation & Header */}
            <div className="text-center max-w-2xl mx-auto mb-10">
              <button
                onClick={() => setCurrentView("public")}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#008766] bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-2xs mb-6 transition-all cursor-pointer"
              >
                <span>← Back to Homepage</span>
              </button>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f2427] tracking-tight">
                {currentUser ? "Choose Your Portal" : "Select Your Role"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
                {currentUser
                  ? `Welcome, ${currentUser.name}! Click below to continue.`
                  : "Choose your portal below to sign in to your university workspace."}
              </p>
            </div>

            {currentUser ? (
              /* 🌟 LOGGED IN STATE: EXACTLY 2 CLEAN BOXES (Home + User's Active Role with Symbol & Role Name) */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto w-full">
                
                {/* Box 1: Home */}
                <div
                  onClick={() => setCurrentView("public")}
                  className="bg-white rounded-3xl p-10 border-2 border-slate-200/90 shadow-sm hover:border-[#008766] hover:shadow-xl hover:-translate-y-1.5 transition-all flex flex-col items-center justify-center text-center cursor-pointer group min-h-[220px]"
                >
                  <span className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300 select-none">
                    🏠
                  </span>
                  <h3 className="text-2xl font-black text-[#0f2427] group-hover:text-[#008766] transition-colors">
                    Home
                  </h3>
                </div>

                {/* Box 2: Active User Role (Student / Faculty / Admin) */}
                <div
                  onClick={() => {
                    if (currentUser.role === "student") {
                      setCurrentView("student_portal");
                    } else if (currentUser.role === "faculty") {
                      setCurrentView("faculty_hub");
                    } else {
                      setCurrentView("admin_console");
                    }
                  }}
                  className="bg-white rounded-3xl p-10 border-2 border-slate-200/90 shadow-sm hover:border-[#008766] hover:shadow-xl hover:-translate-y-1.5 transition-all flex flex-col items-center justify-center text-center cursor-pointer group min-h-[220px]"
                >
                  <span className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300 select-none">
                    {currentUser.role === "student" ? "🎓" : currentUser.role === "faculty" ? "👨‍🏫" : "🛡️"}
                  </span>
                  <h3 className="text-2xl font-black text-[#0f2427] group-hover:text-[#008766] transition-colors">
                    {currentUser.role === "student" ? "Student" : currentUser.role === "faculty" ? "Faculty" : "Admin"}
                  </h3>
                </div>

              </div>
            ) : (
              /* 🌟 LOGGED OUT STATE: 3 CENTER SQUARE BOXES WITH LOGIN BUTTONS */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                
                {/* Box 1: Home */}
                <div
                  onClick={() => setCurrentView("public")}
                  className="bg-white rounded-3xl p-7 sm:p-8 border-2 border-slate-200/90 shadow-sm hover:border-[#008766] hover:shadow-xl hover:-translate-y-1.5 transition-all flex flex-col items-center justify-between text-center cursor-pointer group min-h-[220px]"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-4xl mb-3 group-hover:scale-110 transition-transform select-none">
                      🏠
                    </span>
                    <h3 className="text-2xl font-black text-[#0f2427] group-hover:text-[#008766] transition-colors">
                      Home
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Explore ProjectHub Overview</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentView("public")}
                    className="mt-6 w-full py-2.5 px-3 bg-slate-100 hover:bg-[#008766] text-slate-700 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Go to Home</span>
                    <span>→</span>
                  </button>
                </div>

                {/* Box 2: Student */}
                <div
                  onClick={() => {
                    setAuthRoleTab("student");
                    setAuthSubView("login");
                    setCurrentView("auth");
                  }}
                  className="bg-white rounded-3xl p-7 sm:p-8 border-2 border-slate-200/90 shadow-sm hover:border-[#008766] hover:shadow-xl hover:-translate-y-1.5 transition-all flex flex-col items-center justify-between text-center cursor-pointer group min-h-[220px]"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-4xl mb-3 group-hover:scale-110 transition-transform select-none">
                      🎓
                    </span>
                    <h3 className="text-2xl font-black text-[#0f2427] group-hover:text-[#008766] transition-colors">
                      Student
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Capstone Teams & Projects</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAuthRoleTab("student");
                      setAuthSubView("login");
                      setCurrentView("auth");
                    }}
                    className="mt-6 w-full py-2.5 px-3 bg-emerald-50 hover:bg-[#008766] text-[#008766] hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-200/60 shadow-2xs"
                  >
                    <span>Login as Student</span>
                    <span>→</span>
                  </button>
                </div>

                {/* Box 3: Faculty (Contains both 'Login as Faculty' and 'Login as Admin') */}
                <div
                  onClick={() => setShowFacultyRoleModal(true)}
                  className="bg-white rounded-3xl p-7 sm:p-8 border-2 border-slate-200/90 shadow-sm hover:border-[#008766] hover:shadow-xl hover:-translate-y-1.5 transition-all flex flex-col items-center justify-between text-center cursor-pointer group min-h-[220px]"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-4xl mb-3 group-hover:scale-110 transition-transform select-none">
                      👨‍🏫
                    </span>
                    <h3 className="text-2xl font-black text-[#0f2427] group-hover:text-[#008766] transition-colors">
                      Faculty
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Guides, Mentors & Admins</p>
                  </div>

                  <div className="mt-4 w-full flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAuthRoleTab("faculty");
                        setAuthSubView("login");
                        setCurrentView("auth");
                      }}
                      className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-600 text-amber-800 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-amber-200/70 shadow-2xs"
                    >
                      <span>👨‍🏫 Login as Faculty</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAuthRoleTab("admin");
                        setAuthSubView("login");
                        setCurrentView("auth");
                      }}
                      className="w-full py-2 px-3 bg-indigo-50 hover:bg-indigo-600 text-indigo-800 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-indigo-200/70 shadow-2xs"
                    >
                      <span>🛡️ Login as Admin</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>
        </main>
      )}

      {/* ============================================================ */}
      {/* 2. 🎓 STUDENT PORTAL VIEW (`student_portal`) */}
      {/* ============================================================ */}
      {currentView === "student_portal" && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Top Project Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-100/40 via-teal-50/20 to-transparent rounded-bl-full pointer-events-none" />
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                  <span className="snapflow-pill-badge !text-[11px] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Active Capstone</span>
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">• ID: #CSE-2026-001</span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-medium">{project.domain}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`http://localhost:3000/join/${project.inviteCode}`);
                      showToast(`📋 Invite Link copied: http://localhost:3000/join/${project.inviteCode}`);
                    }}
                    className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 px-2.5 py-0.5 rounded-full font-mono font-medium flex items-center gap-1 transition-all cursor-pointer"
                    title="Click to copy invite link"
                  >
                    <Copy className="w-3 h-3 text-[#008766]" />
                    <span>Code: {project.inviteCode}</span>
                  </button>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0f2427] tracking-tight mb-2">
                  {project.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                  {project.abstract}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Users className="w-3.5 h-3.5 text-[#008766]" />
                    <span>Team: {project.members.map(m => m.name.split(' ')[0]).join(', ')}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <GraduationCap className="w-3.5 h-3.5 text-[#008766]" />
                    <span>Guide: {project.guide}</span>
                  </div>
                </div>
              </div>

              {/* Progress Ring & Fast Actions */}
              <div className="flex flex-wrap items-center gap-4 shrink-0">
                <div className="bg-[#e6f4f1] border border-[#bfe5dc] p-4 rounded-2xl text-center min-w-[120px]">
                  <div className="text-2xl font-black text-[#008766]">{project.progress}%</div>
                  <div className="text-[11px] font-bold text-slate-600">Milestones Done</div>
                </div>

                <div className="flex flex-col gap-2">
                  {/* Glowing Share Invite Link Button */}
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="bg-gradient-to-r from-[#008766] to-[#0f9d75] hover:from-[#007054] hover:to-[#0c8261] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
                  >
                    <Share2 className="w-4 h-4 text-emerald-200" />
                    <span>🔗 Share Invite Link</span>
                    <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-full font-extrabold">Instant Join</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowSubmitFinalModal(true)}
                      className="flex-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-[#008766]" />
                      <span>Submit</span>
                    </button>
                    <button
                      onClick={() => setShowNewProjectModal(true)}
                      className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Create New Project"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#008766]" />
                      <span>+ New</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Student Portal Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-200 scrollbar-none">
            {[
              { id: "overview", label: "📊 Overview" },
              { id: "team", label: `👥 Team & Invites (${project.members.length})` },
              { id: "code", label: `💻 Code Studio (${project.codeSnippets.length})` },
              { id: "issues", label: `🐛 Issues (${(project.issues || []).filter(i => i.status === 'open').length} open)` },
              { id: "prs", label: `🔀 Pull Requests (${(project.pullRequests || []).filter(p => p.status === 'open').length})` },
              { id: "activity", label: `⚡ Activity Pulse` },
              { id: "milestones", label: `🎯 Milestones (${project.milestones.length})` },
              { id: "files", label: `📁 Deliverables (${project.files.length})` },
              { id: "chat", label: `💬 Supervisor Chat (${project.discussions.length})` },
              { id: "rubric", label: "⭐ Rubric (A+)" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStudentTab(tab.id as any)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  studentTab === tab.id
                    ? "bg-[#008766] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:text-[#0f2427] border border-slate-200 hover:border-slate-300"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* ============================================================ */}
          {/* SUB-VIEW 1: OVERVIEW */}
          {/* ============================================================ */}
          {studentTab === "overview" && (
            <div className="space-y-6">
              {/* Quick Invite Callout Banner */}
              <div className="bg-gradient-to-r from-[#e6f4f1] via-teal-50/50 to-white border border-[#bfe5dc] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#008766] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#0f2427]">Collaborate with Your Project Team</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Share your unique invite link with teammates so they can join, push code, report issues, and review pull requests.
                    </p>
                    <div className="flex items-center gap-2 mt-2 font-mono text-[11px] text-slate-700 bg-white/80 px-2.5 py-1 rounded-lg border border-teal-200/80 w-fit">
                      <span>http://localhost:3000/join/{project.inviteCode}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`http://localhost:3000/join/${project.inviteCode}`);
                      showToast("📋 Invite link copied to clipboard!");
                    }}
                    className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#008766]" />
                    <span>Copy Link</span>
                  </button>
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="px-4 py-2 bg-[#008766] hover:bg-[#007054] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Invite Hub</span>
                  </button>
                </div>
              </div>

              {/* 3-Column Overview Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Team Roster Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-[#0f2427] flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#008766]" />
                      <span>Team Members ({project.members.length}/4)</span>
                    </h3>
                    <button
                      onClick={() => setStudentTab("team")}
                      className="text-xs text-[#008766] font-bold hover:underline cursor-pointer"
                    >
                      Manage
                    </button>
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

                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="w-full py-2 bg-[#e6f4f1] hover:bg-[#d5eee8] text-[#008766] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#bfe5dc]"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ Invite Another Teammate</span>
                  </button>
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
                      className="flex-1 py-2 bg-[#008766] hover:bg-[#007054] text-white text-xs font-bold rounded-xl transition-all text-center cursor-pointer"
                    >
                      Open Supervisor Chat
                    </button>
                  </div>
                </div>

                {/* Deliverables Vault Summary */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-[#0f2427] flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-[#008766]" />
                      <span>Key Deliverables</span>
                    </h3>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="text-xs text-[#008766] font-bold hover:underline cursor-pointer"
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
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    View All Deliverables ({project.files.length})
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* SUB-VIEW 2: 👥 TEAM & INVITES */}
          {/* ============================================================ */}
          {studentTab === "team" && (
            <div className="space-y-6">
              {/* Shareable Invite Card */}
              <div className="bg-gradient-to-br from-[#0f2427] to-[#173a3f] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-2xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Shareable Team Invitation</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-2">
                        Invite Classmates & Collaborate Like GitHub
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Anyone with this link can join your capstone team, choose their role (Frontend, Backend, AI/ML, DevOps), push code commits, and open pull requests.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => setShowInviteModal(true)}
                        className="px-5 py-3 bg-[#008766] hover:bg-[#007054] text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 cursor-pointer"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Open Invite Hub</span>
                      </button>
                      <button
                        onClick={() => setShowJoinSimModal(true)}
                        className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/20 cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4 text-emerald-300" />
                        <span>🚀 Simulate Teammate Join</span>
                      </button>
                    </div>
                  </div>

                  {/* Share Link Bar */}
                  <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex-1 w-full bg-black/30 border border-white/15 rounded-xl px-4 py-2.5 font-mono text-xs text-emerald-300 flex items-center justify-between truncate">
                      <span className="truncate">http://localhost:3000/join/{project.inviteCode}</span>
                      <span className="text-[10px] text-slate-400 font-sans ml-2 shrink-0">Port 3000</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`http://localhost:3000/join/${project.inviteCode}`);
                        showToast("📋 Direct invitation link copied to clipboard!");
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Members List Grid */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-black text-[#0f2427]">Team Roster ({project.members.length} of 4)</h3>
                    <p className="text-xs text-slate-500">Each member can commit code, manage issues, and participate in rubric evaluations.</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    {4 - project.members.length} Slot(s) Available
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.members.map((member, idx) => (
                    <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between hover:border-[#008766] transition-all">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl bg-[#e6f4f1] text-[#008766] font-bold flex items-center justify-center text-sm">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          {idx === 0 ? (
                            <span className="text-[10px] font-bold bg-[#008766] text-white px-2 py-0.5 rounded-full">Team Leader</span>
                          ) : (
                            <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">Member</span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-[#0f2427] mb-0.5">{member.name}</h4>
                        <div className="text-xs font-semibold text-[#008766] mb-2">{member.role}</div>
                        <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-200">
                          <div>Roll: <span className="font-mono text-slate-700">{member.roll}</span></div>
                          <div className="truncate">Email: <span className="text-slate-700">{member.email}</span></div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px]">
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active Contributor</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* SUB-VIEW 3: 💻 CODE STUDIO */}
          {/* ============================================================ */}
          {studentTab === "code" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              
              {/* Studio Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="snapflow-pill-badge !text-[10px] flex items-center gap-1">
                      <GitBranch className="w-3 h-3" />
                      <span>Branch: main</span>
                    </span>
                    <span className="text-xs text-slate-500 font-mono">• {project.codeSnippets.length} Modules</span>
                  </div>
                  <h3 className="text-lg font-black text-[#0f2427] flex items-center gap-2">
                    <Code className="w-5 h-5 text-[#008766]" />
                    <span>ProjectHub Code Studio</span>
                  </h3>
                  <p className="text-xs text-slate-500">Live in-browser multi-file repository with syntax highlighting and instant team commits.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowNewCodeFileModal(true)}
                    className="bg-[#008766] hover:bg-[#007054] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ New File</span>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(project.codeSnippets[activeFileIndex]?.code || "");
                      showToast(`📋 Copied contents of ${project.codeSnippets[activeFileIndex]?.filename}!`);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>

                  <button
                    onClick={() => {
                      showToast("📦 Compressing project repository into ZIP archive...");
                      setTimeout(() => showToast("✅ project-hub-codebase.zip ready for download!"), 1200);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#008766]" />
                    <span>Download ZIP</span>
                  </button>
                </div>
              </div>

              {/* Split Code Studio Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                
                {/* File Tree Explorer (Left Column) */}
                <div className="bg-[#0b1618] rounded-2xl p-4 text-slate-300 font-mono text-xs border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-2 flex items-center justify-between">
                      <span>📁 Repository Files</span>
                      <span className="text-emerald-400">{project.codeSnippets.length}</span>
                    </div>

                    <div className="space-y-1.5">
                      {project.codeSnippets.map((snippet, idx) => (
                        <div
                          key={snippet.id}
                          onClick={() => {
                            setActiveFileIndex(idx);
                            setIsEditingCode(false);
                            setEditedCodeContent(snippet.code);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-all cursor-pointer ${
                            activeFileIndex === idx
                              ? "bg-[#008766] text-white font-bold shadow-xs"
                              : "hover:bg-slate-800/80 text-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Terminal className="w-3.5 h-3.5 shrink-0 opacity-80" />
                            <span className="truncate">{snippet.filename}</span>
                          </div>
                          <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-sans shrink-0 ${
                            activeFileIndex === idx ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                          }`}>
                            {snippet.lang}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800/80 text-[11px] text-slate-400 font-sans space-y-2">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Branch:</span>
                      <span className="font-mono text-emerald-400">main</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Vulnerability Scan:</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>0 Issues</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Editor & Viewer (Right 3 Columns) */}
                <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-slate-800 bg-[#0d1b1e] text-slate-200 font-mono text-xs flex flex-col justify-between">
                  
                  {/* Editor Sub-Header */}
                  <div className="bg-[#081316] px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-emerald-400 font-bold text-sm">
                        {project.codeSnippets[activeFileIndex]?.filename || "No file selected"}
                      </span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 uppercase font-sans">
                        {project.codeSnippets[activeFileIndex]?.lang}
                      </span>
                      <span className="text-[11px] text-slate-400 font-sans hidden sm:inline">
                        by <strong className="text-slate-200">{project.codeSnippets[activeFileIndex]?.author}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isEditingCode ? (
                        <button
                          onClick={() => {
                            setIsEditingCode(true);
                            setEditedCodeContent(project.codeSnippets[activeFileIndex]?.code || "");
                          }}
                          className="bg-[#008766] hover:bg-[#007054] text-white text-xs font-sans font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit File</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsEditingCode(false)}
                          className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-sans font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}

                      {project.codeSnippets.length > 1 && (
                        <button
                          onClick={() => handleDeleteCodeFile(activeFileIndex)}
                          className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 p-1.5 rounded-lg transition-all cursor-pointer"
                          title="Delete File"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Code Editor Body */}
                  {isEditingCode ? (
                    <form onSubmit={handleSaveCodeCommit} className="p-4 flex flex-col flex-1">
                      <div className="mb-2 text-[11px] text-amber-300 font-sans flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Live Editing Mode — Changes will be committed directly to repository branch</span>
                      </div>
                      <textarea
                        rows={16}
                        value={editedCodeContent}
                        onChange={(e) => setEditedCodeContent(e.target.value)}
                        className="w-full bg-[#071012] border border-slate-700 rounded-xl p-4 font-mono text-emerald-200 text-xs focus:outline-none focus:border-[#008766] leading-relaxed resize-y"
                      />
                      <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <input
                          type="text"
                          required
                          value={commitMsgInput}
                          onChange={(e) => setCommitMsgInput(e.target.value)}
                          placeholder="Commit message (e.g. Update middleware JWT verification)"
                          className="w-full sm:flex-1 bg-[#081316] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#008766] font-sans"
                        />
                        <button
                          type="submit"
                          className="w-full sm:w-auto bg-[#008766] hover:bg-[#007054] text-white font-sans font-bold text-xs px-5 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <GitCommit className="w-3.5 h-3.5" />
                          <span>Push Commit</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="p-4 overflow-x-auto flex-1">
                      <pre className="text-emerald-100 leading-relaxed font-mono">
                        <code>{project.codeSnippets[activeFileIndex]?.code || "// Empty file"}</code>
                      </pre>
                    </div>
                  )}

                  {/* Commit Footer Bar */}
                  <div className="bg-[#081316] px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-sans">
                    <div className="flex items-center gap-1.5 truncate">
                      <GitCommit className="w-3.5 h-3.5 text-[#008766]" />
                      <span className="truncate">Latest Commit: <strong className="text-slate-200">{project.codeSnippets[activeFileIndex]?.commit}</strong></span>
                    </div>
                    <span className="text-slate-500 shrink-0 ml-2">UTF-8</span>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* SUB-VIEW 4: 🐛 ISSUES TRACKER */}
          {/* ============================================================ */}
          {studentTab === "issues" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-black text-[#0f2427] flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-[#008766]" />
                    <span>Project Issues & Tasks</span>
                  </h3>
                  <p className="text-xs text-slate-500">Track bugs, feature requests, and milestone action items with team assignments.</p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Filter Pills */}
                  <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
                    <button
                      onClick={() => setIssueFilter("open")}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        issueFilter === "open" ? "bg-white text-[#008766] shadow-xs" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Open ({(project.issues || []).filter(i => i.status === 'open').length})
                    </button>
                    <button
                      onClick={() => setIssueFilter("closed")}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        issueFilter === "closed" ? "bg-white text-[#008766] shadow-xs" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Closed ({(project.issues || []).filter(i => i.status === 'closed').length})
                    </button>
                    <button
                      onClick={() => setIssueFilter("all")}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        issueFilter === "all" ? "bg-white text-[#008766] shadow-xs" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      All ({(project.issues || []).length})
                    </button>
                  </div>

                  <button
                    onClick={() => setShowNewIssueModal(true)}
                    className="bg-[#008766] hover:bg-[#007054] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ New Issue</span>
                  </button>
                </div>
              </div>

              {/* Issues List */}
              <div className="space-y-4">
                {(project.issues || [])
                  .filter(iss => issueFilter === "all" ? true : iss.status === issueFilter)
                  .map((iss) => (
                    <div
                      key={iss.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        iss.status === 'open'
                          ? "bg-white border-slate-200/90 hover:border-slate-300"
                          : "bg-slate-50 border-slate-200 opacity-80"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => handleToggleIssue(iss.id)}
                            className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-all cursor-pointer ${
                              iss.status === "closed"
                                ? "bg-purple-600 border-purple-600 text-white"
                                : "border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                            title={iss.status === 'open' ? 'Click to mark as Closed' : 'Click to Reopen'}
                          >
                            {iss.status === "closed" ? <Check className="w-3.5 h-3.5" /> : <div className="w-2 h-2 rounded-full bg-[#008766]" />}
                          </button>

                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h4 className="text-sm font-bold text-[#0f2427]">
                                #{iss.id} {iss.title}
                              </h4>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                iss.label === 'bug' ? 'bg-rose-100 text-rose-800' :
                                iss.label === 'feature' ? 'bg-emerald-100 text-emerald-800' :
                                iss.label === 'enhancement' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                              }`}>
                                {iss.label}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                iss.priority === 'Critical' ? 'bg-rose-600 text-white' :
                                iss.priority === 'High' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {iss.priority} Priority
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{iss.desc}</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0 text-xs text-slate-500 space-y-1">
                          <div>Assignee: <strong className="text-slate-800">{iss.assignee}</strong></div>
                          <div className="text-[11px] text-slate-400">Created by {iss.creator} • {iss.createdAt}</div>
                        </div>
                      </div>

                      {/* Comments Thread */}
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        {iss.comments.length > 0 && (
                          <div className="space-y-2 mb-3 bg-slate-50 p-3 rounded-xl">
                            {iss.comments.map(c => (
                              <div key={c.id} className="text-xs">
                                <div className="flex items-center justify-between text-slate-500 mb-0.5">
                                  <strong className="text-[#008766]">{c.author}</strong>
                                  <span className="text-[10px]">{c.time}</span>
                                </div>
                                <p className="text-slate-700">{c.text}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply Form */}
                        <form onSubmit={(e) => handleAddIssueComment(iss.id, e)} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add a comment or update on this issue..."
                            value={issueCommentInput[iss.id] || ""}
                            onChange={(e) => setIssueCommentInput({ ...issueCommentInput, [iss.id]: e.target.value })}
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                          />
                          <button
                            type="submit"
                            className="bg-[#008766] hover:bg-[#007054] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer"
                          >
                            Comment
                          </button>
                        </form>
                      </div>

                    </div>
                  ))}

                {(project.issues || []).filter(iss => issueFilter === "all" ? true : iss.status === issueFilter).length === 0 && (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No {issueFilter} issues found. Click "+ New Issue" above to create one.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* SUB-VIEW 5: 🔀 PULL REQUESTS */}
          {/* ============================================================ */}
          {studentTab === "prs" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-black text-[#0f2427] flex items-center gap-2">
                    <GitPullRequest className="w-5 h-5 text-[#008766]" />
                    <span>Pull Requests & Code Reviews</span>
                  </h3>
                  <p className="text-xs text-slate-500">Propose code changes, review team diffs, and merge feature branches into main.</p>
                </div>

                <button
                  onClick={() => setShowNewPrModal(true)}
                  className="bg-[#008766] hover:bg-[#007054] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ New Pull Request</span>
                </button>
              </div>

              {/* PR List */}
              <div className="space-y-4">
                {(project.pullRequests || []).map((pr) => (
                  <div key={pr.id} className="p-5 rounded-2xl border border-slate-200 bg-[#fbfdfc] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#008766] transition-all">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 ${
                          pr.status === 'open' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          <GitPullRequest className="w-3 h-3" />
                          <span>{pr.status}</span>
                        </span>
                        <h4 className="text-sm font-bold text-[#0f2427]">
                          #{pr.id} {pr.title}
                        </h4>
                      </div>

                      <p className="text-xs text-slate-600 mb-2.5">{pr.desc}</p>

                      <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">{pr.sourceBranch}</span>
                        <span>➜</span>
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-bold">{pr.targetBranch}</span>
                        <span className="font-sans text-[11px] text-slate-400 ml-2">by {pr.author} • {pr.createdAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {pr.status === "open" ? (
                        <button
                          onClick={() => handleMergePr(pr.id)}
                          className="bg-[#008766] hover:bg-[#007054] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Merge Pull Request</span>
                        </button>
                      ) : (
                        <div className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>Merged into {pr.targetBranch}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {(project.pullRequests || []).length === 0 && (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No pull requests created yet. Click "+ New Pull Request" to propose branch changes.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* SUB-VIEW 6: ⚡ ACTIVITY PULSE */}
          {/* ============================================================ */}
          {studentTab === "activity" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              <div className="mb-6">
                <h3 className="text-lg font-black text-[#0f2427] flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#008766]" />
                  <span>Team Activity Pulse</span>
                </h3>
                <p className="text-xs text-slate-500">Live stream of code commits, pull requests, issue updates, and file uploads across the project.</p>
              </div>

              <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pl-6 py-2">
                {(project.activities || []).map((act) => (
                  <div key={act.id} className="relative">
                    <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                      act.type === 'commit' ? 'bg-[#008766]' :
                      act.type === 'pr' ? 'bg-purple-600' :
                      act.type === 'issue' ? 'bg-amber-600' :
                      act.type === 'join' ? 'bg-blue-600' : 'bg-slate-700'
                    }`}>
                      {act.type === 'commit' ? <GitCommit className="w-3 h-3" /> :
                       act.type === 'pr' ? <GitPullRequest className="w-3 h-3" /> :
                       act.type === 'issue' ? <AlertCircle className="w-3 h-3" /> :
                       act.type === 'join' ? <UserPlus className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0f2427]">{act.title}</span>
                        <span className="text-[10px] text-slate-400">• {act.time}</span>
                      </div>
                      {act.desc && <p className="text-xs text-slate-600 mt-0.5">{act.desc}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* SUB-VIEW 7: 🎯 INTERACTIVE MILESTONES */}
          {/* ============================================================ */}
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

          {/* ============================================================ */}
          {/* SUB-VIEW 8: 📁 DELIVERABLES VAULT */}
          {/* ============================================================ */}
          {studentTab === "files" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-black text-[#0f2427]">Academic Deliverable Vault</h3>
                  <p className="text-xs text-slate-500">IEEE SRS documents, UML designs, progress reports, and thesis PDFs.</p>
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-[#008766] hover:bg-[#007054] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
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

          {/* ============================================================ */}
          {/* SUB-VIEW 9: 💬 SUPERVISOR GUIDANCE & CHAT */}
          {/* ============================================================ */}
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
                  className="bg-[#008766] hover:bg-[#007054] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}

          {/* ============================================================ */}
          {/* SUB-VIEW 10: ⭐ RUBRIC SCORECARD */}
          {/* ============================================================ */}
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
      {/* 5. 🔐 AUTHENTICATION & REGISTRATION GATEWAY (`auth`) */}
      {/* ============================================================ */}
      {currentView === "auth" && (
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 snapflow-hero-bg py-10 sm:py-16">
          <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(0,135,102,0.12)] relative overflow-hidden transition-all">
            
            {/* Top Accent Gradient Bar */}
            <div className={`h-1.5 w-full absolute top-0 left-0 transition-all ${
              authRoleTab === "student" 
                ? "bg-gradient-to-r from-emerald-500 via-[#008766] to-teal-500" 
                : authRoleTab === "faculty" 
                ? "bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600" 
                : "bg-gradient-to-r from-indigo-500 via-blue-600 to-purple-600"
            }`}></div>

            {/* Header & Back Navigation */}
            <div className="flex items-center justify-between mb-5 pt-1">
              <button
                type="button"
                onClick={() => setCurrentView("roles")}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#008766] bg-slate-50 hover:bg-slate-100 border border-slate-200/80 px-3 py-1.5 rounded-full transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Portals Hub</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentView("public")}
                className="text-xs font-semibold text-slate-400 hover:text-[#008766] transition-colors cursor-pointer"
              >
                ProjectHub Home
              </button>
            </div>

            {/* Main Auth Sub-View Switcher: Login vs Register vs Forgot */}
            <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-2xl mb-6 border border-slate-200/80">
              <button
                type="button"
                onClick={() => setAuthSubView("login")}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authSubView === "login"
                    ? "bg-white text-[#0f2427] shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <LogIn className="w-3.5 h-3.5 text-[#008766]" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => setAuthSubView("register")}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authSubView === "register"
                    ? "bg-white text-[#0f2427] shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <UserPlus className="w-3.5 h-3.5 text-[#008766]" />
                <span>Create Account</span>
              </button>
            </div>

            {/* Role Switcher (Segmented Control) */}
            {authSubView !== "forgot" && (
              <div className="bg-slate-50 p-1 rounded-2xl mb-6 flex items-center border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setAuthRoleTab("student")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    authRoleTab === "student" 
                      ? "bg-white text-[#008766] shadow-xs border border-emerald-100" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>🎓 Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthRoleTab("faculty")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    authRoleTab === "faculty" 
                      ? "bg-white text-amber-700 shadow-xs border border-amber-100" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>👨‍🏫 Faculty</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthRoleTab("admin")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    authRoleTab === "admin" 
                      ? "bg-white text-indigo-700 shadow-xs border border-indigo-100" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>🛡️ Admin</span>
                </button>
              </div>
            )}

            {/* ============================================================ */}
            {/* SUB-VIEW 1: SIGN IN / LOGIN FORM */}
            {/* ============================================================ */}
            {authSubView === "login" && (
              <div className="space-y-4">
                {/* Title & Avatar */}
                <div className="text-center mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-2.5 shadow-xs border transition-all ${
                    authRoleTab === "student"
                      ? "bg-[#e6f4f1] border-[#bfe5dc] text-[#008766]"
                      : authRoleTab === "faculty"
                      ? "bg-amber-50 border-amber-200 text-amber-600"
                      : "bg-indigo-50 border-indigo-200 text-indigo-600"
                  }`}>
                    {authRoleTab === "student" ? "🎓" : authRoleTab === "faculty" ? "👨‍🏫" : "🛡️"}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0f2427] tracking-tight">
                    {authRoleTab === "student" ? "Student" : authRoleTab === "faculty" ? "Faculty Guide" : "Administrator"} Sign In
                  </h2>
                </div>

                {/* Form */}
                <form onSubmit={handleCustomLoginSubmit} className="space-y-3.5 pt-1">
                  {/* Institutional ID / Email */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        {authRoleTab === "admin" ? "Admin ID (@admin123)" : authRoleTab === "faculty" ? "Faculty User ID (@faculty123)" : "Student User ID (@student123)"}
                      </label>
                      <span className="text-[10px] text-slate-400 font-medium">Format: @name&lt;numbers&gt;</span>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder={authRoleTab === "student" ? "e.g. @student123 or @aarav123" : authRoleTab === "faculty" ? "e.g. @faculty123 or @arvind123" : "e.g. @admin123"}
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008766]/20 focus:border-[#008766] transition-all font-mono"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">Password</label>
                      <button
                        type="button"
                        onClick={() => setAuthSubView("forgot")}
                        className="text-[11px] text-[#008766] hover:underline font-semibold cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder={authRoleTab === "admin" ? "admin@123" : "••••••••"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008766]/20 focus:border-[#008766] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Credentials Helper Box with 1-Click Auto-Fill */}
                  {authRoleTab === "admin" && (
                    <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-3 text-[11px] text-indigo-950 flex items-center justify-between gap-2 shadow-2xs">
                      <div className="leading-snug">
                        <div className="font-bold flex items-center gap-1 text-indigo-900">
                          <span>🛡️ Static Admin Credentials:</span>
                        </div>
                        <div className="text-slate-600 mt-0.5">
                          ID: <strong className="font-mono text-indigo-700 font-extrabold">@admin123</strong> • Pass: <strong className="font-mono text-indigo-700 font-extrabold">admin@123</strong>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginEmail("@admin123");
                          setLoginPassword("admin@123");
                          showToast("✨ Auto-filled Admin static credentials!");
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1.5 rounded-xl text-[10px] font-bold cursor-pointer shrink-0 shadow-xs"
                      >
                        Auto-Fill
                      </button>
                    </div>
                  )}

                  {authRoleTab === "student" && (
                    <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3 text-[11px] text-emerald-950 flex items-center justify-between gap-2 shadow-2xs">
                      <div className="leading-snug">
                        <div className="font-bold flex items-center gap-1 text-emerald-900">
                          <span>🎓 Student Credentials:</span>
                        </div>
                        <div className="text-slate-600 mt-0.5">
                          Demo ID: <strong className="font-mono text-[#008766] font-extrabold">@student123</strong> • Pass: <strong className="font-mono text-[#008766] font-extrabold">student@123</strong>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginEmail("@student123");
                          setLoginPassword("student@123");
                          showToast("✨ Auto-filled Student demo credentials!");
                        }}
                        className="bg-[#008766] hover:bg-[#007054] text-white px-2.5 py-1.5 rounded-xl text-[10px] font-bold cursor-pointer shrink-0 shadow-xs"
                      >
                        Auto-Fill
                      </button>
                    </div>
                  )}

                  {authRoleTab === "faculty" && (
                    <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 text-[11px] text-amber-950 flex items-center justify-between gap-2 shadow-2xs">
                      <div className="leading-snug">
                        <div className="font-bold flex items-center gap-1 text-amber-900">
                          <span>👨‍🏫 Faculty Credentials:</span>
                        </div>
                        <div className="text-slate-600 mt-0.5">
                          Demo ID: <strong className="font-mono text-amber-700 font-extrabold">@faculty123</strong> • Pass: <strong className="font-mono text-amber-700 font-extrabold">faculty@123</strong>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginEmail("@faculty123");
                          setLoginPassword("faculty@123");
                          showToast("✨ Auto-filled Faculty demo credentials!");
                        }}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-1.5 rounded-xl text-[10px] font-bold cursor-pointer shrink-0 shadow-xs"
                      >
                        Auto-Fill
                      </button>
                    </div>
                  )}

                  {/* Remember Me */}
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-[#008766] focus:ring-[#008766]"
                      />
                      <span>Keep me signed in</span>
                    </label>
                    <span className="text-[11px] text-slate-400">256-bit SSL encrypted</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#008766] hover:bg-[#007054] text-white font-bold text-xs rounded-2xl shadow-md shadow-emerald-800/15 hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    <span>Sign In & Open {authRoleTab === "student" ? "Student Portal" : authRoleTab === "faculty" ? "Faculty Hub" : "Admin Console"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Footer Switcher */}
                <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <span>Don't have an account? </span>
                  <button
                    type="button"
                    onClick={() => setAuthSubView("register")}
                    className="font-bold text-[#008766] hover:underline cursor-pointer"
                  >
                    Register here
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* SUB-VIEW 2: REGISTRATION FORM */}
            {/* ============================================================ */}
            {authSubView === "register" && (
              <div className="space-y-4">
                {/* Title & Avatar */}
                <div className="text-center mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-2.5 shadow-xs border transition-all ${
                    authRoleTab === "student"
                      ? "bg-[#e6f4f1] border-[#bfe5dc] text-[#008766]"
                      : authRoleTab === "faculty"
                      ? "bg-amber-50 border-amber-200 text-amber-600"
                      : "bg-indigo-50 border-indigo-200 text-indigo-600"
                  }`}>
                    {authRoleTab === "student" ? "🎓" : authRoleTab === "faculty" ? "👨‍🏫" : "🛡️"}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-[#0f2427] tracking-tight">
                      {authRoleTab === "student" ? "Student" : authRoleTab === "faculty" ? "Faculty Guide" : "Administrator"} Registration
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickFillRegistration(authRoleTab)}
                    className="mt-2 text-[11px] font-bold text-[#008766] hover:underline inline-flex items-center gap-1 cursor-pointer bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80"
                  >
                    <span>⚡ Quick Auto-Fill Sample Info</span>
                  </button>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder={authRoleTab === "student" ? "e.g., Kunal Verma" : authRoleTab === "faculty" ? "e.g., Prof. Arvind Verma" : "e.g., Dr. Rajesh Mehta"}
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008766]/20 focus:border-[#008766] transition-all"
                      />
                    </div>
                  </div>

                  {/* User ID Handle (@<name><digits>) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        User ID <span className="text-emerald-700 font-mono">(@name&lt;numbers&gt;)</span>
                      </label>
                      <span className="text-[10px] text-slate-400">e.g. @kunal123, @student123</span>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Hash className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder={authRoleTab === "student" ? "@kunal123" : authRoleTab === "faculty" ? "@arvind101" : "@admin123"}
                        value={regHandle}
                        onChange={(e) => setRegHandle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008766]/20 focus:border-[#008766] transition-all font-mono"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 pl-1">
                      Must start with <strong>@</strong>, followed by your name and numeric digits.
                    </p>
                  </div>

                  {/* 2-Column Row: Roll/ID + Dept */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {authRoleTab === "student" ? "Roll Number" : "Staff / Faculty ID"}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Hash className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="text"
                          required
                          placeholder={authRoleTab === "student" ? "CS2023-019" : "FAC-CSE-009"}
                          value={regRoll}
                          onChange={(e) => setRegRoll(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-8.5 pr-3 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008766]/20 focus:border-[#008766] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Building2 className="w-3.5 h-3.5" />
                        </div>
                        <select
                          value={regDept}
                          onChange={(e) => setRegDept(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-8.5 pr-3 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008766]/20 focus:border-[#008766] transition-all cursor-pointer"
                        >
                          <option value="Computer Science & Engineering">Computer Science</option>
                          <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                          <option value="Information Technology">Information Tech</option>
                          <option value="Cybersecurity & Cryptography">Cybersecurity</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Institutional Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Institutional Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder={authRoleTab === "student" ? "kunal.verma@projecthub.edu" : "anita.deshmukh@projecthub.edu"}
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008766]/20 focus:border-[#008766] transition-all"
                      />
                    </div>
                  </div>

                  {/* 2-Column Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Create Password */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Create Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="Min. 6 chars"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008766]/20 focus:border-[#008766] transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          placeholder="Re-enter password"
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008766]/20 focus:border-[#008766] transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Password Match Real-Time Feedback */}
                  {regConfirmPassword && (
                    <div className={`flex items-center gap-1.5 px-2 text-[11px] font-bold ${
                      regPassword === regConfirmPassword ? "text-emerald-600" : "text-rose-500"
                    }`}>
                      {regPassword === regConfirmPassword ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Passwords match!</span>
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5 text-rose-500" />
                          <span>Passwords do not match</span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#008766] hover:bg-[#007054] text-white font-bold text-xs rounded-2xl shadow-md shadow-emerald-800/15 hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
                  >
                    <span>Register & Open {authRoleTab === "student" ? "Student Portal" : authRoleTab === "faculty" ? "Faculty Hub" : "Admin Console"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Footer Switcher */}
                <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <span>Already have an account? </span>
                  <button
                    type="button"
                    onClick={() => setAuthSubView("login")}
                    className="font-bold text-[#008766] hover:underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* SUB-VIEW 3: FORGOT PASSWORD FORM */}
            {/* ============================================================ */}
            {authSubView === "forgot" && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center text-2xl mx-auto mb-2.5 shadow-xs">
                    🔑
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0f2427] tracking-tight">
                    Reset Account Password
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 max-w-xs mx-auto">
                    Enter your university email address and we'll send you password recovery instructions.
                  </p>
                </div>

                <form onSubmit={handleForgotSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Institutional Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="yourname@projecthub.edu"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008766]/20 focus:border-[#008766] transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#008766] hover:bg-[#007054] text-white font-bold text-xs rounded-2xl shadow-md shadow-emerald-800/15 hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="text-center pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setAuthSubView("login")}
                    className="text-xs font-bold text-slate-500 hover:text-[#008766] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Back to Sign In</span>
                  </button>
                </div>
              </div>
            )}

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
      {/* 🔗 SHARE INVITE LINK & COLLABORATION HUB MODAL */}
      {/* ============================================================ */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowInviteModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#008766] to-teal-400 text-white flex items-center justify-center shadow-md shadow-emerald-800/20 shrink-0">
                <Share2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#008766] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Instant Team Invite Hub
                </span>
                <h3 className="text-xl font-black text-[#0f2427]">Share Project Invite Link</h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Share this clean link with your classmates. Anyone who opens the link can choose their role (Frontend, Backend, AI/ML, DevOps) and start collaborating on <strong>{project.title}</strong> with live code commits and issue tracking.
            </p>

            {/* Direct Link Copy Boxes */}
            <div className="space-y-3.5 mb-5">
              
              {/* 1. Primary Next.js Localhost Link */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#008766] flex items-center gap-1.5">
                    <span>💻 Web Link (Same Computer / Browser Tabs)</span>
                  </label>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.2 rounded font-mono">Port 3000</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 font-mono text-xs text-[#0f2427] truncate select-all font-semibold">
                    http://localhost:3000/join/{project.inviteCode}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`http://localhost:3000/join/${project.inviteCode}`);
                      showToast(`📋 Copied: http://localhost:3000/join/${project.inviteCode}`);
                    }}
                    className="bg-[#008766] hover:bg-[#007054] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 shadow-xs cursor-pointer shrink-0"
                    title="Copy exact clean URL"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() => window.open(`/join/${project.inviteCode}`, "_blank")}
                    className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer shrink-0"
                    title="Open link in a new tab to test joining"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#008766]" />
                    <span>Open Tab</span>
                  </button>
                </div>
              </div>

              {/* 2. Mobile Phone / Local Wi-Fi Network Link */}
              <div className="p-3.5 rounded-2xl bg-[#e6f4f1]/40 border border-[#bfe5dc]">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#008766] flex items-center gap-1.5">
                    <span>📱 Phone / Wi-Fi Network Link (For other devices on same Wi-Fi)</span>
                  </label>
                  <span className="text-[10px] bg-teal-100 text-teal-900 font-bold px-2 py-0.2 rounded font-mono">LAN IP</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 font-mono text-xs text-[#0f2427] truncate select-all font-semibold">
                    http://192.168.1.16:3000/join/{project.inviteCode}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`http://192.168.1.16:3000/join/${project.inviteCode}`);
                      showToast(`📋 Copied Phone Link: http://192.168.1.16:3000/join/${project.inviteCode}`);
                    }}
                    className="bg-[#008766] hover:bg-[#007054] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 shadow-xs cursor-pointer shrink-0"
                    title="Copy clean phone URL"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5">
                  * Teammates connected to the same Wi-Fi network can open this exact link from their phone or laptop.
                </p>
              </div>

              {/* 3. Flask Backend Link (Port 5000) */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    🐍 Python Flask Backend Link (Port 5000)
                  </label>
                  <span className="text-[9px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.2 rounded font-mono">Flask DB</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-[11px] text-slate-700 truncate select-all">
                    http://127.0.0.1:5000/join/{project.inviteCode}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`http://127.0.0.1:5000/join/${project.inviteCode}`);
                      showToast(`📋 Copied Flask Link: http://127.0.0.1:5000/join/${project.inviteCode}`);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() => window.open(`http://127.0.0.1:5000/join/${project.inviteCode}`, "_blank")}
                    className="bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 font-bold text-xs px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>

            {/* Clean Clickable WhatsApp & Email Sharing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `🚀 Join our Capstone Project Team on ProjectHub!\n\nProject: ${project.title}\nLeader: Aarav Sharma\n\n👉 Click here to join:\nhttp://192.168.1.16:3000/join/${project.inviteCode}\n\n(If testing on same PC, use:\nhttp://localhost:3000/join/${project.inviteCode})`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Share Clickable WhatsApp Link</span>
              </a>

              <a
                href={`mailto:?subject=${encodeURIComponent(`Join our Capstone Team: ${project.title}`)}&body=${encodeURIComponent(
                  `Hi,\n\nYou have been invited to join our engineering capstone team for ${project.title}.\n\nClick this link to join:\nhttp://localhost:3000/join/${project.inviteCode}\n\nProjectHub OS`
                )}`}
                className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Mail className="w-4 h-4 text-slate-600" />
                <span>Send via Email</span>
              </a>
            </div>

            {/* Interactive Simulation Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-200/80 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-amber-900">Want to test how teammates join?</div>
                <div className="text-[11px] text-amber-700">Simulate adding a new member in 1-click or open in a new tab.</div>
              </div>
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setShowJoinSimModal(true);
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
              >
                🚀 Try Join Demo
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 🚀 SIMULATE TEAMMATE JOINING MODAL */}
      {/* ============================================================ */}
      {showJoinSimModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowJoinSimModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#008766] flex items-center justify-center mb-4 font-bold text-xl border border-emerald-200">
              🎓
            </div>

            <h3 className="text-xl font-black text-[#0f2427] mb-1">Simulate Teammate Join</h3>
            <p className="text-xs text-slate-500 mb-5">
              Enter classmate details to simulate them opening the share link and joining your project roster.
            </p>

            <form onSubmit={handleSimulateJoin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Teammate Full Name</label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g., Kunal Verma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Project Role / Specialization</label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                >
                  <option value="Frontend Lead & UI/UX Design">Frontend Lead & UI/UX Design</option>
                  <option value="Backend Architect & APIs">Backend Architect & APIs</option>
                  <option value="AI / ML Specialist & Data Pipeline">AI / ML Specialist & Data Pipeline</option>
                  <option value="DevOps & Docker Infrastructure">DevOps & Docker Infrastructure</option>
                  <option value="QA Lead & AST Security Auditor">QA Lead & AST Security Auditor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Institutional Email</label>
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="e.g., kunal.verma@projecthub.edu"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowJoinSimModal(false)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 px-4 py-2 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#008766] hover:bg-[#007054] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Join Team Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 🐛 CREATE NEW ISSUE MODAL */}
      {/* ============================================================ */}
      {showNewIssueModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowNewIssueModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#0f2427] mb-1">Create Project Issue / Task</h3>
            <p className="text-xs text-slate-500 mb-5">Flag a bug, propose an enhancement, or assign a milestone task to a teammate.</p>

            <form onSubmit={handleCreateIssue} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Fix AST parser recursion limit on complex expressions"
                  value={newIssueTitle}
                  onChange={(e) => setNewIssueTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Label / Tag</label>
                  <select
                    value={newIssueLabel}
                    onChange={(e) => setNewIssueLabel(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                  >
                    <option value="bug">🐛 Bug</option>
                    <option value="feature">✨ Feature</option>
                    <option value="enhancement">⚡ Enhancement</option>
                    <option value="task">📋 Task</option>
                    <option value="docs">📚 Docs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newIssuePriority}
                    onChange={(e) => setNewIssuePriority(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                  >
                    <option value="Critical">🔴 Critical</option>
                    <option value="High">🟠 High</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Low">🟢 Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assignee</label>
                <select
                  value={newIssueAssignee}
                  onChange={(e) => setNewIssueAssignee(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                >
                  {project.members.map((m, idx) => (
                    <option key={idx} value={m.name}>{m.name} ({m.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newIssueDesc}
                  onChange={(e) => setNewIssueDesc(e.target.value)}
                  placeholder="Detailed description of the problem, expected behavior, or steps to reproduce..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewIssueModal(false)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 px-4 py-2 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#008766] hover:bg-[#007054] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Issue</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 🔀 CREATE NEW PULL REQUEST MODAL */}
      {/* ============================================================ */}
      {showNewPrModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowNewPrModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#0f2427] mb-1">Open Pull Request</h3>
            <p className="text-xs text-slate-500 mb-5">Propose changes from your feature branch to merge into the main codebase.</p>

            <form onSubmit={handleCreatePr} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pull Request Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Feature: Add JWT Authentication & Rate Limiting"
                  value={newPrTitle}
                  onChange={(e) => setNewPrTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Source Branch</label>
                  <input
                    type="text"
                    required
                    value={newPrSource}
                    onChange={(e) => setNewPrSource(e.target.value)}
                    placeholder="feature/branch-name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-mono text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Branch</label>
                  <input
                    type="text"
                    required
                    value={newPrTarget}
                    onChange={(e) => setNewPrTarget(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-mono text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Summary of Changes</label>
                <textarea
                  rows={3}
                  value={newPrDesc}
                  onChange={(e) => setNewPrDesc(e.target.value)}
                  placeholder="Describe the architectural changes, test results, and dependencies..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewPrModal(false)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 px-4 py-2 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#008766] hover:bg-[#007054] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <GitPullRequest className="w-3.5 h-3.5" />
                  <span>Submit PR</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 💻 CREATE NEW CODE FILE MODAL */}
      {/* ============================================================ */}
      {showNewCodeFileModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowNewCodeFileModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#0f2427] mb-1">Create New Code Module</h3>
            <p className="text-xs text-slate-500 mb-5">Add a new file to the ProjectHub repository and commit it to main.</p>

            <form onSubmit={handleAddNewCodeFile} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">File Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., config.py or api_client.ts"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-mono text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Language</label>
                <select
                  value={newFileLang}
                  onChange={(e) => setNewFileLang(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                >
                  <option value="python">Python (.py)</option>
                  <option value="typescript">TypeScript (.ts / .tsx)</option>
                  <option value="javascript">JavaScript (.js)</option>
                  <option value="markdown">Markdown (.md)</option>
                  <option value="json">JSON (.json)</option>
                  <option value="sql">SQL (.sql)</option>
                  <option value="dockerfile">Dockerfile</option>
                  <option value="yaml">YAML (.yml)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Initial Code / Boilerplate</label>
                <textarea
                  rows={4}
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  placeholder="// Paste or write initial module code here..."
                  className="w-full bg-slate-900 text-emerald-300 font-mono text-xs rounded-xl p-3 border border-slate-700 focus:outline-none focus:border-[#008766]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewCodeFileModal(false)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 px-4 py-2 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#008766] hover:bg-[#007054] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create & Commit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 👨‍🏫 FACULTY & ADMIN ROLE SELECTION MODAL */}
      {/* ============================================================ */}
      {showFacultyRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowFacultyRoleModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-indigo-50 border border-slate-200 flex items-center justify-center text-2xl mx-auto mb-3 shadow-xs">
                <span>👨‍🏫</span>
              </div>
              <h3 className="text-2xl font-black text-[#0f2427] tracking-tight">Faculty & Staff Login</h3>
              <p className="text-xs text-slate-500 mt-1">Select whether you are logging in as a Faculty Guide or an Administrator.</p>
            </div>

            <div className="space-y-3.5">
              {/* Option 1: Login as Faculty */}
              <div className="p-4 rounded-2xl border-2 border-amber-100 bg-amber-50/40 hover:border-amber-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl shrink-0 font-bold">
                    👨‍🏫
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0f2427]">Faculty Guide / Evaluator</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">Milestone sign-offs, team proposal reviews & viva grading.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFacultyRoleModal(false);
                      if (currentUser && currentUser.role === "faculty") {
                        setCurrentView("faculty_hub");
                      } else {
                        setAuthRoleTab("faculty");
                        setAuthSubView("login");
                        setCurrentView("auth");
                      }
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    Login as Faculty
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowFacultyRoleModal(false);
                      handleDemoLogin("faculty");
                    }}
                    className="bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-[11px] px-2.5 py-2 rounded-xl transition-all cursor-pointer"
                    title="1-Click Faculty Demo"
                  >
                    1-Click Demo
                  </button>
                </div>
              </div>

              {/* Option 2: Login as Admin */}
              <div className="p-4 rounded-2xl border-2 border-indigo-100 bg-indigo-50/40 hover:border-indigo-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center text-xl shrink-0 font-bold">
                    🛡️
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0f2427]">Administrator / Dean</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">Institute-wide user verification, department & capstone rosters.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFacultyRoleModal(false);
                      if (currentUser && currentUser.role === "admin") {
                        setCurrentView("admin_console");
                      } else {
                        setAuthRoleTab("admin");
                        setAuthSubView("login");
                        setCurrentView("auth");
                      }
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    Login as Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowFacultyRoleModal(false);
                      handleDemoLogin("admin");
                    }}
                    className="bg-white hover:bg-indigo-100 border border-indigo-300 text-indigo-900 font-bold text-[11px] px-2.5 py-2 rounded-xl transition-all cursor-pointer"
                    title="1-Click Admin Demo"
                  >
                    1-Click Demo
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Need help? Contact academic desk</span>
              <button
                type="button"
                onClick={() => setShowFacultyRoleModal(false)}
                className="text-slate-600 hover:text-slate-900 font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
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
                {currentUser?.role === "student" ? "🎓" : currentUser?.role === "faculty" ? "👨‍🏫" : "🛡️"}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-[#0f2427]">
                  {currentUser ? `${currentUser.name} (${currentUser.roleLabel})` : "Active User"}
                </div>
                <div className="text-[11px] text-slate-500">
                  {currentUser ? `${currentUser.dept} • ${currentUser.email}` : "University Capstone Workspace"}
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
                onClick={handleLogoutConfirm}
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

          <div className="flex flex-wrap items-center gap-4">
            <button type="button" onClick={() => setCurrentView("public")} className="hover:text-[#008766] transition-colors cursor-pointer">Home</button>
            <button type="button" onClick={() => setCurrentView("about")} className="hover:text-[#008766] transition-colors cursor-pointer">About Us</button>
            <button type="button" onClick={() => setCurrentView("roles")} className="hover:text-[#008766] transition-colors cursor-pointer">Portals Hub</button>
          </div>

          <div>© 2026 ProjectHub Inc. All rights reserved.</div>
        </div>
      </footer>

    </div>
  );
}
