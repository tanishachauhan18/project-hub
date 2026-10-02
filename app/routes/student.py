import os
import io
import zipfile
import secrets
from datetime import datetime
from werkzeug.utils import secure_filename
from flask import Blueprint, render_template, request, redirect, url_for, flash, session, current_app, send_from_directory, abort, send_file, jsonify
from app.models import (
    db, User, Project, ProjectMember, Milestone, ProjectFile, 
    CodeSnippet, Discussion, Feedback, Notification, Evaluation,
    ProjectIssue, IssueComment, ProjectPullRequest, ProjectActivity
)
from app import role_required

student_bp = Blueprint('student', __name__)

@student_bp.before_request
def verify_student():
    # Enforces student role and approved status
    return role_required('student')(lambda: None)()

@student_bp.route('/dashboard')
def dashboard():
    user_id = session['user_id']
    user = User.query.get(user_id)
    
    # Get all projects the student belongs to
    member_projects = ProjectMember.query.filter_by(user_id=user_id).all()
    project_ids = [m.project_id for m in member_projects]
    
    projects = Project.query.filter(Project.id.in_(project_ids)).order_by(Project.updated_at.desc()).all() if project_ids else []
    
    # Primary active project (or most recent)
    active_project = projects[0] if projects else None
    
    # Stats
    total_projects = len(projects)
    in_progress_count = sum(1 for p in projects if p.status in ['in_progress', 'approved'])
    completed_count = sum(1 for p in projects if p.status == 'evaluated')
    
    # Feedbacks across user projects
    feedbacks = Feedback.query.filter(Feedback.project_id.in_(project_ids)).order_by(Feedback.created_at.desc()).limit(5).all() if project_ids else []
    
    # Upcoming milestones
    upcoming_milestones = Milestone.query.filter(Milestone.project_id.in_(project_ids), Milestone.status != 'completed').order_by(Milestone.due_date.asc()).limit(5).all() if project_ids else []
    
    # Recent files
    recent_files = ProjectFile.query.filter(ProjectFile.project_id.in_(project_ids)).order_by(ProjectFile.created_at.desc()).limit(5).all() if project_ids else []
    
    return render_template('student/dashboard.html',
                           user=user,
                           projects=projects,
                           active_project=active_project,
                           total_projects=total_projects,
                           in_progress_count=in_progress_count,
                           completed_count=completed_count,
                           feedbacks=feedbacks,
                           upcoming_milestones=upcoming_milestones,
                           recent_files=recent_files)

@student_bp.route('/projects')
def projects():
    user_id = session['user_id']
    member_projects = ProjectMember.query.filter_by(user_id=user_id).all()
    project_ids = [m.project_id for m in member_projects]
    
    projects = Project.query.filter(Project.id.in_(project_ids)).order_by(Project.created_at.desc()).all() if project_ids else []
    return render_template('student/projects.html', projects=projects)

