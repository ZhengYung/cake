const express = require('express');
const router = express.Router();
const pool = require('../functions/conn');
const checkKeys = require('../functions/checkKeys');

//購物須知類別
//獲取所有
router.get('/', async (req, res) => {
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
router.post('/', express.json(), async (req, res) => {
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
router.get('/:Name', async (req, res) => {
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
router.put('/', express.json(), async (req, res) => {
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
router.delete('/', express.json(), async (req, res) => {
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
module.exports = router;