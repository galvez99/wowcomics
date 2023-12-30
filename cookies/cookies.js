$(document).ready(function () {
    $.ajax({
        url: 'cookies.json',
        type: 'GET',
        dataType: 'json',
        success: function (datos) {
            function agregarContenido(titulo, contenido) {
                $('#cookies-container').append('<div class="cookies-section"><h2>' + titulo + '</h2><h5>' + contenido + '</h5></div>');
            }

            $.each(datos.secciones, function (index, seccion) {
                agregarContenido(seccion.titulo, seccion.contenido);
            });

            $.each(datos.seccion2, function (index, seccion) {
                agregarContenido(seccion.titulo1, seccion.contenido0 + '<br>' + seccion.contenido2 + '<br>' + seccion.contenido3 + '<br>' + seccion.contenido4);
            });

            $.each(datos.seccion3, function (index, seccion) {
                agregarContenido(seccion.titulo2, seccion.contenido1);
            });

            $('#loading-message').hide();
        },
        error: function (error) {
            console.error('Error al cargar el archivo JSON', error);
            $('#loading-message').text('Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.');
        }
    });
});
