/**
 * ProjectHub - Workspace Specific Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  // Tab switching with hashtag support
  const tabButtons = document.querySelectorAll('.workspace-tab-btn');
  const tabPanes = document.querySelectorAll('.tab-content-pane');

  function activateTab(tabId) {
    tabButtons.forEach(btn => {
      if (btn.dataset.tab === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    tabPanes.forEach(pane => {
      if (pane.id === `tab-${tabId}`) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      window.location.hash = tabId;
      activateTab(tabId);
    });
  });

  // Check URL hash on load
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(`tab-${hash}`)) {
    activateTab(hash);
  }

  // Auto-scroll chat discussion box to bottom
  const chatMessages = document.querySelector('.discussion-messages');
  if (chatMessages) {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Copy code snippet helper
  const copyButtons = document.querySelectorAll('.btn-copy-code');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const codeId = btn.dataset.codeId;
      const codeElement = document.getElementById(codeId);
      if (codeElement) {
        navigator.clipboard.writeText(codeElement.innerText).then(() => {
          const origText = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-check text-success me-1"></i>Copied!';
          setTimeout(() => {
            btn.innerHTML = origText;
          }, 2000);
        });
      }
    });
  });
});
