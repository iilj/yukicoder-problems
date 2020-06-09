import React from 'react';
import { formatContestUrl } from '../utils/Url';
import { ContestId } from '../interfaces/Contest';

export const ContestLink = (props: {
  contestId: ContestId;
  contestName: string;
  rawContestName?: string;
}) => {
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
