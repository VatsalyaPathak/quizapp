import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [quizData, setQuizData] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [quizResult, setQuizResult] = useState(null); // State for storing quiz result
  const [isSubmitted, setIsSubmitted] = useState(false); // State to track if quiz is submitted

  // User inputs for category, number of questions, and title
  const [category, setCategory] = useState('');
  const [numsQ, setNumsQ] = useState(5);
  const [title, setTitle] = useState('');

  // Function to fetch the quiz data based on user input
  const fetchQuizData = () => {
    axios.post(`http://localhost:8081/quizapp/quiz/create?category=${category}&numsQ=${numsQ}&title=${title}`)
      .then((response) => {
        setQuizData(response.data);
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error("There was an error fetching the quiz!", error);
      });
  };

  // Handle answer change
  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers({
      ...answers,
      [questionId]: selectedOption,
    });
  };

  // Handle form submission for quiz answers
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Transform answers object to an array of { id, response } objects
    const formattedAnswers = Object.keys(answers).map((questionId) => ({
      id: questionId,
      response: answers[questionId],
    }));

    console.log('User answers:', formattedAnswers);
    
    // Send the formatted answers as a POST request
    axios.post(`http://localhost:8081/quizapp/quiz/submit/${quizData.id}`, formattedAnswers)
      .then((response) => {
        console.log('Quiz submitted successfully:', response.data);
        setQuizResult(response.data); // Set the result after successful submission
        setIsSubmitted(true); // Mark the quiz as submitted
      })
      .catch((error) => {
        console.error('There was an error submitting the quiz!', error);
      });
  };
 
  // Handle form submission for quiz configuration
  const handleQuizConfigSubmit = (e) => {
    e.preventDefault();
    fetchQuizData();  // Fetch the quiz data when the user submits the quiz configuration form
    setIsSubmitted(false);
    setQuizResult(null);
    setAnswers({});

  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Quiz Setup</h1>

        {/* Form to capture quiz category, number of questions, and title */}
        <form onSubmit={handleQuizConfigSubmit}>
          <div>
            <label>
              Category:
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Number of Questions:
              <input
                type="number"
                value={numsQ}
                onChange={(e) => setNumsQ(e.target.value)}
                required
                min="1"
              />
            </label>
          </div>
          <div>
            <label>
              Quiz Title:
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
          </div>
          <button type="submit">Generate Quiz</button>
        </form>

        {isLoaded && (
          <div>
            <h1>{title}</h1>
            <form onSubmit={handleSubmit}>
              {quizData.questions.map((question) => (
                <div key={question.id} className="quiz-question">
                  <p>{question.questionTitle}</p>

                  <label>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={question.option1}
                      onChange={() => handleAnswerChange(question.id, question.option1)}
                      disabled={isSubmitted} // Disable if submitted
                    />
                    {question.option1}
                  </label>

                  <label>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={question.option2}
                      onChange={() => handleAnswerChange(question.id, question.option2)}
                      disabled={isSubmitted} // Disable if submitted
                    />
                    {question.option2}
                  </label>

                  <label>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={question.option3}
                      onChange={() => handleAnswerChange(question.id, question.option3)}
                      disabled={isSubmitted} // Disable if submitted
                    />
                    {question.option3}
                  </label>

                  <label>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={question.option4}
                      onChange={() => handleAnswerChange(question.id, question.option4)}
                      disabled={isSubmitted} // Disable if submitted
                    />
                    {question.option4}
                  </label>
                </div>
              ))}
              <button type="submit" disabled={isSubmitted}>Submit Quiz</button>
            </form>
          </div>
        )}

        {/* Conditionally render the quiz result once it's available */}
        {quizResult !== null && (
          <div className="quiz-result">
            <h2>Quiz Result</h2>
            <p>Your score is: {quizResult} / {quizData.questions.length}</p>
          </div>
        )}

        {/* Display message if quiz is submitted */}
        {isSubmitted && <p>The quiz has been submitted. You cannot modify your answers anymore.</p>}
      </header>
    </div>
  );
}

export default App;
