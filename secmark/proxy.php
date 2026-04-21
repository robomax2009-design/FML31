<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache');

$cacheDir = __DIR__ . '/cache/';
if (!file_exists($cacheDir)) {
    mkdir($cacheDir, 0777, true);
}

function getPublicIds() {
    global $cacheDir;
    
    $cacheFile = $cacheDir . 'public_ids.json';
    $url = 'https://tbs-server-s7vy.onrender.com/secmark/get_public/';
    
    $response = @file_get_contents($url);
    if ($response !== false) {
        $data = json_decode($response, true);
        if ($data && isset($data['status']) && $data['status'] === 'success') {
            $ids = isset($data['ids']) ? $data['ids'] : [];
            
            if (empty($ids)) {
                if (file_exists($cacheFile)) {
                    unlink($cacheFile);
                }
                return [];
            }
            
            file_put_contents($cacheFile, json_encode([
                'ids' => $ids,
                'cached_at' => time()
            ]));
            return $ids;
        }
    }
    
    if (file_exists($cacheFile)) {
        $cached = json_decode(file_get_contents($cacheFile), true);
        if ($cached && isset($cached['ids'])) {
            return $cached['ids'];
        }
    }
    
    return [];
}

function getProduct($id, $forceRefresh = false) {
    global $cacheDir;
    
    $cacheFile = $cacheDir . 'product_' . md5($id) . '.json';
    $url = 'https://tbs-server-s7vy.onrender.com/secmark/get_product/?id=' . urlencode($id);
    
    if (!$forceRefresh && file_exists($cacheFile)) {
        $cached = json_decode(file_get_contents($cacheFile), true);
        if ($cached && isset($cached['data']) && isset($cached['expires'])) {
            if (time() < $cached['expires']) {
                return $cached['data'];
            }
        }
    }
    
    $response = @file_get_contents($url);
    if ($response !== false) {
        $data = json_decode($response, true);
        if ($data && is_array($data) && !isset($data['error'])) {
            file_put_contents($cacheFile, json_encode([
                'data' => $data,
                'cached_at' => time(),
                'expires' => time() + 300,
                'id' => $id
            ]));
            return $data;
        }
    }
    
    if (file_exists($cacheFile)) {
        $cached = json_decode(file_get_contents($cacheFile), true);
        if ($cached && isset($cached['data'])) {
            return $cached['data'];
        }
    }
    
    return null;
}

