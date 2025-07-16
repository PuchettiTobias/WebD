<?php
session_start();
require_once 'includes/functions.php';
require_once 'includes/auth.php';

if (isLoggedIn()) {
    redirect('welcome.php');
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = sanitizeInput($_POST['username']);
    $email = sanitizeInput($_POST['email']);
    $password = sanitizeInput($_POST['password']);
    $confirm_password = sanitizeInput($_POST['confirm_password']);
    
    if ($password !== $confirm_password) {
        $error = 'Las contraseñas no coinciden';
    } else {
        if (registerUser($username, $email, $password)) {
            $_SESSION['message'] = 'Registro exitoso. Por favor inicia sesión.';
            redirect('login.php');
        } else {
            $error = 'El usuario o email ya están registrados';
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Registro</title>
</head>
<body>
    <h2>Registro de Usuario</h2>
    <?php if ($error): ?>
        <p style="color: red;"><?= $error ?></p>
    <?php endif; ?>
    
    <form method="post">
        <div>
            <label>Nombre de usuario:</label>
            <input type="text" name="username" required>
        </div>
        <div>
            <label>Email:</label>
            <input type="email" name="email" required>
        </div>
        <div>
            <label>Contraseña:</label>
            <input type="password" name="password" required>
        </div>
        <div>
            <label>Confirmar contraseña:</label>
            <input type="password" name="confirm_password" required>
        </div>
        <button type="submit">Registrarse</button>
    </form>
    
    <p>¿Ya tienes una cuenta? <a href="login.php">Inicia sesión</a></p>
</body>
</html>