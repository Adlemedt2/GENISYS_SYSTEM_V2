// ==================================================
// DASHBOARD - GENISYS SYSTEM
// ==================================================

document.addEventListener("DOMContentLoaded", function () {


        // MENÚ HAMBURGUESA DEL DASHBOARD

    const botonMenu = document.getElementById("dashboardMenuToggle");
    const menuDashboard = document.getElementById("dashboardMenu");

    botonMenu.addEventListener("click", function () {

        const abierto = menuDashboard.classList.toggle("abierto");

        botonMenu.setAttribute("aria-expanded", abierto);
        botonMenu.setAttribute(
            "aria-label",
            abierto ? "Cerrar menú" : "Abrir menú"
        );

        botonMenu.textContent = abierto ? "✕" : "☰";

    });

    // Cerrar menú al seleccionar una opción

    menuDashboard.querySelectorAll("a").forEach(enlace => {

        enlace.addEventListener("click", function () {

            menuDashboard.classList.remove("abierto");
            botonMenu.setAttribute("aria-expanded", "false");
            botonMenu.setAttribute("aria-label", "Abrir menú");
            botonMenu.textContent = "☰";

        });

    });
    const CLAVE_PRODUCTOS = "genisys_productos";
    const CLAVE_VENTAS = "genisys_ventas";
    const CLAVE_COMPRAS = "genisys_compras";

    const obtenerDatos = (clave) => {
        try {
            return JSON.parse(localStorage.getItem(clave)) || [];
        } catch (error) {
            console.error("Error leyendo:", clave, error);
            return [];
        }
    };

    const formatoMoneda = (valor) =>
        new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        }).format(Number(valor) || 0);

    const fechaLocal = (fecha = new Date()) => {
        const anio = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, "0");
        const dia = String(fecha.getDate()).padStart(2, "0");

        return `${anio}-${mes}-${dia}`;
    };

    const obtenerFecha = (registro) => {
        if (!registro.fecha) return "";

        const fecha = String(registro.fecha).slice(0, 10);

        if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
            return fecha;
        }

        const fechaConvertida = new Date(registro.fecha);

        if (Number.isNaN(fechaConvertida.getTime())) return "";

        return fechaLocal(fechaConvertida);
    };

    function actualizarFecha() {
        const elemento = document.getElementById("fechaActual");

        elemento.textContent = new Intl.DateTimeFormat("es-CO", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }).format(new Date());
    }

    function actualizarIndicadores() {

        const productos = obtenerDatos(CLAVE_PRODUCTOS);
        const ventas = obtenerDatos(CLAVE_VENTAS);
        const compras = obtenerDatos(CLAVE_COMPRAS);

        const hoy = fechaLocal();

        const ventasHoy = ventas
            .filter(venta => obtenerFecha(venta) === hoy)
            .reduce((total, venta) => total + Number(venta.total || 0), 0);

        const comprasHoy = compras
            .filter(compra => obtenerFecha(compra) === hoy)
            .reduce((total, compra) => total + Number(compra.total || 0), 0);

        const stockBajo = productos.filter(producto => {
            const stock = Number(producto.stock || 0);
            const minimo = Number(producto.stockMinimo || 0);

            return stock <= minimo;
        });

        document.getElementById("dashboardVentas").textContent =
            formatoMoneda(ventasHoy);

        document.getElementById("dashboardCompras").textContent =
            formatoMoneda(comprasHoy);

        document.getElementById("dashboardProductos").textContent =
            productos.length;

        document.getElementById("dashboardStockBajo").textContent =
            stockBajo.length;

        mostrarAlertas(stockBajo);
        mostrarActividad(ventas, compras);
    }

    function mostrarAlertas(productos) {

        const contenedor = document.getElementById("dashboardListaAlertas");

        if (productos.length === 0) {
            contenedor.innerHTML = `
                <div class="dashboard-alerta-vacia">
                    <span>✓</span>
                    <div>
                        <strong>Inventario en orden</strong>
                        <small>No hay productos con stock bajo.</small>
                    </div>
                </div>
            `;
            return;
        }

        contenedor.innerHTML = productos
            .sort((a, b) => Number(a.stock) - Number(b.stock))
            .slice(0, 5)
            .map(producto => {

                const stock = Number(producto.stock || 0);
                const agotado = stock <= 0;

                return `
                    <div class="dashboard-alerta-item">
                        <span class="alerta-punto ${agotado ? "agotado" : ""}"></span>
                        <div>
                            <strong>${escaparHTML(producto.nombre)}</strong>
                            <small>${agotado ? "Existencia agotada" : "Existencia por debajo del mínimo"}</small>
                        </div>
                        <b>${stock} ${escaparHTML(producto.unidad || "")}</b>
                    </div>
                `;
            }).join("");
    }

    function mostrarActividad(ventas, compras) {

        const contenedor = document.getElementById("dashboardActividad");

        const movimientos = [
            ...ventas.map(venta => ({
                tipo: "Venta",
                referencia: venta.numero || `V-${venta.id}`,
                fecha: venta.fecha,
                total: venta.total,
                clase: "actividad-venta"
            })),

            ...compras.map(compra => ({
                tipo: "Compra",
                referencia: compra.numero || `C-${compra.id}`,
                fecha: compra.fecha,
                total: compra.total,
                clase: "actividad-compra"
            }))
        ];

        movimientos.sort((a, b) =>
            new Date(b.fecha) - new Date(a.fecha)
        );

        const recientes = movimientos.slice(0, 6);

        if (recientes.length === 0) {
            contenedor.innerHTML = `
                <tr>
                    <td colspan="4">Todavía no hay operaciones registradas.</td>
                </tr>
            `;
            return;
        }

        contenedor.innerHTML = recientes.map(movimiento => `
            <tr>
                <td>
                    <span class="actividad-tipo ${movimiento.clase}">
                        ${movimiento.tipo}
                    </span>
                </td>
                <td>${escaparHTML(movimiento.referencia)}</td>
                <td>${formatearFecha(movimiento.fecha)}</td>
                <td><strong>${formatoMoneda(movimiento.total)}</strong></td>
            </tr>
        `).join("");
    }

    function formatearFecha(fecha) {
        if (!fecha) return "Sin fecha";

        const valor = String(fecha).slice(0, 10);
        const partes = valor.split("-");

        if (partes.length !== 3) return valor;

        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    function escaparHTML(valor) {
        return String(valor ?? "").replace(/[&<>"']/g, caracter => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[caracter]);
    }

    actualizarFecha();
    actualizarIndicadores();

});