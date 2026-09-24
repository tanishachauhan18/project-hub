from datetime import datetime
from flask import Blueprint, render_template, request, redirect, url_for, flash, session, current_app, jsonify
from app.models import db, User, Project, ProjectMember, Milestone, ProjectFile, Feedback, Notification, Evaluation, SystemLog
from app import role_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.before_request
def verify_admin():
    return role_required('admin')(lambda: None)()

@admin_bp.route('/dashboard')
def dashboard():
    total_students = User.query.filter_by(role='student').count()
    approved_students = User.query.filter_by(role='student', is_approved=True).count()
    pending_students = User.query.filter_by(role='student', is_approved=False).all()
    total_faculty = User.query.filter_by(role='faculty').count()
    
    total_projects = Project.query.count()
    active_projects = Project.query.filter(Project.status.in_(['approved', 'in_progress'])).count()
    completed_projects = Project.query.filter_by(status='evaluated').count()
    under_review_projects = Project.query.filter_by(status='under_review').count()
    total_files = ProjectFile.query.count()
    
    # Recent Projects
    recent_projects = Project.query.order_by(Project.created_at.desc()).limit(5).all()
    # Recent System Logs
    recent_logs = SystemLog.query.order_by(SystemLog.timestamp.desc()).limit(10).all()
    
    # Stats for Charts
    domains = db.session.query(Project.domain, db.func.count(Project.id)).group_by(Project.domain).all()
    domain_labels = [d[0] for d in domains]
    domain_counts = [d[1] for d in domains]
    
    statuses = db.session.query(Project.status, db.func.count(Project.id)).group_by(Project.status).all()
    status_dict = dict(statuses)
    
    return render_template('admin/dashboard.html',
                           total_students=total_students,
                           approved_students=approved_students,
                           pending_students=pending_students,
                           total_faculty=total_faculty,
                           total_projects=total_projects,
                           active_projects=active_projects,
                           completed_projects=completed_projects,
                           under_review_projects=under_review_projects,
                           total_files=total_files,
                           recent_projects=recent_projects,
                           recent_logs=recent_logs,
                           domain_labels=domain_labels,
                           domain_counts=domain_counts,
                           status_dict=status_dict)

@admin_bp.route('/approvals')
def approvals():
    pending_students = User.query.filter_by(role='student', is_approved=False).order_by(User.created_at.desc()).all()
    return render_template('admin/approvals.html', pending_students=pending_students)

@admin_bp.route('/approvals/<int:user_id>/<string:action>', methods=['POST'])
def handle_approval(user_id, action):
    user = User.query.get_or_404(user_id)
    if action == 'approve':
        user.is_approved = True
        notif = Notification(
            user_id=user.id,
            title="Account Registration Approved!",
            message="Your student registration has been verified and activated by the Administrator. You can now create or join project teams.",
            link=url_for('student.dashboard'),
            type="success"
        )
        db.session.add(notif)
        flash(f'Student "{user.full_name}" has been approved and activated.', 'success')
    elif action == 'reject':
        flash(f'Registration for "{user.full_name}" was rejected and removed.', 'warning')
        db.session.delete(user)
        
    db.session.commit()
    return redirect(url_for('admin.approvals'))

@admin_bp.route('/approvals/bulk-approve', methods=['POST'])
def bulk_approve():
    pending_students = User.query.filter_by(role='student', is_approved=False).all()
    count = len(pending_students)
    for student in pending_students:
        student.is_approved = True
        notif = Notification(
            user_id=student.id,
            title="Account Registration Approved!",
            message="Your student registration has been verified and activated by the Administrator.",
            link=url_for('student.dashboard'),
            type="success"
        )
        db.session.add(notif)
    db.session.commit()
    flash(f'Successfully approved all {count} pending student registrations.', 'success')
    return redirect(url_for('admin.approvals'))

@admin_bp.route('/students')
def students():
    search = request.args.get('search', '').strip()
    dept = request.args.get('dept', '')
    
    query = User.query.filter_by(role='student')
    if search:
        query = query.filter((User.full_name.ilike(f"%{search}%")) | (User.email.ilike(f"%{search}%")) | (User.roll_or_faculty_id.ilike(f"%{search}%")))
    if dept:
        query = query.filter_by(department=dept)
        
    student_list = query.order_by(User.created_at.desc()).all()
    departments = [d[0] for d in db.session.query(User.department).distinct().all() if d[0]]
    
    return render_template('admin/students.html', students=student_list, departments=departments, search=search, dept=dept)

