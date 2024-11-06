-- Criar o banco de dados!
CREATE DATABASE halloween_game;

-- Esteja usando o banco de dados criado
USE halloween_game;

-- Crie esta tabela dentro do banco de dados criado
CREATE TABLE game (
    id_game INT NOT NULL UNIQUE AUTO_INCREMENT,
    date_game DATE NOT NULL,
    player_name VARCHAR(50) NOT NULL,
    time_match TIME,
    url_image VARCHAR(1000),
    score_game INT NOT NULL 
);