# 安裝

```
npm install withladder-models-rethinkdb
```

# 用法

```js
require('withladder-models-rethinkdb')
```

# 資料庫


```
npm run rethinkdb:migrate create create-user
```

運行up所有程式

```
npm run db:migrate
```

刪除down所有程式

```
npm run db:drop
```

# 解釋資料夾內容

-/bin : 定義database的資料
-/migrations ： 利用3個特別功能去初始化資料夾
-/db.js : 透過db 去搞資料庫的野
-/users.js : 定義一些功能,滙出object(入面的功能多數為找id,user...)

# 流程

- 在user.js提取已定義object入面的功能,再滙出index定義的function
- 將usersjs的內容利用自己設定的getUsers輸入
    - 入面有設定好的function
      - getUsers, 設定功能反回database中所有用戶data
        - 設定資料庫, 最後滙出一個object({ db: r }), 入面可以透過db 去搞資料庫的野
      - createOrFindUser, 搜尋用戶ID叫providerMethod
        - providerMethod = providerid仲有twitter,facebook,github都係等於providerMethod
      - getUserByEmail, 利用email係users資料庫找user
      - getUserByIndex, 利用indexValue係users資料庫找user
      - saveUserProvider, 更新用戶的資料
      - storeUser, 新增用戶
