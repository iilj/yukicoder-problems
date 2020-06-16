import React from 'react';
import { Row, ButtonGroup, Button } from 'reactstrap';
import { getLevelList, mapToObject } from '../../utils';
import { useLocalStorage } from '../../utils/LocalStorage';
import { DailyEffortBarChart } from './DailyEffortBarChart';
import { DailyEffortStackedBarChart } from './DailyEffortStackedBarChart';
import { SolvedProblem } from '../../interfaces/SolvedProblem';
import { ProblemLevel } from '../../interfaces/Problem';

const DailyEffortBarChartWrapper: React.FC<{
  display: boolean;
}> = (props) => <>{props.display ? props.children : <></>}</>;

interface Props {
  dailyData: { dateSecond: number; count: number }[];
  solvedProblems: SolvedProblem[];
  syncId: string;
}

export const TabbedDailyEffortBarChart: React.FC<Props> = (props) => {
  const [showMode, setShowMode] = useLocalStorage<'Simple' | 'Colored'>(
    'UserPage_TabbedDailyEffortBarChart_showMode',
    'Simple'
  );
  const { dailyData, solvedProblems, syncId } = props;

  const levelList = getLevelList();
  const dailyLevelCountMap = solvedProblems.reduce((map, solvedProblem) => {
    const date = new Date(solvedProblem.Date);
    date.setHours(0, 0, 0, 0);
    const key = Number(date); // sec - (sec % MS_OF_DAY);
    if (!map.has(key)) {
      map.set(
        key,
        levelList.reduce(
          (map, currentLevel) => map.set(currentLevel, 0),
          new Map<ProblemLevel, number>()
        )
      );
    }
    const targetDate = map.get(key) as Map<ProblemLevel, number>;
    targetDate.set(
      solvedProblem.Level,
      (targetDate.get(solvedProblem.Level) as number) + 1
    );
    return map;
  }, new Map<number, Map<ProblemLevel, number>>());
  let dailyLevelCount = [] as { dateSecond: number; [key: number]: number }[];
  dailyLevelCountMap.forEach((map, key) => {
    dailyLevelCount.push({ dateSecond: key, ...mapToObject(map) });
  });
  dailyLevelCount = dailyLevelCount.sort((a, b) => a.dateSecond - b.dateSecond);

  return (
    <>
      <Row className="my-3">
        <ButtonGroup className="mr-3">
          <Button
            onClick={() => setShowMode('Simple')}
            active={showMode === 'Simple'}
          >
            Simple
          </Button>
          <Button
            onClick={() => setShowMode('Colored')}
            active={showMode === 'Colored'}
          >
            Colored
          </Button>
        </ButtonGroup>
      </Row>
      <DailyEffortBarChartWrapper display={showMode === 'Simple'}>
        <DailyEffortBarChart dailyData={dailyData} syncId={syncId} />
      </DailyEffortBarChartWrapper>
      <DailyEffortBarChartWrapper display={showMode === 'Colored'}>
        <DailyEffortStackedBarChart
          dailyData={dailyLevelCount}
          syncId={syncId}
        />
      </DailyEffortBarChartWrapper>
    </>
  );
};
