const quizContainerEl = document.querySelector(".quiz-container");

const questionCountEl = document.querySelector(".quiz-info > span");

const quizQuestionEl = document.querySelector(".quiz-question");

const quizAnswersEl = document.querySelector(".quiz-answers");

const quizSubmitBtn = document.querySelector(".quiz-submit-btn");

const quizBulletsEl = document.querySelector(".quiz-bullets");

const quizCounterEl = document.querySelector(".quiz-counter");

let questionCount = 0;

let rightAnswers = 0;

let countDownInterval;

function getQuestions(url) {

    return new Promise((resolve, reject) => {

        const request = new XMLHttpRequest();

        request.open("GET", url);

        request.onload = function () {

            if (request.readyState === 4 && request.status === 200) {

                resolve(request.responseText);

            } else {

                reject(new Error(`Error With Status ${request.status}`));

            }

        }

        request.send();

    });

}

getQuestions("/js/html_questions.json")

.then(response => JSON.parse(response))

.then(questions => {

    const questionsLength = questions.length;

    addQuesionData(questions[questionCount]);

    checkAnswer(questions[questionCount]["right_answer"]);

    generateBullets(questionsLength);

    countDown(10, questionsLength);

    quizSubmitBtn.addEventListener("click", () => {

        questionCount++;

        if (questionCount < questionsLength) {

            addQuesionData(questions[questionCount]);

            checkAnswer(questions[questionCount]["right_answer"]);
            
            quizBulletsEl.querySelectorAll("li")[questionCount].style.backgroundColor = "#0071FF";

        } else {

            generateResult(questionsLength);

        }

        clearInterval(countDownInterval);

        countDown(10, questionsLength);

    });

}).catch(error => console.log(error));

function addQuesionData(question) {

    questionCountEl.textContent = questionCount + 1;

    quizQuestionEl.textContent = question["title"];

    quizAnswersEl.innerHTML = "";

    for (let i = 1; i <= 4; i++) {

        const quizAnswerEl = document.createElement("div");

        quizAnswerEl.className = "quiz-answer";

        const inputEl = document.createElement("input");

        inputEl.type = "radio";

        inputEl.name = "answer";

        inputEl.id = `answer_${i}`;

        inputEl.dataset.answer = question[`answer_${i}`];

        if (i === 1) inputEl.checked = true;

        quizAnswerEl.appendChild(inputEl);

        const labelEl = document.createElement("label");

        labelEl.htmlFor = `answer_${i}`;

        labelEl.textContent = question[`answer_${i}`];

        quizAnswerEl.appendChild(labelEl);

        quizAnswersEl.appendChild(quizAnswerEl);

    }

}

function checkAnswer(rightAnswer) {

    const inputsEl = document.querySelectorAll("input[name=\"answer\"]")

    inputsEl.forEach(inputEl => {

        inputEl.addEventListener("change", function () {

            if (this.checked && (this.dataset.answer === rightAnswer)) {

                rightAnswers++;

            }

        });

    });

}

function generateBullets(questionsLength) {

    for (let i = 0; i < questionsLength; i++) {

        const quizBulletEl = document.createElement("li");

        if (i === 0) quizBulletEl.style.backgroundColor = "#0071FF";

        quizBulletsEl.appendChild(quizBulletEl);

    }

}

function generateResult(questionsLength) {

    const quizInfoEl = document.querySelectorAll(".quiz-info")[1];

    quizQuestionEl.remove();

    quizAnswersEl.remove();

    quizSubmitBtn.remove();

    document.querySelector(".quiz-footer").remove();

    quizInfoEl.textContent = `${
        
        rightAnswers <= Math.ceil(questionsLength / 2) ? "Bad" : "Good"
        
    } : ${rightAnswers} From ${questionsLength}`;

}

function countDown(duration, questionsLength) {

    if (questionCount < questionsLength) {

        let minutes, seconds;

        countDownInterval = window.setInterval(() => {

            minutes = parseInt(duration / 60);
            
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;

            seconds = seconds < 10 ? `0${seconds}` : seconds;

            quizCounterEl.innerHTML = `${minutes}:${seconds}`;

            if (duration-- <= 0) {

                clearInterval(countDownInterval);

                quizSubmitBtn.click();

            }

        }, 1000);

    }

}
