from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='student')  # 'student', 'faculty', 'admin'
    roll_or_faculty_id = db.Column(db.String(50), nullable=True)
    department = db.Column(db.String(100), nullable=False, default='Computer Science & Engineering')
    phone = db.Column(db.String(20), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    skills = db.Column(db.String(255), nullable=True)
    avatar_url = db.Column(db.String(255), nullable=True)
    is_approved = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    created_projects = db.relationship('Project', backref='creator', lazy=True, foreign_keys='Project.created_by_id')
    guided_projects = db.relationship('Project', backref='faculty_guide', lazy=True, foreign_keys='Project.faculty_guide_id')
    team_memberships = db.relationship('ProjectMember', backref='user', lazy=True, cascade="all, delete-orphan")
    feedbacks = db.relationship('Feedback', backref='faculty', lazy=True)
    notifications = db.relationship('Notification', backref='recipient', lazy=True, cascade="all, delete-orphan", order_by="desc(Notification.created_at)")
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @property
    def role_badge(self):
        badges = {
            'admin': 'badge-admin',
            'faculty': 'badge-faculty',
            'student': 'badge-student'
        }
        return badges.get(self.role, 'badge-secondary')

    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email,
            'role': self.role,
            'roll_or_faculty_id': self.roll_or_faculty_id,
            'department': self.department,
            'is_approved': self.is_approved
        }


