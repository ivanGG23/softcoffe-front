document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    console.log("ID recibido:", id);

    fetch(`http://localhost:7000/pedido/${id}/detalle`)
        .then(response => {
            if (!response.ok) throw new Error("Pedido no encontrado");
            return response.json();
        })
        .then(data => renderDetalle(data))  // ✅ usa el objeto completo
        .catch(error => {
            console.error("Error al cargar detalle:", error);
            alert("No se pudo cargar el pedido. Verifica el ID.");
        });

    document.querySelector(".entregar-btn").addEventListener("click", () => {
        const id = new URLSearchParams(window.location.search).get("id");

        fetch(`http://localhost:7000/api/pedido/${id}/entregar`, {
            method: "PUT"
        })
            .then(response => {
                if (!response.ok) throw new Error("No se pudo finalizar");
                return response.json();
            })
            .then(data => {
                alert(data.message);
                window.location.href = "productos2.html";
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Ocurrió un error al entregar el pedido.");
            });
    });
});



function renderDetalle(data) {
    const container = document.querySelector(".detalle-container");
    const h2 = container.querySelector("h2");
    h2.textContent = `Pedido #${data.id} - ${data.cliente}`;

    const tableBody = document.querySelector(".pedido-table tbody");
    tableBody.innerHTML = "";

    if (data.productos.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="2">Este pedido no tiene productos registrados.</td>`;
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
}