
document.addEventListener("DOMContentLoaded", function () {

    // ==================================================
    // ELEMENTOS DEL HTML
    // ==================================================

    const buscarProducto = document.getElementById("buscarProducto");
    const filtrarTipo = document.getElementById("filtrarTipo");
    const btnLimpiarFiltros = document.getElementById("btnLimpiarFiltros");
    const btnNuevoProducto = document.getElementById("btnNuevoProducto");
    const btnCancelarProducto = document.getElementById("btnCancelarProducto");

    const listaProductos = document.getElementById("listaProductos");
    const mensajeProductos = document.getElementById("mensajeProductos");

    const totalProductos = document.getElementById("totalProductos");
    const totalTerminados = document.getElementById("totalTerminados");
    const totalInsumos = document.getElementById("totalInsumos");

    const formularioProducto = document.getElementById("formularioProducto");
    const formNuevoProducto = document.getElementById("formNuevoProducto");

    const nombreProducto = document.getElementById("nombreProducto");
    const tipoProducto = document.getElementById("tipoProducto");
    const categoriaProducto = document.getElementById("categoriaProducto");
    const unidadProducto = document.getElementById("unidadProducto");
    const precioProducto = document.getElementById("precioProducto");
    const stockMinimoProducto = document.getElementById("stockMinimoProducto");
    const disponibleVentaProducto = document.getElementById("disponibleVentaProducto");
    const disponibleCompraProducto = document.getElementById("disponibleCompraProducto");

    const tituloFormulario = formularioProducto.querySelector("h2");
    const botonGuardar = formNuevoProducto.querySelector('[type="submit"]');

    const CLAVE_PRODUCTOS = "genisys_productos";

    let productoEnEdicion = null;

    // ==================================================
    // PRODUCTOS INICIALES
    // ==================================================

    const productosIniciales = [
        {
            id: 1,
            nombre: "Dedito de queso",
            tipo: "terminado",
            categoria: "Pasabocas",
            unidad: "Unidad",
            precio: 2500,
            stock: 0,
            stockMinimo: 5,
            disponibleVenta: true,
            disponibleCompra: false
        },
        {
            id: 2,
            nombre: "Empanada de carne",
            tipo: "terminado",
            categoria: "Empanadas",
            unidad: "Unidad",
            precio: 3000,
            stock: 0,
            stockMinimo: 5,
            disponibleVenta: true,
            disponibleCompra: false
        },
        {
            id: 3,
            nombre: "Pastelito de pollo",
            tipo: "terminado",
            categoria: "Pastelitos",
            unidad: "Unidad",
            precio: 3500,
            stock: 0,
            stockMinimo: 5,
            disponibleVenta: true,
            disponibleCompra: false
        },
        {
            id: 4,
            nombre: "Panzerotti",
            tipo: "terminado",
            categoria: "Pasabocas",
            unidad: "Unidad",
            precio: 5000,
            stock: 0,
            stockMinimo: 5,
            disponibleVenta: true,
            disponibleCompra: false
        },
        {
            id: 5,
            nombre: "Harina de trigo",
            tipo: "insumo",
            categoria: "Materias primas",
            unidad: "Kilogramo",
            precio: 4500,
            stock: 0,
            stockMinimo: 5,
            disponibleVenta: false,
            disponibleCompra: true
        },
        {
            id: 6,
            nombre: "Queso mozzarella",
            tipo: "insumo",
            categoria: "Lácteos",
            unidad: "Kilogramo",
            precio: 18000,
            stock: 0,
            stockMinimo: 5,
            disponibleVenta: false,
            disponibleCompra: true
        },
        {
            id: 7,
            nombre: "Carne molida",
            tipo: "insumo",
            categoria: "Carnes",
            unidad: "Kilogramo",
            precio: 22000,
            stock: 0,
            stockMinimo: 5,
            disponibleVenta: false,
            disponibleCompra: true
        },
        {
            id: 8,
            nombre: "Aceite vegetal",
            tipo: "insumo",
            categoria: "Insumos",
            unidad: "Litro",
            precio: 9500,
            stock: 0,
            stockMinimo: 5,
            disponibleVenta: false,
            disponibleCompra: true
        }
    ];

    // ==================================================
    // CARGAR PRODUCTOS
    // ==================================================

    function cargarProductos() {
        try {
            const datosGuardados = localStorage.getItem(CLAVE_PRODUCTOS);

            if (datosGuardados !== null) {
                const datos = JSON.parse(datosGuardados);

                if (Array.isArray(datos)) {
                    return datos.map(function (producto) {
                        return {
                            ...producto,

                            stock: typeof producto.stock === "number"
                                ? producto.stock : 0,

                            stockMinimo: typeof producto.stockMinimo === "number"
                                ? producto.stockMinimo : 5,

                            disponibleVenta: typeof producto.disponibleVenta === "boolean"
                                ? producto.disponibleVenta
                                : producto.tipo === "terminado",

                            disponibleCompra: typeof producto.disponibleCompra === "boolean"
                                ? producto.disponibleCompra
                                : producto.tipo === "insumo"
                        };
                    });
                }
            }
        } catch (error) {
            console.error("Error al recuperar los productos:", error);
        }

        return [...productosIniciales];
    }

    let productos = cargarProductos();

    // ==================================================
    // GUARDAR PRODUCTOS
    // ==================================================

    function guardarProductos() {
        try {
            localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos));
            return true;
        } catch (error) {
            console.error("Error al guardar los productos:", error);
            return false;
        }
    }

    // ==================================================
    // FORMATO DE MONEDA
    // ==================================================

    function formatearMoneda(valor) {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        }).format(valor);
    }

    // ==================================================
    // MOSTRAR PRODUCTOS
    // ==================================================

    function mostrarProductos(datos = productos) {
        listaProductos.innerHTML = "";

        if (datos.length === 0) {
            const fila = document.createElement("tr");
            const celda = document.createElement("td");

            celda.colSpan = 8;
            celda.textContent = "No se encontraron productos.";

            fila.appendChild(celda);
            listaProductos.appendChild(fila);

            mensajeProductos.textContent =
                "No hay registros que coincidan con la búsqueda.";

            return;
        }

        datos.forEach(function (producto) {
            const fila = document.createElement("tr");

            const valores = [
                producto.nombre,
                producto.tipo === "terminado"
                    ? "Producto terminado"
                    : "Materia prima / Insumo",
                producto.categoria,
                producto.unidad,
                formatearMoneda(producto.precio),
                producto.disponibleVenta ? "Sí" : "No",
                producto.disponibleCompra ? "Sí" : "No"
            ];

            valores.forEach(function (valor) {
                const celda = document.createElement("td");
                celda.textContent = valor;
                fila.appendChild(celda);
            });

            const celdaAcciones = document.createElement("td");

            const btnEditar = document.createElement("button");
            btnEditar.type = "button";
            btnEditar.textContent = "Editar";
            btnEditar.className = "btn-accion btn-editar";
            btnEditar.dataset.id = producto.id;
            btnEditar.dataset.accion = "editar";

            const btnEliminar = document.createElement("button");
            btnEliminar.type = "button";
            btnEliminar.textContent = "Eliminar";
            btnEliminar.className = "btn-accion btn-eliminar";
            btnEliminar.dataset.id = producto.id;
            btnEliminar.dataset.accion = "eliminar";

            celdaAcciones.appendChild(btnEditar);
            celdaAcciones.appendChild(btnEliminar);

            fila.appendChild(celdaAcciones);
            listaProductos.appendChild(fila);
        });

        mensajeProductos.textContent =
            `Se encontraron ${datos.length} productos.`;
    }

    // ==================================================
    // ACTUALIZAR CONTADORES
    // ==================================================

    function actualizarContadores() {
        totalProductos.textContent = productos.length;

        totalTerminados.textContent = productos.filter(
            producto => producto.tipo === "terminado"
        ).length;

        totalInsumos.textContent = productos.filter(
            producto => producto.tipo === "insumo"
        ).length;
    }

    // ==================================================
    // BUSCAR Y FILTRAR
    // ==================================================

    function filtrarProductos() {
        const texto = buscarProducto.value.trim().toLowerCase();
        const tipoSeleccionado = filtrarTipo.value;

        const resultado = productos.filter(function (producto) {
            const coincideTexto =
                producto.nombre.toLowerCase().includes(texto) ||
                producto.categoria.toLowerCase().includes(texto);

            const coincideTipo =
                tipoSeleccionado === "todos" ||
                producto.tipo === tipoSeleccionado;

            return coincideTexto && coincideTipo;
        });

        mostrarProductos(resultado);
    }

    // ==================================================
    // ABRIR FORMULARIO
    // ==================================================

    function abrirFormulario() {
        productoEnEdicion = null;

        formNuevoProducto.reset();

        stockMinimoProducto.value = 5;
        disponibleVentaProducto.value = "true";
        disponibleCompraProducto.value = "false";

        tituloFormulario.textContent = "Registrar nuevo producto";
        botonGuardar.textContent = "Guardar producto";

        formularioProducto.hidden = false;
        nombreProducto.focus();
    }

    // ==================================================
    // CERRAR FORMULARIO
    // ==================================================

    function cerrarFormulario() {
        formNuevoProducto.reset();
        formularioProducto.hidden = true;
        productoEnEdicion = null;

        tituloFormulario.textContent = "Registrar nuevo producto";
        botonGuardar.textContent = "Guardar producto";
    }

    // ==================================================
    // REGISTRAR PRODUCTO
    // ==================================================

    function registrarProducto(datos) {
        const existeProducto = productos.some(function (producto) {
            return producto.nombre.toLowerCase() === datos.nombre.toLowerCase();
        });

        if (existeProducto) {
            mensajeProductos.textContent =
                "Ya existe un producto registrado con ese nombre.";

            nombreProducto.focus();
            return;
        }

        const nuevoProducto = {
            id: Date.now(),
            ...datos,
            stock: 0
        };

        productos.push(nuevoProducto);

        if (!guardarProductos()) {
            productos.pop();

            mensajeProductos.textContent =
                "No fue posible guardar el producto.";

            return;
        }

        cerrarFormulario();
        actualizarContadores();

        buscarProducto.value = "";
        filtrarTipo.value = "todos";

        filtrarProductos();

        mensajeProductos.textContent =
            `El producto "${datos.nombre}" fue registrado correctamente.`;
    }

    // ==================================================
    // EDITAR PRODUCTO
    // ==================================================

    function editarProducto(id) {
        const producto = productos.find(
            item => String(item.id) === String(id)
        );

        if (!producto) return;

        productoEnEdicion = producto.id;

        nombreProducto.value = producto.nombre;
        tipoProducto.value = producto.tipo;
        categoriaProducto.value = producto.categoria;
        unidadProducto.value = producto.unidad;
        precioProducto.value = producto.precio;
        stockMinimoProducto.value = producto.stockMinimo;

        disponibleVentaProducto.value =
            String(producto.disponibleVenta);

        disponibleCompraProducto.value =
            String(producto.disponibleCompra);

        tituloFormulario.textContent = "Editar producto";
        botonGuardar.textContent = "Guardar cambios";

        formularioProducto.hidden = false;
        nombreProducto.focus();

        mensajeProductos.textContent =
            `Editando el producto: ${producto.nombre}.`;

        formularioProducto.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    // ==================================================
    // ELIMINAR PRODUCTO
    // ==================================================

    function eliminarProducto(id) {
        const movimientos = JSON.parse(
            localStorage.getItem("genisys_movimientos")
        ) || [];

        const tieneMovimientos = movimientos.some(
            movimiento => Number(movimiento.productoId) === Number(id)
        );

        if (tieneMovimientos) {
            alert(
                "No se puede eliminar este producto porque tiene movimientos registrados en el inventario.\n\n" +
                "Puedes conservarlo para mantener el historial de operaciones."
            );
            return;
        }

        const confirmar = confirm(
            "¿Estás seguro de que deseas eliminar este producto?"
        );

        if (!confirmar) return;

        const productosAnteriores = [...productos];

        productos = productos.filter(
            producto => Number(producto.id) !== Number(id)
        );

        if (!guardarProductos()) {
            productos = productosAnteriores;
            alert("No fue posible eliminar el producto.");
            return;
        }

        actualizarContadores();
        filtrarProductos();

        mensajeProductos.textContent =
            "Producto eliminado correctamente.";
    }

    // ==================================================
    // GUARDAR FORMULARIO
    // ==================================================

    formNuevoProducto.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const datos = {
            nombre: nombreProducto.value.trim(),
            tipo: tipoProducto.value,
            categoria: categoriaProducto.value.trim(),
            unidad: unidadProducto.value,
            precio: Number(precioProducto.value),
            stockMinimo: Number(stockMinimoProducto.value),
            disponibleVenta: disponibleVentaProducto.value === "true",
            disponibleCompra: disponibleCompraProducto.value === "true"
        };

        if (
            datos.nombre === "" ||
            datos.tipo === "" ||
            datos.categoria === "" ||
            datos.unidad === "" ||
            precioProducto.value === "" ||
            stockMinimoProducto.value === "" ||
            !Number.isFinite(datos.precio) ||
            datos.precio < 0 ||
            !Number.isFinite(datos.stockMinimo) ||
            datos.stockMinimo < 0
        ) {
            mensajeProductos.textContent =
                "Verifica que todos los campos estén correctamente diligenciados.";
            return;
        }

        // ----------------------------------------------
        // ACTUALIZAR PRODUCTO
        // ----------------------------------------------

        if (productoEnEdicion !== null) {
            const nombreDuplicado = productos.some(function (producto) {
                return producto.nombre.toLowerCase() === datos.nombre.toLowerCase()
                    && String(producto.id) !== String(productoEnEdicion);
            });

            if (nombreDuplicado) {
                mensajeProductos.textContent =
                    "Ya existe otro producto registrado con ese nombre.";

                nombreProducto.focus();
                return;
            }

            const indice = productos.findIndex(
                producto => String(producto.id) === String(productoEnEdicion)
            );

            if (indice === -1) return;

            const productoAnterior = { ...productos[indice] };

            productos[indice] = {
                ...productos[indice],
                ...datos
            };

            if (!guardarProductos()) {
                productos[indice] = productoAnterior;

                mensajeProductos.textContent =
                    "No fue posible guardar los cambios.";

                return;
            }

            cerrarFormulario();
            actualizarContadores();
            filtrarProductos();

            mensajeProductos.textContent =
                `El producto "${datos.nombre}" fue actualizado correctamente.`;

        } else {
            // ------------------------------------------
            // REGISTRAR PRODUCTO NUEVO
            // ------------------------------------------

            registrarProducto(datos);
        }
    });

    // ==================================================
    // EVENTOS DE LA TABLA
    // ==================================================

    listaProductos.addEventListener("click", function (evento) {
        const boton = evento.target.closest("button[data-accion]");

        if (!boton) return;

        const id = boton.dataset.id;
        const accion = boton.dataset.accion;

        if (accion === "editar") {
            editarProducto(id);
        }

        if (accion === "eliminar") {
            eliminarProducto(id);
        }
    });

    // ==================================================
    // OTROS EVENTOS
    // ==================================================

    buscarProducto.addEventListener("input", filtrarProductos);
    filtrarTipo.addEventListener("change", filtrarProductos);

    btnLimpiarFiltros.addEventListener("click", function () {
        buscarProducto.value = "";
        filtrarTipo.value = "todos";
        filtrarProductos();
    });

    btnNuevoProducto.addEventListener("click", abrirFormulario);
    btnCancelarProducto.addEventListener("click", cerrarFormulario);

    // ==================================================
    // INICIALIZAR MÓDULO
    // ==================================================

    guardarProductos();
    actualizarContadores();
    mostrarProductos();

});
