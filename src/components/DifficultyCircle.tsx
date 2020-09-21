import React, { useState } from 'react';
import { Badge, Tooltip } from 'reactstrap';
import { Difficulty } from '../interfaces/Difficulty';
import { getRatingColor } from '../utils/RatingColor';
import { TopcoderLikeCircle } from './TopcoderLikeCircle';
import './DifficultyCircle.css';

interface Props {
  id?: string;
  difficulty?: Difficulty;
}

function getColor(difficulty: Difficulty) {
  if (difficulty < 3200) {
    return getRatingColor(difficulty);
  } else if (difficulty < 3600) {
    return 'Bronze';
  } else if (difficulty < 4000) {
    return 'Silver';
  } else {
    return 'Gold';
  }
}

export const DifficultyCircle: React.FC<Props> = (props) => {
  const { id, difficulty } = props;
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggleTooltipState = (): void => setTooltipOpen(!tooltipOpen);
  const circleId = `DifficultyCircle-${id ?? ''}`;
  if (difficulty === undefined || difficulty < 0) {
    return (
      <span>
        <Badge
          className="difficulty-unavailable-circle"
          color="info"
          id={circleId}
          pill
        >
          ?
        </Badge>
        <Tooltip
          placement="top"
          target={circleId}
          isOpen={tooltipOpen}
          toggle={toggleTooltipState}
        >
          Difficulty is unavailable.
        </Tooltip>
      </span>
    );
  }
  const color = getColor(difficulty);

  return (
    <>
      <TopcoderLikeCircle
        color={color}
        rating={difficulty}
        className="difficulty-circle"
        id={circleId}
      />
      <Tooltip
        placement="top"
        target={circleId}
        isOpen={tooltipOpen}
        toggle={toggleTooltipState}
      >
        {`Difficulty: ${difficulty}`}
      </Tooltip>
    </>
  );
};
