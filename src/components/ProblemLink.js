import React from "react";
import { getDifficultyLevelColorClass } from "../utils"

export const ProblemLink = (props) => {
  const {
    problemNo,
    problemTitle,
    level,
    showDifficultyLevel
  } = props;
  return (
    <a
      href={`https://yukicoder.me/problems/no/${problemNo}`}
      target="_blank"
      rel="noopener noreferrer"
      className={showDifficultyLevel ? getDifficultyLevelColorClass(level) : ""}
    >
      {problemTitle}
    </a>
  );
};