// 定義一些function係user.js到提出
const {
  getUsers,
  createOrFindUser,
  getUserByEmail,
  getUserByIndex,
  saveUserProvider,
  storeUser,
  getUser,
  getUserById,
  getUserByUsername
} = require('./users')
// 滙出上面定義的function
module.exports = {
  getUsers,
  createOrFindUser,
  getUserByEmail,
  getUserByIndex,
  saveUserProvider,
  storeUser,
  getUser,
  getUserById,
  getUserByUsername
}
