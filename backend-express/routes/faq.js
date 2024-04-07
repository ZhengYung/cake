const express = require('express');
const router = express.Router();
const pool = require('../functions/conn');
const checkKeys = require('../functions/checkKeys');

//購物須知
//獲取所有
router.get('/', async (req, res) => {
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
router.post('/', express.json(), async (req, res) => {
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
router.get('/:Id', async (req, res) => {
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
router.put('/', express.json(), async (req, res) => {
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
router.delete('/', express.json(), async (req, res) => {
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

module.exports = router;