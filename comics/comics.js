$(document).ready(function () {
    var cartItems = [];
    var datosComics;
    var comicsPorPagina = 16;
    var paginaActual = 1;

    function cargarDatosComics() {
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
    }

    function toggleFiltroPrecio() {
        $('#filtroDropdownPrecio').toggle();
    }

    function clickFiltroPrecio() {
        aplicarFiltro();
    }

    function clickOrdenar() {
        mostrarMenuOrdenar();
    }

    function changeOrdenar() {
        aplicarOrden();
    }

    function clickAplicarOrden() {
        aplicarOrden();
    }

    function clickCargarMas() {
        cargarMasComics();
    }

    function clickMostrarMenos() {
        mostrarMenosComics();
    }

    function clickAddToCart() {
        var index = $(this).data("index");
        anadirAlCarrito(datosComics[index]);
    }

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

        cartItems.forEach(function (item, index) {
            var cartItemContent = `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h5 class="cart-item-title">${item.title || item.titulo1 || item.title2}</h5>
                        <h5 class="cart-item-price">${item.price || item.precio1 || item.precio2}</h5>
                    </div>
                    <img src="${item.imageSrc || item.imagenSrc1 || item.imagenSrc2}" alt="${item.altText || item.altText01 || item.altText2}" class="imagenproducto">
                    <div class="quantity-dropdown">
                        <label for="quantity${index}">Cantidad:</label>
                        <select id="quantity${index}" class="quantity-selector" data-index="${index}">
                            ${generateQuantityOptions(item.quantity)}
                        </select>
                    </div>
                    <button class="remove-from-cart-btn" data-index="${index}" data-quantity="${item.quantity || 1}">X</button>
                </div>`;
            cartProductsContainer.append(cartItemContent);
        });

        var totalPrice = cartItems.reduce(function (acc, item) {
            return acc + parseFloat(item.price || item.precio1 || item.precio2) * (item.quantity || 1);
        }, 0);

        var totalContent = `<h5 class="cart-total">Total: ${totalPrice.toFixed(2)}</h5>`;
        cartProductsContainer.append(totalContent);

        $(".remove-from-cart-btn").click(function () {
            var indexToRemove = $(this).data("index");
            cartItems.splice(indexToRemove, 1);
            updateCartUI();
        });

        $(".quantity-selector").change(function () {
            var index = $(this).data("index");
            var newQuantity = parseInt($(this).val());

            if (newQuantity === 0) {
                cartItems.splice(index, 1);
            } else {
                cartItems[index].quantity = newQuantity;
            }

            updateCartUI();
        });
    }

    function generateQuantityOptions(selectedQuantity) {
        var options = "";
        for (var i = 0; i <= 10; i++) {
            options += `<option value="${i}" ${i === selectedQuantity || (i === 1 && selectedQuantity === undefined) ? 'selected' : ''}>${i}</option>`;
        }
        return options;
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

    function aplicarFiltro() {
        var comicsFiltrados = filtrarComics();
        datosComics = comicsFiltrados;
        paginaActual = 1;
        mostrarComics();
        $('#filtroDropdownPrecio').hide();
    }

    function filtrarComics() {
        var selectedPublishers = $('#publisherFilter').val();
        var precioMin = parseFloat($('#precioMin').val()) || 0;
        var precioMax = parseFloat($('#precioMax').val()) || Number.MAX_VALUE;
        var filteredComics = datosComics.filter(function (comic) {
            var precio = parseFloat(comic.price.replace('€', '').replace(',', '.'));
            return (
                (selectedPublishers.length === 0 || selectedPublishers.includes(comic.publisher)) &&
                precio >= precioMin &&
                precio <= precioMax
            );
        });

        return filteredComics;
    }

    // Event Listeners
    cargarDatosComics();

    $('#filtrarPorPrecio').on('click', toggleFiltroPrecio);
    $('#aplicarFiltroPrecio').on('click', clickFiltroPrecio);
    $('#btnOrdenar').on('click', clickOrdenar);
    $('#ordenarPor').on('change', changeOrdenar);
    $('#aplicarOrden').on('click', clickAplicarOrden);
    $('#cargarMas').on('click', clickCargarMas);
    $('#mostrarMenos').on('click', clickMostrarMenos);
    $(".container").on("click", ".add-to-cart-btn", clickAddToCart);
});
