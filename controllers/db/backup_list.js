exports.exec = function (req, host_res) {
    const dir = './seeds/dump';
    const fs = require('fs');
    const moment = require('moment');

    let backup_list = [];
    fs.readdir(dir, (err, files) => {
        for(let file_name of files){
            const timestamp = file_name.replace('dump.', '');
            const date_str = moment.unix(timestamp).format("YYYY年MM月DD日 HH:mm:ssZ");
            backup_list.push({date_str: date_str, file_name : file_name});
        }
        req.app.locals.render(req, host_res, 'pages/admin/db', {backup_list: backup_list.reverse()});
    });
};