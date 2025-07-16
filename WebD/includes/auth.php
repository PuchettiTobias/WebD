<?php
require_once 'functions.php';
require_once '../config/database.php';

$root = $_SERVER['DOCUMENT_ROOT'] . '/WebD/';
require_once $root . 'config/database.php';

function registerUser($username, $email, $password) {
    global $pdo;
    
    // Verificar si el usuario o email ya existen
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
    $stmt->execute([$username, $email]);
    
    if ($stmt->rowCount() > 0) {
        return false; // Usuario o email ya existen
    }
    
    // Hash de la contraseña
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Insertar nuevo usuario
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    $success = $stmt->execute([$username, $email, $hashedPassword]);
    
    return $success;
}

function loginUser($username, $password) {
    global $pdo;
    
    $stmt = $pdo->prepare("SELECT id, username, password FROM users WHERE username = ?");
    $stmt->execute([$username]);
    
    if ($stmt->rowCount() == 1) {
        $user = $stmt->fetch();
        
        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            return true;
        }
    }
    
    return false;
}
?>