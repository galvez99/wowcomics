$(document).ready(function() {
    $.ajax({
      url: 'comics.json', 
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        // Agrega la estructura de la fila antes del bucle de tarjetas
        $('#comic-container').append('<div class="row row-cols-2 row-cols-md-4"></div>');
  
        $.each(data.comics, function(index, comic) {
          var cardHtml = `
            <div class="col">
              <div class="card">
                <div class="img-wrapper"><img src="${comic.imageSrc}" alt="${comic.altText}"></div>
                <div class="card-body">
                  <h5 class="card-title">${comic.title}</h5>
                  <h5 class="card-text">${comic.price}</h5>
                  <div class="custom-button">
                    <button onclick="addToCart()">
                      <img class="bcarro" src="/img/carrito.png" alt="Carrito de compras">
                      Añadir
                    </button>
                  </div>
                </div>
              </div>
            </div>`;
  
          // Agrega la tarjeta al contenedor de la fila
          $('#comic-container .row').append(cardHtml);
        });
      },
      error: function(error) {
        console.log('Error al cargar el JSON:', error);
      }
    });
  });
  
  function addToCart() {
    console.log('Añadido al carrito');
  }
  