# 🎓 ProjectHub – Student Project Collaboration & Management System

> **A centralized university project collaboration, milestone tracking, and 5-criteria rubric evaluation SaaS platform.**

ProjectHub connects **Students, Faculty Guides, and Academic Administrators** in one unified workspace. It streamlines the entire academic project lifecycle—from student registration approval and 2–4 member team formation to milestone tracking, source code collaboration, file management, live discussions, and final rubric evaluation.

---

## 🚀 Key Features by User Role

### 1. 🎓 Student Portal
* **Registration & Approval Gate**: Students register with university credentials and roll numbers. Accounts are activated once approved by the Admin.
* **Team Formation (2–4 Members)**: Assemble student teams with specialized roles (*Frontend Developer, Backend Engineer, ML Lead, QA & Documentation*).
* **Faculty Guide Request**: Send formal project proposals and abstract outlines to certified departmental supervisors.
* **Interactive Project Workspace**:
  * **Overview**: Project abstract, tech stack tags, repository links, and live demonstration URLs.
  * **Team Directory**: Member contacts and role assignments.
  * **Milestones & Progress**: Automated progress % calculation from completed milestone weights.
  * **Source Code Repository**: Syntax-highlighted code viewer, commit logs, and author tagging.
  * **Deliverable Vault**: Categorized document storage (*SRS, Architecture Design, Documentation, Code Archive, Reports, Presentations*).
  * **Team Discussion Forum**: Threaded chat between team members and faculty guide.
  * **Faculty Remarks**: Official supervisor feedback and star ratings.
  * **Final Project Submission**: Final deliverables upload and certified rubric scorecard inspection.
* **AI Project Assistant**: Brainstorm novel research project ideas, plan 4-phase milestone roadmaps, and audit code snippets for vulnerabilities.

### 2. 👨‍🏫 Faculty Guide Hub
* **Guide Proposal Queue**: Review, accept, or decline incoming student supervision requests.
* **Assigned Projects Directory**: Monitor student teams across domains with progress indicators.
* **Milestone Sign-off**: Verify project deliverables and sign off milestones.
* **Structured Feedback & Ratings**: Submit classified remarks (*Milestone Review, Code Review, Correction, Approval*) with 1–5 star ratings.
* **5-Criteria Rubric Grading Sheet**:
  * Presentation & Communication (/20)
  * Code Quality & Architecture (/20)
  * Documentation & SRS Quality (/20)
  * Technical Viva & Problem Solving (/20)
  * Innovation & Research Impact (/20)
  * **Total Score (/100)** with automated Letter Grade assignment (*A+, A, B, C, D, F*) and verdict (*Approved, Revision Required, Rejected*).

### 3. 🛡️ Administrator Console
* **Student Registration Approvals**: Verification queue with 1-click single and bulk approval actions.
* **User Management**: Central directory for students and faculty with status toggles and department filters.
* **Master Project Repository**: Cross-departmental project audit with administrative status overrides.
* **File Repository Monitor**: Central monitoring of all uploaded documents, file sizes, and categories.
* **Analytics & Reports Generator**:
  * Departmental and domain distribution charts (*Chart.js*)
  * University-wide grade distribution analytics
  * Faculty supervisor workload analysis
  * Printable/PDF export-ready layout
* **System Settings**: Configurable academic calendars, deadlines, and storage parameters.

---

## 🛠️ Technology Stack

* **Frontend**: HTML5, CSS3 (Custom Modern SaaS Theme in Blue + White + Dark Navy), Bootstrap 5, JavaScript, Chart.js, FontAwesome 6.
* **Backend**: Python 3.11, Flask (Modular Blueprints Architecture).
* **Database**: MySQL 8.0+ / MariaDB (Zero-config SQLite fallback included out-of-the-box).
* **ORM & Security**: Flask-SQLAlchemy, Werkzeug Password Hashing.

---

## ⚡ Quick Start Guide

### 1. Installation
Clone the repository and install the dependencies:
```bash
pip install -r requirements.txt
```

### 2. (Optional) Configure MySQL Database
By default, ProjectHub runs out-of-the-box with an auto-seeded SQLite database. To use MySQL, set the `DATABASE_URL` environment variable:
```bash
# Windows PowerShell
$env:DATABASE_URL="mysql+pymysql://root:password@localhost/projecthub_db"

# Or import schema into MySQL directly:
# mysql -u root -p < schema.sql
```

### 3. Run Application
```bash
python run.py
```
Open **`http://127.0.0.1:5000`** in your browser.

---

## 🔑 Pre-Configured Demo Accounts

For immediate testing, click the **1-Click Quick Demo Sign-In** buttons on the Login page or use the credentials below:

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Student (Leader)** | Aarav Sharma | `aarav.sharma@projecthub.edu` | `Student@123` |
| **Student (Member)** | Priya Patel | `priya.patel@projecthub.edu` | `Student@123` |
| **Faculty Guide** | Prof. Arvind Verma | `dr.verma@projecthub.edu` | `Faculty@123` |
| **Faculty Guide (AI)** | Dr. Anita Deshmukh | `dr.anita@projecthub.edu` | `Faculty@123` |
| **Administrator** | Dr. Rajesh Mehta | `admin@projecthub.edu` | `Admin@123` |

---

## 📁 Project Directory Structure

```
projecthub/
├── app/
│   ├── __init__.py           # Flask App Factory & Route Blueprints
│   ├── config.py             # Configuration Settings
│   ├── models.py             # SQLAlchemy Relational Models (User, Project, Milestone, File, Evaluation, etc.)
│   ├── seed_data.py          # Realistic Database Seeder
│   ├── routes/
│   │   ├── auth.py           # Login, Register, Profile, Logout
│   │   ├── public.py         # Landing, About, Features, How It Works, Contact
│   │   ├── student.py        # Student Dashboard, Create Project, Workspace
│   │   ├── faculty.py        # Faculty Dashboard, Requests, Evaluation
│   │   ├── admin.py          # Admin Dashboard, Approvals, Reports, Users
│   │   └── api.py            # AI Assistant APIs & Live Notifications
│   ├── static/
│   │   ├── css/              # SaaS Design System (style.css, workspace.css)
│   │   ├── js/               # Interactivity, Chart.js, Workspace Scripts
│   │   └── uploads/          # Deliverable Storage Folder
│   └── templates/
│       ├── base.html         # Master Layout with Dynamic Role Sidebar
│       ├── components/       # AI Assistant Modal
│       ├── public/           # Landing, About, Features, Contact, 404, 500
│       ├── auth/             # Login, Register, Pending Approval, Profile
│       ├── student/          # Dashboard, Projects, Create Project, Workspace
│       ├── faculty/          # Dashboard, Guide Requests, Assigned Projects, Workspace, Evaluate
│       └── admin/            # Dashboard, Approvals, Students, Faculty, Projects, Files, Reports, Settings
├── schema.sql                # Production MySQL Database Schema
├── requirements.txt          # Python Packages
├── test_verification.py      # Automated Integration Test Suite
└── run.py                    # Server Startup Script
```

---

## 🔮 Future-Ready Roadmap
* **AI Code Reviewer & Auto-Linter**: Deep AST parser integration with LLM recommendations.
* **GitHub Webhooks Integration**: Automated repository synchronization and PR status tracking.
* **Real-time WebSockets**: Instant chat and milestone activity streaming.
* **Cloud Object Storage**: S3 / MinIO integration for multi-gigabyte machine learning datasets.
