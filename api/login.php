<?php
declare(strict_types=1);

require_once '/home2/slokdb58/lokdham-private/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false], 405);
}

$data = json_decode(file_get_contents('php://input'), true);

$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';

if ($username === '' || $password === '') {
    jsonResponse(['success' => false, 'message' => 'Enter username and password.'], 422);
}

$stmt = $pdo->prepare(
    "SELECT id, name, username, password_hash, role
     FROM users WHERE username = ? AND status = 'active' LIMIT 1"
);
$stmt->execute([$username]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    jsonResponse(['success' => false, 'message' => 'Invalid username or password.'], 401);
}

session_regenerate_id(true);

$_SESSION['user_id'] = (int)$user['id'];
$_SESSION['name'] = $user['name'];
$_SESSION['username'] = $user['username'];
$_SESSION['role'] = $user['role'];
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));

jsonResponse([
    'success' => true,
    'user' => [
        'name' => $user['name'],
        'username' => $user['username'],
        'role' => $user['role']
    ],
    'csrfToken' => $_SESSION['csrf_token']
]);