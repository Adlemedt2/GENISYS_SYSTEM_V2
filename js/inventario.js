
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // CONFIGURACIÓN Y ALMACENAMIENTO
    // ==========================================

    const CLAVE_PRODUCTOS = "genisys_productos";
    const CLAVE_MOVIMIENTOS = "genisys_movimientos";

    let productos = JSON.parse(localStorage.getItem(CLAVE_PRODUCTOS)) || [];
    let movimientos = JSON.parse(localStorage.getItem(CLAVE_MOVIMIENTOS)) || [];

    const listaInventario = document.getElementById("listaInventario");
    const listaMovimientos = document.getElementById("listaMovimientos");
    const mensajeInventario = document.getElementById("mensajeInventario");

    const totalInventario = document.getElementById("totalInventario");
    const totalTerminados = document.getElementById("totalTerminadosInventario");
    const totalInsumos = document.getElementById("totalInsumosInventario");
    const totalStockBajo = document.getElementById("totalStockBajo");

    const buscarInventario = document.getElementById("buscarInventario");
    const filtrarTipo = document.getElementById("filtrarTipoInventario");
    const filtrarEstado = document.getElementById("filtrarEstadoInventario");

    const btnEntrada = document.getElementById("btnEntrada");
    const btnSalida = document.getElementById("btnSalida");
    const btnAjuste = document.getElementById("btnAjuste");
    const btnLimpiar = document.getElementById("btnLimpiarInventario");


    // ==========================================
    // INICIALIZACIÓN DE EXISTENCIAS
    // ==========================================

    function inicializarExistencias() {

        productos.forEach(producto => {

            if (typeof producto.stock !== "number") {
                producto.stock = 0;
            }

            if (typeof producto.stockMinimo !== "number") {
                producto.stockMinimo = 5;
            }

        });

        guardarProductos();
    }


    // ==========================================
    // GUARDAR INFORMACIÓN
    // ==========================================

    function guardarProductos() {
        localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos));
    }

    function guardarMovimientos() {
        localStorage.setItem(CLAVE_MOVIMIENTOS, JSON.stringify(movimientos));
    }


    // ==========================================
    // FUNCIONES AUXILIARES
    // ==========================================

    function escaparHTML(texto) {

        return String(texto ?? "").replace(/[&<>"']/g, caracter => {
            const entidades = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };

            return entidades[caracter];
        });

    }


    function obtenerTipo(tipo) {

        return tipo === "terminado"
            ? "Producto terminado"
            : "Materia prima / Insumo";

    }


    function obtenerEstado(producto) {

        if (producto.stock <= 0) {
            return {
                texto: "Agotado",
                clase: "estado-agotado",
                filtro: "agotado"
            };
        }

        if (producto.stock <= producto.stockMinimo) {
            return {
                texto: "Stock bajo",
                clase: "estado-bajo",
                filtro: "bajo"
            };
        }

        return {
            texto: "Disponible",
            clase: "estado-disponible",
            filtro: "disponible"
        };

    }


    function mostrarMensaje(texto) {

        mensajeInventario.textContent = texto;

    }


    function obtenerProductoPorId(id) {

        return productos.find(producto => String(producto.id) === String(id));

    }


    function obtenerNombreProducto(id) {

        const producto = obtenerProductoPorId(id);

        return producto ? producto.nombre : "Producto no disponible";

    }


    // ==========================================
    // ACTUALIZAR TARJETAS DE RESUMEN
    // ==========================================

    function actualizarResumen() {

        totalInventario.textContent = productos.length;

        totalTerminados.textContent = productos.filter(
            producto => producto.tipo === "terminado"
        ).length;

        totalInsumos.textContent = productos.filter(
            producto => producto.tipo === "insumo"
        ).length;

        totalStockBajo.textContent = productos.filter(
            producto => producto.stock <= producto.stockMinimo
        ).length;

    }


    // ==========================================
    // MOSTRAR INVENTARIO
    // ==========================================

    function mostrarInventario() {

        const busqueda = buscarInventario.value.trim().toLowerCase();
        const tipoSeleccionado = filtrarTipo.value;
        const estadoSeleccionado = filtrarEstado.value;

        const productosFiltrados = productos.filter(producto => {

            const coincideBusqueda =
                producto.nombre.toLowerCase().includes(busqueda) ||
                producto.categoria.toLowerCase().includes(busqueda);

            const coincideTipo =
                tipoSeleccionado === "todos" ||
                producto.tipo === tipoSeleccionado;

            const estado = obtenerEstado(producto);

            const coincideEstado =
                estadoSeleccionado === "todos" ||
                estado.filtro === estadoSeleccionado;

            return coincideBusqueda && coincideTipo && coincideEstado;

        });

        listaInventario.innerHTML = "";

        if (productosFiltrados.length === 0) {

            listaInventario.innerHTML = `
                <tr>
                    <td colspan="7">No se encontraron productos.</td>
                </tr>
            `;

            return;
        }

        productosFiltrados.forEach(producto => {

            const estado = obtenerEstado(producto);

            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${escaparHTML(producto.nombre)}</td>
                <td>${obtenerTipo(producto.tipo)}</td>
                <td>${escaparHTML(producto.categoria)}</td>
                <td>${producto.stock}</td>
                <td>${escaparHTML(producto.unidad)}</td>
                <td>${producto.stockMinimo}</td>
                <td>
                    <span class="estado-inventario ${estado.clase}">
                        ${estado.texto}
                    </span>
                </td>
            `;

            listaInventario.appendChild(fila);

        });

    }


    // ==========================================
    // MOSTRAR HISTORIAL DE MOVIMIENTOS
    // ==========================================

    function mostrarMovimientos() {

        listaMovimientos.innerHTML = "";

        if (movimientos.length === 0) {

            listaMovimientos.innerHTML = `
                <tr>
                    <td colspan="5">No hay movimientos registrados.</td>
                </tr>
            `;

            return;
        }

        movimientos.slice(0, 20).forEach(movimiento => {

            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${escaparHTML(movimiento.fecha)}</td>
                <td>${escaparHTML(obtenerNombreProducto(movimiento.productoId))}</td>
                <td>${escaparHTML(movimiento.tipo)}</td>
                <td>${movimiento.cantidad}</td>
                <td>${escaparHTML(movimiento.observacion)}</td>
            `;

            listaMovimientos.appendChild(fila);

        });

    }


    // ==========================================
    // REGISTRAR MOVIMIENTOS
    // ==========================================

    function seleccionarProducto() {

        if (productos.length === 0) {
            mostrarMensaje("No hay productos registrados.");
            return null;
        }

        const opciones = productos.map((producto, indice) => {
            return `${indice + 1}. ${producto.nombre} | Stock: ${producto.stock}`;
        }).join("\n");

        const seleccion = prompt(
            "Seleccione el número del producto:\n\n" + opciones
        );

        if (seleccion === null) {
            return null;
        }

        const indice = Number(seleccion) - 1;

        if (
            !Number.isInteger(indice) ||
            indice < 0 ||
            indice >= productos.length
        ) {
            mostrarMensaje("La selección del producto no es válida.");
            return null;
        }

        return productos[indice];

    }


    function solicitarCantidad(mensaje) {

        const valor = prompt(mensaje);

        if (valor === null) {
            return null;
        }

        const cantidad = Number(valor.replace(",", "."));

        if (!Number.isFinite(cantidad) || cantidad <= 0) {
            mostrarMensaje("Ingrese una cantidad válida mayor que cero.");
            return null;
        }

        return cantidad;

    }


    function registrarMovimiento(producto, tipo, cantidad, observacion) {

        const movimiento = {
            id: Date.now(),
            productoId: producto.id,
            tipo: tipo,
            cantidad: cantidad,
            observacion: observacion,
            fecha: new Date().toLocaleString("es-CO")
        };

        movimientos.unshift(movimiento);

        guardarProductos();
        guardarMovimientos();

        actualizarResumen();
        mostrarInventario();
        mostrarMovimientos();

        mostrarMensaje("Movimiento registrado correctamente.");

    }


    // ==========================================
    // REGISTRAR ENTRADA
    // ==========================================

    function registrarEntrada() {

        const producto = seleccionarProducto();

        if (!producto) return;

        const cantidad = solicitarCantidad(
            `Cantidad que ingresará al inventario de ${producto.nombre}:`
        );

        if (cantidad === null) return;

        producto.stock += cantidad;

        registrarMovimiento(
            producto,
            "Entrada",
            cantidad,
            "Ingreso de existencias"
        );

    }


    // ==========================================
    // REGISTRAR SALIDA
    // ==========================================

    function registrarSalida() {

        const producto = seleccionarProducto();

        if (!producto) return;

        const cantidad = solicitarCantidad(
            `Cantidad que saldrá del inventario de ${producto.nombre}:\nStock actual: ${producto.stock}`
        );

        if (cantidad === null) return;

        if (cantidad > producto.stock) {
            mostrarMensaje("No hay existencias suficientes para realizar esta salida.");
            return;
        }

        producto.stock -= cantidad;

        registrarMovimiento(
            producto,
            "Salida",
            cantidad,
            "Salida de existencias"
        );

    }


    // ==========================================
    // AJUSTAR INVENTARIO
    // ==========================================

    function ajustarInventario() {

        const producto = seleccionarProducto();

        if (!producto) return;

        const nuevoStock = prompt(
            `Ingrese la nueva existencia de ${producto.nombre}:\nStock actual: ${producto.stock}`
        );

        if (nuevoStock === null) return;

        const cantidad = Number(nuevoStock.replace(",", "."));

        if (!Number.isFinite(cantidad) || cantidad < 0) {
            mostrarMensaje("Ingrese una existencia válida igual o mayor que cero.");
            return;
        }

        const diferencia = Math.abs(cantidad - producto.stock);

        if (diferencia === 0) {
            mostrarMensaje("La existencia no presenta cambios.");
            return;
        }

        const stockAnterior = producto.stock;

        producto.stock = cantidad;

        registrarMovimiento(
            producto,
            "Ajuste",
            diferencia,
            `Ajuste de ${stockAnterior} a ${cantidad} unidades`
        );

    }


    // ==========================================
    // LIMPIAR FILTROS
    // ==========================================

    function limpiarFiltros() {

        buscarInventario.value = "";
        filtrarTipo.value = "todos";
        filtrarEstado.value = "todos";

        mostrarInventario();

        mostrarMensaje("Filtros restablecidos.");

    }


    // ==========================================
    // EVENTOS
    // ==========================================

    buscarInventario.addEventListener("input", mostrarInventario);

    filtrarTipo.addEventListener("change", mostrarInventario);

    filtrarEstado.addEventListener("change", mostrarInventario);

    btnLimpiar.addEventListener("click", limpiarFiltros);

    btnEntrada.addEventListener("click", registrarEntrada);

    btnSalida.addEventListener("click", registrarSalida);

    btnAjuste.addEventListener("click", ajustarInventario);


    // ==========================================
    // INICIAR MÓDULO
    // ==========================================

    inicializarExistencias();

    actualizarResumen();
    mostrarInventario();
    mostrarMovimientos();

});
