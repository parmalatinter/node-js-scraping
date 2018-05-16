## Install Postgres 10.40 (And set username postgres & password postgres)
https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) .

```sh
$ https://github.com/parmalatinter/node-js-scraping.git # or clone your own fork
$ cd node-js-scraping
$ npm install
$ npm start　--env development or --env production

log output.....
データベース初期化しました。 npm start --env development を実施してください

$ npm start　--env development or --env production

log output.....
Listening on 5000, Open http://localhost:5000

open http://localhost:5000

## Running Via Command Line
via curl message send
curl http://localhost:5000/message/send -X POST

via curl info scraping
curl http://localhost:5000/scraping/start -X POST
