document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const contenedorProductos = document.getElementById("contenedor-productos");
  const modalEditar = document.getElementById("modal-editar");
  const modalAgregar = document.getElementById("modal-agregar");
  const formEditar = document.getElementById("form-editar");
  const formAgregar = document.getElementById("form-agregar");
  const botonesCategorias = document.querySelectorAll("nav button");
  
  // Base de datos de productos
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
    ],
    cafe: [
      { 
        id: 3,
        nombre: "Americano", 
        precio: 35, 
        imagen: "img/cafe1.jpg",
        descripcion: "Café negro americano",
        categoria: "cafe"
      },
      { 
        id: 4,
        nombre: "Capuchino", 
        precio: 40, 
        imagen: "img/cafe2.jpg",
        descripcion: "Café con leche espumosa",
        categoria: "cafe"
      }
    ],
    frappe: [
      { 
        id: 5,
        nombre: "Frappe Vainilla", 
        precio: 50, 
        imagen: "img/frappe1.jpg",
        descripcion: "Frappé de vainilla con crema",
        categoria: "frappe"
      },
      { 
        id: 6,
        nombre: "Frappe Oreo", 
        precio: 55, 
        imagen: "img/frappe2.jpg",
        descripcion: "Frappé con trozos de galleta Oreo",
        categoria: "frappe"
      }
    ],
    te: [
      { 
        id: 7,
        nombre: "Té Verde", 
        precio: 30, 
        imagen: "img/te1.jpg",
        descripcion: "Té verde tradicional",
        categoria: "te"
      },
      { 
        id: 8,
        nombre: "Té Negro", 
        precio: 30, 
        imagen: "img/te2.jpg",
        descripcion: "Té negro inglés",
        categoria: "te"
      }
    ],
    postres: [
      { 
        id: 9,
        nombre: "Brownie", 
        precio: 45, 
        imagen: "img/postre1.jpg",
        descripcion: "Brownie de chocolate con nueces",
        categoria: "postres"
      },
      { 
        id: 10,
        nombre: "Pastel de Queso", 
        precio: 50, 
        imagen: "img/postre2.jpg",
        descripcion: "Cheesecake estilo Nueva York",
        categoria: "postres"
      }
    ]
  };

  // Variables de estado
  let productoActual = null;
  let siguienteId = 11; // Comenzar después del último ID existente

  // Función para mostrar productos
  function mostrarProductos(categoria) {
    contenedorProductos.innerHTML = "";
    
    // Actualizar botones activos
    botonesCategorias.forEach(btn => {
      btn.classList.remove("active");
      if (btn.dataset.categoria === categoria) {
        btn.classList.add("active");
      }
    });

    // Mostrar productos de la categoría seleccionada
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
            <button class="editar-btn" data-id="${producto.id}">
              <i class="fa-solid fa-pen-to-square"></i> Editar
            </button>
            <button class="eliminar-producto" data-id="${producto.id}">
              <i class="fa-solid fa-trash"></i> Eliminar
            </button>
          </div>
        `;
        
        // Event listeners para los botones
        div.querySelector(".editar-btn").addEventListener("click", (e) => {
          e.stopPropagation();
          abrirModalEditar(producto.id);
        });

        div.querySelector(".eliminar-producto").addEventListener("click", (e) => {
          e.stopPropagation();
          if (confirm("¿Estás seguro de eliminar este producto?")) {
            div.style.animation = "fadeOut 0.5s ease forwards";
            setTimeout(() => {
              const index = productosData[producto.categoria].findIndex(p => p.id === producto.id);
              if (index !== -1) {
                productosData[producto.categoria].splice(index, 1);
              }
              div.remove();
            }, 500);
          }
        });

        contenedorProductos.appendChild(div);
      });
    }

    // Agregar botón de añadir producto
    agregarBotonAgregar();
  }

  // Función para agregar botón "Agregar Producto"
  function agregarBotonAgregar() {
    const agregar = document.createElement("div");
    agregar.classList.add("producto", "agregar");
    agregar.innerHTML = `
      <i class="fa-solid fa-plus"></i>
      <p>Agregar Producto</p>
    `;
    
    agregar.addEventListener("click", () => {
      formAgregar.reset();
      document.getElementById("imagen-agregar").style.display = "none";
      document.getElementById("file-status").textContent = "Sin archivo seleccionado";
      document.querySelectorAll(".error-message").forEach(el => el.classList.remove("show"));
      document.querySelectorAll(".input-editar").forEach(el => el.classList.remove("error"));
      document.getElementById("error-general").style.display = "none";
      modalAgregar.style.display = "block";
    });
    
    contenedorProductos.appendChild(agregar);
  }

  // Función para abrir modal de edición
  function abrirModalEditar(id) {
    productoActual = Object.values(productosData).flat().find(p => p.id === id);
    
    if (productoActual) {
      document.getElementById("editar-nombre").value = productoActual.nombre;
      document.getElementById("editar-precio").value = productoActual.precio;
      document.getElementById("editar-categoria").value = productoActual.categoria;
      document.getElementById("imagen-actual").src = productoActual.imagen;
      document.getElementById("imagen-actual").style.display = "block";
      document.getElementById("editar-imagen").value = "";
      
      modalEditar.style.display = "block";
    }
  }

  // Vista previa de imagen al agregar
  document.getElementById("agregar-imagen").addEventListener("change", function(e) {
    const fileStatus = document.getElementById("file-status");
    const errorImagen = document.getElementById("error-imagen");
    
    if (this.files.length > 0) {
      const file = this.files[0];
      if (!file.type.match("image.*")) {
        errorImagen.classList.add("show");
        return;
      }
      
      fileStatus.textContent = file.name;
      errorImagen.classList.remove("show");
      
      const reader = new FileReader();
      reader.onload = function(event) {
        const img = document.getElementById("imagen-agregar");
        img.src = event.target.result;
        img.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      fileStatus.textContent = "Sin archivo seleccionado";
      document.getElementById("imagen-agregar").style.display = "none";
    }
  });

  // Vista previa de imagen al editar
  document.getElementById("editar-imagen").addEventListener("change", function(e) {
    if (this.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function(event) {
        document.getElementById("imagen-actual").src = event.target.result;
      };
      reader.readAsDataURL(this.files[0]);
    }
  });

  // Validación al enviar el formulario de agregar
  formAgregar.addEventListener("submit", function(e) {
    e.preventDefault();
    
    // Resetear mensajes de error
    document.querySelectorAll(".error-message").forEach(el => {
      el.classList.remove("show");
    });
    document.querySelectorAll(".input-editar").forEach(el => {
      el.classList.remove("error");
    });
    document.getElementById("error-general").style.display = "none";

    // Obtener valores
    const nombre = document.getElementById("agregar-nombre").value.trim();
    const precio = document.getElementById("agregar-precio").value;
    const categoria = document.getElementById("agregar-categoria").value;
    const imagenInput = document.getElementById("agregar-imagen");
    
    let isValid = true;

    // Validar nombre
    if (!nombre) {
      document.getElementById("error-nombre").classList.add("show");
      document.getElementById("agregar-nombre").classList.add("error");
      isValid = false;
    }

    // Validar precio
    if (!precio || isNaN(precio) || parseFloat(precio) <= 0) {
      document.getElementById("error-precio").classList.add("show");
      document.getElementById("agregar-precio").classList.add("error");
      isValid = false;
    }

    // Validar categoría
    if (!categoria) {
      document.getElementById("error-categoria").classList.add("show");
      document.getElementById("agregar-categoria").classList.add("error");
      isValid = false;
    }

    // Validar imagen
    if (imagenInput.files.length === 0) {
      document.getElementById("error-imagen").classList.add("show");
      isValid = false;
    } else if (!imagenInput.files[0].type.match("image.*")) {
      document.getElementById("error-imagen").classList.add("show");
      isValid = false;
    }

    // Mostrar error general si hay campos inválidos
    if (!isValid) {
      document.getElementById("error-general").style.display = "block";
      return;
    }

    // Si todo es válido, proceder a crear el producto
    const reader = new FileReader();
    reader.onload = function(e) {
      const nuevoProducto = {
        id: siguienteId++,
        nombre: nombre,
        precio: parseFloat(precio),
        imagen: e.target.result,
        descripcion: "Nuevo producto agregado",
        categoria: categoria
      };
      
      // Agregar a la categoría correspondiente
      if (!productosData[categoria]) {
        productosData[categoria] = [];
      }
      productosData[categoria].push(nuevoProducto);
      
      // Actualizar vista
      mostrarProductos(categoria);
      modalAgregar.style.display = "none";
      alert("Producto creado correctamente");
    };
    reader.readAsDataURL(imagenInput.files[0]);
  });

  // Guardar cambios al editar
  formEditar.addEventListener("submit", function(e) {
    e.preventDefault();
    
    if (productoActual) {
      // Actualizar datos del producto
      productoActual.nombre = document.getElementById("editar-nombre").value;
      productoActual.precio = parseFloat(document.getElementById("editar-precio").value);
      productoActual.categoria = document.getElementById("editar-categoria").value;
      
      // Actualizar imagen si se seleccionó una nueva
      const imagenInput = document.getElementById("editar-imagen");
      if (imagenInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
          productoActual.imagen = e.target.result;
          actualizarVista();
        };
        reader.readAsDataURL(imagenInput.files[0]);
      } else {
        actualizarVista();
      }
      
      function actualizarVista() {
        mostrarProductos(productoActual.categoria);
        modalEditar.style.display = "none";
        alert("Producto actualizado correctamente");
      }
    }
  });

  // Cerrar modales
  document.querySelectorAll(".cerrar-modal").forEach(btn => {
    btn.addEventListener("click", function() {
      this.closest(".modal").style.display = "none";
    });
  });

  // Cerrar al hacer click fuera del modal
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      e.target.style.display = "none";
    }
  });

  // Event listeners para los botones de categoría
  botonesCategorias.forEach(btn => {
    btn.addEventListener("click", function() {
      mostrarProductos(this.dataset.categoria);
    });
  });

  // Inicialización
  mostrarProductos('promos');
});