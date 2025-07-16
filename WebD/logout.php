<?php
session_start();
require_once 'includes/functions.php';

$_SESSION = array();
session_destroy();

redirect('login.php');
?>