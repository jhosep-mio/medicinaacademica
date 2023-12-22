/*
 * Maquetación del input de imágenes
 */
$(document).on('change', '.btn-file :file', function() {
    var input = $(this),
            numFiles = input.get(0).files ? input.get(0).files.length : 1,
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', [numFiles, label]);
});
    $('.btn-file :file').on('fileselect', function(event, numFiles, label) {
        var input = $(this).parents('.input-group').find(':text'),
                log = numFiles > 1 ? numFiles + ' files selected' : label;
        if (input.length) {
            input.val(log);
        } else {
            if (log)
                alert(log);
        }
    });

function base64_encode(data) {
    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
            ac = 0,
            enc = '',
            tmp_arr = [];
    if (!data) {
        return data;
    }
    do { // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);
        bits = o1 << 16 | o2 << 8 | o3;
        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;
        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);
    enc = tmp_arr.join('');
    var r = data.length % 3;
    return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
}
/*
 * Fin Base64_encode para JavaScript
 */
$("#subscriber_export").click(function(e) {
    location.href = base_url + "manager/excel/listSubscriber";
});

/*****************************************************************************/
$(function() {
    $(".datepicker").datepicker({
        dateFormat: 'dd-mm-yy',
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        yearRange: '1900:2015'
    });
});


/*-------------------------------------------------------------------*/
/*Para recargar  el captcha*/
$(document).on('click', '#refresh_captcha', function() {
    $("#div-captcha").load('' + location.href + ' #div-captcha');
});


$('#reporte_categoria').on('click', function(e) {
    e.preventDefault();
    date = $('.date1').val();
    if (date == '') {
        alertify.alert('<h4>Debe de seleccionar una fecha</h4>')
                .set('title', 'Importante');
    } else {
        location.href = base_url + "manager/estadistica/categoria/" + date;
    }
});
