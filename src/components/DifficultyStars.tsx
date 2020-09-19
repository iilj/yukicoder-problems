import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getDifficultyLevelColor } from '../utils';
import { ProblemLevel } from '../interfaces/Problem';

export const DifficultyStarsFillDefs: React.FC = () => (
  <svg style={{ height: 0 }}>
    <defs>
      <linearGradient id="ggold">
        <stop offset="0" stopColor="#cca11f" />
        <stop offset="0.5" stopColor="#fff93f" />
        <stop offset="1" stopColor="#cca11f" />
      </linearGradient>
      <linearGradient id="gsilver">
        <stop offset="0.1" stopColor="#808080" />
        <stop offset="0.5" stopColor="#f5f5f5" />
        <stop offset="0.9" stopColor="#808080" />
      </linearGradient>
      <linearGradient id="gbronze">
        <stop offset="0.2" stopColor="#965c2c" />
        <stop offset="0.5" stopColor="#ffdabd" />
        <stop offset="0.8" stopColor="#965c2c" />
      </linearGradient>
    </defs>
  </svg>
);

interface DifficultyStarsProps {
  level: ProblemLevel;
  showDifficultyLevel: boolean;
  color: boolean;
}

export const DifficultyStars: React.FC<DifficultyStarsProps> = (props) => {
  const { level, showDifficultyLevel } = props;
  if (!showDifficultyLevel) return <></>;

  const half = level % 1;
  const full = level - half;

  const stars = [] as [number, number][];
  for (let i = 0; i < full; ++i) {
    stars.push([i, 1]);
  }
  if (half > 0) {
    stars.push([full, half]);
  }

  const color = props.color ? getDifficultyLevelColor(level) : '#808080';
  const style = { color };
  const className =
    !props.color || level <= 4.5
      ? 'star-normal'
      : level <= 5
      ? 'star-bronze'
      : level <= 5.5
      ? 'star-silver'
      : 'star-gold';
  return (
    <>
      {stars.map((s) =>
        s[1] === 1 ? (
          <FontAwesomeIcon
            icon="star"
            key={s[0]}
            style={style}
            className={className}
          />
        ) : (
          <FontAwesomeIcon
            icon="star-half"
            key={s[0]}
            style={style}
            className={className}
          />
        )
      )}
    </>
  );
};

export const DifficultyStarsAbsoluteSpan: React.FC<DifficultyStarsProps> = (
  props
) => (
  <span className="table-problem-stars">
    <DifficultyStars {...props} />
  </span>
);

interface NormalStarElementProps {
  className?: string;
  color?: string;
}

export const NormalStarElement: React.FC<NormalStarElementProps> = (props) => (
  <FontAwesomeIcon icon="star" {...props} />
);
