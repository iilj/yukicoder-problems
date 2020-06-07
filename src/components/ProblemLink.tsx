import React from 'react';
import { formatProblemUrl } from '../utils/Url';
import { getDifficultyLevelColorClass } from '../utils';
import { ProblemNo, ProblemLevel } from '../interfaces/Problem';

export const ProblemLink = (props: {
  problemNo: ProblemNo;
  problemTitle: string;
  level: ProblemLevel;
  showDifficultyLevel: boolean;
}) => {
  const {
    problemNo, problemTitle, level, showDifficultyLevel,
  } = props;
  return (
    <a
      href={formatProblemUrl(problemNo)}
      target="_blank" // eslint-disable-line react/jsx-no-target-blank
      rel="noopener"
      className={showDifficultyLevel ? getDifficultyLevelColorClass(level) : ''}
      title={problemTitle}
    >
      {problemTitle}
    </a>
  );
};
