import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getDifficultyLevelColor } from '../utils';

export const DifficultyStarsFillDefs = () => (
  <svg style={{ height: 0 }}>
    <defs>
      <linearGradient id="ggold">
        <stop offset="0" stopColor="#ffd700" />
        <stop offset="0.5" stopColor="#ffff00" />
        <stop offset="1" stopColor="#ffd700" />
      </linearGradient>
      <linearGradient id="gsilver">
        <stop offset="0.1" stopColor="#808080" />
        <stop offset="0.5" stopColor="#e0e0e0" />
        <stop offset="0.9" stopColor="#808080" />
      </linearGradient>
      <linearGradient id="gbronze">
        <stop offset="0.2" stopColor="#725a36" />
        <stop offset="0.5" stopColor="#eebb00" />
        <stop offset="0.8" stopColor="#725a36" />
      </linearGradient>
    </defs>
  </svg>
);

export const DifficultyStars = (props) => {
  const { level, showDifficultyLevel } = props;
  if (!showDifficultyLevel) return null;

  const half = level % 1;
  const full = level - half;

  const stars = [];
  for (let i = 0; i < full; ++i) {
    stars.push([i, 1]);
  }
  if (half > 0) {
    stars.push([full, half]);
  }

  const color = getDifficultyLevelColor(level);
  const style = { color };
  const className = level <= 4.5
    ? 'star-normal'
    : level <= 5
      ? 'star-bronze'
      : level <= 5.5
        ? 'star-silver'
        : 'star-gold';
  return (
    <>
      {stars.map((s) => (s[1] === 1 ? (
        <FontAwesomeIcon icon="star" key={s[0]} style={style} className={className} />
      ) : (
        <FontAwesomeIcon icon="star-half" key={s[0]} style={style} className={className} />
      )))}
    </>
  );
};

export const DifficultyStarsAbsoluteSpan = (props) => (
  <span className="table-problem-stars">
    <DifficultyStars {...props} />
  </span>
);
