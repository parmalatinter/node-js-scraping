exports.delay = function (timeout) {
    return new Promise(function (resolve) {
        setTimeout(resolve, timeout);
    });
};


exports.exec = function (puppeteer, knex, my_user) {
    const moment = require("moment");
    const user = require("./../../models/user/user");

    return new Promise(function (resolve, reject) {
        (async (puppeteer, knex, my_user) => {
            const browser = await puppeteer.launch({headless: false});
            const site_config = require("./../../config/sites.json");
            const page = await browser.newPage();

            await page.goto(site_config.target_path + site_config.login);
            await page.screenshot({path: "public/img/screenshot.png"});

            console.log("start login", my_user);
            await page.evaluate((my_user) => {
                document.querySelector("input[name=email]").value = my_user.id;
                document.querySelector("input[name=pass]").value = my_user.password;
            }, my_user);
            await page.screenshot({path: "public/img/login.png", fullPage: true});
            await page.click("input[value=ログイン]");
            await page.waitForSelector("#TOP");
            await exports.delay(1000);
            console.log("start scraping");
            let search_path = site_config.target_path + site_config.search;
            await page.goto(search_path);
            await exports.delay(1000);
            await page.screenshot({path: "public/img/search.png", fullPage: true});
            await page.waitForSelector(".BoxSearchIndex");
            const search_condition = require("./../../config/search_condition.json");
            await page.select("select[name=age_min]", search_condition.age_min[0]);
            await page.select("select[name=age_max]", search_condition.age_max[0]);
            await page.select("select[name=my_pref]", search_condition.my_pref[0]);
            if (my_user.sex === 1){
                await page.select("select[name=my_purpose]", search_condition.my_purpose[0]);
            }else{
                await page.select("select[name=my_income]", search_condition.my_income[0]);
            }
            await page.click("input.btn_pink.search_btn");
            await exports.delay(1000);
            await page.screenshot({path: "public/img/search.png", fullPage: true});
            let url = page.url();
            var is_available = (await page.$(".BoxPhotoProfile") !== null);
            var page_number = 1;
            var res = [];

            /**
             * @todo debugようにlimitを設定する
             *
             * @type {number}
             */
            const limit = 2;
            while (is_available && page_number < limit) {
                let ids = await page.evaluate(() =>
                    [...document.querySelectorAll(".BoxPhotoProfile")].map(element => Number(element.getAttribute("userid")))
                );
                await user.get_non_exist_ids(knex, ids).then(function (non_exist_ids) {
                    ids = non_exist_ids;
                }).catch(function (error) {
                    throw error
                });

                for (let id of ids) {
                        let profile_path = site_config.target_path + site_config.profile_detail.replace("$1", id);
                        await page.goto(profile_path);
                        let login_text = "";
                        if (my_user.sex === 1){
                           login_text = await page.evaluate(() => document.querySelector(".text").innerHTML);
                        }else {
                           login_text = await page.evaluate(() => document.querySelector(".offline-prefix").innerHTML);
                        }
                        if(login_text === "3日以上"){
                            continue;
                        }
                        let target_user = user.get_empty_user();
                        target_user.id = id;
                        target_user.sex = my_user.sex === 1 ? 2 : 1;
                        target_user.about = await page.evaluate(() => document.querySelector(".acordion_tree > .BoxGray > p").innerHTML);
                        target_user.name = await page.evaluate(() => document.querySelector(".name > span").innerHTML);
                        let situation = await page.evaluate(() => document.querySelector(".situation > li:nth-child(1)").innerHTML);
                        target_user.age = Number(situation.split("／")[0].replace("歳", "").trim());
                        target_user.location = situation.split("／")[1].trim();

                        if (my_user.sex === 1) {
                            let lis = await page.evaluate(() => {
                                const lis = Array.from(document.querySelectorAll(".statistics > li"));
                                return lis.map(li => li.textContent)
                            });
                            target_user.registered_at = moment(lis[0].replace("登録日:", "").replace("年", "-").replace("月", "-").replace("日", "").trim());
                            target_user.bad_reporting_count = Number(lis[1].replace("被通報:", "").replace("回", ""));
                            target_user.message_count = Number(lis[2].replace("メッセージ人数:", "").replace("人", ""));
                            target_user.bbs_count = Number(lis[3].replace("掲示板投稿:", "").replace("回", ""));
                        }else {
                            let lis = await page.evaluate(() => {
                                const lis = Array.from(document.querySelectorAll(".situation > li"));
                                return lis.map(li => li.textContent)
                            });
                            target_user.registered_at = moment().format("9999-12-31");
                            target_user.salary = lis[2].split(" ")[1];
                            target_user.asset = lis[2].split(" ")[3];
                        }

                        let dts = await page.evaluate(() => {
                            const dts = Array.from(document.querySelectorAll(".table03 dl dt"));
                            return dts.map(dt => dt.textContent)
                        });
                        let dds = await page.evaluate(() => {
                            const dds = Array.from(document.querySelectorAll(".table03 dl dd"));
                            return dds.map(dd => dd.textContent)
                        });
                        dts.forEach(function (dt, index) {
                            switch (dt) {
                                case "身長":
                                    target_user.height = dds[index];
                                    break;
                                case "体型":
                                    target_user.body = dds[index];
                                    break;
                                case "職業":
                                    target_user.job = dds[index];
                                    break;
                                case "喫煙":
                                    target_user.smoking = dds[index];
                                    break;
                                case "飲酒":
                                    target_user.drinking = dds[index];
                                    break;
                                case "婚姻状況":
                                    target_user.marriage = dds[index];
                                    break;
                                case "交際タイプ":
                                    target_user.dating_type = dds[index];
                                    break;
                            }
                        });
                        res.push(target_user);
                    }

                page_number++;
                await page.goto(url + "&page=" + page_number);
                await page.waitForSelector(".BoxSearchIndex");
                is_available = (await page.$(".BoxPhotoProfile") !== null);
            }
            browser.close();
            resolve(res);
        })(puppeteer, knex, my_user);
    });
};