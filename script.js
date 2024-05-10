const applauseSound = new Audio("applause.mp3");
const cheersSound = new Audio("cheers.mp3");
const encouragementSound = new Audio("encouragement.mp3");

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById("start-button");
    const introduction = document.getElementById("introduction");
    const questionContainer = document.getElementById("question-container");
    const questionText = document.getElementById("question-text");
    const answerButtons = document.getElementById("answer-buttons");
    const scoreElement = document.getElementById("score-value");
    const timerElement = document.getElementById("timer-value");
    const timerBar = document.getElementById("timer-bar");
    const nextButton = document.getElementById("next-button");
    const gameOverContainer = document.getElementById("game-over");
    const finalScoreValue = document.getElementById("final-score-value");
    const trophyContainer = document.getElementById("trophy-container");
    const trophyImage = document.getElementById("trophy-image");
    const trophyMessage = document.getElementById("trophy-message");
    const feedbackIcons = document.getElementById("feedback-icons");
    const totalScoreElement = document.getElementById("total-score");
    const correctAnswersElement = document.getElementById("correct-answers");
    const correctSound = new Audio("correct.mp3");
    const wrongSound = new Audio("wrong.mp3");
    const backgroundMusic = document.getElementById("background-music");

    let currentQuestionIndex;
    let score;
    let timer;
    let intervalId;

    startButton.addEventListener('click', startGame);
    nextButton.addEventListener('click', nextQuestion);
    document.getElementById('restart-button').addEventListener('click', restartGame);

    function startGame() {
        startButton.classList.add("hide");
        introduction.classList.add("hide");
        questionContainer.classList.remove("hide");
        scoreElement.parentNode.classList.remove("hide");
        timerElement.parentNode.classList.remove("hide");
        nextButton.classList.remove("hide"); // Garantir que o botão seja explicitamente mostrado
        gameOverContainer.classList.add("hide");
        trophyContainer.classList.add("hide");
        feedbackIcons.classList.add("hide");
        totalScoreElement.parentNode.classList.add("hide");
        correctAnswersElement.parentNode.classList.add("hide");
        currentQuestionIndex = 0;
        score = 0;
        timer = 30;
        updateScore();
        startTimer();
        showQuestion(QUESTIONS[currentQuestionIndex]);
        playBackgroundMusic();
        
        // Hide the start image after the game starts
        document.getElementById('start-image').style.display = 'none';
    }

    function showQuestion(question) {
        questionText.innerText = question.question;
        showAnswers(question);
    }

    function showAnswers(question) {
        answerButtons.innerHTML = "";

        const shuffledAnswers = question.answers.sort(() => Math.random() - 0.5);

        shuffledAnswers.forEach((answer) => {
            const button = document.createElement("button");
            button.innerText = answer.text;
            button.classList.add("btn");
            button.addEventListener("click", () => selectAnswer(answer, button));
            answerButtons.appendChild(button);
        });

        answerButtons.classList.remove("hide");
    }

    function selectAnswer(answer, selectedButton) {
        if (!selectedButton.classList.contains('disabled')) {
            const correct = answer.correct;
    
            if (correct) {
                score += 10;
                correctSound.play();
                selectedButton.classList.add('correct-answer');
                showFeedbackIcon('correct');
            } else {
                wrongSound.play(); // Aqui está o trecho para tocar o som de resposta incorreta
                selectedButton.classList.add('wrong-answer');
                showFeedbackIcon('wrong');
            }
    
            disableAnswerButtons();
            updateScore();
            clearInterval(intervalId);
            setTimeout(nextQuestion, 2000);
        }
    }

    function showFeedbackIcon(type) {
        feedbackIcons.innerHTML = "";
    
        const icon = document.createElement("i");
        icon.classList.add("material-icons");
    
        if (type === 'correct') {
            icon.innerText = "Correto";
            icon.style.color = "green";
        } else if (type === 'wrong') {
            icon.innerText = "Incorreto";
            icon.style.color = "red";
        }
    
        feedbackIcons.appendChild(icon);
        feedbackIcons.classList.remove("hide");
    
        setTimeout(() => {
            feedbackIcons.classList.add("hide");
        }, 2000);
    }

    function disableAnswerButtons() {
        const buttons = answerButtons.getElementsByTagName('button');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.add('disabled');
        }
    }

    function updateScore() {
        scoreElement.innerText = score;
    }

    function startTimer() {
        timerElement.innerText = timer;
        timerBar.style.width = '100%';
        intervalId = setInterval(() => {
            timer--;
            if (timer >= 0) {
                timerElement.innerText = timer;
                timerBar.style.width = `${(timer / 30) * 100}%`;
                if (timer <= 10) {
                    timerBar.style.backgroundColor = 'red';
                    timerElement.style.color = 'red';
                    // Adicionar animação de alerta
                    timerElement.classList.add('alert-animation');
                }
            }
            if (timer === 0) {
                clearInterval(intervalId);
                nextQuestion(); // Avança para a próxima pergunta quando o tempo acaba
            }
        }, 1000);
    }

    function nextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < QUESTIONS.length) {
            showQuestion(QUESTIONS[currentQuestionIndex]);
            enableAnswerButtons();
            timer = 30;
            timerBar.style.backgroundColor = '#007bff'; // Reset timer bar color
            timerElement.style.color = '#000'; // Reset timer text color
            startTimer();
        } else {
            showGameOver();
        }
    }

   // Função para mostrar o resultado final do jogo
   function showGameOver() {
    clearInterval(intervalId);
    questionContainer.classList.add("hide");
    scoreElement.parentNode.classList.add("hide");
    timerElement.parentNode.classList.add("hide");
    nextButton.classList.add("hide");
    gameOverContainer.classList.remove("hide");
    finalScoreValue.innerText = score;

    if (score === 0) {
        trophyContainer.classList.remove("hide");
        trophyImage.src = "zero-score-trophy.png"; 
        trophyImage.style.width = "600px";
        trophyMessage.innerText = "Não respondeste corretamente a nenhuma pergunta. Deves estudar!";
        trophyMessage.style.color = "red"; // Define a cor do texto como vermelho
        playZeroScoreSound(); // Reproduzir som de pontuação zero
    } else if (score >= 80) {
        trophyContainer.classList.remove("hide");
        trophyImage.src = "trophy-expert.png";
        trophyImage.style.width = "600px";
        trophyMessage.innerText = "Parabéns! O Professor Jaime está muito orgulhoso de ti!";
        playApplauseSound();
    } else if (score >= 50) {
        trophyContainer.classList.remove("hide");
        trophyImage.src = "trophy-intermediate.png";
        trophyImage.style.width = "600px";
        trophyMessage.innerText = "Bom trabalho! Continua a estudar para melhorar.";
        playCheersSound();
    } else {
        trophyContainer.classList.remove("hide");
        trophyImage.src = "trophy-beginner.png";
        trophyImage.style.width = "600px";
        trophyMessage.innerText = "Continua a estudar! Podes fazer melhor.";
        // Não definir a cor do texto aqui para que permaneça a preto por padrão
        playEncouragementSound();
    }

    stopBackgroundMusic();
    showStatistics();
}

