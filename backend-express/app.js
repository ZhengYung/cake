const getTimeStamp = require('./getTimeStamp');
//所需的npm包
const express = require('express');
const cors = require('cors')
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
// app.use(express.json());
app.use(cors())

app.use('/uploads', express.static('uploads'));

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

//確認server是否存活
app.get('/', (req, res) => {
    res.json({ message: 'express live' })
});

//監聽
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