@student_bp.route('/projects/create', methods=['GET', 'POST'])
def create_project():
    user_id = session['user_id']
    current_student = User.query.get(user_id)
    
    # Available registered students (approved) except current user
    available_students = User.query.filter(User.role == 'student', User.is_approved == True, User.id != user_id).all()
    # Available faculty guides
    faculty_guides = User.query.filter_by(role='faculty').all()
    
    if request.method == 'POST':
        title = request.form.get('title', '').strip()
        abstract = request.form.get('abstract', '').strip()
        domain = request.form.get('domain', 'Web SaaS')
        tech_stack = request.form.get('tech_stack', '').strip()
        github_url = request.form.get('github_url', '').strip()
        live_demo_url = request.form.get('live_demo_url', '').strip()
        faculty_guide_id = request.form.get('faculty_guide_id')
        
        if not title or not abstract or not tech_stack or not faculty_guide_id:
            flash('Please fill in all mandatory project details and select a Faculty Guide.', 'danger')
            return render_template('student/create_project.html', 
                                   available_students=available_students, 
                                   faculty_guides=faculty_guides)
            
        # Create Project Record
        invite_code = f"hub_{secrets.token_urlsafe(8)}"
        new_project = Project(
            title=title,
            abstract=abstract,
            domain=domain,
            tech_stack=tech_stack,
            github_url=github_url,
            live_demo_url=live_demo_url,
            status='guide_pending',
            progress_percent=0,
            created_by_id=user_id,
            faculty_guide_id=int(faculty_guide_id),
            invite_code=invite_code
        )
        db.session.add(new_project)
        db.session.flush()  # to get new_project.id
        
        # Add creator as Team Leader (Member 1)
        leader_member = ProjectMember(
            project_id=new_project.id,
            user_id=user_id,
            role_in_team='Team Leader & Full Stack',
            status='joined'
        )
        db.session.add(leader_member)

        # Log project creation activity
        activity = ProjectActivity(
            project_id=new_project.id,
            user_id=user_id,
            activity_type='member_joined',
            title=f"{current_student.full_name} created project and initiated workspace"
        )
        db.session.add(activity)
        
        # Add selected team members if chosen directly
        member_ids = request.form.getlist('team_members')
        member_roles = request.form.getlist('member_roles')
        
        for idx, member_id in enumerate(member_ids):
            if member_id and int(member_id) != user_id:
                role_title = member_roles[idx] if idx < len(member_roles) and member_roles[idx].strip() else 'Developer & Research'
                team_member = ProjectMember(
                    project_id=new_project.id,
                    user_id=int(member_id),
                    role_in_team=role_title,
                    status='joined'
                )
                db.session.add(team_member)
                
                # Notify added student
                notif = Notification(
                    user_id=int(member_id),
                    title="Added to New Project Team",
                    message=f"You have been added to the project '{title}' by {current_student.full_name}.",
                    link=url_for('student.workspace', project_id=new_project.id),
                    type="info"
                )
                db.session.add(notif)
                
        # Auto-create 4 standard academic milestones
        default_milestones = [
            ("Phase 1: Requirement Analysis & SRS Submission", "Define project scope, architecture diagram, and SRS document.", 15),
            ("Phase 2: UI/UX Wireframing & Database Schema Design", "Design mockups, database tables, and establish backend routes.", 20),
            ("Phase 3: Core Module Implementation & API Integration", "Build primary functional features, backend logic, and user interfaces.", 40),
            ("Phase 4: Comprehensive Testing, Deployment & Final Viva Report", "Integration testing, performance tuning, and final documentation.", 25)
        ]
        
        for m_title, m_desc, m_weight in default_milestones:
            m = Milestone(
                project_id=new_project.id,
                title=m_title,
                description=m_desc,
                due_date=datetime.utcnow().date(),
                weight_percent=m_weight,
                status='pending'
            )
            db.session.add(m)

        # Create initial README.md code file
        readme_content = f"""# {title}

> {abstract}

## 🚀 Tech Stack
`{tech_stack}`

## 👥 Team
- **Project Lead:** {current_student.full_name} ({current_student.department})

## 📌 Getting Started
1. Clone or open files from this repository.
2. Collaborate on branches and submit Pull Requests.
3. Track deliverables in the Milestones & Issues tab.
"""
        init_readme = CodeSnippet(
            project_id=new_project.id,
            author_id=user_id,
            file_name="README.md",
            language="markdown",
            code_content=readme_content,
            commit_message="Initial repository commit with project documentation",
            branch="main"
        )
        db.session.add(init_readme)
            
        # Notify Selected Faculty Guide
        guide = User.query.get(int(faculty_guide_id))
        if guide:
            notif = Notification(
                user_id=guide.id,
                title="New Project Guide Request",
                message=f"Team '{title}' led by {current_student.full_name} has requested you as their Faculty Guide.",
                link=url_for('faculty.guide_requests'),
                type="warning"
            )
            db.session.add(notif)
            
        db.session.commit()
        flash(f'Project "{title}" created successfully! Guide request dispatched to {guide.full_name if guide else "faculty"}.', 'success')
        return redirect(url_for('student.workspace', project_id=new_project.id))
        
    return render_template('student/create_project.html',
                           available_students=available_students,
                           faculty_guides=faculty_guides)

# ==========================================================
# SHAREABLE INVITE & JOIN LINK
# ==========================================================
@student_bp.route('/join/<invite_code>')
def join_project(invite_code):
    user_id = session['user_id']
    current_student = User.query.get(user_id)
    
    project = Project.query.filter_by(invite_code=invite_code).first()
    if not project:
        # Fallback check if it was project ID
        if invite_code.isdigit():
            project = Project.query.get(int(invite_code))
            
    if not project:
        flash('Invalid or expired project collaboration link.', 'danger')
        return redirect(url_for('student.dashboard'))
        
    # Check if user is already a member
    is_member = ProjectMember.query.filter_by(project_id=project.id, user_id=user_id).first()
    if is_member:
        flash(f'You are already a collaborating member of "{project.title}". Welcome back!', 'info')
        return redirect(url_for('student.workspace', project_id=project.id))
        
    return render_template('student/join_project.html',
                           project=project,
                           current_student=current_student)