function restartGame() {
    // Parar a reprodução de todos os sons que podem estar em execução
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    applauseSound.pause();
    cheersSound.pause();
    encouragementSound.pause();

    // Restaurar o jogo para o estado inicial
    gameOverContainer.classList.add("hide");
    totalScoreElement.parentNode.classList.remove("hide");
    correctAnswersElement.parentNode.classList.remove("hide");
    startGame();
}

// Função para reproduzir o som de pontuação zero
function playZeroScoreSound() {
    const zeroScoreSound = new Audio("zero-score.mp3");
    zeroScoreSound.play();
}

    function showStatistics() {
        totalScoreElement.innerText = score;
        correctAnswersElement.innerText = score / 10;
        totalScoreElement.parentNode.classList.remove("hide");
        correctAnswersElement.parentNode.classList.remove("hide");
    }

    function enableAnswerButtons() {
        const buttons = answerButtons.getElementsByTagName('button');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('disabled');
            buttons[i].classList.remove('correct-answer');
            buttons[i].classList.remove('wrong-answer');
        }
    }

    function playBackgroundMusic() {
        backgroundMusic.play();
    }

    function stopBackgroundMusic() {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }

    function playApplauseSound() {
        applauseSound.play();
    }

    function playCheersSound() {
        cheersSound.play();
    }

    function playEncouragementSound() {
        encouragementSound.play();
    }
});
