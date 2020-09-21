import React from 'react';
import { Row, ButtonGroup, Button } from 'reactstrap';
import { DifficultyDetailData } from '../../interfaces/Difficulty';
import { range } from '../../utils';
import { useLocalStorage } from '../../utils/LocalStorage';
import { DifficultyBarChart } from './DifficultyBarChart';
import { DifficultyScatterChart } from './DifficultyScatterChart';

interface Props {
  difficultyDetailData: DifficultyDetailData;
}

const fixFloat = (rating: number): number => {
  if (rating < 400) return 400.0 / Math.exp((400 - rating) / 400.0);
  return rating;
};
const fixFloatInv = (rating: number): number => {
  if (rating < 0.01) rating = 0.01;
  if (rating < 400) return 400.0 * (1.0 - Math.log(400 / rating));
  return rating;
};

const solveProb = (x: number, coef: number, bias: number): number => {
  const solved_prob = x * coef + bias;
  return 1.0 / (1.0 + Math.exp(-solved_prob));
};

interface PlotData {
  x: number;
  y_scatter?: number;
  y_line?: number;
}

export const TabbedDifficultyChart: React.FC<Props> = (props) => {
  const [showMode, setShowMode] = useLocalStorage<'Scatter' | 'Bar'>(
    'ProblemDetailPage_TabbedDifficultyChart_showMode',
    'Scatter'
  );

  const { coef, bias, difficulty, detail } = props.difficultyDetailData;
  if (detail.length === 0) return <div>(Not Avaliable)</div>;

  const scatterData: PlotData[] = detail.map((detailEntry) => {
    return {
      x: fixFloat(detailEntry.inner_rating),
      y_scatter: detailEntry.solved,
    };
  });

  // 左端・右端の（補正後）内部レーティングを決める
  const [mi, ma] = detail.reduce(
    (prev, curr) => {
      return [
        Math.min(prev[0], curr.inner_rating),
        Math.max(prev[1], curr.inner_rating),
      ];
    },
    [difficulty, difficulty]
  );
  const left = Math.floor(fixFloat(mi) / 400) * 400;
  const right = Math.ceil(fixFloat(ma) / 400) * 400;

  const lineData: PlotData[] = range(left, right).map((x) => {
    return {
      x,
      y_line: solveProb(fixFloatInv(x), coef, bias),
      ff: fixFloatInv(x),
    };
  });

  return (
    <>
      <Row className="my-3">
        <ButtonGroup className="mr-3">
          <Button
            onClick={() => setShowMode('Scatter')}
            active={showMode === 'Scatter'}
          >
            Scatter
          </Button>
          <Button
            onClick={() => setShowMode('Bar')}
            active={showMode === 'Bar'}
          >
            Bar
          </Button>
        </ButtonGroup>
      </Row>
      {showMode === 'Scatter' && (
        <DifficultyScatterChart
          left={left}
          right={right}
          difficulty={difficulty}
          scatterData={scatterData}
          lineData={lineData}
        />
      )}
      {showMode === 'Bar' && (
        <DifficultyBarChart
          left={left}
          right={right}
          difficulty={difficulty}
          scatterData={scatterData}
          lineData={lineData}
        />
      )}
    </>
  );
};
