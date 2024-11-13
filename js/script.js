let card1 = null; // primeira carta virada
let card2 = null; // segunda carta virada
let startTime = 0; // tempo inicial da partida
let finalTime = 0; // tempo final da partida
let time_match = 0; // duração da partida
let score = 0; // pontuação do jogador
let erros = 0; // numero de erros cometidos pelo jogador
let cardsFlippedIndex = []; // index das cartas viradas corretamente
let gameData = [];
let currentPlayerId = null;
let id_game = -1;
let currentToken = null; // variavel global para armazenar o token do jogador atual
const cardsImage = [
  "./images/skeleton.jpg",
  "./images/skeleton.jpg",
  "./images/witch.jpg",
  "./images/witch.jpg",
  "./images/zombie.jpg",
  "./images/zombie.jpg",
  "./images/spider.jpg",
  "./images/spider.jpg",
  "./images/pumpkin.jpg",
  "./images/pumpkin.jpg",
  "./images/scarecrow.jpg",
  "./images/scarecrow.jpg",
];
const jumpsCareImage = [
  "./images/jumpscare1.gif",
  "./images/jumpscare2.gif",
  "./images/jumpscare3.gif",
  "./images/jumpscare4.jpg",
  "./images/jumpscare5.gif",
  "./images/jumpscare6.gif",
  "./images/jumpscare7.jpg",
];
const tracks = [
  "./audio/audio1.mp3",
  "./audio/audio2.mp3",
  "./audio/audio3.mp3",
];

// funções de tempo
function setInitialTime() {
  startTime = Date.now(); // captura o tempo atual em milissegundos
}

function setFinalTime() {
  finalTime = Date.now(); // captura o tempo final em milissegundos
}

function setTimeMatch() {
  time_match = Math.floor((finalTime - startTime) / 1000); // calcula a duração da partida em segundos
}

function addPenalty() {
  if (score < 0) return;
  else {
    score -= 5; // subtrai 5 pontos do score
    erros++; // incrementa o numero de erros
  }
}

// adicionando pontuação com base na duração da partida
function addTimeScore() {
  if (time_match <= 30) score += 200; // +200 pontos ao score
  else if (time_match <= 60) score += 100; // +100 pontos ao score
  else if (time_match <= 120) score += 50; // +50 pontos ao score
  else if (time_match <= 240) score += 25; // +25 pontos ao score
  else score += 10; // +10 pontos ao score
}

// pre-carregar as imagens & gifs para facilitar a renderização
function preloadJumpscareImages() {
  jumpsCareImage.forEach((src) => {
    const img = new Image(); // cria uma nova imagem
    img.src = src; // define o caminho da imagem
  });
}

// algoritmo de Fisher-Yates para fazer o embaralhamento das cartas
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // gera um numero aleatorio
    [array[i], array[j]] = [array[j], array[i]]; // troca as posições dos elementos
  }
  return array;
}

window.onload = function () {
  const modal = document.querySelector(".container_modal");
  if (modal.open) modal.close(); // fecha o dialog se estiver aberto
  preloadJumpscareImages(); // pre-carregar as imagens & gifs de jumpscares
  shuffle(cardsImage); // embaralhar as imagens das cartas
  document.querySelectorAll(".card").forEach((card, index) => {
    card.innerHTML = `<img src="./images/image-background.jpg" alt="Card Image" class="${getCardClass(
      cardsImage[index]
    )}">`; // define a imagem das cartas no HTML
  });
};

// função para abrir o dialog
function openModal() {
  const modal = document.querySelector(".container_modal");
  modal.showModal(); // abre o dialog
}

// função para fechar o dialog
function closeModal() {
  const modal = document.querySelector(".container_modal");
  modal.close(); // fecha o dialog
}

document.querySelectorAll(".card").forEach((card, index) => {
  card.addEventListener("click", () => {
    isCardFlipped(index); // verifica se a carta foi virada
    if (!startTime) setInitialTime(); // define o tempo inicial se ainda não foi definido
  });
});

const isCardFlipped = (id) => {
  if (cardsFlippedIndex.includes(id) || card1 === id || card2 !== null) return; // ignora cliques em cartas já viradas corretamente ou na mesma carta
  twoCardsFlipped(id); // verifica se duas cartas foram viradas
};

function twoCardsFlipped(id) {
  if (card1 === null) {
    card1 = id; // define a primeira carta virada
    addImageCard(card1); // altera a imagem no HTML
  } else if (card2 === null) {
    card2 = id; // define a segunda carta virada
    addImageCard(card2); // altera a imagem no HTML
    checkIsMatch(); // verifica se as cartas combinam
  }
}

