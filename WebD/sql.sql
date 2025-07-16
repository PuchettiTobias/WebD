-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS sistema_autenticacion 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Seleccionar la base de datos
USE sistema_autenticacion;

-- Crear la tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Opcional: Crear un usuario para la aplicación (ajusta los valores)
CREATE USER IF NOT EXISTS 'app_user'@'localhost' IDENTIFIED BY 'password_seguro';
GRANT ALL PRIVILEGES ON sistema_autenticacion.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;