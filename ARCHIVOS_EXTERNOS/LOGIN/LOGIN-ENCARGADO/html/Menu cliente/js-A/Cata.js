function mostrarProductos(categoria) {
  console.log("📦 Mostrando categoría:", categoria);
  console.log("🧩 Productos encontrados:", productosData[categoria]);

  contenedorProductos.innerHTML = "";
  botonesCategorias.forEach(btn => {
    btn.classList.remove("active");
    if (btn.dataset.categoria === categoria) {
      btn.classList.add("active");
    }
  });

  if (productosData[categoria] && productosData[categoria].length > 0) {
    productosData[categoria].forEach(producto => {
      const div = document.createElement("div");
      div.classList.add("producto");
      div.dataset.id = producto.id;
      div.innerHTML = `
        <img src="${producto.img_url || 'img/default.jpg'}" class="imagen-producto" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>$${producto.precio}</p>
        <p><strong>Insumos:</strong> ${producto.insumos ? producto.insumos.join(", ") : "—"}</p>
        <div class="acciones">
          <button class="editar-btn" data-id="${producto.id}"><i class="fa-solid fa-pen-to-square"></i> Editar</button>
          <button class="eliminar-producto" data-id="${producto.id}"><i class="fa-solid fa-trash"></i> Eliminar</button>
        </div>`;
      div.querySelector(".editar-btn").addEventListener("click", () => abrirModalEditar(producto.id));
      div.querySelector(".eliminar-producto").addEventListener("click", () => eliminarProducto(producto));
      contenedorProductos.appendChild(div);
    });
  } else {
    contenedorProductos.innerHTML = `<p class="mensaje-vacio">No hay productos disponibles en esta categoría</p>`;
  }

  agregarBotonAgregar();
}

function agregarBotonAgregar() {
  const agregar = document.createElement("div");
  agregar.classList.add("producto", "agregar");
  agregar.innerHTML = `<i class="fa-solid fa-plus"></i><p>Agregar Producto</p>`;
  agregar.addEventListener("click", () => {
    formAgregar.reset();
    document.querySelector("#resumen-insumos").innerHTML = "";
    document.getElementById("imagen-agregar").src = "";
    document.getElementById("imagen-agregar").dataset.url = "";
    modalAgregar.style.display = "flex";
  });
  contenedorProductos.appendChild(agregar);
}

