import React from 'react';
import { Row } from 'reactstrap';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';
import dataFormat from 'dateformat';

interface Props {
  climbingData: { dateSecond: number; count: number }[];
  syncId: string;
}

export const ClimbingLineChart: React.FC<Props> = (props) => {
  if (props.climbingData.length === 0) return <></>;

  return (
    <Row className="my-3">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={props.climbingData}
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
            tickFormatter={(dateSecond: number) =>
              dataFormat(new Date(dateSecond), 'yyyy/mm/dd')
            }
          />
          <YAxis />
          <Tooltip
            labelFormatter={(dateSecond: number) =>
              dataFormat(new Date(Number(dateSecond)), 'yyyy/mm/dd')
            }
          />
          <Line dataKey="count" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </Row>
  );
};
