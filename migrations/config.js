// database資料
const config = {
  driver: 'rethinkdbdash',
  db: 'ladder',
  host: '128.199.110.202',
  port: 28015,
  migrationsDirectory: 'api/migrations'
}

module.exports = config
