import {questionsArray} from './questionsArray.js';

const startButton = document.querySelector('.js-start-button');
const quizScreenn = document.querySelector('.quiz-container');
const startingScreen = document.querySelector('.starting-screen-container');
const submitButton = document.querySelector('.js-submit-answer-button');
const outOfQuestionsScreenn = document.querySelector('.js-out-of-questions-model');
const retryButtonQ = document.querySelector('.js-retry-button-questions');
const retryButtonT = document.querySelector('.js-retry-button-time');
const outOfTimeScreen = document.querySelector('.js-out-of-time-model');
const timerSettings = document.querySelector('.js-timer');


let quizHTML = '';

let answeredQuestions = [];

let answeredCorrectlyCounter = 0;

let setTimerInterval;

let timer = 29;

let questionFunc;

let highScore = JSON.parse(localStorage.getItem('highScore'));

// this function randomize the order of the possible answers and making sure the correct answer
// is always an option
function setAnswersArray(){
    questionsArray.forEach(question => {
        question.answersArray = Array.from({ length: 4 }, () => '');
    
        let numbersArray = [0, 1, 2, 3];
    
        for (let i = 0; i < 3; i++) {
            let randomIndex = Math.floor(Math.random() * numbersArray.length);
            let selectedNumber = numbersArray[randomIndex];
            numbersArray.splice(randomIndex, 1);
    
            question.answersArray[selectedNumber] = question.worngAnswers[i];
        }
    
        for (let i = 0; i < 4; i++) {
            if (question.answersArray[i] === '') {
                question.answersArray[i] = question.correctAnswer;
                break;
            }
        }
    
    });
    
}

// this function randomize the order of questions 
function setQuestion() {
    let question;
    if(questionsArray.length === answeredQuestions.length){
      
        return;
    }
  
    do {
      question = questionsArray[Math.floor(Math.random() * questionsArray.length)];
    } while (answeredQuestions.includes(question.title));
  
    answeredQuestions.push(question.title);
  
    return question;
}

// this function checking the player's answer to to see if it's correct
// and changing the player's correct answered score accordingly
function checkAnswer(answer, question){
    if(answer === null){
        return;
    }
    if(answer === question.correctAnswer){
        answeredCorrectlyCounter++;
    }
    console.log('checkAnswer');
}

// after the player pressed their answer, this function sending their answer to be 
// checked and unchecking the answer
function submitAnswer(question){
    let selectedAnswer = document.querySelector('input[name="options"]:checked').parentElement.children[1].innerHTML;
    checkAnswer(selectedAnswer,question);
    document.querySelector('input[name="options"]:checked').checked = false;
    console.log('submitAnswer');
    quiz();
    
}


// this function update the timer every second to go down by one.
// when there are only 5 seconds left, the timer's set to red, bold and 
// bigger in size.
// when the timer hit zero, the 'out of time' screen appears and the quiz screen is hidden
function updateTimer(){
    if(timer >= 0){
        timerSettings.innerHTML = timer;
        timer--;
        
        if(timer <= 4){
            timerSettings.style.color = 'red';
            timerSettings.style.fontSize = '100px';
            timerSettings.style.fontWeight = 'bold';
        }
    } else{
        quizScreenn.style.display = 'none';
        outOfTimeScreen.style.display = 'flex';
        outOfTimeScreen.style.flexDirection = 'column';

        setHighScore(answeredCorrectlyCounter);


        document.querySelector('.js-answered-correctly-time').innerText = ` ${answeredCorrectlyCounter}`;
    }
    
}

// the answers keyboard inputs, 'ENTER' to submit the answer,
// '1' for option one, '2' for option two, '3' for option three and
// '4' for option four
function keyboardInputs(event,keydown,question){
    if(keydown){
        return;
    }
    keydown = true;

    switch (event.key){
        case 'Enter':
            submitAnswer(question);
            event.stopImmediatePropagation();
            break;
        case '1':  
        case '2':
        case '3':   
        case '4':
            const option = document.querySelector(`#input${event.key}`);
            option.checked = true;
            break;

    }
}

// to resent the pushed key
function resetKeydown(keydown){
    keydown = false;
}

// this function is when the RETRY buttons is pushed; that appears 
// when the time/questions are out.
// reappears the quiz screen and hide the 'out of time'/
// 'out of questions' screen adn reset the timer
function retryButtonFunc(){
    quizScreenn.style.display = 'flex';
    outOfQuestionsScreenn.style.display = 'none';
    outOfTimeScreen.style.display = 'none';
    
    answeredCorrectlyCounter = 0;
    answeredQuestions = [];
    questionsArray.forEach(question => {
        question.answersArray = [];
    });
    setAnswersArray();

    timer = 29;
    timerSettings.style.color = 'black';
    timerSettings.style.fontSize = '80px';
    timerSettings.style.fontWeight = 'normal';

    quiz();
}

// setting the hifh score in local storage and chenging it if 
// the high score is broken
function setHighScore(score){
    if(highScore === null || score > parseInt(highScore)){
        localStorage.setItem('highScore', JSON.stringify(score));
    }

}


// this function get a question and it's answers
// and if there are no more questions the 'out of questions'
// screen appears and the quiz screen hidden
function quiz(){
    let question = setQuestion();
    if(question){
        document.querySelector('.question-title').innerText = question.title;
        document.getElementById('js-1').innerText = question.answersArray[0];
        document.getElementById('js-2').innerText = question.answersArray[1];
        document.getElementById('js-3').innerText = question.answersArray[2];
        document.getElementById('js-4').innerText = question.answersArray[3];

        questionFunc = question;
    }


    if(question === undefined){
        quizScreenn.style.display = 'none';
        outOfQuestionsScreenn.style.display = 'flex';
        outOfQuestionsScreenn.style.flexDirection = 'column';
        document.querySelector('.js-answered-correctly-questions').innerText = ` ${answeredCorrectlyCounter}`;

        setHighScore(answeredCorrectlyCounter);

        clearInterval(setTimerInterval);

    }
}

// this function activate when the START button is preesed; activate the timer
// hidding the starting screen and showimg the quiz screen
function startQuiz(){
    quizScreenn.style.display = 'flex';
    startingScreen.style.display = 'none';
    setAnswersArray();
   
    quiz();
    if(!setTimerInterval){
        setTimerInterval =  setInterval(updateTimer,1000);
    } else{
        clearInterval(setTimerInterval);
        setTimerInterval =  setInterval(updateTimer,1000);
    }

}

startButton.addEventListener('click',startQuiz);

submitButton.addEventListener('click',(event) => {
    event.stopImmediatePropagation();
    submitAnswer(questionFunc);
});


let isKeyDown= false;
document.addEventListener('keyup',(event) =>{
    keyboardInputs(event,isKeyDown,questionFunc);
} );
document.addEventListener('keyup',() =>{
    resetKeydown(isKeyDown);
} );

retryButtonQ.addEventListener('click', retryButtonFunc);
retryButtonT.addEventListener('click', retryButtonFunc);

if(highScore){
    document.querySelector('.js-high-score').innerText = `
    ${highScore} correct question(s)!
`;
}



