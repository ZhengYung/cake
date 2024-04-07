// db.js
const mysql2 = require('mysql2/promise');

// 建立資料庫連線
// waitForConnections: 如果連接池已滿，並且waitForConnections設為true，
// 則在池中有可用連接之前，pool.query會暫時排隊。如果設為false，則會立即返回錯誤。

// connectionLimit: 限制連接池中的最大連接數。當所有連接都在使用時，新的查詢會暫時排隊，直到有連接可用為止。

// queueLimit: 控制暫時排隊的查詢數量。如果queueLimit為0，則無限制地排隊，直到有可用連接為止。
// 如果queueLimit為正整數，則會拒絕超過該限制數量的查詢。
const pool = mysql2.createPool({
    host: 'db',
    user: 'root',
    password: '123456',
    database: 'cake',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;