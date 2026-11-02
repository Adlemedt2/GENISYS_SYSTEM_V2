
// ==================================================
// MÓDULO DE PRODUCTOS - GENISYS SYSTEM
// ==================================================

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

    const tituloFormulario = formularioProducto.querySelector("h2");
    const botonGuardar = formNuevoProducto.querySelector('[type="submit"]');

    // ==================================================
    // ALMACENAMIENTO LOCAL
    // ==================================================

    const CLAVE_PRODUCTOS = "genisys_productos";

    const productosIniciales = [
        {
            id: 1,
            nombre: "Dedito de queso",
            tipo: "terminado",
            categoria: "Pasabocas",
            unidad: "Unidad",
            precio: 2500
        },
        {
            id: 2,
            nombre: "Empanada de carne",
            tipo: "terminado",
            categoria: "Empanadas",
            unidad: "Unidad",
            precio: 3000
        },
        {
            id: 3,
            nombre: "Pastelito de pollo",
            tipo: "terminado",
            categoria: "Pastelitos",
            unidad: "Unidad",
            precio: 3500
        },
        {
            id: 4,
            nombre: "Panzerotti",
            tipo: "terminado",
            categoria: "Pasabocas",
            unidad: "Unidad",
            precio: 5000
        },
        {
            id: 5,
            nombre: "Harina de trigo",
            tipo: "insumo",
            categoria: "Materias primas",
            unidad: "Kilogramo",
            precio: 4500
        },
        {
            id: 6,
            nombre: "Queso mozzarella",
            tipo: "insumo",
            categoria: "Lácteos",
            unidad: "Kilogramo",
            precio: 18000
        },
        {
            id: 7,
            nombre: "Carne molida",
            tipo: "insumo",
            categoria: "Carnes",
            unidad: "Kilogramo",
            precio: 22000
        },
        {
            id: 8,
            nombre: "Aceite vegetal",
            tipo: "insumo",
            categoria: "Insumos",
            unidad: "Litro",
            precio: 9500
        }
    ];

    function cargarProductos() {

        try {

            const datosGuardados = localStorage.getItem(CLAVE_PRODUCTOS);

            if (datosGuardados !== null) {

                const datos = JSON.parse(datosGuardados);

                if (Array.isArray(datos)) {
                    return datos;
                }

            }

        } catch (error) {

            console.error("Error al recuperar los productos:", error);

        }

        return [...productosIniciales];

    }

    let productos = cargarProductos();
    let productoEnEdicion = null;

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
    // FORMATEAR MONEDA
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

    function mostrarProductos(datos) {

        listaProductos.innerHTML = "";

        if (datos.length === 0) {

            const fila = document.createElement("tr");
            const celda = document.createElement("td");

            celda.colSpan = 6;
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
                formatearMoneda(producto.precio)
            ];

            valores.forEach(function (valor) {

                const celda = document.createElement("td");
                celda.textContent = valor;
                fila.appendChild(celda);

            });

            // Columna de acciones
            const celdaAcciones = document.createElement("td");

            const btnEditar = document.createElement("button");
            btnEditar.type = "button";
            btnEditar.textContent = "Editar";
            btnEditar.className = "btn-accion btn-editar";
            btnEditar.dataset.id = producto.id;
            btnEditar.dataset.accion = "editar";
            btnEditar.setAttribute("aria-label", `Editar ${producto.nombre}`);

            const btnEliminar = document.createElement("button");
            btnEliminar.type = "button";
            btnEliminar.textContent = "Eliminar";
            btnEliminar.className = "btn-accion btn-eliminar";
            btnEliminar.dataset.id = producto.id;
            btnEliminar.dataset.accion = "eliminar";
            btnEliminar.setAttribute("aria-label", `Eliminar ${producto.nombre}`);

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

        totalTerminados.textContent = productos.filter(function (producto) {
            return producto.tipo === "terminado";
        }).length;

        totalInsumos.textContent = productos.filter(function (producto) {
            return producto.tipo === "insumo";
        }).length;

    }

    // ==================================================
    // BUSCAR Y FILTRAR PRODUCTOS
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
    // ABRIR Y CERRAR FORMULARIO
    // ==================================================

    function abrirFormulario() {

        productoEnEdicion = null;

        formNuevoProducto.reset();

        tituloFormulario.textContent = "Registrar nuevo producto";
        botonGuardar.textContent = "Guardar producto";

        formularioProducto.hidden = false;
        nombreProducto.focus();

    }

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
            ...datos
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

        const producto = productos.find(function (item) {
            return String(item.id) === String(id);
        });

        if (!producto) {
            return;
        }

        productoEnEdicion = producto.id;

        nombreProducto.value = producto.nombre;
        tipoProducto.value = producto.tipo;
        categoriaProducto.value = producto.categoria;
        unidadProducto.value = producto.unidad;
        precioProducto.value = producto.precio;

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

        const producto = productos.find(function (item) {
            return String(item.id) === String(id);
        });

        if (!producto) {
            return;
        }

        const confirmar = window.confirm(
            `¿Estás seguro de que deseas eliminar "${producto.nombre}"?`
        );

        if (!confirmar) {
            return;
        }

        const indice = productos.findIndex(function (item) {
            return String(item.id) === String(id);
        });

        const productoEliminado = productos.splice(indice, 1)[0];

        if (!guardarProductos()) {

            productos.splice(indice, 0, productoEliminado);

            mensajeProductos.textContent =
                "No fue posible eliminar el producto.";

            return;

        }

        actualizarContadores();
        filtrarProductos();

        mensajeProductos.textContent =
            `El producto "${producto.nombre}" fue eliminado correctamente.`;

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
            precio: Number(precioProducto.value)
        };

        if (
            datos.nombre === "" ||
            datos.tipo === "" ||
            datos.categoria === "" ||
            datos.unidad === "" ||
            precioProducto.value === "" ||
            !Number.isFinite(datos.precio) ||
            datos.precio < 0
        ) {

            mensajeProductos.textContent =
                "Verifica que todos los campos estén correctamente diligenciados.";

            return;

        }

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

            const indice = productos.findIndex(function (producto) {
                return String(producto.id) === String(productoEnEdicion);
            });

            if (indice === -1) {
                return;
            }

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

            registrarProducto(datos);

        }

    });

    // ==================================================
    // EVENTOS DE LA TABLA
    // ==================================================

    listaProductos.addEventListener("click", function (evento) {

        const boton = evento.target.closest("button[data-accion]");

        if (!boton) {
            return;
        }

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

    actualizarContadores();
    mostrarProductos(productos);

});
