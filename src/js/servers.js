const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// Permite requisições do frontend
app.use(cors());

// Conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost', // Corrigido!
  user: 'root', 
  password: 'root', 
  database: 'enchentes_BD'
});

// Endpoint para buscar todos os registros
app.get('/api/ocorrencias', (req, res) => {
  connection.query('SELECT * FROM registros', (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.json(results);
    }
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});