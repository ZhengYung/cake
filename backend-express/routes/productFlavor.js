const express = require('express');
const router = express.Router();
const pool = require('../functions/conn');
const checkKeys = require('../functions/checkKeys');
//產品口味/規格
//獲取所有
router.get('/', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const sql = 'SELECT a.*,b.Name AS ProductName FROM `product-flavor` AS a LEFT JOIN `product` AS b ON a.ProductId=b.Id';
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
    const keys = ["ProductId", "Name", "Price", "Img1", "Img2", "Img3", "Img4", "Img5"]
    const jsonData = req.body.data;
    if (!Object.keys(jsonData).every(key => keys.includes(key))) {
        console.log('參數數量不對');
        res.status(400).json({ message: '格式錯誤' });
    }
    else {
        const hasEmpty = [jsonData.ProductId, jsonData.Name, jsonData.Price, jsonData.Img1].some(value => {
            // 如果值是 null、undefined、空字符串或空陣列，則返回 true
            return value === null ||
                value === undefined ||
                value === '' ||
                (Array.isArray(value) && value.length === 0);
        });
        if (hasEmpty) {
            res.status(400).json({ message: '不能為空' });
            return;
        }
        const conn = await pool.getConnection();
        const sql = 'INSERT INTO `product-flavor`(`ProductId`, `Name`, `Price`, `Img1`, `Img2`, `Img3`, `Img4`, `Img5`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [jsonData.ProductId, jsonData.Name, jsonData.Price, jsonData.Img1, jsonData.Img2, jsonData.Img3, jsonData.Img4, jsonData.Img5];

        const [result, fields] = await conn.execute(sql, values);
        console.log(result);
        console.log(fields);
        conn.release();
        res.status(200).json('新增成功');
    }
});
//獲取特定
router.get('/:Id', async (req, res) => {
    const Id = req.params.Id;
    console.log(Id);
    try {
        const conn = await pool.getConnection();
        const sql = 'SELECT * FROM `product-flavor` WHERE `Id` = ? LIMIT 1';
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
    const keys = ["Id", "ProductId", "Name", "Price", "Img1", "Img2", "Img3", "Img4", "Img5"]
    const jsonData = req.body.data;
    if (!Object.keys(jsonData).every(key => keys.includes(key))) {
        console.log('參數數量不對');
        res.status(400).json({ message: '格式錯誤' });
    }
    else {
        const hasEmpty = [jsonData.Id, jsonData.ProductId, jsonData.Name, jsonData.Price, jsonData.Img1].some(value => {
            // 如果值是 null、undefined、空字符串或空陣列，則返回 true
            return value === null ||
                value === undefined ||
                value === '' ||
                (Array.isArray(value) && value.length === 0);
        });
        if (hasEmpty) {
            res.status(400).json({ message: '不能為空' });
            return;
        }
        const conn = await pool.getConnection();
        const sql = 'UPDATE `product-flavor` SET `ProductId`= ?, `Name`= ?, `Price`= ?, `Img1`= ?, `Img2`= ?, `Img3`= ?, `Img4`= ?, `Img5`= ? WHERE `Id`= ?';
        const values = [jsonData.ProductId, jsonData.Name, jsonData.Price, jsonData.Img1, jsonData.Img2, jsonData.Img3, jsonData.Img4, jsonData.Img5, jsonData.Id];

        const [result, fields] = await conn.execute(sql, values);
        console.log(result);
        console.log(fields);
        conn.release();
        res.status(200).json('新增成功');
    }

});
//刪除
router.delete('/', express.json(), async (req, res) => {
    const jsonData = req.body;
    try {
        await checkKeys(jsonData, ["Id"]);
        const conn = await pool.getConnection();
        const sql = 'DELETE FROM `product-flavor` WHERE Id = ? LIMIT 1';
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