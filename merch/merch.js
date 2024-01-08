$(document).ready(function () {
    var cartItems = [];
    var datosMerchandising;
    var merchPorPagina = 16;
    var paginaActual = 1;

    $.ajax({
        url: 'merch.json',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            datosMerchandising = data.merchandising;
            mostrarMerchandising();
        },
        error: function (error) {
            console.log('Error al cargar el JSON:', error);
        }
    });

    $('#filtrarPorPrecio').on('click', toggleFiltroPrecio);
    $('#aplicarFiltroPrecio').on('click', clickFiltroPrecio);
    $('#btnOrdenar').on('click', clickOrdenar);
    $('#ordenarPor').on('change', changeOrdenar);
    $('#aplicarOrden').on('click', clickAplicarOrden);
    $('#cargarMas').on('click', clickCargarMas);
    $('#mostrarMenos').on('click', clickMostrarMenos);
    $(".container").on("click", ".add-to-cart-btn", clickAddToCart);

    function mostrarMerchandising() {
        var indiceInicio = (paginaActual - 1) * merchPorPagina;
        var indiceFin = indiceInicio + merchPorPagina;
        var esPrimeraPagina = (indiceInicio === 0);

        if (esPrimeraPagina) {
            $('#merch-container').html('<div class="row row-cols-2 row-cols-md-4"></div>');
        }

        for (var i = indiceInicio; i < indiceFin && i < datosMerchandising.length; i++) {
            var merch = datosMerchandising[i];
            var cardHtml = `
                <div class="col">
                    <div class="card">
                        <div class="img-wrapper"><img src="${merch.imageSrc}" alt="${merch.altText}"></div>
                        <div class="card-body">
                            <h5 class="card-title">${merch.title}</h5>
                            <h5 class="card-text">${merch.price}</h5>
                            <div class="custom-button">
                                <button class="add-to-cart-btn" data-index="${i}">
                                    <img class="bcarro" src="/img/carrito.png" alt="Carrito de compras">
                                    Añadir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;
            $('#merch-container .row').append(cardHtml);
        }

        if (indiceFin < datosMerchandising.length) {
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

    function clickAddToCart() {
        var index = $(this).data("index");
        anadirAlCarrito(datosMerchandising[index]);
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
        cargarMasMerch();
    }

    function clickMostrarMenos() {
        mostrarMenosMerch();
    }

    function anadirAlCarrito(merch) {
        cartItems.push(merch);
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

        mostrarMerchandising();
    }

    function cargarMasMerch() {
        paginaActual++;
        mostrarMerchandising();
    }

    function mostrarMenosMerch() {
        paginaActual = 1;
        mostrarMerchandising();
    }

    function sortByPrice(order) {
        datosMerchandising.sort((a, b) => {
            const priceA = parseFloat(a.price.replace('€', '').replace(',', '.'));
            const priceB = parseFloat(b.price.replace('€', '').replace(',', '.'));
            return order === 'asc' ? priceA - priceB : priceB - priceA;
        });
    }

    function sortByTitle(order) {
        datosMerchandising.sort((a, b) => {
            const titleA = a.title.toLowerCase();
            const titleB = b.title.toLowerCase();
            return order === 'asc' ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
        });
    }

    function aplicarFiltro() {
        var merchFiltrado = filtrarMerchandising();
        datosMerchandising = merchFiltrado;
        paginaActual = 1;
        mostrarMerchandising();
        $('#filtroDropdownPrecio').hide();
    }

    function filtrarMerchandising() {
        var selectedCategorias = $('#categoriaFilter').val();
        var selectedTipos = $('#tipoFilter').val();
        var precioMin = parseFloat($('#precioMin').val()) || 0;
        var precioMax = parseFloat($('#precioMax').val()) || Number.MAX_VALUE;

        var filteredMerch = datosMerchandising.filter(function (merch) {
            var precio = parseFloat(merch.price.replace('€', '').replace(',', '.'));

            return (
                (selectedCategorias.length === 0 || selectedCategorias.includes(merch.categoria)) &&
                (selectedTipos.length === 0 || selectedTipos.includes(merch.tipo)) &&
                precio >= precioMin &&
                precio <= precioMax
            );
        });

        return filteredMerch;
    }
});