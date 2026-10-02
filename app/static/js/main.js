/**
 * ProjectHub - Core Client Interaction Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Sidebar Toggle
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const appSidebar = document.querySelector('.app-sidebar');
  if (sidebarToggleBtn && appSidebar) {
    sidebarToggleBtn.addEventListener('click', () => {
      appSidebar.classList.toggle('show');
    });
  }

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (appSidebar && appSidebar.classList.contains('show')) {
      if (!appSidebar.contains(e.target) && (!sidebarToggleBtn || !sidebarToggleBtn.contains(e.target))) {
        appSidebar.classList.remove('show');
      }
    }
  });

  // 2. Notification Mark Read Handlers
  const notifItems = document.querySelectorAll('.notif-item');
  notifItems.forEach(item => {
    item.addEventListener('click', async (e) => {
      const notifId = item.dataset.notifId;
      if (notifId) {
        try {
          await fetch(`/api/notifications/${notifId}/read`, { method: 'POST' });
          item.classList.remove('unread');
          updateNotifBadge();
        } catch (err) {
          console.error('Failed to mark notification read:', err);
        }
      }
    });
  });

  const markAllReadBtn = document.getElementById('markAllReadBtn');
  if (markAllReadBtn) {
    markAllReadBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        const res = await fetch('/api/notifications/mark-all-read', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          document.querySelectorAll('.notif-item').forEach(el => el.classList.remove('unread'));
          const dot = document.querySelector('.notif-badge-dot');
          if (dot) dot.remove();
          const badge = document.querySelector('.notif-count-badge');
          if (badge) badge.innerText = '0';
        }
      } catch (err) {
        console.error('Failed to mark all notifications read:', err);
      }
    });
  }

  function updateNotifBadge() {
    const unread = document.querySelectorAll('.notif-item.unread').length;
    const badge = document.querySelector('.notif-count-badge');
    if (badge) badge.innerText = unread;
    const dot = document.querySelector('.notif-badge-dot');
    if (dot && unread === 0) dot.remove();
  }

  // 3. Dynamic Table Search Filter
  const tableSearchInput = document.getElementById('tableSearchInput');
  if (tableSearchInput) {
    tableSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const rows = document.querySelectorAll('.filterable-table tbody tr');
      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }

  // 4. Auto-dismiss Alert Messages after 5 seconds
  setTimeout(() => {
    const alerts = document.querySelectorAll('.alert-dismissible');
    alerts.forEach(alert => {
      const bsAlert = bootstrap.Alert.getInstance(alert);
      if (bsAlert) {
        bsAlert.close();
      }
    });
  }, 5000);
});

/**
 * AI Assistant Interaction Functions
 */
async function generateAIIdeas() {
  const domainSelect = document.getElementById('aiDomainSelect');
  const domain = domainSelect ? domainSelect.value : 'Web SaaS';
  const container = document.getElementById('aiIdeasOutput');
  const btn = document.getElementById('aiGenerateIdeasBtn');
  
  if (!container) return;
  
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Generating Project Ideas...';
  container.innerHTML = '<div class="text-center py-4"><div class="spinner-border text-primary" role="status"></div><p class="mt-2 text-muted">Consulting AI Knowledge Engine...</p></div>';
  
  try {
    const response = await fetch('/api/ai/project-ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: domain })
    });
    const data = await response.json();
    
    if (data.success) {
      let html = '<div class="row g-3">';
      data.suggestions.forEach(idea => {
        html += `
          <div class="col-12">
            <div class="p-3 border rounded-3 bg-white shadow-sm">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="fw-bold text-navy mb-0">${idea.title}</h6>
                <span class="badge bg-primary-subtle text-primary">${idea.complexity}</span>
              </div>
              <p class="small text-muted mb-2">${idea.abstract}</p>
              <div class="small text-dark mb-2"><strong>Recommended Tech Stack:</strong> <code>${idea.tech_stack}</code></div>
              <button class="btn btn-sm btn-outline-primary" onclick="useProjectIdea('${idea.title.replace(/'/g, "\\'")}', '${idea.abstract.replace(/'/g, "\\'")}', '${idea.tech_stack.replace(/'/g, "\\'")}')">
                <i class="fas fa-plus-circle me-1"></i> Use this Project Idea
              </button>
            </div>
          </div>
        `;
      });
      html += '</div>';
      container.innerHTML = html;
    }
  } catch (err) {
    container.innerHTML = '<div class="alert alert-danger">Failed to generate AI ideas. Please try again.</div>';
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-magic me-2"></i>Generate Novel Ideas';
  }
}

