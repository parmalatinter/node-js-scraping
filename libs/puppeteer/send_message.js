exports.delay = function (timeout) {
    return new Promise(function (resolve) {
        setTimeout(resolve, timeout);
    });
};

exports.exec = function (puppeteer, my_user, send_list) {
    return new Promise(function (resolve, reject) {
        (async (puppeteer, my_user) => {
            const browser = await puppeteer.launch({headless: false});
            const site_config = require("./../../config/sites.json");
            const page = await browser.newPage();

            await page.goto(site_config.target_path + site_config.login);
            await page.screenshot({path: "public/img/screenshot.png"});

            await page.evaluate((my_user) => {
                document.querySelector("input[name=email]").value = my_user.id;
                document.querySelector("input[name=pass]").value = my_user.password;
            }, my_user);
            await page.screenshot({path: "public/img/login.png", fullPage: true});
            await page.click("input[value=ログイン]");
            await page.waitForSelector("#TOP");
            await exports.delay(1000);

            console.log("start message send");
            let sent_list = [];
            for (let send_obj of send_list) {
                let message_path = site_config.target_path + site_config.message_board.replace("$1", send_obj.id);
                await page.goto(message_path);
                await exports.delay(1000);
                await page.screenshot({path: "public/img/message.png", fullPage: true});
                await page.waitForSelector("#msg_comment");
                // await page.$eval("#msg_comment", el => el.value = "こんにちわ");
                // await page.click("button[id=add]");
                // await delay(2000);
                sent_list.push(send_obj);
                await page.screenshot({path: "public/img/send.png", fullPage: true});
            }
            console.log("start logout");
            await page.goto(site_config.target_path);
            await page.click("a[class=logout]");
            await browser.close();
            console.log("end");
            resolve(sent_list);
        })(puppeteer, my_user, send_list);
    });
};