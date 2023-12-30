$(document).ready(function () {
    $.ajax({
        url: 'sobrenosotros.json',
        type: 'GET',
        dataType: 'json',
        success: function (sobreNosotros) {
            function agregarContenidoSobreNosotros(titulo, contenido, contenido2) {
                $('#nosotros-container').append('<div class="nosotros-section"><h2>' + titulo + '</h2><h5>' + contenido + '</h5><h5>' + contenido2 + '</h5></div>');
            }

            $.each(sobreNosotros.secciones, function (index, seccion) {
                agregarContenidoSobreNosotros(seccion.titulo, seccion.contenido, seccion.contenido2);
            });

            $('#loading-message').hide();
        },
        error: function (error) {
            console.error('Error al cargar el archivo JSON', error);
            $('#loading-message').text('Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.');
        }
    });
});
