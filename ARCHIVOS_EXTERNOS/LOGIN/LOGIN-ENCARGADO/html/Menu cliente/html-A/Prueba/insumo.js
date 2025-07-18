let insumosDesdeAPI = [];

const tablaInsumos = document.getElementById("tablaInsumos").querySelector("tbody");

function renderTablaInsumosFiltrada(query) {
    tablaInsumos.innerHTML = "";
    let contador = 1;
    insumosDesdeAPI.forEach((insumo, index) => {
        const nombreProducto = insumo.producto.toLowerCase();
        const nombreInsumo = insumo.nombre.toLowerCase();
        if (nombreProducto.includes(query) || nombreInsumo.includes(query)) {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${contador++}</td>
                <td>${insumo.codigo}</td>
                <td>${insumo.producto}</td>
                <td>${insumo.unidad}</td>
                <td>${insumo.nombre}</td>
                <td>${insumo.presentacion}</td>
                <td>${insumo.contenido}</td>
            `;
            fila.onclick = () => seleccionarInsumo(index, fila);
            tablaInsumos.appendChild(fila);
        }
    });
}

async function cargarInsumosDesdeAPI() {
    try {
        const response = await fetch("http://localhost:7000/insumos");
        const data = await response.json();
        insumosDesdeAPI = data;
        renderTablaInsumosFiltrada("");
    } catch (error) {
        console.error("Error al cargar insumos:", error);
    }
}

function seleccionarInsumo(index, filaHTML) {
    tablaInsumos.querySelectorAll("tr").forEach(row => row.classList.remove("selected-row"));
    filaHTML.classList.add("selected-row");
}