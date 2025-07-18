document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById('corteTurnoForm');
    const inicio = document.getElementById('inicio1');
    const efectivo = document.getElementById('efectivo1');
    const tarjeta = document.getElementById('tarjeta1');

    const errorInicio = document.getElementById('error-inicio');
    const errorEfectivo = document.getElementById('error-efectivo');
    const errorTarjeta = document.getElementById('error-tarjeta');

    formulario.addEventListener('submit', function (event) {
        let valido = true;
        resetearErrores();

        if (inicio.value.trim() === '') {
            mostrarError(inicio, errorInicio, 'Este campo es obligatorio.');
            valido = false;
        }

        if (efectivo.value.trim() === '') {
            mostrarError(efectivo, errorEfectivo, 'Este campo es obligatorio.');
            valido = false;
        }

        if (tarjeta.value.trim() === '') {
            mostrarError(tarjeta, errorTarjeta, 'Este campo es obligatorio.');
            valido = false;
        }

        if (!valido) {
            event.preventDefault();
        }
    });

    function mostrarError(input, errorDiv, mensaje) {
        input.classList.add('input-error');
        errorDiv.textContent = mensaje;
        errorDiv.style.display = 'block';
    }

    function resetearErrores() {
        [inicio, efectivo, tarjeta].forEach(input => input.classList.remove('input-error'));
        [errorInicio, errorEfectivo, errorTarjeta].forEach(div => {
            div.textContent = '';
            div.style.display = 'none';
        });
    }
});