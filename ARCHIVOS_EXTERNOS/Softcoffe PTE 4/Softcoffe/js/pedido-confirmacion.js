document.addEventListener('DOMContentLoaded'), () => {
    // 1. Verificar si hay pedido seleccionado
    const pedidoGuardado = localStorage.getItem('pedidoActual');
    if (!pedidoGuardado) {
        window.location.href = 'menu-cajero.html';
        return;
    }

    // 2. Mostrar datos del pedido
    const pedido = JSON.parse(pedidoGuardado);
    const tabla = document.querySelector('.order-table');
    
    // Limpiar filas existentes (excepto header)
    document.querySelectorAll('.table-row').forEach(row => row.remove());

    // Añadir productos
    pedido.productos.forEach(prod => {
        const fila = document.createElement('div');
        fila.className = 'table-row';
        fila.innerHTML = `
            <span>${prod.nombre}</span>
            <span>${prod.cantidad}</span>
            <span>$${prod.precio.toFixed(2)}</span>
        `;
        tabla.appendChild(fila);
    });

    // 3. Actualizar total
    document.querySelector('.total').textContent = `$${pedido.total.toFixed(2)}`;

    

// Versión corregida - Reemplaza todo el código de los botones por esto:

// Botón CANCELAR - Muestra solo tu modal personalizado
document.querySelector('.cancel-btn').addEventListener('click', function(e) {
    e.preventDefault(); // Evita cualquier comportamiento por defecto
    document.getElementById('cancel-modal').style.display = 'flex';
});

// Botón CONFIRMAR - Muestra solo tu modal personalizado
document.querySelector('.confirm-btn').addEventListener('click', function(e) {
    e.preventDefault(); // Evita cualquier comportamiento por defecto
    document.getElementById('confirm-modal').style.display = 'flex';
});

// Cerrar modales y redirigir
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Limpiar datos y redirigir
        localStorage.removeItem('pedidoSeleccionado');
        window.location.href = 'menu-cajero.html';
    });
});
}
