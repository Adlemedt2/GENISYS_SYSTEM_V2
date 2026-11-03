// ======================================================
// GENISYS SYSTEM - MÓDULO DE COMPRAS
// ======================================================

const CLAVE_PRODUCTOS = "genisys_productos";
const CLAVE_COMPRAS = "genisys_compras";
const CLAVE_MOVIMIENTOS = "genisys_movimientos";

let productos = [];
let compras = [];
let movimientos = [];
let carritoCompra = [];

// ======================================================
// ELEMENTOS DEL DOM
// ======================================================

const proveedorCompra = document.getElementById("proveedorCompra");
const fechaCompra = document.getElementById("fechaCompra");

const buscarProductoCompra = document.getElementById("buscarProductoCompra");
const productoCompra = document.getElementById("productoCompra");
const cantidadCompra = document.getElementById("cantidadCompra");
const precioCompra = document.getElementById("precioCompra");

const btnAgregarCompra = document.getElementById("btnAgregarCompra");
const btnVaciarCompra = document.getElementById("btnVaciarCompra");
const btnConfirmarCompra = document.getElementById("btnConfirmarCompra");

const listaCarritoCompra = document.getElementById("listaCarritoCompra");
const listaCompras = document.getElementById("listaCompras");

const cantidadProductosCompra = document.getElementById("cantidadProductosCompra");
const subtotalCompra = document.getElementById("subtotalCompra");
const totalCompra = document.getElementById("totalCompra");

const totalCompras = document.getElementById("totalCompras");
const comprasDelDia = document.getElementById("comprasDelDia");
const totalCompradoHoy = document.getElementById("totalCompradoHoy");

const mensajeCompra = document.getElementById("mensajeCompra");

// ======================================================
// INICIALIZACIÓN
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
    cargarDatos();
    establecerFechaActual();
    cargarProductosSelect();
    mostrarCarrito();
    mostrarCompras();
    actualizarResumen();
    configurarEventos();
});

// ======================================================
// CARGAR INFORMACIÓN
// ======================================================

function cargarDatos() {
    productos = JSON.parse(localStorage.getItem(CLAVE_PRODUCTOS)) || [];
    compras = JSON.parse(localStorage.getItem(CLAVE_COMPRAS)) || [];
    movimientos = JSON.parse(localStorage.getItem(CLAVE_MOVIMIENTOS)) || [];
}

// ======================================================
// GUARDAR INFORMACIÓN
// ======================================================

function guardarDatos() {
    localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos));
    localStorage.setItem(CLAVE_COMPRAS, JSON.stringify(compras));
    localStorage.setItem(CLAVE_MOVIMIENTOS, JSON.stringify(movimientos));
}

// ======================================================
// FECHA ACTUAL
// ======================================================

function establecerFechaActual() {
    const hoy = new Date();
    const fecha = hoy.toISOString().split("T")[0];

    if (fechaCompra) {
        fechaCompra.value = fecha;
        fechaCompra.max = fecha;
    }
}

// ======================================================
// CONFIGURAR EVENTOS
// ======================================================

function configurarEventos() {
    if (buscarProductoCompra) {
        buscarProductoCompra.addEventListener("input", cargarProductosSelect);
    }

    if (btnAgregarCompra) {
        btnAgregarCompra.addEventListener("click", agregarAlCarrito);
    }

    if (btnVaciarCompra) {
        btnVaciarCompra.addEventListener("click", vaciarCarrito);
    }

    if (btnConfirmarCompra) {
        btnConfirmarCompra.addEventListener("click", confirmarCompra);
    }
}

// ======================================================
// CARGAR PRODUCTOS EN EL SELECT
// ======================================================

function cargarProductosSelect() {
    if (!productoCompra) return;

    const busqueda = buscarProductoCompra
        ? buscarProductoCompra.value.trim().toLowerCase()
        : "";

    const productosFiltrados = productos.filter(producto =>
    (producto.disponibleCompra === true ||
    producto.disponibleCompra === "true") &&
    producto.nombre.toLowerCase().includes(busqueda)
    );

    productoCompra.innerHTML =
        '<option value="">Seleccione un producto</option>';

    productosFiltrados.forEach(producto => {
        const opcion = document.createElement("option");

        opcion.value = producto.id;

        opcion.textContent =
            `${producto.nombre} (${producto.tipo === "insumo" ? "Insumo" : "Producto terminado"})`;

        productoCompra.appendChild(opcion);
    });
}

// ======================================================
// AGREGAR PRODUCTO AL CARRITO
// ======================================================

