let card1 = null; // Armazena a primeira carta virada
let card2 = null; // Armazena a segunda carta virada
let cardsFlippedIndex = [];
let cardsImage = [
    "./images/skeleton.jpg", "./images/skeleton.jpg",
    "./images/witch.jpg", "./images/witch.jpg",
    "./images/zombie.jpg", "./images/zombie.jpg",
    "./images/spider.jpg", "./images/spider.jpg",
    "./images/pumpkin.jpg", "./images/pumpkin.jpg",
    "./images/scarecrow.jpg", "./images/scarecrow.jpg"
];

let jumpsCareImage = [
    "./images/jumpscare1.jpg",
    "./images/jumpscare2.gif",
    "./images/jumpscare3.jpg",
    "./images/jumpscare4.jpg",
    "./images/jumpscare5.gif",
    "./images/jumpscare6.gif",
    "./images/jumpscare7.jpg",
]

// Cada carta terá um eventListener caso elas forem clicadas e trará o index delas.
document.querySelectorAll('.card').forEach((card, index) => {
    card.addEventListener('click', () => {
        isCardFlipped(index); // (1) pegar o ID da carta
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
    if (cardOne.querySelector('img').classList.value === cardTwo.querySelector('img').classList.value) {
        alert('Combinação encontrada!');
        cardsFlippedIndex.push(card1, card2); // Armazenar índices das cartas combinadas corretamente
        resetCards();
        checkGameEnd(); // Verificar se todas as cartas foram combinadas
    } else {
        setTimeout(() => {
            alert('Combinação errada!');
            getJumpscare(2000, 5000);
            flipBack(); // Desvirar cartas após um tempo
        }, 1000);
    }
}

// Função responsável por alterar a imagem do cartão no HTML
function addImageCard(id) {
    document.getElementById(`card${id}`).innerHTML = `
        <img src="${cardsImage[id]}" alt="Card Image" class="${getCardClass(cardsImage[id])}">
    `;
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function getJumpscare(a, b){
    time=getRandomInt(a, b);
    setTimeout(() => {
        alert('BU!');
    }, time);
}

// Função para determinar a classe da imagem
function getCardClass(imageSrc) {
    if (imageSrc.includes('skeleton')) return 'skeleton';
    if (imageSrc.includes('witch')) return 'witch';
    if (imageSrc.includes('zombie')) return 'zombie';
    if (imageSrc.includes('spider')) return 'spider';
    if (imageSrc.includes('pumpkin')) return 'pumpkin';
    if (imageSrc.includes('scarecrow')) return 'scarecrow';
    return '';
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
        alert('Parabéns! Você concluiu o jogo.');
        getJumpscare(2000, 30000);
    }
}

