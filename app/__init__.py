import os
from functools import wraps
from datetime import datetime
from flask import Flask, session, redirect, url_for, flash, g, render_template
from app.config import Config
from app.models import db, User, Notification

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Ensure upload directory exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Initialize database
    db.init_app(app)
    
    with app.app_context():
        db.create_all()
        from sqlalchemy import text
        try:
            with db.engine.connect() as conn:
                try:
                    conn.execute(text("SELECT invite_code FROM projects LIMIT 1"))
                except Exception:
                    conn.execute(text("ALTER TABLE projects ADD COLUMN invite_code VARCHAR(64)"))
                    conn.commit()
                try:
                    conn.execute(text("SELECT branch FROM code_snippets LIMIT 1"))
                except Exception:
                    conn.execute(text("ALTER TABLE code_snippets ADD COLUMN branch VARCHAR(50) DEFAULT 'main'"))
                    conn.commit()
                try:
                    conn.execute(text("SELECT updated_at FROM code_snippets LIMIT 1"))
                except Exception:
                    conn.execute(text("ALTER TABLE code_snippets ADD COLUMN updated_at DATETIME"))
                    conn.commit()
                
                # Ensure all projects have invite codes
                from app.models import Project
                import secrets
                projects = Project.query.all()
                for p in projects:
                    if not p.invite_code:
                        p.invite_code = f"hub_{secrets.token_urlsafe(8)}"
                db.session.commit()
        except Exception as e:
            pass
    
    # Context processor for global template variables
    @app.context_processor
    def inject_globals():
        user = None
        unread_notifications = []
        if 'user_id' in session:
            user = User.query.get(session['user_id'])
            if user:
                unread_notifications = Notification.query.filter_by(user_id=user.id, is_read=False).order_by(Notification.created_at.desc()).limit(5).all()
        return {
            'current_user': user,
            'unread_notifications': unread_notifications,
            'unread_count': len(unread_notifications),
            'app_name': app.config['APP_NAME'],
            'academic_year': app.config['ACADEMIC_YEAR'],
            'now': datetime.utcnow()
        }

    # Custom template filters
    @app.template_filter('timeago')
    def timeago(dt):
        if not dt:
            return ""
        diff = datetime.utcnow() - dt
        if diff.days > 365:
            return f"{diff.days // 365}y ago"
        if diff.days > 30:
            return f"{diff.days // 30}mo ago"
        if diff.days > 0:
            return f"{diff.days}d ago"
        if diff.seconds > 3600:
            return f"{diff.seconds // 3600}h ago"
        if diff.seconds > 60:
            return f"{diff.seconds // 60}m ago"
        return "just now"

    # Register blueprints
    from app.routes.public import public_bp
    from app.routes.auth import auth_bp
    from app.routes.student import student_bp
    from app.routes.faculty import faculty_bp
    from app.routes.admin import admin_bp
    from app.routes.api import api_bp
    
    app.register_blueprint(public_bp)
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(student_bp, url_prefix='/student')
    app.register_blueprint(faculty_bp, url_prefix='/faculty')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # 404 & 500 error handlers
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('public/404.html'), 404

    @app.errorhandler(500)
    def internal_server_error(e):
        return render_template('public/500.html'), 500

    return app


# Authentication Decorators
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('auth.login'))
        return f(*args, **kwargs)
    return decorated_function

def role_required(*allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'user_id' not in session:
                flash('Please log in to continue.', 'warning')
                return redirect(url_for('auth.login'))
            user = User.query.get(session['user_id'])
            if not user or user.role not in allowed_roles:
                flash('Unauthorized access: You do not have permission to view this resource.', 'danger')
                return redirect(url_for('public.index'))
            if user.role == 'student' and not user.is_approved:
                flash('Your student account is pending approval by the administrator.', 'warning')
                return redirect(url_for('auth.pending_approval'))
            return f(*args, **kwargs)
        return decorated_function
    return decorator
