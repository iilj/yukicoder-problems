import React from 'react';
import {
  MergedProblem,
  ProblemSolveStatus,
  ExtendedContest,
} from '../interfaces/MergedProblem';

const formatTimespan = (sec: number): string => {
  let sign: string;
  if (sec >= 0) {
    sign = '';
  } else {
    sign = '-';
    sec *= -1;
  }
  if (sec < 3600)
    return `${sign}${Math.floor(sec / 60)}:${`0${sec % 60}`.slice(-2)}`;
  return `${sign}${Math.floor(sec / 3600)}:${`0${Math.floor(
    (sec % 3600) / 60
  )}`.slice(-2)}:${`0${sec % 60}`.slice(-2)}`;
};

interface Props {
  mergedProblem: MergedProblem;
  showContestResult: boolean;
}

export const SubmitTimespan: React.FC<Props> = (props) => {
  const { mergedProblem, showContestResult } = props;
  if (!showContestResult) {
    return <></>;
  }

  return (
    <div className="table-problem-timespan">
      {mergedProblem.SolveStatus === ProblemSolveStatus.Trying ||
      mergedProblem.SolveStatus === ProblemSolveStatus.Solved
        ? ''
        : formatTimespan(
            ((mergedProblem.FirstSolveDateNum as number) -
              (mergedProblem.Contest as ExtendedContest).DateNum) /
              1000
          )}
    </div>
  );
};
