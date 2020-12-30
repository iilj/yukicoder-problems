import React from 'react';
import { formatContestUrl } from '../utils/Url';
import { ContestId } from '../interfaces/Contest';
import { NewTabLink } from './NewTabLink';

interface Props {
  contestId: ContestId;
  contestName: string;
  rawContestName?: string;
}

export const ContestLink: React.FC<Props> = (props) => {
  const { contestId, contestName, rawContestName } = props;
  return contestId >= 0 ? (
    <NewTabLink
      href={formatContestUrl(contestId)}
      title={rawContestName ?? contestName}
    >
      {contestName}
    </NewTabLink>
  ) : (
    <span>{contestName}</span>
  );
};