function useProjectIdea(title, abstract, techStack) {
  const titleInput = document.getElementById('projectTitleInput');
  const abstractInput = document.getElementById('projectAbstractInput');
  const techInput = document.getElementById('projectTechStackInput');
  
  if (titleInput) titleInput.value = title;
  if (abstractInput) abstractInput.value = abstract;
  if (techInput) techInput.value = techStack;
  
  // Close modal if open
  const modalEl = document.getElementById('aiAssistantModal');
  if (modalEl) {
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  }
}

async function runAICodeReview() {
  const codeArea = document.getElementById('aiCodeInput');
  const container = document.getElementById('aiReviewOutput');
  const btn = document.getElementById('aiRunReviewBtn');
  
  if (!codeArea || !codeArea.value.trim()) {
    alert('Please paste code before running AI Review.');
    return;
  }
  
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Auditing Codebase...';
  
  try {
    const response = await fetch('/api/ai/code-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: codeArea.value, language: 'python' })
    });
    const data = await response.json();
    
    if (data.success) {
      const a = data.analysis;
      let issuesHtml = '';
      a.issues.forEach(iss => {
        issuesHtml += `<li class="mb-1"><span class="badge bg-warning text-dark me-1">${iss.type}</span> ${iss.message}</li>`;
      });
      
      container.innerHTML = `
        <div class="p-3 border rounded-3 bg-white shadow-sm mt-3">
          <div class="row g-2 mb-3 text-center">
            <div class="col-4">
              <div class="p-2 bg-light rounded">
                <small class="text-muted d-block">Score</small>
                <strong class="text-success fs-5">${a.quality_score}/100</strong>
              </div>
            </div>
            <div class="col-4">
              <div class="p-2 bg-light rounded">
                <small class="text-muted d-block">Complexity</small>
                <strong class="text-primary fs-6">${a.complexity}</strong>
              </div>
            </div>
            <div class="col-4">
              <div class="p-2 bg-light rounded">
                <small class="text-muted d-block">Maintainability</small>
                <strong class="text-dark fs-6">${a.maintainability_index}</strong>
              </div>
            </div>
          </div>
          <h6 class="fw-bold mb-2">Findings & Vulnerabilities:</h6>
          <ul class="small ps-3 mb-3">${issuesHtml}</ul>
          <div class="alert alert-info py-2 px-3 small mb-0">
            <strong><i class="fas fa-lightbulb me-1"></i> AI Recommendation:</strong> ${a.recommendation}
          </div>
        </div>
      `;
    }
  } catch (err) {
    container.innerHTML = '<div class="alert alert-danger mt-3">Error during AI code review.</div>';
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-code-branch me-2"></i>Run AI Code Analysis';
  }
}

/**
 * Universal Clipboard Copy Helper
 */
function copyToClipboard(text, customMessage = 'Copied to clipboard!') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToastNotification(customMessage);
    }).catch(err => {
      fallbackCopyText(text, customMessage);
    });
  } else {
    fallbackCopyText(text, customMessage);
  }
}

function fallbackCopyText(text, customMessage) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToastNotification(customMessage);
  } catch (err) {
    console.error('Fallback copy failed', err);
  }
  document.body.removeChild(textArea);
}

function showToastNotification(message) {
  let toastContainer = document.getElementById('phToastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'phToastContainer';
    toastContainer.style.position = 'fixed';
    toastContainer.style.bottom = '24px';
    toastContainer.style.right = '24px';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);
  }

  const toastEl = document.createElement('div');
  toastEl.className = 'toast align-items-center text-white bg-navy border-0 shadow-lg show';
  toastEl.style.backgroundColor = '#0b132b';
  toastEl.style.borderRadius = '8px';
  toastEl.style.padding = '10px 16px';
  toastEl.style.marginBottom = '10px';
  toastEl.style.display = 'flex';
  toastEl.style.alignItems = 'center';
  toastEl.style.gap = '10px';
  toastEl.innerHTML = `<i class="fas fa-check-circle text-success fs-5"></i> <div class="fw-semibold">${message}</div>`;

  toastContainer.appendChild(toastEl);
  setTimeout(() => {
    toastEl.style.transition = 'opacity 0.5s ease';
    toastEl.style.opacity = '0';
    setTimeout(() => toastEl.remove(), 500);
  }, 3000);
}

