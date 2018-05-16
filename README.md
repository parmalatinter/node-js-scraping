## Install Postgres 10.40 (And set username postgres & password postgres)
https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
## with install pgAdmin4

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) .

```sh
$ https://github.com/parmalatinter/node-js-scraping.git # or clone your own fork
$ cd node-js-scraping
$ npm install

win
$ SET NODE_ENV=production or SET NODE_ENV=development

mac
export NODE_ENV=production or export NODE_ENV=development

$ npm start

log output.....
データベース初期化しました。 下記コマンドを実施してください.....

win
$ SET NODE_ENV=production or SET NODE_ENV=development

mac
export NODE_ENV=production or export NODE_ENV=development

$ npm start

log output.....
Listening on 5000, Open http://localhost:5000

open http://localhost:5000

## Running Via Command Line
via curl message send
curl http://localhost:5000/message/send -X POST

via curl info scraping
curl http://localhost:5000/scraping/start -X POST

via curl reset db
curl http://localhost:5000/admin/db/reset