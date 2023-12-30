$(document).ready(function () {
  function loadCarousel(data, carouselId) {
    var carousel = $(carouselId + " .carousel-inner");

    data.forEach(function (item, index) {
      var card = $("<div>").addClass("carousel-item");
      var cardContent = `
        <div class="card">
            <div class="img-wrapper"><img src="${item.imageSrc}" alt="${item.altText}"></div>
            <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <h5 class="card-text">${item.price}</h5>
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
  // Cargar carrusel 3
  $.ajax({
    url: "interfaz/masnuevos.json",
    dataType: "json",
    success: function (data) {
      loadCarousel(data, "#carouselExampleControls");
    },
    error: function (error) {
      console.log("Error al cargar el carrusel 1:", error);
    }
  });

});