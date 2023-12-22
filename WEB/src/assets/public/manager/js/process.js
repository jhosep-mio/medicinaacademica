$(document).on('submit', '.bform', function() {

    frm = $(this);

    btn = frm.find(".save");

    method = frm.attr("method");

    btn.attr("disabled", "disabled");

    

    $.blockUI({css: {border: 'none', padding: '15px', backgroundColor: '#000', '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: .5, color: '#fff'}});

    $.ajax({

        url: frm.attr('action'),

        type: method,

        data: frm.serialize(),

        data: new FormData(this),

                contentType: false,

        cache: false,

        processData: false,

    })

            .done(function(data)

            {

                $.unblockUI({});

                console.log(data);

                btn.removeAttr("disabled");

                frm.find('.response').html(data).hide().slideDown();

            })

            .error(function(data, msg)

            {

                $.unblockUI({});

                btn.removeAttr("disabled");

                response.html("Ha ocurrido un error interno");

            });

    return false;

});



/*----------------------------------------------------------------------------*/



//para la confirmacion del cambiar de estado

$(document).on('click', '.denegar', function(e) {

//    alert("llego");

    e.preventDefault();

    url = $(this).attr("data-url");

    entidad = $(this).attr("data-id");



    alertify.confirm('<h3>¿Esta seguro que desea bloquear este registro?</h3>')

            .set('title', 'Importante')

            .set('labels', {ok: 'Confirmar', cancel: 'Cancelar'})

            .set('onok', function(closeEvent) {

                $.post(url,

                        {},

                        function(response) {

                            $('.response').html(response);

                        });

            })

});



$(document).on('click', '.activar', function(e) {

    e.preventDefault();

    url = $(this).attr("data-url");

    entidad = $(this).attr("data-id");



    alertify.confirm('<h3>¿Esta seguro que desea activar esta moneda recuerde que se visualizara en la web?</h3>')

            .set('title', 'Importante')

            .set('labels', {ok: 'Confirmar', cancel: 'Cancelar'})

            .set('onok', function(closeEvent) {

                $.post(url,

                        {},

                        function(response) {

                            $('.response').html(response);

                        });

            })

});



$(document).on('click', '.permitir', function(e) {

    e.preventDefault();

    url = $(this).attr("data-url");

    entidad = $(this).attr("data-id");

                $.post(url,

                        {},

                        function(response) {

                            $('.response').html(response);

                        });

           

});



//para la confirmacion de la eliminacion de un registro

$(document).on('click', '.eliminar', function(e) {

    e.preventDefault();

    url = $(this).attr("data-url");

    alertify.confirm('<h3>¿Esta seguro que desea eliminar este registro?</h3><h4>recuerde que la eliminacion sera permantente</h4>')

            .set('title', 'Importante')

            .set('labels', {ok: 'Confirmar', cancel: 'Cancelar'})

            .set('onok', function(closeEvent) {

                $.post(url,

                        {},

                        function(response) {

                            $('.response').html(response);

                        });

            })

});





$(document).on('click', '.eliminar_imagen', function(e) {



    e.preventDefault();

    url = $(this).attr("data-url");

    alertify.confirm('<h3>¿Esta seguro que desea eliminar esta imagen?</h3><h4>recuerde que la eliminacion sera permantente</h4>')

            .set('title', '<span class="fa fa-bullhorn fa-2x style="vertical-align:middle; color: red;">Importante')

            .set('labels', {ok: 'Confirmar', cancel: 'Cancelar'})

            .set('onok', function(closeEvent) {

                $.post(url,

                        {},

                        function(response) {

                            $('.response').html(response);

                        });

            })

});

//para la confirmacion del cambiar de idioma

$(document).on('click', '.cambiar_idioma', function(e) {

 

    url = $(this).attr("data-url");

    alertify.confirm('<h3>¿Guarde todos los registros?</h3>')

            .set('title', 'Importante')

            .set('labels', {ok: 'Confirmar', cancel: 'Cancelar'})

            .set('onok', function(closeEvent) {

                $.post(url,

                        {},

                        function(response) {

                            setTimeout(function() {

                            location.reload();

                            }, 1000);

                        });

            })

});

//CONFIRMACION DE MARCAR PRODUCTO COMO PAGADO

$(document).on('click', '.pagado', function(e) {

    e.preventDefault();

    url = $(this).attr("data-url");

    alertify.confirm('<h3>¿Esta seguro que desea marcar como pagado?</h3>')

            .set('title', 'Importante')

            .set('labels', {ok: 'Confirmar', cancel: 'Cancelar'})

            .set('onok', function(closeEvent) {

                $.post(url,

                        {},

                        function(response) {

                            $('.response').html(response);

                        });

            })

});



//CONFIRMACION DE MARCAR PRODUCTO ENTREGADO

$(document).on('click', '.entregado', function(e) {

    e.preventDefault();

    url = $(this).attr("data-url");

    alertify.confirm('<h3>¿Esta seguro que desea marcar como entregado?</h3>')

            .set('title', 'Importante')

            .set('labels', {ok: 'Confirmar', cancel: 'Cancelar'})

            .set('onok', function(closeEvent) {

                $.post(url,

                        {},

                        function(response) {

                            $('.response').html(response);

                        });

            })

});

//



//para la eliminar un item para producto-detalle

$(document).on('click', '.remove-item-id', function(e) {

    e.preventDefault();

    url = $(this).attr("data-url");

    id = $(this).attr("data-id");

    alertify.confirm('<h3>¿Esta seguro que desea eliminar este registro?</h3>')

            .set('title', 'Importante')

            .set('labels', {ok: 'Confirmar', cancel: 'Cancelar'})

            .set('onok', function(closeEvent) {

                $.post(url,

                        {id: id},

                function(response) {

                    $('.response').html(response);

                });

            })

});



//para la eliminar un item para producto

$(document).on('click', '.remove-item', function() {

    $(this).parent().parent().remove();

    return false;

});







$(document).on('click', '.item2', function() {

    medida = $('.medida').val();

    detalle= $('.detalle').val();

    cantidad= $('.cantidad').val();

    oferta= $('.oferta').val();

    

    url = $(this).attr('data-url');

    if (medida == '' || detalle == 0 || cantidad == 0) {

        alertify.alert('<h4>Verifique que los campos esten completos</h4>')

                .set('title', 'Importante');

    } else {



            TBL = $('#table-it2');

            TBL.find('.none').hide();

         

            html = '<tr class="item-' + medida + '">';

            html += '<td>' + $('.medida option:selected').text() + '<input type="hidden" name="a_medida[]" value="' + medida + '"></td>';

            html += '<td><input type="text" class="form-control" style="width: 70px;" name="a_detalle[]" value="' + detalle + '"></td>';

            html += '<td><input type="text" class="form-control" style="width: 70px;" name="a_cantidad[]" value="' + cantidad + '"></td>';

            html += '<td><input type="text" class="form-control" style="width: 70px;" name="a_oferta[]" value="' + oferta + '"></td>';

            html += '<td><a class="btn btn-danger remove-item" data-toggle="tooltip" title="eliminar Item"><i class="fa fa-trash"></i></a></td>';

            html += '</tr>';

            TBL.append(html);

            $(".medida").val(0);

            $(".detalle").val("");

            $(".cantidad").val("");

            $(".oferta").val(0);

    }

});





$(document).on('click', '.editar_item', function(e) {

    e.preventDefault();

    url = $(this).attr("data-url");

    $.post(url,

            {},

            function(response) {

                if (response == 1) {

                    $(".table-item").load(location.href + " .table-item");

                }



            });



});

//para eliminar item de productos

$(document).on('click', '.eliminar_item', function(e) {

    e.preventDefault();

    url = $(this).attr("data-url");

    $.post(url,

            {},

            function(response) {

                if (response == 1) {

                    $(".table-item").load(location.href + " .table-item");

                }



            });



});





//Script para el ordenamiento de imágenes

$(document).on('click', '.subir', function(e) {

    e.preventDefault();

    url = $(this).attr("data-url");

    id = $(this).attr("data-id");

    $.post(url,

            {id: id},

    function(response) {

        $('.response').html(response);

    });

});



$(document).on('click', '.bajar', function(e) {

    e.preventDefault();

    url = $(this).attr("data-url");

    id = $(this).attr("data-id");

    $.post(url,

            {id: id},

    function(response) {

        $('.response').html(response);

    });

});



/*-----------------------------------------------------------------------------*/

$('#refrescarCaptcha').on('click', function () {

    $.post(base_url + 'manager/page/refrescar',

            {},

            function (response) {

                $('#div-captcha2').html(response);

            });

});

/*-----------------------------------------------------------------------------*/



$("#eliminacion").click(function () {

	var checkedarray = $('input[name="checkEliminar"]:checked').serializeArray();

        url = $(this).attr("data-url");

        if(checkedarray != ""){

        alertify.confirm('<h3>¿Esta seguro que desea bloquear estos productos?</h3>')

            .set('title', 'Importante')

            .set('labels', {ok: 'Confirmar', cancel: 'Cancelar'})

            .set('onok', function(closeEvent) {

                    $.post(url,

                    {checkEliminar: checkedarray},

                    function(response) {

                        $('.response').html(response);

                    });

            })

        }else{

            

        }      

});



$("#recuperar").click(function () {

	var checkedarray = $('input[name="checkEliminar"]:checked').serializeArray();

        url = $(this).attr("data-url");

        if(checkedarray != ""){

        alertify.confirm('<h3>¿Esta seguro que desea Desbloquear estos productos?</h3>')

            .set('title', 'Importante')

            .set('labels', {ok: 'Confirmar', cancel: 'Cancelar'})

            .set('onok', function(closeEvent) {

                    $.post(url,

                    {checkEliminar: checkedarray},

                    function(response) {

                        $('.response').html(response);

                    });

            })

        }else{

            

        }    

        

});

$('#eventos_pr').on('change', function () {
    $.post(base_url + 'manager/producto/evento_seleccionado',
            {eventos_pr: $('#eventos_pr').val()},
            function (response) {
                console.log(response);
                $('.modelito').html(response.modelito);
                if(response.valore == 1){
                $('.img_categoria').css("display", "block");
                $('.img_categoria2').css("display", "block");
                }else{
                $('.img_categoria').css("display", "none");
                $('.img_categoria2').css("display", "none");
                }
            }, 'json');

});
