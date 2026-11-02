// ==================================================
// FORMULARIO DE REGISTRO
// ==================================================

document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("formRegistro");

    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");
    const usuario = document.getElementById("usuario");
    const contrasena = document.getElementById("contrasena");
    const confirmar = document.getElementById("confirmar");

    const terminos = formulario.querySelector('[name="terminos"]');
    const mensaje = document.getElementById("mensajeRegistro");

    formulario.addEventListener("submit", function (evento) {

        evento.preventDefault();

        limpiarMensaje();

        // Validar campos obligatorios
        const campos = [
            nombre,
            correo,
            usuario,
            contrasena,
            confirmar
        ];

        for (const campo of campos) {

            if (campo.value.trim() === "") {
                mostrarMensaje("Todos los campos son obligatorios.", "error");
                campo.focus();
                return;
            }
        }

        // Validar correo electrónico
        if (!correo.checkValidity()) {
            mostrarMensaje("Ingresa un correo electrónico válido.", "error");
            correo.focus();
            return;
        }

        // Validar longitud de contraseña
        if (contrasena.value.length < 8) {
            mostrarMensaje("La contraseña debe tener al menos 8 caracteres.", "error");
            contrasena.focus();
            return;
        }

        // Comprobar coincidencia de contraseñas
        if (contrasena.value !== confirmar.value) {
            mostrarMensaje("Las contraseñas no coinciden.", "error");
            confirmar.focus();
            return;
        }

        // Validar aceptación de términos
        if (!terminos.checked) {
            mostrarMensaje("Debes aceptar los términos y condiciones.", "error");
            terminos.focus();
            return;
        }

        mostrarMensaje(
            "¡Formulario validado correctamente! El registro estará disponible cuando conectemos el sistema con el servidor.",
            "exito"
        );

    });

    // Mostrar mensajes
    function mostrarMensaje(texto, tipo) {

        mensaje.textContent = texto;
        mensaje.className = "mensaje-registro " + tipo;

    }

    // Limpiar mensajes
    function limpiarMensaje() {

        mensaje.textContent = "";
        mensaje.className = "mensaje-registro";

    }

    // Limpiar mensajes cuando cambien los datos
    formulario.addEventListener("input", limpiarMensaje);
    formulario.addEventListener("change", limpiarMensaje);

});