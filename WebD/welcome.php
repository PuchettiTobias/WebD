<?php
session_start();
require_once 'includes/functions.php';

requireLogin();
?>

<!DOCTYPE html>
<html>
<head>
    <title>Bienvenido</title>
</head>
<body>
    <h2>Bienvenido, <?= htmlspecialchars($_SESSION['username']) ?>!</h2>
    <p>Has iniciado sesión correctamente.</p>
    <a href="logout.php">Cerrar sesión</a>
</body>
</html>