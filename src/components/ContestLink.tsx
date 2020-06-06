import React from 'react';
import { formatContestUrl } from '../utils/Url';

export const ContestLink = (props) => {
  const { contestId, contestName, rawContestName } = props;
  return (
    <a
      href={formatContestUrl(contestId)}
      target="_blank" // eslint-disable-line react/jsx-no-target-blank
      rel="noopener"
      title={rawContestName ?? contestName}
    >
      {contestName}
    </a>
  );
};
