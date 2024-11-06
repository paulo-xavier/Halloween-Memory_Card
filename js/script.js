let card1 = null; // Armazena a primeira carta virada
let card2 = null; // Armazena a segunda carta virada
let startTime = 0;
let finalTime = 0;
let time_match = 0;
let data = "";
let score = 0;
let erros = 0;
let cardsFlippedIndex = [];
let cardsImage = [
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
let jumpsCareImage = [
  "./images/jumpscare1.gif",
  "./images/jumpscare2.gif",
  "./images/jumpscare3.gif",
  "./images/jumpscare4.jpg",
  "./images/jumpscare5.gif",
  "./images/jumpscare6.gif",
  "./images/jumpscare7.jpg",
];
let tracks = ["./audio/audio1.mp3", "./audio/audio2.mp3", "./audio/audio3.mp3"];

// Criar funções para:
// (1) Cronometrar tempo de partida
// time_match== Capturar tempo atual e substrair pelo tempo quando finalizada a partida
// (2) Penalidade por erro
// (3) Fazer pontuação final e demonstrar no alert

// Captura o tempo do inicio da partida
function setInitialTime() {
  const date = new Date();
  const hora = date.getHours();
  const minutos = date.getMinutes();
  const segundos = date.getSeconds();
  startTime = (((hora*60)+minutos)*60)+segundos;
}

// Captura o tempo do final da partida
function setFinalTime() {
  const date = new Date();
  const hora = date.getHours();
  const minutos = date.getMinutes();
  const segundos = date.getSeconds();
  finalTime = (((hora*60)+minutos)*60)+segundos;
}

// Seta o tempo da partida
function setTimeMatch() {
  time_match = finalTime - startTime;
}

// Substrai 5 pontos da variavel score
function addPenalty() {
  score = score - 5;
  erros++;
}

// 30 seg        - +200 score
// 1 min/60seg   - +100 score
// 2 min/120seg  - +50 score
// 4 min/240seg  - +25 score
// > 4min/240seg - +10 score

// Seta o score final ao encerrar a partida
function addTimeScore() {
    if(time_match<=30) score+=200;
    else if(time_match>30 && time_match<=60) score+=100;
    else if(time_match>60 && time_match<=120) score+=50;
    else if(time_match>120 && time_match<=240) score+=25;
    else if(time_match>240) score+=10;
}

// pré-carregar as imagens de jumpscare
function preloadJumpscareImages() {
  jumpsCareImage.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

// função para embaralhar um array usando o método Fisher-Yates
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Embaralhar as imagens das cartas ao carregar a página
window.onload = function () {
  preloadJumpscareImages(); // pre-carregar as imagens de jumpscare
  shuffle(cardsImage); // Embaralhar o array de imagens
  // Atualizar as cartas no HTML com as imagens embaralhadas
  document.querySelectorAll(".card").forEach((card, index) => {
    card.innerHTML = `<img src="./images/image-background.jpg" alt="Card Image" class="${getCardClass(
      cardsImage[index]
    )}">`;
  });
};

// Cada carta terá um eventListener caso elas forem clicadas e trará o index delas.
document.querySelectorAll(".card").forEach((card, index) => {
  card.addEventListener("click", () => {
    isCardFlipped(index); // (1) pegar o ID da carta
    if (!startTime) setInitialTime(); // Check startTime para ver se tem algum valor nele antes de executar a função
  });
});

// (1) pegar o ID da carta
// (2) Verificar se atualmente já existem 2 cartas viradas.
// Se sim, desvirá-las e virar a atual;
// (3) Caso não haja, verificar quais das duas tentativas estão sendo usadas e atribui-la para ela.
// Se usuário utiliza a segunda tentativa, verificar se ele acertou a combinação
// (4) Próxima tentativa
const isCardFlipped = (id) => {
  if (cardsFlippedIndex.includes(id) || card1 === id) {
    return; // Ignorar cliques em cartas já viradas corretamente ou na mesma carta
  }
  twoCardsFlipped(id); // (2) Verificar se atualmente já existem 2 cartas viradas.
};

function twoCardsFlipped(id) {
  if (card1 === null) {
    card1 = id;
    addImageCard(card1); // Alterar a imagem no HTML
  } else if (card2 === null) {
    card2 = id;
    addImageCard(card2); // Alterar a imagem no HTML
    checkIsMatch(); // Se usuário utiliza a segunda tentativa, verificar se ele acertou a combinação
  }
}

// Função para verificar se duas cartas são iguais
function checkIsMatch() {
  const cardOne = document.getElementById(`card${card1}`);
  const cardTwo = document.getElementById(`card${card2}`);
  if (
    cardOne.querySelector("img").classList.value ===
    cardTwo.querySelector("img").classList.value
  ) {
    cardsFlippedIndex.push(card1, card2); // Armazenar índices das cartas combinadas corretamente
    resetCards();
    checkGameEnd(); // Verificar se todas as cartas foram combinadas
  } else {
    setTimeout(() => {
      getJumpscare(2000, 5000);
      addPenalty(); // Faz score perder 5 pontos
      flipBack(); // Desvirar cartas após um tempo
    }, 1000);
  }
}

// Função responsável por alterar a imagem do cartão no HTML
function addImageCard(id) {
  document.getElementById(`card${id}`).innerHTML = `
        <img src="${cardsImage[id]}" alt="Card Image" class="${getCardClass(
    cardsImage[id]
  )}">
    `;
}

// Função para entrar no modo tela cheia
function goFullScreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    // Firefox
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    // Chrome, Safari e Opera
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    // IE/Edge
    elem.msRequestFullscreen();
  }
}

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function removeJumpscareBackground() {
  const backgroundElement = document.querySelector("html");
  if (backgroundElement) {
    backgroundElement.style.backgroundImage = "none";
  }
}

