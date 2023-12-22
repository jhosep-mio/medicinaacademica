//Busquedas de listado

$('.buscar_empleado').keyup(function(e) {
    url = $(this).attr("data-url");
    filtro = $(this).val();
    if (filtro == "") {
        $(".table").find('.resultado').show();
        $(".table").find('.ajax').remove();
        $(".pagination").show();
    } else {
        $(".pagination").hide();
        $.post(url,
                {filtro: filtro},
        function(response) {
            $(".table").find('.resultado').hide();
            $(".table").find('.ajax').remove();
            var total = Object.keys(response).length;
            for (var i = 0; i < total; i++) {
                if (response[i].id != null) {
                    $(".table").append('<tr class="ajax table-bordered table-hover table-responsive"><td>' + response[i].numero + '</td>\n\
                            <td>' + response[i].nombre + '</td><td>'+response[i].usuario+'</td><td>'+response[i].cargo+'</td>\n\
\n\                         <td>' + response[i].telefono + '</td><td>' + response[i].f_registro + '</td><td>' + response[i].accion + '</td></tr>');
                } else
                    $(".table").append('<tr class="ajax"><td>¡Lo sentimos! No se encontraron resultados para su busqueda</td></tr>');
            }
        }, 'json');
    }
});

$('.buscar_categoria').keyup(function(e) {
    url = $(this).attr("data-url");
    filtro = $(this).val();
    if (filtro == "") {
        $(".table").find('.resultado').show();
        $(".table").find('.ajax').remove();
        $(".pagination").show();
    } else {
        $(".pagination").hide();
        $.post(url,
                {filtro: filtro},
        function(response) {
            $(".table").find('.resultado').hide();
            $(".table").find('.ajax').remove();
            var total = Object.keys(response).length;
            for (var i = 0; i < total; i++) {
                if (response[i].id != null) {
                    $(".table").append('<tr class="ajax table-bordered table-hover table-responsive"><td>' + response[i].numero + '</td>\n\
                            /n/<td>' + response[i].descripcion + '</td><td><img src="' + base_url + '/public/imagen/categoria/' + response[i].imagen + '" style="width: 90px"/></td><td>' + response[i].accion + '</td></tr>');
                } else
                    $(".table").append('<tr class="ajax"><td colspan="4">¡Lo sentimos! No se encontraron resultados para su busqueda</td></tr>');
            }
        }, 'json');
    }
});



$('.buscar_evento').keyup(function(e) {
    url = $(this).attr("data-url");
    filtro = $(this).val();
    if (filtro == "") {
        $(".table").find('.resultado').show();
        $(".table").find('.ajax').remove();
        $(".pagination").show();
    } else {
        $(".pagination").hide();
        $.post(url,
                {filtro: filtro},
        function(response) {
            $(".table").find('.resultado').hide();
            $(".table").find('.ajax').remove();
            var total = Object.keys(response).length;
            for (var i = 0; i < total; i++) {
                if (response[i].id != null) {
                    $(".table").append('<tr class="ajax table-bordered table-hover table-responsive"><td>' + response[i].numero + '</td>\n\
                            /n/<td>' + response[i].descripcion + '</td><td><img src="' + base_url + '/public/imagen/evento/' + response[i].imagen + '" style="width: 90px"/></td><td>' + response[i].accion + '</td></tr>');
                } else
                    $(".table").append('<tr class="ajax"><td colspan="5">¡Lo sentimos! No se encontraron resultados para su busqueda</td></tr>');
            }
        }, 'json');
    }
});

$('.buscar_moneda').keyup(function(e) {
    url = $(this).attr("data-url");
    filtro = $(this).val();
    if (filtro == "") {
        $(".table").find('.resultado').show();
        $(".table").find('.ajax').remove();
        $(".pagination").show();
    } else {
        $(".pagination").hide();
        $.post(url,
                {filtro: filtro},
        function(response) {
            $(".table").find('.resultado').hide();
            $(".table").find('.ajax').remove();
            var total = Object.keys(response).length;
            for (var i = 0; i < total; i++) {
                if (response[i].id != null) {
                    $(".table").append('<tr class="ajax table-bordered table-hover table-responsive"><td>' + response[i].numero + '</td>\n\
                            /n/<td>' + response[i].nombre + '</td><td>' + response[i].valor + '</td><td>' + response[i].abrev + '</td><td>' + response[i].accion + '</td></tr>');
                } else
                    $(".table").append('<tr class="ajax"><td colspan="5">¡Lo sentimos! No se encontraron resultados para su busqueda</td></tr>');
            }
        }, 'json');
    }
});

