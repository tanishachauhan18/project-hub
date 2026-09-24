from datetime import datetime, timedelta
from app.models import db, User, Project, ProjectMember, Milestone, ProjectFile, CodeSnippet, Discussion, Feedback, Evaluation, Notification, SystemLog

def seed_database():
    # If users exist, do not reseed
    if User.query.first():
        print("Database already contains data. Skipping initial seeding.")
        return

    print("Populating ProjectHub with realistic seed data...")

    # 1. ADMIN USER
    admin = User(
        full_name="Dr. Rajesh Mehta",
        email="admin@projecthub.edu",
        role="admin",
        roll_or_faculty_id="ADM-HEAD-01",
        department="Information Technology",
        phone="+91 98765 00001",
        bio="Academic Dean and Central System Administrator for Senior Engineering Projects.",
        is_approved=True
    )
    admin.set_password("Admin@123")
    db.session.add(admin)

    # 2. FACULTY GUIDES
    fac1 = User(
        full_name="Prof. Arvind Verma",
        email="dr.verma@projecthub.edu",
        role="faculty",
        roll_or_faculty_id="FAC-CS-101",
        department="Computer Science & Engineering",
        phone="+91 98765 10101",
        bio="Professor in Distributed Systems, Cloud Architecture, and Software Engineering with 18+ years of academic research.",
        skills="Cloud Computing, Distributed Systems, Python, Microservices, System Design",
        is_approved=True
    )
    fac1.set_password("Faculty@123")
    db.session.add(fac1)

    fac2 = User(
        full_name="Dr. Anita Deshmukh",
        email="dr.anita@projecthub.edu",
        role="faculty",
        roll_or_faculty_id="FAC-AI-204",
        department="Artificial Intelligence & Data Science",
        phone="+91 98765 20202",
        bio="Associate Professor specializing in Computer Vision, Natural Language Processing, and Deep Learning applications.",
        skills="PyTorch, Computer Vision, Transformers, LLMs, Medical Imaging",
        is_approved=True
    )
    fac2.set_password("Faculty@123")
    db.session.add(fac2)

    fac3 = User(
        full_name="Prof. Rahul Nair",
        email="prof.rahul@projecthub.edu",
        role="faculty",
        roll_or_faculty_id="FAC-SEC-305",
        department="Cyber Security & Networks",
        phone="+91 98765 30303",
        bio="Specialist in Cryptography, Zero-Knowledge Proofs, and Blockchain Security architectures.",
        skills="Cybersecurity, Cryptography, Blockchain, Zero Trust, Network Security",
        is_approved=True
    )
    fac3.set_password("Faculty@123")
    db.session.add(fac3)

    # 3. APPROVED STUDENTS
    s1 = User(
        full_name="Aarav Sharma",
        email="aarav.sharma@projecthub.edu",
        role="student",
        roll_or_faculty_id="CS2022-041",
        department="Computer Science & Engineering",
        phone="+91 98765 40001",
        bio="Final-year CSE student passionate about Full-Stack web apps, distributed systems, and DevOps.",
        skills="Python, Flask, React, PostgreSQL, Docker, Redis",
        is_approved=True
    )
    s1.set_password("Student@123")
    db.session.add(s1)

    s2 = User(
        full_name="Priya Patel",
        email="priya.patel@projecthub.edu",
        role="student",
        roll_or_faculty_id="CS2022-089",
        department="Computer Science & Engineering",
        phone="+91 98765 40002",
        bio="Frontend architect & UI/UX specialist focused on high-performance interactive web dashboards.",
        skills="JavaScript, React, TailwindCSS, Figma, Chart.js, HTML5/CSS3",
        is_approved=True
    )
    s2.set_password("Student@123")
    db.session.add(s2)

    s3 = User(
        full_name="Rohan Gupta",
        email="rohan.gupta@projecthub.edu",
        role="student",
        roll_or_faculty_id="CS2022-112",
        department="Computer Science & Engineering",
        phone="+91 98765 40003",
        bio="Backend & Infrastructure enthusiast with experience in API security, microservices, and database tuning.",
        skills="FastAPI, PostgreSQL, Redis, Kubernetes, Linux, Docker",
        is_approved=True
    )
    s3.set_password("Student@123")
    db.session.add(s3)

    s4 = User(
        full_name="Neha Singh",
        email="neha.singh@projecthub.edu",
        role="student",
        roll_or_faculty_id="AI2022-015",
        department="Artificial Intelligence & Data Science",
        phone="+91 98765 40004",
        bio="AI researcher working on medical image segmentation and Explainable AI (XAI).",
        skills="PyTorch, OpenCV, Scikit-learn, HuggingFace, Python",
        is_approved=True
    )
    s4.set_password("Student@123")
    db.session.add(s4)

    s5 = User(
        full_name="Vikram Aditya",
        email="vikram.aditya@projecthub.edu",
        role="student",
        roll_or_faculty_id="AI2022-078",
        department="Artificial Intelligence & Data Science",
        phone="+91 98765 40005",
        bio="Data scientist specializing in deep learning optimization, model serving, and data pipelines.",
        skills="TensorFlow, PyTorch, FastAPI, MLflow, Docker",
        is_approved=True
    )
    s5.set_password("Student@123")
    db.session.add(s5)

    s6 = User(
        full_name="Sanya Kapoor",
        email="sanya.kapoor@projecthub.edu",
        role="student",
        roll_or_faculty_id="SEC2022-034",
        department="Cyber Security & Networks",
        phone="+91 98765 40006",
        bio="Cybersecurity student with keen interest in Zero Knowledge proofs and decentralized authentication.",
        skills="Solidity, Rust, Web3.py, Cryptography, Security Auditing",
        is_approved=True
    )
    s6.set_password("Student@123")
    db.session.add(s6)

    # 4. PENDING STUDENTS (To showcase Admin Approval Workflow)
    p_s1 = User(
        full_name="Kunal Verma",
        email="kunal.verma@projecthub.edu",
        role="student",
        roll_or_faculty_id="CS2023-019",
        department="Computer Science & Engineering",
        phone="+91 98765 50001",
        bio="Junior CSE student applying for project team registration.",
        skills="Java, Spring Boot, MySQL",
        is_approved=False
    )
    p_s1.set_password("Student@123")
    db.session.add(p_s1)

    p_s2 = User(
        full_name="Tanvi Joshi",
        email="tanvi.joshi@projecthub.edu",
        role="student",
        roll_or_faculty_id="AI2023-054",
        department="Artificial Intelligence & Data Science",
        phone="+91 98765 50002",
        bio="AI enthusiast seeking guide allocation.",
        skills="Python, Pandas, NumPy, Data Analysis",
        is_approved=False
    )
    p_s2.set_password("Student@123")
    db.session.add(p_s2)

    p_s3 = User(
        full_name="Sameer Khan",
        email="sameer.khan@projecthub.edu",
        role="student",
        roll_or_faculty_id="IT2023-082",
        department="Information Technology",
        phone="+91 98765 50003",
        bio="Cloud enthusiast awaiting project team formation.",
        skills="AWS, Terraform, Node.js",
        is_approved=False
    )
    p_s3.set_password("Student@123")
    db.session.add(p_s3)

    db.session.commit()

    # 5. PROJECTS SEEDING
    # Project 1: DevSphere (In Progress, Active Team of 3)
    proj1 = Project(
        title="DevSphere: AI-Powered Autonomous Cloud IDE & Code Review Engine",
        abstract="A centralized developer workspace that integrates containerized sandboxes, continuous static code analysis, automated vulnerability detection, and real-time team pair programming.",
        domain="Web SaaS",
        tech_stack="Python Flask, React, Docker Engine, PostgreSQL, Redis, Monaco Editor",
        github_url="https://github.com/projecthub-team/devsphere-cloud-ide",
        live_demo_url="https://devsphere.demo.projecthub.edu",
        status="in_progress",
        progress_percent=60,
        created_by_id=s1.id,
        faculty_guide_id=fac1.id
    )
    db.session.add(proj1)
    db.session.flush()

    # Team Members (3 members: Aarav, Priya, Rohan)
    m1_1 = ProjectMember(project_id=proj1.id, user_id=s1.id, role_in_team="Team Leader & Backend Architect", status="joined")
    m1_2 = ProjectMember(project_id=proj1.id, user_id=s2.id, role_in_team="Frontend Lead & UI/UX Design", status="joined")
    m1_3 = ProjectMember(project_id=proj1.id, user_id=s3.id, role_in_team="DevOps & Docker Infrastructure", status="joined")
    db.session.add_all([m1_1, m1_2, m1_3])

    # Milestones for Project 1
    today = datetime.utcnow().date()
    ms1_1 = Milestone(
        project_id=proj1.id,
        title="Milestone 1: SRS & Architecture Specification",
        description="Detailed requirement gathering, microservice architecture diagrams, and IEEE SRS signoff.",
        due_date=today - timedelta(days=30),
        weight_percent=20,
        status="completed",
        completed_at=datetime.utcnow() - timedelta(days=28)
    )
    ms1_2 = Milestone(
        project_id=proj1.id,
        title="Milestone 2: Container Sandbox & Code Editor Integration",
        description="Docker orchestration on host, isolated container spinup, and web socket terminal streaming.",
        due_date=today - timedelta(days=10),
        weight_percent=25,
        status="completed",
        completed_at=datetime.utcnow() - timedelta(days=8)
    )
    ms1_3 = Milestone(
        project_id=proj1.id,
        title="Milestone 3: AI Code Review & AST Vulnerability Scanner",
        description="Integrate AST parser with LLM heuristics to flag SQLi, XSS, and unhandled async promises.",
        due_date=today + timedelta(days=14),
        weight_percent=30,
        status="in_progress"
    )
    ms1_4 = Milestone(
        project_id=proj1.id,
        title="Milestone 4: Multi-tenant Load Testing & Final Viva Defense",
        description="Benchmarking with 100 concurrent developers, documentation compilation, and final viva presentation.",
        due_date=today + timedelta(days=35),
        weight_percent=25,
        status="pending"
    )
    db.session.add_all([ms1_1, ms1_2, ms1_3, ms1_4])

    # Files for Project 1
    f1_1 = ProjectFile(
        project_id=proj1.id,
        uploaded_by_id=s1.id,
        file_name="DevSphere_SRS_Specification_v1.2.pdf",
        original_name="DevSphere_SRS_Specification_v1.2.pdf",
        file_category="SRS",
        file_type="PDF",
        file_size_kb=1420,
        file_path="DevSphere_SRS_Specification_v1.2.pdf",
        version="v1.2",
        description="Finalized IEEE Software Requirements Specification approved by guide."
    )
    f1_2 = ProjectFile(
        project_id=proj1.id,
        uploaded_by_id=s2.id,
        file_name="System_Architecture_Diagrams.pdf",
        original_name="System_Architecture_Diagrams.pdf",
        file_category="Design",
        file_type="PDF",
        file_size_kb=860,
        file_path="System_Architecture_Diagrams.pdf",
        version="v1.0",
        description="Component diagram, sequence diagrams, and Docker network topology."
    )
    db.session.add_all([f1_1, f1_2])

    # Code Snippets for Project 1
    c1_1 = CodeSnippet(
        project_id=proj1.id,
        author_id=s1.id,
        file_name="sandbox_runner.py",
        language="python",
        code_content="""import docker
import os

class SandboxManager:
    def __init__(self):
        self.client = docker.from_env()

    def spawn_environment(self, project_id: str, image: str = "python:3.11-slim"):
        container_name = f"sandbox_{project_id}"
        container = self.client.containers.run(
            image=image,
            name=container_name,
            detach=True,
            tty=True,
            mem_limit="512m",
            cpu_period=100000,
            cpu_quota=50000, # 50% CPU limit
            network_mode="bridge"
        )
        return {"container_id": container.id, "status": "running"}
""",
        commit_message="Implement secure resource-constrained Docker container runtime"
    )
    db.session.add(c1_1)

    # Discussions for Project 1
    d1_1 = Discussion(
        project_id=proj1.id,
        user_id=s1.id,
        message="Team: Milestone 2 Docker container runner is fully functional now. Priya, please link the terminal output component to the WebSocket."
    )
    d1_2 = Discussion(
        project_id=proj1.id,
        user_id=s2.id,
        message="Got it Aarav! I have tested the Monaco Editor theme switching and xterm.js terminal integration on the branch. Pushing UI commits today."
    )
    d1_3 = Discussion(
        project_id=proj1.id,
        user_id=fac1.id,
        message="Great progress team. Make sure to enforce strict memory and CPU quotas so container processes cannot compromise the host system."
    )
    db.session.add_all([d1_1, d1_2, d1_3])

    # Feedbacks for Project 1
    fb1 = Feedback(
        project_id=proj1.id,
        faculty_id=fac1.id,
        milestone_id=ms1_2.id,
        feedback_text="Milestone 2 implementation is thoroughly designed. Docker sandboxing works as intended. Ensure AST security checks are covered in Milestone 3.",
        remarks_type="Milestone Review",
        rating=5
    )
    db.session.add(fb1)


    # Project 2: NeuroScan (Evaluated & Completed - Team of 2)
    proj2 = Project(
        title="NeuroScan: Explainable Deep Learning Pipeline for Brain Tumor MRI Segmentation",
        abstract="An end-to-end medical diagnosis platform employing 3D U-Net and Attention Mechanisms on multi-modal MRI scans with Grad-CAM visual explainability maps for clinical radiologist verification.",
        domain="AI/ML",
        tech_stack="PyTorch, FastAPI, React, DICOM, MONAI, Docker",
        github_url="https://github.com/projecthub-team/neuroscan-mri-segmentation",
        live_demo_url="https://neuroscan.demo.projecthub.edu",
        status="evaluated",
        progress_percent=100,
        created_by_id=s4.id,
        faculty_guide_id=fac2.id,
        final_submission_notes="All 4 milestones completed. BraTS 2023 dataset tested with Dice score of 0.923. IEEE project thesis submitted.",
        final_submission_date=datetime.utcnow() - timedelta(days=3)
    )
    db.session.add(proj2)
    db.session.flush()

    m2_1 = ProjectMember(project_id=proj2.id, user_id=s4.id, role_in_team="Team Lead & Deep Learning Engineer", status="joined")
    m2_2 = ProjectMember(project_id=proj2.id, user_id=s5.id, role_in_team="Computer Vision & API Pipelines", status="joined")
    db.session.add_all([m2_1, m2_2])

    # Evaluation for Project 2
    ev2 = Evaluation(
        project_id=proj2.id,
        faculty_id=fac2.id,
        marks_presentation=19,
        marks_code_quality=19,
        marks_documentation=20,
        marks_viva=18,
        marks_innovation=19,
        final_verdict="Approved",
        remarks="Exceptional project execution. High Dice coefficient metric achieved and Grad-CAM explainability provides genuine clinical utility. Recommended for departmental conference publication."
    )
    ev2.calculate_totals()
    db.session.add(ev2)


    # Project 3: TrustMesh (Pending Guide Request - Team of 2)
    proj3 = Project(
        title="TrustMesh: Zero-Knowledge Decentralized Academic Credential Verification",
        abstract="A tamper-proof credential issuance and verification registry utilizing Zero-Knowledge SNARKs to allow students to prove academic degree qualifications without revealing confidential transcripts or GPA.",
        domain="Cybersecurity",
        tech_stack="Solidity, Rust, Circom, Web3.py, Next.js, IPFS",
        github_url="https://github.com/projecthub-team/trustmesh-zkp",
        status="guide_pending",
        progress_percent=0,
        created_by_id=s6.id,
        faculty_guide_id=fac3.id
    )
    db.session.add(proj3)
    db.session.flush()

    m3_1 = ProjectMember(project_id=proj3.id, user_id=s6.id, role_in_team="Team Leader & ZK Cryptography", status="joined")
    m3_2 = ProjectMember(project_id=proj3.id, user_id=s2.id, role_in_team="Frontend & Web3 Interface", status="joined")
    db.session.add_all([m3_1, m3_2])


    # 6. NOTIFICATIONS
    notifs = [
        Notification(
            user_id=s1.id,
            title="Milestone 2 Approved",
            message="Prof. Arvind Verma reviewed and approved Milestone 2 with a 5-star rating.",
            link="/student/workspace/1",
            type="success"
        ),
        Notification(
            user_id=s4.id,
            title="Final Project Evaluated!",
            message="Dr. Anita Deshmukh has evaluated your project 'NeuroScan' with Grade A+ (95/100).",
            link="/student/workspace/2",
            type="success"
        ),
        Notification(
            user_id=fac3.id,
            title="New Guide Proposal Received",
            message="Team 'TrustMesh' led by Sanya Kapoor submitted a guide request for your review.",
            link="/faculty/guide-requests",
            type="warning"
        ),
        Notification(
            user_id=admin.id,
            title="3 Student Registrations Pending Approval",
            message="New student registrations from Kunal Verma, Tanvi Joshi, and Sameer Khan are awaiting admin verification.",
            link="/admin/approvals",
            type="info"
        )
    ]
    db.session.add_all(notifs)

    # 7. SYSTEM LOGS
    logs = [
        SystemLog(user_id=admin.id, action="System Initialized", details="ProjectHub Academic Portal database bootstrapped with roles and default schema.", ip_address="127.0.0.1"),
        SystemLog(user_id=s1.id, action="Project Created", details="Created new project: DevSphere (ID: 1)", ip_address="127.0.0.1"),
        SystemLog(user_id=fac1.id, action="Milestone Signed Off", details="Approved Milestone 2 for Project ID 1", ip_address="127.0.0.1"),
        SystemLog(user_id=fac2.id, action="Final Evaluation Published", details="Submitted rubric evaluation (95/100) for NeuroScan (Project ID 2)", ip_address="127.0.0.1"),
        SystemLog(user_id=s6.id, action="Guide Request Dispatched", details="Requested Prof. Rahul Nair as Faculty Guide for TrustMesh", ip_address="127.0.0.1")
    ]
    db.session.add_all(logs)

    db.session.commit()
    print("ProjectHub database successfully seeded with realistic accounts, projects, milestones, and evaluations!")
