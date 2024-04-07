const express = require('express');
const router = express.Router();
const pool = require('../functions/conn');
const checkKeys = require('../functions/checkKeys');
// 品牌故事
//獲取所有
router.get('/', async (req, res) => {
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
router.post('/', express.json(), async (req, res) => {
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
router.get('/:Id', async (req, res) => {
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
router.put('/', express.json(), async (req, res) => {
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
router.delete('/', express.json(), async (req, res) => {
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
module.exports = router;