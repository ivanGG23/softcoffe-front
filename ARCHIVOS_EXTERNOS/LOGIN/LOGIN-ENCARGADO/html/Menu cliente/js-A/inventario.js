let productos = [];
let modo = 'agregar';
let productoSeleccionado = null;
let productoActualParaInsumo = null;
let insumoModo = 'nuevo';
let insumoSeleccionado = null;

const tabla = document.getElementById("tablaProductos").querySelector("tbody");
const vistaInventario = document.getElementById("vistaInventario");
const vistaInsumos = document.getElementById("vistaInsumos");
const btnCambiarVista = document.getElementById("btnCambiarVista");
const btnAgregar = document.getElementById("btnAgregar");
const btnEditar = document.getElementById("btnEditar");
const btnEliminar = document.getElementById("btnEliminar");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const btnSi = document.getElementById("btnSi");
const btnNo = document.getElementById("btnNo");
const btnNuevoInsumo = document.getElementById("btnNuevoInsumo");
const modal = document.getElementById("modal");
const modalEliminar = document.getElementById("modalEliminar");
const modalInsumo = document.getElementById("modalInsumo");
const searchInput = document.getElementById("searchInput");
const nombre = document.getElementById("nombre");
const cantidad = document.getElementById("cantidad");
const fecha = document.getElementById("fecha");
const precio = document.getElementById("precio");
const modalTitle = document.getElementById("modalTitle");

function renderTabla() {
    tabla.innerHTML = "";
    productos.forEach((prod, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${index + 1}</td>
            <td>${prod.nombre}</td>
            <td>${prod.cantidad}</td>
            <td>${prod.fecha}</td>
            <td>$${prod.precio}</td>
        `;
        fila.onclick = () => seleccionarProducto(index, fila);
        tabla.appendChild(fila);
    });
}

function seleccionarProducto(index, filaHTML) {
    tabla.querySelectorAll("tr").forEach(row => row.classList.remove("selected-row"));
    filaHTML.classList.add("selected-row");
    productoSeleccionado = index;
}

function limpiarFormulario() {
    nombre.value = "";
    cantidad.value = "";
    fecha.value = "";
    precio.value = "";
}

function validarFormulario() {
    return nombre.value && cantidad.value && fecha.value && precio.value;
}

function mostrarSeleccionDeInsumos(insumos) {
    const contenedor = document.getElementById("listaInsumosReactivar");
    contenedor.innerHTML = "";

    insumos.forEach(insumo => {
        const fila = document.createElement("div");
        fila.classList.add("insumo-item");
        fila.innerHTML = `
            <label>
                <input type="checkbox" value="${insumo.codigo}" />
                ${insumo.nombre} (${insumo.presentacion} / ${insumo.contenido} ${insumo.unidad})
            </label>
        `;
        contenedor.appendChild(fila);
    });

    document.getElementById("modalInsumosReactivacion").style.display = "flex";
}

function cerrarModalInsumos() {
    document.getElementById("modalInsumosReactivacion").style.display = "none";
}

btnAgregar.onclick = () => {
    modo = "agregar";
    limpiarFormulario();
    modalTitle.textContent = "Agregar producto";
    modal.style.display = "flex";
};

btnEditar.onclick = () => {
    if (vistaInventario.style.display !== "none") {
        // 👉 Modo editar producto
        if (productoSeleccionado === null) return alert("Selecciona un producto para editar.");
        const prod = productos[productoSeleccionado];
        nombre.value = prod.nombre;
        cantidad.value = prod.cantidad;
        fecha.value = prod.fecha;
        precio.value = prod.precio;
        modo = "editar";
        modalTitle.textContent = "Editar producto";
        modal.style.display = "flex";
    } else {
        // 👉 Modo editar insumo
        if (insumoSeleccionado === null) return alert("Selecciona un insumo para editar.");

        const insumo = insumosDesdeAPI[insumoSeleccionado];
        document.getElementById("codigoInsumo").value = insumo.codigo;
        document.getElementById("unidadMedida").value = insumo.unidad;
        document.getElementById("nombreInsumo").value = insumo.nombre;
        document.getElementById("presentacion").value = insumo.presentacion;
        document.getElementById("contenido").value = insumo.contenido;

        insumoModo = "editar";

        // ✅ Asignar el producto vinculado al insumo
        productoActualParaInsumo = { id: insumo.idProducto };

        modalInsumo.style.display = "flex";
    }
};

btnEliminar.onclick = () => {
    if (vistaInventario.style.display !== "none") {
        if (productoSeleccionado === null) return alert("Selecciona un producto para eliminar.");
        modalEliminar.querySelector(".modal-header").textContent = "¿Estás seguro de eliminar este producto?";

        btnSi.onclick = async () => {
            const id = productos[productoSeleccionado].id;
            try {
                await fetch(`http://localhost:7000/inventario/${id}/estado`, {
                    method: "PUT"
                });
                await cargarInventarioDesdeAPI();
                productoSeleccionado = null;
            } catch (error) {
                console.error("Error al eliminar producto:", error);
                alert("No se pudo eliminar el producto.");
            }
            modalEliminar.style.display = "none";
        };
    } else {
        if (insumoSeleccionado === null) return alert("Selecciona un insumo para eliminar.");
        modalEliminar.querySelector(".modal-header").textContent = "¿Estás seguro de eliminar este insumo?";

        btnSi.onclick = async () => {
            const codigo = insumosDesdeAPI[insumoSeleccionado].codigo;
            try {
                await fetch(`http://localhost:7000/insumos/${codigo}/estado`, {
                    method: "PUT"
                });
                await cargarInsumosDesdeAPI();
                insumoSeleccionado = null;
            } catch (error) {
                console.error("Error al eliminar insumo:", error);
                alert("No se pudo eliminar el insumo.");
            }
            modalEliminar.style.display = "none";
        };
    }

    modalEliminar.style.display = "flex";
};

