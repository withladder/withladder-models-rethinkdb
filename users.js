
// 載入database
const { db } = require('./db')
const debug = require('debug')('api:models:users')

// 設定功能返回database中所有用戶data
const getUsers = () => {
  return db.table('users')
}

// 定義getUser為input object
const getUser = async (input) => {
  // input入面係input.id的時候就返回getUserById揾userId
  if (input.id) return getUserById(input.id)
  // input入面係input.username的時候就返回getUserByUsername揾username
  if (input.username) return getUserByUsername(input.username)
  return null
}

// 利用userId係users資料庫找user
const getUserById = (userId) => {
  // 返回資料庫揾野的promise
  return db
    // 選擇資料庫users的表
    .table('users')
    // 揾userId
    .get(userId)
    .run()
}

// 利用username係users資料庫找user
const getUserByUsername = (username) => {
  // 返回資料庫揾野的promise
  return db
    // 選擇資料庫users的表
    .table('users')
    // 揾username,在一個叫index的索引
    .getAll(username, { index: 'username' })
    .run()
    // 如果他是一個空的arry [],返回 null
    // 如果揾到username
    // 返回[]第一個揾到的user
    .then(result => (result ? result[0] : null))
}
// const user = {
//   googleProviderId,
//   name,
//   firstName,
//   lastName,
//   email,
//   profilePhoto,
//   createdAt: new Date(),
//   lastSeen: new Date()
// }
// providerMethod = 'googleProviderId'(providerid仲有twitter,facebook,github都係等於providerMethod)
const createOrFindUser = (user, providerMethod) => {
  debug('正在執行 createOrFindUser')
  // 設一個變數叫promise拿來save
  let promise
  // 如果係user裹面找到 googleProviderId 的value
  if (user[providerMethod]) {
    debug('找到 google id', user[providerMethod])
    // 如果找到, 將providerMethod和user的providerMethod交比getUserByIndex運行
    promise = getUserByIndex(providerMethod, user[providerMethod])
      // 資料庫操作完後, 得到storedUser的object
      // 咁 stroedUser 係乜野黎呢?
      // 原來 getUserByIndex 會幫你手搵搵資料庫裡面有無符合既 user
      // 如果有咩既記錄, 就會將個 user 交比 storedUser
      // 如果無咁既記錄, 佢亦都會將 null 交比 storedUser
      .then(storedUser => {
        debug('getUserByIndex執行完後')
        // 如果有storedUser的值, 即係搵到, 即係唔係 null
        if (storedUser) {
          // 返回storedUser
          return storedUser
        }

        // 如果搵唔到, 即係 storedUser = null 時
        // 就即據 user.email 再係資料庫入面搵
        // 如果有user.email的值, 即係搵到, 即係唔係 null
        if (user.email) {
          // 返回 user.email 比 getUserByEmail 運行
          return getUserByEmail(user.email)
        } else {
          // 返回 {}
          return Promise.resolve({})
        }
      })
  } else {
    // 如果係user裹找不到 googleProviderId 的value
    // 如果有user.email的值, 即係搵到, 即係唔係 null
    if (user.email) {
      debug('找不到 google id, 但找到 email', user.email)
      // 返回 user.email 比 getUserByEmail 運行
      promise = getUserByEmail(user.email)
    } else {
      // 返回 {}
      promise = Promise.resolve({})
    }
  }

  return promise
    // 有機會係一個空的物件, user無 mail 時
    // or反回資料庫找到一個user的物件, 資料庫真係有個筆資料時
    // or返回資料庫找到到物件即 null, 資料庫真係無個筆資料時
    .then(storedUser => {
      // 如果storedUser不是一個空的物件,就是在資料庫找到一筆資料
      if (storedUser && storedUser.id) {
        debug('找到資料庫一筆資料, storedUser', storedUser)
        // 但那筆資料沒有 googleID
        if (!storedUser[providerMethod]) {
          // 更新新的資料,根據用戶的id去創造google的
          debug('資料庫個筆資料沒有 google id, 所以要去更新', user[providerMethod])
          return saveUserProvider(
            storedUser.id,
            providerMethod,
            user[providerMethod]
          ).then(() => {
            // 等更新資料完之後,就反回storedUser
            return Promise.resolve(storedUser)
          })
        } else {
          // 如果本來那個user有gooleID,就直接反回去storedUser
          return Promise.resolve(storedUser)
        }
      }
      // 原來 storedUser 係空 object, 即係代表資料庫裡面沒有用戶記錄
      // save一個新用戶
      return storeUser(user)
    })
    // 如果上面資料庫操作 (更新用戶資料或者新增用戶資料)
    // 有error的時候,就運行
    .catch(err => {
      // 如果有 user.id, 輸出錯誤訊息
      if (user.id) {
        console.error(err)
        return new Error(`No user found for id ${user.id}.`)
      }
      debug('error', err)
      // 無 user.id, 再試多次新增用戶
      return storeUser(user)
    })
}

