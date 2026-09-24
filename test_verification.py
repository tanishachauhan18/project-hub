import sys
import requests

# Set stdout encoding
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_URL = "http://127.0.0.1:5000"

def test_endpoints():
    session = requests.Session()
    print("Testing ProjectHub endpoints...")

    # 1. Test Public Home
    res = session.get(f"{BASE_URL}/")
    assert res.status_code == 200, f"Landing page failed: {res.status_code}"
    assert "ProjectHub" in res.text
    print("[PASS] 1. Public Landing Page (/) (200 OK)")

    # 2. Test Public Info pages
    for page in ['/about', '/features', '/how-it-works', '/contact']:
        res = session.get(f"{BASE_URL}{page}")
        assert res.status_code == 200, f"Page {page} failed: {res.status_code}"
        print(f"[PASS] 2. Public Page ({page}) (200 OK)")

    # 3. Test Student Login (Demo)
    login_res = session.post(f"{BASE_URL}/auth/login", data={'demo_role': 'student_leader'}, allow_redirects=True)
    assert login_res.status_code == 200, f"Student login failed: {login_res.status_code}"
    assert "Student Dashboard" in login_res.text or "Aarav Sharma" in login_res.text
    print("[PASS] 3. Student Leader Demo Login & Dashboard (200 OK)")

    # 4. Test Student Workspace
    ws_res = session.get(f"{BASE_URL}/student/workspace/1")
    assert ws_res.status_code == 200, f"Workspace failed: {ws_res.status_code}"
    assert "DevSphere" in ws_res.text
    assert "Milestones" in ws_res.text
    assert "Code Repository" in ws_res.text
    print("[PASS] 4. Student Project Workspace & Tabs (200 OK)")

    # 5. Test AI Assistant Endpoints
    ai_res = session.post(f"{BASE_URL}/api/ai/project-ideas", json={'domain': 'AI/ML'})
    assert ai_res.status_code == 200 and ai_res.json().get('success')
    print("[PASS] 5. AI Assistant Project Ideas Generator API (200 OK)")

    ai_code = session.post(f"{BASE_URL}/api/ai/code-review", json={'code': 'def run():\n    return "OK"'})
    assert ai_code.status_code == 200 and ai_code.json().get('success')
    print("[PASS] 6. AI Assistant Code Review & Security Audit API (200 OK)")

    # 6. Test Faculty Login (Demo)
    session_faculty = requests.Session()
    fac_res = session_faculty.post(f"{BASE_URL}/auth/login", data={'demo_role': 'faculty'}, allow_redirects=True)
    assert fac_res.status_code == 200
    assert "Faculty Supervision Hub" in fac_res.text or "Prof. Arvind Verma" in fac_res.text
    print("[PASS] 7. Faculty Guide Demo Login & Dashboard (200 OK)")

    # Test Faculty Guide Requests & Rubric Evaluation
    gr_res = session_faculty.get(f"{BASE_URL}/faculty/guide-requests")
    assert gr_res.status_code == 200
    print("[PASS] 8. Faculty Guide Requests Review page (200 OK)")

    ev_res = session_faculty.get(f"{BASE_URL}/faculty/evaluate/1")
    assert ev_res.status_code == 200
    assert "5-Criteria Assessment Breakdown" in ev_res.text
    print("[PASS] 9. Faculty 5-Criteria Rubric Evaluation Sheet (200 OK)")

    # 7. Test Admin Login (Demo)
    session_admin = requests.Session()
    adm_res = session_admin.post(f"{BASE_URL}/auth/login", data={'demo_role': 'admin'}, allow_redirects=True)
    assert adm_res.status_code == 200
    assert "Academic Administration Console" in adm_res.text
    print("[PASS] 10. Admin Demo Login & Analytics Dashboard (200 OK)")

    # Test Admin Approvals, Students, Faculty, Projects, Reports
    for adm_route in ['/admin/approvals', '/admin/students', '/admin/faculty', '/admin/projects', '/admin/files', '/admin/reports', '/admin/settings']:
        res = session_admin.get(f"{BASE_URL}{adm_route}")
        assert res.status_code == 200, f"Admin route {adm_route} failed: {res.status_code}"
        print(f"[PASS] 11. Admin Route ({adm_route}) (200 OK)")

    print("\nALL 11 VERIFICATION TEST SUITES PASSED FLAWLESSLY!")

if __name__ == '__main__':
    test_endpoints()
