<?php
// proxy_lec.php - Прокси-скрипт для лекториума с кешированием

// Разрешаем доступ с любого источника
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Обрабатываем preflight запросы (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Проверяем наличие параметров
if (!isset($_GET['grade']) || !isset($_GET['number'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Отсутствуют параметры grade или number']);
    exit();
}

$grade = urlencode($_GET['grade']);
$subject = isset($_GET['subject']) ? urlencode($_GET['subject']) : 'geom';
$number = urlencode($_GET['number']);

// Создаем папку для кеша, если её нет
$cacheDir = __DIR__ . '/cache_lec';
if (!file_exists($cacheDir)) {
    mkdir($cacheDir, 0755, true);
}

// Генерируем ключ кеша
$cacheKey = md5($_SERVER['QUERY_STRING']);
$cacheFile = $cacheDir . '/' . $cacheKey . '.cache';
$cacheLifeTime = 86400; // 24 часа

// Функция для загрузки контента через file_get_contents
function fetchContentSimple($url) {
    $options = [
        'http' => [
            'method' => 'GET',
            'header' => implode("\r\n", [
                'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language: ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
                'Accept-Encoding: identity', // Не просим сжатие
                'Connection: keep-alive'
            ]),
            'timeout' => 30,
            'ignore_errors' => true
        ],
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false
        ]
    ];
    
    $context = stream_context_create($options);
    $response = @file_get_contents($url, false, $context);
    
    // Проверяем, не вернулась ли ошибка
    if ($response === false) {
        return [
            'response' => '',
            'httpCode' => 500,
            'contentType' => 'text/html',
            'error' => 'Не удалось загрузить страницу'
        ];
    }
    
    // Проверяем HTTP статус через $http_response_header
    $httpCode = 200;
    if (isset($http_response_header) && is_array($http_response_header)) {
        foreach ($http_response_header as $header) {
            if (strpos($header, 'HTTP/') === 0) {
                $parts = explode(' ', $header);
                if (isset($parts[1])) {
                    $httpCode = intval($parts[1]);
                    break;
                }
            }
        }
    }
    
    // Определяем Content-Type
    $contentType = 'text/html; charset=utf-8';
    if (isset($http_response_header) && is_array($http_response_header)) {
        foreach ($http_response_header as $header) {
            if (stripos($header, 'Content-Type:') === 0) {
                $contentType = trim(substr($header, strlen('Content-Type:')));
                break;
            }
        }
    }
    
    return [
        'response' => $response,
        'httpCode' => $httpCode,
        'contentType' => $contentType,
        'error' => ''
    ];
}

// Проверяем наличие валидного кеша
$useCache = false;
$cachedData = null;

if (file_exists($cacheFile)) {
    $cacheData = file_get_contents($cacheFile);
    $cacheInfo = json_decode($cacheData, true);
    
    if ($cacheInfo && isset($cacheInfo['timestamp']) && isset($cacheInfo['data'])) {
        if ((time() - $cacheInfo['timestamp']) < $cacheLifeTime) {
            $useCache = true;
            $cachedData = $cacheInfo['data'];
        }
    }
}

// Формируем URL для запроса
$targetUrl = "https://mxmst.ru/lectorium/view/?grade={$grade}&subject={$subject}&number={$number}";

// Если кеш валиден, используем его
if ($useCache && $cachedData) {
    $result = $cachedData;
} else {
    // Пробуем загрузить через HTTPS
    $result = fetchContentSimple($targetUrl);
    
    // Если HTTPS не работает, пробуем HTTP
    if (empty($result['response']) || $result['httpCode'] !== 200) {
        $targetUrlHttp = str_replace('https://', 'http://', $targetUrl);
        $resultHttp = fetchContentSimple($targetUrlHttp);
        if (!empty($resultHttp['response']) && $resultHttp['httpCode'] === 200) {
            $result = $resultHttp;
        }
    }
    
    // Сохраняем в кеш при успешном ответе
    if ($result['httpCode'] === 200 && !empty($result['response']) && strlen($result['response']) > 100) {
        $cacheData = [
            'timestamp' => time(),
            'data' => $result
        ];
        file_put_contents($cacheFile, json_encode($cacheData));
    } 
    // Если запрос неудачный, но есть старый кеш - используем его
    elseif (file_exists($cacheFile) && !$useCache) {
        $cacheData = file_get_contents($cacheFile);
        $cacheInfo = json_decode($cacheData, true);
        
        if ($cacheInfo && isset($cacheInfo['data'])) {
            $result = $cacheInfo['data'];
            header("X-Cache: STALE");
        }
    }
}

// Проверяем ошибки
if (!empty($result['error']) || empty($result['response'])) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка загрузки: ' . ($result['error'] ?? 'Пустой ответ')]);
    exit();
}

// Устанавливаем Content-Type
if (isset($result['contentType']) && $result['contentType']) {
    header("Content-Type: " . $result['contentType']);
} else {
    header("Content-Type: text/html; charset=utf-8");
}

// Заголовки кеширования
if ($useCache) {
    header("X-Cache: HIT");
} else {
    header("X-Cache: MISS");
}

http_response_code($result['httpCode']);
echo $result['response'];
?>