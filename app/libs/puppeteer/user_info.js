exports.delay = function (timeout) {
    return new Promise(function (resolve) {
        setTimeout(resolve, timeout);
    });
};

exports.exec = function (puppeteer, knex, my_user, setting_row, env, cloudinary) {
    const moment = require("moment");
    const user = require("../../models/user/user");
    const scraping_user_info_status = require('../../models/status/scraping_user_info_status');

    return new Promise(function (resolve, reject) {
        (async (puppeteer, knex, my_user, setting_row) => {
            const LAUNCH_OPTION = process.env.DYNO ? { args: ['--no-sandbox', '--disable-setuid-sandbox'] } : {headless: setting_row.is_headless_mode};
            const browser = await puppeteer.launch(LAUNCH_OPTION);
            try {
                const site_config = require("../../config/sites.json");
                const page = await browser.newPage();

                await page.goto(site_config.target_path + site_config.login, {waitUntil: "domcontentloaded"});

                console.log("start login", my_user);
                await page.evaluate((my_user) => {
                    document.querySelector("input[name=email]").value = my_user.email;
                    document.querySelector("input[name=pass]").value = my_user.password;
                    document.querySelector("input[value=ログイン]").click();
                }, my_user);

                await page.waitForSelector("#TOP");
                await exports.delay(1000);

                console.log("start scraping");

                let search_path = site_config.target_path + site_config.search;
                await page.goto(search_path, {waitUntil: "domcontentloaded"});

                await exports.delay(2000);

                console.log("set search condition");
                try {
                    await page.waitForSelector(".BoxSearchIndex");
                    const search_condition = require("../../config/search_condition.json");
                    await page.select("select[name=age_min]", search_condition.between.age.min[0]);
                    await page.select("select[name=age_max]", search_condition.between.age.max[0]);
                    await page.select("select[name=my_pref]", search_condition.selects.location[0]);
                    if (!!(await page.$("select[name=my_purpose]"))) {
                        await page.select("select[name=my_purpose]", search_condition.selects.dating_type[0]);
                    }
                    if (!!(await page.$("select[name=my_income]"))) {
                        await page.select("select[name=my_income]", search_condition.selects.salary[0]);
                    }
                    await page.click("input.btn_pink.search_btn");
                } catch (e) {
                    return resolve(0);
                }

                await exports.delay(1000);

                let is_available = false;

                var page_number = 1;
                var res = [];
                var info_count = 0;

                console.log("start get user ids");
                let limit = env === 'development' || setting_row.is_debug_mode ? 100 : 100000;
                while (page_number < limit) {

                    await exports.delay(3000);
                    var ids = await page.evaluate((selector) => {
                        const list = Array.from(document.querySelectorAll(selector));
                        return list.map(data => data.getAttribute("userid"));
                    }, '.BoxPhotoProfile');
                    await user.get_non_exist_ids(knex, ids, (my_user.sex === 1 ? 2 : 1)).then(function (non_exist_ids) {
                        ids = non_exist_ids;
                    }).catch(function (error) {
                        throw error
                    });

                    console.log("get url");
                    let url = page.url();

                    console.log("start get user info");
                    for (let id of ids) {
                        console.log('user info:' + id);
                        var running_type = await scraping_user_info_status.get_running_type(knex);
                        if (!running_type) {
                            limit = 0;
                            browser.close();
                            return resolve(info_count);
                        }
                        let profile_path = site_config.target_path + site_config.profile_detail.replace("$1", id);
                        await page.goto(profile_path, {waitUntil: "domcontentloaded"});
                        await exports.delay(2000);

                        try {

                            if (!!(await page.$(".title01"))) {
                                let is_enable_text = await page.evaluate(() => document.querySelector(".title01").innerHTML);
                                if (is_enable_text === 'エラー') {
                                    continue;
                                }else if(!is_enable_text){
                                    continue;
                                }
                            }
                        } catch (e) {
                            continue;
                        }

                        let login_text = "";
                        if (my_user.sex === 1) {
                            login_text = await page.evaluate(() => document.querySelector(".text").innerHTML);
                        } else {
                            login_text = await page.evaluate(() => document.querySelector(".offline-prefix").innerHTML);
                        }
                        if (login_text === "3日以上") {
                            continue;
                        }
                        let target_user = user.get_empty_user();
                        target_user.id = id;
                        target_user.sex = my_user.sex === 1 ? 2 : 1;
                        target_user.about = await page.evaluate(() => document.querySelector(".acordion_tree > .BoxGray > p").innerHTML);
                        target_user.name = await page.evaluate(() => document.querySelector(".name > span").innerHTML);
                        let situation = await page.evaluate(() => document.querySelector(".situation > li:nth-child(1)").innerHTML);
                        if (situation) {
                            target_user.age = Number(situation.split("／")[0].replace("歳", "").trim());
                            target_user.location = situation.split("／")[1].trim();
                        }

                        try {
                            console.log("start get user image");
                            await page.waitForSelector('.rect.slide1 > img');
                            if (setting_row.is_need_image) {
                                if (!!(await page.$(".rect.slide1 > img"))) {
                                    const image = await page.$('.rect.slide1 > img');
                                    let path = 'public/img/user/user_' + id + '.png';
                                    await image.screenshot({
                                        path: path
                                    });
                                    target_user.is_image = true;

                                    if (process.env.DYNO){
                                        cloudinary.uploader.upload(path, function(result) { 
                                            target_user.image_url = result.secure_url;
                                            console.log("uploaded image: ", result);
                                        });
                                    }
                                }
                            }
                        } catch (e) {
                            console.log("image faild");
                        }

                        if (my_user.sex === 1) {
                            let lis = await page.evaluate(() => {
                                const lis = Array.from(document.querySelectorAll(".statistics > li"));
                                return lis.map(li => li.textContent)
                            });
                            target_user.registered_at = moment(lis[0].replace("登録日:", "").replace("年", "-").replace("月", "-").replace("日", "").trim());
                            target_user.bad_reporting_count = Number(lis[1].replace("被通報:", "").replace("回", ""));
                            target_user.message_count = Number(lis[2].replace("メッセージ人数:", "").replace("人", ""));
                            target_user.bbs_count = Number(lis[3].replace("掲示板投稿:", "").replace("回", ""));
                        } else {
                            let lis = await page.evaluate(() => {
                                const lis = Array.from(document.querySelectorAll(".situation > li"));
                                return lis.map(li => li.textContent)
                            });
                            target_user.registered_at = moment().format("9999-12-31");
                            if (lis && lis[2]) {
                                target_user.salary = lis[2].split(" ")[1];
                                target_user.asset = lis[2].split(" ")[3];
                            }
                            if (!!(await page.$("img[alt=PREMIUM]"))) {
                                target_user.payment_status = 'PREMIUM';
                            }
                            if (!!(await page.$("img[alt=DIAMOND]"))) {
                                target_user.payment_status = 'DIAMOND';
                            }
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
                        await user.update(knex, target_user).catch(function (e) {
                            throw e;
                        });
                    }
                    info_count += res.length;
                    page_number++;

                    console.log("start next");

                    await page.goto(url + "&page=" + page_number, {waitUntil: "domcontentloaded"});
                    await exports.delay(1000);
                    await page.waitForSelector(".BoxSearchIndex");

                    is_available = (await page.$(".BoxPhotoProfile") !== null);
                    res = [];

                    running_type = await scraping_user_info_status.get_running_type(knex);
                    if (!running_type) {
                        limit = 0;
                        browser.close();
                        return resolve(info_count);
                    }
                }
                browser.close();
                return resolve(info_count);
            } catch (e) {
                browser.close();
                console.log(e.stack);
                throw e;
            }
        })(puppeteer, knex, my_user, setting_row, env).catch(function (e) {
            reject(e);
        });
    });
};
