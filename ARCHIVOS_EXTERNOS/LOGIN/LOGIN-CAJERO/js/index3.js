document.addEventListener('DOMContentLoaded', function() {
    console.log('index3.js cargado');
    
    // 1. Botón "Finalizar Corte"
    const formCorte = document.querySelector('form[action="#modalCorteFinalizado"]');
    if (formCorte) {
        formCorte.addEventListener('submit', function(e) {
            e.preventDefault();
            document.getElementById('modalCorteFinalizado').style.display = 'flex';
        });
    }

    // 2. Cerrar modales
    document.querySelectorAll('.cerrar-modal').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });

    // 3. Redirigir al menú principal
    const btnRegresar = document.querySelector('#modalCorteFinalizado .boton-modal');
    if (btnRegresar) {
        btnRegresar.addEventListener('click', function() {
            window.location.href = '/html/menu-cajero.html';
        });
    }
});