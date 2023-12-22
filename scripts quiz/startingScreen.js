const startButton = document.querySelector('.js-start-button');

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
}];

let answeredQuestions = [];

let answeredCorrectlyCounter = 0;

// function settingAnswers(question){

    

// }

let activateQuizHTML = '';


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
    console.log(`answer: ${answer}`);
    console.log(`correct answer:${question.correctAnswer}`);
    if(answer.value === question.correctAnswer){
        console.log('correct');
        answeredCorrectlyCounter++;

    } else{
        console.log('wrong');
    }

}


function quizScreen(){
    let question = setQuestion();

    if(question){
        activateQuizHTML = `
        <div class="quiz-container">
            

        <div class="question-container">
            <p class="question-title">
                ${question.title}
            </p>

            <div class="question-options-container">

                <div class="question-options">

                    <div class="left-section">

                        <label>
                            <input type="radio" class="radio-option js-radio-option" name="options" value="${question.answersArray[0]}">1. ${question.answersArray[0]}
                        </label>
        
                        <label>
                            <input type="radio" class="radio-option js-radio-option" name="options" value="${question.answersArray[1]}">2. ${question.answersArray[1]}
                        </label>

                    </div>

                    <div class="right-section">

                        <label>
                            <input type="radio" class="radio-option js-radio-option" name="options" value="${question.answersArray[2]}">3.  ${question.answersArray[2]}
                        </label>
        
                        <label>
                            <input type="radio" class="radio-option js-radio-option" name="options" value="${question.answersArray[3]}">4.  ${question.answersArray[3]}

                    </div>
                
                </div>

                <button class="submit-answer-button js-submit-answer-button"> SUBMIT</button>

            </div>

        </div>
    
        <div class="timer-container">

            <div class="timer">
                1:00
            </div>

        </div>

    </div>
        `
    
    // console.log(selected);
    document.body.innerHTML = activateQuizHTML;
    const submitButton = document.querySelector('.js-submit-answer-button');
    submitButton.addEventListener('click', () => {
        let selected = document.querySelector('input[name="options"]:checked');
        // console.log(selected);
        // console.log(question.correctAnswer);
        checkAnswer(selected,question);
        quizScreen();

    });

    }else{
        document.body.innerHTML = `
        ${answeredCorrectlyCounter}
        game over
        `
    }

}
startButton.addEventListener('click',quizScreen);




