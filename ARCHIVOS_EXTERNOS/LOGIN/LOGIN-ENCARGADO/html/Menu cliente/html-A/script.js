const btnAgregar = document.querySelector('.btn-agregar');
const modal = document.getElementById('modalAgregar');
const cerrarBtn = document.getElementById('cerrarModal');
const form = document.getElementById('formAgregarUsuario');
const confirmacion = document.getElementById('ventanaConfirmacion');
const btnNo = document.getElementById('btnNo');
const btnSi = document.getElementById('btnSi');
const ventanaExito = document.getElementById('ventanaExito');
const confirmacionEliminar = document.getElementById('confirmacionEliminar');
const btnEliminarSi = document.getElementById('btnEliminarSi');
const btnEliminarNo = document.getElementById('btnEliminarNo');
const userTable = document.getElementById('userTable');
const submitBtn = form.querySelector('button[type="submit"]');

const API_URL = 'http://98.86.13.209:7000/usuarios';

let modoEdicion = false;
let usuarioEditandoId = null;

function renderTabla(usuarios) {
    userTable.innerHTML = '';
    usuarios.forEach((usuario, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${usuario.nombre} ${usuario.apellidos}</td>
      <td>
        <button class="btn-editar" data-id="${usuario.id}">Editar</button>
        <button class="btn-eliminar" data-id="${usuario.id}">Eliminar</button>
      </td>
    `;
        userTable.appendChild(tr);
    });

    // Acción del botón Editar
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            const usuario = await obtenerUsuarioPorId(id);
            if (usuario) {
                document.getElementById('nombre').value = usuario.nombre;
                document.getElementById('apellidos').value = usuario.apellidos;
                document.getElementById('telefono').value = usuario.telefono;
                document.getElementById('direccion').value = usuario.direccion;
                document.getElementById('tipoEmpleado').value = usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1);
                document.getElementById('contrasena').value = usuario.contraseña;

                modoEdicion = true;
                usuarioEditandoId = id;
                submitBtn.textContent = 'Guardar Cambios';
                modal.style.display = 'flex';
            }
        });
    });

    // Acción del botón Eliminar
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', () => {
            usuarioEditandoId = btn.dataset.id;
            confirmacionEliminar.style.display = 'flex';
        });
    });
}

btnAgregar.addEventListener('click', () => {
    form.reset();
    modoEdicion = false;
    usuarioEditandoId = null;
    submitBtn.textContent = 'Crear Usuario';
    modal.style.display = 'flex';
});

cerrarBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
    if (e.target === confirmacion) confirmacion.style.display = 'none';
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const nombre = document.getElementById('nombre');
    const apellidos = document.getElementById('apellidos');
    const telefono = document.getElementById('telefono');
    const direccion = document.getElementById('direccion');
    const tipoEmpleado = document.getElementById('tipoEmpleado');
    const contrasena = document.getElementById('contrasena');

    document.querySelectorAll('.error').forEach(span => span.textContent = '');
    document.querySelectorAll('input, select').forEach(elem => elem.classList.remove('input-error'));

    if (nombre.value.trim() === '') {
        document.getElementById('errorNombre').textContent = 'El nombre es obligatorio.';
        nombre.classList.add('input-error');
        valid = false;
    }
    if (apellidos.value.trim() === '') {
        document.getElementById('errorApellidos').textContent = 'Los apellidos son obligatorios.';
        apellidos.classList.add('input-error');
        valid = false;
    }
    if (telefono.value.trim() === '') {
        document.getElementById('errorTelefono').textContent = 'El teléfono es obligatorio.';
        telefono.classList.add('input-error');
        valid = false;
    }
    if (direccion.value.trim() === '') {
        document.getElementById('errorDireccion').textContent = 'La dirección es obligatoria.';
        direccion.classList.add('input-error');
        valid = false;
    }
    if (tipoEmpleado.value === '') {
        document.getElementById('errorTipo').textContent = 'Seleccione el tipo de empleado.';
        tipoEmpleado.classList.add('input-error');
        valid = false;
    }
    if (contrasena.value.trim() === '') {
        document.getElementById('errorContrasena').textContent = 'La contraseña es obligatoria.';
        contrasena.classList.add('input-error');
        valid = false;
    }

    if (valid) {
        confirmacion.style.display = 'flex';
    }
});

btnNo.addEventListener('click', () => {
    confirmacion.style.display = 'none';
});

btnSi.addEventListener('click', async () => {
    confirmacion.style.display = 'none';

    const nuevoUsuario = {
        nombre: document.getElementById('nombre').value.trim(),
        apellidos: document.getElementById('apellidos').value.trim(),
        telefono: parseInt(document.getElementById('telefono').value.trim(), 10),
        direccion: document.getElementById('direccion').value.trim(),
        contraseña: document.getElementById('contrasena').value.trim(),
        rol: document.getElementById('tipoEmpleado').value.toLowerCase()
    };

    try {
        if (modoEdicion) {
            await fetch(`${API_URL}/${usuarioEditandoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoUsuario)
            });
        } else {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoUsuario)
            });
        }

        await cargarUsuarios();
        form.reset();
        modal.style.display = 'none';
        ventanaExito.style.display = 'flex';
        setTimeout(() => ventanaExito.style.display = 'none', 2500);
    } catch (err) {
        alert('Error al procesar el usuario');
        console.error(err);
    }
});

btnEliminarNo.addEventListener('click', () => {
    confirmacionEliminar.style.display = 'none';
    usuarioEditandoId = null;
});

btnEliminarSi.addEventListener('click', async () => {
    confirmacionEliminar.style.display = 'none';

    if (!usuarioEditandoId) return;

    console.log("Eliminando usuario con ID:", usuarioEditandoId);

    try {
        const res = await fetch(`${API_URL}/${usuarioEditandoId}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            await cargarUsuarios();
            usuarioEditandoId = null;
        } else {
            const errorText = await res.text();
            alert(`Error al eliminar: ${errorText}`);
        }
    } catch (err) {
        alert('Error al eliminar el usuario');
        console.error(err);
    }
});

async function cargarUsuarios() {
    try {
        const res = await fetch(API_URL);
        const usuarios = await res.json();
        console.log('Usuarios recibidos:', usuarios);
        renderTabla(usuarios);
    } catch (err) {
        console.error('Error al procesar el usuario:', err);
        alert('Error al procesar el usuario');
    }
}

async function obtenerUsuarioPorId(id) {
    const res = await fetch(API_URL);
    const usuarios = await res.json();
    return usuarios.find(u => String(u.id) === String(id));
}

cargarUsuarios();