function imprimirTicket() {
  const contenido = document.getElementById('contenido-ticket');
  if (!contenido.textContent.trim()) {
    mostrarNotificacion('No hay contenido para imprimir');
    return;
  }

  // Asegura que el modal esté visible
  document.getElementById('modal-ticket').style.display = 'block';

  // Lanza impresión directa
  setTimeout(() => {
    window.print();
  }, 300);
}