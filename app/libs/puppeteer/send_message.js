exports.delay = function (timeout) {
    return new Promise(function (resolve) {
        setTimeout(resolve, timeout);
    });
};

exports.exec = function (puppeteer, knex, my_user, send_obj, setting_row, env) {
    const message_send_status = require('../../models/status/message_send_status');
    return new Promise(function (resolve, reject) {
        (async (puppeteer, my_user, setting_row, env) => {
            const browser = await puppeteer.launch({headless: setting_row.is_headless_mode});
            try {
                const running_type = await message_send_status.get_running_type(knex);
                if (!running_type) {
                    resolve(false);
                }
                const id = send_obj.id;
                const site_config = require("../../config/sites.json");
                const page = await browser.newPage();
                await page.goto(site_config.target_path + site_config.login, {waitUntil: "domcontentloaded"});

                await page.evaluate((my_user) => {
                    document.querySelector("input[name=email]").value = my_user.email;
                    document.querySelector("input[name=pass]").value = my_user.password;
                    document.querySelector("input[value=ログイン]").click();
                }, my_user);

                await page.waitForNavigation();
                await page.waitForSelector("#TOP");

                console.log("start message send");

                let message_path = site_config.target_path + site_config.message_board.replace("$1", send_obj.id);


                try {
                    await page.goto(message_path, {waitUntil: "domcontentloaded"});
                    if (!!(await page.$(".title01"))) {
                        let is_enable_text = await page.evaluate(() => document.querySelector(".title01").innerHTML);
                        if (is_enable_text === 'エラー') {
                            await browser.close();
                            resolve(id);
                        }
                    }
                } catch (e) {
                    await browser.close();
                    resolve(id);
                }

                await page.waitForSelector("#msg_comment");
                if (env === 'production' || !setting_row.is_debug_mode) {
                    await page.evaluate((my_user) => {
                        document.querySelector("#msg_comment").value = my_user.send_message;
                    }, my_user);
                    await page.click("button[id=add]");
                    await exports.delay(2000);
                }
                console.log("start logout");
                await page.goto(site_config.target_path, {waitUntil: "domcontentloaded"});

                await page.click("a[class=logout]");
                await browser.close();
                console.log("end");
                resolve(id);
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