$('.buscar_correo').keyup(function(e) {
    url = $(this).attr("data-url");
    filtro = $(this).val();
    if (filtro == "") {
        $(".table").find('.resultado').show();
        $(".table").find('.ajax').remove();
        $(".pagination").show();
    } else {
        $(".pagination").hide();
        $.post(url,
                {filtro: filtro},
        function(response) {
            $(".table").find('.resultado').hide();
            $(".table").find('.ajax').remove();
            var total = Object.keys(response).length;
            for (var i = 0; i < total; i++) {
                if (response[i].id != null) {
                    $(".table").append('<tr class="ajax table-bordered table-hover table-responsive"><td>' + response[i].numero + '</td>\n\
                            /n/<td>' + response[i].nombre + '</td><td>' + response[i].correo + '</td><td>' + response[i].accion + '</td></tr>');
                } else
                    $(".table").append('<tr class="ajax"><td colspan="4">¡Lo sentimos! No se encontraron resultados para su busqueda</td></tr>');
            }
        }, 'json');
    }
});


$('.buscar_precio').keyup(function(e) {
    url = $(this).attr("data-url");
    filtro = $(this).val();
    if (filtro == "") {
        $(".table").find('.resultado').show();
        $(".table").find('.ajax').remove();
        $(".pagination").show();
    } else {
        $(".pagination").hide();
        $.post(url,
                {filtro: filtro},
        function(response) {
            $(".table").find('.resultado').hide();
            $(".table").find('.ajax').remove();
            var total = Object.keys(response).length;
            for (var i = 0; i < total; i++) {
                if (response[i].id != null) {
                    $(".table").append('<tr class="ajax table-bordered table-hover table-responsive"><td>' + response[i].numero + '</td>\n\
                            /n/<td>' + response[i].lugar + '</td><td>' + response[i].precio + '</td><td>' + response[i].accion + '</td></tr>');
                } else
                    $(".table").append('<tr class="ajax"><td colspan="4">¡Lo sentimos! No se encontraron resultados para su busqueda</td></tr>');
            }
        }, 'json');
    }
});

$('.buscar_lugar').keyup(function(e) {
    url = $(this).attr("data-url");
    filtro = $(this).val();
    if (filtro == "") {
        $(".table").find('.resultado').show();
        $(".table").find('.ajax').remove();
        $(".pagination").show();
    } else {
        $(".pagination").hide();
        $.post(url,
                {filtro: filtro},
        function(response) {
            $(".table").find('.resultado').hide();
            $(".table").find('.ajax').remove();
            var total = Object.keys(response).length;
            for (var i = 0; i < total; i++) {
                if (response[i].id != null) {
                    $(".table").append('<tr class="ajax table-bordered table-hover table-responsive"><td>' + response[i].numero + '</td>\n\
                            /n/<td>' + response[i].nombre + '</td><td>' + response[i].fecha_registro + '</td><td>' + response[i].accion + '</td></tr>');
                } else
                    $(".table").append('<tr class="ajax"><td colspan="5">¡Lo sentimos! No se encontraron resultados para su busqueda</td></tr>');
            }
        }, 'json');
    }
});


$('.buscar_producto').keyup(function(e) {
    url = $(this).attr("data-url");
    filtro = $(this).val();
    if (filtro == "") {
        $(".table").find('.resultado').show();
        $(".table").find('.ajax').remove();
        $(".pagination").show();
    } else {
        $(".pagination").hide();
        $.post(url,
                {filtro: filtro},
        function(response) {
            $(".table").find('.resultado').hide();
            $(".table").find('.ajax').remove();
            var total = Object.keys(response).length;
            
            for (var i = 0; i < total; i++) {
                if (response[i].id != null) {
                   $(".table").append('<tr class="ajax table-bordered table-hover table-responsive"><td>' + response[i].numero + '</td>\n\
                            <td>' + response[i].codigo + '</td><td>' + response[i].nombre + '</td><td><img src="' + base_url + 'thumbs/70/70/producto-' + response[i].imagen + '"/></td>\n\
                            <td>' + response[i].categoria + '</td><td>'+ response[i].eventos +'</td><td>'+response[i].fecha_registro+'</td><td align="center">'+response[i].estado+'</td><td align="center"><input id="checkEliminar" name="checkEliminar" value="' + response[i].id + '" type="checkbox" ></td><td>' + response[i].accion + '</td></tr>');                        
                            
                } else
                    $(".table").append('<tr class="ajax"><td colspan="10">¡Lo sentimos! No se encontraron resultados con la palabra <b>'+filtro+'</b></td></tr>');
            }
            console.log(response);
        }, 'json');
    }
});


