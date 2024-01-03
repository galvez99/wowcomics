var datosMerchandising;
var merchPorPagina = 16;
var paginaActual = 1;

$(document).ready(function () {
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

    $('#btnOrdenar').on('click', function () {
        mostrarMenuOrdenar();
    });

    $('#ordenarPor').on('change', function () {
        aplicarOrden();
    });

    $('#aplicarOrden').on('click', function () {
        aplicarOrden();
    });

    $('#filtrar').on('click', function () {
        filtrar();
    });

    $('#aplicarFiltro').on('click', function () {
        aplicarFiltro();
    });
});

function mostrarMerchandising() {
    var indiceInicio = (paginaActual - 1) * merchPorPagina;
    var indiceFin = indiceInicio + merchPorPagina;
    var esPrimeraPagina = (indiceInicio === 0);

    if (esPrimeraPagina) {
        $('#merch-container').html('<div class="row row-cols-2 row-cols-md-4"></div>');
    }

    var filteredMerch = filtrarMerchandising();

    for (var i = indiceInicio; i < indiceFin && i < filteredMerch.length; i++) {
        var merch = filteredMerch[i];
        var cardHtml = `
            <div class="col">
                <div class="card">
                    <div class="img-wrapper"><img src="${merch.imageSrc}" alt="${merch.altText}"></div>
                    <div class="card-body">
                        <h5 class="card-title">${merch.title}</h5>
                        <h5 class="card-text">${merch.price}</h5>
                        <div class="custom-button">
                            <button onclick="anadirAlCarrito()">
                                <img class="bcarro" src="/img/carrito.png" alt="Carrito de compras">
                                Añadir
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
        $('#merch-container .row').append(cardHtml);
    }

    if (indiceFin < filteredMerch.length) {
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

function cargarMasMerch() {
    paginaActual++;
    mostrarMerchandising();
}

function mostrarMenosMerch() {
    paginaActual = 1;
    mostrarMerchandising();
}

function anadirAlCarrito() {
    console.log('Añadido al carrito');
}

function filtrar() {
    $('#filtroDropdown').toggle();
}

function aplicarFiltro() {
    mostrarMerchandising();
    $('#filtroDropdown').hide();
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
