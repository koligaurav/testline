import { useState, useEffect } from "react";
import GlobalStyles from "./components/styles/GlobalStyles";
import Quiz from "./components/Quiz";
import ProgressCircle from "./components/ProgressCircle";
import { FaClock } from "react-icons/fa";

import "./App.css";

function App() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes

  useEffect(() => {
    if (!quizStarted || quizCompleted) return; // Stop timer if quiz is not started or already completed

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleQuizFinish(finalScore); // Auto-finish quiz when timer hits 0
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted, finalScore]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  };

  const handleQuizFinish = (score) => {
    setFinalScore(score);
    setQuizCompleted(true);
  };

  const handleRestart = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setFinalScore(0);
    setTimeLeft(15 * 60); // Reset timer to 15 min
  };

  return (
    <>
      <GlobalStyles />
      {!quizStarted ? (
        <div className="test-container">
          <h1>TestLine Application</h1>
          <h3>🔴 Live Test</h3>
          <p>Duration: 15 min</p>
          <p>Subject: Biology</p>
          <p>Topic: Genetics, DNA, Physiology</p>
          <div className="timer">
            <FaClock /> {formatTime(timeLeft)}
          </div>
          <button className="test-button" onClick={() => setQuizStarted(true)}>Start Test</button>
        </div>
      ) : quizCompleted ? (
        <div className="result-container">
          <h2>Your Score: {finalScore}</h2>
          <ProgressCircle score={finalScore} total={10} />
          <button className="test-button" onClick={handleRestart}>Restart Test</button>
        </div>
      ) : (
        <Quiz onFinish={handleQuizFinish} />
      )}
    </>
  );
}

export default App;