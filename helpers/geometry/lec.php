<?php
// lec.php - Страница для отображения лекций через API

// Получаем параметры
$grade = isset($_GET['grade']) ? $_GET['grade'] : '';
$subject = isset($_GET['subject']) ? $_GET['subject'] : 'geom';
$number = isset($_GET['number']) ? $_GET['number'] : '';

// Если параметров нет - показываем список тем
if (empty($grade) || empty($number)) {
    header('Location: 10.html');
    exit;
}

// Функция для загрузки данных через API
function fetchLectionData($grade, $subject, $number) {
    $url = "https://mxmst.ru/lectorium/scripts/getLection.php?grade={$grade}&subject={$subject}&number={$number}";
    
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        CURLOPT_HTTPHEADER => [
            'Accept: application/json',
            'Accept-Language: ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
            'Connection: keep-alive'
        ]
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        return ['error' => 'cURL Error: ' . $error];
    }
    
    if ($httpCode !== 200) {
        return ['error' => 'HTTP Error: ' . $httpCode];
    }
    
    $data = json_decode($response, true);
    if (!$data) {
        return ['error' => 'Invalid JSON response'];
    }
    
    return $data;
}

// Функция для парсинга Markdown в HTML
function markdownToHtml($text) {
    // Заголовки
    $text = preg_replace('/^### (.*)$/m', '<h3>$1</h3>', $text);
    $text = preg_replace('/^## (.*)$/m', '<h2>$1</h2>', $text);
    $text = preg_replace('/^# (.*)$/m', '<h1>$1</h1>', $text);
    
    // Жирный и курсив
    $text = preg_replace('/\*\*\*(.*?)\*\*\*/', '<strong><em>$1</em></strong>', $text);
    $text = preg_replace('/\*\*(.*?)\*\*/', '<strong>$1</strong>', $text);
    $text = preg_replace('/\*(.*?)\*/', '<em>$1</em>', $text);
    
    // Списки
    $text = preg_replace('/^[-*] (.*)$/m', '<li>$1</li>', $text);
    $text = preg_replace('/((?:<li>.*<\/li>\s*)+)/', '<ul>$1</ul>', $text);
    
    // Нумерованные списки
    $text = preg_replace('/^\d+\. (.*)$/m', '<li>$1</li>', $text);
    $text = preg_replace('/((?:<li>.*<\/li>\s*)+)/', '<ol>$1</ol>', $text);
    
    // Ссылки
    $text = preg_replace('/\[([^\]]+)\]\(([^)]+)\)/', '<a href="$2" target="_blank">$1</a>', $text);
    
    // Обработка изображений
    $text = preg_replace_callback(
        '/!\[\[([^\]]+)\]\]/',
        function($matches) {
            $filename = trim($matches[1]);
            $filename = preg_replace('/\s*\|\s*\d+$/', '', $filename);
            $encoded = rawurlencode($filename);
            $imgUrl = 'https://mxmst.ru/lectorium/storage/img/' . $encoded;
            
            return '<div style="text-align:center;margin:20px 0;">
                        <img src="' . $imgUrl . '" 
                             alt="' . htmlspecialchars($filename) . '" 
                             class="lection-image"
                             onerror="this.style.display=\'none\';this.parentElement.innerHTML=\'<p style=\\\'color:#888;font-size:0.9rem;\\\'>⚠️ Изображение не загрузилось: ' . htmlspecialchars($filename) . '</p>\';">
                    </div>';
        },
        $text
    );
    
    // Альтернативный формат изображений
    $text = preg_replace_callback(
        '/!\[([^\]]*)\]\(([^)]+)\)/',
        function($matches) {
            $alt = $matches[1];
            $url = $matches[2];
            return '<div style="text-align:center;margin:20px 0;">
                        <img src="' . $url . '" 
                             alt="' . htmlspecialchars($alt) . '" 
                             class="lection-image">
                    </div>';
        },
        $text
    );
    
    // Код
    $text = preg_replace('/```([\s\S]*?)```/', '<pre><code>$1</code></pre>', $text);
    $text = preg_replace('/`([^`]+)`/', '<code>$1</code>', $text);
    
    // Параграфы
    $text = preg_replace('/\n\n/', '</p><p>', $text);
    $text = '<p>' . trim($text) . '</p>';
    $text = preg_replace('/<p><\/(h\d|ul|ol|li|pre|blockquote|div)/', '<$1', $text);
    $text = preg_replace('/<\/(h\d|ul|ol|pre|blockquote|div)><p>/', '</$1><p>', $text);
    $text = preg_replace('/<p><\/p>/', '', $text);
    $text = preg_replace('/<p><(ul|ol)/', '<$1', $text);
    $text = preg_replace('/<\/(ul|ol)><\/p>/', '</$1>', $text);
    $text = preg_replace('/<p><div/', '<div', $text);
    $text = preg_replace('/<\/div><\/p>/', '</div>', $text);
    
    return $text;
}

// Загружаем данные лекции
$data = fetchLectionData($grade, $subject, $number);

// Получаем заголовок и текст
$title = isset($data['header']) ? $data['header'] : "Тема {$number}";
$description = isset($data['description']) ? $data['description'] : '';
$text = isset($data['text']) ? $data['text'] : '';

