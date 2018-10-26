// 定義config,database資料
const config = {
  driver: 'rethinkdbdash',
  db: 'ladder',
  host: 'localhost',
  port: 28015,
  migrationsDirectory: 'migrations'
}
// 滙出config
module.exports = config
