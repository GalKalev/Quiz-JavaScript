const startButton = document.querySelector('.js-start-button');
const quizScreenn = document.querySelector('.quiz-container');
const startingScreen = document.querySelector('.starting-screen-container');
const submitButton = document.querySelector('.js-submit-answer-button');
const outOfQuestionsScreenn = document.querySelector('.js-out-of-questions-model');
const retryButtonQ = document.querySelector('.js-retry-button-questions');
const retryButtonT = document.querySelector('.js-retry-button-time');
const outOfTimeScreen = document.querySelector('.js-out-of-time-model');

const questionsArray = [{
    title: 'Which planet has the most moons?',
    worngAnswers:['Mars', 'Jupiter', 'Pluto', 'Earth'],
    correctAnswer: 'Saturn',
    answersArray: []
    
}, {
    title: 'What color is Sonic the Hedgehog?',
    worngAnswers:['Red', 'Green', 'Orange', 'Brown'],
    correctAnswer:'Blue',
    answersArray: []
},{
    title: 'How many bones do we have in one ear?',
    worngAnswers:['5', '2', '9', '0'],
    correctAnswer:'3',
    answersArray: [] 
}];

let quizHTML = '';

let answeredQuestions = [];

let answeredCorrectlyCounter = 0;

let setTimerInterval;

let timer =  5;

let questionFunc;

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

function checkAnswer(answer, question){
    if(answer === null){
        return;
    }
    if(answer === question.correctAnswer){
        answeredCorrectlyCounter++;
    }
}

function submitAnswer(question){
    let selectedAnswer = document.querySelector('input[name="options"]:checked').parentElement.children[1].innerHTML;
    checkAnswer(selectedAnswer,question);
    quiz();
    
}

function updateTimer(){
    if(timer >= 0){
        document.querySelector('.js-timer').innerHTML = timer;
        timer--;
    } else{
        quizScreenn.style.display = 'none';
        outOfTimeScreen.style.display = 'flex';
        outOfTimeScreen.style.flexDirection = 'column';
        document.querySelector('.js-answered-correctly-time').innerText = ` ${answeredCorrectlyCounter}`;
    }
    
}

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

function resetKeydown(keydown){
    keydown = false;
}

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

    timer = 5;
    document.querySelector('.js-timer').innerHTML = 60;

    quiz();
}

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

    if(!setTimerInterval){
        setTimerInterval =  setInterval(updateTimer,1000);
    } else{
        clearInterval(setTimerInterval);
        setTimerInterval =  setInterval(updateTimer,1000);
    }

    if(question === undefined){
        quizScreenn.style.display = 'none';
        outOfQuestionsScreenn.style.display = 'flex';
        outOfQuestionsScreenn.style.flexDirection = 'column';
        document.querySelector('.js-answered-correctly-questions').innerText = ` ${answeredCorrectlyCounter}`;

        clearInterval(setTimerInterval);
 
        // if(localStorage){
        //     localStorage.setItem('highScore', answeredCorrectlyCounter);
        // }
        // console.log(answeredCorrectlyCounter);
    }
}


function startQuiz(){
    // quizScreenn.style.dispaly = 'dsf';
    quizScreenn.style.display = 'flex';
    startingScreen.style.display = 'none';
    setAnswersArray();
    quiz();

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



