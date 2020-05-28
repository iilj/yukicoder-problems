import React from 'react';
import { Row } from 'reactstrap';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts';
import dataFormat from 'dateformat';
import { DailyEffortTooltip } from './DailyEffortTooltip';
import { DifficultyStarsFillDefs } from '../../components/DifficultyStars';
import { getLevelList, getDifficultyLevelColor } from '../../utils';

export const ClimbingAreaChart = (props) => {
  if (props.climbingData.length === 0) return null;

  return (
    <Row className="my-3">
      <DifficultyStarsFillDefs />
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={props.climbingData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="dateSecond"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(dateSecond) => dataFormat(new Date(dateSecond), 'yyyy/mm/dd')}
          />
          <YAxis />
          <Tooltip content={<DailyEffortTooltip />} />

          {getLevelList().map((level) => {
            const color = getDifficultyLevelColor(level);
            return (
              <Area
                type="monotone"
                dataKey={level}
                key={level}
                stackId="1"
                stroke={color}
                fill={color}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </Row>
  );
};