function checkIsMatch() {
  const cardOne = document.getElementById(`card${card1}`);
  const cardTwo = document.getElementById(`card${card2}`);
  if (
    cardOne.querySelector("img").classList.value ===
    cardTwo.querySelector("img").classList.value
  ) {
    cardsFlippedIndex.push(card1, card2); // armazena os indexs das cartas combinadas corretamente
    resetCards(); // reseta as cartas viradas
    checkGameEnd(); // verifica se todas as cartas foram combinadas
  } else {
    setTimeout(() => {
      getJumpscare(); // exibe o jumpscare
      addPenalty(); // aplica penalidade ao score
      flipBack(); // desvira as cartas
    }, 280);
  }
}

function addImageCard(id) {
  document.getElementById(`card${id}`).innerHTML = `<img src="${
    cardsImage[id]
  }" alt="Card Image" class="${getCardClass(cardsImage[id])}">`; // altera a imagem da carta no HTML
}

function goFullScreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) elem.requestFullscreen(); // entra no modo tela cheia
  else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen(); // para Firefox
  else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen(); // para Chrome, Safari e Opera
  else if (elem.msRequestFullscreen) elem.msRequestFullscreen(); // para IE/Edge
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min); // gera um numero inteiro aleatorio entre min (inclusive) e max (exclusivo)
}

function removeJumpscareBackground() {
  const backgroundElement = document.querySelector("html");
  if (backgroundElement) backgroundElement.style.backgroundImage = "none"; // remove a imagem de fundo
}

function setJumpscareBackground() {
  const id = getRandomInt(0, jumpsCareImage.length); // gera um index aleatorio
  const image = jumpsCareImage[id]; // obtem a imagem do jumpscare
  const backgroundElement = document.querySelector("html");
  if (backgroundElement) backgroundElement.style.backgroundImage = `url(${image})`; // define a imagem de fundo
}

function setJumpscareSound() {
  const id = getRandomInt(0, tracks.length); // gera index aleatorio
  const player = document.getElementById("audio-jumpscare");
  player.src = tracks[id]; // define a trilha sonora do jumpscare
  player.play(); // toca a trilha sonora
}

function getJumpscare() {
  goFullScreen(); // entra no modo tela cheia
  const head = document.getElementById("head");
  const html = document.getElementsByTagName("html")[0];
  const body = document.getElementById("body");
  html.classList.add("visible");
  head.classList.add("removed");
  body.classList.add("removed");
  setJumpscareBackground(); // define a imagem de fundo do jumpscare
  setJumpscareSound(); // toca a trilha sonora do jumpscare
  setTimeout(() => {
    document.exitFullscreen(); // sai do modo tela cheia
    html.classList.remove("visible");
    head.classList.remove("removed");
    body.classList.remove("removed");
    removeJumpscareBackground(); // remove a imagem de fundo
  }, 1800); // duração do jumpscare
}

function getCardClass(imageSrc) {
  if (imageSrc.includes("skeleton")) return "skeleton"; // retorna a classe "skeleton" para imagens de esqueleto
  if (imageSrc.includes("witch")) return "witch"; // retorna a classe "witch" para imagens de bruxa
  if (imageSrc.includes("zombie")) return "zombie"; // retorna a classe "zombie" para imagens de zumbi
  if (imageSrc.includes("spider")) return "spider"; // retorna a classe "spider" para imagens de aranha
  if (imageSrc.includes("pumpkin")) return "pumpkin"; // retorna a classe "pumpkin" para imagens de abobora
  if (imageSrc.includes("scarecrow")) return "scarecrow"; // retorna a classe "scarecrow" para imagens de espantalho
  return "";
}

function flipBack() {
  if (card1 !== null) {
    document.getElementById(
      `card${card1}`
    ).innerHTML = `<img src="./images/image-background.jpg" alt="">`; // desvira a primeira carta
  }
  if (card2 !== null) {
    document.getElementById(
      `card${card2}`
    ).innerHTML = `<img src="./images/image-background.jpg" alt="">`; // desvira a segunda carta
  }
  resetCards(); // reseta as cartas viradas
}

function resetCards() {
  card1 = null; // reseta a primeira carta virada
  card2 = null; // reseta a segunda carta virada
}

// abre o dialogo para inserir o nome do jogador
function openPlayerNameDialog() {
  const playerNameDialog = document.getElementById("playerNameDialog");
  playerNameDialog.showModal();
}

