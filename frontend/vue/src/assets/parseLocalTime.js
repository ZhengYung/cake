export default function parseLocalTime(area, ISO) {
    switch (area) {
        case 'Taipei':
            return new Date(ISO).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
    }
}