<?php

declare(strict_types=1);

function app_config(): array
{
    static $config;

    if ($config !== null) {
        return $config;
    }

    $configFile = __DIR__ . '/.env.php';
    $fileConfig = file_exists($configFile) ? require $configFile : [];

    $config = [
        'app_url' => $fileConfig['app_url'] ?? getenv('APP_URL') ?: '',
        'jwt_secret' => $fileConfig['jwt_secret'] ?? getenv('JWT_SECRET') ?: 'change-me',
        'db' => [
            'host' => $fileConfig['db']['host'] ?? getenv('MYSQL_HOST') ?: '127.0.0.1',
            'port' => (int) ($fileConfig['db']['port'] ?? getenv('MYSQL_PORT') ?: 3306),
            'database' => $fileConfig['db']['database'] ?? getenv('MYSQL_DATABASE') ?: 'alieflocals',
            'user' => $fileConfig['db']['user'] ?? getenv('MYSQL_USER') ?: 'root',
            'password' => $fileConfig['db']['password'] ?? getenv('MYSQL_PASSWORD') ?: '',
        ],
        'uploads_dir' => dirname(__DIR__) . '/uploads',
    ];

    return $config;
}

function db(): PDO
{
    static $pdo;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $config = app_config()['db'];
    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
        $config['host'],
        $config['port'],
        $config['database'],
    );

    $pdo = new PDO($dsn, $config['user'], $config['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}

function json_input(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function json_response(array $payload, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function empty_response(int $status = 204): never
{
    http_response_code($status);
    exit;
}

function base64url_encode(string $value): string
{
    return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
}

function base64url_decode(string $value): string
{
    $padding = strlen($value) % 4;
    if ($padding > 0) {
        $value .= str_repeat('=', 4 - $padding);
    }

    return base64_decode(strtr($value, '-_', '+/')) ?: '';
}

function create_jwt(array $user): string
{
    $header = ['alg' => 'HS256', 'typ' => 'JWT'];
    $issuedAt = time();
    $payload = [
        'sub' => $user['id'],
        'email' => $user['email'],
        'displayName' => $user['display_name'],
        'iat' => $issuedAt,
        'exp' => $issuedAt + (7 * 24 * 60 * 60),
    ];

    $encodedHeader = base64url_encode((string) json_encode($header));
    $encodedPayload = base64url_encode((string) json_encode($payload));
    $signature = hash_hmac('sha256', $encodedHeader . '.' . $encodedPayload, app_config()['jwt_secret'], true);

    return $encodedHeader . '.' . $encodedPayload . '.' . base64url_encode($signature);
}

function bearer_token(): ?string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (!str_starts_with($header, 'Bearer ')) {
        return null;
    }

    return substr($header, 7);
}

function decode_jwt(?string $token): ?array
{
    if (!$token) {
        return null;
    }

    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return null;
    }

    [$encodedHeader, $encodedPayload, $encodedSignature] = $parts;
    $expectedSignature = base64url_encode(hash_hmac('sha256', $encodedHeader . '.' . $encodedPayload, app_config()['jwt_secret'], true));
    if (!hash_equals($expectedSignature, $encodedSignature)) {
        return null;
    }

    $payload = json_decode(base64url_decode($encodedPayload), true);
    if (!is_array($payload)) {
        return null;
    }

    if (($payload['exp'] ?? 0) < time()) {
        return null;
    }

    return $payload;
}

function request_user_id(): ?string
{
    $payload = decode_jwt(bearer_token());
    return is_array($payload) ? ($payload['sub'] ?? null) : null;
}

function require_user_id(): string
{
    $userId = request_user_id();
    if (!$userId) {
        json_response(['error' => 'Authentication required.'], 401);
    }

    return $userId;
}

function find_user(string $userId): ?array
{
    $statement = db()->prepare(
        'SELECT id, email, display_name, avatar_url, created_at
         FROM users
         WHERE id = ?
         LIMIT 1'
    );
    $statement->execute([$userId]);
    $row = $statement->fetch();

    return $row ?: null;
}

function map_auth_user(array $row): array
{
    return [
        'id' => $row['id'],
        'email' => $row['email'],
        'displayName' => $row['display_name'],
        'avatarUrl' => $row['avatar_url'],
        'createdAt' => $row['created_at'],
    ];
}

function map_profile(array $row): array
{
    return [
        'id' => $row['id'],
        'user_id' => $row['id'],
        'display_name' => $row['display_name'],
        'avatar_url' => $row['avatar_url'],
        'created_at' => $row['created_at'],
    ];
}

function map_post(array $row): array
{
    return [
        'id' => $row['id'],
        'user_id' => $row['user_id'],
        'content' => $row['content'],
        'media_url' => $row['media_url'],
        'media_type' => $row['media_type'],
        'created_at' => $row['created_at'],
        'profiles' => [
            'display_name' => $row['display_name'],
            'avatar_url' => $row['avatar_url'],
        ],
    ];
}

function map_comment(array $row): array
{
    return [
        'id' => $row['id'],
        'content' => $row['content'],
        'created_at' => $row['created_at'],
        'user_id' => $row['user_id'],
        'profiles' => [
            'display_name' => $row['display_name'],
            'avatar_url' => $row['avatar_url'],
        ],
    ];
}

function map_review(array $row): array
{
    return [
        'id' => $row['id'],
        'rating' => (int) $row['rating'],
        'comment' => $row['comment'],
        'created_at' => $row['created_at'],
        'profiles' => [
            'display_name' => $row['display_name'],
            'avatar_url' => $row['avatar_url'],
        ],
    ];
}

function uuid(): string
{
    $bytes = random_bytes(16);
    $bytes[6] = chr((ord($bytes[6]) & 0x0f) | 0x40);
    $bytes[8] = chr((ord($bytes[8]) & 0x3f) | 0x80);

    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($bytes), 4));
}

function duplicate_key_exception(Throwable $exception): bool
{
    return $exception instanceof PDOException
        && isset($exception->errorInfo[1])
        && (int) $exception->errorInfo[1] === 1062;
}

function ensure_conversation_participant(string $conversationId, string $userId): void
{
    $statement = db()->prepare(
        'SELECT id
         FROM conversation_participants
         WHERE conversation_id = ? AND user_id = ?
         LIMIT 1'
    );
    $statement->execute([$conversationId, $userId]);

    if (!$statement->fetch()) {
        json_response(['error' => 'Conversation not found.'], 404);
    }
}

function upload_public_url(string $filename): string
{
    $appUrl = rtrim(app_config()['app_url'], '/');
    return $appUrl !== '' ? $appUrl . '/uploads/' . $filename : '/uploads/' . $filename;
}
