// 嚴格模式,有部份的語法係會規定無法使用
'use strict'

exports.up = function (r, connection) {
  return Promise.all([
    // 新增資料表users,facebookProviderId
    r
      .table('users')
      .indexCreate('facebookProviderId')
      .run(connection)
  ])
}

exports.down = function (r, connection) {
  return Promise.all([
    // 刪除資料表users,facebookProviderId
    r
      .table('users')
      .indexDrop('facebookProviderId')
      .run(connection)
  ])
}
