<?php
// ============================================================================
// API AUTH (LOGIN, REGISTER, LOGOUT, ME) UNTUK NPD CLUB
// ============================================================================
session_start();
header('Content-Type: application/json');

require_once 'config.php';

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true) ?: $_POST;
$action = isset($_GET['action']) ? $_GET['action'] : (isset($data['action']) ? $data['action'] : '');

// --------------------------------------------------------------------------
// 1. CEK STATUS USER SAAT INI (ME)
// --------------------------------------------------------------------------
if ($action === 'me') {
    if (isset($_SESSION['user'])) {
        echo json_encode(['success' => true, 'logged_in' => true, 'user' => $_SESSION['user']]);
    } else {
        echo json_encode(['success' => true, 'logged_in' => false, 'user' => null]);
    }
    exit;
}

// --------------------------------------------------------------------------
// 2. REGISTER (DAFTAR AKUN BARU KE DATABASE)
// --------------------------------------------------------------------------
if ($action === 'register') {
    $name = trim($data['name'] ?? '');
    $email = strtolower(trim($data['email'] ?? ''));
    $phone = trim($data['phone'] ?? '');
    $password = $data['password'] ?? '';

    if (empty($name) || empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Nama, email, dan password wajib diisi.']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Format email tidak valid.']);
        exit;
    }

    if (strlen($password) < 6) {
        echo json_encode(['success' => false, 'message' => 'Password minimal 6 karakter.']);
        exit;
    }

    global $pdo, $db_connected;

    if ($db_connected && $pdo) {
        try {
            // Cek apakah email sudah terdaftar
            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            if ($stmt->fetch()) {
                echo json_encode(['success' => false, 'message' => 'Email ini sudah terdaftar. Silakan login.']);
                exit;
            }

            // Simpan password dengan hash aman (bcrypt)
            $passwordHash = password_hash($password, PASSWORD_BCRYPT);
            $insert = $pdo->prepare("INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)");
            $insert->execute([$name, $email, $phone, $passwordHash]);
            $userId = $pdo->lastInsertId();

            $userSession = [
                'id' => $userId,
                'name' => $name,
                'email' => $email,
                'phone' => $phone
            ];
            $_SESSION['user'] = $userSession;

            echo json_encode([
                'success' => true,
                'message' => 'Pendaftaran akun berhasil! Selamat datang di NPD CLUB.',
                'user' => $userSession
            ]);
            exit;
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Terjadi kesalahan database: ' . $e->getMessage()]);
            exit;
        }
    } else {
        // Fallback jika MySQL belum di-start di Laragon
        $userSession = [
            'id' => 999,
            'name' => $name,
            'email' => $email,
            'phone' => $phone
        ];
        $_SESSION['user'] = $userSession;
        echo json_encode([
            'success' => true,
            'message' => 'Pendaftaran berhasil (Mode Offline)! Nyalakan MySQL di Laragon untuk simpan permanen.',
            'user' => $userSession
        ]);
        exit;
    }
}

// --------------------------------------------------------------------------
// 3. LOGIN (VERIFIKASI EMAIL & PASSWORD)
// --------------------------------------------------------------------------
if ($action === 'login') {
    $email = strtolower(trim($data['email'] ?? ''));
    $password = $data['password'] ?? '';

    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Email dan password wajib diisi.']);
        exit;
    }

    global $pdo, $db_connected;

    if ($db_connected && $pdo) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if (!$user || !password_verify($password, $user['password_hash'])) {
                echo json_encode(['success' => false, 'message' => 'Email atau password salah.']);
                exit;
            }

            $userSession = [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'phone' => $user['phone']
            ];
            $_SESSION['user'] = $userSession;

            echo json_encode([
                'success' => true,
                'message' => 'Login berhasil! Selamat berbelanja, ' . htmlspecialchars($user['name']) . '.',
                'user' => $userSession
            ]);
            exit;
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Kesalahan database: ' . $e->getMessage()]);
            exit;
        }
    } else {
        // Fallback demo user
        if ($email === 'demo@npdclub.com' && $password === 'password123') {
            $userSession = ['id' => 1, 'name' => 'Fauzan NPD', 'email' => 'demo@npdclub.com', 'phone' => '081234567890'];
            $_SESSION['user'] = $userSession;
            echo json_encode(['success' => true, 'message' => 'Login demo berhasil!', 'user' => $userSession]);
            exit;
        } else {
            echo json_encode(['success' => false, 'message' => 'MySQL belum aktif di Laragon. Gunakan demo@npdclub.com / password123']);
            exit;
        }
    }
}

// --------------------------------------------------------------------------
// 4. LOGOUT
// --------------------------------------------------------------------------
if ($action === 'logout') {
    unset($_SESSION['user']);
    session_destroy();
    echo json_encode(['success' => true, 'message' => 'Anda telah berhasil keluar.']);
    exit;
}

echo json_encode(['success' => false, 'message' => 'Action tidak dikenal.']);
?>