// 更新用戶的資料
const saveUserProvider = (
  userId,
  // googleid的key
  providerMethod,
  // googleid的value
  providerId,
  // 額外的欄位
  extraFields
) => {
  // 返回資料庫操作的promise
  return db
    .table('users')
    .get(userId) // 根據userId找user
    .run()
    .then(result => {
      // result有可能係 user object, 有可能係null
      // Object.assign係合體object
      let obj = Object.assign({}, result)
      // 將 providerMethod 和 providerId 加到 obj
      // 即
      // obj = { id: '1', name: 'comus', googleProviderId: 'jsdkfdskfdskf' }
      obj[providerMethod] = providerId
      return obj
    })
    .then(user => {
      // user有兩個情況
      // 1. 上面根據 userId 在資料庫中找不到記錄, user = {} (呢個情況基本上無可能發生)
      // 2. 上面根據 userId 找到記錄, user = { id: '1', name: 'comus', googleProviderId: 'jsdkfdskfdskf' }
      return db
        .table('users')
        .get(userId)
        .update( // 更新資料庫裹面useId那筆資料
          {
            ...user, // 這個user包含了google id的資料
            ...extraFields// 這個這個extrafields包含了額外的欄位
          },
          // 更新完之後返回更新完的資料
          { returnChanges: true }
        )
        .run()
        .then(result => {
          // result.changes[0].new_val 係因為上面有要求 returnChanges
          // 所以 result.changes[0].new_val 是更新左既資料
          const user = result.changes[0].new_val
          // 返回更新了的 user
          return user
        })
    })
}

// 新增用戶
const storeUser = (user) => {
  debug('新增用戶 storeUser')
  // 返回資料庫新增的promise
  return db
    // 選擇資料庫users的表
    .table('users')
    // 新增
    .insert(
      {
        ...user, // 最上面那堆物件
        modifiedAt: null // 更新時間
      },
      // 新增完之後,返回新增佐既資料
      { returnChanges: true }
    )
    .run()
    .then(result => {
      // result.changes[0].new_val 係因為上面有要求 returnChanges
      // 所以 result.changes[0].new_val 是更新左既資料
      const user = result.changes[0].new_val
      // 返回新增的user
      return user
    })
}

// 利用email係users資料庫找user
const getUserByEmail = (email) => {
  // 返回資料庫揾野的promise
  return db
    // 選擇資料庫users的表
    .table('users')
    // 揾email,在一個叫index的索引
    .getAll(email, { index: 'email' })
    .run()
    // 如果他是一個空的arry [],返回 null
    // 如果揾到email, results = [ { id: '1', email: 'aaa@bbb.com' } ]
    // 返回[]第一個揾到的user
    .then(results => (results.length > 0 ? results[0] : null))
}

// 利用indexValue係users資料庫找user
const getUserByIndex = (indexName, indexValue) => {
  // 返回資料庫揾野的promise
  return db
    // 選擇資料庫users的表
    .table('users')
    // 揾indexValue,在一個叫indexName的索引
    .getAll(indexValue, { index: indexName })
    .run()
    // found: true, true, results[0]
    // not found: true, false
    // found: return result[0]
    // not found: return false
    .then(results => results && results.length > 0 && results[0])
}

// 滙出一個object
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
