const getTimeStamp = require('./getTimeStamp');
//所需的npm包
const express = require('express');
const cors = require('cors')
const multer = require('multer');
const fs = require('fs');
const mysql2 = require('mysql2/promise');
const app = express();

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
        const imageUrl = `http://192.168.10.29:3000/uploads/images/${req.file.filename}`;
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
        // 驗證keys數量是否一致
        if (Object.keys(data).length !== keys.length) {
            console.log('參數數量不對');
            reject(new Error('格式錯誤'));
            return;
        }
        // 驗證data中的key是否有在keys中
        if (!Object.keys(data).every(key => keys.includes(key))) {
            console.log('參數格式錯誤');
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
//獲取所有
app.get('/story', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const sql = 'SELECT * FROM `story` ORDER BY `Sequence`'
        const [rows, fields] = await conn.execute(sql);
        console.log(rows);
        console.log(fields);
        conn.release();
        res.status(200).json(rows);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
//新增
app.post('/story', express.json(), async (req, res) => {
    const jsonData = req.body.data;
    try {
        await checkKeys(jsonData, ["Title", "Content", "Sequence"]);
        const conn = await pool.getConnection();
        const sql = 'INSERT INTO `story`(`Title`, `Content`, `Sequence`) VALUES (?, ?, ?)';
        const values = [jsonData.Title, jsonData.Content, jsonData.Sequence];

        const [result, fields] = await conn.execute(sql, values);
        console.log(result);
        console.log(fields);
        conn.release();
        res.status(200).json('新增成功');
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});
//獲取特定
app.get('/story/:Id', async (req, res) => {
    const Id = req.params.Id;
    console.log(Id);
    try {
        const conn = await pool.getConnection();
        const sql = 'SELECT * FROM `story` WHERE `Id`= ? LIMIT 1';
        const values = [Id];

        const [result, fields] = await conn.execute(sql, values);
        console.log(result);
        console.log(fields);
        conn.release();
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});
//更新
app.put('/story', express.json(), async (req, res) => {
    const jsonData = req.body.data;
    console.log(jsonData);
    try {
        await checkKeys(jsonData, ["Id", "Title", "Content", "Sequence"]);
        const conn = await pool.getConnection();
        const sql = 'UPDATE `story` SET `Title`= ?,`Content`= ?,`Sequence`= ? WHERE `Id`= ?';
        const values = [jsonData.Title, jsonData.Content, jsonData.Sequence, jsonData.Id];
        const [result, fields] = await conn.execute(sql, values);

        console.log(result);
        console.log(fields);
        conn.release();
        res.status(200).json('更新成功');
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});
//刪除
app.delete('/story', express.json(), async (req, res) => {
    const jsonData = req.body;
    try {
        await checkKeys(jsonData, ["Id"]);
        const conn = await pool.getConnection();
        const sql = 'DELETE FROM `story` WHERE Id = ? LIMIT 1';
        const values = [jsonData.Id];
        const [result, fields] = await conn.execute(sql, values);

        console.log(result);
        console.log(fields);
        conn.release();
        res.status(200).json('刪除成功');
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

// 最新消息類別
//獲取所有
app.get('/newsLayer', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const sql = 'SELECT * FROM `news-layer` ORDER BY `Id`'
        const [rows, fields] = await conn.execute(sql);
        console.log(rows);
        console.log(fields);
        conn.release();
        res.status(200).json(rows);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
//新增
app.post('/newsLayer', express.json(), async (req, res) => {
    const jsonData = req.body.data;
    try {
        await checkKeys(jsonData, ["Name"]);
        const conn = await pool.getConnection();
        const sql = 'INSERT INTO `news-layer` (`Name`) VALUES (?)';
        const values = [jsonData.Name];

        const [result, fields] = await conn.execute(sql, values);
        console.log(result);
        console.log(fields);
        conn.release();
        res.status(200).json('新增成功');
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});
//獲取特定 By Name 用以檢查名稱是否已存在
app.get('/newsLayer/:Name', async (req, res) => {
    const Name = req.params.Name;
    console.log(Name);
    try {
        const conn = await pool.getConnection();
        const sql = 'SELECT * FROM `news-layer` WHERE `Name`= ? LIMIT 1';
        const values = [Name];

        const [result, fields] = await conn.execute(sql, values);
        console.log(result);
        console.log(fields);
        conn.release();
        if (result.length > 0) {
            res.status(200).json({ available: false });
        }
        else {
            res.status(200).json({ available: true });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});
//更新
app.put('/newsLayer', express.json(), async (req, res) => {
    const jsonData = req.body.data;
    console.log(jsonData);
    try {
        await checkKeys(jsonData, ["Name", "Id"]);
        const conn = await pool.getConnection();
        const sql = 'UPDATE `news-layer` SET `Name`= ? WHERE `Id`= ?';
        const values = [jsonData.Name, jsonData.Id];
        const [result, fields] = await conn.execute(sql, values);

        console.log(result);
        console.log(fields);
        conn.release();
        res.status(200).json('更新成功');
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});
//刪除
app.delete('/newsLayer', express.json(), async (req, res) => {
    const jsonData = req.body;
    try {
        await checkKeys(jsonData, ["Id"]);
        const conn = await pool.getConnection();
        const sql = 'DELETE FROM `news-layer` WHERE Id = ? LIMIT 1';
        const values = [jsonData.Id];
        const [result, fields] = await conn.execute(sql, values);

        console.log(result);
        console.log(fields);
        conn.release();
        res.status(200).json('刪除成功');
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

//產品類別
//獲取所有
app.get('/productLayer', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const sql = 'SELECT * FROM `product-layer` ORDER BY `Id`'
        const [rows, fields] = await conn.execute(sql);
        console.log(rows);
        console.log(fields);
        conn.release();
        res.status(200).json(rows);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
//新增
app.post('/productLayer', express.json(), async (req, res) => {
    const jsonData = req.body.data;
    try {
        await checkKeys(jsonData, ["Name"]);
        const conn = await pool.getConnection();
        let sql = 'INSERT INTO `product-layer` (`Name`) VALUES (?)';
        let values = [jsonData.Name];

        const [result, fields] = await conn.execute(sql, values);
        console.log(result);
        console.log(fields);
        conn.release();
        res.status(200).json('新增成功');
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

//獲取特定 By Name 用以檢查名稱是否已存在
app.get('/productLayer/:Name', async (req, res) => {
    const Name = req.params.Name;
    console.log(Name);
    try {
        const conn = await pool.getConnection();
        const sql = 'SELECT * FROM `product-layer` WHERE `Name`= ? LIMIT 1';
        const values = [Name];

        const [result, fields] = await conn.execute(sql, values);
        console.log(result);
        console.log(fields);
        conn.release();
        if (result.length > 0) {
            res.status(200).json({ available: false });
        }
        else {
            res.status(200).json({ available: true });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});
//更新
app.put('/productLayer', express.json(), async (req, res) => {
    const jsonData = req.body.data;
    console.log(jsonData);
    try {
        await checkKeys(jsonData, ["Name", "Id"]);
        const conn = await pool.getConnection();
        const sql = 'UPDATE `product-layer` SET `Name`= ? WHERE `Id`= ?';
        const values = [jsonData.Name, jsonData.Id];
        const [result, fields] = await conn.execute(sql, values);

        console.log(result);
        console.log(fields);
        conn.release();
        res.status(200).json('更新成功');
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});
//刪除
app.delete('/productLayer', express.json(), async (req, res) => {
    const jsonData = req.body;
    try {
        await checkKeys(jsonData, ["Id"]);
        const conn = await pool.getConnection();
        const sql = 'DELETE FROM `product-layer` WHERE Id = ? LIMIT 1';
        const values = [jsonData.Id];
        const [result, fields] = await conn.execute(sql, values);

        console.log(result);
        console.log(fields);
        conn.release();
        res.status(200).json('刪除成功');
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

//購物須知類別
//獲取所有
app.get('/faqLayer', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const sql = 'SELECT * FROM `faq-layer` ORDER BY `Id`'
        const [rows, fields] = await conn.execute(sql);
        console.log(rows);
        console.log(fields);
        conn.release();
        res.status(200).json(rows);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
//新增
app.post('/faqLayer', express.json(), async (req, res) => {
    const jsonData = req.body.data;
    try {
        await checkKeys(jsonData, ["Name"]);
        const conn = await pool.getConnection();
        let sql = 'INSERT INTO `faq-layer` (`Name`) VALUES (?)';
        let values = [jsonData.Name];

        const [result, fields] = await conn.execute(sql, values);
        console.log(result);
        console.log(fields);
        conn.release();
        res.status(200).json('新增成功');
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

//獲取特定 By Name 用以檢查名稱是否已存在
app.get('/faqLayer/:Name', async (req, res) => {
    const Name = req.params.Name;
    console.log(Name);
    try {
        const conn = await pool.getConnection();
        const sql = 'SELECT * FROM `faq-layer` WHERE `Name`= ? LIMIT 1';
        const values = [Name];

        const [result, fields] = await conn.execute(sql, values);
        console.log(result);
        console.log(fields);
        conn.release();
        if (result.length > 0) {
            res.status(200).json({ available: false });
        }
        else {
            res.status(200).json({ available: true });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});
//更新
app.put('/faqLayer', express.json(), async (req, res) => {
    const jsonData = req.body.data;
    console.log(jsonData);
    try {
        await checkKeys(jsonData, ["Name", "Id"]);
        const conn = await pool.getConnection();
        const sql = 'UPDATE `faq-layer` SET `Name`= ? WHERE `Id`= ?';
        const values = [jsonData.Name, jsonData.Id];
        const [result, fields] = await conn.execute(sql, values);

        console.log(result);
        console.log(fields);
        conn.release();
        res.status(200).json('更新成功');
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});
//刪除
app.delete('/faqLayer', express.json(), async (req, res) => {
    const jsonData = req.body;
    try {
        await checkKeys(jsonData, ["Id"]);
        const conn = await pool.getConnection();
        const sql = 'DELETE FROM `faq-layer` WHERE Id = ? LIMIT 1';
        const values = [jsonData.Id];
        const [result, fields] = await conn.execute(sql, values);

        console.log(result);
        console.log(fields);
        conn.release();
        res.status(200).json('刪除成功');
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});


//最新消息
//獲取所有
app.get('/news', async (req, res) => {
    try {
        const conn = await pool.getConnection();

        const sql = 'SELECT a.*,b.Name AS LayerName FROM `news` AS a LEFT JOIN `news-layer` AS b ON a.LayerId=b.Id ORDER BY `DOA` DESC';
        const [rows, fields] = await conn.execute(sql);
        console.log(rows);
        console.log(fields);
        conn.release();
        res.status(200).json(rows);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
//新增
app.post('/news', express.json(), async (req, res) => {
    const jsonData = req.body.data;
    const date = new Date(jsonData.DOA);
    try {
        await checkKeys(jsonData, ["LayerId", "Title", "Sub", "Content", "Thumbnail", "DOA"]);
        const conn = await pool.getConnection();
        const sql = 'INSERT INTO `news`(`LayerId`, `Title`, `Sub`, `Content`, `Thumbnail`, `DOA`) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [jsonData.LayerId, jsonData.Title, jsonData.Sub, jsonData.Content, jsonData.Thumbnail, date.toISOString().replace('T', ' ').replace('Z', '')];

        const [result, fields] = await conn.execute(sql, values);
        console.log(result);
        console.log(fields);
        conn.release();
        res.status(200).json('新增成功');
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});
//獲取特定
app.get('/news/:Id', async (req, res) => {
    const Id = req.params.Id;
    console.log(Id);
    try {
        const conn = await pool.getConnection();
        const sql = 'SELECT * FROM `news` WHERE `Id` = ? LIMIT 1';
        const values = [Id];

        const [result, fields] = await conn.execute(sql, values);
        console.log(result);
        console.log(fields);
        conn.release();
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});
//更新
app.put('/news', express.json(), async (req, res) => {
    const jsonData = req.body.data;
    const date = new Date(jsonData.DOA);
    console.log(jsonData);
    try {
        await checkKeys(jsonData, ["Id", "LayerId", "Title", "Sub", "Content", "Thumbnail", "DOA"]);
        const conn = await pool.getConnection();
        const sql = 'UPDATE `news` SET `LayerId`= ?, `Title`= ?, `Sub`= ?, `Content`= ?, `Thumbnail`= ?, `DOA`= ? WHERE `Id`= ?';
        const values = [jsonData.LayerId, jsonData.Title, jsonData.Sub, jsonData.Content, jsonData.Thumbnail, date.toISOString().replace('T', ' ').replace('Z', ''), jsonData.Id];
        const [result, fields] = await conn.execute(sql, values);

        console.log(result);
        console.log(fields);
        conn.release();
        res.status(200).json('更新成功');
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});
//刪除
app.delete('/news', express.json(), async (req, res) => {
    const jsonData = req.body;
    try {
        await checkKeys(jsonData, ["Id"]);
        const conn = await pool.getConnection();
        const sql = 'DELETE FROM `news` WHERE Id = ? LIMIT 1';
        const values = [jsonData.Id];
        const [result, fields] = await conn.execute(sql, values);

        console.log(result);
        console.log(fields);
        conn.release();
        res.status(200).json('刪除成功');
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

//購物須知
//獲取所有
app.get('/faq', async (req, res) => {
    try {
        const conn = await pool.getConnection();

        const sql = 'SELECT a.*,b.Name FROM `faq` AS a LEFT JOIN `faq-layer` AS b ON a.LayerId=b.Id ORDER BY a.LayerId ASC, a.Sequence ASC';
        const [rows, fields] = await conn.execute(sql);
        console.log(rows);
        console.log(fields);
        conn.release();
        res.status(200).json(rows);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
//新增
app.post('/faq', express.json(), async (req, res) => {
    const jsonData = req.body.data;
    try {
        await checkKeys(jsonData, ["LayerId", "Sequence", "Title", "Content"]);
        const conn = await pool.getConnection();
        const sql = 'INSERT INTO `faq`(`LayerId`, `Sequence`, `Title`, `Content`) VALUES (?, ?, ?, ?)';
        const values = [jsonData.LayerId, jsonData.Sequence, jsonData.Title, jsonData.Content];

        const [result, fields] = await conn.execute(sql, values);
        console.log(result);
        console.log(fields);
        conn.release();
        res.status(200).json('新增成功');
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});
//獲取特定
app.get('/faq/:Id', async (req, res) => {
    const Id = req.params.Id;
    console.log(Id);
    try {
        const conn = await pool.getConnection();
        const sql = 'SELECT * FROM `faq` WHERE `Id` = ? LIMIT 1';
        const values = [Id];

        const [result, fields] = await conn.execute(sql, values);
        console.log(result);
        console.log(fields);
        conn.release();
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});
//更新
app.put('/faq', express.json(), async (req, res) => {
    const jsonData = req.body.data;
    const date = new Date(jsonData.DOA);
    console.log(jsonData);
    try {
        await checkKeys(jsonData, ["Id", "LayerId", "Sequence", "Title", "Content"]);
        const conn = await pool.getConnection();
        const sql = 'UPDATE `faq` SET `LayerId`= ?, `Sequence`= ?, `Title`= ?, `Content`= ? WHERE `Id`= ?';
        const values = [jsonData.LayerId, jsonData.Sequence, jsonData.Title, jsonData.Content, jsonData.Id];
        const [result, fields] = await conn.execute(sql, values);

        console.log(result);
        console.log(fields);
        conn.release();
        res.status(200).json('更新成功');
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});
//刪除
app.delete('/faq', express.json(), async (req, res) => {
    const jsonData = req.body;
    try {
        await checkKeys(jsonData, ["Id"]);
        const conn = await pool.getConnection();
        const sql = 'DELETE FROM `faq` WHERE Id = ? LIMIT 1';
        const values = [jsonData.Id];
        const [result, fields] = await conn.execute(sql, values);

        console.log(result);
        console.log(fields);
        conn.release();
        res.status(200).json('刪除成功');
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

app.post('/date', express.json(), (req, res) => {
    console.log('date----------:' + req.body.date);
    res.status(200).json({ message: 'hello express date' })
})
//監聽
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