@student_bp.route('/join/<invite_code>/confirm', methods=['POST'])
def join_project_confirm(invite_code):
    user_id = session['user_id']
    current_student = User.query.get(user_id)
    
    project = Project.query.filter_by(invite_code=invite_code).first()
    if not project and invite_code.isdigit():
        project = Project.query.get(int(invite_code))
        
    if not project:
        flash('Project not found or link has expired.', 'danger')
        return redirect(url_for('student.dashboard'))
        
    # Check if already joined
    existing = ProjectMember.query.filter_by(project_id=project.id, user_id=user_id).first()
    if existing:
        flash('You are already part of this team.', 'info')
        return redirect(url_for('student.workspace', project_id=project.id))
        
    role_in_team = request.form.get('role_in_team', 'Developer & Research').strip()
    if not role_in_team:
        role_in_team = 'Developer & Research'
        
    # Create membership
    member = ProjectMember(
        project_id=project.id,
        user_id=user_id,
        role_in_team=role_in_team,
        status='joined'
    )
    db.session.add(member)
    
    # Log activity
    activity = ProjectActivity(
        project_id=project.id,
        user_id=user_id,
        activity_type='member_joined',
        title=f"{current_student.full_name} joined the team as {role_in_team}",
        details=f"Joined via shareable invitation link"
    )
    db.session.add(activity)
    
    # Notify team leader
    notif = Notification(
        user_id=project.created_by_id,
        title="New Teammate Joined via Link",
        message=f"{current_student.full_name} joined '{project.title}' as {role_in_team}.",
        link=url_for('student.workspace', project_id=project.id),
        type="success"
    )
    db.session.add(notif)
    
    db.session.commit()
    flash(f'🎉 Welcome to the team! You have successfully joined "{project.title}" as {role_in_team}.', 'success')
    return redirect(url_for('student.workspace', project_id=project.id))

@student_bp.route('/workspace/<int:project_id>/invite/regenerate', methods=['POST'])
def regenerate_invite_code(project_id):
    user_id = session['user_id']
    project = Project.query.get_or_404(project_id)
    membership = ProjectMember.query.filter_by(project_id=project_id, user_id=user_id).first()
    if not membership:
        abort(403)
        
    project.invite_code = f"hub_{secrets.token_urlsafe(8)}"
    db.session.commit()
    flash('New invite link generated! Old links will no longer grant access.', 'success')
    return redirect(url_for('student.workspace', project_id=project_id, _anchor='team'))

# ==========================================================
# WORKSPACE & CODE STUDIO
# ==========================================================
@student_bp.route('/workspace/<int:project_id>')
def workspace(project_id):
    user_id = session['user_id']
    # Check if student is member of this project
    membership = ProjectMember.query.filter_by(project_id=project_id, user_id=user_id).first()
    if not membership:
        flash('You are not authorized to access this project workspace.', 'danger')
        return redirect(url_for('student.projects'))
        
    project = Project.query.get_or_404(project_id)
    project.ensure_invite_code()
    project.update_progress()
    db.session.commit()
    
    evaluation = Evaluation.query.filter_by(project_id=project.id).first()
    
    # Generate full invite link
    invite_url = request.host_url.rstrip('/') + url_for('public.join_invite_redirect', invite_code=project.invite_code)
    
    # Sort snippets so README.md is prominent if available
    snippets = sorted(project.code_snippets, key=lambda s: (0 if s.file_name.lower() == 'readme.md' else 1, s.created_at), reverse=False)
    
    return render_template('student/workspace.html',
                           project=project,
                           membership=membership,
                           evaluation=evaluation,
                           invite_url=invite_url,
                           snippets=snippets)

