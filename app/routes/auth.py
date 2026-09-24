from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from app.models import db, User, Notification, SystemLog
from app import login_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        if user:
            if user.role == 'admin':
                return redirect(url_for('admin.dashboard'))
            elif user.role == 'faculty':
                return redirect(url_for('faculty.dashboard'))
            elif user.role == 'student':
                if not user.is_approved:
                    return redirect(url_for('auth.pending_approval'))
                return redirect(url_for('student.dashboard'))

    if request.method == 'POST':
        # Check if quick demo login was clicked
        demo_role = request.form.get('demo_role')
        if demo_role:
            if demo_role == 'student_leader':
                user = User.query.filter_by(email='aarav.sharma@projecthub.edu').first()
            elif demo_role == 'student_member':
                user = User.query.filter_by(email='priya.patel@projecthub.edu').first()
            elif demo_role == 'faculty':
                user = User.query.filter_by(email='dr.verma@projecthub.edu').first()
            elif demo_role == 'admin':
                user = User.query.filter_by(email='admin@projecthub.edu').first()
            else:
                user = None

            if user:
                session['user_id'] = user.id
                session['user_name'] = user.full_name
                session['user_role'] = user.role
                flash(f'Logged in successfully as {user.full_name} ({user.role.title()})', 'success')
                
                if user.role == 'admin':
                    return redirect(url_for('admin.dashboard'))
                elif user.role == 'faculty':
                    return redirect(url_for('faculty.dashboard'))
                else:
                    return redirect(url_for('student.dashboard'))

        # Standard login form
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '')

        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            if user.role == 'student' and not user.is_approved:
                session['user_id'] = user.id
                session['user_name'] = user.full_name
                session['user_role'] = user.role
                flash('Your registration is awaiting Administrator approval.', 'warning')
                return redirect(url_for('auth.pending_approval'))

            session['user_id'] = user.id
            session['user_name'] = user.full_name
            session['user_role'] = user.role
            
            # Log login
            log = SystemLog(user_id=user.id, action="User Login", details=f"Logged in with role {user.role}", ip_address=request.remote_addr)
            db.session.add(log)
            db.session.commit()

            flash(f'Welcome back, {user.full_name}!', 'success')
            
            if user.role == 'admin':
                return redirect(url_for('admin.dashboard'))
            elif user.role == 'faculty':
                return redirect(url_for('faculty.dashboard'))
            else:
                return redirect(url_for('student.dashboard'))
        else:
            flash('Invalid email or password. Please try again.', 'danger')

    return render_template('auth/login.html')

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        full_name = request.form.get('full_name', '').strip()
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')
        role = request.form.get('role', 'student')
        roll_or_faculty_id = request.form.get('roll_or_faculty_id', '').strip()
        department = request.form.get('department', 'Computer Science & Engineering')
        phone = request.form.get('phone', '').strip()

        if password != confirm_password:
            flash('Passwords do not match. Please re-enter.', 'danger')
            return render_template('auth/register.html', form=request.form)

        if User.query.filter_by(email=email).first():
            flash('An account with this email address already exists. Please log in.', 'warning')
            return render_template('auth/register.html', form=request.form)

        # Faculty and admin auto-approved in development/setup, Students require admin approval
        is_approved = True if role in ['faculty', 'admin'] else False

        new_user = User(
            full_name=full_name,
            email=email,
            role=role,
            roll_or_faculty_id=roll_or_faculty_id,
            department=department,
            phone=phone,
            is_approved=is_approved
        )
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

        # Send notification to admins if student registered
        if role == 'student':
            admins = User.query.filter_by(role='admin').all()
            for admin_user in admins:
                notif = Notification(
                    user_id=admin_user.id,
                    title="New Student Registration Pending",
                    message=f"{full_name} ({roll_or_faculty_id}) registered and needs account approval.",
                    link=url_for('admin.approvals'),
                    type="warning"
                )
                db.session.add(notif)
            db.session.commit()

            flash('Registration submitted successfully! Your account will be activated once approved by the Admin.', 'info')
            session['user_id'] = new_user.id
            session['user_name'] = new_user.full_name
            session['user_role'] = new_user.role
            return redirect(url_for('auth.pending_approval'))
        else:
            flash('Account created successfully! You can now log in.', 'success')
            return redirect(url_for('auth.login'))

    return render_template('auth/register.html')

@auth_bp.route('/pending-approval')
def pending_approval():
    if 'user_id' not in session:
        return redirect(url_for('auth.login'))
    user = User.query.get(session['user_id'])
    if user and user.is_approved:
        return redirect(url_for('student.dashboard'))
    return render_template('auth/pending_approval.html', user=user)

@auth_bp.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        email = request.form.get('email')
        user = User.query.filter_by(email=email).first()
        if user:
            flash(f'A password reset link has been dispatched to {email}. (Simulation: You can reset via your profile once logged in).', 'success')
        else:
            flash('If that email exists in our records, a reset link has been dispatched.', 'info')
        return redirect(url_for('auth.login'))
    return render_template('auth/forgot_password.html')

@auth_bp.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    user = User.query.get(session['user_id'])
    if request.method == 'POST':
        user.full_name = request.form.get('full_name', user.full_name).strip()
        user.phone = request.form.get('phone', user.phone).strip()
        user.bio = request.form.get('bio', user.bio).strip()
        user.skills = request.form.get('skills', user.skills).strip()
        user.department = request.form.get('department', user.department)
        
        new_password = request.form.get('new_password')
        if new_password:
            user.set_password(new_password)
            flash('Profile details and password updated successfully!', 'success')
        else:
            flash('Profile updated successfully!', 'success')
            
        db.session.commit()
        return redirect(url_for('auth.profile'))

    return render_template('auth/profile.html', user=user)

@auth_bp.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out securely.', 'info')
    return redirect(url_for('auth.login'))
