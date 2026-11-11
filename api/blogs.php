<?php
declare(strict_types=1);

require_once '/home2/slokdb58/lokdham-private/auth.php';

requireLogin();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query(
        "SELECT * FROM blogs ORDER BY created_at DESC"
    );

    jsonResponse([
        'success' => true,
        'blogs' => $stmt->fetchAll()
    ]);
}

if ($method === 'POST') {
    verifyCsrf();

    $data = json_decode(file_get_contents('php://input'), true) ?? [];

    $title = trim($data['title'] ?? '');
    $slug = trim($data['slug'] ?? '');
    $status = $data['status'] ?? 'draft';
    $content = $data['content'] ?? [];

    if (
        $title === '' ||
        $slug === '' ||
        !preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug) ||
        !in_array($status, ['draft', 'published'], true) ||
        !is_array($content)
    ) {
        jsonResponse(['success' => false, 'message' => 'Invalid blog data.'], 422);
    }

    $stmt = $pdo->prepare(
        "INSERT INTO blogs
        (title, slug, category, description, content, cover_image,
         hero_image, status, seo_title, seo_description, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())"
    );

    $stmt->execute([
        $title,
        $slug,
        $data['category'] ?? null,
        $data['description'] ?? null,
        json_encode($content, JSON_THROW_ON_ERROR),
        $data['cover_image'] ?? null,
        $data['hero_image'] ?? null,
        $status,
        $data['seo_title'] ?? null,
        $data['seo_description'] ?? null
    ]);

    jsonResponse([
        'success' => true,
        'id' => (int)$pdo->lastInsertId()
    ], 201);
}

if ($method === 'PUT') {
    verifyCsrf();

    $data = json_decode(file_get_contents('php://input'), true) ?? [];

    $id = filter_var($data['id'] ?? null, FILTER_VALIDATE_INT);
    $title = trim($data['title'] ?? '');
    $slug = trim($data['slug'] ?? '');
    $status = $data['status'] ?? 'draft';
    $content = $data['content'] ?? [];

    if (
        !$id ||
        $title === '' ||
        $slug === '' ||
        !preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug) ||
        !in_array($status, ['draft', 'published'], true) ||
        !is_array($content)
    ) {
        jsonResponse(['success' => false, 'message' => 'Invalid blog data.'], 422);
    }

    $stmt = $pdo->prepare(
        "UPDATE blogs SET
        title=?, slug=?, category=?, description=?, content=?,
        cover_image=?, hero_image=?, status=?, seo_title=?,
        seo_description=?, updated_at=NOW()
        WHERE id=?"
    );

    $stmt->execute([
        $title,
        $slug,
        $data['category'] ?? null,
        $data['description'] ?? null,
        json_encode($content, JSON_THROW_ON_ERROR),
        $data['cover_image'] ?? null,
        $data['hero_image'] ?? null,
        $status,
        $data['seo_title'] ?? null,
        $data['seo_description'] ?? null,
        $id
    ]);

    jsonResponse(['success' => true, 'message' => 'Blog updated.']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);