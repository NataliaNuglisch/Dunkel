<?php
include("conexao.php");

$nome = $_POST["nome"];
$sobrenome = $_POST["sobrenome"];
$email = $_POST["email"];
$senha = $_POST["Senha"];

$sqlGravar = "INSERT INTO clientes(nome, email, sobrenome, senha)
values('$nome','$email','$sobrenome', '$senha')";
$registrar = mysqli_query($conexao,$sqlGravar);
header('Location: login.html');

?>