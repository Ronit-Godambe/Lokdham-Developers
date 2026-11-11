<?php
declare(strict_types=1);

require_once '/home2/slokdb58/lokdham-private/auth.php';

requireLogin();

$allowedStatuses = [
    'New Lead',
    'Contacted',
    'Interested',
    'Not Decided',
    'Site Visit Scheduled',
    'Negotiation',
    'Booked',
    'Not Interested'
];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query(
        "SELECT * FROM customers ORDER BY created_at DESC"
    );

    jsonResponse([
        'success' => true,
        'customers' => $stmt->fetchAll()
    ]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verifyCsrf();

    $data = json_decode(file_get_contents('php://input'), true) ?? [];

    $name = trim($data['customer_name'] ?? '');
    $mobile = trim($data['mobile_number'] ?? '');
    $status = $data['lead_status'] ?? 'New Lead';

    if ($name === '' || strlen($name) > 120 ||
        $mobile === '' || strlen($mobile) > 25 ||
        !in_array($status, $allowedStatuses, true)) {
        jsonResponse(['success' => false, 'message' => 'Invalid customer details.'], 422);
    }

    $id = sprintf(
        '%s-%s-%s-%s-%s',
        bin2hex(random_bytes(4)),
        bin2hex(random_bytes(2)),
        bin2hex(random_bytes(2)),
        bin2hex(random_bytes(2)),
        bin2hex(random_bytes(6))
    );

    $stmt = $pdo->prepare(
        "INSERT INTO customers (
            id, customer_name, mobile_number, alternate_number,
            email, interested_plot, lead_status, follow_up_at,
            lead_source, budget, conversation_summary, notes,
            created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );

    $stmt->execute([
        $id,
        $name,
        $mobile,
        $data['alternate_number'] ?? null,
        $data['email'] ?? null,
        $data['interested_plot'] ?? 'Not decided yet',
        $status,
        $data['follow_up_at'] ?? null,
        $data['lead_source'] ?? null,
        $data['budget'] ?? null,
        $data['conversation_summary'] ?? null,
        $data['notes'] ?? null,
        $_SESSION['user_id']
    ]);

    jsonResponse(['success' => true, 'id' => $id], 201);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);