function agregarAlCarrito() {
    const idProducto = productoCompra.value;
    const cantidad = Number(cantidadCompra.value);
    const costoUnitario = Number(precioCompra.value);

    if (!idProducto) {
        mostrarMensaje("Seleccione un producto.", "error");
        return;
    }

    if (!Number.isFinite(cantidad) || cantidad <= 0) {
        mostrarMensaje("Ingrese una cantidad válida.", "error");
        return;
    }

    if (!Number.isFinite(costoUnitario) || costoUnitario < 0) {
        mostrarMensaje("Ingrese un costo unitario válido.", "error");
        return;
    }

    const producto = productos.find(
        p => String(p.id) === String(idProducto)
    );

    if (!producto) {
        mostrarMensaje("El producto seleccionado no existe.", "error");
        return;
    }

    carritoCompra.push({
        idLinea: Date.now() + Math.random(),
        productoId: producto.id,
        nombre: producto.nombre,
        cantidad: cantidad,
        precio: costoUnitario,
        subtotal: cantidad * costoUnitario
    });

    mostrarCarrito();

    productoCompra.value = "";
    cantidadCompra.value = "";
    precioCompra.value = "";

    if (buscarProductoCompra) {
        buscarProductoCompra.value = "";
    }

    cargarProductosSelect();

    mostrarMensaje("Producto agregado a la compra.", "exito");
}

// ======================================================
// MOSTRAR CARRITO
// ======================================================

