btnEliminar.onclick = () => {
    if (vistaInsumos.style.display !== "none") {
        if (insumoSeleccionado === null) return alert("Selecciona un insumo para eliminar.");
        modalEliminar.querySelector(".modal-header").textContent = "¿Estás seguro de eliminar este insumo?";
    } else {
        if (productoSeleccionado === null) return alert("Selecciona un producto para eliminar.");
        modalEliminar.querySelector(".modal-header").textContent = "¿Estás seguro de eliminar este producto?";
    }
    modalEliminar.style.display = "flex";
};

btnSi.onclick = () => {
    if (vistaInsumos.style.display !== "none") {
        const codigo = insumosDesdeAPI[insumoSeleccionado].codigo;
        fetch(`http://localhost:7000/insumos/${codigo}/estado`, { method: "PUT" }) 
        .then(res => res.text())
        .then(msg => {
            console.log(msg);
            cargarInsumosDesdeAPI();
            insumoSeleccionado = null;
        });
    } else {
        const id = productos[productoSeleccionado].id;
        fetch(`http://localhost:7000/inventario/${id}/estado`, { method: "PUT" }) 
        .then(res => res.text())
        .then(msg => {
            console.log(msg);
            cargarInventarioDesdeAPI();
            productoSeleccionado = null;
        });
    }

    modalEliminar.style.display = "none";
};


btnNo.onclick = () => {
    modalEliminar.style.display = "none";
};