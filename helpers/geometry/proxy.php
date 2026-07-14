<?php
// proxy.php - Прокси-скрипт с кешированием

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

// Создаем папку для кеша, если её нет
$cacheDir = __DIR__ . '/cache';
if (!file_exists($cacheDir)) {
    mkdir($cacheDir, 0755, true);
}

// Генерируем ключ кеша на основе всех параметров
$cacheKey = md5($_SERVER['QUERY_STRING']);
$cacheFile = $cacheDir . '/' . $cacheKey . '.cache';
$cacheLifeTime = 3600; // Время жизни кеша в секундах (1 час)

// Функция для загрузки контента
function fetchContent($targetUrl) {
    $ch = curl_init();
    
    curl_setopt_array($ch, [
        CURLOPT_URL => $targetUrl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_MAXREDIRS => 5,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_USERAGENT => 'Mozilla/5.0 (compatible; PHP Proxy)',
        CURLOPT_HEADER => false,
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
    $error = curl_error($ch);
    
    curl_close($ch);
    
    return [
        'response' => $response,
        'httpCode' => $httpCode,
        'contentType' => $contentType,
        'error' => $error
    ];
}

// Проверяем наличие валидного кеша
$useCache = false;
$cachedData = null;

if (file_exists($cacheFile)) {
    $cacheData = file_get_contents($cacheFile);
    $cacheInfo = json_decode($cacheData, true);
    
    if ($cacheInfo && isset($cacheInfo['timestamp']) && isset($cacheInfo['data'])) {
        // Проверяем, не истек ли кеш
        if ((time() - $cacheInfo['timestamp']) < $cacheLifeTime) {
            $useCache = true;
            $cachedData = $cacheInfo['data'];
        }
    }
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

// Если кеш валиден и не истек, используем его
if ($useCache && $cachedData) {
    $result = $cachedData;
} else {
    // Выполняем запрос
    $result = fetchContent($targetUrl);
    
    // Сохраняем в кеш только при успешном ответе (HTTP 200)
    if ($result['httpCode'] === 200 && empty($result['error'])) {
        $cacheData = [
            'timestamp' => time(),
            'data' => $result
        ];
        file_put_contents($cacheFile, json_encode($cacheData));
    } 
    // Если запрос неудачный, но есть старый кеш (даже просроченный) - используем его
    elseif (file_exists($cacheFile) && !$useCache) {
        $cacheData = file_get_contents($cacheFile);
        $cacheInfo = json_decode($cacheData, true);
        
        if ($cacheInfo && isset($cacheInfo['data'])) {
            $result = $cacheInfo['data'];
            // Добавляем заголовок о том, что используется просроченный кеш
            header("X-Cache: STALE");
        }
    }
}

// Проверяем наличие ошибок cURL
if (!empty($result['error'])) {
    http_response_code(500);
    echo json_encode(['error' => 'cURL Error: ' . $result['error']]);
    exit();
}

// Устанавливаем правильный Content-Type
if (isset($result['contentType']) && $result['contentType']) {
    header("Content-Type: " . $result['contentType']);
} else {
    header("Content-Type: text/html; charset=utf-8");
}

// Добавляем заголовки кеширования для браузера
if ($useCache) {
    header("X-Cache: HIT");
} else {
    header("X-Cache: MISS");
}

// Передаем HTTP код ответа
http_response_code($result['httpCode']);

// Выводим полученный контент
echo $result['response'];
?>