// Если есть ошибка
if (isset($data['error'])) {
    $content = '<p style="text-align: center; color: #ff6b6b;">Ошибка: ' . htmlspecialchars($data['error']) . '</p>';
} elseif (empty($text)) {
    $content = '<p style="text-align: center; color: #ff6b6b;">Содержимое лекции не найдено</p>';
} else {
    $content = markdownToHtml($text);
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📐</text></svg>">
    <title>SOMEL - геометрия</title>
    <link rel="stylesheet" href="index.css">
    <style>
        /* Основные стили как на других страницах */
        body {
            background-color: rgb(17, 17, 17);
            color: white;
            font-family: "century gothic", "franklin gothic medium";
            background-image: radial-gradient(rgba(154, 255, 247, 0.1) 1px, transparent 1px);
            background-size: 20px 20px;
            min-height: 100vh;
            margin: 0;
            padding: 20px 0;
        }

        .lection-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 0 15px 30px;
        }
        
        .lection-container .nav-buttons {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
            margin: 20px 0;
        }
        
        .lection-container .nav-button {
            display: inline-block;
            background-color: rgba(0, 225, 255, 0.103);
            padding: 10px 24px;
            border-radius: 10px;
            color: beige;
            text-decoration: none;
            transition: 0.5s cubic-bezier(.66,.39,.21,.67);
            cursor: pointer;
        }
        
        .lection-container .nav-button:hover {
            background-color: rgba(0, 225, 255, 0.247);
            padding: 10px 36px;
        }
        
        .lection-container .lection-header {
            text-align: center;
            margin: 20px 0 30px;
        }
        
        .lection-container .lection-header h1 {
            font-size: 1.8rem;
            color: white;
        }
        
        .lection-container .lection-header .description {
            color: #aaa;
            margin-top: 10px;
            font-size: 1rem;
        }
        
        .lection-container .lection-content {
            background-color: rgba(154, 255, 247, 0.05);
            border-radius: 20px;
            padding: 30px;
            line-height: 1.8;
            font-size: 1.1rem;
            overflow-x: auto;
        }
        
        .lection-container .lection-content h1,
        .lection-container .lection-content h2,
        .lection-container .lection-content h3 {
            margin: 20px 0 10px;
            color: white;
        }
        
        .lection-container .lection-content ul,
        .lection-container .lection-content ol {
            padding-left: 25px;
        }
        
        .lection-container .lection-content li {
            margin-bottom: 8px;
        }
        
        .lection-container .lection-content p {
            margin-bottom: 15px;
        }
        
        /* Стили для картинок - ИНВЕРТИРУЕМ ЦВЕТА как в оригинальном лекториуме */
        .lection-container .lection-content img.lection-image {
            max-width: 100%;
            border-radius: 10px;
            margin: 15px auto;
            border: 1px solid rgba(255, 255, 255, 0.2);
            display: block;
            filter: invert(93.5%) brightness(0.95);
        }
        
        /* Для SVG картинок особенно важно инвертирование */
        .lection-container .lection-content img[src*=".svg"] {
            filter: invert(93.5%) brightness(0.95);
        }
        
        .lection-container .lection-content .MathJax {
            font-size: 1.1em !important;
        }
        
        .lection-container .lection-content .MathJax_Display {
            margin: 1.5em 0 !important;
            overflow-x: auto;
        }
        
        .lection-container .lection-content pre {
            background: rgba(0,0,0,0.3);
            padding: 15px;
            border-radius: 8px;
            overflow-x: auto;
        }
        
        .lection-container .lection-content code {
            background: rgba(0,0,0,0.3);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
            color: #ddd;
        }
        
        .lection-container .lection-content a {
            color: #58a5e5;
            text-decoration: none;
        }
        
        .lection-container .lection-content a:hover {
            color: #0b75cc;
            text-decoration: underline;
        }
        
        @media (max-width: 768px) {
            .lection-container .lection-content {
                padding: 15px;
                font-size: 1rem;
            }
            .lection-container .lection-header h1 {
                font-size: 1.4rem;
            }
            .lection-container .lection-content img.lection-image {
                max-width: 100%;
            }
        }
        
        /* Для печати */
        @media print {
            .lection-container .lection-content img.lection-image {
                filter: invert(0) !important;
            }
        }
    </style>
</head>
<body>
    <h1 style="width: 100%; text-align: center; color: white;">Лекториум</h1>
    <h2 style="width: 100%; text-align: center; color: white;"><?php echo htmlspecialchars($grade); ?> класс</h2>
    
    <div class="lection-container">
        <div class="nav-buttons">
            <a href="10.html" class="nav-button">← К списку тем</a>
            <a href="index.html" class="nav-button">← Выбрать класс</a>
        </div>
        
        <div class="lection-header">
            <h1><?php echo htmlspecialchars($title); ?></h1>
            <?php if (!empty($description)): ?>
                <div class="description"><?php echo htmlspecialchars($description); ?></div>
            <?php endif; ?>
        </div>
        
        <div class="lection-content">
            <?php echo $content; ?>
        </div>
        
        <div class="nav-buttons">
            <a href="10.html" class="nav-button">← Вернуться к списку тем</a>
        </div>
    </div>

    <!-- MathJax -->
    <script type="text/x-mathjax-config">
        MathJax.Hub.Config({
            tex2jax: {
                inlineMath: [['$','$'], ['\\\\(','\\\\)']],
                displayMath: [['$$','$$'], ['\\\\[','\\\\]']],
                processEscapes: true
            },
            "SVG": { linebreaks: { automatic: true, width: "container" } },
            displayAlign: "center",
            messageStyle: "none"
        });
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_SVG" async></script>
</body>
</html>