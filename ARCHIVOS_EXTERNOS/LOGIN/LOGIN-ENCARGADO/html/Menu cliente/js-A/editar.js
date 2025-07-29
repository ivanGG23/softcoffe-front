btnEditar.onclick = () => {
    if (vistaInsumos.style.display !== "none") {
        if (insumoSeleccionado === null) return alert("Selecciona un insumo para editar.");
        const insumo = insumosDesdeAPI[insumoSeleccionado];
        document.getElementById("codigoInsumo").value = insumo.codigo;
        document.getElementById("unidadMedida").value = insumo.unidad;
        document.getElementById("nombreInsumo").value = insumo.nombre;
        document.getElementById("presentacion").value = insumo.presentacion;
        document.getElementById("contenido").value = insumo.contenido;
        insumoModo = 'editar';
        modalInsumo.style.display = "flex";
    } else {
        if (productoSeleccionado === null) return alert("Selecciona un producto para editar.");
        const prod = productos[productoSeleccionado];
        nombre.value = prod.nombre;
        cantidad.value = prod.cantidad;
        fecha.value = prod.fecha;
        precio.value = prod.precio;
        modo = "editar";
        modalTitle.textContent = "Editar producto";
        modal.style.display = "flex";
    }
};

// Agregar al guardar (btnGuardar):
if (modo === "editar") {
    const id = productos[productoSeleccionado].id;
    const productoEditado = {
        nombre: nombre.value,
        cantidad: parseInt(cantidad.value),
        fecha: fecha.value,
        precio: parseFloat(precio.value)
    };

    fetch(`http://localhost:7000/inventario/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productoEditado)
    })
    .then(res => res.text())
    .then(msg => {
        console.log(msg);
        cargarInventarioDesdeAPI();
        modal.style.display = "none";
        productoSeleccionado = null;
    });
}

// Agregar al gaurdar insumo (btnAgregarInsumo):
if (insumoModo === "editar") {
    const codigo = parseInt(document.getElementById("codigoInsumo").value);
    const insumoEditado = {
        unidad: document.getElementById("unidadMedida").value,
        nombre: document.getElementById("nombreInsumo").value,
        presentacion: document.getElementById("presentacion").value,
        contenido: parseInt(document.getElementById("contenido").value)
    };

    fetch(`http://localhost:7000/insumos/${codigo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(insumoEditado)
    })
    .then(res => res.text())
    .then(msg => {
        console.log(msg);
        cargarInsumosDesdeAPI();
        modalInsumo.style.display = "none";
        insumoSeleccionado = null;
    });
}