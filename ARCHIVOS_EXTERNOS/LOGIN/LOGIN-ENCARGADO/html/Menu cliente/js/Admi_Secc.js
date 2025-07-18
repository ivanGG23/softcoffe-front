document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  const logoutModal = document.getElementById('logoutModal');
  const cancelBtn = document.getElementById('cancelBtn');
  const confirmBtn = document.getElementById('confirmBtn');

  logoutBtn.addEventListener('click', () => {
    logoutModal.style.display = 'flex';
  });

  cancelBtn.addEventListener('click', () => {
    logoutModal.style.display = 'none';
  });

  confirmBtn.addEventListener('click', () => {
    window.location.href = "../../../../../../index.html"; // Redirige al login o página principal
  });
});

