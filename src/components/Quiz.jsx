import { useState, useEffect } from "react";
import styled from "styled-components";
import ProgressCircle from "./ProgressCircle"; // Import ProgressCircle

const QuizContainer = styled.div`
  max-width: 600px;
  margin: auto;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Question = styled.h2`
  margin-bottom: 15px;
`;

const Option = styled.button`
  display: block;
  width: 100%;
  background: ${(props) => (props.selected ? "#007bff" : "#f4f4f4")};
  color: ${(props) => (props.selected ? "white" : "black")};
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  border: none;

  &:hover {
    background: ${(props) => (props.selected ? "#0056b3" : "#ddd")};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const Button = styled.button`
  background: ${(props) => (props.disabled ? "#ccc" : "#28a745")};
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  border-radius: 5px;

  &:hover {
    background: ${(props) => (props.disabled ? "#ccc" : "#218838")};
  }
`;

const SkipButton = styled(Button)`
  background: #ffc107;
  &:hover {
    background: #e0a800;
  }
`;

const RestartButton = styled(Button)`
  background: #dc3545;
  margin-top: 10px;
  &:hover {
    background: #c82333;
  }
`;

const Quiz = ({ onFinish }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/Uw5CrX");
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        setQuestions(data.questions || []);
      } catch (err) {
        setError(`Failed to fetch quiz data. ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading questions...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleOptionSelect = (optionId) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [currentIndex]: prev[currentIndex] === optionId ? null : optionId,
    }));
  };

  const handleSkip = () => {
    setSelectedOptions((prev) => ({
      ...prev,
      [currentIndex]: null,
    }));
    handleNext();
  };

  const handleNext = () => {
    if (selectedOptions[currentIndex] !== undefined) {
      const isCorrect = selectedOptions[currentIndex] === questions[currentIndex]?.correctOption;
      setScore((prev) => prev + (isCorrect ? 1 : -0.25));
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFinish = () => {
    setQuizFinished(true);
    onFinish(score);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOptions({});
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <QuizContainer>
      {!quizFinished ? (
        <>
          <Question>{questions[currentIndex]?.description}</Question>
          {questions[currentIndex]?.options.map((opt, index) => (
            <Option
              key={index}
              selected={selectedOptions[currentIndex] === opt.id}
              onClick={() => handleOptionSelect(opt.id)}
            >
              {opt.description}
            </Option>
          ))}
          <ButtonContainer>
            <Button onClick={handlePrevious} disabled={currentIndex === 0}>
              Previous
            </Button>
            <SkipButton onClick={handleSkip}>Skip</SkipButton>
            <Button 
              onClick={currentIndex + 1 === questions.length ? handleFinish : handleNext} 
              disabled={selectedOptions[currentIndex] === undefined}
            >
              {currentIndex + 1 === questions.length ? "Finish" : "Next"}
            </Button>
          </ButtonContainer>
        </>
      ) : (
        <>
          <h2>🎉 Quiz Completed! 🎉</h2>
          <p>Your Score: {score} / {questions.length}</p>
          
          {/* Add ProgressCircle Here */}
          <ProgressCircle score={score} total={questions.length} />

          <RestartButton onClick={handleRestart}>Restart Quiz</RestartButton>
        </>
      )}
    </QuizContainer>
  );
};

export default Quiz;
