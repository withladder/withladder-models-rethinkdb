// 嚴格模式,有部份的語法係會規定無法使用
'use strict'

exports.up = function (r, connection) {
  return Promise.all([
    // 新增資料表users,googleProviderId,email
    r
      .table('users')
      .indexCreate('email')
      .run(connection),
    r
      .table('users')
      .indexCreate('googleProviderId')
      .run(connection)
  ])
}

exports.down = function (r, connection) {
  return Promise.all([
    // 刪除資料表users,googleProviderId,email
    r
      .table('users')
      .indexDrop('email')
      .run(connection),
    r
      .table('users')
      .indexDrop('googleProviderId')
      .run(connection)
  ])
}
