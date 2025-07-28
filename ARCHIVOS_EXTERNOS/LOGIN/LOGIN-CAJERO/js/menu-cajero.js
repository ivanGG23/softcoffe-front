document.addEventListener('DOMContentLoaded', function () {
    const contenedor = document.querySelector('.contenedor-pedidos');
    const buscador = document.querySelector('.input-buscar');

    // ===== 1. Cargar pedidos desde API =====
    fetch("http://localhost:7000/api/pedidos/cliente")
        .then(res => res.json())
        .then(pedidos => {
            contenedor.innerHTML = "";

            pedidos.forEach(pedido => {
                const div = document.createElement('div');
                div.className = "pedido";
                div.innerHTML = `
                    <p><strong>No.Pedido ${pedido.id}</strong></p>
                    <p>${pedido.cliente}</p>
                    <p>${pedido.metodo}</p>
                `;

                // Clic para ver detalles
                div.addEventListener('click', () => {
                    fetch(`http://localhost:7000/pedido/${pedido.id}/detalle`)
                        .then(res => res.json())
                        .then(detalle => {
                            const pedidoCompleto = {
                                numero: detalle.id,                     // ✅ Num_orden entero
                                nombre: detalle.cliente,
                                monto: detalle.monto,                   // ✅ total del pedido
                                metodo: detalle.metodo,                 // ✅ método de pago
                                productos: detalle.productos.map(p => ({
                                    nombre: p.nombre,
                                    cantidad: p.cantidad,
                                    precio: p.precio || 0
                                }))
                            };

                            localStorage.setItem('pedidoActual', JSON.stringify(pedidoCompleto));
                            window.location.href = 'pedido-confirmacion.html';
                        })
                        .catch(error => {
                            console.error("Error al cargar el detalle del pedido:", error);
                            alert("No se pudo cargar el detalle del pedido.");
                        });
                });

                contenedor.appendChild(div);
            });

            // ===== 2. Búsqueda dinámica =====
            if (buscador) {
                buscador.addEventListener('input', function (e) {
                    const termino = e.target.value.toLowerCase();
                    document.querySelectorAll('.pedido').forEach(pedido => {
                        pedido.style.display = pedido.textContent.toLowerCase().includes(termino)
                            ? 'flex'
                            : 'none';
                    });
                });
            }
        })
        .catch(error => {
            console.error("Error al cargar pedidos:", error);
            contenedor.innerHTML = "<p>Error al obtener pedidos del cliente.</p>";
        });

    // ===== 3. Botón Corte de turno =====
    const btnCorte = document.querySelector('.btn-corte');
    if (btnCorte) {
        btnCorte.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'corte-turno.html';
        });
    }
});