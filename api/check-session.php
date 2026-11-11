<?php
require_once '/home2/slokdb58/lokdham-private/auth.php';

requireLogin();

jsonResponse([
    'success' => true,
    'user' => [
        'id' => $_SESSION['user_id'],
        'name' => $_SESSION['name'],
        'username' => $_SESSION['username'],
        'role' => $_SESSION['role']
    ],
    'csrfToken' => $_SESSION['csrf_token']
]);