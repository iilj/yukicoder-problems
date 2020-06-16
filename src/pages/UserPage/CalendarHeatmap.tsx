import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';

const month_names_short = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const day_names_short = ['Mon', 'Wed', 'Fri'];

interface Props {
  tableData: { date: number; count: number }[];
  formatTooltip: (date: number, count: number) => React.ReactNode;
  onRectClick: (date: number) => void;
  getColor: (count: number) => string;
  columns: number;
  rows: number;
  today: Date;
}

export const CalendarHeatmap: React.FC<Props> = (props) => {
  const {
    tableData,
    formatTooltip,
    onRectClick,
    getColor,
    columns,
    rows,
    today,
  } = props;

  const blockWidth = 10;
  const xOffset = blockWidth * 1.6;
  const yOffset = blockWidth;
  const width = xOffset + blockWidth * columns + blockWidth * 0.5;
  const height = yOffset + blockWidth * rows;

  return (
    <div style={{ width: '100%' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%' }}>
        {day_names_short.map((day_name, i) => (
          <text
            key={day_name}
            x={0}
            y={yOffset * 0.7 + (2 * i + 2) * blockWidth}
            fill="gray"
            fontSize={7}
          >
            {day_name}
          </text>
        ))}
        {tableData.map(({ date }, i) => {
          if (new Date(date) > today) return null;
          const week = Math.floor(i / rows);
          const day = i % rows;
          const d = new Date(date);
          if (day === 0 && d.getDate() <= 7) {
            return (
              <text
                key={`text-${date}`}
                x={xOffset + week * blockWidth}
                y={yOffset * 0.7}
                fill="gray"
                fontSize={7}
              >
                {month_names_short[d.getMonth()]}
              </text>
            );
          }
          return null;
        })}
        {tableData.map(({ date, count }, i) => {
          if (new Date(date) > today) return null;
          const color = getColor(count);
          const week = Math.floor(i / rows);
          const day = i % rows;
          return (
            <rect
              key={date}
              id={`rect-${date}`}
              x={xOffset + week * blockWidth}
              y={yOffset + day * blockWidth}
              width={blockWidth * 0.95}
              height={blockWidth * 0.95}
              fill={color}
              onClick={() => onRectClick(date)}
            />
          );
        })}
      </svg>

      {tableData.map(({ date, count }) =>
        new Date(date) > today ? null : (
          <UncontrolledTooltip
            delay={{ show: 0, hide: 0 }}
            key={date}
            placement="right"
            target={`rect-${date}`}
          >
            {formatTooltip(date, count)}
          </UncontrolledTooltip>
        )
      )}
    </div>
  );
};
