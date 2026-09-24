from datetime import datetime
from flask import Blueprint, render_template, request, redirect, url_for, flash, session, current_app, send_from_directory, abort
from app.models import db, User, Project, ProjectMember, Milestone, ProjectFile, CodeSnippet, Discussion, Feedback, Notification, Evaluation
from app import role_required

faculty_bp = Blueprint('faculty', __name__)

@faculty_bp.before_request
def verify_faculty():
    return role_required('faculty')(lambda: None)()

@faculty_bp.route('/dashboard')
def dashboard():
    faculty_id = session['user_id']
    faculty_user = User.query.get(faculty_id)
    
    # Projects assigned to this faculty guide
    assigned_projects = Project.query.filter_by(faculty_guide_id=faculty_id).all()
    
    # Pending guide requests
    pending_requests = [p for p in assigned_projects if p.status == 'guide_pending']
    # Active guided projects
    active_projects = [p for p in assigned_projects if p.status in ['approved', 'in_progress', 'under_review']]
    # Completed/Evaluated
    evaluated_projects = [p for p in assigned_projects if p.status == 'evaluated']
    
    # Total guided students
    active_project_ids = [p.id for p in assigned_projects]
    total_guided_students = ProjectMember.query.filter(ProjectMember.project_id.in_(active_project_ids)).count() if active_project_ids else 0
    
    # Recent submissions awaiting review
    under_review_projects = [p for p in assigned_projects if p.status == 'under_review']
    
    # Recent files across assigned projects
    recent_files = ProjectFile.query.filter(ProjectFile.project_id.in_(active_project_ids)).order_by(ProjectFile.created_at.desc()).limit(5).all() if active_project_ids else []
    
    return render_template('faculty/dashboard.html',
                           faculty=faculty_user,
                           assigned_projects=assigned_projects,
                           pending_requests=pending_requests,
                           active_projects=active_projects,
                           evaluated_projects=evaluated_projects,
                           total_guided_students=total_guided_students,
                           under_review_projects=under_review_projects,
                           recent_files=recent_files)

@faculty_bp.route('/guide-requests')
def guide_requests():
    faculty_id = session['user_id']
    requests_list = Project.query.filter_by(faculty_guide_id=faculty_id, status='guide_pending').order_by(Project.created_at.desc()).all()
    return render_template('faculty/guide_requests.html', requests=requests_list)

@faculty_bp.route('/guide-requests/<int:project_id>/<string:action>', methods=['POST'])
def handle_guide_request(project_id, action):
    faculty_id = session['user_id']
    project = Project.query.filter_by(id=project_id, faculty_guide_id=faculty_id).first_or_404()
    faculty_user = User.query.get(faculty_id)
    
    if action == 'accept':
        project.status = 'in_progress'
        db.session.commit()
        
        # Notify team members
        for member in project.members:
            notif = Notification(
                user_id=member.user_id,
                title="Faculty Guide Request Accepted!",
                message=f"Prof. {faculty_user.full_name} has accepted to guide your project '{project.title}'.",
                link=url_for('student.workspace', project_id=project.id),
                type="success"
            )
            db.session.add(notif)
            
        flash(f'Accepted guide request for project "{project.title}".', 'success')
    elif action == 'reject':
        project.status = 'rejected'
        reason = request.form.get('reject_reason', 'Guide capacity exceeded or domain mismatch.')
        db.session.commit()
        
        # Notify creator
        notif = Notification(
            user_id=project.created_by_id,
            title="Guide Request Declined",
            message=f"Prof. {faculty_user.full_name} declined the guide request for '{project.title}'. Reason: {reason}",
            link=url_for('student.projects'),
            type="danger"
        )
        db.session.add(notif)
        
        flash(f'Declined guide request for project "{project.title}".', 'warning')
        
    db.session.commit()
    return redirect(url_for('faculty.guide_requests'))

@faculty_bp.route('/assigned-projects')
def assigned_projects():
    faculty_id = session['user_id']
    domain_filter = request.args.get('domain')
    status_filter = request.args.get('status')
    
    query = Project.query.filter_by(faculty_guide_id=faculty_id)
    if domain_filter:
        query = query.filter_by(domain=domain_filter)
    if status_filter:
        query = query.filter_by(status=status_filter)
        
    projects_list = query.order_by(Project.updated_at.desc()).all()
    domains = db.session.query(Project.domain).distinct().all()
    domains = [d[0] for d in domains if d[0]]
    
    return render_template('faculty/assigned_projects.html', 
                           projects=projects_list, 
                           domains=domains,
                           current_domain=domain_filter,
                           current_status=status_filter)

@faculty_bp.route('/workspace/<int:project_id>')
def workspace(project_id):
    faculty_id = session['user_id']
    project = Project.query.filter_by(id=project_id, faculty_guide_id=faculty_id).first_or_404()
    project.update_progress()
    db.session.commit()
    
    evaluation = Evaluation.query.filter_by(project_id=project.id).first()
    
    return render_template('faculty/workspace.html',
                           project=project,
                           evaluation=evaluation)

