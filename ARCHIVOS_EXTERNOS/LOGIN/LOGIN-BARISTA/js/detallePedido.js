document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    console.log("ID recibido:", id);

    // Usa la ruta correcta, que incluye el prefijo /api
    fetch(`http://localhost:7000/api/pedido/${id}/detalle`)
        .then(response => {
            if (!response.ok) throw new Error("Pedido no encontrado");
            return response.json();
        })
        .then(data => renderDetalle(data))
        .catch(error => {
            console.error("Error al cargar detalle:", error);
            alert("No se pudo cargar el pedido. Verifica el ID.");
        });
});

function renderDetalle(data) {
    const container = document.querySelector(".detalle-container");
    const tableBody = document.querySelector(".pedido-table tbody");

    // Encabezado dinámico
    const h2 = container.querySelector("h2");
    h2.textContent = `Pedido #${data.id} - ${data.cliente}`;

    // Llenar tabla con productos
    tableBody.innerHTML = "";

    if (data.productos.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td colspan="2">Este pedido no tiene productos registrados.</td>
        `;
        tableBody.appendChild(row);
    } else {
        data.productos.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.nombre}</td>
                <td>${item.cantidad}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Puedes mostrar método de pago, monto, hora si lo deseas
    console.log("Método de pago:", data.metodo);
    console.log("Monto:", data.monto);
    console.log("Hora del pedido:", data.hora);
}