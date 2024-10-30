// document.getElementById('form-quiz').addEventListener('submit', function (e) {
//     e.preventDefault(); // impede o envio padrão do formulário

//     const correctAnswers = { // respostas corretas do quiz
//         q1: "Pamela Vorhess",
//         q2: "All work and no play makes Jack a dull boy.",
//         q3: "The Conjuring",
//         q4: "Poltergeists",
//         q5: "Freddy Krueger",
//         q6: "A forest",
//         q7: "The Ghostface mask",
//         q8: "The Ring",
//         q9: "Clowns",
//         q10: "Hypnosis"
//     };

//     const userAnswers = {}; // objeto para armazenar as respostas do usuário
//     const selectedAnswers = document.querySelectorAll('input[type="radio"]:checked'); // seleciona todas as respostas marcadas

//     selectedAnswers.forEach((radio) => { // percorre cada resposta marcada
//         userAnswers[radio.name] = radio.value; // armazena a resposta do usuário no objeto userAnswers
//     });

//     let totalScore = 0; // inicializa a pontuação total
//     let resultMessage = ""; // inicializa a mensagem de resultado

//     for (let question in correctAnswers) { // percorre cada pergunta
//         if (correctAnswers[question] === userAnswers[question]) { // verifica se a resposta do usuário está correta
//             totalScore++; // incrementa a pontuação se a resposta estiver correta
//             resultMessage += `Correct! ${question}: ${userAnswers[question]}\n`; // adiciona mensagem de resposta correta
//         } else {
//             resultMessage += `Wrong. ${question}: Your answer: ${userAnswers[question]}, Correct answer: ${correctAnswers[question]}\n`; // adiciona mensagem de resposta incorreta
//         }
//     }

//     alert(`Score: ${totalScore}/10\n\n${resultMessage}`); // exibe a pontuação total e as mensagens de resultado
// });

// // Descrição: Os jogadores precisam encontrar pares de cartas com imagens ou palavras de Halloween.
// // CRUD: O sistema permite adicionar, editar e remover cartas no conjunto de memória.
// // Complexidade: Moderada. Exige um pouco mais de lógica para implementar o embaralhamento e o pareamento das cartas, mas ainda é gerenciável com JavaScript.
// //https://www.youtube.com/watch?v=0SeqdHCBYVo




// Get the user clicking 



let card1 = null; //Armeza a primeira carta virada
let card2 = null; //Armazena a segunda carta virada

const cardsFlippedIndex = [];


let cardsImage = [
    "../images/skeleton.jpg",
    "../images/skeleton.jpg", 
    "../images/witch.avif",
    "../images/witch.avif",
    "../images/zombie.avif", 
    "../images/zombie.avif", 
    "../images/spider.png" ,
    "../images/spider.png", 
    "../images/pumpkin.webp", 
    "../images/pumpkin.webp",
    "../images/scarecrow.avif", 
    "../images/scarecrow.avif"
    
]


// Cada carta terá um eventListener caso elas forem clicadas e trará o index delas.

document.querySelectorAll('.card').forEach((card, index) => {
    
    card.addEventListener('click', () => {
        
        isCardFlipped(index); // (1) pegar o ID da carta

    });
});






// (1) pegar o ID da carta

// (2) Verificar se atualmente já existem 2 cartas viradas. 
    // Se sim, desvirá=las e virar a atual;


// (3) Caso não haja, verificar quais das duas tentativas estão sendo usadas e atribui-la para ela.
    // Se usuário utiliza a segudna tentativa, verificar se ele acertou a combinação

// (4) Próxima tentativa




const isCardFlipped = (id) => {

    // console.log(id)

    twoCardsFlipped(id); // (2) Verificar se atualmente já existem 2 cartas viradas. 


 
}


function  twoCardsFlipped (id) {

    // (3) Caso não haja, verificar quais das duas tentativas estão sendo usadas e atribui-la para ela.

    if (card1 === null){
        
        card1 = id;

        addImageCard(card1) //Alterar a imagem no HTML

        return;

    
    } else {
        
        card2 = id;

        addImageCard(card2) // Alterar a imagem no HTML

        checkIsMatch() // Se usuário utiliza a segudna tentativa, verificar se ele acertou a combinação

    } 

}


//Função para verificar se duas cartas são iguais

function checkIsMatch() {
    
    const cardOne = document.getElementById(`card${card1}`);
    const cardTwo = document.getElementById(`card${card2}`);

    if (cardOne.classList === cardTwo.classList) {
        alert('Ambas as cartas são iguais!!')
    }
}



//Função responsável por alterar a imagem do cartão no HTML

function addImageCard(id) {

    document.getElementById(`card${id}`).innerHTML = `
        <img src="${cardsImage[id]}" alt="Card Image">
    `;
}




function flip() {
    // Lógica para desvirar as duas cartas viradas  
}