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

$db = $config['db'];
$connection = mysqli_init();
mysqli_real_connect(
    $connection,
    $db['host'],
    $db['user'],
    $db['password'],
    null,
    (int) $db['port'],
);

if (mysqli_connect_errno()) {
    fwrite(STDERR, 'MySQL connection failed: ' . mysqli_connect_error() . PHP_EOL);
    exit(1);
}

$sql = file_get_contents(dirname(__DIR__) . '/mysql/schema.sql');
if ($sql === false) {
    fwrite(STDERR, "Unable to read mysql/schema.sql\n");
    exit(1);
}

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
