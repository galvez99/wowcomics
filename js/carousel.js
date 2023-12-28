function initializeCarousel(carouselId) {
    var multipleCardCarousel = document.querySelector(carouselId);
  
    if (window.matchMedia("(min-width: 768px)").matches) {
      var carousel = new bootstrap.Carousel(multipleCardCarousel, {
        interval: false,
      });
  
      var carouselWidth = $(carouselId + " .carousel-inner")[0].scrollWidth;
      var cardWidth = $(carouselId + " .carousel-item").width();
      var scrollPosition = 0;
  
      $(carouselId + " .carousel-control-next").on("click", function () {
        if (scrollPosition < carouselWidth - cardWidth * 4) {
          scrollPosition += cardWidth;
          $(carouselId + " .carousel-inner").animate(
            { scrollLeft: scrollPosition },
            600
          );
        }
      });
  
      $(carouselId + " .carousel-control-prev").on("click", function () {
        if (scrollPosition > 0) {
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
  
  // Inicializar cada carousel con la función
  initializeCarousel("#carouselExampleControls");
  initializeCarousel("#carouselExampleControls2");
  initializeCarousel("#carouselExampleControls3");
  