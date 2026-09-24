import os
from datetime import datetime
from werkzeug.utils import secure_filename
from flask import Blueprint, render_template, request, redirect, url_for, flash, session, current_app, send_from_directory, abort
from app.models import db, User, Project, ProjectMember, Milestone, ProjectFile, CodeSnippet, Discussion, Feedback, Notification, Evaluation
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
            faculty_guide_id=int(faculty_guide_id)
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
        
        # Add selected team members (1 to 3 additional members to make 2 to 4 total)
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

@student_bp.route('/workspace/<int:project_id>')
def workspace(project_id):
    user_id = session['user_id']
    # Check if student is member of this project
    membership = ProjectMember.query.filter_by(project_id=project_id, user_id=user_id).first()
    if not membership:
        flash('You are not authorized to access this project workspace.', 'danger')
        return redirect(url_for('student.projects'))
        
    project = Project.query.get_or_404(project_id)
    project.update_progress()
    db.session.commit()
    
    evaluation = Evaluation.query.filter_by(project_id=project.id).first()
    
    return render_template('student/workspace.html',
                           project=project,
                           membership=membership,
                           evaluation=evaluation)

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
    user_id = session['user_id']
    membership = ProjectMember.query.filter_by(project_id=project_id, user_id=user_id).first()
    if not membership:
        abort(403)
        
    file_name = request.form.get('file_name', 'main.py').strip()
    language = request.form.get('language', 'python')
    code_content = request.form.get('code_content', '').strip()
    commit_message = request.form.get('commit_message', 'Update code').strip()
    
    if not code_content:
        flash('Code content cannot be empty.', 'warning')
        return redirect(url_for('student.workspace', project_id=project_id, _anchor='code'))
        
    snippet = CodeSnippet(
        project_id=project_id,
        author_id=user_id,
        file_name=file_name,
        language=language,
        code_content=code_content,
        commit_message=commit_message
    )
    db.session.add(snippet)
    db.session.commit()
    flash('Code snippet / commit saved to project repository!', 'success')
    return redirect(url_for('student.workspace', project_id=project_id, _anchor='code'))

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
