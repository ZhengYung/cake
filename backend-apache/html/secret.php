<?php
//設定了回應的內容類型為 JSON 格式，並指定了 UTF-8 編碼
header('Content-Type: application/json; charset=utf-8');
$secretKey = getenv('SECRET_KEY');
$res=new stdClass();
$res->message=$secretKey;
echo json_encode($res);