document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('click', function (event) {
        const mobileDropdown = document.getElementById('mobile-dropdown');
        if (!mobileDropdown.contains(event.target)) {
            const dropdownContentMobile = document.querySelector('.dropdown-content-mobile');
            dropdownContentMobile.style.display = 'none';
        }
    });

    function cargarDatos(url, callback) {
        $.getJSON(url, function (data) {
            callback(data);
        });
    }

    var merchandisingData;
    var comicsData;

    cargarDatos('/merch/merch.json', function (data) {
        merchandisingData = data.merchandising;
    });

    cargarDatos('/comics/comics.json', function (data) {
        comicsData = data.comics;
    });

    function buscarProductos(query) {
        var results = [];
        results = results.concat(buscarEnData(merchandisingData, query));
        results = results.concat(buscarEnData(comicsData, query));
        mostrarResultados(results);
    }

    function buscarEnData(data, query) {
        return data.filter(function (item) {
            return item.title.toLowerCase().includes(query.toLowerCase());
        });
    }

    function mostrarResultados(results) {
        var searchResults = $('#searchResults');
        searchResults.empty();

        results.forEach(function (result) {
            var li = $('<li>');
            var titleDiv = $('<div>').text(result.title).addClass('result-title');
            var priceDiv = $('<div>').text(result.price).addClass('result-price');

            li.append(titleDiv).append(priceDiv);
            searchResults.append(li);
        });

        if (results.length > 0) {
            searchResults.show();
        } else {
            searchResults.hide();
        }
    }

    $('#searchInput').on('input', function () {
        buscarProductos($(this).val());
    });

    $('#searchResults').on('click', 'li', function () {
        var selectedResult = $(this).find('.result-title').text();
        $('#searchInput').val(selectedResult);
        $('#searchResults').hide();
    });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('.search-bar').length) {
            $('#searchResults').hide();
        }
    });

    $(document).ready(function () {
        $("#cliente").click(function () {
            $("#clienteModal").modal("show");
        });

        $("#iniciarSesionBtn").click(function () {
            $("#clienteModal").modal("hide");
            $("#inicioSesionModal").modal("show");
        });

        $("#registrarUsuarioBtn").click(function () {
            $("#clienteModal").modal("hide");
            $("#registroUsuarioModal").modal("show");
        });

        $("#confirmarInicioSesionBtn").click(function () {
            $("#inicioSesionModal").modal("hide");
            $("#sesionIniciadaModal").modal("show");
        });

        $("#cancelarInicioSesionBtn").click(function () {
            $("#inicioSesionModal").modal("hide");
            $("#clienteModal").modal("hide");
        });

        $("#registrarBtn").click(function () {
            $("#registroUsuarioModal").modal("hide");
            $("#registroConfirmadoModal").modal("show");
        });

        $("#carrito").click(function () {
            $("#carritoModal").modal('show');
        });
    });
});
