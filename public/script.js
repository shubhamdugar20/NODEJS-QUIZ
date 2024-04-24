document.addEventListener("DOMContentLoaded", () => {
  const questionContainer = document.getElementById("question");
  const choicesContainer = document.getElementById("choices");
  const feedbackContainer = document.getElementById("feedback");
  const submitButton = document.getElementById("submit-btn");
  const nextButton = document.getElementById("next-btn");
  const scoreContainer = document.getElementById("score-container");
  const restartButton = document.getElementById("restart-btn");

  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;

  // Fetch 10 random questions from the server
  fetchQuestions();

  function fetchQuestions() {
    fetch("/api/questions")
      .then(response => response.json())
      .then(data => {
        // Shuffle the array of questions
        shuffleArray(data);
        // Select the first 10 questions
        questions = data.slice(0, 10);
        displayQuestion();
      })
      .catch(error => console.error("Error fetching questions:", error));
  }

  function displayQuestion() {
    const question = questions[currentQuestionIndex];
    questionContainer.textContent = question.question;
    choicesContainer.innerHTML = "";
    question.choices.forEach(choice => {
      const choiceElement = document.createElement("div");
      choiceElement.textContent = choice;
      choiceElement.classList.add("choice");
      choiceElement.addEventListener("click", () => checkAnswer(choice));
      choicesContainer.appendChild(choiceElement);
    });
    submitButton.disabled = false;
    feedbackContainer.textContent = "";
    nextButton.style.display = "none";
  }

  function checkAnswer(selectedAnswer) {
    const question = questions[currentQuestionIndex];
    if (selectedAnswer === question.correctAnswer) {
      feedbackContainer.textContent = "Correct!";
      score++;
    } else {
      feedbackContainer.textContent = `Incorrect. Correct answer: ${question.correctAnswer}`;
    }
    submitButton.disabled = true;
    nextButton.style.display = "block";
  }

  submitButton.addEventListener("click", () => {
    submitButton.disabled = true;
    const selectedAnswer = choicesContainer.querySelector(".choice.selected").textContent;
    checkAnswer(selectedAnswer);
    if (currentQuestionIndex === questions.length - 1) {
      showFinalScore();
    }
  });

  nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      displayQuestion();
    } else {
      showFinalScore();
    }
  });

  function showFinalScore() {
    scoreContainer.textContent = `Your final score: ${score} out of ${questions.length}`;
    scoreContainer.style.display = "block";
    questionContainer.textContent = "";
    choicesContainer.textContent = "";
    feedbackContainer.textContent = "";
    submitButton.style.display = "none";
    nextButton.style.display = "none";
    restartButton.style.display = "block";
  }

  restartButton.addEventListener("click", () => {
    currentQuestionIndex = 0;
    score = 0;
    shuffleArray(questions);
    questions = questions.slice(0, 10);
    scoreContainer.style.display = "none";
    restartButton.style.display = "none";
    fetchQuestions();
  });

  // Function to shuffle an array using the Fisher-Yates algorithm
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
});
