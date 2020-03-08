import React from 'react';
import { formatContestUrl } from '../utils/Url';

export const ContestLink = (props) => {
  const { contestId, contestName } = props;
  return (
    <a href={formatContestUrl(contestId)} target="_blank" rel="noopener noreferrer">
      {contestName}
    </a>
  );
};
