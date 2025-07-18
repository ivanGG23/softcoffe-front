document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const userError = document.getElementById('user-error');
  const passError = document.getElementById('pass-error');

  // Credenciales válidas (modifícalas según necesites)
  const VALID_USERNAME = "Kelly";
  const VALID_PASSWORD = "admin123";

  loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Resetear estado de errores
    resetErrors();

    // Validar credenciales
    const isUserValid = usernameInput.value === VALID_USERNAME;
    const isPassValid = passwordInput.value === VALID_PASSWORD;

    if (isUserValid && isPassValid) {
      // Redirección exitosa
      window.location.href = "inicio-turno.html";
    } else {
      // Mostrar errores
      if (!isUserValid) {
        showError(usernameInput, userError);
      }
      
      if (!isPassValid) {
        showError(passwordInput, passError);
      }
      
      // Activar animación de error
      triggerErrorAnimation();
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
    void loginForm.offsetWidth; // Forzar reflow
    loginForm.classList.add('error');
  }
});


