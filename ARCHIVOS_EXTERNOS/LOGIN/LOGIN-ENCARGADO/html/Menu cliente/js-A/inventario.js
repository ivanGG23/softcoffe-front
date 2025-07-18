let productos = [];
let modo = 'agregar';
let productoSeleccionado = null;

const tabla = document.getElementById("tablaProductos").querySelector("tbody");
const modal = document.getElementById("modal");
const modalEliminar = document.getElementById("modalEliminar");

const btnAgregar = document.getElementById("btnAgregar");
const btnEditar = document.getElementById("btnEditar");
const btnEliminar = document.getElementById("btnEliminar");
const btnCancelar = document.getElementById("btnCancelar");
const btnGuardar = document.getElementById("btnGuardar");

const btnSi = document.getElementById("btnSi");
const btnNo = document.getElementById("btnNo");

const nombre = document.getElementById("nombre");
const cantidad = document.getElementById("cantidad");
const fecha = document.getElementById("fecha");
const precio = document.getElementById("precio");

const globalError = document.getElementById("globalError");
const errorNombre = document.getElementById("errorNombre");
const errorCantidad = document.getElementById("errorCantidad");
const errorFecha = document.getElementById("errorFecha");
const errorPrecio = document.getElementById("errorPrecio");
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
  globalError.style.display = "none";
  errorNombre.style.display = "none";
  errorCantidad.style.display = "none";
  errorFecha.style.display = "none";
  errorPrecio.style.display = "none";
}

function validarFormulario() {
  let valido = true;
  errorNombre.style.display = nombre.value ? "none" : "block";
  errorCantidad.style.display = cantidad.value ? "none" : "block";
  errorFecha.style.display = fecha.value ? "none" : "block";
  errorPrecio.style.display = precio.value ? "none" : "block";

  if (!nombre.value || !cantidad.value || !fecha.value || !precio.value) {
    globalError.style.display = "block";
    valido = false;
  } else {
    globalError.style.display = "none";
  }
  return valido;
}

// Botones
btnAgregar.onclick = () => {
  modo = "agregar";
  modalTitle.textContent = "Agregar producto";
  limpiarFormulario();
  modal.style.display = "flex";
};

btnEditar.onclick = () => {
  if (productoSeleccionado === null) return alert("Selecciona un producto para editar.");
  modo = "editar";
  modalTitle.textContent = "Editar producto";
  limpiarFormulario();
  const prod = productos[productoSeleccionado];
  nombre.value = prod.nombre;
  cantidad.value = prod.cantidad;
  fecha.value = prod.fecha;
  precio.value = prod.precio;
  modal.style.display = "flex";
};

btnEliminar.onclick = () => {
  if (productoSeleccionado === null) return alert("Selecciona un producto para eliminar.");
  modalEliminar.style.display = "flex";
};

btnCancelar.onclick = () => {
  modal.style.display = "none";
};

btnGuardar.onclick = () => {
  if (!validarFormulario()) return;

  const nuevoProducto = {
    nombre: nombre.value,
    cantidad: parseInt(cantidad.value),
    fecha: fecha.value,
    precio: parseFloat(precio.value).toFixed(2),
  };

  if (modo === "agregar") {
    productos.push(nuevoProducto);
  } else if (modo === "editar" && productoSeleccionado !== null) {
    productos[productoSeleccionado] = nuevoProducto;
  }

  modal.style.display = "none";
  renderTabla();
  productoSeleccionado = null;
};

btnNo.onclick = () => {
  modalEliminar.style.display = "none";
};

btnSi.onclick = () => {
  if (productoSeleccionado !== null) {
    productos.splice(productoSeleccionado, 1);
    renderTabla();
    productoSeleccionado = null;
  }
  modalEliminar.style.display = "none";
};

// Inicializar
renderTabla();