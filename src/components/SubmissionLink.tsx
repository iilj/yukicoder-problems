import React from 'react';
import { formatSubmissionUrl } from '../utils/Url';
import { SubmissionId } from '../interfaces/Problem';

interface Props {
  submissionId: SubmissionId;
  submissionTitle: string;
  id?: string;
}

export const SubmissionLink: React.FC<Props> = (props) => {
  const { submissionId, submissionTitle, id } = props;
  return (
    <a
      href={formatSubmissionUrl(submissionId)}
      target="_blank" // eslint-disable-line react/jsx-no-target-blank
      rel="noopener"
      title={submissionTitle}
      id={id}
    >
      {submissionTitle}
    </a>
  );
};
