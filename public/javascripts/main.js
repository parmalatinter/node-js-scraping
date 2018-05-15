$(function () {
    if($('#modal_message .modal-title').text()){
        $('#modal_message').modal('show');
    }
    if($('#modal_error .modal-title').text()){
        $('#modal_error').modal('show');
    }
});

var show_modal_message = function (title) {
    $('#modal_message .modal-title').text(title);
};

var show_modal_error = function (title, error, stack) {
    $('#modal_message .modal-title').text(title);
    $('#modal_message .modal-error').text(error);
    $('#modal_message .modal-stack').text(stack);
};