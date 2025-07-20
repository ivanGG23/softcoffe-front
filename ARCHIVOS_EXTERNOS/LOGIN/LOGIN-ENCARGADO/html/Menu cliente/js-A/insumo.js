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
    insumoSeleccionado = index; // ← esta línea es la clave que faltaba
}

// ✅ Función de validación de campos del insumo
function validarFormularioInsumo() {
    let valido = true;

    const codigo = document.getElementById("codigoInsumo").value;
    const unidad = document.getElementById("unidadMedida").value;
    const nombre = document.getElementById("nombreInsumo").value;
    const presentacion = document.getElementById("presentacion").value;
    const contenido = parseInt(document.getElementById("contenido").value);

    document.getElementById("globalErrorInsumo").style.display = "none";
    document.getElementById("successInsumo").style.display = "none";

    document.getElementById("errorCodigoInsumo").style.display = codigo ? "none" : "block";
    document.getElementById("errorUnidadMedida").style.display = unidad ? "none" : "block";
    document.getElementById("errorNombreInsumo").style.display = nombre ? "none" : "block";
    document.getElementById("errorPresentacion").style.display = presentacion ? "none" : "block";
    document.getElementById("errorContenido").style.display = contenido > 0 ? "none" : "block";

    if (!codigo || !unidad || !nombre || !presentacion || contenido <= 0) {
        document.getElementById("globalErrorInsumo").style.display = "block";
        valido = false;
    }

    return valido;
}

// Botón para agregar insumo
document.getElementById("btnAgregarInsumo").onclick = async () => {
    if (!validarFormularioInsumo()) return;

    // 🚧 Modo edición de insumo
    if (insumoModo === "editar") {
        const codigo = parseInt(document.getElementById("codigoInsumo").value);

        const insumoEditado = {
            unidad: document.getElementById("unidadMedida").value,
            nombre: document.getElementById("nombreInsumo").value,
            presentacion: document.getElementById("presentacion").value,
            contenido: parseInt(document.getElementById("contenido").value)
        };

        try {
            const response = await fetch(`http://localhost:7000/insumos/${codigo}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(insumoEditado)
            });

            const msg = await response.text();
            console.log("Respuesta al editar:", msg);

            await cargarInsumosDesdeAPI();
            modalInsumo.style.display = "none";
            insumoSeleccionado = null;
            productoActualParaInsumo = null;

        } catch (error) {
            console.error("Error al editar insumo:", error);
            alert("No se pudo editar el insumo.");
        }

        return; // ⛔ Importante: no ejecutar la lógica de "agregar"
    }

    // 🆕 Modo agregar insumo
    const nuevoInsumo = {
        codigo: parseInt(document.getElementById("codigoInsumo").value),
        idProducto: productoActualParaInsumo?.id,
        unidad: document.getElementById("unidadMedida").value,
        nombre: document.getElementById("nombreInsumo").value,
        presentacion: document.getElementById("presentacion").value,
        contenido: parseInt(document.getElementById("contenido").value),
        estado: "existente"
    };

    if (!nuevoInsumo.idProducto || isNaN(nuevoInsumo.idProducto)) {
        alert("Error: no hay producto válido asociado al insumo.");
        return;
    }

    try {
        const response = await fetch("http://localhost:7000/insumos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoInsumo)
        });

        const resultado = await response.text();
        console.log("Respuesta del servidor:", resultado);

        if (!response.ok) {
            alert("Error del servidor: " + resultado);
            return;
        }

        document.getElementById("successInsumo").style.display = "block";

        await cargarInsumosDesdeAPI();
        productoActualParaInsumo = null;
        insumoSeleccionado = null;

        setTimeout(() => {
            document.getElementById("successInsumo").style.display = "none";
            document.getElementById("modalInsumo").style.display = "none";
        }, 2000);

    } catch (error) {
        console.error("Error al guardar insumo:", error);
        alert("No se pudo guardar el insumo.");
    }
};

// ✅ Botón para salir del formulario
document.getElementById("btnSalirInsumo").onclick = () => {
    document.getElementById("modalInsumo").style.display = "none";
    productoActualParaInsumo = null;
    insumoSeleccionado = null;
};