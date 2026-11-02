
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


    // Recuperar registros guardados o cargar datos iniciales
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


    // Guardar productos en el navegador
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

            celda.colSpan = 5;
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
    // ABRIR FORMULARIO
    // ==================================================

    function abrirFormulario() {

        formularioProducto.hidden = false;
        nombreProducto.focus();

    }


    // ==================================================
    // CERRAR FORMULARIO
    // ==================================================

    function cerrarFormulario() {

        formNuevoProducto.reset();
        formularioProducto.hidden = true;

    }


    // ==================================================
    // REGISTRAR NUEVO PRODUCTO
    // ==================================================

    formNuevoProducto.addEventListener("submit", function (evento) {

        evento.preventDefault();

        const nombre = nombreProducto.value.trim();
        const tipo = tipoProducto.value;
        const categoria = categoriaProducto.value.trim();
        const unidad = unidadProducto.value;
        const precio = Number(precioProducto.value);

        if (
            nombre === "" ||
            tipo === "" ||
            categoria === "" ||
            unidad === "" ||
            precioProducto.value === "" ||
            !Number.isFinite(precio) ||
            precio < 0
        ) {

            mensajeProductos.textContent =
                "Verifica que todos los campos estén correctamente diligenciados.";

            return;

        }

        const existeProducto = productos.some(function (producto) {

            return producto.nombre.toLowerCase() === nombre.toLowerCase();

        });

        if (existeProducto) {

            mensajeProductos.textContent =
                "Ya existe un producto registrado con ese nombre.";

            nombreProducto.focus();
            return;

        }

        const nuevoProducto = {

            id: Date.now(),
            nombre: nombre,
            tipo: tipo,
            categoria: categoria,
            unidad: unidad,
            precio: precio

        };

        productos.push(nuevoProducto);

        if (!guardarProductos()) {

            productos.pop();

            mensajeProductos.textContent =
                "No fue posible guardar el producto en el navegador.";

            return;

        }

        actualizarContadores();

        buscarProducto.value = "";
        filtrarTipo.value = "todos";

        filtrarProductos();

        cerrarFormulario();

        mensajeProductos.textContent =
            `El producto "${nombre}" fue registrado correctamente.`;

    });


    // ==================================================
    // EVENTOS
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
