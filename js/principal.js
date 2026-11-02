// ==================================================
// MENÚ DE NAVEGACIÓN
// ==================================================

document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.getElementById("menuToggle");
    const menuNavegacion = document.getElementById("menuNavegacion");

    // Comprobar que los elementos existen
    if (!menuToggle || !menuNavegacion) {
        console.error("No se encontraron los elementos del menú.");
        return;
    }

    // Abrir y cerrar el menú
    menuToggle.addEventListener("click", function () {

        menuNavegacion.classList.toggle("activo");

        const menuAbierto = menuNavegacion.classList.contains("activo");

        menuToggle.setAttribute("aria-expanded", menuAbierto);
        menuToggle.textContent = menuAbierto ? "✕" : "☰";

    });

    // Cerrar el menú al seleccionar una opción
    const enlacesMenu = menuNavegacion.querySelectorAll("a");

    enlacesMenu.forEach(function (enlace) {

        enlace.addEventListener("click", function () {

            menuNavegacion.classList.remove("activo");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "☰";

        });

    });

});