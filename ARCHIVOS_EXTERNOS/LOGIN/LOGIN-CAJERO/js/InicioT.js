document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById('inicioTurnoForm');
    const efectivoInput = document.getElementById('efectivo');
    const errorMensaje = document.getElementById('error-efectivo');
    const overlay = document.querySelector('.overlay');

    formulario.addEventListener('submit', function (event) {
        resetearError();

        if (efectivoInput.value.trim() === '') {
            event.preventDefault();
            mostrarError(efectivoInput, errorMensaje, 'Este campo es obligatorio.');
        } else {
            event.preventDefault();
            mostrarMensajeExito(); 
        }
    });

    function mostrarError(input, errorDiv, mensaje) {
        input.classList.add('input-error');
        errorDiv.textContent = mensaje;
        errorDiv.style.display = 'block';
    }

    function resetearError() {
        efectivoInput.classList.remove('input-error');
        errorMensaje.textContent = '';
        errorMensaje.style.display = 'none';
    }

    function mostrarMensajeExito() {
        overlay.style.display = 'flex';
    }
});