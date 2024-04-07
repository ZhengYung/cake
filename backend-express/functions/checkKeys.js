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

module.exports = checkKeys;