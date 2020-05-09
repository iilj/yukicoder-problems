import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';

const WEEKDAY = 7;
const WEEKS = 53;
const COLORS = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];
const MS_OF_DAY = 1000 * 60 * 60 * 24;

export const getNextSunday = (t) => {
  const date = new Date(t);
  const diff = 7 - date.getDay();
  date.setDate(date.getDate() + diff);
  return date;
};

export const getToday = () => {
  const cur = Number(new Date());
  return new Date(cur - (cur % MS_OF_DAY));
};

export const CalendarHeatmap = (props) => {
  const { dailyCountMap, formatTooltip, onRectClick } = props;

  const today = getToday();
  const nextSunday = getNextSunday(today);

  const startDateMiliSec = Number(nextSunday) - WEEKS * WEEKDAY * MS_OF_DAY;

  const tableData = [...Array(WEEKS * WEEKDAY).keys()]
    .map((i) => startDateMiliSec + i * MS_OF_DAY)
    .reduce((ar, dateMiliSec) => {
      if (dateMiliSec in dailyCountMap) ar.push({ date: dateMiliSec, count: dailyCountMap[dateMiliSec] });
      else ar.push({ date: dateMiliSec, count: 0 });
      return ar;
    }, [])
    .sort((a, b) => a.date - b.date);

  const blockWidth = 10;
  const width = blockWidth * WEEKS;
  const height = blockWidth * WEEKDAY;
  return (
    <div style={{ width: '100%' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%' }}>
        {tableData.map(({ date, count }, i) => {
          const color = COLORS[Math.min(count, COLORS.length - 1)];
          const week = Math.floor(i / WEEKDAY);
          const day = i % WEEKDAY;
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
