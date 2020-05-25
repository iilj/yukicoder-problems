import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';

export const CalendarHeatmap = (props) => {
  const {
    tableData, formatTooltip, onRectClick, getColor, columns, rows,
  } = props;

  const blockWidth = 10;
  const width = blockWidth * columns;
  const height = blockWidth * rows;
  return (
    <div style={{ width: '100%' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%' }}>
        {tableData.map(({ date, count }, i) => {
          const color = getColor(count);
          const week = Math.floor(i / rows);
          const day = i % rows;
          return (
            <rect
              key={date}
              id={`rect-${date}`}
              x={week * blockWidth}
              y={day * blockWidth}
              width={blockWidth}
              height={blockWidth}
              fill={color}
              onClick={() => onRectClick(date)}
            />
          );
        })}
      </svg>

      {tableData.map(({ date, count }) => (
        <UncontrolledTooltip
          delay={{ show: 0, hide: 0 }}
          key={date}
          placement="right"
          target={`rect-${date}`}
        >
          {formatTooltip(date, count)}
        </UncontrolledTooltip>
      ))}
    </div>
  );
};