function cleanupDeletedProducts($currentIds) {
    global $cacheDir;
    
    $files = glob($cacheDir . 'product_*.json');
    $deletedCount = 0;
    
    foreach ($files as $file) {
        $cached = json_decode(file_get_contents($file), true);
        if ($cached && isset($cached['id'])) {
            $productId = $cached['id'];
            if (!isset($currentIds[$productId])) {
                unlink($file);
                $deletedCount++;
            }
        }
    }
    
    return $deletedCount;
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action === 'get_all_fast') {
    $ids = getPublicIds();
    $products = [];
    
    if (empty($ids)) {
        cleanupDeletedProducts([]);
        echo json_encode([
            'success' => true,
            'products' => [],
            'total' => 0,
            'total_expected' => 0,
            'from_cache' => true,
            'timestamp' => time()
        ]);
        exit;
    }
    
    foreach ($ids as $id => $timestamp) {
        $cacheFile = $cacheDir . 'product_' . md5($id) . '.json';
        if (file_exists($cacheFile)) {
            $cached = json_decode(file_get_contents($cacheFile), true);
            if ($cached && isset($cached['data'])) {
                $products[$id] = $cached['data'];
            }
        }
    }
    
    echo json_encode([
        'success' => true,
        'products' => $products,
        'total' => count($products),
        'total_expected' => count($ids),
        'from_cache' => true,
        'timestamp' => time()
    ]);
    
} elseif ($action === 'refresh_all') {
    $ids = getPublicIds();
    $products = [];
    
    if (empty($ids)) {
        cleanupDeletedProducts([]);
        echo json_encode([
            'success' => true,
            'products' => [],
            'total' => 0,
            'from_cache' => false,
            'timestamp' => time()
        ]);
        exit;
    }
    
    foreach ($ids as $id => $timestamp) {
        $product = getProduct($id, true);
        if ($product) {
            $products[$id] = $product;
        }
    }
    
    cleanupDeletedProducts($ids);
    
    echo json_encode([
        'success' => true,
        'products' => $products,
        'total' => count($products),
        'from_cache' => false,
        'timestamp' => time()
    ]);
    
} elseif ($action === 'get_updates') {
    $ids = getPublicIds();
    $updated = [];
    $newIds = [];
    $deletedIds = [];
    
    if (empty($ids)) {
        $cachedIdsFile = $cacheDir . 'cached_ids.json';
        if (file_exists($cachedIdsFile)) {
            $previousIdsData = json_decode(file_get_contents($cachedIdsFile), true);
            if ($previousIdsData && isset($previousIdsData['ids'])) {
                $deletedIds = $previousIdsData['ids'];
            }
        }
        
        foreach ($deletedIds as $deletedId) {
            $cacheFile = $cacheDir . 'product_' . md5($deletedId) . '.json';
            if (file_exists($cacheFile)) {
                unlink($cacheFile);
            }
        }
        
        file_put_contents($cachedIdsFile, json_encode([
            'ids' => [],
            'saved_at' => time()
        ]));
        
        echo json_encode([
            'success' => true,
            'has_updates' => !empty($deletedIds),
            'updated_ids' => [],
            'new_ids' => [],
            'deleted_ids' => $deletedIds,
            'timestamp' => time()
        ]);
        exit;
    }
    
    $cachedIdsFile = $cacheDir . 'cached_ids.json';
    $previousIds = [];
    if (file_exists($cachedIdsFile)) {
        $previousIdsData = json_decode(file_get_contents($cachedIdsFile), true);
        if ($previousIdsData && isset($previousIdsData['ids'])) {
            $previousIds = $previousIdsData['ids'];
        }
    }
    
    $currentIds = array_keys($ids);
    
    $newIds = array_diff($currentIds, $previousIds);
    $deletedIds = array_diff($previousIds, $currentIds);
    
    foreach ($deletedIds as $deletedId) {
        $cacheFile = $cacheDir . 'product_' . md5($deletedId) . '.json';
        if (file_exists($cacheFile)) {
            unlink($cacheFile);
        }
    }
    
    foreach ($ids as $id => $serverTimestamp) {
        if (in_array($id, $newIds)) continue;
        
        $cacheFile = $cacheDir . 'product_' . md5($id) . '.json';
        if (file_exists($cacheFile)) {
            $cached = json_decode(file_get_contents($cacheFile), true);
            if ($cached && isset($cached['cached_at'])) {
                if ($serverTimestamp > $cached['cached_at']) {
                    $updated[] = $id;
                }
            } else {
                $updated[] = $id;
            }
        } else {
            $updated[] = $id;
        }
    }
    
    file_put_contents($cachedIdsFile, json_encode([
        'ids' => $currentIds,
        'saved_at' => time()
    ]));
    
    echo json_encode([
        'success' => true,
        'has_updates' => !empty($updated) || !empty($newIds) || !empty($deletedIds),
        'updated_ids' => $updated,
        'new_ids' => $newIds,
        'deleted_ids' => $deletedIds,
        'timestamp' => time()
    ]);
    
} elseif ($action === 'get_changed') {
    $ids = getPublicIds();
    $updates = isset($_GET['ids']) ? explode(',', $_GET['ids']) : [];
    $products = [];
    
    foreach ($updates as $id) {
        if (isset($ids[$id])) {
            $product = getProduct($id, true);
            if ($product) {
                $products[$id] = $product;
            }
        }
    }
    
    echo json_encode([
        'success' => true,
        'products' => $products,
        'timestamp' => time()
    ]);
    
} elseif ($action === 'cleanup') {
    $ids = getPublicIds();
    $deletedCount = cleanupDeletedProducts($ids);
    
    echo json_encode([
        'success' => true,
        'deleted_count' => $deletedCount,
        'timestamp' => time()
    ]);
    
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Invalid action. Use: get_all_fast, refresh_all, get_updates, get_changed, cleanup'
    ]);
}
?>