# ==========================================================
# GITHUB CODE STUDIO: SAVE, COMMIT, DELETE, DOWNLOAD ZIP
# ==========================================================
@student_bp.route('/workspace/<int:project_id>/code/save', methods=['POST'])
def save_code_file(project_id):
    user_id = session['user_id']
    membership = ProjectMember.query.filter_by(project_id=project_id, user_id=user_id).first()
    if not membership:
        abort(403)
        
    user = User.query.get(user_id)
    file_name = request.form.get('file_name', '').strip()
    language = request.form.get('language', 'python')
    code_content = request.form.get('code_content', '')
    commit_message = request.form.get('commit_message', 'Update code').strip()
    branch = request.form.get('branch', 'main').strip() or 'main'
    
    if not file_name:
        flash('Please enter a valid file name (e.g. app.py, main.js).', 'danger')
        return redirect(url_for('student.workspace', project_id=project_id, _anchor='code'))
        
    if not commit_message:
        commit_message = f"Update {file_name}"
        
    # Check if a snippet with the same file_name exists
    existing_snippet = CodeSnippet.query.filter_by(project_id=project_id, file_name=file_name, branch=branch).first()
    if existing_snippet:
        existing_snippet.code_content = code_content
        existing_snippet.language = language
        existing_snippet.commit_message = commit_message
        existing_snippet.author_id = user_id
        existing_snippet.updated_at = datetime.utcnow()
    else:
        new_snippet = CodeSnippet(
            project_id=project_id,
            author_id=user_id,
            file_name=file_name,
            language=language,
            code_content=code_content,
            commit_message=commit_message,
            branch=branch
        )
        db.session.add(new_snippet)
        
    # Record commit activity
    activity = ProjectActivity(
        project_id=project_id,
        user_id=user_id,
        activity_type='commit',
        title=f"{user.full_name} committed '{file_name}' to {branch}",
        details=commit_message
    )
    db.session.add(activity)
    
    project = Project.query.get(project_id)
    project.updated_at = datetime.utcnow()
    
    db.session.commit()
    flash(f'File "{file_name}" committed successfully to branch "{branch}"!', 'success')
    return redirect(url_for('student.workspace', project_id=project_id, _anchor='code'))

@student_bp.route('/workspace/<int:project_id>/code/delete/<int:snippet_id>', methods=['POST'])
def delete_code_file(project_id, snippet_id):
    user_id = session['user_id']
    membership = ProjectMember.query.filter_by(project_id=project_id, user_id=user_id).first()
    if not membership:
        abort(403)
        
    user = User.query.get(user_id)
    snippet = CodeSnippet.query.filter_by(id=snippet_id, project_id=project_id).first_or_404()
    file_name = snippet.file_name
    
    db.session.delete(snippet)
    
    activity = ProjectActivity(
        project_id=project_id,
        user_id=user_id,
        activity_type='commit',
        title=f"{user.full_name} removed file '{file_name}' from repository"
    )
    db.session.add(activity)
    db.session.commit()
    
    flash(f'File "{file_name}" deleted from repository.', 'info')
    return redirect(url_for('student.workspace', project_id=project_id, _anchor='code'))

@student_bp.route('/workspace/<int:project_id>/code/download-zip')
def download_code_zip(project_id):
    user_id = session['user_id']
    membership = ProjectMember.query.filter_by(project_id=project_id, user_id=user_id).first()
    if not membership:
        abort(403)
        
    project = Project.query.get_or_404(project_id)
    
    # Create in-memory zip file
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        for snippet in project.code_snippets:
            zip_file.writestr(snippet.file_name, snippet.code_content)
            
        # Add project info file if no README
        if not any(s.file_name.lower() == 'readme.md' for s in project.code_snippets):
            info_text = f"Project: {project.title}\nDomain: {project.domain}\nTech Stack: {project.tech_stack}\n\nAbstract:\n{project.abstract}\n"
            zip_file.writestr("PROJECT_INFO.txt", info_text)
            
    zip_buffer.seek(0)
    clean_title = "".join(c for c in project.title if c.isalnum() or c in (' ', '_', '-')).rstrip()
    zip_name = f"{clean_title.replace(' ', '_').lower()[:30]}_codebase.zip"
    
    return send_file(
        zip_buffer,
        mimetype='application/zip',
        as_attachment=True,
        download_name=zip_name
    )

