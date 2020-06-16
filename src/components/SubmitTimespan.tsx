import React from 'react';
import { Contest } from '../interfaces/Contest';
import { Problem } from '../interfaces/Problem';

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
  contest: Contest;
  solvedProblem?: Problem;
  showContestResult: boolean;
}

export const SubmitTimespan: React.FC<Props> = (props) => {
  const { contest, solvedProblem, showContestResult } = props;
  if (!showContestResult) {
    return <></>;
  }

  return (
    <div className="table-problem-timespan">
      {!solvedProblem ||
      Date.parse(solvedProblem.Date as string) > Date.parse(contest.EndDate)
        ? ''
        : formatTimespan(
            (Date.parse(solvedProblem.Date as string) -
              Date.parse(contest.Date)) /
              1000
          )}
    </div>
  );
};