async function cargarProductosDesdeAPI() {
  try {
    const res = await fetch("http://localhost:7000/productos");
    const productos = await res.json();

    for (const cat of ["promociones", "cafe", "frappe", "te", "postre"]) {
      productosData[cat] = [];
    }

    productos.forEach(p => {
      if (!productosData[p.categoria]) {
        productosData[p.categoria] = [];
      }
      productosData[p.categoria].push(p);
    });

    mostrarProductos("promociones");
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

async function cargarCategoriasDesdeAPI() {
  try {
    const res = await fetch("http://localhost:7000/categorias");
    const categorias = await res.json();

    const selectAgregar = document.getElementById("agregar-categoria");
    const selectEditar = document.getElementById("editar-categoria");

    selectAgregar.innerHTML = '<option value="">Selecciona una categoría</option>';
    selectEditar.innerHTML = '<option value="">Selecciona una categoría</option>';

    categorias.forEach(cat => {
      const optionAgregar = document.createElement("option");
      optionAgregar.value = cat.id;
      optionAgregar.textContent = cat.nombre;
      selectAgregar.appendChild(optionAgregar);

      const optionEditar = optionAgregar.cloneNode(true);
      selectEditar.appendChild(optionEditar);
    });
  } catch (error) {
    console.error("Error al cargar categorías:", error);
  }
}

async function cargarInsumosDesdeAPI() {
  try {
    const res = await fetch("http://localhost:7000/insumos");
    await res.json();
    const contenedor = document.getElementById("resumen-insumos");
    if (contenedor) contenedor.innerHTML = "";
  } catch (error) {
    console.error("Error al cargar insumos:", error);
  }
}

async function subirImagenACloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "img_productos"); // Asegúrate de que esté creado y en modo 'unsigned'
  formData.append("folder", "menu-productos");        // Opcional, organiza en carpeta

  try {
    const res = await fetch("https://api.cloudinary.com/v1_1/dwjszeznq/image/upload", {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error("Error al subir imagen");

    const data = await res.json();

    if (!data.secure_url) throw new Error("Cloudinary no devolvió una URL segura");

    console.log("Cloudinary response:", data);
    console.log("Secure URL:", data.secure_url);

    return data.secure_url;

  } catch (err) {
    console.error("Cloudinary upload error:", err.message);
    return null;
  }
}

//---------------------------------------------------------------------------------------------------------------------------
let insumosSeleccionados = [];
let imagenSeleccionadaURL = "";
const productosData = {};
const contenedorProductos = document.getElementById("contenedor-productos");
const botonesCategorias = document.querySelectorAll("nav button");
const formAgregar = document.getElementById("form-agregar");
const modalAgregar = document.getElementById("modal-agregar");
const modalEditar = document.getElementById("modal-editar");

document.getElementById("btn-elegir-insumos").addEventListener("click", async () => {
  try {
    const res = await fetch("http://localhost:7000/insumos");
    const insumos = await res.json();
    const contenedor = document.getElementById("contenedor-insumos-modal");
    contenedor.innerHTML = "";

    insumos.forEach(insumo => {
      const label = document.createElement("label");
      label.classList.add("checkbox-option");
      label.innerHTML = `
        <input type="checkbox" value="${insumo.nombre}" ${insumosSeleccionados.includes(insumo.nombre) ? "checked" : ""}>
        ${insumo.nombre} (${insumo.presentacion} - ${insumo.unidad}, ${insumo.contenido})
      `;
      contenedor.appendChild(label);
    });

    document.getElementById("modal-insumos").style.display = "flex";
  } catch (err) {
    console.error("Error al cargar insumos:", err);
  }
});

document.getElementById("btn-confirmar-insumos").addEventListener("click", () => {
  const seleccionados = document.querySelectorAll("#contenedor-insumos-modal input:checked");
  const chips = Array.from(seleccionados).map(cb => cb.value);

  const estaEditando = modalEditar.style.display === "flex";
  insumosSeleccionados = chips;

  if (estaEditando) {
    const contenedorResumen = document.getElementById("resumen-insumos-editar");
    contenedorResumen.innerHTML = "";

    chips.forEach(nombre => {
      const chip = document.createElement("span");
      chip.classList.add("chip-insumo");
      chip.textContent = nombre;
      chip.dataset.nombre = nombre;
      contenedorResumen.appendChild(chip);
    });
  }

  document.getElementById("modal-insumos").style.display = "none";
});

async function abrirModalEditar(id) {
  productoActual = Object.values(productosData).flat().find(p => p.id === id);

  if (productoActual) {
    document.getElementById("editar-nombre").value = productoActual.nombre;
    document.getElementById("editar-precio").value = productoActual.precio;
    document.getElementById("editar-categoria").value = productoActual.categoria;
    document.getElementById("editar-descripcion").value = productoActual.descripcion || "";
    document.getElementById("imagen-actual").src = productoActual.imagen || "";
    document.getElementById("imagen-actual").dataset.url = productoActual.imagen || "";

    const resumen = document.getElementById("resumen-insumos-editar");
    resumen.innerHTML = "";
    productoActual.insumos.forEach(nombre => {
      const chip = document.createElement("span");
      chip.classList.add("chip-insumo");
      chip.textContent = nombre;
      resumen.appendChild(chip);
    });

    modalEditar.style.display = "flex";

    document.getElementById("guardar-btn").onclick = () => guardarCambiosProducto(productoActual.id);
  }
}

async function guardarCambiosProducto(idProducto) {
  const nombre = document.getElementById("editar-nombre").value.trim();
  const precio = parseFloat(document.getElementById("editar-precio").value);
  const categoria = parseInt(document.getElementById("editar-categoria").value);
  const descripcion = document.getElementById("editar-descripcion").value.trim();
  const imagen = document.getElementById("imagen-actual").dataset.url || "img/default.jpg";

  const chips = document.querySelectorAll("#resumen-insumos-editar .chip-insumo");
  const insumosSeleccionados = Array.from(chips).map(chip => chip.textContent);

  if (!nombre || isNaN(precio) || precio <= 0 || !categoria || insumosSeleccionados.length === 0) {
    alert("Por favor, completa todos los campos correctamente.");
    return;
  }

  const datosEditados = {
    id: idProducto,
    nombre,
    precio,
    categoriaId: categoria,
    descripcion,
    img_url: imagen,
    insumos: insumosSeleccionados
  };

  try {
    const res = await fetch(`http://localhost:7000/menu/${idProducto}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datosEditados)
    });

    if (res.ok) {
      alert("Producto actualizado correctamente");
      modalEditar.style.display = "none";
      cargarProductosDesdeAPI();
    } else {
      const errorText = await res.text();
      console.error("Respuesta del backend:", errorText);
      alert("Error al actualizar: " + errorText);

    }
  } catch (err) {
    console.error("Error al enviar datos editados:", err);
    alert("Error de conexión con el servidor");
  }
}

async function eliminarProducto(producto) {
  const confirmar = confirm(`¿Seguro que deseas eliminar "${producto.nombre}"?`);
  if (!confirmar) return;

  try {
    const res = await fetch(`http://localhost:7000/menu/${producto.id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      alert(`"${producto.nombre}" eliminado correctamente.`);
      cargarProductosDesdeAPI();
    } else {
      const error = await res.text();
      alert("Error al eliminar: " + error);
    }
  } catch (err) {
    console.error("Error al eliminar producto:", err);
    alert("No se pudo conectar con el servidor");
  }
}

document.getElementById("btn-elegir-insumos-editar").addEventListener("click", async () => {
  try {
    const res = await fetch("http://localhost:7000/insumos");
    const insumos = await res.json();
    const contenedor = document.getElementById("contenedor-insumos-modal");
    contenedor.innerHTML = "";

    insumos.forEach(insumo => {
      const label = document.createElement("label");
      label.classList.add("checkbox-option");
      label.innerHTML = `
        <input type="checkbox" value="${insumo.nombre}" ${productoActual.insumos?.includes(insumo.nombre) ? "checked" : ""
        }>
        ${insumo.nombre} (${insumo.presentacion} - ${insumo.unidad}, ${insumo.contenido})
      `;
      contenedor.appendChild(label);
    });

    document.getElementById("modal-insumos").style.display = "flex";

  } catch (err) {
    console.error("Error al abrir modal de insumos:", err);
  }
});
//--------------------------------------------------------------------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  cargarCategoriasDesdeAPI();
  cargarProductosDesdeAPI();
  cargarInsumosDesdeAPI();

  const formEditar = document.getElementById("form-editar");

  const insumosData = {
    promos: ["Pan dulce", "Medialunas", "Jugo"],
    cafe: ["Granos", "Leche", "Azúcar"],
    frappe: ["Hielo", "Crema batida", "Chocolate"],
    te: ["Té verde", "Té negro", "Limón"],
    postres: ["Harina", "Chocolate", "Frutas"]
  };

  let productoActual = null;
  let siguienteId = 3;

  formAgregar.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre = document.getElementById("agregar-nombre").value.trim();
    const precio = parseFloat(document.getElementById("agregar-precio").value);
    const categoria = document.getElementById("agregar-categoria").value;
    const descripcion = document.getElementById("agregar-descripcion").value.trim();
    const imagenFinal = imagenSeleccionadaURL || "img/default.jpg";

    if (!nombre || isNaN(precio) || !categoria || insumosSeleccionados.length === 0) {
      document.getElementById("error-general").style.display = "block";
      return;
    } else {
      document.getElementById("error-general").style.display = "none";
    }

    const data = {
      nombre,
      precio,
      categoriaId: parseInt(categoria),
      descripcion,
      insumos: insumosSeleccionados,
      img_url: imagenFinal
    };

    try {
      const res = await fetch("http://localhost:7000/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        alert("Producto registrado correctamente");
        modalAgregar.style.display = "none";
        await cargarProductosDesdeAPI();
        mostrarProductos(categoria);
      } else {
        const error = await res.text();
        alert("Error al registrar producto: " + error);
      }
    } catch (err) {
      console.error("Error al enviar datos:", err);
      alert("Error de conexión con el servidor");
    }
  });

  formEditar.addEventListener("submit", function (e) {
    e.preventDefault();
    if (productoActual) {
      productoActual.nombre = document.getElementById("editar-nombre").value;
      productoActual.precio = parseFloat(document.getElementById("editar-precio").value);
      productoActual.categoria = document.getElementById("editar-categoria").value;

      const checkboxes = document.querySelectorAll("#editar-insumos input[type='checkbox']");
      const nuevosInsumos = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
      productoActual.insumos = nuevosInsumos;

      productoActual.descripcion = document.getElementById("editar-descripcion").value.trim();

      const imgPreview = document.getElementById("imagen-actual");
      const nuevaImgUrl = imgPreview.dataset.url;
      if (nuevaImgUrl) {
        productoActual.imagen = nuevaImgUrl;
      }

      modalEditar.style.display = "none";
      mostrarProductos(productoActual.categoria);
    }
  });

  let imagenSeleccionadaURL = "";

  document.getElementById("agregar-imagen").addEventListener("change", async function () {
    const file = this.files[0];
    const preview = document.getElementById("imagen-agregar");

    if (file) {
      const cloudinaryURL = await subirImagenACloudinary(file);

      if (cloudinaryURL) {
        imagenSeleccionadaURL = cloudinaryURL;
        preview.src = cloudinaryURL;
        preview.style.display = "block";
        preview.dataset.url = cloudinaryURL;
        document.getElementById("estado-upload").textContent = "Imagen subida correctamente";
        document.getElementById("estado-upload").style.color = "green";
      } else {
        document.getElementById("estado-upload").textContent = "Error al subir imagen";
        document.getElementById("estado-upload").style.color = "red";
      }
    }
  });

  document.getElementById("editar-imagen").addEventListener("change", async function () {
    const file = this.files[0];
    const preview = document.getElementById("imagen-actual");
    const estado = document.getElementById("estado-upload-editar");

    if (file) {
      estado.textContent = "Subiendo imagen...";
      estado.style.color = "orange";
      estado.style.display = "block";

      const cloudinaryURL = await subirImagenACloudinary(file);

      if (cloudinaryURL) {
        preview.src = cloudinaryURL;
        preview.dataset.url = cloudinaryURL;
        preview.style.display = "block";

        estado.textContent = "Imagen subida correctamente";
        estado.style.color = "green";
      } else {
        estado.textContent = "Error al subir imagen";
        estado.style.color = "red";
      }
    }
  });

  document.querySelectorAll(".cerrar-modal").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.closest(".modal").style.display = "none";
    });
  });

  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      e.target.style.display = "none";
    }
  });

  botonesCategorias.forEach(btn => {
    btn.addEventListener("click", () => mostrarProductos(btn.dataset.categoria));
  });

  mostrarProductos("promos");
});