class Project(db.Model):
    __tablename__ = 'projects'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    abstract = db.Column(db.Text, nullable=False)
    domain = db.Column(db.String(100), nullable=False)  # AI/ML, Web SaaS, Cloud, IoT, CyberSecurity, etc.
    tech_stack = db.Column(db.String(255), nullable=False)
    github_url = db.Column(db.String(255), nullable=True)
    live_demo_url = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(30), nullable=False, default='guide_pending') 
    # 'draft', 'guide_pending', 'approved', 'in_progress', 'under_review', 'evaluated', 'rejected'
    progress_percent = db.Column(db.Integer, default=0, nullable=False)
    created_by_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    faculty_guide_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    
    final_submission_notes = db.Column(db.Text, nullable=True)
    final_submission_file = db.Column(db.String(255), nullable=True)
    final_submission_date = db.Column(db.DateTime, nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    members = db.relationship('ProjectMember', backref='project', lazy=True, cascade="all, delete-orphan")
    milestones = db.relationship('Milestone', backref='project', lazy=True, cascade="all, delete-orphan", order_by="Milestone.due_date")
    files = db.relationship('ProjectFile', backref='project', lazy=True, cascade="all, delete-orphan", order_by="desc(ProjectFile.created_at)")
    code_snippets = db.relationship('CodeSnippet', backref='project', lazy=True, cascade="all, delete-orphan", order_by="desc(CodeSnippet.created_at)")
    discussions = db.relationship('Discussion', backref='project', lazy=True, cascade="all, delete-orphan", order_by="Discussion.created_at")
    feedbacks = db.relationship('Feedback', backref='project', lazy=True, cascade="all, delete-orphan", order_by="desc(Feedback.created_at)")
    evaluation = db.relationship('Evaluation', backref='project', uselist=False, cascade="all, delete-orphan")

    def update_progress(self):
        """Recalculates progress percentage based on completed milestones."""
        if not self.milestones:
            return
        total_weight = sum(m.weight_percent for m in self.milestones)
        completed_weight = sum(m.weight_percent for m in self.milestones if m.status == 'completed')
        if total_weight > 0:
            self.progress_percent = int((completed_weight / total_weight) * 100)
            if self.progress_percent >= 100 and self.status == 'in_progress':
                self.status = 'under_review'


class ProjectMember(db.Model):
    __tablename__ = 'project_members'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    role_in_team = db.Column(db.String(100), nullable=False, default='Member')  # 'Leader', 'Frontend', 'Backend', 'ML Engineer', 'Documentation'
    status = db.Column(db.String(20), nullable=False, default='joined')  # 'pending', 'joined', 'declined'
    joined_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (db.UniqueConstraint('project_id', 'user_id', name='_project_user_uc'),)


class Milestone(db.Model):
    __tablename__ = 'milestones'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    due_date = db.Column(db.Date, nullable=False)
    weight_percent = db.Column(db.Integer, default=20, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')  # 'pending', 'in_progress', 'completed'
    completed_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)


class ProjectFile(db.Model):
    __tablename__ = 'project_files'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    uploaded_by_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    file_name = db.Column(db.String(255), nullable=False)
    original_name = db.Column(db.String(255), nullable=False)
    file_category = db.Column(db.String(50), nullable=False, default='Documentation') 
    # 'SRS', 'Design', 'Documentation', 'Code', 'Report', 'Presentation', 'Other'
    file_type = db.Column(db.String(50), nullable=False)
    file_size_kb = db.Column(db.Integer, default=0, nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    version = db.Column(db.String(20), default='v1.0', nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    uploader = db.relationship('User', foreign_keys=[uploaded_by_id])


class CodeSnippet(db.Model):
    __tablename__ = 'code_snippets'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    file_name = db.Column(db.String(150), nullable=False)
    language = db.Column(db.String(50), default='python', nullable=False)
    code_content = db.Column(db.Text, nullable=False)
    commit_message = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    author = db.relationship('User', foreign_keys=[author_id])


class Discussion(db.Model):
    __tablename__ = 'discussions'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    sender = db.relationship('User', foreign_keys=[user_id])


class Feedback(db.Model):
    __tablename__ = 'feedbacks'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    faculty_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    milestone_id = db.Column(db.Integer, db.ForeignKey('milestones.id', ondelete='SET NULL'), nullable=True)
    feedback_text = db.Column(db.Text, nullable=False)
    remarks_type = db.Column(db.String(50), default='General', nullable=False) 
    # 'General', 'Correction', 'Milestone Review', 'Code Review', 'Approval'
    rating = db.Column(db.Integer, default=5, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    milestone = db.relationship('Milestone', foreign_keys=[milestone_id])


class Evaluation(db.Model):
    __tablename__ = 'evaluations'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id', ondelete='CASCADE'), unique=True, nullable=False)
    faculty_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    # 5-Criteria Rubric Breakdown (/20 each, Total /100)
    marks_presentation = db.Column(db.Integer, default=0, nullable=False)
    marks_code_quality = db.Column(db.Integer, default=0, nullable=False)
    marks_documentation = db.Column(db.Integer, default=0, nullable=False)
    marks_viva = db.Column(db.Integer, default=0, nullable=False)
    marks_innovation = db.Column(db.Integer, default=0, nullable=False)
    
    total_marks = db.Column(db.Integer, default=0, nullable=False)
    grade = db.Column(db.String(10), default='A', nullable=False)
    final_verdict = db.Column(db.String(50), default='Approved', nullable=False)  # 'Approved', 'Revision Required', 'Rejected'
    remarks = db.Column(db.Text, nullable=True)
    evaluated_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    faculty_evaluator = db.relationship('User', foreign_keys=[faculty_id])

    def calculate_totals(self):
        self.total_marks = (
            self.marks_presentation + 
            self.marks_code_quality + 
            self.marks_documentation + 
            self.marks_viva + 
            self.marks_innovation
        )
        if self.total_marks >= 90:
            self.grade = 'A+'
        elif self.total_marks >= 80:
            self.grade = 'A'
        elif self.total_marks >= 70:
            self.grade = 'B'
        elif self.total_marks >= 60:
            self.grade = 'C'
        elif self.total_marks >= 50:
            self.grade = 'D'
        else:
            self.grade = 'F'


class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    message = db.Column(db.Text, nullable=False)
    link = db.Column(db.String(255), nullable=True)
    type = db.Column(db.String(20), default='info', nullable=False)  # 'info', 'success', 'warning', 'danger'
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)


class SystemLog(db.Model):
    __tablename__ = 'system_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    action = db.Column(db.String(255), nullable=False)
    details = db.Column(db.Text, nullable=True)
    ip_address = db.Column(db.String(50), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    user = db.relationship('User', foreign_keys=[user_id])
