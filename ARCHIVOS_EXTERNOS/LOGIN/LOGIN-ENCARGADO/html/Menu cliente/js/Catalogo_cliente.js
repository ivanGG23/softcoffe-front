document.addEventListener('DOMContentLoaded', function() {
  // Datos de productos
  const productos = {
    promos: [
      { id: 1, nombre: "Americano Promo", precio: 60.00, imagen: "assets/productos/americano.png" },
      { id: 2, nombre: "Espresso Promo", precio: 55.00, imagen: "assets/productos/espresso.png" },
      { id: 3, nombre: "Galleta de coco", precio: 15.00, imagen: "assets/productos/coco.png" }
    ],
    cafe: [
      { id: 4, nombre: "Americano", precio: 65.00, imagen: "assets/productos/americano.png" },
      { id: 5, nombre: "Espresso", precio: 65.00, imagen: "assets/productos/espresso.png" },
      { id: 6, nombre: "Capuchino", precio: 40.00, imagen: "assets/productos/capuchino.png" }
    ],
    frappe: [
      { id: 7, nombre: "Frappe Oreo", precio: 80.00, imagen: "assets/productos/frappe-Oreo.png" },
      { id: 8, nombre: "Frappe Caramelo", precio: 80.00, imagen: "assets/productos/frappe-caramelo.png" }
    ],
    te: [
      { id: 9, nombre: "Té Verde", precio: 50.00, imagen: "assets/productos/teverde.png" },
      { id: 10, nombre: "Té Manzanilla", precio: 50.00, imagen: "assets/productos/temanzanilla.png" }
    ],
    postres: [
      { id: 11, nombre: "Pastel de zanahoria", precio: 70.00, imagen: "assets/productos/pastelzanahoria.png" },
      { id: 12, nombre: "Cheesecake", precio: 75.00, imagen: "assets/productos/cheesecake.png" }
    ]
  };

  // Variables del DOM
  const contenedorProductos = document.querySelector('.catalogo-grid');
  const botonesCategorias = document.querySelectorAll('.categorias button');
  const cartCounter = document.querySelector('.cart-counter');
  const cartIcon = document.getElementById('carrito-icono');
  const cartModal = document.querySelector('.cart-modal');
  const closeCartBtn = document.querySelector('.close-cart');
  const cartItemsContainer = document.querySelector('.cart-items');
  const totalPriceElement = document.querySelector('.total-price');
  const checkoutBtn = document.querySelector('.checkout-btn');
  const clientNameModal = document.querySelector('.client-name-modal');
  const clientNameInput = document.querySelector('.client-name-input');
  const confirmClientNameBtn = document.querySelector('.confirm-client-name');
  const cancelClientNameBtn = document.querySelector('.cancel-client-name');
  const cancelConfirmModal = document.querySelector('.cancel-confirm-modal');
  const confirmCancelBtn = document.querySelector('.confirm-cancel');
  const declineCancelBtn = document.querySelector('.decline-cancel');


  // Estado del carrito
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  // Inicialización
  renderizarProductos('promos');
  actualizarCarrito();

  // Eventos de categorías
  botonesCategorias.forEach(boton => {
    boton.addEventListener('click', function() {
      botonesCategorias.forEach(btn => btn.classList.remove('selected'));
      this.classList.add('selected');
      renderizarProductos(this.dataset.categoria);
    });
  });

  // Eventos del carrito
  cartIcon.addEventListener('click', () => {
    cartModal.classList.add('active');
  });

  closeCartBtn.addEventListener('click', () => {
    cartModal.classList.remove('active');
  });

  // Evento para realizar pedido (CORREGIDO)
  checkoutBtn.addEventListener('click', () => {
    if (carrito.length > 0) {
      cartModal.classList.remove('active');
      clientNameModal.classList.add('active'); // Mostrar modal del nombre
      clientNameInput.focus();
    } else {
      mostrarNotificacion('El carrito está vacío');
    }
  });

  // Evento para confirmar nombre del cliente (CORREGIDO)
  confirmClientNameBtn.addEventListener('click', () => {
  const nombreCliente = clientNameInput.value.trim();

  if (nombreCliente && nombreCliente.split(' ').length >= 2) {
    procesarPedido(nombreCliente);
    mostrarNotificacion(`Su pedido se ha realizado a nombre de: ${nombreCliente}`);
    carrito = [];
    actualizarCarrito();
    clientNameModal.classList.remove('active');
    clientNameInput.value = '';
  } else {
    mostrarNotificacion('Por favor ingresa nombre y apellido');
  }
});

  cancelClientNameBtn.addEventListener('click', () => {
  clientNameModal.classList.remove('active');
  cancelConfirmModal.classList.add('active');
});

confirmCancelBtn.addEventListener('click', () => {
  cancelConfirmModal.classList.remove('active');
  clientNameInput.value = '';
});

declineCancelBtn.addEventListener('click', () => {
  cancelConfirmModal.classList.remove('active');
  clientNameModal.classList.add('active');
});


  // Cerrar modal al hacer clic fuera (CORREGIDO)
  document.addEventListener('click', (e) => {
    if (e.target === clientNameModal) {
      clientNameModal.classList.remove('active');
    }
  });

  // Cerrar modal con ESC (CORREGIDO)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && clientNameModal.classList.contains('active')) {
      clientNameModal.classList.remove('active');
    }
  });

  // Funciones principales
  function renderizarProductos(categoria) {
    const productosMostrar = productos[categoria] || [];
    contenedorProductos.innerHTML = productosMostrar.map(producto => `
      <div class="product-card" data-id="${producto.id}">
        <img src="${producto.imagen}" alt="${producto.nombre}" class="product-img" />
        <h3 class="product-title">${producto.nombre}</h3>
        <strong class="product-price">$${producto.precio.toFixed(2)}</strong>
        <div class="quantity-control">
          <button class="qty-btn minus"><i class="fas fa-minus"></i></button>
          <input type="number" value="1" min="1" class="qty-input" />
          <button class="qty-btn plus"><i class="fas fa-plus"></i></button>
        </div>
        <button class="add-to-cart">Agregar al carrito</button>
      </div>
    `).join('');

    // Agregar eventos a los productos
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', agregarAlCarrito);
    });
    
    document.querySelectorAll('.qty-btn.minus').forEach(btn => {
      btn.addEventListener('click', disminuirCantidad);
    });
    
    document.querySelectorAll('.qty-btn.plus').forEach(btn => {
      btn.addEventListener('click', aumentarCantidad);
    });
  }

  function agregarAlCarrito(e) {
    const productCard = e.target.closest('.product-card');
    const productId = parseInt(productCard.dataset.id);
    const productQty = parseInt(productCard.querySelector('.qty-input').value);

    if (isNaN(productQty)) return;

    let product;
    for (const categoria in productos) {
      product = productos[categoria].find(p => p.id === productId);
      if (product) break;
    }
    if (!product) return;

    const tamaño = document.querySelector('input[name="tamaño"]:checked')?.value || '';
    const leche = document.querySelector('input[name="leches"]:checked')?.value || '';
    const azucar = document.querySelector('input[name="azucar"]:checked')?.value || '';
    const extras = [];

    document.querySelectorAll('input[name="crema"]:checked, input[name="canela"]:checked, input[name="malvaviscos"]:checked').forEach(checkbox => {
      extras.push(checkbox.name);
    });

    const existingItemIndex = carrito.findIndex(item =>
      item.id === productId &&
      item.tamaño === tamaño &&
      item.leche === leche &&
      item.azucar === azucar &&
      JSON.stringify(item.extras) === JSON.stringify(extras)
    );

    if (existingItemIndex >= 0) {
      carrito[existingItemIndex].cantidad += productQty;
    } else {
      carrito.push({
        id: productId,
        nombre: product.nombre,
        precio: product.precio,
        imagen: product.imagen,
        cantidad: productQty,
        tamaño,
        leche,
        azucar,
        extras
      });
    }

    actualizarCarrito();
    mostrarNotificacion('¡Producto agregado al carrito!');
  }

  function actualizarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    cartCounter.textContent = totalItems;
    cartCounter.style.display = totalItems > 0 ? 'flex' : 'none';
    renderizarCarrito();
  }

  function renderizarCarrito() {
    cartItemsContainer.innerHTML = carrito.length > 0 ? 
      carrito.map((item, index) => `
        <div class="cart-item">
          <img src="${item.imagen}" alt="${item.nombre}" />
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.nombre}</h4>
            ${item.tamaño ? `<p>Tamaño: ${capitalize(item.tamaño)}</p>` : ''}
            ${item.leche ? `<p>Leche: ${capitalize(item.leche)}</p>` : ''}
            ${item.azucar ? `<p>Azúcar: ${capitalize(item.azucar)}</p>` : ''}
            ${item.extras.length > 0 ? `<p>Extras: ${item.extras.map(e => capitalize(e)).join(', ')}</p>` : ''}
            <div class="cart-item-qty">
              <button class="qty-btn minus" data-index="${index}"><i class="fas fa-minus"></i></button>
              <span>${item.cantidad}</span>
              <button class="qty-btn plus" data-index="${index}"><i class="fas fa-plus"></i></button>
            </div>
          </div>
          <div>
            <span class="cart-item-price">$${(item.precio * item.cantidad).toFixed(2)}</span>
            <button class="cart-item-remove" data-index="${index}"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      `).join('') : 
      '<p class="empty-cart">Tu carrito está vacío</p>';

    const total = calcularTotal();
    totalPriceElement.textContent = `$${total.toFixed(2)}`;

    // Eventos para los elementos del carrito
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', eliminarDelCarrito);
    });
    
    document.querySelectorAll('.cart-item .qty-btn.minus').forEach(btn => {
      btn.addEventListener('click', disminuirCantidadCarrito);
    });
    
    document.querySelectorAll('.cart-item .qty-btn.plus').forEach(btn => {
      btn.addEventListener('click', aumentarCantidadCarrito);
    });
  }

  function procesarPedido(nombreCliente) {
    // Aquí puedes enviar el pedido a tu backend o hacer lo que necesites
    console.log('Pedido realizado:', {
      cliente: nombreCliente,
      items: carrito,
      total: calcularTotal()
    });
  }

  function eliminarDelCarrito(e) {
    const index = parseInt(e.target.closest('button').dataset.index);
    carrito.splice(index, 1);
    actualizarCarrito();
  }

  function aumentarCantidad(e) {
    const input = e.target.closest('.quantity-control').querySelector('.qty-input');
    input.value = parseInt(input.value) + 1;
  }

  function disminuirCantidad(e) {
    const input = e.target.closest('.quantity-control').querySelector('.qty-input');
    if (parseInt(input.value) > 1) {
      input.value = parseInt(input.value) - 1;
    }
  }

  function aumentarCantidadCarrito(e) {
    const index = parseInt(e.target.closest('button').dataset.index);
    carrito[index].cantidad += 1;
    actualizarCarrito();
  }

  function disminuirCantidadCarrito(e) {
    const index = parseInt(e.target.closest('button').dataset.index);
    if (carrito[index].cantidad > 1) {
      carrito[index].cantidad -= 1;
    } else {
      carrito.splice(index, 1);
    }
    actualizarCarrito();
  }

  function calcularTotal() {
    return carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  }

  function mostrarNotificacion(mensaje) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = mensaje;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  function capitalize(texto) {
    return texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : '';
  }
});