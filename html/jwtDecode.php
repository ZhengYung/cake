<?php
require_once 'vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
// 使用 JWT 库解碼 JWT
try {
    $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));
} catch (Exception $e) {
    $response->message = '解碼失敗：' . $e->getMessage();
}
