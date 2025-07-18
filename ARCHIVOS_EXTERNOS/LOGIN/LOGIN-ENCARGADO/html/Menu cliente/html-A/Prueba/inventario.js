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

btnAgregar.onclick = () => {
    modo = "agregar";
    limpiarFormulario();
    modalTitle.textContent = "Agregar producto";
    modal.style.display = "flex";
};

btnEditar.onclick = () => {
    if (productoSeleccionado === null) return alert("Selecciona un producto para editar.");
    modo = "editar";
    const prod = productos[productoSeleccionado];
    nombre.value = prod.nombre;
    cantidad.value = prod.cantidad;
    fecha.value = prod.fecha;
    precio.value = prod.precio;
    modalTitle.textContent = "Editar producto";
    modal.style.display = "flex";
};

btnEliminar.onclick = () => {
    if (productoSeleccionado === null) return alert("Selecciona un producto para eliminar.");
    modalEliminar.style.display = "flex";
};

btnGuardar.onclick = async () => {
    if (!validarFormulario()) return alert("Completa todos los campos.");

    const nuevoProducto = {
        id: Date.now(), // O el código que definas tú
        nombre: nombre.value,
        cantidad: parseInt(cantidad.value),
        fecha: fecha.value,
        precio: parseFloat(precio.value)
    };

    try {
        const response = await fetch("http://localhost:7000/inventario", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoProducto)
        });

        const resultado = await response.text();
        console.log("Respuesta del servidor:", resultado);

        // Opcional: volver a cargar la tabla para ver lo que ya se guardó
        await cargarInventarioDesdeAPI();
        productoSeleccionado = null;
        modal.style.display = "none";
        modalInsumo.style.display = "flex";
        productoActualParaInsumo = nuevoProducto;

    } catch (error) {
        console.error("Error al guardar producto:", error);
        alert("Error al guardar producto en la base de datos.");
    }
};

btnCancelar.onclick = () => {
    modal.style.display = "none";
};

btnSi.onclick = () => {
    if (productoSeleccionado !== null) {
        productos.splice(productoSeleccionado, 1);
        renderTabla();
        productoSeleccionado = null;
    }
    modalEliminar.style.display = "none";
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

cargarInventarioDesdeAPI();