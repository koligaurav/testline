import styled from "styled-components";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ProgressContainer = styled.div`
  text-align: center;
  margin-top: 20px;
  width: 150px;
  margin: auto;
`;

const ScoreText = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
`;

function ProgressCircle({ score, total }) {
  const percentage = (score / total) * 100;

  return (
    <ProgressContainer>
      <CircularProgressbar
        value={percentage}
        text={`${score} / ${total}`}
        styles={buildStyles({
          textSize: "16px",
          pathColor: percentage >= 70 ? "#28a745" : percentage >= 40 ? "#ffc107" : "#dc3545",
          textColor: "#000",
          trailColor: "#f4f4f4",
          backgroundColor: "#fff",
        })}
      />
      <ScoreText>Quiz Score</ScoreText>
    </ProgressContainer>
  );
}

export default ProgressCircle;
