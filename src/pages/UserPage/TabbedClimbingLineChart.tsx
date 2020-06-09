import React from 'react';
import {
  Row, FormGroup, ButtonGroup, Button, Label, Input,
} from 'reactstrap';
import { getLevelList } from '../../utils';
import { useLocalStorage } from '../../utils/LocalStorage';
import { ClimbingLineChart } from './ClimbingLineChart';
import { ClimbingAreaChart } from './ClimbingAreaChart';
import { SolvedProblem } from '../../interfaces/SolvedProblem';
import { ProblemLevel } from '../../interfaces/Problem';

const ClimbingChartWrapper = (props: { display: boolean; children: React.ReactNode }) => (
  <div style={{ display: props.display ? '' : 'none' }}>{props.children}</div>
);

export const TabbedClimbingLineChart = (props: {
  climbingData: { dateSecond: number; count: number }[];
  solvedProblems: SolvedProblem[];
}) => {
  const [showMode, setShowMode] = useLocalStorage<'Simple' | 'Colored'>(
    'UserPage_TabbedClimbingLineChart_showMode',
    'Simple',
  );
  const [reverseColorOrder, setReverseColorOrder] = useLocalStorage(
    'UserPage_TabbedClimbingLineChart_reverseColorOrder',
    false,
  );
  const { climbingData, solvedProblems } = props;

  const levelList = getLevelList();
  const mergeCountMap = (
    lastMap: { dateSecond: number; [key: number]: number },
    curMap: Map<ProblemLevel, number>,
  ): { dateSecond: number; [key: number]: number } => {
    const ret = {} as { dateSecond: number; [key: number]: number };
    curMap.forEach((value, key) => {
      ret[key] = (lastMap[key] ?? 0) + value;
    });
    return ret;
  };
  const dailyLevelCountMap = solvedProblems.reduce((map, solvedProblem) => {
    const date = new Date(solvedProblem.Date);
    date.setHours(0, 0, 0, 0);
    const key = Number(date); // sec - (sec % MS_OF_DAY);
    if (!map.has(key)) {
      map.set(
        key,
        levelList.reduce(
          (map, currentLevel) => map.set(currentLevel, 0),
          new Map<ProblemLevel, number>(),
        ),
      );
    }
    const targetDate = map.get(key) as Map<ProblemLevel, number>;
    targetDate.set(solvedProblem.Level, (targetDate.get(solvedProblem.Level) as number) + 1);
    return map;
  }, new Map<number, Map<ProblemLevel, number>>());
  let dailyLevelCount = [] as { dateSecond: number; count: Map<ProblemLevel, number> }[];
  dailyLevelCountMap.forEach((map, key) => {
    dailyLevelCount.push({ dateSecond: key, count: map });
  });
  dailyLevelCount = dailyLevelCount.sort((a, b) => a.dateSecond - b.dateSecond);

  const Levelclimbing = dailyLevelCount.reduce((ar, { dateSecond, count }) => {
    const last = ar[ar.length - 1] ?? ({} as { dateSecond: number; [key: number]: number });
    const ret = mergeCountMap(last, count);
    ret.dateSecond = dateSecond;
    ar.push(ret);
    return ar;
  }, [] as { dateSecond: number; [key: number]: number }[]);

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
        <FormGroup check inline>
          <Label check>
            <Input
              type="checkbox"
              checked={reverseColorOrder}
              onChange={(e) => setReverseColorOrder(e.target.checked)}
              disabled={showMode !== 'Colored'}
            />
            Reverse Color Order
          </Label>
        </FormGroup>
      </Row>
      <ClimbingChartWrapper display={showMode === 'Simple'}>
        <ClimbingLineChart climbingData={climbingData} />
      </ClimbingChartWrapper>
      <ClimbingChartWrapper display={showMode === 'Colored'}>
        <ClimbingAreaChart climbingData={Levelclimbing} reverseColorOrder={reverseColorOrder} />
      </ClimbingChartWrapper>
    </>
  );
};