// funcao para quando o jogo acabar
function onGameEnd() {
  setTimeout(() => openPlayerNameDialog(), 5500);
}

// funcao para gerar 10 caracteres aleatorios
function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// funcao para obter uma url de imagem Robohash aleatoria
function getRandomImageUrl() {
  const randomString = generateRandomString(10);
  return `https://robohash.org/${randomString}`;
}

// envia os dados do jogador para o backend
async function submitPlayerData(playerName) {
  const response = await fetch("http://localhost:3000/game", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      date_game: new Date().toISOString().split("T")[0],
      player_name: playerName,
      time_match,
      url_image: getRandomImageUrl(),
      score_game: score,
    }),
  });
  if (response.ok) {
    const result = await response.json();
    currentPlayerId = result.insertId; // define o id do jogador atual
    currentToken = result.token; // armazena o token JWT do jogador atual
    fetchRankingData(); // atualiza os dados do ranking apos inserir o novo jogador
  } else alert("Error registering game data.");
}

// funcao para enviar o nome do jogador
function submitPlayerName() {
  const playerNameInput = document.getElementById("playerNameInput").value;

  if (playerNameInput) {
    submitPlayerData(playerNameInput); // envia os dados do jogador para o backend
    document.getElementById("playerNameDialog").close();
  } else alert("Please enter a name.");
}

// obtem os dados do ranking do backend
async function fetchRankingData() {
  const response = await fetch("http://localhost:3000/games");
  if (response.ok) {
    gameData = await response.json();
    openRankingDialog(); // abre o dialogo de ranking com os dados atualizados
  } else alert("Error getting ranking data.");
}

// abre o dialogo de ranking
function openRankingDialog() {
  const rankingDialog = document.getElementById("rankingDialog");
  const rankingContainer = document.getElementById("rankingContainer");
  rankingContainer.innerHTML = ""; // limpa o conteudo anterior

  gameData.sort((a, b) => b.score_game - a.score_game); // ordena os jogadores pela pontuacao

  gameData.forEach((player, index) => {
    const rankingPosition = document.createElement("div");
    rankingPosition.className = "ranking_position";
    if (player.id_game === currentPlayerId) rankingPosition.style.backgroundColor = "lightgray"; // destaca o jogador atual
    rankingPosition.innerHTML = `
      <p>${index + 1}</p>
      <img src="${player.url_image}" alt="Image of ${player.player_name}">
      <p>${player.player_name}</p>
      <p>${player.score_game}</p>
      ${
        player.id_game === currentPlayerId ? `
          <button onclick="editPlayerName()">Edit</button>
          <button onclick="deletePlayerData()">Delete</button>
        ` : ""
      }
    `;
    rankingContainer.appendChild(rankingPosition);
  });

  rankingDialog.showModal(); // abre o dialogo de ranking
}

// edita o nome do jogador
function editPlayerName() {
  const newPlayerName = prompt("Enter new name:");
  if (newPlayerName) updatePlayerName(newPlayerName); // atualiza o nome do jogador no backend
}

// atualiza o nome do jogador no backend
async function updatePlayerName(newPlayerName) {
  const response = await fetch(
    `http://localhost:3000/game/${currentPlayerId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`, // adiciona o token JWT no cabeçalho
      },
      body: JSON.stringify({ player_name: newPlayerName }),
    }
  );
  if (response.ok) fetchRankingData(); // recarrega o dialogo de ranking para mostrar o novo nome
  else alert("Error updating player name.");
}

// exclui os dados do jogador
async function deletePlayerData() {
  const response = await fetch(
    `http://localhost:3000/game/${currentPlayerId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`, // adiciona o token JWT no cabeçalho
      },
    }
  );
  if (response.ok) {
    fetchRankingData(); // atualiza os dados do ranking apos excluir o jogador
    currentPlayerId = null; // reseta o id do jogador atual
  } else alert("Error deleting game data.");
}

// verifica se o jogo terminou
function checkGameEnd() {
  if (cardsFlippedIndex.length === cardsImage.length) {
    setFinalTime(); // define o tempo final da partida
    setTimeMatch(); // calcula a duracao da partida
    addTimeScore(); // adiciona pontos ao score com base no tempo de partida
    alert(`Congratulations! You have completed the game. \nMatch time: ${time_match}s \nScore: ${score}`);
    getJumpscare(); // funcao para mostrar o jumpscare
    onGameEnd(); // funcao para abrir o dialog de insert de nome
  }
}