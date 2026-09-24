import os
import sys
from app import create_app
from app.models import db
from app.seed_data import seed_database

# Ensure UTF-8 output on Windows stdout
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        # Ensure database tables exist and are seeded
        db.create_all()
        seed_database()

    port = int(os.environ.get('PORT', 5000))
    print(f"ProjectHub server starting on http://127.0.0.1:{port}")
    app.run(host='127.0.0.1', port=port, debug=False)
