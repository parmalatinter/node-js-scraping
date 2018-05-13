var start_scraping = function () {
    $("#scraping_btn").text('スクレイピング中');
    $.ajax({
        async: true,
        url: '/scraping/start',
        type: 'get',
        dataType: 'html',
        timeout: 1000
    }).done(function (data, textStatus, jqXHR) {
        console.log(data, textStatus, jqXHR);
        $("#scraping_btn").text('スクレイピング開始');
        $("#scraping_btn").removeAttr('disabled');
    }).fail(function (jqXHR, textStatus, errorThrown) {
        if(textStatus !== 'timeout'){
            $("#scraping_btn").text('スクレイピングエラー');
        }
        console.log(jqXHR, textStatus, errorThrown);
    }).always(function () {
        get_status();
    });
};
var stop_scraping = function () {
    $("#scraping_btn").text('スクレイピング停止中');
    $("#scraping_btn").attr({'disabled': true});
    $.ajax({
        async: true,
        url: '/scraping/stop',
        type: 'get',
        dataType: 'html',
        timeout: 1000
    }).done(function (data, textStatus, jqXHR) {
        console.log(data, textStatus, jqXHR);
        $("#scraping_btn").text('スクレイピング開始');
        $("#scraping_btn").removeAttr('disabled');
    }).fail(function (jqXHR, textStatus, errorThrown) {
        if(textStatus !== 'timeout'){
            $("#scraping_btn").text('エラー');
        }
        console.log(jqXHR, textStatus, errorThrown);
    }).always(function () {
        get_status();
    });
};
var start_send_message = function () {
    $("#message_send_btn").text('メッセージ送信中');
    $.ajax({
        async: true,
        url: '/message/send',
        type: 'get',
        dataType: 'html',
        timeout: 1000
    }).done(function (data, textStatus, jqXHR) {
        console.log(data, textStatus, jqXHR);
        $("#message_send_btn").text('メッセージ送信開始');
        $("#message_send_btn").removeAttr('disabled');
    }).fail(function (jqXHR, textStatus, errorThrown) {
        if(textStatus !== 'timeout'){
            $("#scraping_btn").text('メッセージ送信エラー');
        }
        console.log(jqXHR, textStatus, errorThrown);
    }).always(function () {
        get_status();
    });
};

var stop_send_message = function () {
    $("#message_send_btn").text('メッセージ送信 停止中');
    $("#message_send_btn").attr({'disabled': true});
    $.ajax({
        async: true,
        url: '/message/stop',
        type: 'get',
        dataType: 'html',
        timeout: 1000
    }).done(function (data, textStatus, jqXHR) {
        console.log(data, textStatus, jqXHR);
        $("#message_send_btn").text('メッセージ送信');
        $("#message_send_btn").removeAttr('disabled');
    }).fail(function (jqXHR, textStatus, errorThrown) {
        if(textStatus !== 'timeout'){
            $("#message_send_btn").text('エラー');
        }
        console.log(jqXHR, textStatus, errorThrown);
    }).always(function () {
        get_status();
    });
};

var get_status = function () {
    $.ajax({
        async: false,
        url: '/ajax/get_status',
        type: 'post',
        dataType: 'json'
    }).done(function (res) {
        if (res.scraping_user_info_status) {
            $("#scraping_btn").text('スクレイピング中 停止');
        }else{
            $("#scraping_btn").text('スクレイピング開始');
            $("#scraping_btn").removeAttr('disabled');
        }
        if (res.message_send_status) {
            $("#message_send_btn").text('メッセージ送信中 停止');
        }else{
            $("#message_send_btn").text('メッセージ送信開始');
            $("#message_send_btn").removeAttr('disabled');
        }

    }).fail(function (xhr, status, error) {
        console.log(xhr, status, error);
    });
};

var get_info_all_count = function () {
    $.ajax({
        async: false,
        url: '/ajax/user/get_info_all_count',
        type: 'post',
        dataType: 'json'
    }).done(function (res) {
        if (res.men_count) {
            $("#info_men_count").text('スクレイピング 女性人数 : ' + res.men_count + '人');
        }
        if (res.woman_count) {
            $("#info_woman_count").text('スクレイピング 男性人数 : ' + res.woman_count + '人');
        }
    }).fail(function (xhr, status, error) {
        console.log(xhr, status, error);
    });
};

var get_send_all_count = function () {
    $.ajax({
        async: false,
        url: '/ajax/user/get_send_all_count',
        type: 'post',
        dataType: 'json'
    }).done(function (res) {
        if (res.men_count) {
            $("#send_men_count").text('メッセージ送信 女性人数 : ' + res.men_count + '人');
        }
        if (res.woman_count) {
            $("#send_woman_count").text('メッセージ送信 男性人数 : ' + res.woman_count + '人');
        }
    }).fail(function (xhr, status, error) {
        console.log(xhr, status, error);
    });
};

$(function () {
    get_status();
    setInterval(function () {
        get_status();
        get_info_all_count();
        get_send_all_count();
    }, 1000);

    $('#scraping_btn').click(function () {
        if($(this).text() == 'スクレイピング中 停止'){
            stop_scraping();
        }else{
            start_scraping();
        }
    });

    $('#message_send_btn').click(function () {
        if($(this).text() == 'メッセージ送信中 停止'){
            stop_send_message();
        }else{
            start_send_message();
        }
    });
});

