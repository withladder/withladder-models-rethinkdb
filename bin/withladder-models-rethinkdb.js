#!/usr/bin/env node

let cmd = process.argv[2]

// 如果不是up的時候
if (cmd !== 'up') {
  // 就顯示only up can work
  console.error('only up can work!!!')
  // 結束程序
  process.exit(1)
}

// up 個陣搞啲乜就係下面寫出黎

// 載入rethinkdb-migrate
const Migrations = require('rethinkdb-migrate')
// 載入path
const path = require('path')
// 可以用logger將內部資料印出
logger(Migrations.migrate.emitter)
// 執行runMigrations,將up塞入op參數到
runMigrations('up')

function runMigrations (op) {
  // 定義一個連線用options為object
  const options = {
    username: 'user',
    migrationsDirectory: path.join(__dirname, '..', 'migrations'),
    host: 'localhost',
    port: 28015,
    db: 'ladder',
    driver: 'rethinkdbdash'
  }
  // options.op = op 參數
  options.op = op

  // 將D參數交比rethinkdb:migrate library搞
  Migrations.migrate(options)
    .then(() => console.log('Finished successfully'))
    .catch(console.error.bind(null, 'Error while running migrations:'))
}

function logger (emitter) {
  emitter.on('info', console.log)
  emitter.on('warn', console.log)
  emitter.on('error', console.error)
}
