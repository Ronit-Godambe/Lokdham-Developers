<?php
declare(strict_types=1);

require_once '/home2/slokdb58/lokdham-private/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false], 405);
}

requireLogin();
verifyCsrf();

$_SESSION = [];

if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();

    setcookie(session_name(), '', [
        'expires' => time() - 42000,
        'path' => $params['path'],
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Strict'
    ]);
}

session_destroy();

jsonResponse(['success' => true, 'message' => 'Logged out successfully.']);