<?php
session_start();
require_once 'includes/functions.php';
require_once 'includes/auth.php';

if (isLoggedIn()) {
    redirect('welcome.php');
}

$error = '';

if (isset($_SESSION['message'])) {
    $message = $_SESSION['message'];
    unset($_SESSION['message']);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = sanitizeInput($_POST['username']);
    $password = sanitizeInput($_POST['password']);
    
    if (loginUser($username, $password)) {
        redirect('welcome.php');
    } else {
        $error = 'Usuario o contraseña incorrectos';
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Iniciar Sesión</title>
</head>
<body>
    <h2>Iniciar Sesión</h2>
    <?php if (isset($message)): ?>
        <p style="color: green;"><?= $message ?></p>
    <?php endif; ?>
    <?php if ($error): ?>
        <p style="color: red;"><?= $error ?></p>
    <?php endif; ?>
    
    <form method="post">
        <div>
            <label>Nombre de usuario:</label>
            <input type="text" name="username" required>
        </div>
        <div>
            <label>Contraseña:</label>
            <input type="password" name="password" required>
        </div>
        <button type="submit">Iniciar sesión</button>
    </form>
    
    <p>¿No tienes una cuenta? <a href="register.php">Regístrate</a></p>
</body>
</html>