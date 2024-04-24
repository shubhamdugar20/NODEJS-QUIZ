const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load quiz questions
const questionsData = require('./quiz-data/questions.json');

// Serve quiz questions
app.get('/api/questions', (req, res) => {
  res.json(questionsData.questions);
});

// Receive and evaluate user answers
app.post('/api/submit', (req, res) => {
  const userAnswers = req.body.answers;
  let score = 0;

  // Compare user answers with correct answers
  questionsData.questions.forEach((question, index) => {
    if (userAnswers[index] === question.correctAnswer) {
      score++;
    }
  });

  // Calculate percentage score
  const percentageScore = ((score / questionsData.questions.length) * 100).toFixed(2);

  res.json({ score, percentageScore });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