# ==========================================================
# GITHUB ISSUES & BUG TRACKER
# ==========================================================
@student_bp.route('/workspace/<int:project_id>/issues/create', methods=['POST'])
def create_issue(project_id):
    user_id = session['user_id']
    membership = ProjectMember.query.filter_by(project_id=project_id, user_id=user_id).first()
    if not membership:
        abort(403)
        
    user = User.query.get(user_id)
    title = request.form.get('title', '').strip()
    description = request.form.get('description', '').strip()
    label = request.form.get('label', 'enhancement')
    priority = request.form.get('priority', 'medium')
    assigned_to_id = request.form.get('assigned_to_id')
    
    if not title:
        flash('Issue title cannot be empty.', 'danger')
        return redirect(url_for('student.workspace', project_id=project_id, _anchor='issues'))
        
    assigned_user_id = int(assigned_to_id) if assigned_to_id and assigned_to_id.isdigit() else None
    
    issue = ProjectIssue(
        project_id=project_id,
        created_by_id=user_id,
        assigned_to_id=assigned_user_id,
        title=title,
        description=description,
        label=label,
        priority=priority,
        status='open'
    )
    db.session.add(issue)
    db.session.flush()
    
    # Log activity
    activity = ProjectActivity(
        project_id=project_id,
        user_id=user_id,
        activity_type='issue_created',
        title=f"{user.full_name} opened Issue #{issue.id}: {title}",
        details=description
    )
    db.session.add(activity)
    
    # Notify assignee if selected
    if assigned_user_id and assigned_user_id != user_id:
        notif = Notification(
            user_id=assigned_user_id,
            title=f"Assigned to Issue #{issue.id}",
            message=f"{user.full_name} assigned you to issue: '{title}' in project workspace.",
            link=url_for('student.workspace', project_id=project_id),
            type="info"
        )
        db.session.add(notif)
        
    db.session.commit()
    flash(f'Issue #{issue.id} created successfully!', 'success')
    return redirect(url_for('student.workspace', project_id=project_id, _anchor='issues'))

@student_bp.route('/workspace/<int:project_id>/issues/<int:issue_id>/toggle', methods=['POST'])
def toggle_issue(project_id, issue_id):
    user_id = session['user_id']
    membership = ProjectMember.query.filter_by(project_id=project_id, user_id=user_id).first()
    if not membership:
        abort(403)
        
    user = User.query.get(user_id)
    issue = ProjectIssue.query.filter_by(id=issue_id, project_id=project_id).first_or_404()
    
    if issue.status == 'open':
        issue.status = 'closed'
        issue.closed_at = datetime.utcnow()
        action_msg = "closed"
        act_type = "issue_closed"
    else:
        issue.status = 'open'
        issue.closed_at = None
        action_msg = "reopened"
        act_type = "issue_created"
        
    activity = ProjectActivity(
        project_id=project_id,
        user_id=user_id,
        activity_type=act_type,
        title=f"{user.full_name} {action_msg} Issue #{issue.id}: {issue.title}"
    )
    db.session.add(activity)
    db.session.commit()
    
    flash(f'Issue #{issue.id} marked as {issue.status.upper()}.', 'info')
    return redirect(url_for('student.workspace', project_id=project_id, _anchor='issues'))

@student_bp.route('/workspace/<int:project_id>/issues/<int:issue_id>/comment', methods=['POST'])
def add_issue_comment(project_id, issue_id):
    user_id = session['user_id']
    membership = ProjectMember.query.filter_by(project_id=project_id, user_id=user_id).first()
    if not membership:
        abort(403)
        
    comment_text = request.form.get('comment', '').strip()
    if comment_text:
        comment = IssueComment(
            issue_id=issue_id,
            user_id=user_id,
            comment=comment_text
        )
        db.session.add(comment)
        db.session.commit()
        flash('Comment posted to issue.', 'success')
        
    return redirect(url_for('student.workspace', project_id=project_id, _anchor='issues'))