btnGuardar.onclick = async () => {
    if (!validarFormulario()) return alert("Completa todos los campos.");

    const producto = {
        nombre: nombre.value,
        cantidad: parseInt(cantidad.value),
        fecha: fecha.value,
        precio: parseFloat(precio.value)
    };

    if (modo === "agregar") {
        const nuevoProducto = {
            id: Date.now(),
            ...producto
        };

        try {
            await fetch("http://localhost:7000/inventario", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoProducto)
            });

            await cargarInventarioDesdeAPI();
            modal.style.display = "none";
            productoActualParaInsumo = nuevoProducto;
            modalInsumo.style.display = "flex";
        } catch (error) {
            console.error("Error al guardar producto:", error);
            alert("No se pudo guardar el producto.");
        }

    } else if (modo === "editar" && productoSeleccionado !== null) {
        const id = productos[productoSeleccionado].id;

        try {
            await fetch(`http://localhost:7000/inventario/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(producto)
            });

            await cargarInventarioDesdeAPI();
            modal.style.display = "none";
            productoSeleccionado = null;
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            alert("No se pudo actualizar el producto.");
        }
    }
};

btnCancelar.onclick = () => {
    modal.style.display = "none";
};


btnNo.onclick = () => {
    modalEliminar.style.display = "none";
};

btnNuevoInsumo.onclick = () => {
    if (productoSeleccionado === null) return alert("Selecciona un producto para agregar insumos.");
    productoActualParaInsumo = productos[productoSeleccionado];
    insumoModo = 'agregar';
    modalInsumo.style.display = "flex";
};

btnCambiarVista.onclick = () => {
    vistaReactivar.style.display = "none"; // 👈 oculta la vista de reactivación al cambiar

    const inventarioVisible = vistaInventario.style.display !== "none";
    vistaInventario.style.display = inventarioVisible ? "none" : "block";
    vistaInsumos.style.display = inventarioVisible ? "block" : "none";

    if (!inventarioVisible) {
        cargarInventarioDesdeAPI();
    } else {
        cargarInsumosDesdeAPI();
    }
};

searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    if (vistaInventario.style.display !== "none") {
        tabla.innerHTML = "";
        productos.forEach((prod, index) => {
            if (prod.nombre.toLowerCase().includes(query)) {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${prod.nombre}</td>
                    <td>${prod.cantidad}</td>
                    <td>${prod.fecha}</td>
                    <td>$${prod.precio}</td>
                `;
                fila.onclick = () => seleccionarProducto(index, fila);
                tabla.appendChild(fila);
            }
        });
    } else {
        renderTablaInsumosFiltrada(query);
    }
});

async function cargarInventarioDesdeAPI() {
    try {
        const response = await fetch("http://localhost:7000/inventario");
        const data = await response.json();
        productos = data.map(prod => ({
            id: prod.id,
            nombre: prod.nombre,
            cantidad: prod.cantidad,
            fecha: prod.fecha,
            precio: parseFloat(prod.precio).toFixed(2),
            insumos: []
        }));
        renderTabla();
    } catch (error) {
        console.error("Error al cargar inventario:", error);
    }
}

document.getElementById("btnReactivar").onclick = async () => {
    vistaInventario.style.display = "none";
    vistaInsumos.style.display = "none";
    vistaReactivar.style.display = "block";

    try {
        const res = await fetch("http://localhost:7000/inventario-inactivo");
        const productosAgotados = await res.json();

        const tbody = document.getElementById("tablaReactivacion").querySelector("tbody");
        tbody.innerHTML = "";
        let contador = 1;

        productosAgotados.forEach(prod => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${contador++}</td>
                <td>${prod.nombre}</td>
                <td>${prod.precio}</td>
                <td>${prod.cantidad}</td>
                <td>${prod.fecha}</td>
            `;
            fila.onclick = () => reactivarProducto(prod.id);
            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error("Error al cargar productos agotados:", error);
        alert("No se pudo cargar la lista de productos inactivos.");
    }
};

document.getElementById("btnConfirmarReactivacion").onclick = async () => {
    const seleccionados = Array.from(document.querySelectorAll("#listaInsumosReactivar input:checked"))
        .map(chk => parseInt(chk.value));

    if (seleccionados.length === 0) {
        alert("Selecciona al menos un insumo para reactivar.");
        return;
    }

    for (const codigo of seleccionados) {
        await fetch(`http://localhost:7000/insumo/${codigo}/reactivar`, { method: "PUT" });
    }

    alert("Insumos reactivados correctamente.");
    document.getElementById("modalInsumosReactivacion").style.display = "none";
    await cargarInsumosDesdeAPI();
};

async function reactivarProducto(id) {
    if (!confirm("¿Reactivar este producto y sus insumos relacionados?")) return;

    try {
        const res = await fetch(`http://localhost:7000/inventario/${id}/reactivar`, {
            method: "PUT"
        });
        const msg = await res.text();
        alert(msg);

        vistaReactivar.style.display = "none";
        vistaInventario.style.display = "block";
        await cargarInventarioDesdeAPI();
        const insumos = await fetch(`http://localhost:7000/insumos-inactivos/${id}`).then(r => r.json());
        if (insumos.length > 0) {
            mostrarSeleccionDeInsumos(insumos);
        }
    } catch (error) {
        console.error("Error al reactivar producto:", error);
        alert("No se pudo reactivar el producto.");
    }
}
cargarInventarioDesdeAPI();