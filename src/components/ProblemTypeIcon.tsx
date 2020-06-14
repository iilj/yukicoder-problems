import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getProblemTypeName } from '../utils';
import { ProblemType } from '../interfaces/Problem';

interface ProblemTypeIconProps {
  problemType: ProblemType;
}

export const ProblemTypeIcon = (props: ProblemTypeIconProps): JSX.Element => {
  const { problemType } = props;
  if (!problemType) return <></>;

  switch (problemType) {
    case ProblemType.Educational:
      return (
        <FontAwesomeIcon
          title={getProblemTypeName(problemType)}
          icon="school"
        />
      );
    case ProblemType.Scoring:
      return (
        <FontAwesomeIcon
          title={getProblemTypeName(problemType)}
          icon="calculator"
        />
      );
    case ProblemType.Joke:
      return (
        <FontAwesomeIcon
          title={getProblemTypeName(problemType)}
          icon="laugh-beam"
        />
      );
    default:
      return <></>;
  }
};

export const ProblemTypeIconAbsoluteSpan = (
  props: ProblemTypeIconProps
): JSX.Element => (
  <span className="table-problem-type-icon">
    <ProblemTypeIcon {...props} />
  </span>
);

export const ProblemTypeIconSpanWithName = (
  props: ProblemTypeIconProps
): JSX.Element => (
  <span>
    <ProblemTypeIcon {...props} /> {getProblemTypeName(props.problemType)}
  </span>
);
