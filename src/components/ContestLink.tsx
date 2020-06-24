import React from 'react';
import { formatContestUrl } from '../utils/Url';
import { ContestId } from '../interfaces/Contest';

interface Props {
  contestId: ContestId;
  contestName: string;
  rawContestName?: string;
}

export const ContestLink: React.FC<Props> = (props) => {
  const { contestId, contestName, rawContestName } = props;
  return contestId >= 0 ? (
    <a
      href={formatContestUrl(contestId)}
      target="_blank" // eslint-disable-line react/jsx-no-target-blank
      rel="noopener"
      title={rawContestName ?? contestName}
    >
      {contestName}
    </a>
  ) : (
    <span>{contestName}</span>
  );
};
