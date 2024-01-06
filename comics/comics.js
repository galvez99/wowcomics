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
        aplicarFiltro();
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
});

function mostrarComics() {
    var indiceInicio = (paginaActual - 1) * comicsPorPagina;
    var indiceFin = indiceInicio + comicsPorPagina;
    var esPrimeraPagina = (indiceInicio === 0);

    if (esPrimeraPagina) {
        $('#comic-container').html('<div class="row row-cols-2 row-cols-md-4"></div>');
    }

    var filteredComics = filtrarComics();

    for (var i = indiceInicio; i < indiceFin && i < filteredComics.length; i++) {
        var comic = filteredComics[i];
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

    if (indiceFin < filteredComics.length) {
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

function anadirAlCarrito(comic) {
    var carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push(comic);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    console.log('Añadido al carrito');
}

function mostrarProductosEnCarrito() {
    var carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    var itemsContainer = $('#itemsContainer');
    itemsContainer.empty();

    carrito.forEach(function (comic) {
        var itemHtml = `
           <div class="item">
               <img src="${comic.imageSrc}" alt="${comic.altText}">
               <span>${comic.title}</span>
           </div>`;
        itemsContainer.append(itemHtml);
    });

    $('#carritoModal').modal('show');
}

// Agrega un evento de clic al icono del carrito en el navbar
$('#carrito').on('click', function () {
    mostrarProductosEnCarrito();
});

function filtrar() {
    $('#filtroDropdown').toggle();
}

function aplicarFiltro() {
    mostrarComics();
    $('#filtroDropdown').hide();
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

// Funciones adicionales para ordenar cómics con jQuery
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
