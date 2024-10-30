document.getElementById('form-quiz').addEventListener('submit', function (e) {
    e.preventDefault(); // impede o envio padrão do formulário

    const correctAnswers = { // respostas corretas do quiz
        q1: "Pamela Vorhess",
        q2: "All work and no play makes Jack a dull boy.",
        q3: "The Conjuring",
        q4: "Poltergeists",
        q5: "Freddy Krueger",
        q6: "A forest",
        q7: "The Ghostface mask",
        q8: "The Ring",
        q9: "Clowns",
        q10: "Hypnosis"
    };

    const userAnswers = {}; // objeto para armazenar as respostas do usuário
    const selectedAnswers = document.querySelectorAll('input[type="radio"]:checked'); // seleciona todas as respostas marcadas

    selectedAnswers.forEach((radio) => { // percorre cada resposta marcada
        userAnswers[radio.name] = radio.value; // armazena a resposta do usuário no objeto userAnswers
    });

    let totalScore = 0; // inicializa a pontuação total
    let resultMessage = ""; // inicializa a mensagem de resultado

    for (let question in correctAnswers) { // percorre cada pergunta
        if (correctAnswers[question] === userAnswers[question]) { // verifica se a resposta do usuário está correta
            totalScore++; // incrementa a pontuação se a resposta estiver correta
            resultMessage += `Correct! ${question}: ${userAnswers[question]}\n`; // adiciona mensagem de resposta correta
        } else {
            resultMessage += `Wrong. ${question}: Your answer: ${userAnswers[question]}, Correct answer: ${correctAnswers[question]}\n`; // adiciona mensagem de resposta incorreta
        }
    }

    alert(`Score: ${totalScore}/10\n\n${resultMessage}`); // exibe a pontuação total e as mensagens de resultado
});

// Descrição: Os jogadores precisam encontrar pares de cartas com imagens ou palavras de Halloween.
// CRUD: O sistema permite adicionar, editar e remover cartas no conjunto de memória.
// Complexidade: Moderada. Exige um pouco mais de lógica para implementar o embaralhamento e o pareamento das cartas, mas ainda é gerenciável com JavaScript.
//https://www.youtube.com/watch?v=0SeqdHCBYVo