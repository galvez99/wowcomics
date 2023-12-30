$(document).ready(function () {
    function loadCarousel(data, carouselId) {
      var carousel = $(carouselId + " .carousel-inner");

      data.forEach(function (item, index) {
        var card = $("<div>").addClass("carousel-item");
        var cardContent = `
          <div class="card">
              <div class="img-wrapper"><img src="${item.imagenSrc1}" alt="${item.altText01}"></div>
              <div class="card-body">
                  <h5 class="card-title">${item.titulo1}</h5>
                  <h5 class="card-text"><del style="color: gray;">${item.precioOriginal1}</del> &nbsp;${item.precio1}</h5>
                  <div class="custom-button">
                      <button onclick="addToCart()">
                          <img class="bcarro" src="img/carrito.png" alt="Carrito de compras">
                          Añadir
                      </button>
                  </div>
              </div>
          </div>`;

        card.html(cardContent);
        carousel.append(card);

        if (index === 0) {
          card.addClass("active");
        }
      });
    }
    // Cargar carrusel 2
    $.ajax({
      url: "interfaz/bajanprecio.json",
      dataType: "json",
      success: function (data) {
        loadCarousel(data, "#carouselExampleControls2");
      },
      error: function (error) {
        console.log("Error al cargar el carrusel 2:", error);
      }
    });
  });