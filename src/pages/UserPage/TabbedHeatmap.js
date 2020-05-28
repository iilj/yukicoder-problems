import React, { useState } from 'react';
import { Row, ButtonGroup, Button } from 'reactstrap';
import dataFormat from 'dateformat';
import { CalendarHeatmap } from './CalendarHeatmap';
import { getDifficultyLevelColor } from '../../utils';

const WEEKDAY = 7;
const WEEKS = 53;
const COLORS = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];
const MS_OF_HOUR = 1000 * 60 * 60;
const MS_OF_DAY = MS_OF_HOUR * 24;

export const getNextSunday = (t) => {
  const date = new Date(t);
  const diff = 7 - date.getDay();
  date.setDate(date.getDate() + diff);
  return date;
};

export const getToday = () => {
  // const cur = Number(new Date());
  // return new Date(cur - ((cur + MS_OF_HOUR * 9) % MS_OF_DAY));
  const cur = new Date();
  cur.setHours(0, 0, 0, 0);
  return cur;
};

export const TabbedHeatmap = (props) => {
  const [showMode, setShowMode] = useState('Unique AC');
  const { dailyCountMap, solvedProblems, onRectClick } = props;

  const today = getToday();
  const nextSunday = getNextSunday(today);

  const startDateMiliSec = Number(nextSunday) - WEEKS * WEEKDAY * MS_OF_DAY;

  let tableData;
  let formatTooltip;
  let getColor;
  switch (showMode) {
    case 'Unique AC':
      tableData = [...Array(WEEKS * WEEKDAY).keys()]
        .map((i) => startDateMiliSec + i * MS_OF_DAY)
        .reduce((ar, dateMiliSec) => {
          if (dateMiliSec in dailyCountMap) ar.push({ date: dateMiliSec, count: dailyCountMap[dateMiliSec] });
          else ar.push({ date: dateMiliSec, count: 0 });
          return ar;
        }, [])
        .sort((a, b) => a.date - b.date);
      formatTooltip = (date, count) => (
        <>
          <div>{`${dataFormat(new Date(date), 'yyyy/mm/dd')}`}</div>
          <div>{`${count} unique AC(s)`}</div>
        </>
      );
      getColor = (count) => COLORS[Math.min(count, COLORS.length - 1)];
      break;
    case 'Max Level':
      const dailyMaxLevelMap = solvedProblems.reduce((map, solvedProblem) => {
        const date = new Date(solvedProblem.Date);
        date.setHours(0, 0, 0, 0);
        const key = Number(date); // sec - (sec % MS_OF_DAY);
        if (!(key in map)) {
          map[key] = 0;
        }
        map[key] = Math.max(map[key], solvedProblem.Level);
        return map;
      }, {});
      tableData = [...Array(WEEKS * WEEKDAY).keys()]
        .map((i) => startDateMiliSec + i * MS_OF_DAY)
        .reduce((ar, dateMiliSec) => {
          if (dateMiliSec in dailyMaxLevelMap) ar.push({ date: dateMiliSec, count: dailyMaxLevelMap[dateMiliSec] });
          else ar.push({ date: dateMiliSec, count: -1 });
          return ar;
        }, [])
        .sort((a, b) => a.date - b.date);
      formatTooltip = (date, count) => (
        <>
          <div>{`${dataFormat(new Date(date), 'yyyy/mm/dd')}`}</div>
          <div>{`Max Level: ${count < 0 ? '-' : count}`}</div>
        </>
      );
      getColor = (count) => (count < 0 ? '#ebedf0' : getDifficultyLevelColor(count));

      break;

    default:
      break;
  }
  return (
    <>
      <Row className="my-3">
        <ButtonGroup className="mr-3">
          <Button onClick={() => setShowMode('Unique AC')} active={showMode === 'Unique AC'}>
            Unique AC
          </Button>
          <Button onClick={() => setShowMode('Max Level')} active={showMode === 'Max Level'}>
            Max Level
          </Button>
        </ButtonGroup>
      </Row>
      <Row className="my-5">
        <CalendarHeatmap
          tableData={tableData}
          formatTooltip={formatTooltip}
          onRectClick={onRectClick}
          getColor={getColor}
          columns={WEEKS}
          rows={WEEKDAY}
          today={today}
        />
      </Row>
    </>
  );
};
