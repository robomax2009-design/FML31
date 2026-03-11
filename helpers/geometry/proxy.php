<?php
// proxy.php - Прокси-скрипт для обхода CORS

// Разрешаем доступ с любого источника (можно заменить на конкретный домен)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Обрабатываем preflight запросы (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Проверяем наличие параметров
if (!isset($_GET['class']) || !isset($_GET['card'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Отсутствуют параметры class или card']);
    exit();
}

$class = urlencode($_GET['class']);
$card = urlencode($_GET['card']);

$targetUrl = "http://mxmst.beget.tech/bilet/{$class}/cards/{$card}/";

if (isset($_GET['img'])) {
    $targetUrl .= "img/{$_GET['img']}.png";
}
if (isset($_GET['css'])) {
    $targetUrl .= "../../../css/style.css";
}

// Инициализируем cURL сессию
$ch = curl_init();

// Настройки cURL
curl_setopt_array($ch, [
    CURLOPT_URL => $targetUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS => 5,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_SSL_VERIFYPEER => false, // Для http можно false, для https лучше true
    CURLOPT_USERAGENT => 'Mozilla/5.0 (compatible; PHP Proxy)',
    CURLOPT_HEADER => false, // Не включаем заголовки в вывод
]);

// Выполняем запрос
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);

// Проверяем на ошибки cURL
if (curl_error($ch)) {
    http_response_code(500);
    echo json_encode(['error' => 'cURL Error: ' . curl_error($ch)]);
    curl_close($ch);
    exit();
}

curl_close($ch);

// Устанавливаем правильный Content-Type
if ($contentType) {
    header("Content-Type: " . $contentType);
} else {
    header("Content-Type: text/html; charset=utf-8");
}

// Передаем HTTP код ответа
http_response_code($httpCode);

// Выводим полученный контент
echo $response;
?>