const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

app.use(bodyParser.json());

const SECRET_KEY = "segredinho";

app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "halloween_game",
});

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // extrai o token do cabecalho 'Authorization'
  if (!token) return res.status(403).send("A token is required for authentication");
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
}

// (2)- (READ) Capturar as informacoes da tabela 'game'
app.get("/games", (req, res) => {
  db.query("SELECT * FROM game ORDER BY score_game DESC", (err, results) => {
    if (err) return res.status(500).json({ message: "Error retrieving game data." });
    res.json(results);
  });
});

// (3)- (UPDATE) Inserir ID e novo nome para dar UPDATE renomear o nome do jogador atual
app.put("/game/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { player_name } = req.body;
  
  // verificar se o ID no token corresponde ao ID da requisicao
  if (req.user.id_game != id) return res.status(403).send("You can only update your own game");

  if (!player_name) return res.status(400).json({ message: "Player name is required." });

  db.query(
    "UPDATE game SET player_name = ? WHERE id_game = ?",
    [player_name, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error updating game data." });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Game not found." });
      res.send("Player name updated successfully.");
    }
  );
});

// (4)- (DELETE) Deletar uma tabela de dados tipo 'game' a partir do ID
app.delete("/game/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  // verificar se o ID no token corresponde ao ID da requisicao
  if (req.user.id_game != id) return res.status(403).send("You can only delete your own game");

  db.query(
    "DELETE FROM game WHERE id_game = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error deleting game data." });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Game not found." });
      res.send("Game deleted successfully.");
    }
  );
});

// (1)- (CREATE)- Inserir dados no banco de dados da tabela 'game'
app.post("/game", async (req, res) => {
  const { date_game, player_name, time_match, url_image, score_game } = req.body;
  if (!date_game || !player_name || !time_match || !url_image || !score_game) {
    return res.status(400).json({ message: "Error! All fields are required." });
  }
  db.query(
    "INSERT INTO game (date_game, player_name, time_match, url_image, score_game) VALUES (?, ?, ?, ?, ?)",
    [date_game, player_name, time_match, url_image, score_game],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error inserting game data." });
      
      // gerar um token JWT
      const token = jwt.sign(
        { id_game: result.insertId },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.status(201).json({ insertId: result.insertId, token }); // retorne o ID inserido e o token
    }
  );
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
