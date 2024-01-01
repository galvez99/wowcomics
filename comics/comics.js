var datosComics;
var comicsPorPagina = 16;
var paginaActual = 1;

$(document).ready(function () {
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

    $('#filtrarPorPrecio').on('click', function () {
        $('#filtroDropdownPrecio').toggle();
    });

    $('#aplicarFiltroPrecio').on('click', function () {
        aplicarFiltroPrecio();
    });
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
                            <button onclick="anadirAlCarrito()">
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

function cargarMasComics() {
    paginaActual++;
    mostrarComics();
}

function mostrarMenosComics() {
    paginaActual = 1;
    mostrarComics();
}

function anadirAlCarrito() {
    console.log('Añadido al carrito');
}

function filtrar() {
    $('#filtroDropdown').toggle();
}

function aplicarFiltro() {
    var selectedPublishers = $('#publisherFilter').val();
    var filteredComics = datosComics.filter(function (comic) {
        return selectedPublishers.includes(comic.publisher);
    });
    mostrarComicsFiltrados(filteredComics);
    $('#filtroDropdown').hide();
}

function aplicarFiltroPrecio() {
    var precioMin = parseFloat($('#precioMin').val()) || 0;
    var precioMax = parseFloat($('#precioMax').val()) || Number.MAX_VALUE;
    var filteredComics = datosComics.filter(function (comic) {
        var precio = parseFloat(comic.price.replace('$', ''));
        return precio >= precioMin && precio <= precioMax;
    });
    mostrarComicsFiltrados(filteredComics);
    $('#filtroDropdownPrecio').hide();
}

function mostrarComicsFiltrados(comics) {
    var comicContainer = $('#comic-container');
    comicContainer.empty();
    var rowDiv = $('<div class="row row-cols-2 row-cols-md-4"></div>');
    $.each(comics, function (index, comic) {
        var cardHtml = `
            <div class="col">
                <div class="card">
                    <div class="img-wrapper"><img src="${comic.imageSrc}" alt="${comic.altText}"></div>
                    <div class="card-body">
                        <h5 class="card-title">${comic.title}</h5>
                        <h5 class="card-text">${comic.price}</h5>
                        <div class="custom-button">
                            <button onclick="anadirAlCarrito()">
                                <img class="bcarro" src="/img/carrito.png" alt="Carrito de compras">
                                Añadir
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
        rowDiv.append(cardHtml);
        if ((index + 1) % 4 === 0 || index === comics.length - 1) {
            comicContainer.append(rowDiv);
            rowDiv = $('<div class="row row-cols-2 row-cols-md-4"></div>');
        }
    });
}
