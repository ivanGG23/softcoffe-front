document.addEventListener("DOMContentLoaded", () => {
  const contenedorProductos = document.getElementById("contenedor-productos");
  const modalEditar = document.getElementById("modal-editar");
  const modalAgregar = document.getElementById("modal-agregar");
  const formEditar = document.getElementById("form-editar");
  const formAgregar = document.getElementById("form-agregar");
  const botonesCategorias = document.querySelectorAll("nav button");


  const productosData = {
    promos: [
      {
        id: 1,
        nombre: "Combo Desayuno",
        precio: 120,
        imagen: "img/promo1.jpg",
        descripcion: "Café + Pan dulce",
        categoria: "promos"
      },
      {
        id: 2,
        nombre: "Promo Merienda",
        precio: 75,
        imagen: "img/promo2.jpg",
        descripcion: "Café + 2 medialunas",
        categoria: "promos"
      }
    ]
  };


  let productoActual = null;
  let siguienteId = 3;


  function mostrarProductos(categoria) {
    contenedorProductos.innerHTML = "";
    botonesCategorias.forEach(btn => {
      btn.classList.remove("active");
      if (btn.dataset.categoria === categoria) {
        btn.classList.add("active");
      }
    });


    if (productosData[categoria]) {
      productosData[categoria].forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.dataset.id = producto.id;
        div.innerHTML = `
          <img src="${producto.imagen}" class="imagen-producto" alt="${producto.nombre}">
          <h3>${producto.nombre}</h3>
          <p>$${producto.precio}</p>
          <div class="acciones">
            <button class="editar-btn" data-id="${producto.id}"><i class="fa-solid fa-pen-to-square"></i> Editar</button>
            <button class="eliminar-producto" data-id="${producto.id}"><i class="fa-solid fa-trash"></i> Eliminar</button>
          </div>`;


        div.querySelector(".editar-btn").addEventListener("click", () => abrirModalEditar(producto.id));
        div.querySelector(".eliminar-producto").addEventListener("click", () => eliminarProducto(producto));


        contenedorProductos.appendChild(div);
      });
    }


    agregarBotonAgregar();
  }


  function agregarBotonAgregar() {
    const agregar = document.createElement("div");
    agregar.classList.add("producto", "agregar");
    agregar.innerHTML = `<i class="fa-solid fa-plus"></i><p>Agregar Producto</p>`;
    agregar.addEventListener("click", () => {
      formAgregar.reset();
      modalAgregar.style.display = "flex";
    });
    contenedorProductos.appendChild(agregar);
  }


  function abrirModalEditar(id) {
    productoActual = Object.values(productosData).flat().find(p => p.id === id);
    if (productoActual) {
      document.getElementById("editar-nombre").value = productoActual.nombre;
      document.getElementById("editar-precio").value = productoActual.precio;
      document.getElementById("editar-categoria").value = productoActual.categoria;
      modalEditar.style.display = "flex";
    }
  }


  function eliminarProducto(producto) {
    const index = productosData[producto.categoria].indexOf(producto);
    if (index !== -1) {
      productosData[producto.categoria].splice(index, 1);
      mostrarProductos(producto.categoria);
    }
  }


formAgregar.addEventListener("submit", async function(e) {
  e.preventDefault();
  const nombre = document.getElementById("agregar-nombre").value.trim();
  const precio = parseFloat(document.getElementById("agregar-precio").value);
  const categoria = document.getElementById("agregar-categoria").value;


  const producto = {
    nombre,
    precio,
    categoria,
    imagen: "img/default.jpg" // o más adelante con AWS S3
  };


  try {
    const res = await fetch("http://localhost:7000/producto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(producto)
    });


    if (res.ok) {
      alert("Producto guardado en la base de datos");
      modalAgregar.style.display = "none";
      mostrarProductos(categoria); // actualiza la vista
    } else {
      alert("Error al guardar el producto");
    }
  } catch (err) {
    console.error("Error en fetch:", err);
    alert("Error en la conexión con el servidor");
  }
});




  formEditar.addEventListener("submit", function(e) {
    e.preventDefault();
    if (productoActual) {
      productoActual.nombre = document.getElementById("editar-nombre").value;
      productoActual.precio = parseFloat(document.getElementById("editar-precio").value);
      productoActual.categoria = document.getElementById("editar-categoria").value;
      modalEditar.style.display = "none";
      mostrarProductos(productoActual.categoria);
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
