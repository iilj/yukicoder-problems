import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getProblemTypeName } from '../utils';
import { ProblemType } from '../interfaces/Problem';

interface ProblemTypeIconProps {
  problemType: ProblemType;
}

export const ProblemTypeIcon = (props: ProblemTypeIconProps) => {
  const { problemType } = props;
  if (!problemType) return null;

  switch (problemType) {
    case ProblemType.Educational:
      return <FontAwesomeIcon title={getProblemTypeName(problemType)} icon="school" />;
    case ProblemType.Scoring:
      return <FontAwesomeIcon title={getProblemTypeName(problemType)} icon="calculator" />;
    case ProblemType.Joke:
      return <FontAwesomeIcon title={getProblemTypeName(problemType)} icon="laugh-beam" />;
    default:
      return null;
  }
};

export const ProblemTypeIconAbsoluteSpan = (props: ProblemTypeIconProps) => (
  <span className="table-problem-type-icon">
    <ProblemTypeIcon {...props} />
  </span>
);

export const ProblemTypeIconSpanWithName = (props: ProblemTypeIconProps) => (
  <span>
    <ProblemTypeIcon {...props} />
    {' '}
    {getProblemTypeName(props.problemType)}
  </span>
);
