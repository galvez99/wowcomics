$(document).ready(function () {
  function initializeCarousel(carouselId) {
    var multipleCardCarousel = $(carouselId);

    if (window.matchMedia("(min-width: 768px)").matches) {
      var carousel = new bootstrap.Carousel(multipleCardCarousel[0], {
        interval: false,
      });

      var scrollPosition = 0;

      $(carouselId + " .carousel-control-next").on("click", function () {
        var cardWidth = $(carouselId + " .carousel-item").width();
        var maxScrollPosition =
          $(carouselId + " .carousel-inner")[0].scrollWidth - cardWidth * 4;

        if (scrollPosition < maxScrollPosition) {
          scrollPosition += cardWidth;
          $(carouselId + " .carousel-inner").animate(
            { scrollLeft: scrollPosition },
            600
          );
        }
      });

      $(carouselId + " .carousel-control-prev").on("click", function () {
        if (scrollPosition > 0) {
          var cardWidth = $(carouselId + " .carousel-item").width();
          scrollPosition -= cardWidth;
          $(carouselId + " .carousel-inner").animate(
            { scrollLeft: scrollPosition },
            600
          );
        }
      });
    } else {
      $(multipleCardCarousel).addClass("slide");
    }
  }

  // Función para cargar el carrusel con datos
  function loadCarousel(data, carouselId) {
    // Lógica para cargar el carrusel con datos
  }

  // Inicializar carruseles
  initializeCarousel("#carouselExampleControls");
  initializeCarousel("#carouselExampleControls2");
  initializeCarousel("#carouselExampleControls3");

  // Cargar datos y llenar carruseles
  $.ajax({
    url: "interfaz/masnuevos.json",
    dataType: "json",
    success: function (data) {
      loadCarousel(data, "#carouselExampleControls");
    },
    error: function (error) {
      console.log("Error al cargar el carrusel 1:", error);
    },
  });

  $.ajax({
    url: "interfaz/bajanprecio.json",
    dataType: "json",
    success: function (data) {
      loadCarousel(data, "#carouselExampleControls2");
    },
    error: function (error) {
      console.log("Error al cargar el carrusel 2:", error);
    },
  });

  $.ajax({
    url: "interfaz/masvendidos.json",
    dataType: "json",
    success: function (data) {
      loadCarousel(data, "#carouselExampleControls3");
    },
    error: function (error) {
      console.log("Error al cargar el carrusel 3:", error);
    },
  });
});