function mostrarCarrito() {
    if (!listaCarritoCompra) return;

    listaCarritoCompra.innerHTML = "";

    if (carritoCompra.length === 0) {
        listaCarritoCompra.innerHTML = `
            <tr>
                <td colspan="5">No hay productos agregados.</td>
            </tr>
        `;
    } else {
        carritoCompra.forEach(item => {
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${item.nombre}</td>
                <td>${formatearNumero(item.cantidad)}</td>
                <td>${formatearMoneda(item.precio)}</td>
                <td>${formatearMoneda(item.subtotal)}</td>
                <td>
                    <button
                        type="button"
                        class="btn-eliminar"
                        onclick="eliminarDelCarrito(${item.idLinea})">
                        Eliminar
                    </button>
                </td>
            `;

            listaCarritoCompra.appendChild(fila);
        });
    }

    actualizarTotales();
}

// ======================================================
// ELIMINAR PRODUCTO DEL CARRITO
// ======================================================

function eliminarDelCarrito(idLinea) {
    carritoCompra = carritoCompra.filter(
        item => item.idLinea !== idLinea
    );

    mostrarCarrito();
}

// ======================================================
// VACIAR CARRITO
// ======================================================

function vaciarCarrito() {
    if (carritoCompra.length === 0) {
        mostrarMensaje("El carrito ya está vacío.", "advertencia");
        return;
    }

    if (!confirm("¿Está seguro de vaciar la compra?")) {
        return;
    }

    carritoCompra = [];

    mostrarCarrito();
    mostrarMensaje("Carrito vaciado correctamente.", "exito");
}

// ======================================================
// ACTUALIZAR TOTALES
// ======================================================

function actualizarTotales() {
    const cantidadTotal = carritoCompra.reduce(
        (total, item) => total + item.cantidad,
        0
    );

    const subtotal = carritoCompra.reduce(
        (total, item) => total + item.subtotal,
        0
    );

    if (cantidadProductosCompra) {
        cantidadProductosCompra.textContent = formatearNumero(cantidadTotal);
    }

    if (subtotalCompra) {
        subtotalCompra.textContent = formatearMoneda(subtotal);
    }

    if (totalCompra) {
        totalCompra.textContent = formatearMoneda(subtotal);
    }
}

// ======================================================
// CONFIRMAR COMPRA
// ======================================================

function confirmarCompra() {
    const proveedor = proveedorCompra.value.trim();
    const fecha = fechaCompra.value;

    if (!proveedor) {
        mostrarMensaje("Ingrese el nombre del proveedor.", "error");
        proveedorCompra.focus();
        return;
    }

    if (!fecha) {
        mostrarMensaje("Seleccione la fecha de la compra.", "error");
        fechaCompra.focus();
        return;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaSeleccionada = new Date(`${fecha}T00:00:00`);

    if (fechaSeleccionada > hoy) {
        mostrarMensaje("La fecha de compra no puede ser futura.", "error");
        return;
    }

    if (carritoCompra.length === 0) {
        mostrarMensaje("Agregue al menos un producto a la compra.", "error");
        return;
    }

    if (!confirm("¿Desea confirmar y registrar esta compra?")) {
        return;
    }

    // Recargar los datos antes de modificar las existencias.
    cargarDatos();

    const productosActualizados = [...productos];
    const movimientosActualizados = [...movimientos];

    const idCompra = Date.now();
    const numeroCompra = `C-${idCompra}`;

    const detalles = carritoCompra.map(item => {
        const producto = productosActualizados.find(
            p => String(p.id) === String(item.productoId)
        );

        if (!producto) {
            throw new Error(`No se encontró el producto ${item.nombre}.`);
        }

        const cantidad = Number(item.cantidad);

        if (!Number.isFinite(cantidad) || cantidad <= 0) {
            throw new Error(`La cantidad de ${item.nombre} no es válida.`);
        }

        producto.stock = Number(producto.stock || 0) + cantidad;

        movimientosActualizados.push({
            id: Date.now() + Math.random(),
            productoId: producto.id,
            tipo: "entrada",
            cantidad: cantidad,
            observacion: `Compra ${numeroCompra} - Proveedor: ${proveedor}`,
            fecha: new Date().toISOString()
        });

        return {
            productoId: producto.id,
            nombre: producto.nombre,
            precio: Number(item.precio),
            cantidad: cantidad,
            subtotal: cantidad * Number(item.precio)
        };
    });

    const total = detalles.reduce(
        (suma, item) => suma + item.subtotal,
        0
    );

    const nuevaCompra = {
        id: idCompra,
        numero: numeroCompra,
        fecha: fecha,
        proveedor: proveedor,
        detalles: detalles,
        total: total
    };

    compras.push(nuevaCompra);

    productos = productosActualizados;
    movimientos = movimientosActualizados;

    guardarDatos();

    carritoCompra = [];

    proveedorCompra.value = "";
    establecerFechaActual();

    mostrarCarrito();
    mostrarCompras();
    actualizarResumen();
    cargarProductosSelect();

    mostrarMensaje(
        `Compra ${numeroCompra} registrada correctamente.`,
        "exito"
    );
}

// ======================================================
// MOSTRAR HISTORIAL DE COMPRAS
// ======================================================

function mostrarCompras() {
    if (!listaCompras) return;

    listaCompras.innerHTML = "";

    if (compras.length === 0) {
        listaCompras.innerHTML = `
            <tr>
                <td colspan="5">No hay compras registradas.</td>
            </tr>
        `;
        return;
    }

    const comprasOrdenadas = [...compras].sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
    );

    comprasOrdenadas.forEach(compra => {
        const fila = document.createElement("tr");

        const cantidadProductos = compra.detalles.reduce(
            (total, item) => total + Number(item.cantidad),
            0
        );

        fila.innerHTML = `
            <td>${compra.numero}</td>
            <td>${formatearFecha(compra.fecha)}</td>
            <td>${compra.proveedor}</td>
            <td>${formatearNumero(cantidadProductos)}</td>
            <td>${formatearMoneda(compra.total)}</td>
        `;

        listaCompras.appendChild(fila);
    });
}

// ======================================================
// ACTUALIZAR RESUMEN
// ======================================================

function actualizarResumen() {
    const hoy = new Date().toISOString().split("T")[0];

    const comprasHoy = compras.filter(
        compra => compra.fecha === hoy
    );

    const totalHoy = comprasHoy.reduce(
        (total, compra) => total + Number(compra.total),
        0
    );

    if (totalCompras) {
        totalCompras.textContent = compras.length;
    }

    if (comprasDelDia) {
        comprasDelDia.textContent = comprasHoy.length;
    }

    if (totalCompradoHoy) {
        totalCompradoHoy.textContent = formatearMoneda(totalHoy);
    }
}

// ======================================================
// MENSAJES
// ======================================================

function mostrarMensaje(texto, tipo) {
    if (!mensajeCompra) return;

    mensajeCompra.textContent = texto;
    mensajeCompra.className = `mensaje-compra ${tipo}`;

    setTimeout(() => {
        mensajeCompra.textContent = "";
        mensajeCompra.className = "mensaje-compra";
    }, 4000);
}

// ======================================================
// FORMATO DE MONEDA
// ======================================================

function formatearMoneda(valor) {
    return Number(valor).toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 2
    });
}

// ======================================================
// FORMATO DE NÚMEROS
// ======================================================

function formatearNumero(valor) {
    return Number(valor).toLocaleString("es-CO", {
        maximumFractionDigits: 2
    });
}

// ======================================================
// FORMATO DE FECHAS
// ======================================================

function formatearFecha(fecha) {
    return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-CO");
}