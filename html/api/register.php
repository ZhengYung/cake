<?php
require_once 'conn.php';

$data = json_decode(file_get_contents('php://input'));
$response = new stdClass();
if (
    isset($data->account) && !empty($data->account) &&
    isset($data->password) && !empty($data->password) &&
    isset($data->name) && !empty($data->name) &&
    isset($data->homePhone) && !empty($data->homePhone) &&
    isset($data->mobilePhone) && !empty($data->mobilePhone) &&
    isset($data->email) && !empty($data->email) &&
    isset($data->sex) && !empty($data->sex) &&
    isset($data->birthDay) && !empty($data->birthDay)
) {
    $account = $data->account;
    $password = $data->password;
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT); //加密
    $name = $data->name;
    $homePhone = $data->homePhone;
    $mobilePhone = $data->mobilePhone;
    $email = $data->email;
    $birthDay = $data->birthDay;
    $sex = $data->sex;

    $stmt1 = $conn->prepare("SELECT Account From member WHERE Account=?");
    $stmt1->bind_param("s", $account);
    $stmt1->execute();
    $result = $stmt1->get_result();
    if ($result->num_rows > 0) {
        $response->state = false;
        $response->message = "帳號已存在";
    } else {
        $stmt2 = $conn->prepare("INSERT INTO member (Account,Pwd,Name,HomePhone,MobilePhone,Email,BirthDay,Sex) VALUES(?,?,?,?,?,?,?,?)");
        $stmt2->bind_param("ssssssss", $account, $hashedPassword, $name, $homePhone, $mobilePhone, $email, $birthDay, $sex);
        if ($stmt2->execute()) {
            $response->state = true;
            $response->message = "註冊成功";
        } else {
            $response->state = false;
            $response->message = "註冊發生錯誤:" . $stmt2->error;
        }
    }
} else {
    $response->state = false;
    $response->message = '參數格式錯誤||空值';
}
header('Content-Type: application/json; charset=utf-8');
echo json_encode($response);
$stmt1->close();
$stmt2->close();
$conn->close();
