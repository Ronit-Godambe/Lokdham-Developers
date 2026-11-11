<?php
declare(strict_types=1);

require_once '/home2/slokdb58/lokdham-private/auth.php';

requireAdmin();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query(
        "SELECT id, name, username, role, status, created_at
         FROM users ORDER BY id ASC"
    );

    jsonResponse([
        'success' => true,
        'users' => $stmt->fetchAll()
    ]);
}

if ($method === 'POST') {
    verifyCsrf();

    $data = json_decode(file_get_contents('php://input'), true) ?? [];

    $name = trim($data['name'] ?? '');
    $username = trim($data['username'] ?? '');
    $password = $data['password'] ?? '';

    if (
        $name === '' || strlen($name) > 120 ||
        !preg_match('/^[a-zA-Z0-9_.-]{3,60}$/', $username) ||
        strlen($password) < 8
    ) {
        jsonResponse([
            'success' => false,
            'message' => 'Enter a valid name, username and password (minimum 8 characters).'
        ], 422);
    }

    $stmt = $pdo->prepare(
        "INSERT INTO users (name, username, password_hash, role, status)
         VALUES (?, ?, ?, 'employee', 'active')"
    );

    try {
        $stmt->execute([
            $name,
            $username,
            password_hash($password, PASSWORD_DEFAULT)
        ]);
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') {
            jsonResponse([
                'success' => false,
                'message' => 'That username already exists.'
            ], 409);
        }
        throw $e;
    }

    jsonResponse([
        'success' => true,
        'message' => 'Employee created.',
        'id' => (int)$pdo->lastInsertId()
    ], 201);
}

if ($method === 'PUT') {
    verifyCsrf();

    $data = json_decode(file_get_contents('php://input'), true) ?? [];

    $id = filter_var($data['id'] ?? null, FILTER_VALIDATE_INT);
    $status = $data['status'] ?? '';

    if (
        !$id ||
        $id === (int)$_SESSION['user_id'] ||
        !in_array($status, ['active', 'inactive'], true)
    ) {
        jsonResponse([
            'success' => false,
            'message' => 'Invalid user update.'
        ], 422);
    }

    $stmt = $pdo->prepare(
        "UPDATE users SET status = ?
         WHERE id = ? AND role = 'employee'"
    );

    $stmt->execute([$status, $id]);

    jsonResponse([
        'success' => true,
        'message' => 'Employee status updated.'
    ]);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);