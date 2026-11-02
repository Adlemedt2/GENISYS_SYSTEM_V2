
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

    const listaProductos = document.getElementById("listaProductos");
    const mensajeProductos = document.getElementById("mensajeProductos");

    const totalProductos = document.getElementById("totalProductos");
    const totalTerminados = document.getElementById("totalTerminados");
    const totalInsumos = document.getElementById("totalInsumos");


    // ==================================================
    // DATOS DE EJEMPLO
    // ==================================================

    const productos = [

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


    // ==================================================
    // MOSTRAR PRODUCTOS
    // ==================================================

    function mostrarProductos(datos) {

        listaProductos.innerHTML = "";

        if (datos.length === 0) {

            listaProductos.innerHTML = `
                <tr>
                    <td colspan="5">No se encontraron productos.</td>
                </tr>
            `;

            mensajeProductos.textContent = "No hay registros que coincidan con la búsqueda.";
            return;

        }

        mensajeProductos.textContent = `Se encontraron ${datos.length} productos.`;

        datos.forEach(function (producto) {

            const fila = document.createElement("tr");

            const nombre = document.createElement("td");
            nombre.textContent = producto.nombre;

            const tipo = document.createElement("td");
            tipo.textContent = producto.tipo === "terminado"
                ? "Producto terminado"
                : "Materia prima / Insumo";

            const categoria = document.createElement("td");
            categoria.textContent = producto.categoria;

            const unidad = document.createElement("td");
            unidad.textContent = producto.unidad;

            const precio = document.createElement("td");
            precio.textContent = formatearMoneda(producto.precio);

            fila.appendChild(nombre);
            fila.appendChild(tipo);
            fila.appendChild(categoria);
            fila.appendChild(unidad);
            fila.appendChild(precio);

            listaProductos.appendChild(fila);

        });

    }


    // ==================================================
    // FORMATEAR VALORES EN PESOS COLOMBIANOS
    // ==================================================

    function formatearMoneda(valor) {

        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        }).format(valor);

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
    // EVENTOS
    // ==================================================

    buscarProducto.addEventListener("input", filtrarProductos);

    filtrarTipo.addEventListener("change", filtrarProductos);

    btnLimpiarFiltros.addEventListener("click", function () {

        buscarProducto.value = "";
        filtrarTipo.value = "todos";

        filtrarProductos();

    });

    btnNuevoProducto.addEventListener("click", function () {

        mensajeProductos.textContent =
            "La creación de productos estará disponible en la siguiente etapa del módulo.";

    });


    // ==================================================
    // INICIALIZAR MÓDULO
    // ==================================================

    actualizarContadores();
    mostrarProductos(productos);

});
