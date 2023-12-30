$(document).ready(function () {
    $.ajax({
      url: 'avisolegal.json',
      type: 'GET',
      dataType: 'json',
      success: function (avisosLegales) {
        function agregarContenidoLegal(titulo, contenido) {
          $('#legal-container').append('<div class="legal-section"><h2>' + titulo + '</h2><h5>' + contenido + '</h5></div>');
        }

        $.each(avisosLegales.secciones, function (index, seccion) {
          agregarContenidoLegal(seccion.titulo, seccion.contenido);
        });

        $('#loading-message').hide();
      },
      error: function (error) {
        console.error('Error al cargar el archivo JSON', error);
        $('#loading-message').text('Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.');
      }
    });
  });
  