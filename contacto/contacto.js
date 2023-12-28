$(document).ready(function () {
    // Utilizamos Ajax para cargar el archivo JSON
    $.ajax({
        // Ajusta la ruta del archivo JSON según la ubicación
        url: 'contacto.json',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            // Función para agregar contenido de contacto
            function agregarContenidoContacto(titulo, contenido, contenido2, contenido3, contenido4, contenido5) {
                $('#contacto-container').append('<div class="contacto-section"><h2>' + titulo + '</h2><h5>' + contenido + '</h5><h5>' + contenido2 + '</h5><h5>' + contenido3 + '</h5><h5>'  + contenido4 + '</h5><h5>' + contenido5 + '</h5></div>');
            }

            // Función para agregar contenido de redes sociales
            function agregarContenidoRedesSociales(redes) {
                $('#contacto-container').append('<div class="contacto-section"><h2>' + redes.titulo + '</h2><div id="redes"></div></div>');
                $.each(redes.redes, function (index, red) {
                    $('#redes').append('<a href="' + red.enlace + '" target="_blank"><img src="' + red.imagen + '" alt="' + red.nombre + '" class="red-social" /></a>');
                });
            }

            // Iteramos sobre las secciones del JSON y agregamos el contenido
            $.each(data.secciones, function (index, seccion) {
                if (seccion.titulo === 'Contacto') {
                    agregarContenidoContacto(seccion.titulo, seccion.contenido, seccion.contenido2, seccion.contenido3, seccion.contenido4, seccion.contenido5);
                } else if (seccion.titulo === 'Redes Sociales') {
                    agregarContenidoRedesSociales(seccion);
                }
            });

            // Ocultamos el mensaje de carga una vez que se han cargado los datos
            $('#loading-message').hide();
        },
        error: function (error) {
            console.error('Error al cargar el archivo JSON', error);
            // Muestra un mensaje de error si no se puede cargar el archivo
            $('#loading-message').text('Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.');
        }
    });
});
