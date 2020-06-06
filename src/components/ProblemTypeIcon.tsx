import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getProblemTypeName } from '../utils';

export const ProblemTypeIcon = (props) => {
  const { problemType } = props;
  if (!problemType) return null;

  switch (problemType) {
    case 1:
      return <FontAwesomeIcon title={getProblemTypeName(problemType)} icon="school" />;
    case 2:
      return <FontAwesomeIcon title={getProblemTypeName(problemType)} icon="calculator" />;
    case 3:
      return <FontAwesomeIcon title={getProblemTypeName(problemType)} icon="laugh-beam" />;
    default:
      return null;
  }
};

export const ProblemTypeIconAbsoluteSpan = (props) => (
  <span className="table-problem-type-icon">
    <ProblemTypeIcon {...props} />
  </span>
);

export const ProblemTypeIconSpanWithName = (props) => (
  <span>
    <ProblemTypeIcon {...props} />
    {' '}
    {getProblemTypeName(props.problemType)}
  </span>
);
