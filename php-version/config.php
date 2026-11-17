<?php
// ============================================================================
// CONFIG DATABASE & KONEKSI UNTUK NPD CLUB
// ============================================================================

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'npd_club');

$pdo = null;
$db_connected = false;

try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    $db_connected = true;
} catch (PDOException $e) {
    // Jika belum import database atau XAMPP belum nyala,
    // jangan crash, kita gunakan fallback data agar web tetap bisa dibuka!
    $db_connected = false;
}

// Function helper untuk format rupiah
function formatRupiah($angka) {
    return 'IDR ' . number_format($angka, 0, ',', '.');
}
?>
