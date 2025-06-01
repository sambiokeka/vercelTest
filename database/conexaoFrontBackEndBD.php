<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$DB_CONFIG = [
    "user" => "root",
    "password" => "",
    "host" => "localhost",
    "database" => "enchentes_BD"
];

function conectar_mysql($config) {
    $conn = new mysqli($config["host"], $config["user"], $config["password"], $config["database"]);
    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(["erro" => "Erro na conexão: " . $conn->connect_error]);
        exit();
    }
    return $conn;
}

// Roteamento baseado em parâmetro GET 'rota'
$rota = $_GET['rota'] ?? '';

if ($rota == "cadastrar" && $_SERVER['REQUEST_METHOD'] === "POST") {
    cadastrar($DB_CONFIG);
} elseif ($rota == "api_ocorrencias") {
    api_ocorrencias($DB_CONFIG);
} elseif ($rota == "ocorrencias") {
    ocorrencias($DB_CONFIG);
} else {
    http_response_code(404);
    echo json_encode(["erro" => "Endpoint não encontrado"]);
    exit();
}

function cadastrar($config) {
    $cidade = $_POST['cidade'] ?? null;
    $nivel_agua = $_POST['nivel_agua'] ?? null;
    $pessoas_afetadas = $_POST['pessoas_afetadas'] ?? null;
    $data_enchente = $_POST['data_enchente'] ?? null;

    $nivel_agua = is_numeric($nivel_agua) ? floatval($nivel_agua) : null;
    $pessoas_afetadas = is_numeric($pessoas_afetadas) ? intval($pessoas_afetadas) : null;

    $conn = conectar_mysql($config);

    $query = "INSERT INTO registros (cidade, nivel_agua, pessoas_afetadas, data_enchente) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("sdss", $cidade, $nivel_agua, $pessoas_afetadas, $data_enchente);

    if ($stmt->execute()) {
        echo json_encode(["mensagem" => "Ocorrência cadastrada com sucesso!"]);
    } else {
        http_response_code(500);
        echo json_encode(["erro" => "Erro ao cadastrar ocorrência: " . $stmt->error]);
    }
    $stmt->close();
    $conn->close();
}

function api_ocorrencias($config) {
    $conn = conectar_mysql($config);
    $query = "SELECT * FROM registros";
    $result = $conn->query($query);

    $ocorrencias = [];
    while ($row = $result->fetch_assoc()) {
        $ocorrencias[] = $row;
    }
    echo json_encode($ocorrencias);

    $conn->close();
}

function ocorrencias($config) {
    api_ocorrencias($config);
}
?>