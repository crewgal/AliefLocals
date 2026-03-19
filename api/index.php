<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    empty_response(204);
}

$requestUri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$apiPosition = strpos($requestUri, '/api');
$path = $apiPosition === false ? '/' : substr($requestUri, $apiPosition + 4);
$path = $path === '' ? '/' : $path;
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    if ($method === 'GET' && $path === '/health') {
        json_response(['ok' => true]);
    }

    if ($method === 'POST' && $path === '/auth/signup') {
        $input = json_input();
        $name = trim((string) ($input['name'] ?? ''));
        $email = strtolower(trim((string) ($input['email'] ?? '')));
        $password = (string) ($input['password'] ?? '');

        if ($name === '' || $email === '' || $password === '') {
            json_response(['error' => 'Name, email, and password are required.'], 400);
        }

        if (strlen($password) < 6) {
            json_response(['error' => 'Password must be at least 6 characters.'], 400);
        }

        $userId = uuid();
        $statement = db()->prepare(
            'INSERT INTO users (id, email, password_hash, display_name)
             VALUES (?, ?, ?, ?)'
        );

        try {
            $statement->execute([$userId, $email, password_hash($password, PASSWORD_DEFAULT), $name]);
        } catch (Throwable $exception) {
            if (duplicate_key_exception($exception)) {
                json_response(['error' => 'An account with this email already exists.'], 409);
            }

            throw $exception;
        }

        $user = find_user($userId);
        json_response([
            'token' => create_jwt($user),
            'user' => map_auth_user($user),
        ], 201);
    }

    if ($method === 'POST' && $path === '/auth/login') {
        $input = json_input();
        $email = strtolower(trim((string) ($input['email'] ?? '')));
        $password = (string) ($input['password'] ?? '');

        if ($email === '' || $password === '') {
            json_response(['error' => 'Email and password are required.'], 400);
        }

        $statement = db()->prepare(
            'SELECT id, email, password_hash, display_name, avatar_url, created_at
             FROM users
             WHERE email = ?
             LIMIT 1'
        );
        $statement->execute([$email]);
        $user = $statement->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            json_response(['error' => 'Invalid email or password.'], 401);
        }

        json_response([
            'token' => create_jwt($user),
            'user' => map_auth_user($user),
        ]);
    }

    if ($method === 'GET' && $path === '/auth/me') {
        $userId = require_user_id();
        $user = find_user($userId);
        if (!$user) {
            json_response(['error' => 'User not found.'], 404);
        }

        json_response(['user' => map_auth_user($user)]);
    }

    if ($method === 'GET' && $path === '/businesses') {
        $category = trim((string) ($_GET['category'] ?? ''));
        $sql = 'SELECT id, owner_id, name, slug, category, description, phone, website, address, image_url, verified, created_at, updated_at
                FROM businesses';
        $params = [];

        if ($category !== '') {
            $sql .= ' WHERE category = ?';
            $params[] = $category;
        }

        $sql .= ' ORDER BY name ASC';
        $statement = db()->prepare($sql);
        $statement->execute($params);
        $rows = $statement->fetchAll();

        $businesses = array_map(static function (array $row): array {
            $row['verified'] = (bool) $row['verified'];
            return $row;
        }, $rows);

        json_response(['businesses' => $businesses]);
    }

    if ($method === 'GET' && preg_match('#^/businesses/([^/]+)$#', $path, $matches)) {
        $slug = urldecode($matches[1]);
        $statement = db()->prepare(
            'SELECT id, owner_id, name, slug, category, description, phone, website, address, image_url, verified, created_at, updated_at
             FROM businesses
             WHERE slug = ?
             LIMIT 1'
        );
        $statement->execute([$slug]);
        $business = $statement->fetch();

        if (!$business) {
            json_response(['error' => 'Business not found.'], 404);
        }

        $business['verified'] = (bool) $business['verified'];
        json_response(['business' => $business]);
    }

    if ($method === 'GET' && preg_match('#^/businesses/([^/]+)/reviews$#', $path, $matches)) {
        $businessId = $matches[1];
        $statement = db()->prepare(
            'SELECT r.id, r.rating, r.comment, r.created_at, u.display_name, u.avatar_url
             FROM reviews r
             JOIN users u ON u.id = r.user_id
             WHERE r.business_id = ?
             ORDER BY r.created_at DESC'
        );
        $statement->execute([$businessId]);

        json_response(['reviews' => array_map('map_review', $statement->fetchAll())]);
    }

    if ($method === 'POST' && preg_match('#^/businesses/([^/]+)/reviews$#', $path, $matches)) {
        $businessId = $matches[1];
        $userId = require_user_id();
        $input = json_input();
        $rating = (int) ($input['rating'] ?? 0);
        $comment = trim((string) ($input['comment'] ?? ''));

        if ($rating < 1 || $rating > 5) {
            json_response(['error' => 'Rating must be between 1 and 5.'], 400);
        }

        if ($comment === '' || strlen($comment) > 2000) {
            json_response(['error' => 'Review must be between 1 and 2000 characters.'], 400);
        }

        $statement = db()->prepare(
            'INSERT INTO reviews (id, business_id, user_id, rating, comment)
             VALUES (?, ?, ?, ?, ?)'
        );

        try {
            $statement->execute([uuid(), $businessId, $userId, $rating, $comment]);
        } catch (Throwable $exception) {
            if (duplicate_key_exception($exception)) {
                json_response(['error' => "You've already reviewed this business.", 'code' => 'DUPLICATE_REVIEW'], 409);
            }

            throw $exception;
        }

        json_response(['ok' => true], 201);
    }

    if ($method === 'GET' && $path === '/posts') {
        $statement = db()->query(
            'SELECT p.id, p.user_id, p.content, p.media_url, p.media_type, p.created_at, u.display_name, u.avatar_url
             FROM posts p
             JOIN users u ON u.id = p.user_id
             ORDER BY p.created_at DESC
             LIMIT 50'
        );

        json_response(['posts' => array_map('map_post', $statement->fetchAll())]);
    }

    if ($method === 'POST' && $path === '/posts') {
        $userId = require_user_id();
        $input = json_input();
        $content = trim((string) ($input['content'] ?? ''));
        $mediaUrl = isset($input['mediaUrl']) ? (string) $input['mediaUrl'] : null;
        $mediaType = isset($input['mediaType']) ? (string) $input['mediaType'] : null;

        if ($content === '' && (!$mediaUrl || trim($mediaUrl) === '')) {
            json_response(['error' => 'A post needs content or media.'], 400);
        }

        $postId = uuid();
        $statement = db()->prepare(
            'INSERT INTO posts (id, user_id, content, media_url, media_type)
             VALUES (?, ?, ?, ?, ?)'
        );
        $statement->execute([$postId, $userId, $content !== '' ? $content : null, $mediaUrl, $mediaType]);

        json_response(['id' => $postId], 201);
    }

    if ($method === 'DELETE' && preg_match('#^/posts/([^/]+)$#', $path, $matches)) {
        $userId = require_user_id();
        $statement = db()->prepare('DELETE FROM posts WHERE id = ? AND user_id = ?');
        $statement->execute([$matches[1], $userId]);

        if ($statement->rowCount() === 0) {
            json_response(['error' => 'Post not found.'], 404);
        }

        empty_response(204);
    }

    if ($method === 'GET' && preg_match('#^/posts/([^/]+)/likes$#', $path, $matches)) {
        $postId = $matches[1];
        $statement = db()->prepare('SELECT COUNT(*) AS count FROM likes WHERE post_id = ?');
        $statement->execute([$postId]);
        $count = (int) ($statement->fetch()['count'] ?? 0);

        $liked = false;
        $userId = request_user_id();
        if ($userId) {
            $likedStatement = db()->prepare('SELECT id FROM likes WHERE post_id = ? AND user_id = ? LIMIT 1');
            $likedStatement->execute([$postId, $userId]);
            $liked = (bool) $likedStatement->fetch();
        }

        json_response(['count' => $count, 'liked' => $liked]);
    }

    if ($method === 'POST' && preg_match('#^/posts/([^/]+)/likes$#', $path, $matches)) {
        $userId = require_user_id();
        $statement = db()->prepare(
            'INSERT INTO likes (id, post_id, user_id)
             VALUES (?, ?, ?)'
        );

        try {
            $statement->execute([uuid(), $matches[1], $userId]);
        } catch (Throwable $exception) {
            if (!duplicate_key_exception($exception)) {
                throw $exception;
            }
        }

        json_response(['ok' => true], 201);
    }

    if ($method === 'DELETE' && preg_match('#^/posts/([^/]+)/likes$#', $path, $matches)) {
        $userId = require_user_id();
        $statement = db()->prepare('DELETE FROM likes WHERE post_id = ? AND user_id = ?');
        $statement->execute([$matches[1], $userId]);
        empty_response(204);
    }

    if ($method === 'GET' && preg_match('#^/posts/([^/]+)/comments$#', $path, $matches)) {
        $statement = db()->prepare(
            'SELECT c.id, c.content, c.created_at, c.user_id, u.display_name, u.avatar_url
             FROM comments c
             JOIN users u ON u.id = c.user_id
             WHERE c.post_id = ?
             ORDER BY c.created_at ASC'
        );
        $statement->execute([$matches[1]]);

        json_response(['comments' => array_map('map_comment', $statement->fetchAll())]);
    }

    if ($method === 'POST' && preg_match('#^/posts/([^/]+)/comments$#', $path, $matches)) {
        $userId = require_user_id();
        $input = json_input();
        $content = trim((string) ($input['content'] ?? ''));

        if ($content === '') {
            json_response(['error' => 'Comment content is required.'], 400);
        }

        $statement = db()->prepare(
            'INSERT INTO comments (id, post_id, user_id, content)
             VALUES (?, ?, ?, ?)'
        );
        $statement->execute([uuid(), $matches[1], $userId, $content]);

        json_response(['ok' => true], 201);
    }

    if ($method === 'POST' && $path === '/uploads/media') {
        require_user_id();

        if (!isset($_FILES['file']) || !is_array($_FILES['file'])) {
            json_response(['error' => 'File upload is required.'], 400);
        }

        $file = $_FILES['file'];
        if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            json_response(['error' => 'File upload failed.'], 400);
        }

        if (($file['size'] ?? 0) > 25 * 1024 * 1024) {
            json_response(['error' => 'File is too large.'], 400);
        }

        $tmpName = (string) $file['tmp_name'];
        $mimeType = (new finfo(FILEINFO_MIME_TYPE))->file($tmpName) ?: 'application/octet-stream';
        $isVideo = str_starts_with($mimeType, 'video/');
        $isImage = str_starts_with($mimeType, 'image/');

        if (!$isVideo && !$isImage) {
            json_response(['error' => 'Only image and video uploads are supported.'], 400);
        }

        $extension = strtolower(pathinfo((string) $file['name'], PATHINFO_EXTENSION));
        $safeExtension = preg_replace('/[^a-z0-9]+/', '', $extension) ?: ($isVideo ? 'mp4' : 'jpg');
        $filename = sprintf('%s-%s.%s', time(), bin2hex(random_bytes(8)), $safeExtension);
        $target = app_config()['uploads_dir'] . '/' . $filename;

        if (!is_dir(app_config()['uploads_dir'])) {
            mkdir(app_config()['uploads_dir'], 0775, true);
        }

        if (!move_uploaded_file($tmpName, $target)) {
            json_response(['error' => 'Unable to store uploaded file.'], 500);
        }

        json_response([
            'url' => upload_public_url($filename),
            'mediaType' => $isVideo ? 'video' : 'image',
        ], 201);
    }

    if ($method === 'GET' && $path === '/people') {
        $currentUserId = request_user_id();
        $sql = 'SELECT id, email, display_name, avatar_url, created_at FROM users';
        $params = [];

        if ($currentUserId) {
            $sql .= ' WHERE id <> ?';
            $params[] = $currentUserId;
        }

        $sql .= ' ORDER BY created_at DESC LIMIT 50';
        $statement = db()->prepare($sql);
        $statement->execute($params);

        json_response(['people' => array_map('map_profile', $statement->fetchAll())]);
    }

    if ($method === 'GET' && $path === '/friendships') {
        $userId = require_user_id();
        $statement = db()->prepare(
            'SELECT id, requester_id, addressee_id, status, created_at, updated_at
             FROM friendships
             WHERE requester_id = ? OR addressee_id = ?'
        );
        $statement->execute([$userId, $userId]);

        json_response(['friendships' => $statement->fetchAll()]);
    }

    if ($method === 'POST' && $path === '/friendships') {
        $userId = require_user_id();
        $input = json_input();
        $addresseeId = trim((string) ($input['addresseeId'] ?? ''));

        if ($addresseeId === '') {
            json_response(['error' => 'Addressee is required.'], 400);
        }

        if ($addresseeId === $userId) {
            json_response(['error' => 'You cannot friend yourself.'], 400);
        }

        $statement = db()->prepare(
            "INSERT INTO friendships (id, requester_id, addressee_id, status)
             VALUES (?, ?, ?, 'pending')"
        );

        try {
            $statement->execute([uuid(), $userId, $addresseeId]);
        } catch (Throwable $exception) {
            if (!duplicate_key_exception($exception)) {
                throw $exception;
            }
        }

        json_response(['ok' => true], 201);
    }

    if ($method === 'PATCH' && $path === '/friendships/accept') {
        $userId = require_user_id();
        $input = json_input();
        $requesterId = trim((string) ($input['requesterId'] ?? ''));

        if ($requesterId === '') {
            json_response(['error' => 'Requester is required.'], 400);
        }

        $statement = db()->prepare(
            "UPDATE friendships
             SET status = 'accepted', updated_at = CURRENT_TIMESTAMP
             WHERE requester_id = ? AND addressee_id = ?"
        );
        $statement->execute([$requesterId, $userId]);

        json_response(['ok' => true]);
    }

    if ($method === 'POST' && $path === '/conversations') {
        $userId = require_user_id();
        $input = json_input();
        $participantIds = array_values(array_filter((array) ($input['participantIds'] ?? []), 'is_string'));
        $allParticipants = array_values(array_unique(array_merge([$userId], $participantIds)));

        if (count($allParticipants) < 2) {
            json_response(['error' => 'A conversation needs at least two participants.'], 400);
        }

        $conversationId = uuid();
        $pdo = db();
        $pdo->beginTransaction();

        try {
            $statement = $pdo->prepare('INSERT INTO conversations (id) VALUES (?)');
            $statement->execute([$conversationId]);

            $participantStatement = $pdo->prepare(
                'INSERT INTO conversation_participants (id, conversation_id, user_id)
                 VALUES (?, ?, ?)'
            );

            foreach ($allParticipants as $participantId) {
                $participantStatement->execute([uuid(), $conversationId, $participantId]);
            }

            $pdo->commit();
        } catch (Throwable $exception) {
            $pdo->rollBack();
            throw $exception;
        }

        json_response(['conversation' => ['id' => $conversationId]], 201);
    }

    if ($method === 'GET' && $path === '/conversations') {
        $userId = require_user_id();
        $statement = db()->prepare(
            'SELECT c.id, c.updated_at
             FROM conversations c
             JOIN conversation_participants cp ON cp.conversation_id = c.id
             WHERE cp.user_id = ?
             ORDER BY c.updated_at DESC'
        );
        $statement->execute([$userId]);

        json_response(['conversations' => $statement->fetchAll()]);
    }

    if ($method === 'GET' && preg_match('#^/conversations/([^/]+)/messages$#', $path, $matches)) {
        $userId = require_user_id();
        $conversationId = $matches[1];
        ensure_conversation_participant($conversationId, $userId);

        $statement = db()->prepare(
            'SELECT m.id, m.content, m.created_at, m.sender_id, u.display_name
             FROM messages m
             JOIN users u ON u.id = m.sender_id
             WHERE m.conversation_id = ?
             ORDER BY m.created_at ASC'
        );
        $statement->execute([$conversationId]);

        $messages = array_map(static function (array $row): array {
            return [
                'id' => $row['id'],
                'content' => $row['content'],
                'created_at' => $row['created_at'],
                'sender_id' => $row['sender_id'],
                'profiles' => ['display_name' => $row['display_name']],
            ];
        }, $statement->fetchAll());

        json_response(['messages' => $messages]);
    }

    if ($method === 'POST' && preg_match('#^/conversations/([^/]+)/messages$#', $path, $matches)) {
        $userId = require_user_id();
        $conversationId = $matches[1];
        ensure_conversation_participant($conversationId, $userId);
        $input = json_input();
        $content = trim((string) ($input['content'] ?? ''));

        if ($content === '') {
            json_response(['error' => 'Message content is required.'], 400);
        }

        $pdo = db();
        $pdo->beginTransaction();

        try {
            $insertStatement = $pdo->prepare(
                'INSERT INTO messages (id, conversation_id, sender_id, content)
                 VALUES (?, ?, ?, ?)'
            );
            $insertStatement->execute([uuid(), $conversationId, $userId, $content]);

            $updateStatement = $pdo->prepare(
                'UPDATE conversations
                 SET updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?'
            );
            $updateStatement->execute([$conversationId]);

            $pdo->commit();
        } catch (Throwable $exception) {
            $pdo->rollBack();
            throw $exception;
        }

        json_response(['ok' => true], 201);
    }

    if ($method === 'GET' && $path === '/groups') {
        $statement = db()->query(
            'SELECT g.id, g.name, g.description, g.cover_image_url, g.created_by, g.is_public, g.created_at, g.updated_at,
                    COUNT(gm.id) AS member_count
             FROM `groups` g
             LEFT JOIN group_members gm ON gm.group_id = g.id
             WHERE g.is_public = 1
             GROUP BY g.id
             ORDER BY g.created_at DESC'
        );

        $groups = array_map(static function (array $row): array {
            return [
                'id' => $row['id'],
                'name' => $row['name'],
                'description' => $row['description'],
                'cover_image_url' => $row['cover_image_url'],
                'created_by' => $row['created_by'],
                'is_public' => (bool) $row['is_public'],
                'created_at' => $row['created_at'],
                'updated_at' => $row['updated_at'],
                'group_members' => [['count' => (int) $row['member_count']]],
            ];
        }, $statement->fetchAll());

        json_response(['groups' => $groups]);
    }

    if ($method === 'POST' && $path === '/groups') {
        $userId = require_user_id();
        $input = json_input();
        $name = trim((string) ($input['name'] ?? ''));
        $description = trim((string) ($input['description'] ?? ''));

        if ($name === '') {
            json_response(['error' => 'Group name is required.'], 400);
        }

        $groupId = uuid();
        $pdo = db();
        $pdo->beginTransaction();

        try {
            $groupStatement = $pdo->prepare(
                'INSERT INTO `groups` (id, name, description, created_by, is_public)
                 VALUES (?, ?, ?, ?, 1)'
            );
            $groupStatement->execute([$groupId, $name, $description !== '' ? $description : null, $userId]);

            $memberStatement = $pdo->prepare(
                "INSERT INTO group_members (id, group_id, user_id, role)
                 VALUES (?, ?, ?, 'admin')"
            );
            $memberStatement->execute([uuid(), $groupId, $userId]);

            $pdo->commit();
        } catch (Throwable $exception) {
            $pdo->rollBack();
            throw $exception;
        }

        json_response(['group' => ['id' => $groupId]], 201);
    }

    if ($method === 'POST' && preg_match('#^/groups/([^/]+)/join$#', $path, $matches)) {
        $userId = require_user_id();
        $statement = db()->prepare(
            "INSERT INTO group_members (id, group_id, user_id, role)
             VALUES (?, ?, ?, 'member')"
        );

        try {
            $statement->execute([uuid(), $matches[1], $userId]);
        } catch (Throwable $exception) {
            if (!duplicate_key_exception($exception)) {
                throw $exception;
            }
        }

        json_response(['ok' => true], 201);
    }

    json_response(['error' => 'Not found.'], 404);
} catch (Throwable $exception) {
    error_log($exception->getMessage());
    json_response(['error' => 'Internal server error.'], 500);
}
