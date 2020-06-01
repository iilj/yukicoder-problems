import React from 'react';
import { Row, ButtonGroup, Button } from 'reactstrap';
import { getLevelList } from '../../utils';
import { useLocalStorage } from '../../utils/LocalStorage';
import { DailyEffortBarChart } from './DailyEffortBarChart';
import { DailyEffortStackedBarChart } from './DailyEffortStackedBarChart';

const DailyEffortBarChartWrapper = (props) => (
  <div style={{ display: props.display ? '' : 'none' }}>{props.children}</div>
);

export const TabbedDailyEffortBarChart = (props) => {
  const [showMode, setShowMode] = useLocalStorage(
    'UserPage_TabbedDailyEffortBarChart_showMode',
    'Simple',
  );
  const { dailyData, solvedProblems } = props;

  const levelList = getLevelList();
  const dailyLevelCountMap = solvedProblems.reduce((map, solvedProblem) => {
    const date = new Date(solvedProblem.Date);
    date.setHours(0, 0, 0, 0);
    const key = Number(date); // sec - (sec % MS_OF_DAY);
    if (!(key in map)) {
      map[key] = levelList.reduce((map, currentLevel) => {
        map[currentLevel] = 0;
        return map;
      }, {});
    }
    map[key][solvedProblem.Level]++;
    return map;
  }, {});
  const dailyLevelCount = Object.keys(dailyLevelCountMap)
    .reduce((ar, key) => {
      const counts = dailyLevelCountMap[key];
      counts.dateSecond = Number(key);
      ar.push(counts);
      return ar;
    }, [])
    .sort((a, b) => a.dateSecond - b.dateSecond);

  return (
    <>
      <Row className="my-3">
        <ButtonGroup className="mr-3">
          <Button onClick={() => setShowMode('Simple')} active={showMode === 'Simple'}>
            Simple
          </Button>
          <Button onClick={() => setShowMode('Colored')} active={showMode === 'Colored'}>
            Colored
          </Button>
        </ButtonGroup>
      </Row>
      <DailyEffortBarChartWrapper display={showMode === 'Simple'}>
        <DailyEffortBarChart dailyData={dailyData} />
      </DailyEffortBarChartWrapper>
      <DailyEffortBarChartWrapper display={showMode === 'Colored'}>
        <DailyEffortStackedBarChart dailyData={dailyLevelCount} />
      </DailyEffortBarChartWrapper>
    </>
  );
};
