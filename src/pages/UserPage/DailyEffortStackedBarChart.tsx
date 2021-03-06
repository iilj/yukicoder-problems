import React from 'react';
import { Row } from 'reactstrap';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import dataFormat from 'dateformat';
import { DailyEffortTooltip } from './DailyEffortTooltip';
import { DifficultyStarsFillDefs } from '../../components/DifficultyStars';
import { getLevelList, getDifficultyLevelColor } from '../../utils';

interface Props {
  dailyData: { dateSecond: number; [key: number]: number }[];
  syncId: string;
}

export const DailyEffortStackedBarChart: React.FC<Props> = (props) => {
  if (props.dailyData.length === 0) return <></>;

  return (
    <Row className="my-3">
      <DifficultyStarsFillDefs />
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={props.dailyData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          syncId={props.syncId}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="dateSecond"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(dateSecond) =>
              dataFormat(new Date(dateSecond), 'yyyy/mm/dd')
            }
          />
          <YAxis />
          <Tooltip content={<DailyEffortTooltip />} />
          {getLevelList().map((level) => {
            const color = getDifficultyLevelColor(level);
            return (
              <Bar
                type="monotone"
                dataKey={level}
                key={level}
                stackId="1"
                stroke={color}
                fill={color}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </Row>
  );
};
