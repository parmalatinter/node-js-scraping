exports.delay = function (timeout) {
    return new Promise(function (resolve) {
        setTimeout(resolve, timeout);
    });
};

exports.exec = function (puppeteer, knex, my_user, send_list, setting_row, env) {
    const message_send_status = require('./../../models/status/message_send_status');
    return new Promise(function (resolve, reject) {
        (async (puppeteer, my_user, setting_row, env) => {
            const browser = await puppeteer.launch({headless: setting_row.is_headless_mode});
            try {
                const running_type = await message_send_status.get_running_type(knex);
                if (!running_type) {
                    resolve(false);
                }
                const site_config = require("./../../config/sites.json");
                const page = await browser.newPage();
                await page.goto(site_config.target_path + site_config.login);

                await page.evaluate((my_user) => {
                    document.querySelector("input[name=email]").value = my_user.email;
                    document.querySelector("input[name=pass]").value = my_user.password;
                }, my_user);
                await page.click("input[value=ログイン]");
                await page.waitForSelector("#TOP");
                await exports.delay(1000);

                console.log("start message send");
                let sent_list = [];
                for (let send_obj of send_list) {
                    let message_path = site_config.target_path + site_config.message_board.replace("$1", send_obj.id);
                    await page.goto(message_path);
                    await exports.delay(1000);
                    if (!!(await page.$(".title01"))) {
                        let is_enable_text = await page.evaluate(() => document.querySelector(".title01").innerHTML);
                        if (is_enable_text === 'エラー') {
                            sent_list.push(send_obj);
                            await browser.close();
                            resolve(sent_list);
                        }
                    }
                    await page.waitForSelector("#msg_comment");
                    if (env === 'production' || !setting_row.is_debug_mode) {
                        await page.evaluate((my_user) => {
                            document.querySelector("#msg_comment").value = my_user.send_message;
                        }, my_user);
                        await page.click("button[id=add]");
                        await exports.delay(2000);
                    }
                    sent_list.push(send_obj);
                }
                console.log("start logout");
                await page.goto(site_config.target_path);
                await page.click("a[class=logout]");
                await browser.close();
                console.log("end");
                resolve(sent_list);
            } catch (e) {
                console.log(e.stack);
                await browser.close();
                throw e;
            }
        })(puppeteer, my_user, setting_row, env).catch(function (e) {
            reject(e);
        });
    });
};