# ==========================================================
# GITHUB PULL REQUESTS & CODE REVIEWS
# ==========================================================
@student_bp.route('/workspace/<int:project_id>/pr/create', methods=['POST'])
def create_pull_request(project_id):
    user_id = session['user_id']
    membership = ProjectMember.query.filter_by(project_id=project_id, user_id=user_id).first()
    if not membership:
        abort(403)
        
    user = User.query.get(user_id)
    title = request.form.get('title', '').strip()
    description = request.form.get('description', '').strip()
    source_branch = request.form.get('source_branch', 'feature/update').strip()
    target_branch = request.form.get('target_branch', 'main').strip()
    
    if not title:
        flash('Pull Request title cannot be empty.', 'danger')
        return redirect(url_for('student.workspace', project_id=project_id, _anchor='pull-requests'))
        
    pr = ProjectPullRequest(
        project_id=project_id,
        author_id=user_id,
        title=title,
        description=description,
        source_branch=source_branch,
        target_branch=target_branch,
        status='open'
    )
    db.session.add(pr)
    db.session.flush()
    
    activity = ProjectActivity(
        project_id=project_id,
        user_id=user_id,
        activity_type='pr_opened',
        title=f"{user.full_name} opened Pull Request #{pr.id}: {title} ({source_branch} → {target_branch})"
    )
    db.session.add(activity)
    
    project = Project.query.get(project_id)
    if project.created_by_id != user_id:
        notif = Notification(
            user_id=project.created_by_id,
            title=f"New Pull Request #{pr.id} Ready for Review",
            message=f"{user.full_name} opened PR '{title}'. Review diff and merge when ready.",
            link=url_for('student.workspace', project_id=project_id),
            type="info"
        )
        db.session.add(notif)
        
    db.session.commit()
    flash(f'Pull Request #{pr.id} submitted for review!', 'success')
    return redirect(url_for('student.workspace', project_id=project_id, _anchor='pull-requests'))

@student_bp.route('/workspace/<int:project_id>/pr/<int:pr_id>/merge', methods=['POST'])
def merge_pull_request(project_id, pr_id):
    user_id = session['user_id']
    membership = ProjectMember.query.filter_by(project_id=project_id, user_id=user_id).first()
    if not membership:
        abort(403)
        
    user = User.query.get(user_id)
    pr = ProjectPullRequest.query.filter_by(id=pr_id, project_id=project_id).first_or_404()
    
    pr.status = 'merged'
    pr.merged_by_id = user_id
    pr.merged_at = datetime.utcnow()
    
    activity = ProjectActivity(
        project_id=project_id,
        user_id=user_id,
        activity_type='pr_merged',
        title=f"{user.full_name} merged Pull Request #{pr.id}: {pr.title} into {pr.target_branch}"
    )
    db.session.add(activity)
    
    # Notify PR Author
    if pr.author_id != user_id:
        notif = Notification(
            user_id=pr.author_id,
            title=f"Pull Request #{pr.id} Merged!",
            message=f"{user.full_name} merged your PR '{pr.title}' into branch '{pr.target_branch}'.",
            link=url_for('student.workspace', project_id=project_id),
            type="success"
        )
        db.session.add(notif)
        
    db.session.commit()
    flash(f'Pull Request #{pr.id} merged into {pr.target_branch}!', 'success')
    return redirect(url_for('student.workspace', project_id=project_id, _anchor='pull-requests'))

@student_bp.route('/workspace/<int:project_id>/pr/<int:pr_id>/close', methods=['POST'])
def close_pull_request(project_id, pr_id):
    user_id = session['user_id']
    membership = ProjectMember.query.filter_by(project_id=project_id, user_id=user_id).first()
    if not membership:
        abort(403)
        
    pr = ProjectPullRequest.query.filter_by(id=pr_id, project_id=project_id).first_or_404()
    pr.status = 'closed'
    db.session.commit()
    flash(f'Pull Request #{pr.id} closed without merging.', 'info')
    return redirect(url_for('student.workspace', project_id=project_id, _anchor='pull-requests'))

# ==========================================================
# TEAM MANAGEMENT (ROLE CHANGES & REMOVALS)
# ==========================================================
@student_bp.route('/workspace/<int:project_id>/team/change-role/<int:member_id>', methods=['POST'])
def change_team_role(project_id, member_id):
    user_id = session['user_id']
    project = Project.query.get_or_404(project_id)
    membership = ProjectMember.query.filter_by(project_id=project_id, user_id=user_id).first()
    if not membership:
        abort(403)
        
    member = ProjectMember.query.filter_by(id=member_id, project_id=project_id).first_or_404()
    
    # Only leader or member themselves can change role
    if project.created_by_id != user_id and member.user_id != user_id:
        flash('Only Team Leader or the member themselves can update roles.', 'danger')
        return redirect(url_for('student.workspace', project_id=project_id, _anchor='team'))
        
    new_role = request.form.get('role_in_team', '').strip()
    if new_role:
        member.role_in_team = new_role
        db.session.commit()
        flash(f"Updated {member.user.full_name}'s role to '{new_role}'.", 'success')
        
    return redirect(url_for('student.workspace', project_id=project_id, _anchor='team'))

