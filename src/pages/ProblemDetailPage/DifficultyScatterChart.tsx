import React from 'react';
import { Row } from 'reactstrap';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import { range } from '../../utils';
import { DifficultyStatisticsDataTooltip } from './DifficultyStatisticsDataTooltip';
import { getRatingColor, getRatingColorCode } from '../../utils/RatingColor';

interface PlotData {
  x: number;
  y_scatter?: number;
  y_line?: number;
}

interface Props {
  left: number;
  right: number;
  difficulty: number;
  scatterData: PlotData[];
  lineData: PlotData[];
}

export const DifficultyScatterChart: React.FC<Props> = (props) => {
  const { left, right, difficulty, scatterData, lineData } = props;

  const ticks = range(left / 400, right / 400).map((x) => 400 * x);
  const data = [...scatterData, ...lineData];

  return (
    <Row className="my-3">
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="x"
            type="number"
            domain={[left, right]}
            allowDecimals={false}
            ticks={ticks}
          />
          <YAxis />
          <Tooltip content={<DifficultyStatisticsDataTooltip />} />

          {ticks.map((x, index) => {
            if (index === ticks.length - 1) return null;
            const color = getRatingColorCode(getRatingColor(x));
            return (
              <ReferenceArea
                key={index}
                x1={x}
                x2={x + 400}
                y1={0}
                y2={1}
                fill={color}
                opacity={0.3}
              />
            );
          })}

          <ReferenceLine x={difficulty} stroke="green" strokeDasharray="3 3" />
          <ReferenceLine y={0.5} stroke="green" strokeDasharray="3 3" />

          <Scatter
            className={'points'}
            dataKey="y_scatter"
            fill="red"
            opacity={0.3}
          />
          <Line dataKey="y_line" stroke="blue" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </Row>
  );
};