@faculty_bp.route('/feedback/add', methods=['POST'])
def add_feedback():
    faculty_id = session['user_id']
    faculty_user = User.query.get(faculty_id)
    
    project_id = request.form.get('project_id')
    milestone_id = request.form.get('milestone_id')
    feedback_text = request.form.get('feedback_text', '').strip()
    remarks_type = request.form.get('remarks_type', 'General')
    rating = int(request.form.get('rating', 5))
    
    project = Project.query.filter_by(id=project_id, faculty_guide_id=faculty_id).first_or_404()
    
    milestone_id_int = int(milestone_id) if milestone_id and milestone_id.isdigit() else None
    
    feedback = Feedback(
        project_id=project.id,
        faculty_id=faculty_id,
        milestone_id=milestone_id_int,
        feedback_text=feedback_text,
        remarks_type=remarks_type,
        rating=rating
    )
    db.session.add(feedback)
    
    # Notify team members
    for member in project.members:
        notif = Notification(
            user_id=member.user_id,
            title="New Faculty Remarks & Feedback",
            message=f"Prof. {faculty_user.full_name} posted feedback on '{project.title}': {feedback_text[:80]}...",
            link=url_for('student.workspace', project_id=project.id, _anchor='feedback'),
            type="info"
        )
        db.session.add(notif)
        
    db.session.commit()
    flash('Feedback and remarks submitted successfully to student team!', 'success')
    return redirect(url_for('faculty.workspace', project_id=project.id, _anchor='feedback'))

@faculty_bp.route('/milestone/<int:milestone_id>/signoff', methods=['POST'])
def signoff_milestone(milestone_id):
    faculty_id = session['user_id']
    milestone = Milestone.query.get_or_404(milestone_id)
    project = Project.query.filter_by(id=milestone.project_id, faculty_guide_id=faculty_id).first_or_404()
    
    milestone.status = 'completed'
    milestone.completed_at = datetime.utcnow()
    project.update_progress()
    
    # Notify team
    for member in project.members:
        notif = Notification(
            user_id=member.user_id,
            title="Milestone Approved & Signed Off",
            message=f"Faculty Guide approved milestone '{milestone.title}'. Progress updated to {project.progress_percent}%.",
            link=url_for('student.workspace', project_id=project.id),
            type="success"
        )
        db.session.add(notif)
        
    db.session.commit()
    flash(f'Milestone "{milestone.title}" has been signed off and verified.', 'success')
    return redirect(url_for('faculty.workspace', project_id=project.id, _anchor='milestones'))

@faculty_bp.route('/evaluate/<int:project_id>', methods=['GET', 'POST'])
def evaluate(project_id):
    faculty_id = session['user_id']
    faculty_user = User.query.get(faculty_id)
    project = Project.query.filter_by(id=project_id, faculty_guide_id=faculty_id).first_or_404()
    
    evaluation = Evaluation.query.filter_by(project_id=project.id).first()
    
    if request.method == 'POST':
        marks_pres = int(request.form.get('marks_presentation', 0))
        marks_code = int(request.form.get('marks_code_quality', 0))
        marks_doc = int(request.form.get('marks_documentation', 0))
        marks_viva = int(request.form.get('marks_viva', 0))
        marks_innov = int(request.form.get('marks_innovation', 0))
        verdict = request.form.get('final_verdict', 'Approved')
        remarks = request.form.get('remarks', '').strip()
        
        if not evaluation:
            evaluation = Evaluation(
                project_id=project.id,
                faculty_id=faculty_id
            )
            db.session.add(evaluation)
            
        evaluation.marks_presentation = min(20, max(0, marks_pres))
        evaluation.marks_code_quality = min(20, max(0, marks_code))
        evaluation.marks_documentation = min(20, max(0, marks_doc))
        evaluation.marks_viva = min(20, max(0, marks_viva))
        evaluation.marks_innovation = min(20, max(0, marks_innov))
        evaluation.final_verdict = verdict
        evaluation.remarks = remarks
        evaluation.evaluated_at = datetime.utcnow()
        evaluation.calculate_totals()
        
        # Update Project Status
        if verdict == 'Approved':
            project.status = 'evaluated'
            project.progress_percent = 100
        elif verdict == 'Revision Required':
            project.status = 'in_progress'
        else:
            project.status = 'rejected'
            
        # Notify team
        for member in project.members:
            notif = Notification(
                user_id=member.user_id,
                title="Final Project Evaluation & Grade Published",
                message=f"Prof. {faculty_user.full_name} evaluated '{project.title}': Total Score {evaluation.total_marks}/100 (Grade {evaluation.grade}).",
                link=url_for('student.workspace', project_id=project.id, _anchor='final-submission'),
                type="success" if verdict == 'Approved' else "warning"
            )
            db.session.add(notif)
            
        db.session.commit()
        flash(f'Evaluation published successfully! Total: {evaluation.total_marks}/100 (Grade {evaluation.grade}).', 'success')
        return redirect(url_for('faculty.workspace', project_id=project.id))
        
    return render_template('faculty/evaluate.html', project=project, evaluation=evaluation)
