from flask import Blueprint, render_template, request, flash, redirect, url_for
from app.models import User, Project, db

public_bp = Blueprint('public', __name__)

@public_bp.route('/')
def index():
    # Fetch public statistics for the landing page
    total_projects = Project.query.count()
    completed_projects = Project.query.filter_by(status='evaluated').count()
    total_students = User.query.filter_by(role='student', is_approved=True).count()
    total_faculty = User.query.filter_by(role='faculty').count()
    
    # Recent completed showcase projects
    showcase_projects = Project.query.filter(Project.status.in_(['evaluated', 'in_progress'])).order_by(Project.updated_at.desc()).limit(3).all()
    
    return render_template('public/index.html',
                           total_projects=total_projects,
                           completed_projects=completed_projects,
                           total_students=total_students,
                           total_faculty=total_faculty,
                           showcase_projects=showcase_projects)

@public_bp.route('/about')
def about():
    return render_template('public/about.html')

@public_bp.route('/features')
def features():
    return render_template('public/features.html')

@public_bp.route('/how-it-works')
def how_it_works():
    return render_template('public/how_it_works.html')

@public_bp.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        subject = request.form.get('subject')
        message = request.form.get('message')
        
        flash(f'Thank you, {name}! Your message has been received. University support will respond to {email} shortly.', 'success')
        return redirect(url_for('public.contact'))
        
    return render_template('public/contact.html')
