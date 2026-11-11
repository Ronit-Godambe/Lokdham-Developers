<?php
declare(strict_types=1);

require_once '/home2/slokdb58/lokdham-private/auth.php';

requireLogin();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query(
        "SELECT id, created_at, plot_number, plot_size, road, status
         FROM kelad_greens_plots
         ORDER BY CAST(plot_number AS UNSIGNED) ASC"
    );

    jsonResponse([
        'success' => true,
        'plots' => $stmt->fetchAll()
    ]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verifyCsrf();

    $data = json_decode(file_get_contents('php://input'), true);

    $id = filter_var($data['id'] ?? null, FILTER_VALIDATE_INT);
    $status = $data['status'] ?? '';

    if (!$id || !in_array($status, ['available', 'booked', 'soldout'], true)) {
        jsonResponse(['success' => false, 'message' => 'Invalid plot data.'], 422);
    }

    $stmt = $pdo->prepare(
        "UPDATE kelad_greens_plots SET status = ? WHERE id = ?"
    );

    $stmt->execute([$status, $id]);

    jsonResponse(['success' => true, 'message' => 'Plot updated.']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);