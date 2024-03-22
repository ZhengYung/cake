const getTimeStamp = require('./getTimeStamp');
//所需的npm包
const express = require('express');
const cors = require('cors')
const multer = require('multer');
const fs = require('fs');
const mysql2 = require('mysql2/promise');
const app = express();
// app.use(express.json());
app.use(cors())

app.use('/uploads', express.static('uploads'));

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


//上傳圖檔
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 檢查目錄是否存在，如果不存在則建立它
        fs.access('uploads/images', (err) => {
            if (err) {
                //mkdirSync->同步(目錄未建立完成，程序不會往下執行),recursive:true->遞歸
                fs.mkdirSync('uploads/images', { recursive: true });
            }
            cb(null, 'uploads/images');
        });
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split('.');
        const timestamp = getTimeStamp();
        cb(null, `${fileName[0]}-${timestamp}.${fileName[1]}`);
    }
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
        // 只接受三種圖片格式
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('只接受jpg|jpeg|png')).
                return;
        }
        cb(null, true)
    }
})

app.post('/image', imageUpload.single('upload'),
    (req, res, next) => {
        // 回傳圖片的 URL
        const imageUrl = `http://localhost:3000/uploads/images/${req.file.filename}`;
        res.json({ success: true, url: imageUrl });
    },
    (error, req, res, next) => {
        // 上傳失敗，丟出錯誤訊息時執行
        res.json({ error: error.message })
    }
)
// 驗證欄位
function checkKeys(data, keys) {
    return new Promise((resolve, reject) => {
        // 驗證jsonData中的鍵是否只有Title和Content
        if (!Object.keys(data).every(key => keys.includes(key))) {
            reject(new Error('格式錯誤'));
            return;
        }
        const hasEmpty = Object.values(data).some(value => {
            // 如果值是 null、undefined、空字符串或空陣列，則返回 true
            return value === null ||
                value === undefined ||
                value === '' ||
                (Array.isArray(value) && value.length === 0);
        });
        if (hasEmpty) {
            reject(new Error('不能為空'));
            return;
        }
        resolve();
    });
}

// 品牌故事
app.get('/story', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const sql = 'SELECT * FROM `story` ORDER BY `Sequence`'
        const [rows, fields] = await conn.execute(sql);
        console.log(rows);
        console.log(fields);
        res.status(200).json(rows);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
app.post('/story', express.json(), async (req, res) => {
    const jsonData = req.body;
    try {
        await checkKeys(jsonData, ["Title", "Content", "Sequence"]);
        const conn = await pool.getConnection();
        const sql = 'INSERT INTO `story`(`Title`, `Content`, `Sequence`) VALUES (?, ?, ?)';
        const values = [jsonData.Title, jsonData.Content, jsonData.Sequence];

        const [result, fields] = await conn.execute(sql, values);
        console.log(result);
        console.log(fields);
        conn.release();
        res.status(200).json('上傳成功');
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});


//確認server是否存活
app.get('/', (req, res) => {
    console.log('hello express')
    res.status(200).json({ message: 'hello express' })
});

//監聽
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
