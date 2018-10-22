var config = {
  db: 'ladder', // 資料庫名稱
  max: 500, // 資料庫最多連接數
  buffer: 5, // 資料庫最少連接數
  host: '128.199.110.202',
  port: 28015,
  timeoutGb: 60 * 1000 // 唔用連接的停留時間一分鐘
}

// 可以透過r去搞資料庫的野
var r = require('rethinkdbdash')(config)

// 最後滙出一個object, 入面可以透過db 去搞資料庫的野
module.exports = { db: r }
