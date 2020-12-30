import React from 'react';
import { formatSubmissionUrl } from '../utils/Url';
import { SubmissionId } from '../interfaces/Problem';
import { NewTabLink } from './NewTabLink';

interface Props {
  submissionId: SubmissionId;
  submissionTitle: string;
  id?: string;
}

export const SubmissionLink: React.FC<Props> = (props) => {
  const { submissionId, submissionTitle, id } = props;
  return (
    <NewTabLink
      href={formatSubmissionUrl(submissionId)}
      title={submissionTitle}
      id={id}
    >
      {submissionTitle}
    </NewTabLink>
  );
};
