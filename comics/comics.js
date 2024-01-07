$(document).ready(function () {
    var cartItems = [];
    var datosComics;
    var comicsPorPagina = 16;
    var paginaActual = 1;

    $.ajax({
        url: 'comics.json',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            datosComics = data.comics;
            mostrarComics();
        },
        error: function (error) {
            console.log('Error al cargar el JSON:', error);
        }
    });

    $('#btnOrdenar').on('click', function () {
        mostrarMenuOrdenar();
    });

    $('#ordenarPor').on('change', function () {
        aplicarOrden();
    });

    $('#aplicarOrden').on('click', function () {
        aplicarOrden();
    });

    $('#cargarMas').on('click', function () {
        cargarMasComics();
    });

    $('#mostrarMenos').on('click', function () {
        mostrarMenosComics();
    });

    $(".container").on("click", ".add-to-cart-btn", function () {
        var index = $(this).data("index");
        anadirAlCarrito(datosComics[index]);
    });

    function mostrarComics() {
        var indiceInicio = (paginaActual - 1) * comicsPorPagina;
        var indiceFin = indiceInicio + comicsPorPagina;
        var esPrimeraPagina = (indiceInicio === 0);

        if (esPrimeraPagina) {
            $('#comic-container').html('<div class="row row-cols-2 row-cols-md-4"></div>');
        }

        for (var i = indiceInicio; i < indiceFin && i < datosComics.length; i++) {
            var comic = datosComics[i];
            var cardHtml = `
                <div class="col">
                    <div class="card">
                        <div class="img-wrapper"><img src="${comic.imageSrc}" alt="${comic.altText}"></div>
                        <div class="card-body">
                            <h5 class="card-title">${comic.title}</h5>
                            <h5 class="card-text">${comic.price}</h5>
                            <div class="custom-button">
                                <button class="add-to-cart-btn" data-index="${i}">
                                    <img class="bcarro" src="/img/carrito.png" alt="Carrito de compras">
                                    Añadir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;
            $('#comic-container .row').append(cardHtml);
        }

        if (indiceFin < datosComics.length) {
            $('#cargarMas').show();
            $('#mostrarMenos').hide();
        } else if (!esPrimeraPagina) {
            $('#cargarMas').hide();
            $('#mostrarMenos').show();
        } else {
            $('#cargarMas').hide();
            $('#mostrarMenos').hide();
        }
    }

    function anadirAlCarrito(comic) {
        cartItems.push(comic);
        updateCartUI();
    }

    function updateCartUI() {
        var cartProductsContainer = $("#cartProducts");
        cartProductsContainer.empty();

        cartItems.forEach(function (item) {
            var cartItemContent = `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <span class="cart-item-title">${item.title}</span>
                        <span class="cart-item-price">${item.price}</span>
                    </div>
                    <img src="${item.imageSrc}" alt="${item.altText}">
                </div>`;
            cartProductsContainer.append(cartItemContent);
        });
    }

    function mostrarMenuOrdenar() {
        $('#menuOrdenar').toggle();
    }

    function aplicarOrden() {
        const selectedOptions = $('#ordenarPor').val();

        selectedOptions.forEach(option => {
            switch (option) {
                case 'precioAsc':
                    sortByPrice('asc');
                    break;
                case 'precioDesc':
                    sortByPrice('desc');
                    break;
                case 'tituloAsc':
                    sortByTitle('asc');
                    break;
                case 'tituloDesc':
                    sortByTitle('desc');
                    break;
            }
        });

        mostrarComics();
    }

    function cargarMasComics() {
        paginaActual++;
        mostrarComics();
    }
    
    function mostrarMenosComics() {
            paginaActual = 1;
            mostrarComics();
    }
    

    function sortByPrice(order) {
        datosComics.sort((a, b) => {
            const priceA = parseFloat(a.price.replace('€', '').replace(',', '.'));
            const priceB = parseFloat(b.price.replace('€', '').replace(',', '.'));
            return order === 'asc' ? priceA - priceB : priceB - priceA;
        });
    }

    function sortByTitle(order) {
        datosComics.sort((a, b) => {
            const titleA = a.title.toLowerCase();
            const titleB = b.title.toLowerCase();
            return order === 'asc' ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
        });
    }
});