import React from 'react';
import { Row, ButtonGroup, Button } from 'reactstrap';
import dataFormat from 'dateformat';
import { CalendarHeatmap } from './CalendarHeatmap';
import { getDifficultyLevelColor } from '../../utils';
import { useLocalStorage } from '../../utils/LocalStorage';
import { ProblemLevel } from '../../interfaces/Problem';
import { SolvedProblem } from '../../interfaces/SolvedProblem';

const WEEKDAY = 7;
const WEEKS = 53;
const COLORS = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];
const MS_OF_HOUR = 1000 * 60 * 60;
const MS_OF_DAY = MS_OF_HOUR * 24;

export const getNextSunday = (t: Date): Date => {
  const date = new Date(t);
  const diff = 7 - date.getDay();
  date.setDate(date.getDate() + diff);
  return date;
};

export const getToday = (): Date => {
  const cur = new Date();
  cur.setHours(0, 0, 0, 0);
  return cur;
};

interface Props {
  dailyCountMap: Map<number, number>;
  solvedProblems: SolvedProblem[];
  onRectClick: (date: number) => void;
}

export const TabbedHeatmap: React.FC<Props> = (props) => {
  const [showMode, setShowMode] = useLocalStorage<'Unique AC' | 'Max Level'>(
    'UserPage_TabbedHeatmap_showMode',
    'Unique AC'
  );
  const { dailyCountMap, solvedProblems, onRectClick } = props;

  const today = getToday();
  const nextSunday = getNextSunday(today);

  const startDateMiliSec = Number(nextSunday) - WEEKS * WEEKDAY * MS_OF_DAY;

  let tableData: { date: number; count: number }[];
  let formatTooltip: (date: number, count: number) => React.ReactNode;
  let getColor: (count: number) => string;
  switch (showMode) {
    case 'Unique AC':
      tableData = Array.from(Array(WEEKS * WEEKDAY).keys())
        .map((i) => startDateMiliSec + i * MS_OF_DAY)
        .reduce((ar, dateMiliSec) => {
          if (dailyCountMap.has(dateMiliSec))
            ar.push({
              date: dateMiliSec,
              count: dailyCountMap.get(dateMiliSec) ?? 0,
            });
          else ar.push({ date: dateMiliSec, count: 0 });
          return ar;
        }, [] as { date: number; count: number }[])
        .sort((a, b) => a.date - b.date);
      formatTooltip = function _formatTooltip(date: number, count: number) {
        return (
          <>
            <div>{`${dataFormat(new Date(date), 'yyyy/mm/dd')}`}</div>
            <div>{`${count} unique AC(s)`}</div>
          </>
        );
      };
      getColor = (count: number) => COLORS[Math.min(count, COLORS.length - 1)];
      break;
    case 'Max Level':
      {
        const dailyMaxLevelMap = solvedProblems.reduce((map, solvedProblem) => {
          const date = new Date(solvedProblem.Date);
          date.setHours(0, 0, 0, 0);
          const key = Number(date); // sec - (sec % MS_OF_DAY);
          if (!map.has(key)) {
            map.set(key, 0);
          }
          map.set(key, Math.max(map.get(key) ?? 0, solvedProblem.Level));
          return map;
        }, new Map<number, number>());
        tableData = Array.from(Array(WEEKS * WEEKDAY).keys())
          .map((i) => startDateMiliSec + i * MS_OF_DAY)
          .reduce((ar, dateMiliSec) => {
            if (dailyMaxLevelMap.has(dateMiliSec))
              ar.push({
                date: dateMiliSec,
                count: dailyMaxLevelMap.get(dateMiliSec) ?? 0,
              });
            else ar.push({ date: dateMiliSec, count: -1 });
            return ar;
          }, [] as { date: number; count: number }[])
          .sort((a, b) => a.date - b.date);
      }
      formatTooltip = function _formatTooltip(date: number, count: number) {
        return (
          <>
            <div>{`${dataFormat(new Date(date), 'yyyy/mm/dd')}`}</div>
            <div>{`Max Level: ${count < 0 ? '-' : count}`}</div>
          </>
        );
      };
      getColor = (count: number) =>
        count < 0 ? '#ebedf0' : getDifficultyLevelColor(count as ProblemLevel);

      break;

    // default:
    //   tableData = [];
    //   formatTooltip = () => null;
    //   getColor = () => "";
    //   break;
  }
  return (
    <>
      <Row className="my-3">
        <ButtonGroup className="mr-3">
          <Button
            onClick={() => setShowMode('Unique AC')}
            active={showMode === 'Unique AC'}
          >
            Unique AC
          </Button>
          <Button
            onClick={() => setShowMode('Max Level')}
            active={showMode === 'Max Level'}
          >
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
