<?php

declare(strict_types=1);

$configFile = dirname(__DIR__) . '/api/.env.php';
$config = file_exists($configFile) ? require $configFile : [
    'db' => [
        'host' => getenv('MYSQL_HOST') ?: '127.0.0.1',
        'port' => (int) (getenv('MYSQL_PORT') ?: 3306),
        'database' => getenv('MYSQL_DATABASE') ?: 'alieflocals',
        'user' => getenv('MYSQL_USER') ?: 'root',
        'password' => getenv('MYSQL_PASSWORD') ?: '',
    ],
];

function connect_to_database(array $db, ?string $database = null): mysqli
{
    $connection = mysqli_init();
    $connected = mysqli_real_connect(
        $connection,
        $db['host'],
        $db['user'],
        $db['password'],
        $database,
        (int) $db['port'],
    );

    if (!$connected || mysqli_connect_errno()) {
        throw new RuntimeException(mysqli_connect_error());
    }

    return $connection;
}

function mysql_identifier(string $value): string
{
    return '`' . str_replace('`', '``', $value) . '`';
}

function bootstrap_database_if_needed(array $db): void
{
    $adminUser = getenv('MYSQL_ADMIN_USER') ?: 'root';
    $adminPassword = getenv('MYSQL_ADMIN_PASSWORD') ?: (getenv('MYSQL_ROOT_PASSWORD') ?: '');

    if ($adminPassword === '') {
        return;
    }

    $admin = [
        'host' => $db['host'],
        'port' => $db['port'],
        'database' => '',
        'user' => $adminUser,
        'password' => $adminPassword,
    ];

    $connection = connect_to_database($admin, null);

    $databaseSql = sprintf(
        'CREATE DATABASE IF NOT EXISTS %s CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',
        mysql_identifier($db['database']),
    );

    if (!mysqli_query($connection, $databaseSql)) {
        throw new RuntimeException('Failed to create database: ' . mysqli_error($connection));
    }

    if ($db['user'] !== '' && $db['password'] !== '') {
        $user = mysqli_real_escape_string($connection, $db['user']);
        $password = mysqli_real_escape_string($connection, $db['password']);
        $host = mysqli_real_escape_string($connection, '%');

        $createUserSql = sprintf(
            "CREATE USER IF NOT EXISTS '%s'@'%s' IDENTIFIED BY '%s'",
            $user,
            $host,
            $password,
        );

        if (!mysqli_query($connection, $createUserSql)) {
            throw new RuntimeException('Failed to create database user: ' . mysqli_error($connection));
        }

        $grantSql = sprintf(
            "GRANT ALL PRIVILEGES ON %s.* TO '%s'@'%s'",
            mysql_identifier($db['database']),
            $user,
            $host,
        );

        if (!mysqli_query($connection, $grantSql)) {
            throw new RuntimeException('Failed to grant database privileges: ' . mysqli_error($connection));
        }

        if (!mysqli_query($connection, 'FLUSH PRIVILEGES')) {
            throw new RuntimeException('Failed to flush database privileges: ' . mysqli_error($connection));
        }
    }

    mysqli_close($connection);
}

$db = $config['db'];

try {
    $connection = connect_to_database($db, $db['database']);
} catch (Throwable $exception) {
    try {
        bootstrap_database_if_needed($db);
        $connection = connect_to_database($db, $db['database']);
    } catch (Throwable $bootstrapException) {
        $message = sprintf(
            "MySQL connection failed for %s@%s:%d/%s: %s\nMake sure the MariaDB container is reachable as 'bamlead-mariadb' on Docker network 'mysql_bamlead-network'. For first-time setup, provide MYSQL_ADMIN_PASSWORD or MYSQL_ROOT_PASSWORD so the migration can create the database and grant privileges.\n",
            $db['user'],
            $db['host'],
            (int) $db['port'],
            $db['database'],
            $bootstrapException->getMessage(),
        );
        fwrite(STDERR, $message);
        exit(1);
    }
}

$sql = file_get_contents(dirname(__DIR__) . '/mysql/schema.sql');
if ($sql === false) {
    fwrite(STDERR, "Unable to read mysql/schema.sql\n");
    exit(1);
}

$sql = preg_replace('/^\s*CREATE\s+DATABASE\b.*?;\s*/ims', '', $sql) ?? $sql;
$sql = preg_replace('/^\s*USE\s+`?[\w-]+`?\s*;\s*/ims', '', $sql) ?? $sql;

if (!mysqli_multi_query($connection, $sql)) {
    fwrite(STDERR, 'Migration failed: ' . mysqli_error($connection) . PHP_EOL);
    exit(1);
}

do {
    if ($result = mysqli_store_result($connection)) {
        mysqli_free_result($result);
    }
} while (mysqli_more_results($connection) && mysqli_next_result($connection));

if (mysqli_errno($connection) !== 0) {
    fwrite(STDERR, 'Migration failed: ' . mysqli_error($connection) . PHP_EOL);
    exit(1);
}

fwrite(STDOUT, "Migration completed successfully.\n");
