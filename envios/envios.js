$(document).ready(function () {
    $.ajax({
        url: 'envios.json',
        type: 'GET',
        dataType: 'json',
        success: function (datos) {
            function agregarContenido(titulo, contenido) {
                $('#envios-container').append('<div class="envios-section"><h2>' + titulo + '</h2><h5>' + contenido + '</h5></div>');
            }

            $.each(datos.Principal, function (index, seccion) {
                agregarContenido(seccion.titulo, seccion.contenido);
            });

            $.each(datos.seccion, function (index, seccion) {
                agregarContenido(seccion.titulo1, seccion.contenido0);
            });

            $.each(datos.Principal2, function (index, seccion) {
                agregarContenido(seccion.titulo3, seccion.contenido3);
            });

            $.each(datos.seccion2, function (index, seccion) {
                agregarContenido(seccion.titulo2, seccion.contenido2);
            });

            $('#loading-message').hide();
        },
        error: function (error) {
            console.error('Error al cargar el archivo JSON', error);
            $('#loading-message').text('Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.');
        }
    });
});
