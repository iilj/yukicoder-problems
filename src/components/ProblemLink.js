import React from 'react';
import { formatProblemUrl } from '../utils/Url';
import { getDifficultyLevelColorClass } from '../utils';

export const ProblemLink = (props) => {
  const {
    problemNo, problemTitle, level, showDifficultyLevel,
  } = props;
  return (
    <a
      href={formatProblemUrl(problemNo)}
      target="_blank"
      rel="noopener noreferrer"
      className={showDifficultyLevel ? getDifficultyLevelColorClass(level) : ''}
      title={problemTitle}
    >
      {problemTitle}
    </a>
  );
};