@admin_bp.route('/students/<int:user_id>/toggle-status', methods=['POST'])
def toggle_student_status(user_id):
    student = User.query.get_or_404(user_id)
    student.is_approved = not student.is_approved
    db.session.commit()
    flash(f'Status for {student.full_name} changed to {"Active" if student.is_approved else "Disabled"}.', 'info')
    return redirect(url_for('admin.students'))

@admin_bp.route('/faculty')
def faculty():
    search = request.args.get('search', '').strip()
    query = User.query.filter_by(role='faculty')
    if search:
        query = query.filter((User.full_name.ilike(f"%{search}%")) | (User.email.ilike(f"%{search}%")) | (User.roll_or_faculty_id.ilike(f"%{search}%")))
        
    faculty_list = query.order_by(User.full_name.asc()).all()
    return render_template('admin/faculty.html', faculty_list=faculty_list, search=search)

@admin_bp.route('/projects')
def projects():
    search = request.args.get('search', '').strip()
    status = request.args.get('status', '')
    domain = request.args.get('domain', '')
    
    query = Project.query
    if search:
        query = query.filter((Project.title.ilike(f"%{search}%")) | (Project.tech_stack.ilike(f"%{search}%")))
    if status:
        query = query.filter_by(status=status)
    if domain:
        query = query.filter_by(domain=domain)
        
    projects_list = query.order_by(Project.created_at.desc()).all()
    domains = [d[0] for d in db.session.query(Project.domain).distinct().all() if d[0]]
    
    return render_template('admin/projects.html', projects=projects_list, domains=domains, search=search, status=status, domain=domain)

@admin_bp.route('/projects/<int:project_id>/status-override', methods=['POST'])
def override_project_status(project_id):
    project = Project.query.get_or_404(project_id)
    new_status = request.form.get('status')
    if new_status:
        project.status = new_status
        db.session.commit()
        flash(f'Project "{project.title}" status updated to {new_status}.', 'success')
    return redirect(url_for('admin.projects'))

@admin_bp.route('/files')
def files():
    category = request.args.get('category', '')
    query = ProjectFile.query
    if category:
        query = query.filter_by(file_category=category)
    files_list = query.order_by(ProjectFile.created_at.desc()).all()
    
    total_kb = sum(f.file_size_kb for f in files_list)
    return render_template('admin/files.html', files=files_list, total_kb=total_kb, category=category)

@admin_bp.route('/reports')
def reports():
    # Overall summary metrics
    total_projects = Project.query.count()
    completed = Project.query.filter_by(status='evaluated').count()
    in_progress = Project.query.filter(Project.status.in_(['approved', 'in_progress'])).count()
    under_review = Project.query.filter_by(status='under_review').count()
    
    # Evaluations & Grade distribution
    evaluations = Evaluation.query.all()
    grades = {'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0}
    avg_score = 0
    if evaluations:
        for ev in evaluations:
            grades[ev.grade] = grades.get(ev.grade, 0) + 1
        avg_score = round(sum(ev.total_marks for ev in evaluations) / len(evaluations), 1)
        
    # Faculty Workload
    faculty_members = User.query.filter_by(role='faculty').all()
    faculty_loads = []
    for f in faculty_members:
        guided_count = Project.query.filter_by(faculty_guide_id=f.id).count()
        completed_count = Project.query.filter_by(faculty_guide_id=f.id, status='evaluated').count()
        faculty_loads.append({
            'faculty': f,
            'guided_count': guided_count,
            'completed_count': completed_count
        })
        
    # Domain breakdown
    domain_stats = db.session.query(Project.domain, db.func.count(Project.id), db.func.avg(Project.progress_percent)).group_by(Project.domain).all()
    
    return render_template('admin/reports.html',
                           total_projects=total_projects,
                           completed=completed,
                           in_progress=in_progress,
                           under_review=under_review,
                           evaluations=evaluations,
                           grades=grades,
                           avg_score=avg_score,
                           faculty_loads=faculty_loads,
                           domain_stats=domain_stats)

@admin_bp.route('/settings', methods=['GET', 'POST'])
def settings():
    if request.method == 'POST':
        academic_year = request.form.get('academic_year')
        if academic_year:
            current_app.config['ACADEMIC_YEAR'] = academic_year
        flash('System settings updated successfully!', 'success')
        return redirect(url_for('admin.settings'))
        
    return render_template('admin/settings.html')
