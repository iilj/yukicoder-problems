import React from 'react';
import { Row, ButtonGroup, Button } from 'reactstrap';
import { getLevelList } from '../../utils';
import { useLocalStorage } from '../../utils/LocalStorage';
import { ClimbingLineChart } from './ClimbingLineChart';
import { ClimbingAreaChart } from './ClimbingAreaChart';

const ClimbingChartWrapper = (props) => (
  <div style={{ display: props.display ? '' : 'none' }}>{props.children}</div>
);

export const TabbedClimbingLineChart = (props) => {
  const [showMode, setShowMode] = useLocalStorage(
    'UserPage_TabbedClimbingLineChart_showMode',
    'Simple',
  );
  const { climbingData, solvedProblems } = props;

  const levelList = getLevelList();
  const mergeCountMap = (lastMap, curMap) => Object.keys(curMap).reduce((map, key) => {
    map[key] = lastMap[key] + curMap[key];
    return map;
  }, {});
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
      ar.push({ dateSecond: Number(key), count: dailyLevelCountMap[key] });
      return ar;
    }, [])
    .sort((a, b) => a.dateSecond - b.dateSecond);
  const Levelclimbing = dailyLevelCount.reduce((ar, { dateSecond, count }) => {
    const last = ar[ar.length - 1];
    if (last) count = mergeCountMap(last, count);
    count.dateSecond = dateSecond;
    ar.push(count);
    return ar;
  }, []);

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
      <ClimbingChartWrapper display={showMode === 'Simple'}>
        <ClimbingLineChart climbingData={climbingData} />
      </ClimbingChartWrapper>
      <ClimbingChartWrapper display={showMode === 'Colored'}>
        <ClimbingAreaChart climbingData={Levelclimbing} />
      </ClimbingChartWrapper>
    </>
  );
};
