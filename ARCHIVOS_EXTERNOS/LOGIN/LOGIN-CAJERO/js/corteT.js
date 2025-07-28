document.addEventListener('DOMContentLoaded', async function () {
    const formulario = document.getElementById('corteTurnoForm');
    const inicio = document.getElementById('inicio1');
    const efectivo = document.getElementById('efectivo1');
    const tarjeta = document.getElementById('tarjeta1');
    const id_usuario = parseInt(localStorage.getItem('id_usuario'));

    const errorInicio = document.getElementById('error-inicio');
    const errorEfectivo = document.getElementById('error-efectivo');
    const errorTarjeta = document.getElementById('error-tarjeta');

    try {
        const res = await fetch("http://localhost:7000/api/turno/estado", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_usuario })
        });

        const data = await res.json();
        if (data.turno_abierto) {
            inicio.value = data.efectivo_inicio;
        }
    } catch (err) {
        console.error("No se pudo precargar el efectivo de inicio:", err);
    }

    formulario.addEventListener('submit', async function (event) {
        event.preventDefault();
        resetearErrores();

        let valido = true;

        // Validaciones simples
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

        if (!valido) return;

        // Datos a enviar
        const id_usuario = parseInt(localStorage.getItem('id_usuario'));
        const inicio1 = parseFloat(inicio.value);
        const efectivo_final = parseFloat(efectivo.value);
        const monto_tarjeta = parseFloat(tarjeta.value);

        const payload = {
            id_usuario,
            inicio1,
            efectivo1: efectivo_final,
            tarjeta1: monto_tarjeta
        };

        try {
            const res = await fetch("http://localhost:7000/api/turno/cerrar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const respuesta = await res.json();

            if (res.ok) {
                mostrarModalCorte(`✅ Corte exitoso${respuesta.coincide === false ? " pero no coincide con la cantidad de inicio ingresada" : ""}`);
            } else {
                mostrarModalCorte(`⚠️ ${respuesta.error}. Ingresado: ${respuesta.ingresado}, Registrado: ${respuesta.esperado}`);
            }
        } catch (err) {
            console.error("Error al cerrar turno:", err);
            mostrarModalCorte("❌ Error de conexión con el servidor");
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

    function mostrarModalCorte(mensaje) {
        const modal = document.getElementById("modalCorteFinalizado");
        const resultado = modal.querySelector(".resultado-corte");
        resultado.innerHTML = `<p>${mensaje}</p><a href="../../../../index.html" class="boton-modal">Cerrar</a>`;
        modal.style.display = "flex";
    }
});