function setJumpscareBackground() {
  const id = getRandomInt(0, jumpsCareImage.length - 1); // ajuste para indexação correta
  const image = jumpsCareImage[id];
  const backgroundElement = document.querySelector("html.visible");
  if (backgroundElement) {
    // serve para verificar se existe a classe "visible" na tag html
    backgroundElement.style.backgroundImage = `url(${image})`;
  }
}

function setJumpscareSound() {
  const id = getRandomInt(0, tracks.length - 1);
  const player = document.getElementById("audio-jumpscare");
  player.src = tracks[id];
  player.play();
}

function getJumpscare() {
  setTimeout(() => {
    goFullScreen();
    const head = document.getElementById("head");
    const html = document.getElementsByTagName("html")[0];
    const body = document.getElementById("body");
    html.classList.add("visible");
    head.classList.add("removed");
    body.classList.add("removed");
    setJumpscareBackground();
    setJumpscareSound();
    setTimeout(() => {
      html.classList.remove("visible");
      head.classList.remove("removed");
      body.classList.remove("removed");
      document.exitFullscreen();
      removeJumpscareBackground();
    }, 1800);
  }, 1000);
}

// Função para determinar a classe da imagem
function getCardClass(imageSrc) {
  if (imageSrc.includes("skeleton")) return "skeleton";
  if (imageSrc.includes("witch")) return "witch";
  if (imageSrc.includes("zombie")) return "zombie";
  if (imageSrc.includes("spider")) return "spider";
  if (imageSrc.includes("pumpkin")) return "pumpkin";
  if (imageSrc.includes("scarecrow")) return "scarecrow";
  return "";
}

function flipBack() {
  if (card1 !== null) {
    document.getElementById(`card${card1}`).innerHTML = `
            <img src="./images/image-background.jpg" alt="">
        `;
  }
  if (card2 !== null) {
    document.getElementById(`card${card2}`).innerHTML = `
            <img src="./images/image-background.jpg" alt="">
        `;
  }
  resetCards();
}

function resetCards() {
  card1 = null;
  card2 = null;
}

// Função para verificar se todas as cartas foram combinadas
function checkGameEnd() {
  if (cardsFlippedIndex.length === cardsImage.length) {
    setFinalTime(); // Seta tempo final
    setTimeMatch(); // Seta tempo da partida
    addTimeScore(); // Adiciona a pontuação pelo tempo
    alert("Parabéns! Você concluiu o jogo.");
    console.log("Tempo de partida: " + time_match + ". \nTempo inicial: " + startTime + ". \nTempo final: " + finalTime + ". \nScore: " + score + ". \nErros: " + erros + ".");
    alert("Score: " + score);
    getJumpscare();
  }
}
