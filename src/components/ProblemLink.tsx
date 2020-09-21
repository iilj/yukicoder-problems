import React from 'react';
import { formatProblemUrl } from '../utils/Url';
import { getDifficultyLevelColorClass } from '../utils';
import { getRatingColorClass } from '../utils/RatingColor';
import { ProblemNo, ProblemLevel } from '../interfaces/Problem';
import { Difficulty } from '../interfaces/Difficulty';
import { DifficultyCircle } from './DifficultyCircle';

export const ProblemLinkColorModes = ['None', 'Level', 'Difficulty'] as const;
export type ProblemLinkColorMode = typeof ProblemLinkColorModes[number];

interface Props {
  problemNo: ProblemNo;
  problemTitle: string;
  level: ProblemLevel;
  problemLinkColorMode: ProblemLinkColorMode;
  difficulty?: Difficulty;
  id?: string;
  showDifficultyCircle?: boolean;
}

export const ProblemLink: React.FC<Props> = (props) => {
  const {
    problemNo,
    problemTitle,
    level,
    problemLinkColorMode,
    difficulty,
    id,
  } = props;
  const className =
    problemLinkColorMode === 'Level'
      ? getDifficultyLevelColorClass(level)
      : problemLinkColorMode === 'Difficulty' && difficulty !== undefined
      ? getRatingColorClass(difficulty)
      : '';
  const showDifficultyCircle =
    props.showDifficultyCircle !== undefined
      ? props.showDifficultyCircle
      : problemLinkColorMode === 'Difficulty';
  return (
    <>
      {showDifficultyCircle && (
        <DifficultyCircle id={id} difficulty={difficulty} />
      )}
      <a
        href={formatProblemUrl(problemNo)}
        target="_blank" // eslint-disable-line react/jsx-no-target-blank
        rel="noopener"
        className={className}
        title={problemTitle}
      >
        {problemTitle}
      </a>
    </>
  );
};
