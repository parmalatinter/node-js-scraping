let set_event_uncheck = function () {
    $(".list-group-item.list-group-item-info input[type=checkbox]").on("click", function(){
        $('.list-group-item.list-group-item-info input[type=checkbox]').prop('checked', false);
        $(this).prop('checked', true);
    });
    $(".form-check.order input[type=checkbox]").on("click", function(){
        $('.form-check.order input[type=checkbox]').prop('checked', false);
        $(this).prop('checked', true);
    });
    $(".main_is_enable_send[type=checkbox]").on("click", function(){
        let alt_text = $(this).attr('alt');
        let id = alt_text.replace('#is_enable_send_', '');
        if($(this).prop('checked')){
            $($(this).attr('alt')).val('true_' + id);
        }else{
            $($(this).attr('alt')).val('false_' + id);
        }
    });
    $("#order_button").on("click", function(){
        let input = $("#order");
        if(input.val() === 'desc'){
            input.val('asc');
            $(this).html('逆順をやめる');
        }else{
            input.val('desc');
            $(this).html('逆順にする');
        }
        $('#user_form').submit();
    });
};

$(function () {
    set_event_uncheck();
});
