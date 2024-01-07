$(document).ready(function () {
  var cartItems = [];

  function loadCarousel(data, carouselId) {
    var carousel = $(carouselId + " .carousel-inner");

    data.forEach(function (item, index) {
      var card = $("<div>").addClass("carousel-item");
      var cardContent = `
        <div class="card">
            <div class="img-wrapper"><img src="${item.imageSrc || item.imagenSrc1 || item.imageSrc2}" alt="${item.altText || item.altText01 || item.altText2}"></div>
            <div class="card-body">
                <h5 class="card-title">${item.title || item.titulo1 || item.title2}</h5>
                <h5 class="card-text">${item.price || item.precio1 || item.price2}</h5>
                <div class="custom-button">
                    <button class="add-to-cart-btn" data-item='${JSON.stringify(item)}'>
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

  function addToCart(item) {
    cartItems.push(item);
    updateCartUI();
  }

  function updateCartUI() {
    var cartProductsContainer = $("#cartProducts");
    cartProductsContainer.empty();

    cartItems.forEach(function (item) {
      var cartItemContent = `
        <div class="cart-item">
          <div class="cart-item-info">
            <span class="cart-item-title">${item.title || item.titulo1 || item.title2}</span>
            <span class="cart-item-price">${item.price || item.precio1 || item.price2}</span>
          </div>
          <img src="${item.imageSrc || item.imagenSrc1 || item.imageSrc2}" alt="${item.altText || item.altText01 || item.altText2}">
        </div>`;
      cartProductsContainer.append(cartItemContent);
    });
  }

  $(".carousel").on("click", ".add-to-cart-btn", function() {
    var item = $(this).data("item");
    addToCart(item);
  });

  // Cargar carruseles
  $.ajax({
    url: "interfaz/masnuevos.json",
    dataType: "json",
    success: function (data) {
      loadCarousel(data, "#carouselExampleControls");
    },
    error: function (error) {
      console.log("Error al cargar el carrusel de Los más nuevos:", error);
    }
  });

  $.ajax({
    url: "interfaz/bajanprecio.json",
    dataType: "json",
    success: function (data) {
      loadCarousel(data, "#carouselExampleControls2");
    },
    error: function (error) {
      console.log("Error al cargar el carrusel de Bajan de precio:", error);
    }
  });

  $.ajax({
    url: "interfaz/masvendidos.json",
    dataType: "json",
    success: function (data) {
      loadCarousel(data, "#carouselExampleControls3");
    },
    error: function (error) {
      console.log("Error al cargar el carrusel de Los más vendidos:", error);
    }
  });
});
