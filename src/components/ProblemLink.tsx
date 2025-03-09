import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { formatProblemUrl } from '../utils/Url';
import { getDifficultyLevelColorClass } from '../utils';
import { getRatingColorClass } from '../utils/RatingColor';
import { ProblemNo, ProblemLevel } from '../interfaces/Problem';
import { Difficulty } from '../interfaces/Difficulty';
import { DifficultyCircle } from './DifficultyCircle';
import { NewTabLink } from './NewTabLink';
import { TexRenderer } from './TexRenderer';

export const ProblemLinkColorModes = ['None', 'Level', 'Difficulty'] as const;
export type ProblemLinkColorMode = typeof ProblemLinkColorModes[number];

interface Props {
  problemNo: ProblemNo;
  problemTitle: string;
  level: ProblemLevel;
  problemLinkColorMode: ProblemLinkColorMode;
  difficulty?: Difficulty;
  augmented?: boolean;
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
    augmented,
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
  const experimentalIconId = `experimental-${problemNo}-${id ?? 'dummy'}`;
  return (
    <>
      {showDifficultyCircle && (
        <DifficultyCircle id={id} difficulty={difficulty} />
      )}
      {showDifficultyCircle && augmented && (
        <>
          <span id={experimentalIconId} role="img" aria-label="experimental">
            🧪
          </span>
          <UncontrolledTooltip placement="top" target={experimentalIconId}>
            This estimate is experimental.
          </UncontrolledTooltip>
        </>
      )}
      <NewTabLink
        href={formatProblemUrl(problemNo)}
        className={className}
        title={problemTitle}
      >
        <TexRenderer text={problemTitle} />
      </NewTabLink>
    </>
  );
};
