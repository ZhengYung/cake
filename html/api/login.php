<?php
require_once 'vendor/autoload.php';
require_once 'conn.php';

use Firebase\JWT\JWT;

$data = json_decode(file_get_contents('php://input'));
$response = new stdClass();

if (
    isset($data->account) && !empty($data->account) &&
    isset($data->password) && !empty($data->password)
) {
    $account = $data->account;
    $password = $data->password;
    $stmt = $conn->prepare("SELECT * FROM member WHERE account = ?");
    $stmt->bind_param("s", $account);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_object();
    if ($user && password_verify($password, $user->Pwd)) {
        // 生成 JWT
        $expire = time() + (15 * 24 * 60 * 60);
        $secretKey = getenv('SECRET_KEY');
        $payload = [
            'user_id' => $user->Id,
            'user_name' => $user->Name,
            'exp' => $expire // 設定過期時間為 15 天
        ];
        $token = JWT::encode($payload, $secretKey, 'HS256');
        function generateCookieString($name, $value, $days)
        {
            $expires = "";
            if ($days) {
                $date = new DateTime();
                $date->modify('+' . $days . ' days');
                $expires = "; expires=" . $date->format('D, d M Y H:i:s T');
            }
            return $name . "=" . urlencode($value) . $expires . "; path=/";
        }

        // 生成名為 "jwt_token"，值為 "your_jwt_token"，過期時間為 15 天的 cookie 字符串
        $cookieString = generateCookieString('jwt_token', $token, 15);

        $response->state = true;
        $response->message = "登入成功";
        $response->cookieString = $cookieString;//前端直接取出並document.cookie即可
    } else {
        $response->state = false;
        $response->message = "帳號||密碼錯誤";
    }
} else {
    $response->state = false;
    $response->message = '參數格式錯誤||帳號不能為空||密碼不能為空';
}
echo json_encode($response);
exit;
