<?php

use App\Http\Middleware\Cors;

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->append(Cors::class);
        $middleware->validateCsrfTokens(except: [
            // Laravel側のURLの方を記述すればCSRFトークンの認証が通るようになりました
            'http://127.0.0.1:8000/*',
            'http://localhost:8000/*',
            'http://192.168.11.111/*',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();

