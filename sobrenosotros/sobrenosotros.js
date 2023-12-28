$(document).ready(function () {
    // Utilizamos Ajax para cargar el archivo JSON
    $.ajax({
        // Ajusta la ruta del archivo JSON según la ubicación
        url: 'sobrenosotros.json',
        type: 'GET',
        dataType: 'json',
        success: function (sobreNosotros) {
            // Función para agregar contenido legal
            function agregarContenidoSobreNosotros(titulo, contenido, contenido2) {
                $('#nosotros-container').append('<div class="nosotros-section"><h2>' + titulo + '</h2><h5>' + contenido + '</h5><h5>' + contenido2 + '</h5></div>');
            }

            // Iteramos sobre las secciones del JSON y agregamos el contenido
            $.each(sobreNosotros.secciones, function (index, seccion) {
                agregarContenidoSobreNosotros(seccion.titulo, seccion.contenido, seccion.contenido2);
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
