<?php
//設定了回應的內容類型為 JSON 格式，並指定了 UTF-8 編碼
header('Content-Type: application/json; charset=utf-8');
// 原始密碼
$password = "123456";

// 從資料庫中取得已經加密的密碼散列值（假設是 $hashedPassword）
// 通常是從資料庫中取得已經存儲的加密密碼
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// 驗證密碼是否匹配
$response = new stdClass();
if (password_verify("123", $hashedPassword)) {
    $response->message="正確";
} else {
    $response->message="錯誤";
}
echo json_encode($response);