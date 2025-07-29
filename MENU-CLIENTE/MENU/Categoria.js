document.addEventListener('DOMContentLoaded', () => { 
  document.querySelector('.close-button').addEventListener('click', cerrarModal);

  // Datos de productos
  function cargarProductosDesdeAPI(categoria) {
    fetch(`http://98.86.13.209:7000/productos/categoria/${categoria}`)
      .then(res => res.json())
      .then(productos => renderizarProductosDesdeAPI(productos))
      .catch(error => {
        console.error('Error al cargar productos:', error);
        mostrarNotificacion('No se pudieron cargar los productos');
      });
  }

  function agregarAlCarrito(e) {
    const productCard = e.target.closest('.product-card');
    const productId = parseInt(productCard.dataset.id);
    const nombre = productCard.querySelector('.product-title')?.textContent;
    const precio = parseFloat(productCard.querySelector('.product-price')?.textContent.replace('$', ''));
    const imagen = productCard.querySelector('img')?.getAttribute('src');
    const productQty = 1;

    if (!nombre || isNaN(precio) || isNaN(productId)) return;

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
        nombre,
        precio,
        imagen,
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

  const contenedorProductos = document.querySelector('.catalogo-grid');
  function renderizarProductosDesdeAPI(productos) {
    contenedorProductos.innerHTML = productos.map(producto => `
      <div class="product-card" data-id="${producto.id}">
        <img src="${producto.img_url}" alt="${producto.nombre}" class="product-img" />
        <h3 class="product-title">${producto.nombre}</h3>
        <p class="product-description">${producto.descripcion}</p>
        <strong class="product-price">$${producto.precio.toFixed(2)}</strong>
        <button class="add-to-cart">Agregar al carrito</button>
      </div>
    `).join('');

    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', agregarAlCarrito);
    });
  }

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

  botonesCategorias.forEach(boton => {
    boton.addEventListener('click', function () {
      botonesCategorias.forEach(btn => btn.classList.remove('selected'));
      this.classList.add('selected');
      const categoria = this.dataset.categoria;
      cargarProductosDesdeAPI(categoria);
    });
  });

  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  cargarProductosDesdeAPI('promociones');
  actualizarCarrito();

  cartIcon.addEventListener('click', () => {
    cartModal.classList.add('active');
  });

  closeCartBtn.addEventListener('click', () => {
    cartModal.classList.remove('active');
  });

  checkoutBtn.addEventListener('click', () => {
    if (carrito.length > 0) {
      cartModal.classList.remove('active');
      clientNameModal.classList.add('active');
      clientNameInput.focus();
    } else {
      mostrarNotificacion('El carrito está vacío');
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

  confirmClientNameBtn.addEventListener('click', () => {
    const nombreCliente = clientNameInput.value.trim();
    const metodoPago = document.querySelector('input[name="metodoPago"]:checked')?.value;

    if (nombreCliente.split(' ').length < 2) {
      mostrarNotificacion('Por favor ingresa nombre y apellido');
      return;
    }

    const totalPedido = calcularTotal();
    if (carrito.length === 0 || totalPedido <= 0) {
      mostrarNotificacion('Tu carrito está vacío');
      return;
    }

    fetch('http://98.86.13.209:7000/pedido', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clienteNombre: nombreCliente,
        metodoPago,
        carrito,
        total: totalPedido
      })
    })
      .then(res => res.json())
      .then(data => {
        const numCliente = data.numCliente;
        const numTicket = data.numTicket;
        const mensaje = data.mensaje;

        mostrarNotificacion(mensaje);
        procesarPedido(nombreCliente, numCliente, numTicket, metodoPago);
        document.getElementById("modal-ticket").style.display = "block";

        carrito = [];
        actualizarCarrito();
        clientNameModal.classList.remove('active');
        clientNameInput.value = '';
      })
      .catch(error => {
        console.error('Error:', error);
        mostrarNotificacion('No se pudo conectar con el servidor');
      });
  });

  declineCancelBtn.addEventListener('click', () => {
    cancelConfirmModal.classList.remove('active');
    clientNameModal.classList.add('active');
  });

  document.addEventListener('click', (e) => {
    if (e.target === clientNameModal) {
      clientNameModal.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && clientNameModal.classList.contains('active')) {
      clientNameModal.classList.remove('active');
    }
  });

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

  function procesarPedido(nombreCliente, numCliente, numTicket, metodoPago) {
    const total = calcularTotal();
    const fecha = new Date().toLocaleString();

    let ticket = `
==============================
       TICKET DE COMPRA       
==============================
Cliente: ${nombreCliente}
Fecha: ${fecha}

Método de pago: ${capitalize(metodoPago)}

Artículos:
`;

    carrito.forEach(item => {
      ticket += `- ${item.nombre} x${item.cantidad} = $${(item.precio * item.cantidad).toFixed(2)}\n`;
    });

    ticket += `
------------------------------
TOTAL: $${total.toFixed(2)}
==============================
  ¡Gracias por su compra! 🛍️
==============================
`;

    document.getElementById('contenido-ticket').textContent = ticket;
    document.getElementById('modal-ticket').style.display = 'block';
  }

  function cerrarModal() {
    document.getElementById('modal-ticket').style.display = 'none';
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
