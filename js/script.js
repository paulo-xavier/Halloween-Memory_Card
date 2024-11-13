let card1 = null; // primeira carta virada
let card2 = null; // segunda carta virada
let startTime = 0; // tempo inicial da partida
let finalTime = 0; // tempo final da partida
let time_match = 0; // duração da partida
let score = 0; // pontuação do jogador
let erros = 0; // número de erros cometidos pelo jogador
let cardsFlippedIndex = []; // index das cartas viradas corretamente
const cardsImage = [
    "./images/skeleton.jpg", "./images/skeleton.jpg",
    "./images/witch.jpg", "./images/witch.jpg",
    "./images/zombie.jpg", "./images/zombie.jpg",
    "./images/spider.jpg", "./images/spider.jpg",
    "./images/pumpkin.jpg", "./images/pumpkin.jpg",
    "./images/scarecrow.jpg", "./images/scarecrow.jpg"
];
const jumpsCareImage = [
    "./images/jumpscare1.gif", "./images/jumpscare2.gif",
    "./images/jumpscare3.gif", "./images/jumpscare4.jpg",
    "./images/jumpscare5.gif", "./images/jumpscare6.gif",
    "./images/jumpscare7.jpg"
];
const tracks = ["./audio/audio1.mp3", "./audio/audio2.mp3", "./audio/audio3.mp3"];

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
    score -= 5; // subtrai 5 pontos do score
    erros++; // incrementa o número de erros
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
        const j = Math.floor(Math.random() * (i + 1)); // gera um número aleatório
        [array[i], array[j]] = [array[j], array[i]]; // troca as posições dos elementos
    }
    return array;
}

window.onload = function () {
    preloadJumpscareImages(); // pre-carregar as imagens & gifs de jumpscares
    shuffle(cardsImage); // embaralha as imagens das cartas
    document.querySelectorAll(".card").forEach((card, index) => {
        card.innerHTML = `<img src="./images/image-background.jpg" alt="Card Image" class="${getCardClass(cardsImage[index])}">`; // define a imagem das cartas no HTML
    });
};

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
    if (cardOne.querySelector("img").classList.value === cardTwo.querySelector("img").classList.value) {
        cardsFlippedIndex.push(card1, card2); // armazena os índices das cartas combinadas corretamente
        resetCards(); // reseta as cartas viradas
        checkGameEnd(); // verifica se todas as cartas foram combinadas
    } else {
        setTimeout(() => {
            getJumpscare(); // exibe o jumpscare
            addPenalty(); // aplica penalidade ao score
            flipBack(); // desvira as cartas
        }, 1000);
    }
}

function addImageCard(id) {
    document.getElementById(`card${id}`).innerHTML = `<img src="${cardsImage[id]}" alt="Card Image" class="${getCardClass(cardsImage[id])}">`; // altera a imagem da carta no HTML
}

function goFullScreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen(); // entra no modo tela cheia
    else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen(); // para Firefox
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen(); // para Chrome, Safari e Opera
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen(); // para IE/Edge
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min); // gera um número inteiro aleatório entre min (inclusive) e max (exclusivo)
}

function removeJumpscareBackground() {
    const backgroundElement = document.querySelector("html");
    if (backgroundElement) {
        backgroundElement.style.backgroundImage = "none"; // remove a imagem de fundo
    }
}

function setJumpscareBackground() {
    const id = getRandomInt(0, jumpsCareImage.length); // gera um índice aleatório
    const image = jumpsCareImage[id]; // obtém a imagem do jumpscare
    const backgroundElement = document.querySelector("html");
    if (backgroundElement) {
        backgroundElement.style.backgroundImage = `url(${image})`; // define a imagem de fundo
    }
}

function setJumpscareSound() {
    const id = getRandomInt(0, tracks.length); // gera um índice aleatório
    const player = document.getElementById("audio-jumpscare");
    player.src = tracks[id]; // define a trilha sonora do jumpscare
    player.play(); // toca a trilha sonora
}

function getJumpscare() {
    setTimeout(() => {
        goFullScreen(); // entra no modo tela cheia
        setJumpscareBackground(); // define a imagem de fundo do jumpscare
        setJumpscareSound(); // toca a trilha sonora do jumpscare
        setTimeout(() => {
            document.exitFullscreen(); // sai do modo tela cheia
            removeJumpscareBackground(); // remove a imagem de fundo
        }, 1800);
    }, 1000);
}

function getCardClass(imageSrc) {
    if (imageSrc.includes("skeleton")) return "skeleton"; // retorna a classe "skeleton" para imagens de esqueleto
    if (imageSrc.includes("witch")) return "witch"; // retorna a classe "witch" para imagens de bruxa
    if (imageSrc.includes("zombie")) return "zombie"; // retorna a classe "zombie" para imagens de zumbi
    if (imageSrc.includes("spider")) return "spider"; // retorna a classe "spider" para imagens de aranha
    if (imageSrc.includes("pumpkin")) return "pumpkin"; // retorna a classe "pumpkin" para imagens de abóbora
    if (imageSrc.includes("scarecrow")) return "scarecrow"; // retorna a classe "scarecrow" para imagens de espantalho
    return "";
}

function flipBack() {
    if (card1 !== null) {
        document.getElementById(`card${card1}`).innerHTML = `<img src="./images/image-background.jpg" alt="">`; // desvira a primeira carta
    }
    if (card2 !== null) {
        document.getElementById(`card${card2}`).innerHTML = `<img src="./images/image-background.jpg" alt="">`; // desvira a segunda carta
    }
    resetCards(); // reseta as cartas viradas
}

function resetCards() {
    card1 = null; // reseta a primeira carta virada
    card2 = null; // reseta a segunda carta virada
}

function checkGameEnd() {
    if (cardsFlippedIndex.length === cardsImage.length) {
        setFinalTime(); // define o tempo final da partida
        setTimeMatch(); // calcula a duração da partida
        addTimeScore(); // adiciona pontos ao score com base no tempo de partida
        alert(`Parabéns! Você concluiu o jogo. \nTempo de partida: ${time_match}s \nScore: ${score}`);
        getJumpscare(); // chama a função para mostrar o jumpscare
    }
}