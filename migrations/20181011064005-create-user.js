// 嚴格模式,有部份的語法係會規定無法使用
'use strict'

exports.up = function (r, connection) {
  // 新增資料表users
  return r
    .tableCreate('users')
    .run(connection)
}

exports.down = function (r, connection) {
  // 刪除資料表users
  return r
    .tableDrop('users')
    .run(connection)
}
