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

export const DifficultyBarChart: React.FC<Props> = (props) => {
  const { left, right, difficulty, scatterData, lineData } = props;
  const ticks = range(left / 400, right / 400).map((x) => 400 * x);

  const width = 100;
  const barDataMap = scatterData.reduce((prev, cur) => {
    const key = Math.floor(cur.x / width) * width;
    let [succeeded, failed] = prev.get(key) ?? [0, 0];
    if (cur.y_scatter === 0.0) failed++;
    else succeeded++;
    return prev.set(key, [succeeded, failed]);
  }, new Map<number, [number, number]>());
  const barData = [] as [number, number][]; // 最小内部レート，正答率
  barDataMap.forEach((value, key) => {
    const [succeeded, failed] = value;
    barData.push([key, succeeded / (succeeded + failed)]);
  });

  return (
    <Row className="my-3">
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={lineData}
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
          <YAxis domain={[0, 1]} />
          <Tooltip content={<DifficultyStatisticsDataTooltip />} />

          {barData.map((data) => {
            const [x, prob] = data;
            const color = getRatingColorCode(getRatingColor(x));
            return (
              <ReferenceArea
                key={`${x}_succeeded`}
                x1={x}
                x2={x + width}
                y1={0}
                y2={prob}
                fill={color}
                opacity={0.6}
              />
            );
          })}

          {barData.map((data) => {
            const [x, prob] = data;
            return (
              <ReferenceArea
                key={`${x}_failed`}
                x1={x}
                x2={x + width}
                y1={prob}
                y2={1}
                fill={'#000000'}
                opacity={0.3}
              />
            );
          })}

          <ReferenceLine x={difficulty} stroke="green" strokeDasharray="3 3" />
          <ReferenceLine y={0.5} stroke="green" strokeDasharray="3 3" />

          <Line dataKey="y_line" stroke="blue" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </Row>
  );
};
