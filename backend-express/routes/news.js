const express = require('express');
const router = express.Router();
const pool = require('../functions/conn');
const checkKeys = require('../functions/checkKeys');

//最新消息
//獲取所有
router.get('/', async (req, res) => {
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
router.post('/', express.json(), async (req, res) => {
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
router.get('/:Id', async (req, res) => {
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
router.put('/', express.json(), async (req, res) => {
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
router.delete('/', express.json(), async (req, res) => {
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

module.exports = router;