@student_bp.route('/workspace/<int:project_id>/team/remove/<int:member_id>', methods=['POST'])
def remove_team_member(project_id, member_id):
    user_id = session['user_id']
    project = Project.query.get_or_404(project_id)
    membership = ProjectMember.query.filter_by(project_id=project_id, user_id=user_id).first()
    if not membership:
        abort(403)
        
    member = ProjectMember.query.filter_by(id=member_id, project_id=project_id).first_or_404()
    
    # Prevent removing team leader
    if member.user_id == project.created_by_id:
        flash('The Project Leader cannot be removed.', 'danger')
        return redirect(url_for('student.workspace', project_id=project_id, _anchor='team'))
        
    # Only creator or member leaving
    if project.created_by_id != user_id and member.user_id != user_id:
        flash('Unauthorized to remove this member.', 'danger')
        return redirect(url_for('student.workspace', project_id=project_id, _anchor='team'))
        
    name = member.user.full_name
    db.session.delete(member)
    
    activity = ProjectActivity(
        project_id=project_id,
        user_id=user_id,
        activity_type='member_joined',
        title=f"{name} left the project team"
    )
    db.session.add(activity)
    db.session.commit()
    
    flash(f'{name} has been removed from the project.', 'info')
    return redirect(url_for('student.workspace', project_id=project_id, _anchor='team'))

# ==========================================================
# MILESTONES & FILES & DISCUSSIONS
# ==========================================================
@student_bp.route('/workspace/<int:project_id>/milestone/add', methods=['POST'])
def add_milestone(project_id):
    user_id = session['user_id']
    membership = ProjectMember.query.filter_by(project_id=project_id, user_id=user_id).first()
    if not membership:
        abort(403)
        
    title = request.form.get('title', '').strip()
    description = request.form.get('description', '').strip()
    due_date_str = request.form.get('due_date')
    weight_percent = int(request.form.get('weight_percent', 20))
    
    try:
        due_date = datetime.strptime(due_date_str, '%Y-%m-%d').date() if due_date_str else datetime.utcnow().date()
    except ValueError:
        due_date = datetime.utcnow().date()
        
    milestone = Milestone(
        project_id=project_id,
        title=title,
        description=description,
        due_date=due_date,
        weight_percent=weight_percent,
        status='pending'
    )
    db.session.add(milestone)
    db.session.commit()
    
    project = Project.query.get(project_id)
    project.update_progress()
    db.session.commit()
    
    flash('New milestone added successfully!', 'success')
    return redirect(url_for('student.workspace', project_id=project_id, _anchor='milestones'))

@student_bp.route('/workspace/<int:project_id>/milestone/<int:milestone_id>/toggle', methods=['POST'])
def toggle_milestone(project_id, milestone_id):
    user_id = session['user_id']
    membership = ProjectMember.query.filter_by(project_id=project_id, user_id=user_id).first()
    if not membership:
        abort(403)
        
    milestone = Milestone.query.filter_by(id=milestone_id, project_id=project_id).first_or_404()
    if milestone.status == 'completed':
        milestone.status = 'in_progress'
        milestone.completed_at = None
    elif milestone.status == 'in_progress':
        milestone.status = 'completed'
        milestone.completed_at = datetime.utcnow()
    else:
        milestone.status = 'in_progress'
        
    project = Project.query.get(project_id)
    project.update_progress()
    db.session.commit()
    
    flash(f'Milestone "{milestone.title}" updated to {milestone.status.replace("_", " ").title()}.', 'info')
    return redirect(url_for('student.workspace', project_id=project_id, _anchor='milestones'))

