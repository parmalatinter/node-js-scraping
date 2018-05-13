$(function () {
    if($('#modal_message .modal-title').text()){
        $('#modal_message').modal('show');
    }
    if($('#modal_error .modal-title').text()){
        $('#modal_error').modal('show');
    }
});
