// ==================================================
// FORMULARIO DE INICIO DE SESIÓN
// ==================================================

document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("formLogin");
    const correo = document.getElementById("correo");
    const contrasena = document.getElementById("contrasena");
    const mensaje = document.getElementById("mensajeLogin");

    formulario.addEventListener("submit", function (evento) {

        evento.preventDefault();

        mensaje.textContent = "";
        mensaje.className = "mensaje-login";

        const correoIngresado = correo.value.trim();
        const contrasenaIngresada = contrasena.value.trim();

        if (correoIngresado === "" || contrasenaIngresada === "") {

            mostrarMensaje("Todos los campos son obligatorios.", "error");
            return;

        }

        if (!correo.checkValidity()) {

            mostrarMensaje("Ingresa un correo electrónico válido.", "error");
            correo.focus();
            return;

        }

        mostrarMensaje(
            "Formulario validado correctamente. La autenticación estará disponible al conectar el sistema con el servidor.",
            "exito"
        );

    });

    function mostrarMensaje(texto, tipo) {

        mensaje.textContent = texto;
        mensaje.classList.add(tipo);

    }

    // Limpiar mensaje cuando el usuario modifica los campos
    correo.addEventListener("input", limpiarMensaje);
    contrasena.addEventListener("input", limpiarMensaje);

    function limpiarMensaje() {

        mensaje.textContent = "";
        mensaje.className = "mensaje-login";

    }

});