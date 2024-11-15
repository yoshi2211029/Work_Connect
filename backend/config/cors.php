<?php

return [
    'paths' => ['api/*'], // CORSを適用するパス
    'allowed_methods' => ['*'], // 許可するHTTPメソッド
    'allowed_origins' => ['*'], // 許可するオリジン
    'allowed_origins_patterns' => [], // 許可するオリジンのパターン
    'allowed_headers' => ['*'], // 許可するリクエストヘッダー
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
