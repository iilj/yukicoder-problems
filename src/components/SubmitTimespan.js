import React from "react";

const formatTimespan = (sec) => {
  let sign;
  if (sec >= 0) {
    sign = "";
  } else {
    sign = "-";
    sec *= -1;
  }
  if (sec < 3600)
    return `${sign}${Math.floor(sec / 60)}:${("0" + (sec % 60)).slice(-2)}`;
  else
    return `${sign}${Math.floor(sec / 3600)}:${("0" + Math.floor((sec % 3600) / 60)).slice(-2)}:${("0" + (sec % 60)).slice(-2)}`;
};

export const SubmitTimespan = props => {
  const {
    contest,
    solvedProblem,
    showContestResult
  } = props;
  if (!showContestResult) {
    return null;
  }

  return (
    <div className="table-problem-timespan">
      {!solvedProblem || Date.parse(solvedProblem.Date) > Date.parse(contest.EndDate)
        ? ""
        : formatTimespan((Date.parse(solvedProblem.Date) - Date.parse(contest.Date)) / 1000)
      }
    </div>
  );
};
