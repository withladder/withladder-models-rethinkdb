// database資料
const config = {
  driver: 'rethinkdbdash',
  db: 'ladder',
  host: 'localhost',
  port: 28015,
  migrationsDirectory: 'migrations'
}

module.exports = config
