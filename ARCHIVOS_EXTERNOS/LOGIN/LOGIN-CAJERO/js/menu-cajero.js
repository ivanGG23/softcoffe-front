document.addEventListener('DOMContentLoaded', function() {
    // ===== 1. CLICS EN PEDIDOS =====
    document.querySelectorAll('.pedido').forEach((pedido, index) => {
        pedido.addEventListener('click', function() {
            const pedidoData = {
                numero: `P-${index + 100}`,
                cliente: `Cliente ${index + 1}`,
                productos: [
                    { nombre: "Café Americano", cantidad: 2, precio: 25 },
                    { nombre: "Panini", cantidad: 1, precio: 45 }
                ],
                total: 95.00
            };
            localStorage.setItem('pedidoActual', JSON.stringify(pedidoData));
            window.location.href = 'pedido-confirmacion.html';
        });
    });

    // ===== 2. BÚSQUEDA =====
    const buscador = document.querySelector('.input-buscar');
    if (buscador) {
        buscador.addEventListener('input', function(e) {
            const termino = e.target.value.toLowerCase();
            document.querySelectorAll('.pedido').forEach(pedido => {
                pedido.style.display = pedido.textContent.toLowerCase().includes(termino) 
                    ? 'flex' 
                    : 'none';
            });
        });
    }

    // ===== 3. BOTÓN CORTE DE TURNO (VERSIÓN FINAL) =====
    const btnCorte = document.querySelector('.btn-corte');
    if (btnCorte) {
        btnCorte.addEventListener('click', function(e) {
            e.preventDefault();
            // Usa una de estas opciones (NO ambas):
            
            // Opción A: Ruta relativa (si tu estructura es /auth/ y /proyecto/)
            window.location.href = 'corte-turno.html';
            
            // Opción B: Ruta absoluta desde el dominio (más confiable)
            // window.location.href = window.location.origin + '/proyecto/index3.html';
        });
    }
});