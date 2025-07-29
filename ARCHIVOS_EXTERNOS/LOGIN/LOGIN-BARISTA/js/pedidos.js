document.addEventListener("DOMContentLoaded", () => {
    fetch("http://98.86.13.209:7000/pedidos/aprobados")
        .then(response => response.json())
        .then(pedidos => renderPedidos(pedidos))
        .catch(error => console.error("Error al cargar pedidos:", error));
});

function renderPedidos(pedidos) {
    const grid = document.querySelector(".orders-grid");
    grid.innerHTML = "";

    pedidos.forEach(pedido => {
        const card = document.createElement("div");
        card.className = "order-card";
        card.innerHTML = `
    <p><strong>Pedido #${pedido.id}</strong></p>
    <p>${pedido.cliente}</p>
    <a href="../html/detalle-pedido.html?id=${pedido.id}" class="prepare-btn">Ver pedido</a>
    `;
        grid.appendChild(card);
    });
}