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

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // Se o token for válido, armazena os dados do usuário no 'req'
    next(); // Continua para a próxima função
  });
}

// (2)- (READ) Capturar as informações da tabela 'game';
app.get("/game", authenticateToken, (req, res) => {
  const userEmail = req.user.email; // Obtém o ID do usuário do token
  db.query("SELECT email FROM users WHERE email = ?", [userEmail], (err, result) => {
    if (err) return res.status(500).json({message: "Erro de server! Tente novamente mais tarde"});
    if (result.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }
    res.json(result[0]); // Retorna os dados do usuário
  });
});

// (3)- (UPDATE) Inserir ID e novo nome para dar UPDATE renomear o nome do jogador atual;
app.put("/game", authenticateToken, async (req, res) => {
  const { newEmail, newPassword } = req.body; // Extrai o novo e-mail e a nova senha do corpo da requisição
  const hashedPassword = await bcrypt.hash(newPassword, 10); // Criptografa a nova senha
  db.query(
    "UPDATE users SET email = ?, password = ? WHERE email = ?",
    [newEmail, hashedPassword, req.user.email],
    (err, result) => {
      if (err) throw err;

      // Verifica se nenhuma linha foi afetada pela consulta (ou seja, usuário não encontrado)
      if (result.affectedRows === 0) {
        return res.status(404).send("Usuário não encontrado");
      }
      res.send("Usuário atualizado com sucesso");
    }
  );
});

// (4)- (DELETE) Deletar uma tabela de dados tipo 'game' a partir do ID;
app.delete("/game", authenticateToken, (req, res) => {
  db.query(
    "DELETE FROM users WHERE email = ?",
    [req.user.email],
    (err, result) => {
      if (err) throw err;

      if (result.affectedRows === 0) {
        return res.status(404).send("Usuário não encontrado");
      }
      res.send("Usuário deletado com sucesso");
    }
  );
});

// (1)- (CREATE)- Inserir dados no banco de dados da tabela 'game';
app.post("/game", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email e senha são precisos." });
  }
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Erro de server. Tente novamente depois." });
      if (
        result.length === 0 ||
        !(await bcrypt.compare(password, result[0].password))
      ) {
        return res.status(400).send("Email ou senha inválidos");
      }

      const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });
      res.json({ token }); // Retorna o token ao cliente
    }
  );
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const saltRounds = 10; // Número de rounds para salting

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      return res.status(400).send("Usuário já existe");
    } else {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        // alternativa: const hashedPassword = await bcrypt.hash(password, 10) // Criptografa a senha
        if (err) throw err;
        db.query(
          "INSERT INTO users (email, password) VALUES (?, ?)",
          [email, hash],
          (err) => {
            if (err) throw err;
            res.sendStatus(201); // Usuário registrado com sucesso
          }
        );
      });
    }
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
