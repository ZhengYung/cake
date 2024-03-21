<?php
//設定了回應的內容類型為 JSON 格式，並指定了 UTF-8 編碼
header('Content-Type: application/json; charset=utf-8');
// 允許來自 http://localhost:5173 的請求
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// 允許跨域請求時使用憑證（如 cookie 或 HTTP 認證資訊）
header("Access-Control-Allow-Credentials: true");

// 如果是預檢請求（OPTIONS 請求），直接返回響應
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  header("HTTP/1.1 200 OK");
  exit();
}
$servername = "db";
$username = "root";
$password = "123456";
$dbname = 'cake';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
  die("Connection failed: " . $conn->connect_error);
}