@student_bp.route('/workspace/<int:project_id>/file/upload', methods=['POST'])
def upload_file(project_id):
    user_id = session['user_id']
    membership = ProjectMember.query.filter_by(project_id=project_id, user_id=user_id).first()
    if not membership:
        abort(403)
        
    file = request.files.get('file')
    file_category = request.form.get('file_category', 'Documentation')
    version = request.form.get('version', 'v1.0')
    description = request.form.get('description', '')
    
    if not file or file.filename == '':
        flash('No file selected.', 'warning')
        return redirect(url_for('student.workspace', project_id=project_id, _anchor='files'))
        
    orig_filename = secure_filename(file.filename)
    ext = orig_filename.rsplit('.', 1)[1].lower() if '.' in orig_filename else ''
    
    # Save file
    timestamp = datetime.utcnow().strftime('%Y%m%d%H%M%S')
    saved_filename = f"proj_{project_id}_{timestamp}_{orig_filename}"
    upload_path = os.path.join(current_app.config['UPLOAD_FOLDER'], saved_filename)
    file.save(upload_path)
    
    file_size_kb = int(os.path.getsize(upload_path) / 1024)
    
    project_file = ProjectFile(
        project_id=project_id,
        uploaded_by_id=user_id,
        file_name=saved_filename,
        original_name=orig_filename,
        file_category=file_category,
        file_type=ext.upper() or 'FILE',
        file_size_kb=file_size_kb,
        file_path=saved_filename,
        version=version,
        description=description
    )
    db.session.add(project_file)
    
    # Log Activity
    user = User.query.get(user_id)
    activity = ProjectActivity(
        project_id=project_id,
        user_id=user_id,
        activity_type='file_upload',
        title=f"{user.full_name} uploaded deliverable '{orig_filename}' ({file_category})",
        details=description
    )
    db.session.add(activity)
    
    # Notify faculty guide
    project = Project.query.get(project_id)
    if project.faculty_guide_id:
        notif = Notification(
            user_id=project.faculty_guide_id,
            title="New Project File Uploaded",
            message=f"Team '{project.title}' uploaded {orig_filename} ({file_category}).",
            link=url_for('faculty.workspace', project_id=project.id),
            type="info"
        )
        db.session.add(notif)
        
    db.session.commit()
    flash(f'File "{orig_filename}" uploaded successfully.', 'success')
    return redirect(url_for('student.workspace', project_id=project_id, _anchor='files'))

@student_bp.route('/workspace/<int:project_id>/code/add', methods=['POST'])
def add_code_snippet(project_id):
    # Backward compatible route pointing to code saving
    return save_code_file(project_id)

@student_bp.route('/workspace/<int:project_id>/discussion/post', methods=['POST'])
def post_discussion(project_id):
    user_id = session['user_id']
    membership = ProjectMember.query.filter_by(project_id=project_id, user_id=user_id).first()
    if not membership:
        abort(403)
        
    message = request.form.get('message', '').strip()
    if message:
        disc = Discussion(
            project_id=project_id,
            user_id=user_id,
            message=message
        )
        db.session.add(disc)
        db.session.commit()
        
    return redirect(url_for('student.workspace', project_id=project_id, _anchor='discussion'))

@student_bp.route('/workspace/<int:project_id>/submit-final', methods=['POST'])
def submit_final(project_id):
    user_id = session['user_id']
    project = Project.query.get_or_404(project_id)
    if project.created_by_id != user_id:
        flash('Only the Team Leader can submit the final project.', 'danger')
        return redirect(url_for('student.workspace', project_id=project_id, _anchor='final-submission'))
        
    notes = request.form.get('submission_notes', '')
    github_final = request.form.get('github_final', '')
    demo_final = request.form.get('demo_final', '')
    
    file = request.files.get('final_file')
    saved_filename = project.final_submission_file
    
    if file and file.filename != '':
        orig_filename = secure_filename(file.filename)
        timestamp = datetime.utcnow().strftime('%Y%m%d%H%M%S')
        saved_filename = f"final_{project_id}_{timestamp}_{orig_filename}"
        upload_path = os.path.join(current_app.config['UPLOAD_FOLDER'], saved_filename)
        file.save(upload_path)
        
    project.final_submission_notes = notes
    project.final_submission_file = saved_filename
    project.final_submission_date = datetime.utcnow()
    project.status = 'under_review'
    if github_final:
        project.github_url = github_final
    if demo_final:
        project.live_demo_url = demo_final
        
    # Notify faculty guide
    if project.faculty_guide_id:
        notif = Notification(
            user_id=project.faculty_guide_id,
            title="Final Project Submitted for Evaluation",
            message=f"Team '{project.title}' has submitted their final project. Ready for grading and remarks.",
            link=url_for('faculty.evaluate', project_id=project.id),
            type="success"
        )
        db.session.add(notif)
        
    db.session.commit()
    flash('Final Project successfully submitted for Faculty Evaluation and Grading!', 'success')
    return redirect(url_for('student.workspace', project_id=project_id, _anchor='final-submission'))

@student_bp.route('/file/download/<int:file_id>')
def download_file(file_id):
    project_file = ProjectFile.query.get_or_404(file_id)
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], project_file.file_path, as_attachment=True, download_name=project_file.original_name)

