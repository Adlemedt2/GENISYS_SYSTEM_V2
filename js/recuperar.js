// ==================================================
// FORMULARIO DE RECUPERACIÓN DE CONTRASEÑA
// ==================================================

document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("formRecuperar");
    const correo = document.getElementById("correo");
    const mensaje = document.getElementById("mensajeRecuperar");

    formulario.addEventListener("submit", function (evento) {

        evento.preventDefault();

        limpiarMensaje();

        const correoIngresado = correo.value.trim();

        if (correoIngresado === "") {

            mostrarMensaje("Ingresa tu correo electrónico.", "error");
            correo.focus();
            return;

        }

        if (!correo.checkValidity()) {

            mostrarMensaje("Ingresa un correo electrónico válido.", "error");
            correo.focus();
            return;

        }

        mostrarMensaje(
            "Solicitud validada correctamente. La recuperación estará disponible cuando conectemos el sistema con el servidor.",
            "exito"
        );

        formulario.reset();

    });

    function mostrarMensaje(texto, tipo) {

        mensaje.textContent = texto;
        mensaje.className = "mensaje-recuperar " + tipo;

    }

    function limpiarMensaje() {

        mensaje.textContent = "";
        mensaje.className = "mensaje-recuperar";

    }

    correo.addEventListener("input", limpiarMensaje);

});