import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getProblemTypeName } from '../utils';
import { ProblemType } from '../interfaces/Problem';

interface ProblemTypeIconProps {
  problemType: ProblemType;
}

export const ProblemTypeIcon: React.FC<ProblemTypeIconProps> = (props) => {
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
    case ProblemType.Unproved:
      return (
        <FontAwesomeIcon
          title={getProblemTypeName(problemType)}
          icon="exclamation-triangle"
        />
      );
    default:
      return <></>;
  }
};

export const ProblemTypeIconAbsoluteSpan: React.FC<ProblemTypeIconProps> = (
  props
) => (
  <span className="table-problem-type-icon">
    <ProblemTypeIcon {...props} />
  </span>
);

export const ProblemTypeIconSpanWithName: React.FC<ProblemTypeIconProps> = (
  props
) => (
  <span>
    <ProblemTypeIcon {...props} /> {getProblemTypeName(props.problemType)}
  </span>
);
