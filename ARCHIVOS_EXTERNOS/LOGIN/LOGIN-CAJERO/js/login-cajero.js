document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const userError = document.getElementById('user-error');
  const passError = document.getElementById('pass-error');
  const rol = "cajero";

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    resetErrors();

    const nombre = usernameInput.value;
    const contraseña = passwordInput.value;

    try {
      const response = await fetch('http://localhost:7000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, contraseña, rol })
      });

      if (response.ok) {
        window.location.href = "html/inicio-turno.html";
      } else {
        showError(usernameInput, userError);
        showError(passwordInput, passError);
        triggerErrorAnimation();
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
      console.error("Fallo en el login:", error);
    }
  });

  function resetErrors() {
    usernameInput.classList.remove('input-error');
    passwordInput.classList.remove('input-error');
    userError.style.display = 'none';
    passError.style.display = 'none';
    loginForm.classList.remove('error');
  }

  function showError(inputElement, errorElement) {
    inputElement.classList.add('input-error');
    errorElement.style.display = 'flex';
  }

  function triggerErrorAnimation() {
    loginForm.classList.remove('error');
    void loginForm.offsetWidth;
    loginForm.classList.add('error');
  }
});