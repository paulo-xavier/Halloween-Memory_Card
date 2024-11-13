const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
app.use(bodyParser.json());

// Rotas para:
// (1)- (CREATE)- Inserir dados no banco de dados da tabela 'game';
// (2)- (READ) Capturar as informações da tabela 'game';
// (3)- (UPDATE) Inserir ID e novo nome para dar UPDATE renomear o nome do jogador atual;
// (4)- (DELETE) Deletar uma tabela de dados tipo 'game' a partir do ID;

// Observações:
// Precisamos implementar JWT (JSON Web Token) no server.js também;
// Essas são os ""Templates"" para as rotas

const SECRET_KEY = "secretKey";

app.use(
  cors()
);

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "halloween_game",
});

// (2)- (READ) Capturar as informações da tabela 'game';
app.get("/game", async (req, res) => {
  const { id_game } = req.body; // Obtém o ID do usuário do token
  db.query("SELECT * FROM game WHERE id_game = ?", [id_game], (err, result) => {
    if (err) return res.status(500).json({message: "Erro de server! Tente novamente mais tarde"});
    if (result.length === 0) {
      return res.status(404).send('Game not found!');
    }
    res.json(result[0]); // Retorna os dados do usuário
  });
});

// (3)- (UPDATE) Inserir ID e novo nome para dar UPDATE renomear o nome do jogador atual;
app.put("/game", async (req, res) => {
  const { id_game, player_name } = req.body; // Extrai o novo player_name e id do game atual do corpo da requisição
  db.query(
    "UPDATE game SET player_name = ? WHERE id_game = ?",
    [player_name, id_game],
    (err, result) => {
      if (err) throw err;

      // Verifica se nenhuma linha foi afetada pela consulta (ou seja, game não encontrado)
      if (result.affectedRows === 0) {
        return res.status(404).send("Player not found!");
      }
      res.send("Updating name!");
    }
  );
});

// (4)- (DELETE) Deletar uma tabela de dados tipo 'game' a partir do ID;
app.delete("/game", (req, res) => {
  const { id_game } = req.body;
  db.query(
    "DELETE FROM game WHERE id_game = ?",
    [id_game],
    (err, result) => {
      if (err) throw err;

      if (result.affectedRows === 0) {
        return res.status(404).send("Game not found!");
      }
      res.send("Game deleted successively");
    }
  );
});

// (1)- (CREATE)- Inserir dados no banco de dados da tabela 'game';
app.post("/game", async (req, res) => {
  const { date_game, player_name, time_match, url_image, score_game } = req.body;
  if (!date_game || !player_name || !time_match || !url_image || !score_game ) {
    return res.status(400).json({ message: "Error! Insert attempt with non-integer data detected!" });
  }  
  db.query(
    "INSERT INTO game (date_game, player_name, time_match, url_image, score_game) VALUES (?, ?, ?, ?, ?)",
    [date_game, player_name, time_match, url_image, score_game],
    (err) => {
      if (err) throw err;
      res.sendStatus(201); // Game registrado com sucesso
    }
  );
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
