
document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // ELEMENTOS DEL DOM
    // =====================================================

    const clienteVenta = document.getElementById("clienteVenta");
    const fechaVenta = document.getElementById("fechaVenta");
    const buscarProductoVenta = document.getElementById("buscarProductoVenta");
    const productoVenta = document.getElementById("productoVenta");
    const cantidadVenta = document.getElementById("cantidadVenta");

    const btnAgregarCarrito = document.getElementById("btnAgregarCarrito");
    const btnVaciarCarrito = document.getElementById("btnVaciarCarrito");
    const btnConfirmarVenta = document.getElementById("btnConfirmarVenta");

    const listaCarrito = document.getElementById("listaCarrito");
    const listaVentas = document.getElementById("listaVentas");
    const mensajeVenta = document.getElementById("mensajeVenta");

    const cantidadProductosCarrito = document.getElementById(
        "cantidadProductosCarrito"
    );

    const subtotalVenta = document.getElementById("subtotalVenta");
    const totalVenta = document.getElementById("totalVenta");

    const totalVentas = document.getElementById("totalVentas");
    const ventasDelDia = document.getElementById("ventasDelDia");
    const totalVendidoHoy = document.getElementById("totalVendidoHoy");


    // =====================================================
    // ALMACENAMIENTO
    // =====================================================

    const CLAVE_PRODUCTOS = "genisys_productos";
    const CLAVE_VENTAS = "genisys_ventas";
    const CLAVE_MOVIMIENTOS = "genisys_movimientos";

    let productos = cargarDatos(CLAVE_PRODUCTOS);
    let ventas = cargarDatos(CLAVE_VENTAS);
    let movimientos = cargarDatos(CLAVE_MOVIMIENTOS);

    let carrito = [];


    function cargarDatos(clave) {
        try {
            const datos = JSON.parse(localStorage.getItem(clave));
            return Array.isArray(datos) ? datos : [];
        } catch (error) {
            console.error(`Error al cargar ${clave}:`, error);
            return [];
        }
    }


    function guardarDatos(clave, datos) {
        localStorage.setItem(clave, JSON.stringify(datos));
    }


    // =====================================================
    // FUNCIONES GENERALES
    // =====================================================

    function escaparHTML(valor) {
        return String(valor ?? "").replace(/[&<>"']/g, caracter => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[caracter]);
    }


    function formatearMoneda(valor) {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        }).format(Number(valor) || 0);
    }


    function obtenerFechaLocal() {
        const ahora = new Date();
        const zona = ahora.getTimezoneOffset() * 60000;

        return new Date(ahora.getTime() - zona)
            .toISOString()
            .split("T")[0];
    }


    function obtenerProductoPorId(id) {
        return productos.find(
            producto => String(producto.id) === String(id)
        );
    }


    function estaDisponibleParaVenta(producto) {
        return producto.disponibleVenta === true ||
               producto.disponibleVenta === "true";
    }


    function mostrarMensaje(texto, tipo = "") {
        mensajeVenta.textContent = texto;
        mensajeVenta.className = "mensaje-venta";

        if (tipo) {
            mensajeVenta.classList.add(tipo);
        }
    }


    // =====================================================
    // PRODUCTOS DISPONIBLES
    // =====================================================

    function obtenerProductosDisponibles() {
        return productos.filter(producto =>
            estaDisponibleParaVenta(producto)
        );
    }


    function cargarProductosEnSelector() {
        const textoBusqueda = buscarProductoVenta.value
            .trim()
            .toLowerCase();

        const productosDisponibles = obtenerProductosDisponibles()
            .filter(producto =>
                producto.nombre.toLowerCase().includes(textoBusqueda)
            );

        const seleccionAnterior = productoVenta.value;

        productoVenta.innerHTML =
            '<option value="">Selecciona un producto</option>';

        productosDisponibles.forEach(producto => {
            const stock = Number(producto.stock) || 0;
            const precio = Number(producto.precio) || 0;

            const opcion = document.createElement("option");

            opcion.value = producto.id;
            opcion.textContent =
                `${producto.nombre} | ${formatearMoneda(precio)} | Stock: ${stock}`;

            opcion.disabled = stock <= 0;

            productoVenta.appendChild(opcion);
        });

        if (productosDisponibles.some(
            producto => String(producto.id) === seleccionAnterior
        )) {
            productoVenta.value = seleccionAnterior;
        }
    }


    // =====================================================
    // CARRITO
    // =====================================================

    function agregarAlCarrito() {
        const id = productoVenta.value;
        const cantidad = Number(cantidadVenta.value);

        if (!id) {
            mostrarMensaje("Selecciona un producto.", "error");
            return;
        }

        if (!Number.isFinite(cantidad) || cantidad <= 0) {
            mostrarMensaje("Ingresa una cantidad válida.", "error");
            return;
        }

        const producto = obtenerProductoPorId(id);

        if (!producto || !estaDisponibleParaVenta(producto)) {
            mostrarMensaje(
                "El producto seleccionado no está disponible para la venta.",
                "error"
            );
            cargarProductosEnSelector();
            return;
        }

        const stock = Number(producto.stock) || 0;

        const elementoExistente = carrito.find(
            item => String(item.productoId) === String(id)
        );

        const cantidadActual = elementoExistente
            ? elementoExistente.cantidad
            : 0;

        if (cantidadActual + cantidad > stock) {
            mostrarMensaje(
                `Existencias insuficientes. Stock disponible: ${stock}.`,
                "error"
            );
            return;
        }

        const precio = Number(producto.precio) || 0;

        if (elementoExistente) {
            elementoExistente.cantidad += cantidad;
        } else {
            carrito.push({
                productoId: producto.id,
                nombre: producto.nombre,
                precio: precio,
                cantidad: cantidad
            });
        }

        cantidadVenta.value = "1";

        mostrarMensaje("Producto agregado al carrito.", "exito");
        mostrarCarrito();
    }


    function mostrarCarrito() {
        if (carrito.length === 0) {
            listaCarrito.innerHTML = `
                <tr>
                    <td colspan="5">El carrito está vacío.</td>
                </tr>
            `;
        } else {
            listaCarrito.innerHTML = carrito.map(item => {
                const subtotal = item.precio * item.cantidad;

                return `
                    <tr>
                        <td>${escaparHTML(item.nombre)}</td>
                        <td>${formatearMoneda(item.precio)}</td>
                        <td>${item.cantidad}</td>
                        <td>${formatearMoneda(subtotal)}</td>
                        <td>
                            <button
                                type="button"
                                class="btn-eliminar-carrito"
                                data-id="${escaparHTML(item.productoId)}"
                                aria-label="Eliminar producto del carrito">
                                Eliminar
                            </button>
                        </td>
                    </tr>
                `;
            }).join("");
        }

        actualizarTotales();
    }


    function actualizarTotales() {
        const cantidadTotal = carrito.reduce(
            (total, item) => total + item.cantidad,
            0
        );

        const subtotal = carrito.reduce(
            (total, item) => total + item.precio * item.cantidad,
            0
        );

        cantidadProductosCarrito.textContent =
            `${cantidadTotal} ${cantidadTotal === 1 ? "producto" : "productos"}`;

        subtotalVenta.textContent = formatearMoneda(subtotal);
        totalVenta.textContent = formatearMoneda(subtotal);
    }


    function eliminarDelCarrito(id) {
        carrito = carrito.filter(
            item => String(item.productoId) !== String(id)
        );

        mostrarCarrito();
        mostrarMensaje("Producto retirado del carrito.", "exito");
    }


    function vaciarCarrito() {
        if (carrito.length === 0) {
            mostrarMensaje("El carrito ya está vacío.", "error");
            return;
        }

        const confirmar = confirm(
            "¿Deseas eliminar todos los productos del carrito?"
        );

        if (!confirmar) return;

        carrito = [];
        mostrarCarrito();
        mostrarMensaje("Carrito vaciado correctamente.", "exito");
    }


    // =====================================================
    // CONFIRMAR VENTA
    // =====================================================

    function confirmarVenta() {
        if (carrito.length === 0) {
            mostrarMensaje(
                "Agrega al menos un producto antes de confirmar la venta.",
                "error"
            );
            return;
        }

        const fecha = fechaVenta.value;

        if (!fecha) {
            mostrarMensaje("Selecciona la fecha de la venta.", "error");
            return;
        }

        if (fecha > obtenerFechaLocal()) {
            mostrarMensaje(
                "La fecha de venta no puede ser futura.",
                "error"
            );
            return;
        }

        // Verificar nuevamente las existencias antes de vender.

        for (const item of carrito) {
            const producto = obtenerProductoPorId(item.productoId);

            if (!producto || !estaDisponibleParaVenta(producto)) {
                mostrarMensaje(
                    `El producto ${item.nombre} ya no está disponible para la venta.`,
                    "error"
                );
                cargarProductosEnSelector();
                return;
            }

            const stock = Number(producto.stock) || 0;

            if (item.cantidad > stock) {
                mostrarMensaje(
                    `No hay existencias suficientes de ${item.nombre}. Stock actual: ${stock}.`,
                    "error"
                );
                return;
            }
        }

        const total = carrito.reduce(
            (suma, item) => suma + item.precio * item.cantidad,
            0
        );

        const cliente = clienteVenta.value.trim() || "Cliente general";

        const confirmar = window.confirm(
            `¿Confirmas esta venta?\n\n` +
            `Cliente: ${cliente}\n` +
            `Productos: ${carrito.length}\n` +
            `Total: ${formatearMoneda(total)}`
        );

        if (!confirmar) return;

        const idVenta = Date.now();

        const detalles = carrito.map(item => ({
            productoId: item.productoId,
            nombre: item.nombre,
            precio: item.precio,
            cantidad: item.cantidad,
            subtotal: item.precio * item.cantidad
        }));

        const nuevaVenta = {
            id: idVenta,
            numero: `V-${idVenta}`,
            fecha: fecha,
            cliente: cliente,
            detalles: detalles,
            total: total
        };

        // Descontar existencias y registrar movimientos.

        detalles.forEach((detalle, indice) => {
            const producto = obtenerProductoPorId(detalle.productoId);

            producto.stock =
                Number(producto.stock) - detalle.cantidad;

            movimientos.push({
                id: `${idVenta}-${indice}`,
                productoId: producto.id,
                tipo: "salida",
                cantidad: detalle.cantidad,
                observacion: `Venta ${nuevaVenta.numero}`,
                fecha: new Date().toISOString()
            });
        });

        ventas.push(nuevaVenta);

        // Guardar los cambios.

        guardarDatos(CLAVE_PRODUCTOS, productos);
        guardarDatos(CLAVE_MOVIMIENTOS, movimientos);
        guardarDatos(CLAVE_VENTAS, ventas);

        carrito = [];

        mostrarCarrito();
        cargarProductosEnSelector();
        mostrarHistorialVentas();
        actualizarResumenVentas();

        clienteVenta.value = "";
        fechaVenta.value = obtenerFechaLocal();

        mostrarMensaje(
            `Venta ${nuevaVenta.numero} registrada correctamente.`,
            "exito"
        );
    }


    // =====================================================
    // HISTORIAL DE VENTAS
    // =====================================================

    function mostrarHistorialVentas() {
        if (ventas.length === 0) {
            listaVentas.innerHTML = `
                <tr>
                    <td colspan="5">No hay ventas registradas.</td>
                </tr>
            `;
            return;
        }

        const ventasOrdenadas = [...ventas].sort(
            (a, b) => Number(b.id) - Number(a.id)
        );

        listaVentas.innerHTML = ventasOrdenadas.map(venta => {
            const cantidad = venta.detalles.reduce(
                (total, detalle) => total + detalle.cantidad,
                0
            );

            return `
                <tr>
                    <td>${escaparHTML(venta.numero)}</td>
                    <td>${escaparHTML(venta.fecha)}</td>
                    <td>${escaparHTML(venta.cliente)}</td>
                    <td>${cantidad}</td>
                    <td>${formatearMoneda(venta.total)}</td>
                </tr>
            `;
        }).join("");
    }


    // =====================================================
    // RESUMEN DE VENTAS
    // =====================================================

    function actualizarResumenVentas() {
        const hoy = obtenerFechaLocal();

        const ventasHoy = ventas.filter(
            venta => venta.fecha === hoy
        );

        const totalHoy = ventasHoy.reduce(
            (total, venta) => total + Number(venta.total),
            0
        );

        totalVentas.textContent = ventas.length;
        ventasDelDia.textContent = ventasHoy.length;
        totalVendidoHoy.textContent = formatearMoneda(totalHoy);
    }


    // =====================================================
    // EVENTOS
    // =====================================================

    btnAgregarCarrito.addEventListener(
        "click",
        agregarAlCarrito
    );

    btnVaciarCarrito.addEventListener(
        "click",
        vaciarCarrito
    );

    btnConfirmarVenta.addEventListener(
        "click",
        confirmarVenta
    );

    buscarProductoVenta.addEventListener(
        "input",
        cargarProductosEnSelector
    );

    listaCarrito.addEventListener("click", evento => {
        const boton = evento.target.closest(".btn-eliminar-carrito");

        if (!boton) return;

        eliminarDelCarrito(boton.dataset.id);
    });


    // =====================================================
    // INICIALIZACIÓN
    // =====================================================

    fechaVenta.value = obtenerFechaLocal();

    cargarProductosEnSelector();
    mostrarCarrito();
    mostrarHistorialVentas();
    actualizarResumenVentas();

});
