import React from "react";

export const ContestLink = (props) => {
  const {
    contestId,
    contestName
  } = props;
  return (
    <a
      href={`https://yukicoder.me/contests/${contestId}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {contestName}
    </a>
  );
};